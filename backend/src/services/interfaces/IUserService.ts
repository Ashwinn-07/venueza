import { IUser } from "../../models/user.model";
import {
  UserRegisterRequestDto,
  UserLoginResponseDto,
  UserProfileResponseDto,
  MessageResponseDto,
} from "../../dto/user.dto";

export interface IUserService {
  registerUser(
    userData: UserRegisterRequestDto
  ): Promise<{ response: MessageResponseDto; status: number }>;

  verifyOTP(
    email: string,
    otp: string
  ): Promise<{ response: MessageResponseDto; status: number }>;

  resendOTP(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }>;

  loginUser(
    email: string,
    password: string
  ): Promise<{ response: UserLoginResponseDto; status: number }>;

  processGoogleAuth(
    profile: any
  ): Promise<{ response: UserLoginResponseDto; status: number }>;

  forgotPassword(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }>;

  resetPassword(
    email: string,
    otp: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }>;

  updateUserProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<{
    response: UserProfileResponseDto;
    message: string;
    status: number;
  }>;

  changeUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }>;
}
