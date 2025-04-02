import { adminApi } from "./api";

export const adminService = {
  getDashboardStats: async () => {
    const response = await adminApi.get("/dashboard");
    return response.data;
  },
  listAllUsers: async (search = "") => {
    const response = await adminApi.get(
      `/users${search ? `?search=${search}` : ""}`
    );
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
  updateVendorStatus: async (
    vendorId: string,
    status: string,
    rejectionReason?: string
  ) => {
    const payload: any = { status };

    if (status === "rejected" && rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }

    const response = await adminApi.patch(`/vendors/${vendorId}`, payload);
    return response.data;
  },
  updateVenueVerificationStatus: async (
    venueId: string,
    verificationStatus: string,
    rejectionReason?: string
  ) => {
    const payload: any = { verificationStatus };

    if (verificationStatus === "rejected" && rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }

    const response = await adminApi.patch(`/venues/${venueId}`, payload);
    return response.data;
  },
};
