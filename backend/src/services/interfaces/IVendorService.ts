import {
  MessageResponseDto,
  VendorDocumentUploadResponseDto,
  VendorLoginResponseDto,
  VendorProfileResponseDto,
} from "../../dto/vendor.dto";
import { IVendor } from "../../models/vendor.model";

export interface IVendorService {
  registerVendor(
    vendorData: Partial<IVendor>
  ): Promise<{ response: MessageResponseDto; status: number }>;
  verifyOTP(
    email: string,
    otp: string
  ): Promise<{ response: MessageResponseDto; status: number }>;
  resendOTP(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }>;
  loginVendor(
    email: string,
    password: string
  ): Promise<{
    response: VendorLoginResponseDto;
    status: number;
  }>;
  forgotPassword(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }>;
  updateVendorProfile(
    vendorId: string,
    updatedData: Partial<IVendor>
  ): Promise<{ response: VendorProfileResponseDto; status: number }>;
  changeVendorPassword(
    vendorId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }>;
  uploadDocuments(
    vendorId: string,
    documentUrls: string[]
  ): Promise<{ response: VendorDocumentUploadResponseDto; status: number }>;
}
