import Venue, { IVenue } from "../models/venue.model";
import BaseRepository from "./base.repository";
import { IVenueRepository } from "./interfaces/IVenueRepository";

class VenueRepository
  extends BaseRepository<IVenue>
  implements IVenueRepository
{
  constructor() {
    super(Venue);
  }

  async findByVendor(vendorId: string): Promise<IVenue[]> {
    return Venue.find({ vendor: vendorId }).exec();
  }
}

export default new VenueRepository();
