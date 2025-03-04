import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUsers extends Document {
  _id: ObjectId;
  Name: String | null;
  Email: String | null;
  Password: String | null;
  Phone: String | null;
  UpdatedAt: Date | null;
  Bookings: ObjectId | null;
  CreatedAt: Date | null;
  Status: String | null;
}

const UsersSchema: Schema = new Schema({
  Name: { type: String },
  Email: { type: String },
  Password: { type: String },
  Phone: { type: String },
  UpdatedAt: { type: Date },
  Bookings: { type: Schema.Types.ObjectId },
  CreatedAt: { type: Date },
  Status: { type: String, enum: ["active", "blocked"] },
});

const Users = mongoose.model<IUsers>("Users", UsersSchema);

export default Users;
