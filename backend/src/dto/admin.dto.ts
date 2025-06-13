export class AdminLoginRequestDto {
  email!: string;
  password!: string;
}

export class AdminLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  token!: string;
  message!: string;
}

export class AdminDashboardStatsResponseDto {
  totalUsers!: number;
  totalVendors!: number;
  totalBookings!: number;
}

export class UserDto {
  id!: string;
  name!: string;
  email!: string;
  status!: string;
  createdAt!: Date;
}

export class VendorDto {
  id!: string;
  businessName!: string;
  email!: string;
  status!: string;
  businessAddress?: string;
  rejectionReason?: string;
  createdAt!: Date;
}

export class VenueDto {
  id!: string;
  name!: string;
  address!: string;
  verificationStatus!: string;
  rejectionReason?: string;
  createdAt!: Date;
}

export class UpdateVendorStatusRequestDto {
  status!: "active" | "blocked" | "rejected";
  rejectionReason?: string;
}

export class UpdateUserStatusRequestDto {
  status!: "active" | "blocked";
}

export class UpdateVenueStatusRequestDto {
  verificationStatus!: "approved" | "rejected";
  rejectionReason?: string;
}

export class ListResponseDto<T> {
  data!: T[];
  message?: string;
}
