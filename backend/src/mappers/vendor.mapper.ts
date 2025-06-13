import { IVendor } from "../models/vendor.model";
import {
  VendorLoginResponseDto,
  VendorProfileResponseDto,
  VendorDocumentUploadResponseDto,
} from "../dto/vendor.dto";

export class VendorMapper {
  static toLoginResponse(
    vendor: IVendor,
    token: string,
    message: string
  ): VendorLoginResponseDto {
    return {
      id: vendor._id.toString(),
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      profileImage: vendor.profileImage,
      businessName: vendor.businessName,
      businessAddress: vendor.businessAddress,
      status: vendor.status,
      token,
      message,
    };
  }

  static toProfileResponse(vendor: IVendor): VendorProfileResponseDto {
    return {
      id: vendor._id.toString(),
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      profileImage: vendor.profileImage,
      businessName: vendor.businessName,
      businessAddress: vendor.businessAddress,
      status: vendor.status,
    };
  }

  static toDocumentUploadResponse(
    vendor: IVendor
  ): VendorDocumentUploadResponseDto {
    return {
      id: vendor._id.toString(),
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      profileImage: vendor.profileImage,
      businessName: vendor.businessName,
      businessAddress: vendor.businessAddress,
      status: vendor.status,
      documents: vendor.documents || [],
    };
  }
}
