import { Request, Response } from "express";
import chatService from "../services/chat.service";
import { IChatController } from "./interfaces/IChatController";
import { io } from "../config/socket";
import { STATUS_CODES } from "../utils/constants";
import notificationService from "../services/notification.service";

class ChatController implements IChatController {
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const {
        sender,
        senderModel,
        receiver,
        receiverModel,
        content,
        images,
        room,
      } = req.body;
      const result = await chatService.sendMessage({
        sender,
        senderModel,
        receiver,
        receiverModel,
        content,
        images,
      });
      if (room) {
        io.to(room).emit("receiveMessage", { ...result.data.toObject(), room });
      } else {
        io.emit("receiveMessage", { ...result.data.toObject(), room: "all" });
      }

      const notification = await notificationService.createNotification(
        receiver,
        receiverModel,
        "chat",
        "You have a new message"
      );
      io.to(receiver).emit("newNotification", notification);

      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error sending message:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  }
  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { sender, receiver } = req.query;
      if (!sender || !receiver) {
        throw new Error("Sender and receiver are required");
      }
      const result = await chatService.getConversation(
        String(sender),
        String(receiver)
      );
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error fetching conversation:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversation",
      });
    }
  }
  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const result = await chatService.getConversations(userId);
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error fetching conversations", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
      });
    }
  }
}

export default new ChatController();
