import mongoose from "mongoose";
import messageRepository from "../repositories/message.repository";
import { IMessage } from "../models/message.model";
import { IChatService, SendMessageInput } from "./interfaces/IChatService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

class ChatService implements IChatService {
  async sendMessage(
    input: SendMessageInput
  ): Promise<{ message: string; status: number; data: IMessage }> {
    const senderObj = new mongoose.Types.ObjectId(input.sender);
    const receiverObj = new mongoose.Types.ObjectId(input.receiver);
    const message = await messageRepository.create({
      sender: senderObj,
      senderModel: input.senderModel,
      receiver: receiverObj,
      receiverModel: input.receiverModel,
      content: input.content,
    });
    return {
      message: MESSAGES.SUCCESS.MESSAGE_SENT,
      status: STATUS_CODES.OK,
      data: message,
    };
  }
  async getConversation(
    sender: string,
    receiver: string
  ): Promise<{ message: string; status: number; data: IMessage[] }> {
    const messages = await messageRepository.findConversation(sender, receiver);
    return {
      message: MESSAGES.SUCCESS.CONVERSATION_FETCHED,
      status: STATUS_CODES.OK,
      data: messages,
    };
  }
  async getConversations(
    userId: string
  ): Promise<{ message: string; status: number; data: any[] }> {
    const conversations = await messageRepository.aggregateConversations(
      userId
    );
    return {
      message: MESSAGES.SUCCESS.CONVERSATIONS_FETCHED,
      status: STATUS_CODES.OK,
      data: conversations,
    };
  }
}

export default new ChatService();
