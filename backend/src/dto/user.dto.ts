export class UserRegisterRequestDto {
  name!: string;
  email!: string;
  phone?: string;
  password!: string;
  confirmPassword!: string;
}

export class UserLoginRequestDto {
  email!: string;
  password!: string;
}

export class UserLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  status!: string;
  token!: string;
  message!: string;
}

export class UserProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  status!: string;
}

export class UserOTPRequestDto {
  email!: string;
  otp!: string;
}

export class UserResetPasswordRequestDto {
  email!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;
}

export class UserUpdateProfileRequestDto {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export class UserChangePasswordRequestDto {
  currentPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string;
}

export class MessageResponseDto {
  message!: string;
}
