import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IAdminService } from "./interfaces/IAdminService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IVendorRepository } from "../repositories/interfaces/IVendorRepository";
import { isValidEmail } from "../utils/validators";
import { IVenue } from "../models/venue.model";
import { IVenueRepository } from "../repositories/interfaces/IVenueRepository";
import { IVendor } from "../models/vendor.model";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";
import { AdminMapper } from "../mappers/admin.mapper";
import {
  AdminLoginResponseDto,
  AdminDashboardStatsResponseDto,
  UserDto,
  VendorDto,
  VenueDto,
  ListResponseDto,
} from "../dto/admin.dto";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TOKENS.IAdminRepository) private adminRepo: IAdminRepository,
    @inject(TOKENS.IUserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.IVendorRepository) private vendorRepo: IVendorRepository,
    @inject(TOKENS.IVenueRepository) private venueRepo: IVenueRepository,
    @inject(TOKENS.IBookingRepository) private bookingRepo: IBookingRepository
  ) {}

  async loginAdmin(
    email: string,
    password: string
  ): Promise<{ response: AdminLoginResponseDto; status: number }> {
    if (!isValidEmail(email)) throw new Error("Invalid email format");
    if (!password) throw new Error("Password is required");

    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);

    const token = jwt.sign({ userId: admin._id, type: "admin" }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      response: AdminMapper.toLoginResponse(
        admin,
        token,
        MESSAGES.SUCCESS.LOGIN
      ),
      status: STATUS_CODES.OK,
    };
  }

  async getAdminDashboardStats(): Promise<{
    response: AdminDashboardStatsResponseDto;
    status: number;
  }> {
    const [totalUsers, totalVendors, totalBookings] = await Promise.all([
      this.userRepo.countDocuments({}),
      this.vendorRepo.countDocuments({}),
      this.bookingRepo.countDocuments({}),
    ]);

    return {
      response: AdminMapper.toDashboardStats(
        totalUsers,
        totalVendors,
        totalBookings
      ),
      status: STATUS_CODES.OK,
    };
  }

  async listUsers(
    search = ""
  ): Promise<{ response: ListResponseDto<UserDto>; status: number }> {
    const users = await this.userRepo.findBySearchTerm(search);
    return {
      response: {
        data: AdminMapper.toUserDtoArray(users),
        message: MESSAGES.SUCCESS.USERS_FETCHED,
      },
      status: STATUS_CODES.OK,
    };
  }

  async listAllVendors(
    searchQuery = ""
  ): Promise<{ response: ListResponseDto<VendorDto>; status: number }> {
    const filter: any = { status: { $nin: ["pending", "rejected"] } };

    if (searchQuery.trim()) {
      filter.$or = [
        { businessName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const vendors = await this.vendorRepo.find(filter);
    return {
      response: {
        data: AdminMapper.toVendorDtoArray(vendors),
        message: MESSAGES.SUCCESS.VENDORS_FETCHED,
      },
      status: STATUS_CODES.OK,
    };
  }

  async listPendingVendors(
    search = ""
  ): Promise<{ response: ListResponseDto<VendorDto>; status: number }> {
    let query: any = { status: "pending" };

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const vendors = await this.vendorRepo.find(query);
    return {
      response: {
        data: AdminMapper.toVendorDtoArray(vendors),
        message: MESSAGES.SUCCESS.PENDING_VENDORS_FETCHED,
      },
      status: STATUS_CODES.OK,
    };
  }

  async listPendingVenues(
    searchTerm = ""
  ): Promise<{ response: ListResponseDto<VenueDto>; status: number }> {
    const searchCondition: any = { verificationStatus: "pending" };

    if (searchTerm) {
      searchCondition.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const venues = await this.venueRepo.find(searchCondition);
    return {
      response: {
        data: AdminMapper.toVenueDtoArray(venues),
        message: MESSAGES.SUCCESS.PENDING_VENUES_FETCHED,
      },
      status: STATUS_CODES.OK,
    };
  }

  async listApprovedVenues(
    searchTerm = ""
  ): Promise<{ response: ListResponseDto<VenueDto>; status: number }> {
    let query: any = { verificationStatus: "approved" };

    if (searchTerm.trim()) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const venues = await this.venueRepo.find(query);
    return {
      response: {
        data: AdminMapper.toVenueDtoArray(venues),
        message: MESSAGES.SUCCESS.APPROVED_VENUES_FETCHED,
      },
      status: STATUS_CODES.OK,
    };
  }

  async approveVendor(
    vendorId: string
  ): Promise<{ response: VendorDto; message: string; status: number }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status !== "pending")
      throw new Error("Vendor not pending approval");

    const updatedVendor = await this.vendorRepo.update(vendorId, {
      status: "active",
    });
    if (!updatedVendor) throw new Error("Could not approve vendor");

    return {
      message: MESSAGES.SUCCESS.VENDOR_APPROVED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toVendorDto(updatedVendor),
    };
  }

  async rejectVendor(
    vendorId: string,
    rejectionReason?: string
  ): Promise<{ response: VendorDto; message: string; status: number }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status !== "pending")
      throw new Error("Vendor not pending approval");

    const updateData: Partial<IVendor> = { status: "rejected" };
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    const updatedVendor = await this.vendorRepo.update(vendorId, updateData);
    if (!updatedVendor) throw new Error("Could not reject vendor");

    return {
      message: MESSAGES.SUCCESS.VENDOR_REJECTED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toVendorDto(updatedVendor),
    };
  }

  async blockVendor(
    vendorId: string
  ): Promise<{ response: VendorDto; message: string; status: number }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status === "blocked") throw new Error("Vendor already blocked");

    const updatedVendor = await this.vendorRepo.update(vendorId, {
      status: "blocked",
    });
    if (!updatedVendor) throw new Error("Could not block vendor");

    return {
      message: MESSAGES.SUCCESS.VENDOR_BLOCKED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toVendorDto(updatedVendor),
    };
  }

  async unblockVendor(
    vendorId: string
  ): Promise<{ response: VendorDto; message: string; status: number }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    if (vendor.status === "active") throw new Error("Vendor already active");

    const updatedVendor = await this.vendorRepo.update(vendorId, {
      status: "active",
    });
    if (!updatedVendor) throw new Error("Could not unblock vendor");

    return {
      message: MESSAGES.SUCCESS.VENDOR_UNBLOCKED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toVendorDto(updatedVendor),
    };
  }

  async blockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string; status: number }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.status === "blocked") throw new Error("User already blocked");

    const updatedUser = await this.userRepo.update(userId, {
      status: "blocked",
    });
    if (!updatedUser) throw new Error("Could not block user");

    return {
      message: MESSAGES.SUCCESS.USER_BLOCKED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toUserDto(updatedUser),
    };
  }

  async unblockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string; status: number }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.status === "active") throw new Error("User already active");

    const updatedUser = await this.userRepo.update(userId, {
      status: "active",
    });
    if (!updatedUser) throw new Error("Could not unblock user");

    return {
      message: MESSAGES.SUCCESS.USER_UNBLOCKED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toUserDto(updatedUser),
    };
  }

  async approveVenue(
    venueId: string
  ): Promise<{ response: VenueDto; message: string; status: number }> {
    const venue = await this.venueRepo.findById(venueId);
    if (!venue) throw new Error("Venue not found");
    if (venue.verificationStatus !== "pending")
      throw new Error("Venue not pending approval");

    const updatedVenue = await this.venueRepo.update(venueId, {
      verificationStatus: "approved",
    });
    if (!updatedVenue) throw new Error("Could not approve venue");

    return {
      message: MESSAGES.SUCCESS.VENUE_APPROVED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toVenueDto(updatedVenue),
    };
  }

  async rejectVenue(
    venueId: string,
    rejectionReason?: string
  ): Promise<{ response: VenueDto; message: string; status: number }> {
    const venue = await this.venueRepo.findById(venueId);
    if (!venue) throw new Error("Venue not found");
    if (venue.verificationStatus !== "pending")
      throw new Error("Venue not pending approval");

    const updateData: Partial<IVenue> = { verificationStatus: "rejected" };
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    const updatedVenue = await this.venueRepo.update(venueId, updateData);
    if (!updatedVenue) throw new Error("Could not reject venue");

    return {
      message: MESSAGES.SUCCESS.VENUE_REJECTED,
      status: STATUS_CODES.OK,
      response: AdminMapper.toVenueDto(updatedVenue),
    };
  }
}
