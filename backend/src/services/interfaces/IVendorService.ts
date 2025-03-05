import { IVendor } from "../../models/vendor.model";

export interface IVendorService {
  registerVendor(vendorData: Partial<IVendor>): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ message: string }>;
  loginVendor(
    email: string,
    password: string
  ): Promise<{ vendor: IVendor; token: string }>;
}
