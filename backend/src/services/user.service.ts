import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/IUserService";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";

import OTPService from "../utils/OTPService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidOTP,
} from "../utils/validators";
import { TOKENS } from "../config/tokens";
import { UserMapper } from "../mappers/user.mapper";
import {
  UserRegisterRequestDto,
  UserLoginResponseDto,
  UserProfileResponseDto,
  MessageResponseDto,
} from "../dto/user.dto";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TOKENS.IUserRepository)
    private userRepo: IUserRepository
  ) {}

  async registerUser(
    userData: UserRegisterRequestDto
  ): Promise<{ response: MessageResponseDto; status: number }> {
    const { name, email, password, confirmPassword, phone } = userData;

    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP();

    await OTPService.sendOTP(email, otp);
    console.log(otp);

    await this.userRepo.create({
      ...userData,
      password: hashedPassword,
      isVerified: false,
      otp,
    });

    return {
      response: UserMapper.toMessageResponse(MESSAGES.SUCCESS.SIGNUP),
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

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (user.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    user.isVerified = true;
    user.otp = undefined;
    await this.userRepo.update(user._id.toString(), user);

    return {
      response: UserMapper.toMessageResponse(MESSAGES.SUCCESS.OTP_VERIFIED),
      status: STATUS_CODES.OK,
    };
  }

  async resendOTP(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    const user = await this.userRepo.findByEmail(email);
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
    await this.userRepo.update(user._id.toString(), user);

    return {
      response: UserMapper.toMessageResponse(MESSAGES.SUCCESS.OTP_RESENT),
      status: STATUS_CODES.OK,
    };
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ response: UserLoginResponseDto; status: number }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    if (user.status === "blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED);
    }

    if (!user.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign({ userId: user._id, type: "user" }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      response: UserMapper.toLoginResponse(user, token, MESSAGES.SUCCESS.LOGIN),
      status: STATUS_CODES.OK,
    };
  }

  async processGoogleAuth(
    profile: any
  ): Promise<{ response: UserLoginResponseDto; status: number }> {
    const email = profile.email;
    let user = await this.userRepo.findByEmail(email);

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await this.userRepo.update(user._id.toString(), user);
      }
    } else {
      user = await this.userRepo.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        password: "",
        isVerified: true,
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        type: "user",
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return {
      response: UserMapper.toLoginResponse(user, token, MESSAGES.SUCCESS.LOGIN),
      status: STATUS_CODES.OK,
    };
  }

  async forgotPassword(
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const otp = OTPService.generateOTP();
    user.otp = otp;
    await this.userRepo.update(user._id.toString(), user);
    await OTPService.sendOTP(email, otp);
    console.log(otp);

    return {
      response: UserMapper.toMessageResponse(MESSAGES.SUCCESS.OTP_SENT),
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

    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (user.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await this.userRepo.update(user._id.toString(), user);

    return {
      response: UserMapper.toMessageResponse(MESSAGES.SUCCESS.PASSWORD_RESET),
      status: STATUS_CODES.OK,
    };
  }

  async updateUserProfile(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<{
    response: UserProfileResponseDto;
    message: string;
    status: number;
  }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const allowedFields = ["name", "phone", "profileImage"];
    const fieldsToUpdate: Partial<IUser> = {};

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
          key === "profileImage" &&
          typeof updatedData.profileImage === "string"
        ) {
          fieldsToUpdate.profileImage = updatedData.profileImage;
        }
      }
    }

    const updatedUser = await this.userRepo.update(userId, fieldsToUpdate);
    if (!updatedUser) {
      throw new Error(MESSAGES.ERROR.PROFILE_UPDATE_FAILED);
    }

    return {
      response: UserMapper.toProfileResponse(updatedUser),
      message: MESSAGES.SUCCESS.PROFILE_UPDATED,
      status: STATUS_CODES.OK,
    };
  }

  async changeUserPassword(
    userId: string,
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

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (user.googleId && (!user.password || user.password === "")) {
      throw new Error(
        "You are authenticated via Google. Please use Google authentication."
      );
    }

    if (!user.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(userId, { password: hashedPassword });

    return {
      response: UserMapper.toMessageResponse(MESSAGES.SUCCESS.PASSWORD_UPDATED),
      status: STATUS_CODES.OK,
    };
  }
}
