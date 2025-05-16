import { Request, Response } from "express";
import { INotificationService } from "../services/interfaces/INotificationService";
import { STATUS_CODES } from "../utils/constants";
import { INotificationController } from "./interfaces/INotificationController";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TOKENS.INotificationService)
    private notificationService: INotificationService
  ) {}
  getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const recipient = (req as any).userId;
      const result = await this.notificationService.getNotifications(recipient);
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error fetching notifications:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
      });
    }
  };
  markNotificationAsRead = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { notificationId } = req.params;
      const result = await this.notificationService.markAsRead(notificationId);
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error updating notification read status:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
      });
    }
  };
}
