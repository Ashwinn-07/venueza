import { StateCreator } from "zustand";
import { adminService } from "../../services";
import { AuthSlice } from "./authSlice";
import { ProfileSlice } from "./profileSlice";
import { VenueSlice } from "./venueSlice";

export interface AdminSlice {
  getDashboardStats: () => Promise<any>;
  listAllUsers: () => Promise<any>;
  listAllVendors: () => Promise<any>;
  listPendingVendors: () => Promise<any>;
  listPendingVenues: () => Promise<any>;
  listApprovedVenues: () => Promise<any>;
  updateUserStatus: (userId: string, status: string) => Promise<any>;
  updateVendorStatus: (vendorId: string, status: string) => Promise<any>;
  updateVenueVerificationStatus: (
    venueId: string,
    verificationStatus: string,
    rejectionReason?: string
  ) => Promise<any>;
}

export const createAdminSlice: StateCreator<
  AuthSlice & ProfileSlice & AdminSlice & VenueSlice,
  [],
  [],
  AdminSlice
> = (_set, get) => ({
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

  listApprovedVenues: async () => {
    try {
      const { authType } = get();
      if (!authType || authType !== "admin")
        throw new Error("Not authorized as admin");

      return await adminService.listApprovedVenues();
    } catch (error) {
      console.error("Failed to list approved venues", error);
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

  updateVenueVerificationStatus: async (
    venueId,
    verificationStatus,
    rejectionReason
  ) => {
    try {
      const { authType } = get();
      if (!authType || authType !== "admin")
        throw new Error("Not authorized as admin");

      return await adminService.updateVenueVerificationStatus(
        venueId,
        verificationStatus,
        rejectionReason
      );
    } catch (error) {
      console.error("Failed to update venue verification status", error);
      throw error;
    }
  },
});
