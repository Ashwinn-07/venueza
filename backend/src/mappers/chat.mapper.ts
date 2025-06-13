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

  static toConversationResponseDto(conversation: any): ConversationResponseDto {
    return {
      id: conversation._id?.toString() || "",
      participants: conversation.participants || [],
      lastMessage: conversation.lastMessage
        ? this.toMessageResponseDto(conversation.lastMessage)
        : ({} as MessageResponseDto),
      unreadCount: conversation.unreadCount || 0,
      updatedAt: conversation.updatedAt || new Date(),
    };
  }

  static toConversationResponseDtoArray(
    conversations: any[]
  ): ConversationResponseDto[] {
    return conversations.map((conversation) =>
      this.toConversationResponseDto(conversation)
    );
  }
}
