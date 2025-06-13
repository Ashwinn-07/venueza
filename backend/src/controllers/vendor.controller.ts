import { Request, Response } from "express";
import { IVendorService } from "../services/interfaces/IVendorService";
import { IVendorController } from "./interfaces/IVendorController";
import { STATUS_CODES } from "../utils/constants";
import { IBookingService } from "../services/interfaces/IBookingService";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class VendorController implements IVendorController {
  constructor(
    @inject(TOKENS.IVendorService) private vendorService: IVendorService,
    @inject(TOKENS.IBookingService)
    private bookingService: IBookingService
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { response, status } = await this.vendorService.registerVendor(
        req.body
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const { response, status } = await this.vendorService.verifyOTP(
        email,
        otp
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "OTP verification failed",
      });
    }
  };

  resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Email is required",
        });
        return;
      }

      const { response, status } = await this.vendorService.resendOTP(email);
      res.status(status).json(response);
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const { response, status } = await this.vendorService.forgotPassword(
        email
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to process forgot password request",
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, password, confirmPassword } = req.body;
      const { response, status } = await this.vendorService.resetPassword(
        email,
        otp,
        password,
        confirmPassword
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to reset password",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { response, status } = await this.vendorService.loginVendor(
        email,
        password
      );

      res.cookie("auth-token", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
        path: "/",
      });

      res.status(status).json({
        message: response.message,
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          profileImage: response.profileImage,
          businessName: response.businessName,
          businessAddress: response.businessAddress,
          status: response.status,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
    });
  };

  updateVendorProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const updatedData = req.body;
      const { response, status } = await this.vendorService.updateVendorProfile(
        userId,
        updatedData
      );

      res.status(status).json({
        message: "Profile updated successfully",
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          profileImage: response.profileImage,
          businessName: response.businessName,
          businessAddress: response.businessAddress,
          status: response.status,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  changeVendorPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All password fields are required",
        });
        return;
      }

      const { response, status } =
        await this.vendorService.changeVendorPassword(
          userId,
          currentPassword,
          newPassword,
          confirmNewPassword
        );
      res.status(status).json(response);
    } catch (error) {
      console.error("Password change error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to change password",
      });
    }
  };

  uploadDocuments = async (req: Request, res: Response): Promise<void> => {
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

      const { response, status } = await this.vendorService.uploadDocuments(
        vendorId,
        documentUrls
      );

      res.status(status).json({
        message:
          "Documents uploaded successfully and pending verification from admin",
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          profileImage: response.profileImage,
          businessName: response.businessName,
          businessAddress: response.businessAddress,
          status: response.status,
          documents: response.documents,
        },
      });
    } catch (error) {
      console.error("documents upload error", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to upload documents",
      });
    }
  };

  addBlockedDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const { venueId, startDate, endDate, reason } = req.body;

      if (!venueId || !startDate || !endDate) {
        throw new Error("Missing required fields");
      }

      const result = await this.bookingService.addBlockedDateForVenue(venueId, {
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
  };

  getVendorRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      if (!vendorId) throw new Error("Vendor ID is missing");
      const { response, status } = await this.bookingService.getVendorRevenue(
        vendorId
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor revenue:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch revenue",
      });
    }
  };

  getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      if (!vendorId) throw new Error("Vendor ID is missing");
      const { response, status } =
        await this.bookingService.getDashboardDataForVendor(vendorId);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor dashboard data:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor dashboard data",
      });
    }
  };

  getTransactionHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      if (!vendorId) throw new Error("Vendor ID is missing");
      const { response, status } =
        await this.bookingService.getVendorTransactionHistory(vendorId);
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching vendor transaction history:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor transaction history",
      });
    }
  };
}
