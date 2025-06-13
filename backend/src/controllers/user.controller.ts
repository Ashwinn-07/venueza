import { Request, Response } from "express";
import { IUserService } from "../services/interfaces/IUserService";
import { IUserController } from "./interfaces/IUserController";
import { STATUS_CODES } from "../utils/constants";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TOKENS.IUserService) private userService: IUserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { response, status } = await this.userService.registerUser(
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
      const { response, status } = await this.userService.verifyOTP(email, otp);
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

      const { response, status } = await this.userService.resendOTP(email);
      res.status(status).json(response);
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { response, status } = await this.userService.loginUser(
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

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any;
      const { response, status } = await this.userService.processGoogleAuth(
        user
      );

      res.cookie("auth-token", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
        path: "/",
      });

      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${response.token}`
      );
    } catch (error) {
      console.error("Google auth error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/user/login?error=google_auth_failed`
      );
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const { response, status } = await this.userService.forgotPassword(email);
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
      const { response, status } = await this.userService.resetPassword(
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

  updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const updatedData = req.body;
      const { response, message, status } =
        await this.userService.updateUserProfile(userId, updatedData);

      res.status(status).json({
        message,
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          profileImage: response.profileImage,
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

  changeUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All password fields are required",
        });
        return;
      }

      const { response, status } = await this.userService.changeUserPassword(
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
}
