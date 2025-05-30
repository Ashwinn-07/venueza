import { IAdmin } from "../../models/admin.model";
import { IVenue } from "../../models/venue.model";

export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ admin: IAdmin; token: string; message: string; status: number }>;
  getAdminDashboardStats(): Promise<{
    totalUsers: number;
    totalVendors: number;
    totalBookings: number;
    status: number;
  }>;
  listUsers(search: string): Promise<{ users: any[]; status: number }>;
  listAllVendors(
    searchQuery: string
  ): Promise<{ vendors: any[]; status: number }>;
  listPendingVendors(
    search: string
  ): Promise<{ vendors: any[]; status: number }>;
  listPendingVenues(searchTerm: string): Promise<{
    status: number;
    venues: IVenue[];
  }>;
  listApprovedVenues(searchTerm: string): Promise<{
    status: number;
    venues: IVenue[];
  }>;
  approveVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }>;
  rejectVendor(
    vendorId: string,
    rejectionReason?: string
  ): Promise<{ message: string; status: number; vendor: any }>;
  blockVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }>;
  unblockVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }>;
  blockUser(
    userId: string
  ): Promise<{ message: string; status: number; user: any }>;
  unblockUser(
    userId: string
  ): Promise<{ message: string; status: number; user: any }>;
  approveVenue(
    venueId: string
  ): Promise<{ message: string; status: number; venue: IVenue }>;
  rejectVenue(
    venueId: string,
    rejectionReason?: string
  ): Promise<{ message: string; status: number; venue: IVenue }>;
}
