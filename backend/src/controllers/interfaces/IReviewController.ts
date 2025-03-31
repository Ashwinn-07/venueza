import { Request, Response } from "express";

export interface IReviewController {
  createReview(req: Request, res: Response): Promise<void>;
  getReviews(req: Request, res: Response): Promise<void>;
  vendorReplyReview(req: Request, res: Response): Promise<void>;
  deleteReview(req: Request, res: Response): Promise<void>;
}
