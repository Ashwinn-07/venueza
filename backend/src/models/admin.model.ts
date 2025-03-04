import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  Email: String | null;
  Name: String | null;
  Password: String | null;
  CreatedAt: Date | null;
}

const AdminSchema: Schema = new Schema({
  Email: { type: String },
  Name: { type: String },
  Password: { type: String },
  CreatedAt: { type: Date },
});

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
