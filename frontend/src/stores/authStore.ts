import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../services/api";

type AuthType = "user" | "vendor" | "admin";

interface AuthState {
  user: any | null;
  token: string | null;
  authType: AuthType | null;
  isAuthenticated: boolean;

  login: (email: string, password: string, authType: AuthType) => Promise<void>;
  signup: (userData: any, authType: AuthType) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: sessionStorage.getItem("auth-token") || null,
      authType: sessionStorage.getItem("auth-type") as AuthType | null,
      isAuthenticated: !!sessionStorage.getItem("auth-token"),

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

          sessionStorage.setItem("auth-token", response.token);
          sessionStorage.setItem("auth-type", authType);

          set({
            user: response.user,
            token: response.token,
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

      logout: () => {
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("auth-type");

        set({
          user: null,
          token: null,
          authType: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
