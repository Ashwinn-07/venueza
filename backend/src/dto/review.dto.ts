export class CreateReviewRequestDto {
  venueId!: string;
  rating!: number;
  reviewText!: string;
  images!: string[];
}

export class VendorReplyRequestDto {
  reply!: string;
}

export class ReviewResponseDto {
  id!: string;
  userId!: string;
  venueId!: string;
  rating!: number;
  reviewText!: string;
  images!: string[];
  vendorReply?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class CreateReviewResponseDto {
  message!: string;
  review!: ReviewResponseDto;
}

export class ReviewsListResponseDto {
  message!: string;
  reviews!: ReviewResponseDto[];
}

export class VendorReplyResponseDto {
  message!: string;
  review!: ReviewResponseDto;
}

export class DeleteReviewResponseDto {
  message!: string;
}
