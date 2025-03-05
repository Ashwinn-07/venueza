import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVendor extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  businessAddress: string;
  businessName: string;
  venues?: ObjectId;
  status: "pending" | "blocked" | "active";
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
    password: { type: String, required: true },
    businessAddress: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    venues: { type: Schema.Types.ObjectId, ref: "Venues", default: null },
    status: {
      type: String,
      enum: ["pending", "blocked", "active"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Vendors = mongoose.model<IVendor>("Vendor", vendorSchema);
export default Vendors;
