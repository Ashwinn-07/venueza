import { StateCreator } from "zustand";
import { bookingService, vendorService } from "../../services";
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
  getBookingsByUser: (filterType: string) => Promise<any>;
  getBookingsByVendor: (filter: string) => Promise<any>;
  getBookedDatesForVenue: (venueId: string) => Promise<any>;
  getBookedDatesForVenueForVendor: (venueId: string) => Promise<any>;
  addBlockedDateForVenue: (data: {
    venueId: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }) => Promise<any>;
  createBalancePaymentOrder: (bookingId: string) => Promise<any>;
  verifyBalancePayment: (
    bookingId: string,
    paymentData: {
      paymentId: string;
      razorpaySignature: string;
    }
  ) => Promise<any>;
  getAllBookings: (search: string) => Promise<any>;
  getAdminRevenue: () => Promise<any>;
  getVendorRevenue: () => Promise<any>;
  getVendorDashboard: () => Promise<any>;
  cancelBookingByUser: (bookingId: string) => Promise<any>;
  cancelBookingByVendor: (
    bookingId: string,
    cancellationReason: string
  ) => Promise<any>;
  getVendorTransactionHistory: () => Promise<any>;
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
  getBookingsByUser: async (filterType = "upcoming") => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }

      return await bookingService.getBookingsByUser(filterType);
    } catch (error) {
      console.error("Failed to get booking details", error);
      throw error;
    }
  },
  getBookingsByVendor: async (filter = "all") => {
    try {
      const { authType, isAuthenticated } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }

      return await bookingService.getBookingsByVendor(filter);
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
  getBookedDatesForVenueForVendor: async (venueId: string) => {
    try {
      const { isAuthenticated } = get();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }
      return await bookingService.getBookedDatesForVenueForVendor(venueId);
    } catch (error) {
      console.error("Failed to get booked dates", error);
      throw error;
    }
  },
  addBlockedDateForVenue: async (data) => {
    try {
      const { authType, isAuthenticated } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }
      return await bookingService.addBlockedDateForVenue(data);
    } catch (error) {
      console.error("Failed to add blocked date", error);
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
  getAllBookings: async (search = "") => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "admin") {
        throw new Error("Authentication required");
      }
      return await bookingService.getAllBookings(search);
    } catch (error) {
      console.error("Failed to fetch admin bookings", error);
      throw error;
    }
  },
  getAdminRevenue: async () => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "admin") {
        throw new Error("Authentication required");
      }
      return await bookingService.getAdminRevenue();
    } catch (error) {
      console.error("Failed to fetch admin revenue", error);
      throw error;
    }
  },
  getVendorRevenue: async () => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }
      return await bookingService.getVendorRevenue();
    } catch (error) {
      console.error("Failed to fetch vendor revenue", error);
      throw error;
    }
  },
  getVendorDashboard: async () => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }
      return await bookingService.getVendorDashboard();
    } catch (error) {
      console.error("Failed to fetch vendor dashboard data", error);
      throw error;
    }
  },
  cancelBookingByUser: async (bookingId) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "user") {
        throw new Error("Authentication required");
      }
      return await bookingService.cancelBookingByUser(bookingId);
    } catch (error) {
      console.error("Failed to cancel booking by user", error);
      throw error;
    }
  },
  cancelBookingByVendor: async (bookingId, cancellationReason) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }
      return await bookingService.cancelBookingByVendor(
        bookingId,
        cancellationReason
      );
    } catch (error) {
      console.error("Failed to cancel booking by vendor", error);
      throw error;
    }
  },
  getVendorTransactionHistory: async () => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || authType !== "vendor") {
        throw new Error("Authentication required");
      }
      return await vendorService.getTransactionHistory();
    } catch (error) {
      console.error("Failed to fetch vendor transaction history", error);
      throw error;
    }
  },
});
