import mongoose, { Schema, Document } from "mongoose";

export interface IBlockedDate extends Document {
  venue: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blockedDateSchema: Schema = new Schema(
  {
    venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

const BlockedDate = mongoose.model<IBlockedDate>(
  "BlockedDate",
  blockedDateSchema
);
export default BlockedDate;
