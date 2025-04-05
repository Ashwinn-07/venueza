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
  listAllVendors: async (searchQuery = "") => {
    const response = await adminApi.get("/vendors", {
      params: { search: searchQuery },
    });
    return response.data;
  },
  listPendingVendors: async (search = "") => {
    const response = await adminApi.get(
      `/vendors/pending${search ? `?search=${search}` : ""}`
    );
    return response.data;
  },

  listPendingVenues: async (searchTerm = "") => {
    const response = await adminApi.get("/venues/pending", {
      params: { search: searchTerm },
    });
    return response.data;
  },
  listApprovedVenues: async (searchTerm = "") => {
    const response = await adminApi.get("/venues", {
      params: { search: searchTerm },
    });
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
  getTransactionHistory: async () => {
    const response = await adminApi.get("/transactions");
    return response.data;
  },
};
