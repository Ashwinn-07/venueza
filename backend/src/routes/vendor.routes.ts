import { Router } from "express";
import vendorController from "../controllers/vendor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

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

export default vendorRoutes;
