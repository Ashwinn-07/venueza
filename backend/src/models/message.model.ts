import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  senderModel: string;
  receiver: mongoose.Types.ObjectId;
  receiverModel: string;
  content: string;
  images?: string[];
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: { type: String, required: true, enum: ["User", "Vendor"] },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: { type: String, required: true, enum: ["User", "Vendor"] },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
