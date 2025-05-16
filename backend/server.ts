import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import "./src/config/di-container";
import app from "./src/app";
import connectDB from "./src/config/db";
import http from "http";
import { initializeSocket } from "./src/config/socket";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initializeSocket(server);
    server.listen(PORT, () => {
      console.log(`Server up!`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
