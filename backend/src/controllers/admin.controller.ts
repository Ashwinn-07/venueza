import { Request, Response } from "express";
import { IAdminService } from "../services/interfaces/IAdminService";
import { IAdminController } from "./interfaces/IAdminController";
import { STATUS_CODES } from "../utils/constants";
import { VendorRepository } from "../repositories/vendor.repository";
import { IBookingService } from "../services/interfaces/IBookingService";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TOKENS.IAdminService) private adminService: IAdminService,
    @inject(TOKENS.IBookingService) private bookingService: IBookingService,
    @inject(TOKENS.IVendorRepository) private vendorRepository: VendorRepository
  ) {}
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { response, status } = await this.adminService.loginAdmin(
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

      res.status(status).json(response);
    } catch (error) {
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
    res.status(STATUS_CODES.OK).json({ message: "Logged out successfully" });
  };

  getAdminDashboardStats = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { response, status } =
        await this.adminService.getAdminDashboardStats();
      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard statistics",
      });
    }
  };

  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const { response, status } = await this.adminService.listUsers(search);
      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to fetch users",
      });
    }
  };

  listAllVendors = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchQuery = (req.query.search as string) || "";
      const { response, status } = await this.adminService.listAllVendors(
        searchQuery
      );
      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch vendors",
      });
    }
  };

  listPendingVendors = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const { response, status } = await this.adminService.listPendingVendors(
        search
      );
      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending vendors",
      });
    }
  };

  listPendingVenues = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchTerm = (req.query.search as string) || "";
      const { response, status } = await this.adminService.listPendingVenues(
        searchTerm
      );
      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending venues",
      });
    }
  };

  listApprovedVenues = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchTerm = (req.query.search as string) || "";
      const { response, status } = await this.adminService.listApprovedVenues(
        searchTerm
      );
      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch approved venues",
      });
    }
  };

  updateVendorStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: vendorId } = req.params;
      const { status, rejectionReason } = req.body;

      const currentVendor = await this.vendorRepository.findById(vendorId);
      if (!currentVendor) throw new Error("Vendor not found");

      let result;
      if (currentVendor.status === "pending") {
        if (status === "active") {
          result = await this.adminService.approveVendor(vendorId);
        } else if (status === "rejected") {
          result = await this.adminService.rejectVendor(
            vendorId,
            rejectionReason
          );
        } else {
          throw new Error("Invalid status update for pending vendor");
        }
      } else {
        if (status === "active") {
          result = await this.adminService.unblockVendor(vendorId);
        } else if (status === "blocked") {
          result = await this.adminService.blockVendor(vendorId);
        } else {
          throw new Error("Invalid status update");
        }
      }

      res.status(result.status).json({
        message: result.message,
        vendor: result.response,
      });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update vendor status",
      });
    }
  };

  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const { status } = req.body;

      let result;
      if (status === "active") {
        result = await this.adminService.unblockUser(userId);
      } else if (status === "blocked") {
        result = await this.adminService.blockUser(userId);
      } else {
        throw new Error("Invalid status");
      }

      res.status(result.status).json({
        message: result.message,
        user: result.response,
      });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user status",
      });
    }
  };

  updateVenueVerificationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id: venueId } = req.params;
      const { verificationStatus, rejectionReason } = req.body;

      let result;
      if (verificationStatus === "approved") {
        result = await this.adminService.approveVenue(venueId);
      } else if (verificationStatus === "rejected") {
        result = await this.adminService.rejectVenue(venueId, rejectionReason);
      } else {
        throw new Error("Invalid verification status");
      }

      res.status(result.status).json({
        message: result.message,
        venue: result.response,
      });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update venue status",
      });
    }
  };

  getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const { response, status } = await this.bookingService.getAllBookings(
        search
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      });
    }
  };
  getAdminRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const { response, status } = await this.bookingService.getAdminRevenue();
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching admin revenue:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch revenue",
      });
    }
  };
  getTransactionHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { response, status } =
        await this.bookingService.getTransactionHistory();
      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transaction history",
      });
    }
  };
}
