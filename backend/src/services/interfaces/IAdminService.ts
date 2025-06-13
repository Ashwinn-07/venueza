import {
  AdminDashboardStatsResponseDto,
  AdminLoginResponseDto,
  ListResponseDto,
  UserDto,
  VendorDto,
  VenueDto,
} from "../../dto/admin.dto";
import { IAdmin } from "../../models/admin.model";
import { IVenue } from "../../models/venue.model";

export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ response: AdminLoginResponseDto; status: number }>;
  getAdminDashboardStats(): Promise<{
    response: AdminDashboardStatsResponseDto;
    status: number;
  }>;
  listUsers(
    search: string
  ): Promise<{ response: ListResponseDto<UserDto>; status: number }>;
  listAllVendors(
    searchQuery: string
  ): Promise<{ response: ListResponseDto<VendorDto>; status: number }>;
  listPendingVendors(
    search: string
  ): Promise<{ response: ListResponseDto<VendorDto>; status: number }>;
  listPendingVenues(searchTerm: string): Promise<{
    response: ListResponseDto<VenueDto>;
    status: number;
  }>;
  listApprovedVenues(searchTerm: string): Promise<{
    response: ListResponseDto<VenueDto>;
    status: number;
  }>;
  approveVendor(
    vendorId: string
  ): Promise<{ response: VendorDto; message: string; status: number }>;
  rejectVendor(
    vendorId: string,
    rejectionReason?: string
  ): Promise<{ response: VendorDto; message: string; status: number }>;
  blockVendor(
    vendorId: string
  ): Promise<{ response: VendorDto; message: string; status: number }>;
  unblockVendor(
    vendorId: string
  ): Promise<{ response: VendorDto; message: string; status: number }>;
  blockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string; status: number }>;
  unblockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string; status: number }>;
  approveVenue(
    venueId: string
  ): Promise<{ response: VenueDto; message: string; status: number }>;
  rejectVenue(
    venueId: string,
    rejectionReason?: string
  ): Promise<{ response: VenueDto; message: string; status: number }>;
}
