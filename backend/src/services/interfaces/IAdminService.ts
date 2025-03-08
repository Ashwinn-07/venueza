import { IAdmin } from "../../models/admin.model";

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
}
