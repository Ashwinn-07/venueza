import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/IUserService";
import OTPService from "../utils/OTPService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

interface SignupData extends Partial<IUser> {
  confirmPassword?: string;
}

class UserService implements IUserService {
  private sanitizeUser(user: IUser) {
    const { password, otp, __v, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }
  async registerUser(
    userData: SignupData
  ): Promise<{ message: string; status: number }> {
    const { name, email, password, confirmPassword, phone } = userData;
    if (!name || !email || !password || !confirmPassword) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }
    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp);

    await userRepository.create({
      ...userData,
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
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (user.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    user.isVerified = true;
    user.otp = undefined;
    await userRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }
  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }
}

export default new UserService();
