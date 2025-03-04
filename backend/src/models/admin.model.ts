import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  Name: string;
  Email: string;
  Password: string;
  CreatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
