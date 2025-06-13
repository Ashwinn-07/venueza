import {
  BookingResponseDto,
  BookingsListResponseDto,
  CreateBookingResponseDto,
  DashboardDataResponseDto,
  RevenueResponseDto,
  TransactionHistoryResponseDto,
  VerifyPaymentResponseDto,
} from "../../dto/booking.dto";
import { IBooking } from "../../models/booking.model";

export interface IBookingService {
  createBooking(
    userId: string,
    venueId: string,
    bookingData: { startDate: Date; endDate: Date; totalPrice: number }
  ): Promise<{
    response: CreateBookingResponseDto;
    status: number;
  }>;
  verifyPayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }>;
  createBalancePaymentOrder(bookingId: string): Promise<{
    response: CreateBookingResponseDto;
    status: number;
  }>;
  verifyBalancePayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }>;
  getBookingById(
    bookingId: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }>;
  getBookingsByUserId(
    userId: string,
    filterType: string
  ): Promise<{ response: BookingsListResponseDto; status: number }>;
  getBookedDatesForVenue(
    venueId: string
  ): Promise<{ startDate: Date; endDate: Date }[]>;
  addBlockedDateForVenue(
    venueId: string,
    data: { startDate: Date; endDate: Date; reason?: string }
  ): Promise<{ message: string; blockedDate: any }>;
  getBookingsByVendorId(
    vendorId: string,
    filter: string
  ): Promise<{ response: BookingsListResponseDto; status: number }>;
  getAllBookings(search: string): Promise<{
    response: BookingsListResponseDto;
    status: number;
  }>;
  getAdminRevenue(): Promise<{
    response: { message: string; revenue: RevenueResponseDto[] };
    status: number;
  }>;
  getVendorRevenue(vendorId: string): Promise<{
    response: { message: string; revenue: RevenueResponseDto[] };
    status: number;
  }>;
  getDashboardDataForVendor(vendorId: string): Promise<{
    response: { message: string; dashboardData: DashboardDataResponseDto };
    status: number;
  }>;
  cancelBookingByUser(
    bookingId: string
  ): Promise<{ response: VerifyPaymentResponseDto; status: number }>;
  cancelBookingByVendor(
    bookingId: string,
    cancellationReason: string
  ): Promise<{
    response: { message: string; booking: BookingResponseDto; refund?: any };
    status: number;
  }>;
  getTransactionHistory(): Promise<{
    response: TransactionHistoryResponseDto;
    status: number;
  }>;
  getVendorTransactionHistory(
    vendorId: string
  ): Promise<{ response: TransactionHistoryResponseDto; status: number }>;
}
