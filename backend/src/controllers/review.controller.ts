import { Request, Response } from "express";
import reviewService from "../services/review.service";
import { STATUS_CODES } from "../utils/constants";
import { IReviewController } from "./interfaces/IReviewController";

class ReviewController implements IReviewController {
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { venueId, rating, reviewText, images } = req.body;
      const result = await reviewService.createReview(
        userId,
        venueId,
        rating,
        reviewText,
        images
      );
      res.status(result.status).json({
        message: result.message,
        review: result.review,
      });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to create review",
      });
    }
  }
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { venueId } = req.params;
      const result = await reviewService.getReviewsForVenue(venueId);
      res.status(result.status).json({
        message: result.message,
        reviews: result.reviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch reviews",
      });
    }
  }
}

export default new ReviewController();
