import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  adminService,
  authService,
  userService,
  vendorService,
} from "../services/api";

type AuthType = "user" | "vendor" | "admin";

interface AuthState {
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

  updateProfile: (profileData: any) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;

  googleLogin: (token: string) => Promise<void>;
  getDashboardStats: () => Promise<any>;
  listAllUsers: () => Promise<any>;
  listAllVendors: () => Promise<any>;
  listPendingVendors: () => Promise<any>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      updateProfile: async (profileData) => {
        try {
          const { user, authType } = get();
          if (!user || !authType) throw new Error("Not authenticated");

          let response;
          switch (authType) {
            case "user":
              response = await userService.updateProfile(profileData);
              break;
            case "vendor":
              response = await vendorService.updateProfile(profileData);
              break;
            default:
              throw new Error("Invalid auth type for profile update");
          }

          set({
            user: response.user || response.vendor,
          });
        } catch (error) {
          console.error("Profile update failed", error);
          throw error;
        }
      },
      changePassword: async (data) => {
        try {
          const { user, authType } = get();
          if (!user || !authType) throw new Error("Not authenticated");

          switch (authType) {
            case "user":
              await userService.changePassword(data);
              break;
            case "vendor":
              await vendorService.changePassword(data);
              break;
            default:
              throw new Error("Invalid auth type for password change");
          }
        } catch (error) {
          console.error("Password change failed", error);
          throw error;
        }
      },
      googleLogin: async (token) => {
        try {
          const response = await authService.googleAuth(token);

          sessionStorage.setItem("auth-type", "user");

          set({
            user: response.user,
            authType: "user",
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Google login failed", error);
          throw error;
        }
      },
      getDashboardStats: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.getDashboardStats();
        } catch (error) {
          console.error("Failed to get dashboard stats", error);
          throw error;
        }
      },
      listAllUsers: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listAllUsers();
        } catch (error) {
          console.error("Failed to list users", error);
          throw error;
        }
      },
      listAllVendors: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listAllVendors();
        } catch (error) {
          console.error("Failed to list vendors", error);
          throw error;
        }
      },
      listPendingVendors: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listPendingVendors();
        } catch (error) {
          console.error("Failed to list pending vendors", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
