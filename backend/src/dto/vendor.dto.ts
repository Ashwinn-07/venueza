export class VendorRegisterRequestDto {
  name!: string;
  email!: string;
  phone?: string;
  password!: string;
  businessName!: string;
  businessAddress!: string;
}

export class VendorLoginRequestDto {
  email!: string;
  password!: string;
}

export class VendorLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  businessName!: string;
  businessAddress!: string;
  status!: string;
  token!: string;
  message!: string;
}

export class VendorProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  businessName!: string;
  businessAddress!: string;
  status!: string;
  documents?: string[];
}

export class VendorDocumentUploadResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  businessName!: string;
  businessAddress!: string;
  status!: string;
  documents!: string[];
}

export class VendorOTPRequestDto {
  email!: string;
  otp!: string;
}

export class VendorResetPasswordRequestDto {
  email!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;
}

export class VendorUpdateProfileRequestDto {
  name?: string;
  phone?: string;
  profileImage?: string;
  businessName?: string;
  businessAddress?: string;
}

export class VendorChangePasswordRequestDto {
  currentPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string;
}

export class MessageResponseDto {
  message!: string;
}
