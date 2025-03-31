import { userApi, vendorApi, adminApi } from "./api";

export const reviewService = {
  createReview: async (
    venueId: string,
    rating: number,
    reviewText: string,
    images: string[]
  ) => {
    const response = await userApi.post("/reviews", {
      venueId,
      rating,
      reviewText,
      images,
    });
    return response.data;
  },

  getReviewsUser: async (venueId: string) => {
    const response = await userApi.get(`/reviews/${venueId}`);
    return response.data;
  },
  getReviewsVendor: async (venueId: string) => {
    const response = await vendorApi.get(`/reviews/${venueId}`);
    return response.data;
  },
  getReviewsAdmin: async (venueId: string) => {
    const response = await adminApi.get(`/reviews/${venueId}`);
    return response.data;
  },
};
