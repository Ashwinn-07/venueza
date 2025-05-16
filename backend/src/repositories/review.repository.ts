import { injectable } from "tsyringe";
import Review, { IReview } from "../models/review.model";
import { BaseRepository } from "./base.repository";
import { IReviewRepository } from "./interfaces/IReviewRepository";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor() {
    super(Review);
  }

  async findByUserAndVenue(
    userId: string,
    venueId: string
  ): Promise<IReview | null> {
    return Review.findOne({ user: userId, venue: venueId }).exec();
  }

  async findByVenue(venueId: string): Promise<IReview[]> {
    return Review.find({ venue: venueId }).populate("user").exec();
  }
  async updateReply(reviewId: string, reply: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(
      reviewId,
      { vendorReply: reply },
      { new: true }
    ).exec();
  }

  async delete(reviewId: string): Promise<IReview | null> {
    return Review.findByIdAndDelete(reviewId).exec();
  }
}
