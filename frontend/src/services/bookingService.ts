import { userApi } from "./api";

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
};
