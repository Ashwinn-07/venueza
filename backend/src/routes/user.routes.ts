import { Router } from "express";
import userController from "../controllers/user.controller";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/auth.middleware";
import venueController from "../controllers/venue.controller";
import bookingController from "../controllers/booking.controller";

const userRoutes = Router();

userRoutes.post("/signup", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/verify-otp", userController.verifyOTP);
userRoutes.post("/resend-otp", userController.resendOTP);
userRoutes.post("/forgot-password", userController.forgotPassword);
userRoutes.post("/reset-password", userController.resetPassword);

userRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  userController.googleCallback
);
userRoutes.post("/logout", userController.logout);

userRoutes.put(
  "/profile",
  authMiddleware(["user"]),
  userController.updateUserProfile
);

userRoutes.patch(
  "/security",
  authMiddleware(["user"]),
  userController.changeUserPassword
);

userRoutes.get(
  "/home",
  authMiddleware(["user"]),
  venueController.getFeaturedVenues
);
userRoutes.get(
  "/venues",
  authMiddleware(["user"]),
  venueController.getAllVenues
);
userRoutes.get(
  "/venues/:venueId/booked-dates",
  authMiddleware(["user"]),
  bookingController.getBookedDatesForVenue
);

userRoutes.get(
  "/venues/:id",
  authMiddleware(["user"]),
  venueController.getVenue
);
userRoutes.post(
  "/bookings",
  authMiddleware(["user"]),
  bookingController.createBooking
);
userRoutes.patch(
  "/bookings/verify",
  authMiddleware(["user"]),
  bookingController.verifyPayment
);
userRoutes.get(
  "/bookings/:id",
  authMiddleware(["user"]),
  bookingController.getBooking
);
userRoutes.get(
  "/bookings",
  authMiddleware(["user"]),
  bookingController.getUserBookings
);
userRoutes.post(
  "/bookings/balance",
  authMiddleware(["user"]),
  bookingController.createBalancePaymentOrder
);
userRoutes.patch(
  "/bookings/balance/verify",
  authMiddleware(["user"]),
  bookingController.verifyBalancePayment
);
userRoutes.patch(
  "/bookings/cancel",
  authMiddleware(["user"]),
  bookingController.userCancelBooking
);

export default userRoutes;
