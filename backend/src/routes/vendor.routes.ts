import { Router } from "express";
import vendorController from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import venueController from "../controllers/venue.controller";
import bookingController from "../controllers/booking.controller";
import reviewController from "../controllers/review.controller";
import chatController from "../controllers/chat.controller";
import notificationController from "../controllers/notification.controller";

const vendorRoutes = Router();

vendorRoutes.post("/signup", vendorController.register);
vendorRoutes.post("/login", vendorController.login);
vendorRoutes.post("/verify-otp", vendorController.verifyOTP);
vendorRoutes.post("/resend-otp", vendorController.resendOTP);
vendorRoutes.post("/forgot-password", vendorController.forgotPassword);
vendorRoutes.post("/reset-password", vendorController.resetPassword);
vendorRoutes.post("/logout", vendorController.logout);

vendorRoutes.put(
  "/settings/profile",
  authMiddleware(["vendor"]),
  vendorController.updateVendorProfile
);
vendorRoutes.patch(
  "/settings/security",
  authMiddleware(["vendor"]),
  vendorController.changeVendorPassword
);
vendorRoutes.post(
  "/settings/documents",
  authMiddleware(["vendor"]),
  vendorController.uploadDocuments
);

vendorRoutes.get(
  "/venues",
  authMiddleware(["vendor"]),
  venueController.getVenuesByVendor
);
vendorRoutes.post(
  "/venues",
  authMiddleware(["vendor"]),
  venueController.createVenue
);
vendorRoutes.get(
  "/venues/:id",
  authMiddleware(["vendor"]),
  venueController.getVenue
);
vendorRoutes.put(
  "/venues/:id",
  authMiddleware(["vendor"]),
  venueController.updateVenue
);
vendorRoutes.post(
  "/venues/block-dates",
  authMiddleware(["vendor"]),
  vendorController.addBlockedDate
);
vendorRoutes.get(
  "/bookings",
  authMiddleware(["vendor"]),
  bookingController.getBookingsByVendor
);
vendorRoutes.get(
  "/revenue",
  authMiddleware(["vendor"]),
  vendorController.getVendorRevenue
);
vendorRoutes.get(
  "/dashboard",
  authMiddleware(["vendor"]),
  vendorController.getDashboardData
);
vendorRoutes.patch(
  "/bookings/cancel",
  authMiddleware(["vendor"]),
  bookingController.vendorCancelBooking
);
vendorRoutes.get(
  "/venues/:venueId/booked-dates",
  authMiddleware(["vendor"]),
  bookingController.getBookedDatesForVenue
);
vendorRoutes.get(
  "/reviews/:venueId",
  authMiddleware(["user", "vendor", "admin"]),
  reviewController.getReviews
);
vendorRoutes.patch(
  "/reviews/:reviewId/reply",
  authMiddleware(["vendor"]),
  reviewController.vendorReplyReview
);
vendorRoutes.post(
  "/messages",
  authMiddleware(["vendor"]),
  chatController.sendMessage
);
vendorRoutes.get(
  "/conversation",
  authMiddleware(["vendor"]),
  chatController.getConversation
);
vendorRoutes.get(
  "/conversations",
  authMiddleware(["vendor"]),
  chatController.getConversations
);
vendorRoutes.get(
  "/notifications",
  authMiddleware(["vendor"]),
  notificationController.getNotifications
);
vendorRoutes.patch(
  "/notifications/:notificationId/read",
  authMiddleware(["vendor"]),
  notificationController.markNotificationAsRead
);

export default vendorRoutes;
