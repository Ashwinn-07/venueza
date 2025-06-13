import { Request, Response } from "express";
import { IReviewService } from "../services/interfaces/IReviewService";
import { STATUS_CODES } from "../utils/constants";
import { IReviewController } from "./interfaces/IReviewController";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject(TOKENS.IReviewService) private reviewService: IReviewService
  ) {}

  createReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { venueId, rating, reviewText, images } = req.body;

      const { response, status } = await this.reviewService.createReview(
        userId,
        venueId,
        rating,
        reviewText,
        images
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to create review",
      });
    }
  };

  getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { venueId } = req.params;

      const { response, status } = await this.reviewService.getReviewsForVenue(
        venueId
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch reviews",
      });
    }
  };

  vendorReplyReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;
      const { reply } = req.body;

      const { response, status } = await this.reviewService.vendorReplyReview(
        reviewId,
        reply
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("Error adding vendor reply:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to add vendor reply",
      });
    }
  };

  deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;
      const currentUserRole = (req as any).userType;

      const { response, status } = await this.reviewService.deleteReview(
        reviewId,
        currentUserRole
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to delete review",
      });
    }
  };
}
