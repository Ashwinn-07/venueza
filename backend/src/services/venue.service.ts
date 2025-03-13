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
    vendorId: string
  ): Promise<{ message: string; status: number; venues: IVenue[] }> {
    const venues = await venueRepository.findByVendor(vendorId);
    if (!venues) {
      throw new Error("could not fetch venues");
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
    const venue = await venueRepository.findById(venueId);
    if (!venue) {
      throw new Error("Venue not found");
    }
    return {
      message: "venue fetched successfully",
      status: STATUS_CODES.OK,
      venue,
    };
  }
}

export default new VenueService();
