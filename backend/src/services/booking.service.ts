import crypto from "crypto";
import bookingRepository from "../repositories/booking.repository";
import { IBooking } from "../models/booking.model";
import { IBookingService } from "./interfaces/IBookingService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import razorpayInstance from "../utils/razorpay";
import mongoose from "mongoose";

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

    booking.status = "confirmed" as "confirmed";
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
  async getBookingById(
    bookingId: string
  ): Promise<{ message: string; status: number; booking: IBooking }> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    return {
      message: MESSAGES.SUCCESS.BOOKING_FETCHED,
      status: STATUS_CODES.OK,
      booking,
    };
  }
}

export default new BookingService();
