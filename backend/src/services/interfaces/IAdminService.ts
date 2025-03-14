import { IAdmin } from "../../models/admin.model";
import { IVenue } from "../../models/venue.model";

export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ admin: IAdmin; token: string }>;
  getAdminDashboardStats(): Promise<{
    totalUsers: number;
    totalVendors: number;
    // totalBookings: number;  will add once I implement bookings system for now just commenting it out
    status: number;
  }>;
  listUsers(): Promise<{ users: any[]; status: number }>;
  listAllVendors(): Promise<{ vendors: any[]; status: number }>;
  listPendingVendors(): Promise<{ vendors: any[]; status: number }>;
  listPendingVenues(): Promise<{
    status: number;
    venues: IVenue[];
  }>;
  approveVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }>;
  rejectVendor(
    vendorId: string
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
    venueId: string
  ): Promise<{ message: string; status: number; venue: IVenue }>;
}
