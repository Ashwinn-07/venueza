import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { IBookingService } from "./interfaces/IBookingService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import razorpayInstance from "../utils/razorpay";
import { issueRefund } from "../utils/issueRefund";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IBlockedDateRepository } from "../repositories/interfaces/IBlockedDateRepository";
import { TOKENS } from "../config/tokens";
import { BookingMapper } from "../mappers/booking.mapper";
import {
  CreateBookingResponseDto,
  VerifyPaymentResponseDto,
  BookingsListResponseDto,
  BookingResponseDto,
  BookedDatesResponseDto,
  AddBlockedDateResponseDto,
  RevenueResponseDto,
  DashboardDataResponseDto,
  TransactionHistoryResponseDto,
} from "../dto/booking.dto";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TOKENS.IBookingRepository) private bookingRepo: IBookingRepository,
    @inject(TOKENS.IBlockedDateRepository)
    private blockedDateRepo: IBlockedDateRepository
  ) {}

  async createBooking(
    userId: string,
    venueId: string,
    bookingData: { startDate: Date; endDate: Date; totalPrice: number }
  ): Promise<{
    response: CreateBookingResponseDto;
    status: number;
  }> {
    const conflictBooking = await this.bookingRepo.findOne({
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
    const booking = await this.bookingRepo.create(data);
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
    const updatedBooking = await this.bookingRepo.update(
      booking._id.toString(),
      booking
    );

    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_CREATED,
        booking: BookingMapper.toResponseDto(updatedBooking!),
        razorpayOrder: order,
      },
      status: STATUS_CODES.CREATED,
    };
  }

  async verifyPayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }> {
    const booking = await this.bookingRepo.findById(bookingId);

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
    const updatedBooking = await this.bookingRepo.update(bookingId, booking);
    console.log(updatedBooking);
    if (!updatedBooking) {
      throw new Error("Failed to update booking after payment");
    }
    return {
      response: {
        message: MESSAGES.SUCCESS.PAYMENT_VERIFIED,
        booking: BookingMapper.toResponseDto(updatedBooking),
      },
      status: STATUS_CODES.OK,
    };
  }

  async createBalancePaymentOrder(bookingId: string): Promise<{
    response: CreateBookingResponseDto;
    status: number;
  }> {
    const booking = await this.bookingRepo.findById(bookingId);
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
    const updatedBooking = await this.bookingRepo.update(
      booking._id.toString(),
      booking
    );

    return {
      response: {
        message: "Balance payment order created successfully",
        booking: BookingMapper.toResponseDto(updatedBooking!),
        razorpayOrder: order,
      },
      status: STATUS_CODES.OK,
    };
  }

  async verifyBalancePayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }> {
    const booking = await this.bookingRepo.findById(bookingId);
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
    const updatedBooking = await this.bookingRepo.update(bookingId, booking);
    if (!updatedBooking) {
      throw new Error("Failed to update booking after balance payment");
    }
    return {
      response: {
        message: "Balance payment verified successfully",
        booking: BookingMapper.toResponseDto(updatedBooking),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getBookingById(
    bookingId: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }> {
    const booking = await this.bookingRepo.findByIdPopulated(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_FETCHED,
        booking: BookingMapper.toResponseDto(booking),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getBookingsByUserId(
    userId: string,
    filterType: string = "all"
  ): Promise<{ response: BookingsListResponseDto; status: number }> {
    const allBookings = await this.bookingRepo.findByUser(userId);

    if (!allBookings || allBookings.length === 0) {
      return {
        response: {
          message: "No bookings found for this user",
          bookings: [],
        },
        status: STATUS_CODES.OK,
      };
    }

    const nonPendingBookings = allBookings.filter(
      (booking) => booking.status !== "pending"
    );

    let filteredBookings;
    const now = new Date();

    switch (filterType) {
      case "upcoming":
        filteredBookings = nonPendingBookings.filter(
          (booking) => new Date(booking.endDate) > now
        );
        break;
      case "past":
        filteredBookings = nonPendingBookings.filter(
          (booking) => new Date(booking.endDate) <= now
        );
        break;
      case "all":
      default:
        filteredBookings = nonPendingBookings;
        break;
    }

    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_FETCHED,
        bookings: filteredBookings.map((booking) =>
          BookingMapper.toResponseDto(booking)
        ),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getBookedDatesForVenue(
    venueId: string
  ): Promise<BookedDatesResponseDto[]> {
    const bookings = await this.bookingRepo.findByVenue(venueId);
    const onlineDates = bookings.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));
    const blockedDates = await this.blockedDateRepo.findBlockedDatesByVenue(
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
  ): Promise<AddBlockedDateResponseDto> {
    const blockedDate = await this.blockedDateRepo.createBlockedDate({
      venue: venueId,
      ...data,
    });
    return {
      message: MESSAGES.SUCCESS.BLOCKED_DATE_ADDED,
      blockedDate,
    };
  }

  async getBookingsByVendorId(
    vendorId: string,
    filter: string = "all"
  ): Promise<{ response: BookingsListResponseDto; status: number }> {
    let bookings = await this.bookingRepo.findByVendor(vendorId);
    if (!bookings) {
      throw new Error("No bookings found");
    }
    bookings = bookings.filter((booking) => booking.status !== "pending");
    if (filter !== "all") {
      if (filter === "advance_paid") {
        bookings = bookings.filter(
          (booking) => booking.status === "advance_paid"
        );
      } else if (filter === "balance_pending") {
        bookings = bookings.filter(
          (booking) => booking.status === "balance_pending"
        );
      } else if (filter === "fully_paid") {
        bookings = bookings.filter(
          (booking) => booking.status === "fully_paid"
        );
      } else if (filter === "cancelled") {
        bookings = bookings.filter(
          (booking) =>
            booking.status === "cancelled_by_user" ||
            booking.status === "cancelled_by_vendor"
        );
      }
    }
    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_FETCHED,
        bookings: bookings.map((booking) =>
          BookingMapper.toResponseDto(booking)
        ),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getAllBookings(search = ""): Promise<{
    response: BookingsListResponseDto;
    status: number;
  }> {
    const bookings = await this.bookingRepo.findAllWithSearch(search);
    if (!bookings || bookings.length === 0) {
      return {
        response: {
          message: search
            ? "No bookings found matching your search"
            : "No bookings found",
          bookings: [],
        },
        status: STATUS_CODES.OK,
      };
    }
    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_FETCHED,
        bookings: bookings.map((booking) =>
          BookingMapper.toResponseDto(booking)
        ),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getAdminRevenue(): Promise<{
    response: { message: string; revenue: RevenueResponseDto[] };
    status: number;
  }> {
    const revenue = await this.bookingRepo.getTotalCommission();
    return {
      response: {
        message: MESSAGES.SUCCESS.REVENUE_FETCHED,
        revenue: BookingMapper.toRevenueResponse(revenue),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getVendorRevenue(vendorId: string): Promise<{
    response: { message: string; revenue: RevenueResponseDto[] };
    status: number;
  }> {
    const revenue = await this.bookingRepo.getVendorRevenue(vendorId);
    return {
      response: {
        message: MESSAGES.SUCCESS.REVENUE_FETCHED,
        revenue: BookingMapper.toRevenueResponse(revenue),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getDashboardDataForVendor(vendorId: string): Promise<{
    response: { message: string; dashboardData: DashboardDataResponseDto };
    status: number;
  }> {
    const bookings = await this.bookingRepo.findByVendor(vendorId);
    const totalBookings = bookings.length;
    const vendorRevenue = bookings.reduce((sum: any, booking: any) => {
      return sum + (booking.vendorReceives || 0);
    }, 0);
    const now = new Date();
    const upcomingBookings = bookings.filter(
      (booking: any) => new Date(booking.startDate) > now
    ).length;
    const monthlyRevenue = await this.bookingRepo.getVendorRevenue(vendorId);

    const dashboardData = {
      totalBookings,
      vendorRevenue,
      upcomingBookings,
      monthlyRevenue: BookingMapper.toRevenueResponse(monthlyRevenue),
    };

    return {
      response: {
        message: "Vendor dashboard data fetched successfully",
        dashboardData: BookingMapper.toDashboardResponse(dashboardData),
      },
      status: STATUS_CODES.OK,
    };
  }

  async cancelBookingByUser(
    bookingId: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    if (booking.status !== "advance_paid" && booking.status !== "pending") {
      throw new Error("Booking cannot be cancelled at this stage");
    }
    booking.status = "cancelled_by_user" as any;
    const updatedBooking = await this.bookingRepo.update(bookingId, booking);
    if (!updatedBooking) {
      throw new Error("Bookings status update failed");
    }
    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_CANCELLED,
        booking: BookingMapper.toResponseDto(updatedBooking),
      },
      status: STATUS_CODES.OK,
    };
  }

  async cancelBookingByVendor(
    bookingId: string,
    cancellationReason: string
  ): Promise<{
    response: { message: string; booking: BookingResponseDto; refund?: any };
    status: number;
  }> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error("No booking found");
    }
    if (booking.status !== "advance_paid") {
      throw new Error("Booking cannot be cancelled by vendor at this stage");
    }
    const refundResult = await issueRefund(
      booking.paymentId ? booking.paymentId : "",
      Math.round(booking.advanceAmount * 100)
    );
    booking.status = "cancelled_by_vendor" as any;
    booking.cancellationReason = cancellationReason;
    booking.balanceDue = booking.totalPrice;
    booking.refundId = refundResult.id;
    const updatedBooking = await this.bookingRepo.update(bookingId, booking);
    if (!updatedBooking) {
      throw new Error("Bookings status update failed");
    }
    return {
      response: {
        message: MESSAGES.SUCCESS.BOOKING_CANCELLED,
        booking: BookingMapper.toResponseDto(updatedBooking),
        refund: refundResult,
      },
      status: STATUS_CODES.OK,
    };
  }

  async getTransactionHistory(): Promise<{
    response: TransactionHistoryResponseDto;
    status: number;
  }> {
    const transactions = await this.bookingRepo.getTransactionHistory();

    return {
      response: {
        message: MESSAGES.SUCCESS.TRANSACTION_HISTORY_FETCHED,
        data: transactions.map((transaction) =>
          BookingMapper.toTransactionHistoryDto(transaction)
        ),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getVendorTransactionHistory(
    vendorId: string
  ): Promise<{ response: TransactionHistoryResponseDto; status: number }> {
    const transactions = await this.bookingRepo.getVendorTransactionHistory(
      vendorId
    );

    return {
      response: {
        message: MESSAGES.SUCCESS.TRANSACTION_HISTORY_FETCHED,
        data: transactions.map((transaction) =>
          BookingMapper.toTransactionHistoryDto(transaction)
        ),
      },
      status: STATUS_CODES.OK,
    };
  }
}
