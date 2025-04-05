import { vendorApi } from "./api";

export const vendorService = {
  updateProfile: async (profileData: any) => {
    const response = await vendorApi.put(`/settings/profile`, profileData);
    return response.data;
  },
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const response = await vendorApi.patch(`/settings/security`, data);
    return response.data;
  },
  uploadDocuments: async (documentUrls: string[]) => {
    const response = await vendorApi.post("/settings/documents", {
      documentUrls: documentUrls,
    });
    return response.data;
  },
  createVenue: async (venueData: any) => {
    const response = await vendorApi.post("/venues", venueData);
    return response.data;
  },
  getVenues: async () => {
    const response = await vendorApi.get("/venues");
    return response.data;
  },
  getVenue: async (venueId: string) => {
    const response = await vendorApi.get(`/venues/${venueId}`);
    return response.data.result.venue;
  },
  updateVenue: async (venueId: string, venueData: any) => {
    const response = await vendorApi.put(`/venues/${venueId}`, venueData);
    return response.data;
  },
  getTransactionHistory: async () => {
    const response = await vendorApi.get("/transactions");
    return response.data;
  },
};
