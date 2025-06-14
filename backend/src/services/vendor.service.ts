import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IVendor } from "../models/vendor.model";
import { IVendorService } from "./interfaces/IVendorService";
import { IVendorRepository } from "../repositories/interfaces/IVendorRepository";
import OTPService from "../utils/OTPService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidOTP,
} from "../utils/validators";
import { TOKENS } from "../config/tokens";
import { VendorMapper } from "../mappers/vendor.mapper";
import {
  VendorLoginResponseDto,
  VendorProfileResponseDto,
  VendorDocumentUploadResponseDto,
  MessageResponseDto,
} from "../dto/vendor.dto";

@injectable()
export class VendorService implements IVendorService {
  constructor(
    @inject(TOKENS.IVendorRepository)
    private vendorRepo: IVendorRepository
  ) {}

  async registerVendor(
    vendorData: Partial<IVendor>
  ): Promise<{ response: MessageResponseDto; status: number }> {
    const { name, email, phone, password, businessName, businessAddress } =
      vendorData;

    if (!name || !email || !password || !businessName || !businessAddress) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }

    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    if (phone && !isValidPhone(phone)) {
      throw new Error("Invalid phone number format");
    }

    const existingVendor = await this.vendorRepo.findByEmail(email);
    if (existingVendor) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp);

    await this.vendorRepo.create({
      ...vendorData,
      password: hashedPassword,
      isVerified: false,
      otp,
    });

    return {
      response: { message: MESSAGES.SUCCESS.SIGNUP },
      status: STATUS_CODES.CREATED,
    };
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    if (!isValidOTP(otp)) {
      throw new Error("OTP must be a 6-digit number");
    }

    const vendor = await this.vendorRepo.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (vendor.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    vendor.isVerified = true;
    vendor.otp = undefined;
    await this.vendorRepo.update(vendor._id.toString(), vendor);

    return {
      response: { message: MESSAGES.SUCCESS.OTP_VERIFIED },
      status: STATUS_CODES.OK,
    };
  }

  async resendOTP(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    const vendor = await this.vendorRepo.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (vendor.isVerified) {
      throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    }

    const newOtp = OTPService.generateOTP();
    await OTPService.sendOTP(email, newOtp);

    console.log(newOtp);

    vendor.otp = newOtp;
    await this.vendorRepo.update(vendor._id.toString(), vendor);

    return {
      response: { message: MESSAGES.SUCCESS.OTP_RESENT },
      status: STATUS_CODES.OK,
    };
  }

  async loginVendor(
    email: string,
    password: string
  ): Promise<{ response: VendorLoginResponseDto; status: number }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const vendor = await this.vendorRepo.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!vendor.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    if (vendor.status === "blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED);
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign({ userId: vendor._id, type: "vendor" }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      response: VendorMapper.toLoginResponse(
        vendor,
        token,
        MESSAGES.SUCCESS.LOGIN
      ),
      status: STATUS_CODES.OK,
    };
  }

  async forgotPassword(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    const vendor = await this.vendorRepo.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const otp = OTPService.generateOTP();
    vendor.otp = otp;
    await this.vendorRepo.update(vendor._id.toString(), vendor);
    await OTPService.sendOTP(email, otp);

    console.log(otp);

    return {
      response: { message: MESSAGES.SUCCESS.OTP_SENT },
      status: STATUS_CODES.OK,
    };
  }

  async resetPassword(
    email: string,
    otp: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    if (!isValidOTP(otp)) {
      throw new Error("OTP must be a 6-digit number");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    if (password != confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const vendor = await this.vendorRepo.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (vendor.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    vendor.password = hashedPassword;
    vendor.otp = undefined;
    await this.vendorRepo.update(vendor._id.toString(), vendor);

    return {
      response: { message: MESSAGES.SUCCESS.PASSWORD_RESET },
      status: STATUS_CODES.OK,
    };
  }

  async updateVendorProfile(
    vendorId: string,
    updatedData: Partial<IVendor>
  ): Promise<{ response: VendorProfileResponseDto; status: number }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const allowedFields = [
      "name",
      "phone",
      "businessName",
      "businessAddress",
      "profileImage",
    ];
    const fieldsToUpdate: Partial<IVendor> = {};

    for (const key in updatedData) {
      if (allowedFields.includes(key)) {
        if (key === "name" && typeof updatedData.name === "string") {
          if (updatedData.name.trim().length === 0) {
            throw new Error("Name cannot be empty");
          }
          fieldsToUpdate.name = updatedData.name.trim();
        }
        if (key === "phone" && typeof updatedData.phone === "string") {
          if (!isValidPhone(updatedData.phone)) {
            throw new Error("Invalid phone number format");
          }
          fieldsToUpdate.phone = updatedData.phone;
        }
        if (
          key === "businessName" &&
          typeof updatedData.businessName === "string"
        ) {
          if (updatedData.businessName.trim().length === 0) {
            throw new Error("Business name cannot be empty");
          }
          fieldsToUpdate.businessName = updatedData.businessName.trim();
        }
        if (
          key === "businessAddress" &&
          typeof updatedData.businessAddress === "string"
        ) {
          if (updatedData.businessAddress.trim().length === 0) {
            throw new Error("Business address cannot be empty");
          }
          fieldsToUpdate.businessAddress = updatedData.businessAddress.trim();
        }
        if (
          key === "profileImage" &&
          typeof updatedData.profileImage === "string"
        ) {
          fieldsToUpdate.profileImage = updatedData.profileImage;
        }
      }
    }

    const updatedVendor = await this.vendorRepo.update(
      vendorId,
      fieldsToUpdate
    );
    if (!updatedVendor) {
      throw new Error("Profile update failed.");
    }

    return {
      response: VendorMapper.toProfileResponse(updatedVendor),
      status: STATUS_CODES.OK,
    };
  }

  async changeVendorPassword(
    vendorId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    if (!isValidPassword(newPassword)) {
      throw new Error(
        "New password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      vendor.password
    );
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.vendorRepo.update(vendorId, { password: hashedPassword });

    return {
      response: { message: MESSAGES.SUCCESS.PASSWORD_UPDATED },
      status: STATUS_CODES.OK,
    };
  }

  async uploadDocuments(
    vendorId: string,
    documentUrls: string[]
  ): Promise<{ response: VendorDocumentUploadResponseDto; status: number }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    vendor.documents = [...vendor.documents, ...documentUrls];

    if (vendor.status === "blocked") {
      throw new Error("Your account is blocked, please contact admin");
    }

    vendor.status = "pending";

    const updatedVendor = await this.vendorRepo.update(vendorId, {
      documents: vendor.documents,
      status: vendor.status,
    });

    if (!updatedVendor) {
      throw new Error("Failed to upload documents");
    }

    return {
      response: VendorMapper.toDocumentUploadResponse(updatedVendor),
      status: STATUS_CODES.OK,
    };
  }
}
