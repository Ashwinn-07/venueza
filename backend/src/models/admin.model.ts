import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const adminSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
