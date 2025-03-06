import { IVendor } from "../../models/vendor.model";

export interface IVendorService {
  registerVendor(vendorData: Partial<IVendor>): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ message: string }>;
  resendOTP(email: string): Promise<{ message: string; status: number }>;
  loginVendor(
    email: string,
    password: string
  ): Promise<{ vendor: IVendor; token: string }>;
}
