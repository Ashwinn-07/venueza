import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ReviewController } from "../controllers/review.controller";
import { container } from "tsyringe";

const adminRoutes = Router();
const adminAuth = authMiddleware(["admin"]);
const multiRoleAuth = authMiddleware(["user", "vendor", "admin"]);

const adminController = container.resolve(AdminController);
const reviewController = container.resolve(ReviewController);

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

adminRoutes.get(
  "/transactions",
  adminAuth,
  adminController.getTransactionHistory
);

export default adminRoutes;
