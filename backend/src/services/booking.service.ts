import crypto from "crypto";
import bookingRepository from "../repositories/booking.repository";
import { IBooking } from "../models/booking.model";
import { IBookingService } from "./interfaces/IBookingService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import razorpayInstance from "../utils/razorpay";
import mongoose from "mongoose";
import blockedDateRepository from "../repositories/blockedDate.repository";

class BookingService implements IBookingService {
  async createBooking(
    userId: string,
    venueId: string,
    bookingData: { startDate: Date; endDate: Date; totalPrice: number }
  ): Promise<{
    message: string;
    status: number;
    booking: IBooking;
    razorpayOrder: any;
  }> {
    const conflictBooking = await bookingRepository.findOne({
      venue: venueId,
      startDate: { $lt: bookingData.endDate },
      endDate: { $gt: bookingData.startDate },
      status: { $ne: "cancelled" },
    });
    if (conflictBooking) {
      throw new Error("The venue is already booked for the selected dates.");
    }

    const advancePercentage = 20;
    const advanceAmount = (bookingData.totalPrice * advancePercentage) / 100;
    const balanceDue = bookingData.totalPrice - advanceAmount;
    const data = {
      user: new mongoose.Types.ObjectId(userId),
      venue: new mongoose.Types.ObjectId(venueId),
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalPrice: bookingData.totalPrice,
      advanceAmount,
      balanceDue,
      advancePaid: false,
      status: "pending" as "pending",
    };
    const booking = await bookingRepository.create(data);
    if (!booking) {
      throw new Error("Failed to create booking");
    }
    const options = {
      amount: Math.round(advanceAmount * 100),
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };
    const order = await razorpayInstance.orders.create(options);
    booking.razorpayOrderId = order.id;
    await bookingRepository.update(booking._id.toString(), booking);
    return {
      message: MESSAGES.SUCCESS.BOOKING_CREATED,
      status: STATUS_CODES.CREATED,
      booking,
      razorpayOrder: order,
    };
  }
  async verifyPayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ message: string; status: number; booking: IBooking }> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    const orderId = booking.razorpayOrderId;
    if (!orderId) {
      throw new Error("Order Id is missing");
    }
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(orderId + "|" + paymentId)
      .digest("hex");
    if (generatedSignature != razorpaySignature) {
      throw new Error("Payment signature verification failed");
    }

    booking.status = "advance_paid" as any;
    booking.advancePaid = true;
    booking.paymentId = paymentId;
    const updatedBooking = await bookingRepository.update(bookingId, booking);
    if (!updatedBooking) {
      throw new Error("Failed to update booking after payment");
    }
    return {
      message: MESSAGES.SUCCESS.PAYMENT_VERIFIED,
      status: STATUS_CODES.OK,
      booking: updatedBooking,
    };
  }
  async createBalancePaymentOrder(bookingId: string): Promise<{
    message: string;
    status: number;
    booking: IBooking;
    razorpayOrder: any;
  }> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    if (booking.status !== "advance_paid") {
      throw new Error(
        "Advance payment not completed. Balance payment cannot be initiated."
      );
    }
    const options = {
      amount: Math.round(booking.balanceDue * 100),
      currency: "INR",
      receipt: `receipt_balance_${booking._id}`,
    };
    const order = await razorpayInstance.orders.create(options);
    booking.razorpayBalanceOrderId = order.id;
    booking.status = "balance_pending" as any;
    await bookingRepository.update(booking._id.toString(), booking);
    return {
      message: "Balance payment order created successfully",
      status: STATUS_CODES.OK,
      booking,
      razorpayOrder: order,
    };
  }
  async verifyBalancePayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ message: string; status: number; booking: IBooking }> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    if (booking.status !== "balance_pending") {
      throw new Error("Balance payment not initiated or already processed");
    }
    const orderId = booking.razorpayBalanceOrderId;
    if (!orderId) {
      throw new Error("Balance order Id is missing");
    }
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET?.trim() || "")
      .update(orderId + "|" + paymentId)
      .digest("hex");
    if (generatedSignature != razorpaySignature) {
      throw new Error("Balance payment signature verification failed");
    }

    const commissionPercentage = 5;
    const commissionAmount = booking.totalPrice * (commissionPercentage / 100);
    const vendorReceives = booking.totalPrice - commissionAmount;

    booking.commissionAmount = commissionAmount;
    booking.vendorReceives = vendorReceives;

    booking.balanceDue = 0;
    booking.status = "fully_paid" as any;
    booking.balancePaymentId = paymentId;
    const updatedBooking = await bookingRepository.update(bookingId, booking);
    if (!updatedBooking) {
      throw new Error("Failed to update booking after balance payment");
    }
    return {
      message: "Balance payment verified successfully",
      status: STATUS_CODES.OK,
      booking: updatedBooking,
    };
  }
  async getBookingById(
    bookingId: string
  ): Promise<{ message: string; status: number; booking: IBooking }> {
    const booking = await bookingRepository.findByIdPopulated(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    return {
      message: MESSAGES.SUCCESS.BOOKING_FETCHED,
      status: STATUS_CODES.OK,
      booking,
    };
  }
  async getBookingsByUserId(
    userId: string
  ): Promise<{ message: string; status: number; bookings: IBooking[] }> {
    const bookings = await bookingRepository.findByUser(userId);
    if (!bookings) {
      throw new Error("No bookings found for this user");
    }
    return {
      message: MESSAGES.SUCCESS.BOOKING_FETCHED,
      status: STATUS_CODES.OK,
      bookings,
    };
  }
  async getBookedDatesForVenue(
    venueId: string
  ): Promise<{ startDate: Date; endDate: Date }[]> {
    const bookings = await bookingRepository.findByVenue(venueId);
    const onlineDates = bookings.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));
    const blockedDates = await blockedDateRepository.findBlockedDatesByVenue(
      venueId
    );
    const offlineDates = blockedDates.map((block) => ({
      startDate: block.startDate,
      endDate: block.endDate,
    }));

    return [...onlineDates, ...offlineDates];
  }
  async addBlockedDateForVenue(
    venueId: string,
    data: { startDate: Date; endDate: Date; reason?: string }
  ): Promise<{ message: string; blockedDate: any }> {
    const blockedDate = await blockedDateRepository.createBlockedDate({
      venue: venueId,
      ...data,
    });
    return {
      message: MESSAGES.SUCCESS.BLOCKED_DATE_ADDED,
      blockedDate,
    };
  }
  async getBookingsByVendorId(
    vendorId: string
  ): Promise<{ message: string; status: number; bookings: IBooking[] }> {
    const bookings = await bookingRepository.findByVendor(vendorId);
    if (!bookings) {
      throw new Error("No bookings found");
    }
    return {
      message: MESSAGES.SUCCESS.BOOKING_FETCHED,
      status: STATUS_CODES.OK,
      bookings,
    };
  }
  async getAllBookings(): Promise<{
    message: string;
    status: number;
    bookings: IBooking[];
  }> {
    const bookings = await bookingRepository.findAll();
    if (!bookings || bookings.length === 0) {
      throw new Error("No bookings found");
    }
    return {
      message: MESSAGES.SUCCESS.BOOKING_FETCHED,
      status: STATUS_CODES.OK,
      bookings,
    };
  }
}

export default new BookingService();
