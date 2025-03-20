import { userApi, vendorApi, adminApi } from "./api";

export const authService = {
  userSignup: async (userData: any) => {
    const response = await userApi.post("/signup", userData);
    return response.data;
  },
  userLogin: async (credentials: { email: string; password: string }) => {
    const response = await userApi.post("/login", credentials);
    return response.data;
  },
  userVerifyOtp: async (data: { email: string; otp: string }) => {
    const response = await userApi.post("/verify-otp", data);
    return response.data;
  },
  userResendOtp: async (email: string) => {
    const response = await userApi.post("/resend-otp", { email });
    return response.data;
  },
  userForgotPassword: async (email: string) => {
    const response = await userApi.post("/forgot-password", { email });
    return response.data;
  },
  userResetPassword: async (data: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await userApi.post("/reset-password", data);
    return response.data;
  },
  userLogout: async () => {
    const response = await userApi.post("/logout");
    return response.data;
  },
  getGoogleAuthUrl: () => {
    return `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/google`;
  },

  vendorSignup: async (vendorData: any) => {
    const response = await vendorApi.post("/signup", vendorData);
    return response.data;
  },
  vendorLogin: async (credentials: { email: string; password: string }) => {
    const response = await vendorApi.post("/login", credentials);
    return response.data;
  },
  vendorVerifyOtp: async (data: { email: string; otp: string }) => {
    const response = await vendorApi.post("/verify-otp", data);
    return response.data;
  },
  vendorResendOtp: async (email: string) => {
    const response = await vendorApi.post("/resend-otp", { email });
    return response.data;
  },
  vendorForgotPassword: async (email: string) => {
    const response = await vendorApi.post("/forgot-password", { email });
    return response.data;
  },
  vendorResetPassword: async (data: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await vendorApi.post("/reset-password", data);
    return response.data;
  },
  vendorLogout: async () => {
    const response = await vendorApi.post("/logout");
    return response.data;
  },

  adminLogin: async (credentials: { email: string; password: string }) => {
    const response = await adminApi.post("/login", credentials);
    return response.data;
  },
  adminLogout: async () => {
    const response = await adminApi.post("/logout");
    return response.data;
  },
};
