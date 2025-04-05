import { IVenue } from "../../models/venue.model";

export interface IVenueService {
  createVenue(
    vendorId: string,
    venueData: Partial<IVenue>
  ): Promise<{ message: string; status: number; venue: IVenue }>;
  updateVenue(
    vendorId: string,
    venueId: string,
    updateData: Partial<IVenue>
  ): Promise<{ message: string; status: number; venue: IVenue }>;
  getVenuesByVendor(
    vendorId: string,
    filter: string
  ): Promise<{ message: string; status: number; venues: IVenue[] }>;
  getVenueById(
    venueId: string
  ): Promise<{ message: string; status: number; venue: IVenue }>;
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
    message: string;
    status: number;
    venues: IVenue[];
    totalCount: number;
  }>;
  getFeaturedVenues(): Promise<{
    message: string;
    status: number;
    venues: IVenue[];
  }>;
}
