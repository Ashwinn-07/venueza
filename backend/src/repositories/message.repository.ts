import mongoose from "mongoose";
import Message, { IMessage } from "../models/message.model";
import { BaseRepository } from "./base.repository";
import { IMessageRepository } from "./interfaces/IMessageReposiotry";
import { injectable } from "tsyringe";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
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
        $lookup: {
          from: "users",
          let: { partnerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$_id", "$$partnerId"] },
                    { $eq: ["$userId", "$$partnerId"] },
                  ],
                },
              },
            },
          ],
          as: "userPartner",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "vendorPartner",
        },
      },
      {
        $addFields: {
          partner: {
            $ifNull: [
              { $arrayElemAt: ["$userPartner", 0] },
              { $arrayElemAt: ["$vendorPartner", 0] },
            ],
          },
        },
      },
      {
        $project: {
          userPartner: 0,
          vendorPartner: 0,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);
    return result;
  }
  async markMessagesAsRead(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        readAt: null,
      },
      {
        $set: { readAt: new Date() },
      }
    ).exec();
  }
}
