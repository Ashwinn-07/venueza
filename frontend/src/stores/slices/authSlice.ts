import { StateCreator } from "zustand";
import { authService } from "../../services";
import { AdminSlice } from "./adminSlice";
import { ProfileSlice } from "./profileSlice";
import { VenueSlice } from "./venueSlice";

export type AuthType = "user" | "vendor" | "admin";

export interface AuthSlice {
  user: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;

  login: (email: string, password: string, authType: AuthType) => Promise<void>;
  signup: (userData: any, authType: AuthType) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string, authType: AuthType) => Promise<void>;
  resendOtp: (email: string, authType: AuthType) => Promise<void>;
  forgotPassword: (email: string, authType: AuthType) => Promise<void>;
  resetPassword: (
    data: {
      email: string;
      otp: string;
      password: string;
      confirmPassword: string;
    },
    authType: AuthType
  ) => Promise<void>;
  setUserFromToken: (token: string, authType: AuthType) => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice & ProfileSlice & AdminSlice & VenueSlice,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  authType: sessionStorage.getItem("auth-type") as AuthType | null,
  isAuthenticated: false,

  login: async (email, password, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userLogin({ email, password });
          break;
        case "vendor":
          response = await authService.vendorLogin({ email, password });
          break;
        case "admin":
          response = await authService.adminLogin({ email, password });
          break;
      }

      sessionStorage.setItem("auth-type", authType);

      set({
        user: response.user,
        authType,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  signup: async (userData, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userSignup(userData);
          break;
        case "vendor":
          response = await authService.vendorSignup(userData);
          break;
        default:
          throw new Error("Invalid signup type");
      }

      return response;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  },

  verifyOtp: async (email, otp, authType) => {
    try {
      switch (authType) {
        case "user":
          await authService.userVerifyOtp({ email, otp });
          break;
        case "vendor":
          await authService.vendorVerifyOtp({ email, otp });
          break;
        default:
          throw new Error("Invalid auth type");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      throw error;
    }
  },

  resendOtp: async (email, authType) => {
    try {
      switch (authType) {
        case "user":
          await authService.userResendOtp(email);
          break;
        case "vendor":
          await authService.vendorResendOtp(email);
          break;
        default:
          throw new Error("Invalid auth type");
      }
    } catch (error) {
      console.error("OTP resend failed", error);
      throw error;
    }
  },

  forgotPassword: async (email, authType) => {
    try {
      switch (authType) {
        case "user":
          await authService.userForgotPassword(email);
          break;
        case "vendor":
          await authService.vendorForgotPassword(email);
          break;
        default:
          throw new Error("Invalid auth type");
      }
    } catch (error) {
      console.error("Forgot password failed", error);
      throw error;
    }
  },

  resetPassword: async (data, authType) => {
    try {
      switch (authType) {
        case "user":
          await authService.userResetPassword(data);
          break;
        case "vendor":
          await authService.vendorResetPassword(data);
          break;
        default:
          throw new Error("Invalid auth type");
      }
    } catch (error) {
      console.error("Reset password failed", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { authType } = get();
      if (!authType) throw new Error("No auth type found");

      switch (authType) {
        case "user":
          await authService.userLogout();
          break;
        case "vendor":
          await authService.vendorLogout();
          break;
        case "admin":
          await authService.adminLogout();
          break;
        default:
          throw new Error("Invalid auth type");
      }

      sessionStorage.removeItem("auth-type");

      set({
        user: null,
        authType: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  },

  setUserFromToken: (token, authType) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(
        decodeURIComponent(escape(window.atob(base64)))
      );
      set({
        user: decodedPayload,
        authType,
        isAuthenticated: true,
      });
      sessionStorage.setItem("auth-type", authType);
    } catch (error) {
      console.error("Failed to decode token", error);
      throw error;
    }
  },
});
