import { Request, Response } from "express";

export interface IBookingController {
  createBooking(req: Request, res: Response): Promise<void>;
  verifyPayment(req: Request, res: Response): Promise<void>;
  createBalancePaymentOrder(req: Request, res: Response): Promise<void>;
  verifyBalancePayment(req: Request, res: Response): Promise<void>;
  getBooking(req: Request, res: Response): Promise<void>;
  getUserBookings(req: Request, res: Response): Promise<void>;
  getBookedDatesForVenue(req: Request, res: Response): Promise<void>;
  getBookingsByVendor(req: Request, res: Response): Promise<void>;
  userCancelBooking(req: Request, res: Response): Promise<void>;
  vendorCancelBooking(req: Request, res: Response): Promise<void>;
  getVendorRevenue(req: Request, res: Response): Promise<void>;
  getVendorDashboard(req: Request, res: Response): Promise<void>;
  getVendorTransactionHistory(req: Request, res: Response): Promise<void>;
}
