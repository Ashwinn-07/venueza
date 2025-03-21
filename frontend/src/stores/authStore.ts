import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  createAuthSlice,
  AuthSlice,
  createProfileSlice,
  ProfileSlice,
  createAdminSlice,
  AdminSlice,
  createVenueSlice,
  VenueSlice,
  BookingSlice,
  createBookingSlice,
} from "./slices";

export type AuthStore = AuthSlice &
  ProfileSlice &
  AdminSlice &
  VenueSlice &
  BookingSlice;

export const useAuthStore = create<AuthStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createProfileSlice(...a),
      ...createAdminSlice(...a),
      ...createVenueSlice(...a),
      ...createBookingSlice(...a),
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
