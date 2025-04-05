import mongoose from "mongoose";
import venueRepository from "../repositories/venue.repository";
import { IVenue } from "../models/venue.model";
import { IVenueService } from "./interfaces/IVenueService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { validateVenueData } from "../utils/venueValidators";

class VenueService implements IVenueService {
  async createVenue(
    vendorId: string,
    venueData: Partial<IVenue>
  ): Promise<{ message: string; status: number; venue: IVenue }> {
    const errors = await validateVenueData(venueData);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    if (venueData.name && venueData.location?.coordinates) {
      const similarVenues = await venueRepository.findSimilarVenues(
        venueData.name,
        venueData.location.coordinates
      );

      if (similarVenues.length > 0) {
        throw new Error(
          "A similar venue already exists at this location. Please verify if this is a duplicate entry."
        );
      }
    }

    const data = {
      ...venueData,
      vendor: new mongoose.Types.ObjectId(vendorId),
      status: "closed" as "closed",
      verificationStatus: "pending" as "pending",
    };
    const venue = await venueRepository.create(data);
    if (!venue) {
      throw new Error("Failed to create venue");
    }
    return {
      message: MESSAGES.SUCCESS.VENUE_CREATED,
      status: STATUS_CODES.CREATED,
      venue,
    };
  }
  async updateVenue(
    vendorId: string,
    venueId: string,
    updateData: Partial<IVenue>
  ): Promise<{ message: string; status: number; venue: IVenue }> {
    const existingVenue = await venueRepository.findById(venueId);
    if (!existingVenue) {
      throw new Error("No venues found");
    }
    if (existingVenue.vendor.toString() !== vendorId) {
      throw new Error(
        "you don't have access to this venue as this is not your venue"
      );
    }
    const mergedData = { ...existingVenue.toObject(), ...updateData };
    const errors = validateVenueData(mergedData);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
    const updatedVenue = await venueRepository.update(venueId, updateData);
    if (!updatedVenue) {
      throw new Error("Could not update the venue");
    }
    return {
      message: MESSAGES.SUCCESS.VENUE_UPDATED,
      status: STATUS_CODES.OK,
      venue: updatedVenue,
    };
  }
  async getVenuesByVendor(
    vendorId: string,
    filter: string = "all"
  ): Promise<{ message: string; status: number; venues: IVenue[] }> {
    let venues = await venueRepository.findByVendor(vendorId);
    if (!venues) {
      throw new Error("could not fetch venues");
    }
    if (filter !== "all") {
      venues = venues.filter((venue) => venue.verificationStatus === filter);
    }
    return {
      message: MESSAGES.SUCCESS.VENUE_FETCHED,
      status: STATUS_CODES.OK,
      venues,
    };
  }
  async getVenueById(
    venueId: string
  ): Promise<{ message: string; status: number; venue: IVenue }> {
    const venue = await venueRepository.findByVenueId(venueId);
    if (!venue) {
      throw new Error("Venue not found");
    }
    return {
      message: "venue fetched successfully",
      status: STATUS_CODES.OK,
      venue,
    };
  }
  async getAllVenues(
    page: number = 1,
    limit: number = 9,
    searchParams: {
      query?: string;
      location?: string;
      capacity?: number;
      price?: number;
    } = {}
  ): Promise<{
    message: string;
    status: number;
    venues: IVenue[];
    totalCount: number;
  }> {
    let filter: any = { verificationStatus: "approved" };
    if (searchParams.query) {
      filter.name = { $regex: searchParams.query, $options: "i" };
    }
    if (searchParams.location) {
      filter.address = { $regex: searchParams.location, $options: "i" };
    }
    if (searchParams.capacity) {
      filter.capacity = { $gte: searchParams.capacity };
    }
    if (searchParams.price) {
      filter.price = { $lte: searchParams.price };
    }
    const skip = (page - 1) * limit;

    const venuesPromise = venueRepository.findWithPagination(
      filter,
      skip,
      limit
    );
    const countPromise = venueRepository.countDocuments(filter);

    const [venues, totalCount] = await Promise.all([
      venuesPromise,
      countPromise,
    ]);
    return {
      message: MESSAGES.SUCCESS.VENUE_FETCHED,
      status: STATUS_CODES.OK,
      venues,
      totalCount,
    };
  }
  async getFeaturedVenues(): Promise<{
    message: string;
    status: number;
    venues: IVenue[];
  }> {
    const venues = await venueRepository.find({
      verificationStatus: "approved",
    });
    const sortedVenues = venues.sort((a, b) => a.name.localeCompare(b.name));
    const featuredVenues = sortedVenues.slice(0, 3);
    return {
      message: MESSAGES.SUCCESS.VENUE_FETCHED,
      status: STATUS_CODES.OK,
      venues: featuredVenues,
    };
  }
}

export default new VenueService();
