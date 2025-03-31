import { IBaseRepository } from "./IBaseRepository";
import { IReview } from "../../models/review.model";

export interface IReviewRepository extends IBaseRepository<IReview> {
  findByUserAndVenue(userId: string, venueId: string): Promise<IReview | null>;
  findByVenue(venueId: string): Promise<IReview[]>;
}
