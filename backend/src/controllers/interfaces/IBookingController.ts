import { Request, Response } from "express";

export interface IBookingController {
  createBooking(req: Request, res: Response): Promise<void>;
  verifyPayment(req: Request, res: Response): Promise<void>;
  getBooking(req: Request, res: Response): Promise<void>;
}
