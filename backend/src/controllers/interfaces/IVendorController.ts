import { Request, Response } from "express";

export interface IVendorController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  resendOTP(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  updateVendorProfile(req: Request, res: Response): Promise<void>;
  changeVendorPassword(req: Request, res: Response): Promise<void>;
}
