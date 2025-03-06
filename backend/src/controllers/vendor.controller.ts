import { Request, Response } from "express";
import vendorService from "../services/vendor.service";
import { IVendorController } from "./interfaces/IVendorController";
import { STATUS_CODES } from "../utils/constants";

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
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await vendorService.loginVendor(email, password);
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.vendor._id,
          name: result.vendor.name,
          email: result.vendor.email,
          phone: result.vendor.phone,
          status: result.vendor.status,
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

export default new VendorController();
