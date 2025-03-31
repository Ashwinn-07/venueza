import { StateCreator } from "zustand";
import { reviewService } from "../../services/reviewService";
import { AuthSlice } from "./authSlice";

export interface ReviewSlice {
  createReview: (
    venueId: string,
    rating: number,
    reviewText: string,
    images: string[]
  ) => Promise<any>;
  getReviewsUser: (venueId: string) => Promise<any>;
  getReviewsVendor: (venueId: string) => Promise<any>;
  getReviewsAdmin: (venueId: string) => Promise<any>;
}

export const createReviewSlice: StateCreator<
  AuthSlice & ReviewSlice,
  [],
  [],
  ReviewSlice
> = (_set, get) => ({
  createReview: async (venueId, rating, reviewText, images) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "user") {
        throw new Error("Authentication required");
      }
      return await reviewService.createReview(
        venueId,
        rating,
        reviewText,
        images
      );
    } catch (error) {
      console.error("Failed to create review", error);
      throw error;
    }
  },
  getReviewsUser: async (venueId) => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      return await reviewService.getReviewsUser(venueId);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      throw error;
    }
  },
  getReviewsVendor: async (venueId) => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      return await reviewService.getReviewsVendor(venueId);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      throw error;
    }
  },
  getReviewsAdmin: async (venueId) => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      return await reviewService.getReviewsAdmin(venueId);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      throw error;
    }
  },
});
