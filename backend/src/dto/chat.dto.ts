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
  _id!: string;
  partner!: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  lastMessage!: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCount!: number;
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
