import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("mongoDB connected");
  } catch (err) {
    console.log("error while connecting to the database", err);
    throw err;
  }
}
