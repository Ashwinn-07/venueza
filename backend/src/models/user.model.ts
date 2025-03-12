import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  bookings?: ObjectId;
  status: "active" | "blocked";
  isVerified: boolean;
  otp?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: { googleId?: string }) {
        return !this.googleId;
      },
    },
    phone: { type: String, trim: true, default: null },
    profileImage: { type: String, default: null },
    bookings: { type: Schema.Types.ObjectId, ref: "Bookings", default: null },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    googleId: { type: String, default: null },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUser>("User", UserSchema);
export default Users;
