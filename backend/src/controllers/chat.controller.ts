import { Request, Response } from "express";
import { IChatService } from "../services/interfaces/IChatService";
import { IChatController } from "./interfaces/IChatController";
import { io } from "../config/socket";
import { STATUS_CODES } from "../utils/constants";
import { INotificationService } from "../services/interfaces/INotificationService";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject(TOKENS.IChatService) private chatService: IChatService,
    @inject(TOKENS.INotificationService)
    private notificationService: INotificationService
  ) {}

  sendMessage = async (req: Request, res: Response): Promise<void> => {
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

      const { response, status } = await this.chatService.sendMessage({
        sender,
        senderModel,
        receiver,
        receiverModel,
        content,
        images,
      });

      if (room) {
        io.to(room).emit("receiveMessage", { ...response.data, room });
      } else {
        io.emit("receiveMessage", { ...response.data, room: "all" });
      }

      const notification = await this.notificationService.createNotification(
        receiver,
        receiverModel,
        "chat",
        "You have a new message"
      );
      io.to(receiver).emit("newNotification", notification);

      res.status(status).json(response);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  };

  getConversation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sender, receiver } = req.query;
      const currentUserId = (req as any).userId;

      const { response, status } = await this.chatService.getConversation(
        String(sender),
        String(receiver),
        currentUserId
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversation",
      });
    }
  };

  getConversations = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      const { response, status } = await this.chatService.getConversations(
        userId
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
      });
    }
  };
}
