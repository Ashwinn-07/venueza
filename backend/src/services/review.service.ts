import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { IReview } from "../models/review.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IReviewService } from "./interfaces/IReviewService";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { TOKENS } from "../config/tokens";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TOKENS.IReviewRepository)
    private reviewRepo: IReviewRepository,
    @inject(TOKENS.IBookingRepository)
    private bookingRepo: IBookingRepository
  ) {}
  async createReview(
    userId: string,
    venueId: string,
    rating: number,
    reviewText: string,
    images: string[]
  ): Promise<{ message: string; status: number; review: IReview }> {
    const booking = await this.bookingRepo.findOne({
      user: userId,
      venue: venueId,
      status: { $in: ["confirmed", "fully_paid"] },
    });
    if (!booking) {
      throw new Error(
        "You have not booked this venue or your booking is not confirmed."
      );
    }
    const existingReview = await this.reviewRepo.findByUserAndVenue(
      userId,
      venueId
    );
    if (existingReview) {
      throw new Error("You have already posted a review for this venue");
    }
    const review = await this.reviewRepo.create({
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
    const reviews = await this.reviewRepo.findByVenue(venueId);
    return {
      message: MESSAGES.SUCCESS.REVIEW_FETCHED,
      status: STATUS_CODES.OK,
      reviews,
    };
  }
  async vendorReplyReview(
    reviewId: string,
    reply: string
  ): Promise<{ message: string; status: number; review: IReview }> {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new Error("No Review found");
    }
    const updatedReview = await this.reviewRepo.updateReply(reviewId, reply);
    return {
      message: MESSAGES.SUCCESS.REPLY_ADDED,
      status: STATUS_CODES.OK,
      review: updatedReview as IReview,
    };
  }
  async deleteReview(
    reviewId: string,
    currentUserRole: string
  ): Promise<{ message: string; status: number }> {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (currentUserRole !== "admin") {
      throw new Error("Unauthorized: Only admins can delete reviews");
    }
    await this.reviewRepo.delete(reviewId);
    return {
      message: MESSAGES.SUCCESS.REVIEW_DELETED,
      status: STATUS_CODES.OK,
    };
  }
}
