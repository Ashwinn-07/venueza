import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const adminRoutes = Router();

adminRoutes.post("/login", adminController.login);
adminRoutes.post("/logout", adminController.logout);

adminRoutes.get(
  "/dashboard",
  authMiddleware(["admin"]),
  adminController.getAdminDashboardStats
);
adminRoutes.get("/users", authMiddleware(["admin"]), adminController.listUsers);
adminRoutes.get(
  "/vendors",
  authMiddleware(["admin"]),
  adminController.listAllVendors
);
adminRoutes.get(
  "/vendors/pending",
  authMiddleware(["admin"]),
  adminController.listPendingVendors
);

export default adminRoutes;
