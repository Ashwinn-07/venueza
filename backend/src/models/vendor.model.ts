import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVendor extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  password: string;
  businessAddress: string;
  businessName: string;
  documents: string[];
  status: "pending" | "blocked" | "active";
  isVerified: boolean;
  otp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },
    profileImage: { type: String, default: null },
    password: { type: String, required: true },
    businessAddress: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    documents: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "blocked", "active"],
      default: "pending",
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
  },
  { timestamps: true }
);

const Vendors = mongoose.model<IVendor>("Vendor", vendorSchema);
export default Vendors;
