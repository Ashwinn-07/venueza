import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const userApi = axios.create({
  baseURL: `${API_URL}/api/user`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const vendorApi = axios.create({
  baseURL: `${API_URL}/api/vendor`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
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
    return `${API_URL}/api/user/auth/google`;
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
};

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
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await adminApi.get("/dashboard");
    return response.data;
  },
  listAllUsers: async () => {
    const response = await adminApi.get("/users");
    return response.data;
  },
  listAllVendors: async () => {
    const response = await adminApi.get("/vendors");
    return response.data;
  },
  listPendingVendors: async () => {
    const response = await adminApi.get("/vendors/pending");
    return response.data;
  },
  listPendingVenues: async () => {
    const response = await adminApi.get("/venues/pending");
    return response.data;
  },
  listApprovedVenues: async () => {
    const response = await adminApi.get("/venues");
    return response.data;
  },
  updateUserStatus: async (userId: string, status: string) => {
    const response = await adminApi.patch(`/users/${userId}`, { status });
    return response.data;
  },
  updateVendorStatus: async (vendorId: string, status: string) => {
    const response = await adminApi.patch(`/vendors/${vendorId}`, { status });
    return response.data;
  },
  updateVenueVerificationStatus: async (
    venueId: string,
    verificationStatus: string
  ) => {
    const response = await adminApi.patch(`/venues/${venueId}`, {
      verificationStatus,
    });
    return response.data;
  },
};
