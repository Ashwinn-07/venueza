import { userApi, vendorApi } from "./api";

export const notificationService = {
  getNotifications: async (role: string) => {
    if (role === "vendor") {
      const response = await vendorApi.get("/notifications");
      return response.data;
    } else {
      const response = await userApi.get("/notifications");
      return response.data;
    }
  },
  markAsRead: async (notificationId: string, role: string) => {
    if (role === "vendor") {
      const response = await vendorApi.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } else {
      const response = await userApi.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    }
  },
};
