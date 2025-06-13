import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { IReview } from "../models/review.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IReviewService } from "./interfaces/IReviewService";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { TOKENS } from "../config/tokens";
import { ReviewMapper } from "../mappers/review.mapper";
import {
  CreateReviewResponseDto,
  ReviewsListResponseDto,
  VendorReplyResponseDto,
  DeleteReviewResponseDto,
} from "../dto/review.dto";

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
  ): Promise<{ response: CreateReviewResponseDto; status: number }> {
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
      response: {
        message: MESSAGES.SUCCESS.REVIEW_CREATED,
        review: ReviewMapper.toResponseDto(review),
      },
      status: STATUS_CODES.CREATED,
    };
  }

  async getReviewsForVenue(
    venueId: string
  ): Promise<{ response: ReviewsListResponseDto; status: number }> {
    const reviews = await this.reviewRepo.findByVenue(venueId);

    return {
      response: {
        message: MESSAGES.SUCCESS.REVIEW_FETCHED,
        reviews: ReviewMapper.toResponseDtoArray(reviews),
      },
      status: STATUS_CODES.OK,
    };
  }

  async vendorReplyReview(
    reviewId: string,
    reply: string
  ): Promise<{ response: VendorReplyResponseDto; status: number }> {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new Error("No Review found");
    }

    const updatedReview = await this.reviewRepo.updateReply(reviewId, reply);

    return {
      response: {
        message: MESSAGES.SUCCESS.REPLY_ADDED,
        review: ReviewMapper.toResponseDto(updatedReview as IReview),
      },
      status: STATUS_CODES.OK,
    };
  }

  async deleteReview(
    reviewId: string,
    currentUserRole: string
  ): Promise<{ response: DeleteReviewResponseDto; status: number }> {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    if (currentUserRole !== "admin") {
      throw new Error("Unauthorized: Only admins can delete reviews");
    }

    await this.reviewRepo.delete(reviewId);

    return {
      response: {
        message: MESSAGES.SUCCESS.REVIEW_DELETED,
      },
      status: STATUS_CODES.OK,
    };
  }
}
