import { Router } from "express";
import vendorController from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import venueController from "../controllers/venue.controller";
import bookingController from "../controllers/booking.controller";
import reviewController from "../controllers/review.controller";
import chatController from "../controllers/chat.controller";
import notificationController from "../controllers/notification.controller";

const vendorRoutes = Router();
const vendorAuth = authMiddleware(["vendor"]);
const multiRoleAuth = authMiddleware(["user", "vendor", "admin"]);

vendorRoutes
  .post("/signup", vendorController.register)
  .post("/login", vendorController.login)
  .post("/verify-otp", vendorController.verifyOTP)
  .post("/resend-otp", vendorController.resendOTP)
  .post("/forgot-password", vendorController.forgotPassword)
  .post("/reset-password", vendorController.resetPassword)
  .post("/logout", vendorController.logout);

vendorRoutes
  .put("/settings/profile", vendorAuth, vendorController.updateVendorProfile)
  .patch(
    "/settings/security",
    vendorAuth,
    vendorController.changeVendorPassword
  )
  .post("/settings/documents", vendorAuth, vendorController.uploadDocuments);

vendorRoutes
  .get("/venues", vendorAuth, venueController.getVenuesByVendor)
  .post("/venues", vendorAuth, venueController.createVenue)
  .get("/venues/:id", vendorAuth, venueController.getVenue)
  .put("/venues/:id", vendorAuth, venueController.updateVenue)
  .post("/venues/block-dates", vendorAuth, vendorController.addBlockedDate)
  .get(
    "/venues/:venueId/booked-dates",
    vendorAuth,
    bookingController.getBookedDatesForVenue
  );

vendorRoutes
  .get("/bookings", vendorAuth, bookingController.getBookingsByVendor)
  .patch("/bookings/cancel", vendorAuth, bookingController.vendorCancelBooking);

vendorRoutes
  .get("/revenue", vendorAuth, vendorController.getVendorRevenue)
  .get("/dashboard", vendorAuth, vendorController.getDashboardData);

vendorRoutes
  .get("/reviews/:venueId", multiRoleAuth, reviewController.getReviews)
  .patch(
    "/reviews/:reviewId/reply",
    vendorAuth,
    reviewController.vendorReplyReview
  );

vendorRoutes
  .post("/messages", vendorAuth, chatController.sendMessage)
  .get("/conversation", vendorAuth, chatController.getConversation)
  .get("/conversations", vendorAuth, chatController.getConversations);

vendorRoutes
  .get("/notifications", vendorAuth, notificationController.getNotifications)
  .patch(
    "/notifications/:notificationId/read",
    vendorAuth,
    notificationController.markNotificationAsRead
  );

vendorRoutes.get(
  "/transactions",
  vendorAuth,
  vendorController.getTransactionHistory
);

export default vendorRoutes;
