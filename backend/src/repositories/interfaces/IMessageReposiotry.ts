import { IBaseRepository } from "./IBaseRepository";
import { IMessage } from "../../models/message.model";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  findConversation(senderId: string, receiverId: string): Promise<IMessage[]>;
  aggregateConversations(userId: string): Promise<any[]>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
}
