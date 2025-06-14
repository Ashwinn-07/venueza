import { IMessage } from "../models/message.model";
import { MessageResponseDto, ConversationResponseDto } from "../dto/chat.dto";

export class ChatMapper {
  static toMessageResponseDto(message: IMessage): MessageResponseDto {
    return {
      id: (message._id as any).toString(),
      sender: message.sender.toString(),
      senderModel: message.senderModel,
      receiver: message.receiver.toString(),
      receiverModel: message.receiverModel,
      content: message.content,
      images: message.images || [],
      readAt: message.readAt,
      createdAt: message.createdAt,
    };
  }

  static toMessageResponseDtoArray(messages: IMessage[]): MessageResponseDto[] {
    return messages.map((message) => this.toMessageResponseDto(message));
  }

  static toConversationResponseDto(
    conversation: any,
    currentUserId: string
  ): ConversationResponseDto {
    return {
      _id: conversation._id?.toString() || "",
      partner: {
        _id: conversation.partner?._id?.toString() || "",
        name: conversation.partner?.name || "Unknown User",
        email: conversation.partner?.email || "",
        profileImage: conversation.partner?.profileImage || undefined,
      },
      lastMessage: {
        content: conversation.lastMessage?.content || "",
        createdAt:
          conversation.lastMessage?.createdAt?.toISOString() ||
          new Date().toISOString(),
        sender: conversation.lastMessage?.sender?.toString() || "",
      },
      unreadCount: 0,
    };
  }

  static toConversationResponseDtoArray(
    conversations: any[],
    currentUserId: string
  ): ConversationResponseDto[] {
    return conversations.map((conversation) =>
      this.toConversationResponseDto(conversation, currentUserId)
    );
  }
}
