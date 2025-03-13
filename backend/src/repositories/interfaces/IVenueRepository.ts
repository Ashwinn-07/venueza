import { IBaseRepository } from "./IBaseRepository";
import { IVenue } from "../../models/venue.model";

export interface IVenueRepository extends IBaseRepository<IVenue> {
  findByVendor(vendorId: string): Promise<IVenue[]>;
}
