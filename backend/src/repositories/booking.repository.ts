import { PipelineStage } from "mongoose";
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
    return Booking.find({})
      .populate("venue")
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();
  }
  async findAllWithSearch(search = ""): Promise<IBooking[]> {
    if (!search || search.trim() === "") {
      return this.findAll();
    }

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $lookup: {
          from: "venues",
          localField: "venue",
          foreignField: "_id",
          as: "venueInfo",
        },
      },

      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$venueInfo", preserveNullAndEmptyArrays: true } },

      {
        $match: {
          $or: [
            { _id: { $regex: search, $options: "i" } },
            { "userInfo.name": { $regex: search, $options: "i" } },
            { "venueInfo.name": { $regex: search, $options: "i" } },
          ],
        },
      },

      { $sort: { createdAt: -1 } },

      {
        $project: {
          _id: 1,
          user: "$userInfo",
          venue: "$venueInfo",
          startDate: 1,
          endDate: 1,
          totalPrice: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    return Booking.aggregate(pipeline);
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
      .sort({ createdAt: -1 })
      .exec();
  }
  async findByIdPopulated(bookingId: string): Promise<IBooking | null> {
    return Booking.findById(bookingId)
      .populate("venue")
      .populate("user")
      .exec();
  }
  async getTotalCommission(): Promise<{ month: number; revenue: number }[]> {
    const result = await Booking.aggregate([
      {
        $match: { status: { $in: ["fully_paid", "confirmed"] } },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$commissionAmount" },
        },
      },
      {
        $project: {
          month: "$_id",
          revenue: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    return result;
  }
  async getVendorRevenue(
    vendorId: string
  ): Promise<{ month: number; revenue: number }[]> {
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
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$vendorReceives" },
        },
      },
      {
        $project: {
          month: "$_id",
          revenue: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    return result;
  }
  async getTransactionHistory(): Promise<any[]> {
    const transactions = await Booking.aggregate([
      {
        $match: { status: { $in: ["fully_paid", "confirmed"] } },
      },
      {
        $project: {
          bookingId: "$_id",
          totalPrice: 1,
          advanceAmount: 1,
          balanceDue: 1,
          commissionAmt: 1,
          bookingDate: "$createdAt",
        },
      },
      { $sort: { bookingDate: -1 } },
    ]);
    return transactions;
  }
}

export default new BookingRepository();
