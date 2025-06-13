import { inject, injectable } from "tsyringe";
import { io } from "../config/socket";
import mongoose from "mongoose";
import { IChatService, SendMessageInput } from "./interfaces/IChatService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IMessageRepository } from "../repositories/interfaces/IMessageReposiotry";
import { TOKENS } from "../config/tokens";
import { ChatMapper } from "../mappers/chat.mapper";
import {
  SendMessageResponseDto,
  ConversationListResponseDto,
  ConversationsListResponseDto,
} from "../dto/chat.dto";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TOKENS.IMessageRepository)
    private messageRepo: IMessageRepository
  ) {}

  async sendMessage(
    input: SendMessageInput
  ): Promise<{ response: SendMessageResponseDto; status: number }> {
    const senderObj = new mongoose.Types.ObjectId(input.sender);
    const receiverObj = new mongoose.Types.ObjectId(input.receiver);

    const message = await this.messageRepo.create({
      sender: senderObj,
      senderModel: input.senderModel,
      receiver: receiverObj,
      receiverModel: input.receiverModel,
      content: input.content,
      images: input.images || [],
    });

    return {
      response: {
        message: MESSAGES.SUCCESS.MESSAGE_SENT,
        data: ChatMapper.toMessageResponseDto(message),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getConversation(
    sender: string,
    receiver: string,
    currentUserId: string
  ): Promise<{ response: ConversationListResponseDto; status: number }> {
    const otherUserId = currentUserId === sender ? receiver : sender;
    await this.messageRepo.markMessagesAsRead(otherUserId, currentUserId);

    const room = [currentUserId, otherUserId].sort().join("-");

    io.to(room).emit("messagesRead", {
      conversation: {
        sender: currentUserId,
        receiver: otherUserId,
        room: room,
      },
    });

    const messages = await this.messageRepo.findConversation(sender, receiver);

    return {
      response: {
        message: MESSAGES.SUCCESS.CONVERSATION_FETCHED,
        data: ChatMapper.toMessageResponseDtoArray(messages),
      },
      status: STATUS_CODES.OK,
    };
  }

  async getConversations(
    userId: string
  ): Promise<{ response: ConversationsListResponseDto; status: number }> {
    const conversations = await this.messageRepo.aggregateConversations(userId);

    return {
      response: {
        message: MESSAGES.SUCCESS.CONVERSATIONS_FETCHED,
        data: ChatMapper.toConversationResponseDtoArray(conversations),
      },
      status: STATUS_CODES.OK,
    };
  }
}
