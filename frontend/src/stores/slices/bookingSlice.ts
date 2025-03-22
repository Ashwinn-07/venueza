import { StateCreator } from "zustand";
import { bookingService } from "../../services";
import { AuthSlice } from "./authSlice";
import { ProfileSlice } from "./profileSlice";
import { VenueSlice } from "./venueSlice";
import { AdminSlice } from "./adminSlice";

export interface BookingSlice {
  createBooking: (
    venueId: string,
    bookingData: {
      startDate: Date;
      endDate: Date;
      totalPrice: number;
    }
  ) => Promise<any>;

  verifyPayment: (
    bookingId: string,
    paymentData: {
      paymentId: string;
      razorpaySignature: string;
    }
  ) => Promise<any>;

  getBookingById: (bookingId: string) => Promise<any>;
  getBookingsByUser: () => Promise<any>;
  getBookingsByVendor: () => Promise<any>;
  getBookedDatesForVenue: (venueId: string) => Promise<any>;
  createBalancePaymentOrder: (bookingId: string) => Promise<any>;
  verifyBalancePayment: (
    bookingId: string,
    paymentData: {
      paymentId: string;
      razorpaySignature: string;
    }
  ) => Promise<any>;
}

export const createBookingSlice: StateCreator<
  AuthSlice & ProfileSlice & AdminSlice & VenueSlice & BookingSlice,
  [],
  [],
  BookingSlice
> = (_set, get) => ({
  createBooking: async (venueId, bookingData) => {
    try {
      const { authType, isAuthenticated } = get();
      if (!isAuthenticated || authType !== "user") {
        throw new Error("Authentication required");
      }

      return await bookingService.createBooking(venueId, bookingData);
    } catch (error) {
      console.error("Failed to create booking", error);
      throw error;
    }
  },

  verifyPayment: async (bookingId, paymentData) => {
    try {
      const { authType, isAuthenticated } = get();
      if (!isAuthenticated || authType !== "user") {
        throw new Error("Authentication required");
      }

      return await bookingService.verifyPayment(bookingId, paymentData);
    } catch (error) {
      console.error("Failed to verify payment", error);
      throw error;
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }

      return await bookingService.getBookingById(bookingId);
    } catch (error) {
      console.error("Failed to get booking details", error);
      throw error;
    }
  },
  getBookingsByUser: async () => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }

      return await bookingService.getBookingsByUser();
    } catch (error) {
      console.error("Failed to get booking details", error);
      throw error;
    }
  },
  getBookingsByVendor: async () => {
    try {
      const { authType, isAuthenticated } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }

      return await bookingService.getBookingsByVendor();
    } catch (error) {
      console.error("Failed to get booking details", error);
      throw error;
    }
  },
  getBookedDatesForVenue: async (venueId: string) => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      return await bookingService.getBookedDatesForVenue(venueId);
    } catch (error) {
      console.error("Failed to get booked dates", error);
      throw error;
    }
  },
  createBalancePaymentOrder: async (bookingId: string) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "user") {
        throw new Error("Authentication required");
      }
      return await bookingService.createBalancePaymentOrder(bookingId);
    } catch (error) {
      console.error("Failed to create balance payment order", error);
      throw error;
    }
  },
  verifyBalancePayment: async (bookingId: string, paymentData) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "user") {
        throw new Error("Authentication required");
      }
      return await bookingService.verifyBalancePayment(bookingId, paymentData);
    } catch (error) {
      console.error("Failed to verify balance payment", error);
      throw error;
    }
  },
});
