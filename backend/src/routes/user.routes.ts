import { Router } from "express";
import userController from "../controllers/user.controller";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/auth.middleware";

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

export default userRoutes;
