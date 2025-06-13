import mongoose from "mongoose";
import { inject, injectable } from "tsyringe";
import { IVenue } from "../models/venue.model";
import { IVenueService } from "./interfaces/IVenueService";
import { IVenueRepository } from "../repositories/interfaces/IVenueRepository";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { validateVenueData } from "../utils/venueValidators";
import { TOKENS } from "../config/tokens";
import { VenueMapper } from "../mappers/venue.mapper";
import { VenueResponseDto, VenueListResponseDto } from "../dto/venue.dto";

@injectable()
export class VenueService implements IVenueService {
  constructor(
    @inject(TOKENS.IVenueRepository)
    private venueRepo: IVenueRepository
  ) {}

  async createVenue(
    vendorId: string,
    venueData: Partial<IVenue>
  ): Promise<{ response: VenueResponseDto; message: string; status: number }> {
    const errors = await validateVenueData(venueData);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    if (venueData.name && venueData.location?.coordinates) {
      const similarVenues = await this.venueRepo.findSimilarVenues(
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

    const venue = await this.venueRepo.create(data);
    if (!venue) {
      throw new Error("Failed to create venue");
    }

    return {
      response: VenueMapper.toResponseDto(venue),
      message: MESSAGES.SUCCESS.VENUE_CREATED,
      status: STATUS_CODES.CREATED,
    };
  }

  async updateVenue(
    vendorId: string,
    venueId: string,
    updateData: Partial<IVenue>
  ): Promise<{ response: VenueResponseDto; message: string; status: number }> {
    const existingVenue = await this.venueRepo.findById(venueId);
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

    const updatedVenue = await this.venueRepo.update(venueId, updateData);
    if (!updatedVenue) {
      throw new Error("Could not update the venue");
    }

    return {
      response: VenueMapper.toResponseDto(updatedVenue),
      message: MESSAGES.SUCCESS.VENUE_UPDATED,
      status: STATUS_CODES.OK,
    };
  }

  async getVenuesByVendor(
    vendorId: string,
    filter: string = "all"
  ): Promise<{ response: VenueListResponseDto; status: number }> {
    let venues = await this.venueRepo.findByVendor(vendorId);
    if (!venues) {
      throw new Error("could not fetch venues");
    }

    if (filter !== "all") {
      venues = venues.filter((venue) => venue.verificationStatus === filter);
    }

    return {
      response: VenueMapper.toListResponseDto(
        venues,
        venues.length,
        MESSAGES.SUCCESS.VENUE_FETCHED
      ),
      status: STATUS_CODES.OK,
    };
  }

  async getVenueById(
    venueId: string
  ): Promise<{ response: VenueResponseDto; message: string; status: number }> {
    const venue = await this.venueRepo.findByVenueId(venueId);
    if (!venue) {
      throw new Error("Venue not found");
    }

    return {
      response: VenueMapper.toResponseDto(venue),
      message: "venue fetched successfully",
      status: STATUS_CODES.OK,
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
    response: VenueListResponseDto;
    status: number;
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

    const venuesPromise = this.venueRepo.findWithPagination(
      filter,
      skip,
      limit
    );
    const countPromise = this.venueRepo.countDocuments(filter);

    const [venues, totalCount] = await Promise.all([
      venuesPromise,
      countPromise,
    ]);

    return {
      response: VenueMapper.toListResponseDto(
        venues,
        totalCount,
        MESSAGES.SUCCESS.VENUE_FETCHED
      ),
      status: STATUS_CODES.OK,
    };
  }

  async getFeaturedVenues(): Promise<{
    response: VenueListResponseDto;
    status: number;
  }> {
    const venues = await this.venueRepo.find({
      verificationStatus: "approved",
    });

    const sortedVenues = venues.sort((a, b) => a.name.localeCompare(b.name));
    const featuredVenues = sortedVenues.slice(0, 3);

    return {
      response: VenueMapper.toListResponseDto(
        featuredVenues,
        featuredVenues.length,
        MESSAGES.SUCCESS.VENUE_FETCHED
      ),
      status: STATUS_CODES.OK,
    };
  }
}
