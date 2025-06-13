import { IAdmin } from "../models/admin.model";
import { IUser } from "../models/user.model";
import { IVendor } from "../models/vendor.model";
import { IVenue } from "../models/venue.model";
import {
  AdminLoginResponseDto,
  AdminDashboardStatsResponseDto,
  UserDto,
  VendorDto,
  VenueDto,
} from "../dto/admin.dto";

export class AdminMapper {
  static toLoginResponse(
    admin: IAdmin,
    token: string,
    message: string
  ): AdminLoginResponseDto {
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      token,
      message,
    };
  }

  static toDashboardStats(
    totalUsers: number,
    totalVendors: number,
    totalBookings: number
  ): AdminDashboardStatsResponseDto {
    return {
      totalUsers,
      totalVendors,
      totalBookings,
    };
  }

  static toUserDto(user: IUser): UserDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  static toUserDtoArray(users: IUser[]): UserDto[] {
    return users.map((user) => this.toUserDto(user));
  }

  static toVendorDto(vendor: IVendor): VendorDto {
    return {
      id: vendor._id.toString(),
      businessName: vendor.businessName,
      email: vendor.email,
      status: vendor.status,
      businessAddress: vendor.businessAddress,
      rejectionReason: vendor.rejectionReason,
      createdAt: vendor.createdAt,
    };
  }

  static toVendorDtoArray(vendors: IVendor[]): VendorDto[] {
    return vendors.map((vendor) => this.toVendorDto(vendor));
  }

  static toVenueDto(venue: IVenue): VenueDto {
    return {
      id: (venue._id as any).toString(),
      name: venue.name,
      address: venue.address,
      verificationStatus: venue.verificationStatus,
      rejectionReason: venue.rejectionReason,
      createdAt: venue.createdAt,
    };
  }

  static toVenueDtoArray(venues: IVenue[]): VenueDto[] {
    return venues.map((venue) => this.toVenueDto(venue));
  }
}
