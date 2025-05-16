import { IUser } from "../../models/user.model";
export interface IUserService {
  registerUser(
    userData: Partial<IUser>
  ): Promise<{ message: string; status: number }>;
  verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }>;
  resendOTP(email: string): Promise<{ message: string; status: number }>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; message: string; status: number }>;
  processGoogleAuth(
    profile: any
  ): Promise<{ user: IUser; token: string; message: string; status: number }>;
  forgotPassword(email: string): Promise<{ message: string; status: number }>;
  resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ message: string; status: number }>;
  updateUserProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<{ message: string; status: number; user: IUser }>;
  changeUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ message: string; status: number }>;
}
