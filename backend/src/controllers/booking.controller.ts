import { Request, Response } from "express";
import bookingService from "../services/booking.service";
import { IBookingController } from "./interfaces/IBookingController";
import { STATUS_CODES } from "../utils/constants";

class BookingController implements IBookingController {
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { venueId, startDate, endDate, totalPrice } = req.body;
      const userId = (req as any).userId;
      const result = await bookingService.createBooking(userId, venueId, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(totalPrice),
      });
      res.status(result.status).json({
        message: result.message,
        booking: result.booking,
        razorpayOrder: result.razorpayOrder,
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      });
    }
  }
  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, paymentId, razorpaySignature } = req.body;
      const result = await bookingService.verifyPayment(
        bookingId,
        paymentId,
        razorpaySignature
      );
      res.status(result.status).json({
        message: result.message,
        booking: result.booking,
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to verify payment",
      });
    }
  }
  async getBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await bookingService.getBookingById(id);
      res.status(result.status).json({
        message: result.message,
        booking: result.booking,
      });
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch booking",
      });
    }
  }
  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const result = await bookingService.getBookingsByUserId(userId);
      res.status(result.status).json({
        message: result.message,
        bookings: result.bookings,
      });
    } catch (error) {
      console.error("Get user bookings error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      });
    }
  }
  async getBookedDatesForVenue(req: Request, res: Response): Promise<void> {
    try {
      const { venueId } = req.params;
      const bookedDates = await bookingService.getBookedDatesForVenue(venueId);
      res.status(STATUS_CODES.OK).json({
        message: "Booked dates fetched successfully",
        bookedDates,
      });
    } catch (error) {
      console.error("Error fetching booked dates:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch booked dates",
      });
    }
  }
}

export default new BookingController();
