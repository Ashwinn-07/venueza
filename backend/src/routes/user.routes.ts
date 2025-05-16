import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/auth.middleware";
import { VenueController } from "../controllers/venue.controller";
import { BookingController } from "../controllers/booking.controller";
import { ReviewController } from "../controllers/review.controller";
import { ChatController } from "../controllers/chat.controller";
import { NotificationController } from "../controllers/notification.controller";
import { container } from "tsyringe";

const userRoutes = Router();
const userAuth = authMiddleware(["user"]);
const multiRoleAuth = authMiddleware(["user", "vendor", "admin"]);

const userController = container.resolve(UserController);
const venueController = container.resolve(VenueController);
const bookingController = container.resolve(BookingController);
const reviewController = container.resolve(ReviewController);
const chatController = container.resolve(ChatController);
const notificationController = container.resolve(NotificationController);

userRoutes
  .post("/signup", userController.register)
  .post("/login", userController.login)
  .post("/verify-otp", userController.verifyOTP)
  .post("/resend-otp", userController.resendOTP)
  .post("/forgot-password", userController.forgotPassword)
  .post("/reset-password", userController.resetPassword)
  .post("/logout", userController.logout);

userRoutes
  .get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )
  .get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    userController.googleCallback
  );

userRoutes
  .put("/profile", userAuth, userController.updateUserProfile)
  .patch("/security", userAuth, userController.changeUserPassword);

userRoutes
  .get("/home", userAuth, venueController.getFeaturedVenues)
  .get("/venues", userAuth, venueController.getAllVenues)
  .get("/venues/:id", userAuth, venueController.getVenue)
  .get(
    "/venues/:venueId/booked-dates",
    userAuth,
    bookingController.getBookedDatesForVenue
  );

userRoutes
  .post("/bookings", userAuth, bookingController.createBooking)
  .get("/bookings", userAuth, bookingController.getUserBookings)
  .get("/bookings/:id", userAuth, bookingController.getBooking)
  .patch("/bookings/verify", userAuth, bookingController.verifyPayment)
  .post(
    "/bookings/balance",
    userAuth,
    bookingController.createBalancePaymentOrder
  )
  .patch(
    "/bookings/balance/verify",
    userAuth,
    bookingController.verifyBalancePayment
  )
  .patch("/bookings/cancel", userAuth, bookingController.userCancelBooking);

userRoutes
  .get("/reviews/:venueId", multiRoleAuth, reviewController.getReviews)
  .post("/reviews", userAuth, reviewController.createReview);

userRoutes
  .post("/messages", userAuth, chatController.sendMessage)
  .get("/conversation", userAuth, chatController.getConversation)
  .get("/conversations", userAuth, chatController.getConversations);

userRoutes
  .get("/notifications", userAuth, notificationController.getNotifications)
  .patch(
    "/notifications/:notificationId/read",
    userAuth,
    notificationController.markNotificationAsRead
  );

export default userRoutes;
