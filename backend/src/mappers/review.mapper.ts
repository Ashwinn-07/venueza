import { IReview } from "../models/review.model";
import { ReviewResponseDto } from "../dto/review.dto";

export class ReviewMapper {
  static toResponseDto(review: IReview): ReviewResponseDto {
    return {
      id: (review._id as any).toString(),
      userId: review.user.toString(),
      venueId: review.venue.toString(),
      rating: review.rating,
      reviewText: review.reviewText,
      images: review.images,
      vendorReply: review.vendorReply,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  static toResponseDtoArray(reviews: IReview[]): ReviewResponseDto[] {
    return reviews.map((review) => this.toResponseDto(review));
  }
}
