import Review, { IReview } from "../models/review.model";
import BaseRepository from "./base.repository";
import { IReviewRepository } from "./interfaces/IReviewRepository";

class ReviewRepository
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
}

export default new ReviewRepository();
