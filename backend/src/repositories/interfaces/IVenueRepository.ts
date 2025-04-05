import { IBaseRepository } from "./IBaseRepository";
import { IVenue } from "../../models/venue.model";

export interface IVenueRepository extends IBaseRepository<IVenue> {
  findByVendor(vendorId: string): Promise<IVenue[]>;
  findByVenueId(id: string): Promise<IVenue | null>;
  findSimilarVenues(name: string, coordinates: number[]): Promise<IVenue[]>;
}
