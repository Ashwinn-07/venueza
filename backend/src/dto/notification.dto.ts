export class CreateNotificationRequestDto {
  recipient!: string;
  recipientModel!: string;
  type!: string;
  message!: string;
}

export class MarkAsReadRequestDto {
  notificationId!: string;
}

export class NotificationResponseDto {
  id!: string;
  recipient!: string;
  recipientModel!: string;
  type!: string;
  message!: string;
  read!: boolean;
  createdAt!: Date;
}

export class CreateNotificationResponseDto {
  message!: string;
  data!: NotificationResponseDto;
}

export class NotificationsListResponseDto {
  message!: string;
  data!: NotificationResponseDto[];
}

export class MarkAsReadResponseDto {
  message!: string;
  data!: NotificationResponseDto | null;
}
