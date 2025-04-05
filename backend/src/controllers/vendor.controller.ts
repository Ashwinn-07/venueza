import { Request, Response } from "express";
import vendorService from "../services/vendor.service";
import { IVendorController } from "./interfaces/IVendorController";
import { STATUS_CODES } from "../utils/constants";
import bookingService from "../services/booking.service";

class VendorController implements IVendorController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await vendorService.registerVendor(req.body);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }
  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await vendorService.verifyOTP(email, otp);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "OTP verification failed",
      });
    }
  }
  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Email is required",
        });
        return;
      }

      const result = await vendorService.resendOTP(email);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await vendorService.forgotPassword(email);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to process forgot password request",
      });
    }
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, password, confirmPassword } = req.body;
      const result = await vendorService.resetPassword(
        email,
        otp,
        password,
        confirmPassword
      );
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to reset password",
      });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await vendorService.loginVendor(email, password);
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
          id: result.vendor._id,
          name: result.vendor.name,
          email: result.vendor.email,
          phone: result.vendor.phone,
          profileImage: result.vendor.profileImage,
          businessName: result.vendor.businessName,
          businessAddress: result.vendor.businessAddress,
          status: result.vendor.status,
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
  async updateVendorProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const updatedData = req.body;
      const result = await vendorService.updateVendorProfile(
        userId,
        updatedData
      );
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.vendor._id,
          name: result.vendor.name,
          email: result.vendor.email,
          phone: result.vendor.phone,
          profileImage: result.vendor.profileImage,
          businessName: result.vendor.businessName,
          businessAddress: result.vendor.businessAddress,
          status: result.vendor.status,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  }
  async changeVendorPassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All password fields are required",
        });
        return;
      }

      const result = await vendorService.changeVendorPassword(
        userId,
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to change password",
      });
    }
  }
  async uploadDocuments(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      const { documentUrls } = req.body;
      if (
        !documentUrls ||
        !Array.isArray(documentUrls) ||
        documentUrls.length === 0
      ) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "Documents are required." });
        return;
      }
      const result = await vendorService.uploadDocuments(
        vendorId,
        documentUrls
      );
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.vendor._id,
          name: result.vendor.name,
          email: result.vendor.email,
          phone: result.vendor.phone,
          profileImage: result.vendor.profileImage,
          businessName: result.vendor.businessName,
          businessAddress: result.vendor.businessAddress,
          status: result.vendor.status,
          documents: result.vendor.documents,
        },
      });
    } catch (error) {
      console.error("documents upload error", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to upload documents",
      });
    }
  }
  async addBlockedDate(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      const { venueId, startDate, endDate, reason } = req.body;
      if (!venueId || !startDate || !endDate) {
        throw new Error("Missing required fields");
      }
      const result = await bookingService.addBlockedDateForVenue(venueId, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      });
      res.status(STATUS_CODES.OK).json({
        message: result.message,
        blockedDate: result.blockedDate,
      });
    } catch (error) {
      console.error("Error adding blocked date:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to add blocked date",
      });
    }
  }
  async getVendorRevenue(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      if (!vendorId) {
        throw new Error("Vendor ID is missing");
      }
      const result = await bookingService.getVendorRevenue(vendorId);
      res.status(result.status).json({
        message: result.message,
        revenue: result.revenue,
      });
    } catch (error) {
      console.error("Error fetching vendor revenue:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch revenue",
      });
    }
  }
  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      if (!vendorId) {
        throw new Error("Vendor ID is missing");
      }
      const result = await bookingService.getDashboardDataForVendor(vendorId);
      res.status(result.status).json({
        message: result.message,
        dashboardData: result.dashboardData,
      });
    } catch (error) {
      console.error("Error fetching vendor dashboard data:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor dashboard data",
      });
    }
  }
  async getTransactionHistory(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      const result = await bookingService.getVendorTransactionHistory(vendorId);
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Error fetching vendor transaction history:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor transaction history",
      });
    }
  }
}

export default new VendorController();
