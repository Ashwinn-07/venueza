import { Router } from "express";
import userController from "../controllers/user.controller";
import passport from "../config/passport";

const userRoutes = Router();

userRoutes.post("/signup", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/verify-otp", userController.verifyOTP);

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
export default userRoutes;
