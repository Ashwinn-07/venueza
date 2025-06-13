export class SendMessageRequestDto {
  sender!: string;
  senderModel!: string;
  receiver!: string;
  receiverModel!: string;
  content!: string;
  images?: string[];
  room?: string;
}

export class MessageResponseDto {
  id!: string;
  sender!: string;
  senderModel!: string;
  receiver!: string;
  receiverModel!: string;
  content!: string;
  images!: string[];
  readAt?: Date;
  createdAt!: Date;
}

export class ConversationResponseDto {
  id!: string;
  participants!: {
    user: string;
    userModel: string;
  }[];
  lastMessage!: MessageResponseDto;
  unreadCount!: number;
  updatedAt!: Date;
}

export class SendMessageResponseDto {
  message!: string;
  data!: MessageResponseDto;
}

export class ConversationListResponseDto {
  message!: string;
  data!: MessageResponseDto[];
}

export class ConversationsListResponseDto {
  message!: string;
  data!: ConversationResponseDto[];
}
