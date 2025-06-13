import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";
import { INotificationService } from "./interfaces/INotificationService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { TOKENS } from "../config/tokens";
import { NotificationMapper } from "../mappers/notification.mapper";
import {
  CreateNotificationResponseDto,
  NotificationsListResponseDto,
  MarkAsReadResponseDto,
} from "../dto/notification.dto";

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
  ): Promise<{ response: CreateNotificationResponseDto; status: number }> {
    const notification = await this.notificationRepo.create({
      recipient: new mongoose.Types.ObjectId(recipient),
      recipientModel,
      type,
      message,
      read: false,
    });

    return {
      response: {
        message: MESSAGES.SUCCESS.NOTIFICATION_CREATED,
        data: NotificationMapper.toResponseDto(notification),
      },
      status: STATUS_CODES.CREATED,
    };
  }

  async getNotifications(
    recipientId: string
  ): Promise<{ response: NotificationsListResponseDto; status: number }> {
    const notifications = await this.notificationRepo.findByRecipient(
      recipientId
    );

    return {
      response: {
        message: MESSAGES.SUCCESS.NOTIFICATIONS_FETCHED,
        data: NotificationMapper.toResponseDtoArray(notifications),
      },
      status: STATUS_CODES.OK,
    };
  }

  async markAsRead(
    notificationId: string
  ): Promise<{ response: MarkAsReadResponseDto; status: number }> {
    const updatedNotification = await this.notificationRepo.update(
      notificationId,
      { read: true }
    );

    return {
      response: {
        message: MESSAGES.SUCCESS.NOTIFICATION_UPDATED,
        data: NotificationMapper.toNullableResponseDto(updatedNotification),
      },
      status: STATUS_CODES.OK,
    };
  }
}
