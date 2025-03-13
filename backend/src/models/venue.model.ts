import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVenue extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  capacity: number;
  price: number;
  images: string[];
  services: string[];
  documents: string[];
  status: "open" | "closed";
  verificationStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const venueSchema: Schema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
      },
    },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    services: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    status: { type: String, enum: ["open", "closed"], default: "closed" },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Venue = mongoose.model<IVenue>("Venue", venueSchema);
export default Venue;
