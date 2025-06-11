import { StateCreator } from "zustand";
import { vendorService, userService } from "../../services";
import { AuthSlice } from "./authSlice";
import { ProfileSlice } from "./profileSlice";
import { AdminSlice } from "./adminSlice";

export interface VenueSlice {
  createVenue: (venueData: any) => Promise<any>;
  getVenues: (filter: string) => Promise<any>;
  getVenue: (venueId: string) => Promise<any>;
  updateVenue: (venueId: string, venueData: any) => Promise<any>;
  getUserVenues: (params?: {
    page?: number;
    limit?: number;
    query?: string;
    location?: string;
    capacity?: number;
  }) => Promise<any>;
  getFeaturedVenues: () => Promise<any>;
  getUserVenue: (venueId: string) => Promise<any>;
}

export const createVenueSlice: StateCreator<
  AuthSlice & ProfileSlice & AdminSlice & VenueSlice,
  [],
  [],
  VenueSlice
> = (_set, get) => ({
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

  getVenues: async (filter = "all") => {
    try {
      const { authType } = get();
      if (!authType || authType !== "vendor")
        throw new Error("Not authorized as vendor");

      return await vendorService.getVenues(filter);
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

  getUserVenues: async (params = {}) => {
    try {
      return await userService.getVenues(params);
    } catch (error) {
      console.error("Failed to get user venues", error);
      throw error;
    }
  },

  getFeaturedVenues: async () => {
    try {
      return await userService.getFeaturedVenues();
    } catch (error) {
      console.error("Failed to get featured venues", error);
      throw error;
    }
  },

  getUserVenue: async (venueId: string) => {
    try {
      return await userService.getVenue(venueId);
    } catch (error) {
      console.error("Failed to get user venue", error);
      throw error;
    }
  },
});
