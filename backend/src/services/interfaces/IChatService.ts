import {
  ConversationListResponseDto,
  ConversationsListResponseDto,
  SendMessageResponseDto,
} from "../../dto/chat.dto";

export interface SendMessageInput {
  sender: string;
  senderModel: string;
  receiver: string;
  receiverModel: string;
  content: string;
  images?: string[];
}

export interface IChatService {
  sendMessage(
    input: SendMessageInput
  ): Promise<{ response: SendMessageResponseDto; status: number }>;
  getConversation(
    sender: string,
    receiver: string,
    currentUserId: string
  ): Promise<{ response: ConversationListResponseDto; status: number }>;
  getConversations(
    userId: string
  ): Promise<{ response: ConversationsListResponseDto; status: number }>;
}
