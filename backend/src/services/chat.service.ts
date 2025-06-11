import { inject, injectable } from "tsyringe";
import { io } from "../config/socket";
import mongoose from "mongoose";
import { IMessage } from "../models/message.model";
import { IChatService, SendMessageInput } from "./interfaces/IChatService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IMessageRepository } from "../repositories/interfaces/IMessageReposiotry";
import { TOKENS } from "../config/tokens";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TOKENS.IMessageRepository)
    private messageRepo: IMessageRepository
  ) {}
  async sendMessage(
    input: SendMessageInput
  ): Promise<{ message: string; status: number; data: IMessage }> {
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
      message: MESSAGES.SUCCESS.MESSAGE_SENT,
      status: STATUS_CODES.OK,
      data: message,
    };
  }
  async getConversation(
    sender: string,
    receiver: string,
    currentUserId: string
  ): Promise<{ message: string; status: number; data: IMessage[] }> {
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
      message: MESSAGES.SUCCESS.CONVERSATION_FETCHED,
      status: STATUS_CODES.OK,
      data: messages,
    };
  }
  async getConversations(
    userId: string
  ): Promise<{ message: string; status: number; data: any[] }> {
    const conversations = await this.messageRepo.aggregateConversations(userId);
    return {
      message: MESSAGES.SUCCESS.CONVERSATIONS_FETCHED,
      status: STATUS_CODES.OK,
      data: conversations,
    };
  }
}
