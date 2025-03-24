import { IBooking } from "../../models/booking.model";

export interface IBookingService {
  createBooking(
    userId: string,
    venueId: string,
    bookingData: { startDate: Date; endDate: Date; totalPrice: number }
  ): Promise<{
    message: string;
    status: number;
    booking: IBooking;
    razorpayOrder: any;
  }>;
  verifyPayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ message: string; status: number; booking: IBooking }>;
  createBalancePaymentOrder(bookingId: string): Promise<{
    message: string;
    status: number;
    booking: IBooking;
    razorpayOrder: any;
  }>;
  verifyBalancePayment(
    bookingId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ message: string; status: number; booking: IBooking }>;
  getBookingById(
    bookingId: string
  ): Promise<{ message: string; status: number; booking: IBooking }>;
  getBookingsByUserId(
    userId: string
  ): Promise<{ message: string; status: number; bookings: IBooking[] }>;
  getBookedDatesForVenue(
    venueId: string
  ): Promise<{ startDate: Date; endDate: Date }[]>;
  addBlockedDateForVenue(
    venueId: string,
    data: { startDate: Date; endDate: Date; reason?: string }
  ): Promise<{ message: string; blockedDate: any }>;
  getBookingsByVendorId(
    vendorId: string
  ): Promise<{ message: string; status: number; bookings: IBooking[] }>;
  getAllBookings(): Promise<{
    message: string;
    status: number;
    bookings: IBooking[];
  }>;
  getAdminRevenue(): Promise<{
    message: string;
    status: number;
    revenue: number;
  }>;
  getVendorRevenue(vendorId: string): Promise<{
    message: string;
    status: number;
    revenue: number;
  }>;
}
