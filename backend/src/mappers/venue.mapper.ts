import { IVenue } from "../models/venue.model";
import { VenueListResponseDto, VenueResponseDto } from "../dto/venue.dto";

export class VenueMapper {
  static toResponseDto(venue: IVenue): VenueResponseDto {
    return {
      id: (venue._id as any).toString(),
      vendor: venue.vendor.toString(),
      name: venue.name,
      address: venue.address,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      images: venue.images || [],
      services: venue.services || [],
      documents: venue.documents || [],
      status: venue.status,
      verificationStatus: venue.verificationStatus,
      rejectionReason: venue.rejectionReason,
    };
  }

  static toListResponseDto(
    venues: IVenue[],
    totalCount: number,
    message: string
  ): VenueListResponseDto {
    return {
      venues: venues.map(VenueMapper.toResponseDto),
      totalCount,
      message,
    };
  }
}
