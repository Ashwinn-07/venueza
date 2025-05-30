import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IAdmin } from "../models/admin.model";
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

@injectable()
export class AdminService implements IAdminService {
  private sanitizeAdmin(admin: IAdmin) {
    const { password, __v, ...sanitizedAdmin } = admin.toObject();
    return sanitizedAdmin;
  }
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
  ): Promise<{
    admin: IAdmin;
    token: string;
    message: string;
    status: number;
  }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    const token = jwt.sign({ userId: admin._id, type: "admin" }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      admin: this.sanitizeAdmin(admin),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }
  async getAdminDashboardStats(): Promise<{
    totalUsers: number;
    totalVendors: number;
    totalBookings: number;
    status: number;
  }> {
    const totalUsers = await this.userRepo.countDocuments({});
    const totalVendors = await this.vendorRepo.countDocuments({});
    const totalBookings = await this.bookingRepo.countDocuments({});

    return {
      totalUsers,
      totalVendors,
      totalBookings,
      status: STATUS_CODES.OK,
    };
  }

  async listUsers(search = ""): Promise<{ users: any[]; status: number }> {
    const users = await this.userRepo.findBySearchTerm(search);
    return {
      users,
      status: STATUS_CODES.OK,
    };
  }

  async listAllVendors(
    searchQuery: string = ""
  ): Promise<{ vendors: any[]; status: number }> {
    const filter: any = {
      status: { $nin: ["pending", "rejected"] },
    };

    if (searchQuery && searchQuery.trim() !== "") {
      filter.$or = [
        { businessName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const vendors = await this.vendorRepo.find(filter);

    return {
      vendors,
      status: STATUS_CODES.OK,
    };
  }

  async listPendingVendors(
    search: string = ""
  ): Promise<{ vendors: any[]; status: number }> {
    let query: any = { status: "pending" };

    if (search) {
      query = {
        ...query,
        $or: [
          { businessName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { businessAddress: { $regex: search, $options: "i" } },
        ],
      };
    }

    const vendors = await this.vendorRepo.find(query);
    return {
      vendors,
      status: STATUS_CODES.OK,
    };
  }
  async listPendingVenues(searchTerm: string = ""): Promise<{
    status: number;
    venues: IVenue[];
  }> {
    const searchCondition: any = { verificationStatus: "pending" };

    if (searchTerm) {
      searchCondition.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const venues = await this.venueRepo.find(searchCondition);
    return {
      venues,
      status: STATUS_CODES.OK,
    };
  }
  async listApprovedVenues(
    searchTerm = ""
  ): Promise<{ status: number; venues: IVenue[] }> {
    let query: any = {
      verificationStatus: "approved",
    };

    if (searchTerm && searchTerm.trim() !== "") {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const venues = await this.venueRepo.find(query);
    return {
      venues,
      status: STATUS_CODES.OK,
    };
  }
  async approveVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (vendor.status !== "pending") {
      throw new Error("this vendor is not pending for approval");
    }
    const updatedVendor = await this.vendorRepo.update(vendorId, {
      status: "active",
    });
    if (!updatedVendor) {
      throw new Error("Could not approve vendor");
    }
    return {
      message: "Vendor approved successfully",
      status: STATUS_CODES.OK,
      vendor: updatedVendor,
    };
  }
  async rejectVendor(
    vendorId: string,
    rejectionReason?: string
  ): Promise<{ message: string; status: number; vendor: any }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (vendor.status !== "pending") {
      throw new Error("this vendor is not pending for approval");
    }
    const updateData: Partial<IVendor> = {
      status: "rejected",
    };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedVendor = await this.vendorRepo.update(vendorId, updateData);
    if (!updatedVendor) {
      throw new Error("could not reject vendor");
    }
    return {
      message: "vendor rejected successfully",
      status: STATUS_CODES.OK,
      vendor: updatedVendor,
    };
  }
  async blockVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error("vendor not found");
    }
    if (vendor.status === "blocked") {
      throw new Error("vendor is already blocked");
    }
    const updatedVendor = await this.vendorRepo.update(vendorId, {
      status: "blocked",
    });
    if (!updatedVendor) {
      throw new Error("could not block vendor");
    }
    return {
      message: "Vendor blocked successfully",
      status: STATUS_CODES.OK,
      vendor: updatedVendor,
    };
  }
  async unblockVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error("vendor not found");
    }
    if (vendor.status === "active") {
      throw new Error("vendor is already active");
    }
    const updatedVendor = await this.vendorRepo.update(vendorId, {
      status: "active",
    });
    if (!updatedVendor) {
      throw new Error("could not unblock vendor");
    }
    return {
      message: "vendor unblocked successfully",
      status: STATUS_CODES.OK,
      vendor: updatedVendor,
    };
  }
  async blockUser(
    userId: string
  ): Promise<{ message: string; status: number; user: any }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    if (user.status === "blocked") {
      throw new Error("user is already blocked");
    }
    const updatedUser = await this.userRepo.update(userId, {
      status: "blocked",
    });
    if (!updatedUser) {
      throw new Error("could not block user");
    }
    return {
      message: "User blocked successfully",
      status: STATUS_CODES.OK,
      user: updatedUser,
    };
  }
  async unblockUser(
    userId: string
  ): Promise<{ message: string; status: number; user: any }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    if (user.status === "active") {
      throw new Error("user is already active");
    }
    const updatedUser = await this.userRepo.update(userId, {
      status: "active",
    });
    if (!updatedUser) {
      throw new Error("could not unblock user");
    }
    return {
      message: "User unblocked successfully",
      status: STATUS_CODES.OK,
      user: updatedUser,
    };
  }
  async approveVenue(
    venueId: string
  ): Promise<{ message: string; status: number; venue: IVenue }> {
    const venue = await this.venueRepo.findById(venueId);
    if (!venue) {
      throw new Error("venue not found");
    }
    if (venue.verificationStatus !== "pending") {
      throw new Error("venue is not pending approval");
    }
    const updatedVenue = await this.venueRepo.update(venueId, {
      verificationStatus: "approved",
    });
    if (!updatedVenue) {
      throw new Error("could not approve venue");
    }
    return {
      message: "venue approved successfully",
      status: STATUS_CODES.OK,
      venue: updatedVenue,
    };
  }
  async rejectVenue(
    venueId: string,
    rejectionReason?: string
  ): Promise<{ message: string; status: number; venue: IVenue }> {
    const venue = await this.venueRepo.findById(venueId);
    if (!venue) {
      throw new Error("venue not found");
    }
    if (venue.verificationStatus !== "pending") {
      throw new Error("venue not pending for approval");
    }
    const updateData: Partial<IVenue> = {
      verificationStatus: "rejected",
    };

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedVenue = await this.venueRepo.update(venueId, updateData);
    if (!updatedVenue) {
      throw new Error("could not reject venue");
    }
    return {
      message: "venue rejected successfully",
      status: STATUS_CODES.OK,
      venue: updatedVenue,
    };
  }
}
