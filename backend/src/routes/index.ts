import { Router } from "express";
// import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import vendorRoutes from "./vendor.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/vendor", vendorRoutes);
router.use("/admin", adminRoutes);

export default router;
