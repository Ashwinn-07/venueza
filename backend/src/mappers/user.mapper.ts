import { IUser } from "../models/user.model";
import {
  UserLoginResponseDto,
  UserProfileResponseDto,
  MessageResponseDto,
} from "../dto/user.dto";

export class UserMapper {
  static toLoginResponse(
    user: IUser,
    token: string,
    message: string
  ): UserLoginResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      status: user.status,
      token,
      message,
    };
  }

  static toProfileResponse(user: IUser): UserProfileResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      status: user.status,
    };
  }

  static toMessageResponse(message: string): MessageResponseDto {
    return { message };
  }
}
