import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { INotificationService } from "./interfaces/INotificationService";
import { INotification } from "../models/notification.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { TOKENS } from "../config/tokens";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TOKENS.INotificationRepository)
    private notificationRepo: INotificationRepository
  ) {}
  async createNotification(
    recipient: string,
    recipientModel: string,
    type: string,
    message: string
  ): Promise<{ message: string; status: number; data: INotification }> {
    const notification = await this.notificationRepo.create({
      recipient: new mongoose.Types.ObjectId(recipient),
      recipientModel,
      type,
      message,
      read: false,
    });
    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_CREATED,
      status: STATUS_CODES.CREATED,
      data: notification,
    };
  }
  async getNotifications(
    recipientId: string
  ): Promise<{ message: string; status: number; data: INotification[] }> {
    const notifications = await this.notificationRepo.findByRecipient(
      recipientId
    );
    return {
      message: MESSAGES.SUCCESS.NOTIFICATIONS_FETCHED,
      status: STATUS_CODES.OK,
      data: notifications,
    };
  }
  async markAsRead(
    notificationId: string
  ): Promise<{ message: string; status: number; data: INotification | null }> {
    const updatedNotification = await this.notificationRepo.update(
      notificationId,
      { read: true }
    );
    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_UPDATED,
      status: STATUS_CODES.OK,
      data: updatedNotification,
    };
  }
}
