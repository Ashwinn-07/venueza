import {
  CreateNotificationResponseDto,
  MarkAsReadResponseDto,
  NotificationsListResponseDto,
} from "../../dto/notification.dto";

export interface INotificationService {
  createNotification(
    recipient: string,
    recipientModel: string,
    type: string,
    message: string
  ): Promise<{ response: CreateNotificationResponseDto; status: number }>;
  getNotifications(
    recipientId: string
  ): Promise<{ response: NotificationsListResponseDto; status: number }>;
  markAsRead(
    notificationId: string
  ): Promise<{ response: MarkAsReadResponseDto; status: number }>;
}
