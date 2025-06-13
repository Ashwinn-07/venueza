import {
  CreateReviewResponseDto,
  DeleteReviewResponseDto,
  ReviewsListResponseDto,
  VendorReplyResponseDto,
} from "../../dto/review.dto";

export interface IReviewService {
  createReview(
    userId: string,
    venueId: string,
    rating: number,
    reviewText: string,
    images: string[]
  ): Promise<{ response: CreateReviewResponseDto; status: number }>;
  getReviewsForVenue(
    venueId: string
  ): Promise<{ response: ReviewsListResponseDto; status: number }>;
  vendorReplyReview(
    reviewId: string,
    reply: string
  ): Promise<{ response: VendorReplyResponseDto; status: number }>;
  deleteReview(
    reviewId: string,
    currentUserRole: string
  ): Promise<{ response: DeleteReviewResponseDto; status: number }>;
}
