import Booking, { IBooking } from "../models/booking.model";
import BaseRepository from "./base.repository";
import { IBookingRepository } from "./interfaces/IBookingRepository";
import Venue, { IVenue } from "../models/venue.model";

class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async findByUser(userId: string): Promise<IBooking[]> {
    return Booking.find({ user: userId }).exec();
  }

  async findByVenue(venueId: string): Promise<IBooking[]> {
    return Booking.find({ venue: venueId }).exec();
  }
  async findByVendor(vendorId: string): Promise<IBooking[]> {
    const venues = await Venue.find({ vendor: vendorId }).select("_id").exec();
    const venueIds = venues.map((v: IVenue) => v._id);

    return Booking.find({ venue: { $in: venueIds } }).exec();
  }
}

export default new BookingRepository();
