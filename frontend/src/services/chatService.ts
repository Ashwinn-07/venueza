import { userApi, vendorApi } from "./api";

export interface SendMessageData {
  sender: string;
  senderModel: string;
  receiver: string;
  receiverModel: string;
  content: string;
  room: string;
}

export const chatService = {
  sendMessage: async (data: SendMessageData, role: string) => {
    if (role === "vendor") {
      const response = await vendorApi.post("/messages", data);
      return response.data;
    }
    const response = await userApi.post("/messages", data);
    return response.data;
  },
  getConversation: async (sender: string, receiver: string, role: string) => {
    if (role === "vendor") {
      const response = await vendorApi.get("/conversation", {
        params: { sender, receiver },
      });
      return response.data;
    }
    const response = await userApi.get("/conversation", {
      params: { sender, receiver },
    });
    return response.data;
  },
  getConversations: async (role: string) => {
    if (role === "vendor") {
      const response = await vendorApi.get("/conversations");
      return response.data;
    }
    const response = await userApi.get("/conversations");
    return response.data;
  },
};
