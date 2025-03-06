import { Request, Response } from "express";
import adminService from "../services/admin.service";
import { IAdminController } from "./interfaces/IAdminController";
import { STATUS_CODES } from "../utils/constants";

class AdminController implements IAdminController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await adminService.loginAdmin(email, password);
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.admin._id,
          name: result.admin.name,
          email: result.admin.email,
        },
        token: result.token,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  }
}

export default new AdminController();
