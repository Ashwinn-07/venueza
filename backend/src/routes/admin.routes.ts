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
adminRoutes.patch(
  "/users/:id",
  authMiddleware(["admin"]),
  adminController.updateUserStatus
);
adminRoutes.get(
  "/vendors",
  authMiddleware(["admin"]),
  adminController.listAllVendors
);
adminRoutes.patch(
  "/vendors/:id",
  authMiddleware(["admin"]),
  adminController.updateVendorStatus
);
adminRoutes.get(
  "/vendors/pending",
  authMiddleware(["admin"]),
  adminController.listPendingVendors
);
adminRoutes.get(
  "/venues/pending",
  authMiddleware(["admin"]),
  adminController.listPendingVenues
);
adminRoutes.get(
  "/venues",
  authMiddleware(["admin"]),
  adminController.listApprovedVenues
);
adminRoutes.patch(
  "/venues/:id",
  authMiddleware(["admin"]),
  adminController.updateVenueVerificationStatus
);
adminRoutes.get(
  "/bookings",
  authMiddleware(["admin"]),
  adminController.getAllBookings
);
adminRoutes.get(
  "/revenue",
  authMiddleware(["admin"]),
  adminController.getAdminRevenue
);
export default adminRoutes;
