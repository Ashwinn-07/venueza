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

  async findByVenueId(id: string): Promise<IVenue | null> {
    return Venue.findById(id).populate("vendor").exec();
  }

  async findSimilarVenues(
    name: string,
    coordinates: number[]
  ): Promise<IVenue[]> {
    const similarNameVenues = await Venue.find({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (similarNameVenues.length === 0) {
      return [];
    }

    const [newLongitude, newLatitude] = coordinates;
    const proximityThreshold = 0.001;

    const nearbyVenues = similarNameVenues.filter((venue) => {
      const [venueLongitude, venueLatitude] = venue.location.coordinates;
      const longitudeDiff = Math.abs(venueLongitude - newLongitude);
      const latitudeDiff = Math.abs(venueLatitude - newLatitude);

      return (
        longitudeDiff < proximityThreshold && latitudeDiff < proximityThreshold
      );
    });

    return nearbyVenues;
  }
}

export default new VenueRepository();
