import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const userApi = axios.create({
  baseURL: `${API_URL}/user`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const vendorApi = axios.create({
  baseURL: `${API_URL}/vendor`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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
  userLogout: async () => {
    const response = await userApi.post("/logout");
    return response.data;
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
