import { userApi } from "./api";

export const userService = {
  updateProfile: async (profileData: any) => {
    const response = await userApi.put(`/profile`, profileData);
    return response.data;
  },
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const response = await userApi.patch(`/security`, data);
    return response.data;
  },
  getVenues: async (params: {
    page?: number;
    limit?: number;
    query?: string;
    location?: string;
    capacity?: number;
    price?: number;
  }) => {
    const response = await userApi.get("/venues", { params });
    return response.data;
  },
  getFeaturedVenues: async () => {
    const response = await userApi.get("/home");
    return response.data;
  },
  getVenue: async (venueId: string) => {
    const response = await userApi.get(`/venues/${venueId}`);
    return response.data;
  },
};
