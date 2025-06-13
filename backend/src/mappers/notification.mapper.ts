import { INotification } from "../models/notification.model";
import { NotificationResponseDto } from "../dto/notification.dto";

export class NotificationMapper {
  static toResponseDto(notification: INotification): NotificationResponseDto {
    return {
      id: (notification._id as any).toString(),
      recipient: notification.recipient.toString(),
      recipientModel: notification.recipientModel,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
    };
  }

  static toResponseDtoArray(
    notifications: INotification[]
  ): NotificationResponseDto[] {
    return notifications.map((notification) =>
      this.toResponseDto(notification)
    );
  }

  static toNullableResponseDto(
    notification: INotification | null
  ): NotificationResponseDto | null {
    return notification ? this.toResponseDto(notification) : null;
  }
}
