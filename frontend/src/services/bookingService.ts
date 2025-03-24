import { adminApi, userApi, vendorApi } from "./api";

export const bookingService = {
  createBooking: async (
    venueId: string,
    bookingData: {
      startDate: Date;
      endDate: Date;
      totalPrice: number;
    }
  ) => {
    const response = await userApi.post("/bookings", {
      venueId,
      ...bookingData,
    });
    return response.data;
  },

  verifyPayment: async (
    bookingId: string,
    paymentData: {
      paymentId: string;
      razorpaySignature: string;
    }
  ) => {
    const response = await userApi.patch("/bookings/verify", {
      bookingId,
      paymentId: paymentData.paymentId,
      razorpaySignature: paymentData.razorpaySignature,
    });
    return response.data;
  },

  getBookingById: async (bookingId: string) => {
    const response = await userApi.get(`/bookings/${bookingId}`);
    return response.data;
  },
  getBookingsByUser: async () => {
    const response = await userApi.get("/bookings");
    return response.data;
  },
  getBookingsByVendor: async () => {
    const response = await vendorApi.get("/bookings");
    return response.data;
  },
  getBookedDatesForVenue: async (venueId: string) => {
    const response = await userApi.get(`/venues/${venueId}/booked-dates`);
    return response.data;
  },
  addBlockedDateForVenue: async (data: {
    venueId: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }) => {
    const response = await vendorApi.post("/venues/block-dates", data);
    return response.data;
  },
  createBalancePaymentOrder: async (bookingId: string) => {
    const response = await userApi.post("/bookings/balance", { bookingId });
    return response.data;
  },
  verifyBalancePayment: async (
    bookingId: string,
    paymentData: {
      paymentId: string;
      razorpaySignature: string;
    }
  ) => {
    const response = await userApi.patch("/bookings/balance/verify", {
      bookingId,
      paymentId: paymentData.paymentId,
      razorpaySignature: paymentData.razorpaySignature,
    });
    return response.data;
  },
  getAllBookings: async () => {
    const response = await adminApi.get("/bookings");
    return response.data;
  },
};
