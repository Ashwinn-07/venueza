import { Request, Response } from "express";
import { IVenueService } from "../services/interfaces/IVenueService";
import { STATUS_CODES } from "../utils/constants";
import { IVenueController } from "./interfaces/IVenueController";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class VenueController implements IVenueController {
  constructor(
    @inject(TOKENS.IVenueService) private venueService: IVenueService
  ) {}
  createVenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const venueData = req.body;
      const result = await this.venueService.createVenue(vendorId, venueData);
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
  };
  updateVenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const { id: venueId } = req.params;
      const updateData = req.body;
      const result = await this.venueService.updateVenue(
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
  };
  getVenuesByVendor = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendorId = (req as any).userId;
      const filter = (req.query.filter as string) || "all";
      const result = await this.venueService.getVenuesByVendor(
        vendorId,
        filter
      );
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
  };
  getVenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: venueId } = req.params;
      const result = await this.venueService.getVenueById(venueId);
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
  };
  getAllVenues = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 9,
        query,
        location,
        capacity,
        price,
      } = req.query;
      const searchParams = {
        query: typeof query === "string" ? query : undefined,
        location: typeof location === "string" ? location : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        price: price ? Number(price) : undefined,
      };
      const result = await this.venueService.getAllVenues(
        Number(page),
        Number(limit),
        searchParams
      );
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
  };
  getFeaturedVenues = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.venueService.getFeaturedVenues();
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
  };
}
