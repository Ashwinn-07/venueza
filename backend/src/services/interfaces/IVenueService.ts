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
    vendorId: string
  ): Promise<{ message: string; status: number; venues: IVenue[] }>;
  getVenueById(
    venueId: string
  ): Promise<{ message: string; status: number; venue: IVenue }>;
  getAllVenues(): Promise<{
    message: string;
    status: number;
    venues: IVenue[];
  }>;
  getFeaturedVenues(): Promise<{
    message: string;
    status: number;
    venues: IVenue[];
  }>;
}
