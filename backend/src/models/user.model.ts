import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  Name: string;
  Email: string;
  Password: string;
  Phone?: string;
  Bookings?: ObjectId;
  Status: "active" | "blocked";
  CreatedAt: Date;
  UpdatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    Name: { type: String, required: true, trim: true },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    Password: { type: String, required: true },
    Phone: { type: String, trim: true, default: null },
    Bookings: { type: Schema.Types.ObjectId, ref: "Bookings", default: null },
    Status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUser>("User", UserSchema);
export default Users;
