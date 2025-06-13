import { IVenue } from "../../models/venue.model";
import { VenueResponseDto, VenueListResponseDto } from "../../dto/venue.dto";

export interface IVenueService {
  createVenue(
    vendorId: string,
    venueData: Partial<IVenue>
  ): Promise<{ response: VenueResponseDto; message: string; status: number }>;

  updateVenue(
    vendorId: string,
    venueId: string,
    updateData: Partial<IVenue>
  ): Promise<{ response: VenueResponseDto; message: string; status: number }>;

  getVenuesByVendor(
    vendorId: string,
    filter?: string
  ): Promise<{ response: VenueListResponseDto; status: number }>;

  getVenueById(
    venueId: string
  ): Promise<{ response: VenueResponseDto; message: string; status: number }>;

  getAllVenues(
    page?: number,
    limit?: number,
    searchParams?: {
      query?: string;
      location?: string;
      capacity?: number;
      price?: number;
    }
  ): Promise<{
    response: VenueListResponseDto;
    status: number;
  }>;

  getFeaturedVenues(): Promise<{
    response: VenueListResponseDto;
    status: number;
  }>;
}
