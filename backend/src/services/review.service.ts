import reviewRepository from "../repositories/review.repository";
import bookingRepository from "../repositories/booking.repository";
import { IReview } from "../models/review.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IReviewService } from "./interfaces/IReviewService";
import mongoose from "mongoose";

class ReviewService implements IReviewService {
  async createReview(
    userId: string,
    venueId: string,
    rating: number,
    reviewText: string,
    images: string[]
  ): Promise<{ message: string; status: number; review: IReview }> {
    const booking = await bookingRepository.findOne({
      user: userId,
      venue: venueId,
      status: { $in: ["confirmed", "fully_paid"] },
    });
    if (!booking) {
      throw new Error(
        "You have not booked this venue or your booking is not confirmed."
      );
    }
    const existingReview = await reviewRepository.findByUserAndVenue(
      userId,
      venueId
    );
    if (existingReview) {
      throw new Error("You have already posted a review for this venue");
    }
    const review = await reviewRepository.create({
      user: new mongoose.Types.ObjectId(userId),
      venue: new mongoose.Types.ObjectId(venueId),
      rating,
      reviewText,
      images,
    });
    return {
      message: MESSAGES.SUCCESS.REVIEW_CREATED,
      status: STATUS_CODES.CREATED,
      review,
    };
  }
  async getReviewsForVenue(
    venueId: string
  ): Promise<{ message: string; status: number; reviews: IReview[] }> {
    const reviews = await reviewRepository.findByVenue(venueId);
    return {
      message: MESSAGES.SUCCESS.REVIEW_FETCHED,
      status: STATUS_CODES.OK,
      reviews,
    };
  }
}

export default new ReviewService();
