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
  uploadDocuments: (documentUrls: string[]) => Promise<void>;

  setUserFromToken: (token: string, authType: AuthType) => void;
  getDashboardStats: () => Promise<any>;
  listAllUsers: () => Promise<any>;
  listAllVendors: () => Promise<any>;
  listPendingVendors: () => Promise<any>;
  listPendingVenues: () => Promise<any>;
  updateUserStatus: (userId: string, status: string) => Promise<any>;
  updateVendorStatus: (vendorId: string, status: string) => Promise<any>;
  updateVenueVerificationStatus: (
    venueId: string,
    verificationStatus: string
  ) => Promise<any>;

  createVenue: (venueData: any) => Promise<any>;
  getVenues: () => Promise<any>;
  getVenue: (venueId: string) => Promise<any>;
  updateVenue: (venueId: string, venueData: any) => Promise<any>;
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
      uploadDocuments: async (documentUrls) => {
        try {
          const { user, authType } = get();
          if (!user || !authType) {
            throw new Error("Not authenticated");
          }
          if (authType !== "vendor") {
            throw new Error("Only vendors can upload documents");
          }
          const response = await vendorService.uploadDocuments(documentUrls);
          if (response.vendor) {
            set({
              user: response.vendor,
            });
          }
          return response;
        } catch (error) {
          console.error("upload failed", error);
          throw error;
        }
      },
      setUserFromToken: (token, authType) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const decodedPayload = JSON.parse(
            decodeURIComponent(escape(window.atob(base64)))
          ); // Here we decode the token to extract user info.
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
      listPendingVenues: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listPendingVenues();
        } catch (error) {
          console.error("Failed to list pending venues", error);
          throw error;
        }
      },
      updateUserStatus: async (userId, status) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.updateUserStatus(userId, status);
        } catch (error) {
          console.error("Failed to update user status", error);
          throw error;
        }
      },
      updateVendorStatus: async (vendorId, status) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.updateVendorStatus(vendorId, status);
        } catch (error) {
          console.error("Failed to update vendor status", error);
          throw error;
        }
      },
      updateVenueVerificationStatus: async (venueId, verificationStatus) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.updateVenueVerificationStatus(
            venueId,
            verificationStatus
          );
        } catch (error) {
          console.error("Failed to update venue verification status", error);
          throw error;
        }
      },
      createVenue: async (venueData) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "vendor")
            throw new Error("Not authorized as vendor");

          return await vendorService.createVenue(venueData);
        } catch (error) {
          console.error("Failed to create venue", error);
          throw error;
        }
      },
      getVenues: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "vendor")
            throw new Error("Not authorized as vendor");

          return await vendorService.getVenues();
        } catch (error) {
          console.error("Failed to get venues", error);
          throw error;
        }
      },
      getVenue: async (venueId) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "vendor") {
            throw new Error("Not authorized as vendor");
          }
          return await vendorService.getVenue(venueId);
        } catch (error) {
          console.error("failed to fetch venue", error);
          throw error;
        }
      },
      updateVenue: async (venueId, venueData) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "vendor")
            throw new Error("Not authorized as vendor");

          return await vendorService.updateVenue(venueId, venueData);
        } catch (error) {
          console.error("Failed to update venue", error);
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
