import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import vendorRepository from "../repositories/vendor.repository";
import { IVendor } from "../models/vendor.model";
import { IVendorService } from "./interfaces/IVendorService";
import OTPService from "../utils/OTPService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

class VendorService implements IVendorService {
  private sanitizeVendor(vendor: IVendor) {
    const { password, otp, __v, ...sanitizedVendor } = vendor.toObject();
    return sanitizedVendor;
  }
  async registerVendor(
    vendorData: Partial<IVendor>
  ): Promise<{ message: string; status: number }> {
    const { name, email, phone, password, businessName, businessAddress } =
      vendorData;
    if (!name || !email || !password || !businessName || !businessAddress) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }
    const existingUser = await vendorRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp);

    await vendorRepository.create({
      ...vendorData,
      password: hashedPassword,
      isVerified: false,
      otp,
    });
    return { message: MESSAGES.SUCCESS.SIGNUP, status: STATUS_CODES.CREATED };
  }
  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }> {
    const vendor = await vendorRepository.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (vendor.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    vendor.isVerified = true;
    vendor.otp = undefined;
    await vendorRepository.update(vendor._id.toString(), vendor);

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }
  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const user = await vendorRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (user.isVerified) {
      throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);

    console.log(newOtp);

    user.otp = newOtp;
    await vendorRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }
  async loginVendor(
    email: string,
    password: string
  ): Promise<{
    vendor: IVendor;
    token: string;
    message: string;
    status: number;
  }> {
    const vendor = await vendorRepository.findByEmail(email);
    if (!vendor) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!vendor.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
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
      vendor: this.sanitizeVendor(vendor),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }
}

export default new VendorService();
