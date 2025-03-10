import { Request, Response } from "express";
import userService from "../services/user.service";
import { IUserController } from "./interfaces/IUserController";
import { STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";

class UserController implements IUserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.registerUser(req.body);
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
      const result = await userService.verifyOTP(email, otp);
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

      const result = await userService.resendOTP(email);
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
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
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
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          status: result.user.status,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  }
  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const result = await userService.processGoogleAuth(user);
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
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
        },
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Google Authentication Failed",
      });
    }
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await userService.forgotPassword(email);
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
      const result = await userService.resetPassword(
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
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const updatedData = req.body;
      const result = await userService.updateUserProfile(userId, updatedData);
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          status: result.user.status,
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
  async changeUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All password fields are required",
        });
        return;
      }

      const result = await userService.changeUserPassword(
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
}

export default new UserController();
