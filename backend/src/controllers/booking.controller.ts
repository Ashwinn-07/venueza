import { Request, Response } from "express";
import { IBookingService } from "../services/interfaces/IBookingService";
import { IBookingController } from "./interfaces/IBookingController";
import { STATUS_CODES } from "../utils/constants";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TOKENS.IBookingService) private bookingService: IBookingService
  ) {}

  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { venueId, startDate, endDate, totalPrice } = req.body;
      const userId = (req as any).userId;
      const { response, status } = await this.bookingService.createBooking(
        userId,
        venueId,
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice: Number(totalPrice),
        }
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, paymentId, razorpaySignature } = req.body;
      const { response, status } = await this.bookingService.verifyPayment(
        bookingId,
        paymentId,
        razorpaySignature
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to verify payment",
      });
    }
  };

  createBalancePaymentOrder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { bookingId } = req.body;
      const { response, status } =
        await this.bookingService.createBalancePaymentOrder(bookingId);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error creating balance payment order:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create balance payment order",
      });
    }
  };

  verifyBalancePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, paymentId, razorpaySignature } = req.body;
      const { response, status } =
        await this.bookingService.verifyBalancePayment(
          bookingId,
          paymentId,
          razorpaySignature
        );
      res.status(status).json(response);
    } catch (error) {
      console.error("Error verifying balance payment:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify balance payment",
      });
    }
  };

  getBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { response, status } = await this.bookingService.getBookingById(id);
      res.status(status).json(response);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch booking",
      });
    }
  };

  getUserBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const filterType = (req.query.filter as string) || "all";
      const { response, status } =
        await this.bookingService.getBookingsByUserId(userId, filterType);
      res.status(status).json(response);
    } catch (error) {
      console.error("Get user bookings error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      });
    }
  };

  getBookedDatesForVenue = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { venueId } = req.params;
      const bookedDates = await this.bookingService.getBookedDatesForVenue(
        venueId
      );
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
  };

  getBookingsByVendor = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const filter = (req.query.filter as string) || "all";
      const { response, status } =
        await this.bookingService.getBookingsByVendorId(vendorId, filter);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor bookings:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      });
    }
  };

  userCancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.body;
      const { response, status } =
        await this.bookingService.cancelBookingByUser(bookingId);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error cancelling booking by user:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to cancel booking",
      });
    }
  };

  vendorCancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, cancellationReason } = req.body;
      const { response, status } =
        await this.bookingService.cancelBookingByVendor(
          bookingId,
          cancellationReason
        );
      res.status(status).json(response);
    } catch (error) {
      console.error("Error in vendor cancellation:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to cancel booking",
      });
    }
  };

  getVendorRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const { response, status } = await this.bookingService.getVendorRevenue(
        vendorId
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor revenue:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch revenue",
      });
    }
  };

  getVendorDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const { response, status } =
        await this.bookingService.getDashboardDataForVendor(vendorId);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor dashboard:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      });
    }
  };

  getVendorTransactionHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const { response, status } =
        await this.bookingService.getVendorTransactionHistory(vendorId);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor transaction history:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transaction history",
      });
    }
  };
}
