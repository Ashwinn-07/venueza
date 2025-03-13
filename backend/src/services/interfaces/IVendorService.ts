import { IVendor } from "../../models/vendor.model";

export interface IVendorService {
  registerVendor(vendorData: Partial<IVendor>): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ message: string }>;
  resendOTP(email: string): Promise<{ message: string; status: number }>;
  loginVendor(
    email: string,
    password: string
  ): Promise<{ vendor: IVendor; token: string }>;
  forgotPassword(email: string): Promise<{ message: string; status: number }>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string; status: number }>;
  updateVendorProfile(
    vendorId: string,
    updatedData: Partial<IVendor>
  ): Promise<{ message: string; status: number; vendor: IVendor }>;
  changeVendorPassword(
    vendorId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ message: string; status: number }>;
  uploadDocuments(
    vendorId: string,
    documentUrls: string[]
  ): Promise<{ message: string; status: number; vendor: IVendor }>;
}
