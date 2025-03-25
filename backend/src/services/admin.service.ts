import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminRepository from "../repositories/admin.repository";
import { IAdmin } from "../models/admin.model";
import { IAdminService } from "./interfaces/IAdminService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import userRepository from "../repositories/user.repository";
import vendorRepository from "../repositories/vendor.repository";
import { isValidEmail } from "../utils/validators";
import { IVenue } from "../models/venue.model";
import venueRepository from "../repositories/venue.repository";
import { IVendor } from "../models/vendor.model";
import bookingRepository from "../repositories/booking.repository";

class AdminService implements IAdminService {
  private sanitizeAdmin(admin: IAdmin) {
    const { password, __v, ...sanitizedAdmin } = admin.toObject();
    return sanitizedAdmin;
  }
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
    const admin = await adminRepository.findByEmail(email);
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
    const totalUsers = await userRepository.countDocuments({});
    const totalVendors = await vendorRepository.countDocuments({});
    const totalBookings = await bookingRepository.countDocuments({});

    return {
      totalUsers,
      totalVendors,
      totalBookings,
      status: STATUS_CODES.OK,
    };
  }

  async listUsers(): Promise<{ users: any[]; status: number }> {
    const users = await userRepository.find({});
    return {
      users,
      status: STATUS_CODES.OK,
    };
  }

  async listAllVendors(): Promise<{ vendors: any[]; status: number }> {
    const vendors = await vendorRepository.find({
      status: { $nin: ["pending", "rejected"] },
    });
    return {
      vendors,
      status: STATUS_CODES.OK,
    };
  }

  async listPendingVendors(): Promise<{ vendors: any[]; status: number }> {
    const vendors = await vendorRepository.find({ status: "pending" });
    return {
      vendors,
      status: STATUS_CODES.OK,
    };
  }
  async listPendingVenues(): Promise<{
    status: number;
    venues: IVenue[];
  }> {
    const venues = await venueRepository.find({
      verificationStatus: "pending",
    });
    return {
      venues,
      status: STATUS_CODES.OK,
    };
  }
  async listApprovedVenues(): Promise<{ status: number; venues: IVenue[] }> {
    const venues = await venueRepository.find({
      verificationStatus: "approved",
    });
    return {
      venues,
      status: STATUS_CODES.OK,
    };
  }
  async approveVendor(
    vendorId: string
  ): Promise<{ message: string; status: number; vendor: any }> {
    const vendor = await vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (vendor.status !== "pending") {
      throw new Error("this vendor is not pending for approval");
    }
    const updatedVendor = await vendorRepository.update(vendorId, {
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
    const vendor = await vendorRepository.findById(vendorId);
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

    const updatedVendor = await vendorRepository.update(vendorId, updateData);
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
    const vendor = await vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new Error("vendor not found");
    }
    if (vendor.status === "blocked") {
      throw new Error("vendor is already blocked");
    }
    const updatedVendor = await vendorRepository.update(vendorId, {
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
    const vendor = await vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new Error("vendor not found");
    }
    if (vendor.status === "active") {
      throw new Error("vendor is already active");
    }
    const updatedVendor = await vendorRepository.update(vendorId, {
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
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    if (user.status === "blocked") {
      throw new Error("user is already blocked");
    }
    const updatedUser = await userRepository.update(userId, {
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
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    if (user.status === "active") {
      throw new Error("user is already active");
    }
    const updatedUser = await userRepository.update(userId, {
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
    const venue = await venueRepository.findById(venueId);
    if (!venue) {
      throw new Error("venue not found");
    }
    if (venue.verificationStatus !== "pending") {
      throw new Error("venue is not pending approval");
    }
    const updatedVenue = await venueRepository.update(venueId, {
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
    const venue = await venueRepository.findById(venueId);
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

    const updatedVenue = await venueRepository.update(venueId, updateData);
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

export default new AdminService();
