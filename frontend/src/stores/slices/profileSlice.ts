import { StateCreator } from "zustand";
import { userService, vendorService } from "../../services";
import { AuthSlice } from "./authSlice";
import { AdminSlice } from "./adminSlice";
import { VenueSlice } from "./venueSlice";

export interface ProfileSlice {
  updateProfile: (profileData: any) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;
  uploadDocuments: (documentUrls: string[]) => Promise<void>;
}

export const createProfileSlice: StateCreator<
  AuthSlice & ProfileSlice & AdminSlice & VenueSlice,
  [],
  [],
  ProfileSlice
> = (set, get) => ({
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
});
