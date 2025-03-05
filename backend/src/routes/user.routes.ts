import { Router } from "express";
import userController from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/signup", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/verify-otp", userController.verifyOTP);

export default userRoutes;
