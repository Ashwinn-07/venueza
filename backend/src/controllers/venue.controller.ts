import { Request, Response } from "express";
import venueService from "../services/venue.service";
import { STATUS_CODES } from "../utils/constants";
import { IVenueController } from "./interfaces/IVenueController";

class VenueController implements IVenueController {
  async createVenue(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      const venueData = req.body;
      const result = await venueService.createVenue(vendorId, venueData);
      res.status(result.status).json({
        message: result.message,
        result,
      });
    } catch (error) {
      console.error("Add venue error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to add venue",
      });
    }
  }
  async updateVenue(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      const { id: venueId } = req.params;
      const updateData = req.body;
      const result = await venueService.updateVenue(
        vendorId,
        venueId,
        updateData
      );
      res.status(result.status).json({
        message: result.message,
        result,
      });
    } catch (error) {
      console.error("Update venue error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to update venue",
      });
    }
  }
  async getVenuesByVendor(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).userId;
      const result = await venueService.getVenuesByVendor(vendorId);
      res.status(result.status).json({
        message: result.message,
        result,
      });
    } catch (error) {
      console.error("Get venues error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch venues",
      });
    }
  }
  async getVenue(req: Request, res: Response): Promise<void> {
    try {
      const { id: venueId } = req.params;
      const result = await venueService.getVenueById(venueId);
      res.status(result.status).json({
        message: result.message,
        result,
      });
    } catch (error) {
      console.error("failed to fetch venue", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to fetch venue",
      });
    }
  }
  async getAllVenues(req: Request, res: Response): Promise<void> {
    try {
      const result = await venueService.getAllVenues();
      res.status(result.status).json({
        message: result.message,
        result,
      });
    } catch (error) {
      console.error("Error fetching venues", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch venues",
      });
    }
  }
  async getFeaturedVenues(req: Request, res: Response): Promise<void> {
    try {
      const result = await venueService.getFeaturedVenues();
      res.status(result.status).json({
        message: result.message,
        result,
      });
    } catch (error) {
      console.error("Error fetching featured venues", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch featured venues",
      });
    }
  }
}

export default new VenueController();
