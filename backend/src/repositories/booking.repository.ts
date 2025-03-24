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

  async findAll(): Promise<IBooking[]> {
    return Booking.find({}).populate("venue").populate("user").exec();
  }
  async findByUser(userId: string): Promise<IBooking[]> {
    return Booking.find({ user: userId })
      .populate("venue")
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByVenue(venueId: string): Promise<IBooking[]> {
    return Booking.find({ venue: venueId })
      .populate("venue")
      .populate("user")
      .exec();
  }
  async findByVendor(vendorId: string): Promise<IBooking[]> {
    const venues = await Venue.find({ vendor: vendorId }).select("_id").exec();
    const venueIds = venues.map((v: IVenue) => v._id);

    return Booking.find({ venue: { $in: venueIds } })
      .populate("venue")
      .populate("user")
      .exec();
  }
  async findByIdPopulated(bookingId: string): Promise<IBooking | null> {
    return Booking.findById(bookingId)
      .populate("venue")
      .populate("user")
      .exec();
  }
  async getTotalCommission(): Promise<number> {
    const result = await Booking.aggregate([
      { $match: { status: { $in: ["fully_paid", "confirmed"] } } },
      { $group: { _id: null, totalCommission: { $sum: "$commissionAmount" } } },
    ]);
    return result.length > 0 ? result[0].totalCommission : 0;
  }
  async getVendorRevenue(vendorId: string): Promise<number> {
    const venues = await Venue.find({ vendor: vendorId }).select("_id").exec();
    const venueIds = venues.map((v: IVenue) => v._id);

    const result = await Booking.aggregate([
      {
        $match: {
          venue: { $in: venueIds },
          status: { $in: ["fully_paid", "confirmed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalVendorRevenue: { $sum: "$vendorReceives" },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalVendorRevenue : 0;
  }
}

export default new BookingRepository();
