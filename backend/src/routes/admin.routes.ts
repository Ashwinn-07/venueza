import { Router } from "express";
import adminController from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import reviewController from "../controllers/review.controller";

const adminRoutes = Router();
const adminAuth = authMiddleware(["admin"]);
const multiRoleAuth = authMiddleware(["user", "vendor", "admin"]);

adminRoutes
  .post("/login", adminController.login)
  .post("/logout", adminController.logout);

adminRoutes
  .get("/dashboard", adminAuth, adminController.getAdminDashboardStats)
  .get("/revenue", adminAuth, adminController.getAdminRevenue);

adminRoutes
  .get("/users", adminAuth, adminController.listUsers)
  .patch("/users/:id", adminAuth, adminController.updateUserStatus);

adminRoutes
  .get("/vendors", adminAuth, adminController.listAllVendors)
  .get("/vendors/pending", adminAuth, adminController.listPendingVendors)
  .patch("/vendors/:id", adminAuth, adminController.updateVendorStatus);

adminRoutes
  .get("/venues", adminAuth, adminController.listApprovedVenues)
  .get("/venues/pending", adminAuth, adminController.listPendingVenues)
  .patch(
    "/venues/:id",
    adminAuth,
    adminController.updateVenueVerificationStatus
  );

adminRoutes.get("/bookings", adminAuth, adminController.getAllBookings);

adminRoutes
  .get("/reviews/:venueId", multiRoleAuth, reviewController.getReviews)
  .delete("/reviews/:reviewId", adminAuth, reviewController.deleteReview);

export default adminRoutes;
