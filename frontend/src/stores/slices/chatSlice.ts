import { StateCreator } from "zustand";
import { chatService, SendMessageData } from "../../services/chatService";
import { AuthSlice } from "./authSlice";

export interface ChatSlice {
  sendMessage: (data: SendMessageData) => Promise<any>;
  getConversation: (sender: string, receiver: string) => Promise<any>;
  getConversations: () => Promise<any>;
}

export const createChatSlice: StateCreator<
  AuthSlice & ChatSlice,
  [],
  [],
  ChatSlice
> = (_set, get) => ({
  sendMessage: async (data: SendMessageData) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || !authType)
        throw new Error("Authentication required");
      return await chatService.sendMessage(data, authType);
    } catch (error) {
      console.error("Failed to send message", error);
      throw error;
    }
  },
  getConversation: async (sender: string, receiver: string) => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || !authType)
        throw new Error("Authentication required");
      return await chatService.getConversation(sender, receiver, authType);
    } catch (error) {
      console.error("Failed to get conversation", error);
      throw error;
    }
  },
  getConversations: async () => {
    try {
      const { isAuthenticated, authType } = get();
      if (!isAuthenticated || !authType)
        throw new Error("Authentication required");
      return await chatService.getConversations(authType);
    } catch (error) {
      console.error("Failed to get conversations", error);
      throw error;
    }
  },
});
