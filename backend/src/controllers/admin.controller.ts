import { Request, Response } from "express";
import adminService from "../services/admin.service";
import { IAdminController } from "./interfaces/IAdminController";
import { STATUS_CODES } from "../utils/constants";
import vendorRepository from "../repositories/vendor.repository";
import bookingService from "../services/booking.service";

class AdminController implements IAdminController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await adminService.loginAdmin(email, password);
      res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
        path: "/",
      });
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.admin._id,
          name: result.admin.name,
          email: result.admin.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
    });
  }
  async getAdminDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminService.getAdminDashboardStats();
      res.status(result.status).json({
        totalUsers: result.totalUsers,
        totalVendors: result.totalVendors,
        totalBookings: result.totalBookings,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard statistics",
      });
    }
  }
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string) || "";
      const result = await adminService.listUsers(search);
      res.status(result.status).json({
        users: result.users,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to fetch users",
      });
    }
  }
  async listAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const searchQuery = (req.query.search as string) || "";
      const result = await adminService.listAllVendors(searchQuery);
      res.status(result.status).json({
        vendors: result.vendors,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch vendors",
      });
    }
  }
  async listPendingVendors(req: Request, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string) || "";
      const result = await adminService.listPendingVendors(search);
      res.status(result.status).json({
        vendors: result.vendors,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending vendors",
      });
    }
  }
  async listPendingVenues(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = (req.query.search as string) || "";
      const result = await adminService.listPendingVenues(searchTerm);
      res.status(result.status).json({
        venues: result.venues,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending venues",
      });
    }
  }
  async listApprovedVenues(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = (req.query.search as string) || "";
      const result = await adminService.listApprovedVenues(searchTerm);
      res.status(result.status).json({
        venues: result.venues,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch approved venues",
      });
    }
  }
  async updateVendorStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id: vendorId } = req.params;
      const { status, rejectionReason } = req.body;
      const currentVendor = await vendorRepository.findById(vendorId);
      if (!currentVendor) {
        throw new Error("vendor not found");
      }
      let result;
      if (currentVendor.status === "pending") {
        if (status === "active") {
          result = await adminService.approveVendor(vendorId);
        } else if (status === "blocked") {
          result = await adminService.rejectVendor(vendorId, rejectionReason);
        } else {
          throw new Error("Invalid status update for a pending vendor");
        }
      } else {
        if (status === "active") {
          result = await adminService.unblockVendor(vendorId);
        } else if (status === "blocked") {
          result = await adminService.blockVendor(vendorId);
        } else {
          throw new Error("Invalid status update");
        }
      }
      res.status(result.status).json({
        message: result.message,
        vendor: result.vendor,
      });
    } catch (error) {
      console.error("Update vendor status error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update vendor status",
      });
    }
  }
  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      const { status } = req.body;
      let result;
      if (status === "active") {
        result = await adminService.unblockUser(userId);
      } else if (status === "blocked") {
        result = await adminService.blockUser(userId);
      } else {
        throw new Error("Invalid status");
      }
      res.status(result.status).json({
        message: result.message,
        user: result.user,
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user status",
      });
    }
  }
  async updateVenueVerificationStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id: venueId } = req.params;
      const { verificationStatus, rejectionReason } = req.body;
      let result;
      if (verificationStatus === "approved") {
        result = await adminService.approveVenue(venueId);
      } else if (verificationStatus === "rejected") {
        result = await adminService.rejectVenue(venueId, rejectionReason);
      } else {
        throw new Error("Invalid verification status update");
      }
      res.status(result.status).json({
        message: result.message,
        venue: result.venue,
      });
    } catch (error) {
      console.error("Update venue verification status error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update venue verification status",
      });
    }
  }
  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string) || "";
      const result = await bookingService.getAllBookings(search);
      res.status(result.status).json({
        message: result.message,
        bookings: result.bookings,
      });
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      });
    }
  }
  async getAdminRevenue(req: Request, res: Response): Promise<void> {
    try {
      const result = await bookingService.getAdminRevenue();
      res.status(result.status).json({
        message: result.message,
        revenue: result.revenue,
      });
    } catch (error) {
      console.error("Error fetching admin revenue:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch revenue",
      });
    }
  }
}

export default new AdminController();
