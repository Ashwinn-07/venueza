import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVendor extends Document {
  _id: ObjectId;
  Name: string;
  Email: string;
  Phone: string;
  Password: string;
  BusinessAddress: string;
  BusinessName: string;
  Venues?: ObjectId;
  Status: "pending" | "blocked" | "active";
  CreatedAt: Date;
  UpdatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    Name: { type: String, required: true, trim: true },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    Phone: { type: String, required: true, trim: true },
    Password: { type: String, required: true },
    BusinessAddress: { type: String, required: true, trim: true },
    BusinessName: { type: String, required: true, trim: true },
    Venues: { type: Schema.Types.ObjectId, ref: "Venues", default: null },
    Status: {
      type: String,
      enum: ["pending", "blocked", "active"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Vendors = mongoose.model<IVendor>("Vendor", VendorSchema);
export default Vendors;
