import { StateCreator } from "zustand";
import { notificationService } from "../../services/notificationService";
import { AuthSlice } from "./authSlice";

export interface NotificationSlice {
  getNotifications: () => Promise<any>;
  markNotificationAsRead: (notificationId: string) => Promise<any>;
}

export const createNotificationSlice: StateCreator<
  AuthSlice & NotificationSlice,
  [],
  [],
  NotificationSlice
> = (_set, get) => ({
  getNotifications: async () => {
    const { isAuthenticated, authType } = get();
    if (!isAuthenticated || !authType) {
      throw new Error("Authentication required");
    }
    return await notificationService.getNotifications(authType);
  },
  markNotificationAsRead: async (notificationId: string) => {
    const { isAuthenticated, authType } = get();
    if (!isAuthenticated || !authType) {
      throw new Error("Authentication required");
    }
    return await notificationService.markAsRead(notificationId, authType);
  },
});
