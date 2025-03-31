import { IReview } from "../../models/review.model";

export interface IReviewService {
  createReview(
    userId: string,
    venueId: string,
    rating: number,
    reviewText: string,
    images: string[]
  ): Promise<{ message: string; status: number; review: IReview }>;
  getReviewsForVenue(
    venueId: string
  ): Promise<{ message: string; status: number; reviews: IReview[] }>;
}
