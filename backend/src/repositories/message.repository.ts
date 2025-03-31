import mongoose from "mongoose";
import Message, { IMessage } from "../models/message.model";
import BaseRepository from "./base.repository";
import { IMessageReposiotry } from "./interfaces/IMessageReposiotry";

class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageReposiotry
{
  constructor() {
    super(Message);
  }
  async findConversation(
    senderId: string,
    receiverId: string
  ): Promise<IMessage[]> {
    return Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: 1 })
      .exec();
  }

  async aggregateConversations(userId: string): Promise<any[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const result = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: objectId }, { receiver: objectId }],
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          content: 1,
          createdAt: 1,
          partner: {
            $cond: {
              if: { $eq: ["$sender", objectId] },
              then: "$receiver",
              else: "$sender",
            },
          },
        },
      },
      {
        $group: {
          _id: "$partner",
          lastMessage: { $last: "$$ROOT" },
          messagesCount: { $sum: 1 },
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);
    return result;
  }
}

export default new MessageRepository();
