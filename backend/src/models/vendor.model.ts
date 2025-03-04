import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IVendors extends Document {
  _id: ObjectId;
  Phone: String | null;
  Email: String | null;
  Password: String | null;
  BusinessAddress: String | null;
  BusinessName: String | null;
  Name: String | null;
  Venues: ObjectId | null;
  UpdatedAt: Date | null;
  CreatedAt: Date | null;
  Statuse: String | null;
}

const VendorsSchema: Schema = new Schema({
  Phone: { type: String },
  Email: { type: String },
  Password: { type: String },
  BusinessAddress: { type: String },
  BusinessName: { type: String },
  Name: { type: String },
  Venues: { type: Schema.Types.ObjectId },
  UpdatedAt: { type: Date },
  CreatedAt: { type: Date },
  Statuse: { type: String, enum: ["pending", "blocked", "active"] },
});

const Vendors = mongoose.model<IVendors>("Vendors", VendorsSchema);

export default Vendors;
