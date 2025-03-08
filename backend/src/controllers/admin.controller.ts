import { Request, Response } from "express";
import adminService from "../services/admin.service";
import { IAdminController } from "./interfaces/IAdminController";
import { STATUS_CODES } from "../utils/constants";

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
      const result = await adminService.listUsers();
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
      const result = await adminService.listAllVendors();
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
      const result = await adminService.listPendingVendors();
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
}

export default new AdminController();
