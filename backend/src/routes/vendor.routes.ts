import { Router } from "express";
import vendorController from "../controllers/vendor.controller";

const vendorRoutes = Router();

vendorRoutes.post("/signup", vendorController.register);
vendorRoutes.post("/login", vendorController.login);
vendorRoutes.post("/verify-otp", vendorController.verifyOTP);

export default vendorRoutes;
