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
  getBookingById(
    bookingId: string
  ): Promise<{ message: string; status: number; booking: IBooking }>;
}
