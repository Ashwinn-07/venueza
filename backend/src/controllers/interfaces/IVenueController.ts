import { Request, Response } from "express";

export interface IVenueController {
  createVenue(req: Request, res: Response): Promise<void>;
  updateVenue(req: Request, res: Response): Promise<void>;
  getVenuesByVendor(req: Request, res: Response): Promise<void>;
  getVenue(req: Request, res: Response): Promise<void>;
  getAllVenues(req: Request, res: Response): Promise<void>;
  getFeaturedVenues(req: Request, res: Response): Promise<void>;
}
