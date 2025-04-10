import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ChevronLeft, Image as ImageIcon } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../stores/authStore";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { format } from "date-fns";

interface Message {
  _id: string;
  content: string;
  sender: string | { _id: string; [key: string]: any };
  senderModel: string;
  receiver: string;
  receiverModel: string;
  images?: string[];
  createdAt: string;
}

interface ChatPartner {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

const ChatPage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { user, sendMessage, getConversation } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
    );
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user || !vendorId) return;
    const senderId = user.userId || user.id;

    const room = [senderId, vendorId].sort().join("-");

    socket.emit("joinRoom", room);

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, user, vendorId]);

  useEffect(() => {
    if (!user || !vendorId) return;

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const senderId = user.userId || user.id;
        const result = await getConversation(senderId, vendorId);

        if (result && result.data) {
          setMessages(result.data || []);

          if (result.data.partner) {
            setChatPartner(result.data.partner);
          }
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        notifyError("Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [user, vendorId, getConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        notifyError("You can only upload up to 5 images at once");
        return;
      }

      setSelectedImages(files);

      try {
        setImageUploadLoading(true);
        const urls = await Promise.all(
          files.map((file) => uploadImageToCloudinary(file))
        );
        setImageUrls(urls);
        notifySuccess("Images uploaded successfully");
      } catch (error) {
        console.error("Error uploading images:", error);
        notifyError("Failed to upload images");
      } finally {
        setImageUploadLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!messageText.trim() && imageUrls.length === 0) || !user || !vendorId)
      return;

    try {
      setSending(true);

      const senderId = user.userId || user.id;

      const room = [senderId, vendorId].sort().join("-");

      const messageData = {
        sender: senderId,
        senderModel: "User",
        receiver: vendorId,
        receiverModel: "Vendor",
        content: messageText,
        room,
        images: imageUrls,
      };

      await sendMessage(messageData);

      setMessageText("");
      setSelectedImages([]);
      setImageUrls([]);
    } catch (error) {
      console.error("Error sending message:", error);
      notifyError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const messageGroups = groupMessagesByDate();

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white shadow border-b border-gray-200 py-4 px-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 mr-2 text-gray-600 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center">
            {chatPartner?.profileImage ? (
              <img
                src={chatPartner.profileImage}
                alt={chatPartner.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-[#2A9D8F] rounded-full flex items-center justify-center text-white font-semibold">
                {chatPartner?.name
                  ? getInitials(chatPartner.name)
                  : chatPartner?.name?.charAt(0) || "V"}
              </div>
            )}
            <div className="ml-3">
              <h2 className="font-semibold text-gray-900">
                {chatPartner?.name || "Vendor"}
              </h2>
              {chatPartner?.email && (
                <p className="text-xs text-gray-500">{chatPartner.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto">
          {Object.keys(messageGroups).length > 0 ? (
            Object.entries(messageGroups).map(([date, messagesForDate]) => (
              <div key={date} className="mb-6">
                <div className="flex justify-center mb-4">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                    {date}
                  </span>
                </div>

                <div className="space-y-4">
                  {messagesForDate.map((message) => {
                    const senderId =
                      typeof message.sender === "object"
                        ? message.sender._id
                        : message.sender;

                    const isCurrentUser =
                      senderId === (user?.userId || user?.id);

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                            isCurrentUser
                              ? "bg-[#2A9D8F] text-white rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                          }`}
                        >
                          {message.content && (
                            <p className="break-words">{message.content}</p>
                          )}

                          {message.images && message.images.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {message.images.map((image, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={image}
                                    alt={`Chat attachment ${index + 1}`}
                                    className="rounded-md max-h-40 object-cover cursor-pointer"
                                    onClick={() => window.open(image, "_blank")}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div
                            className={`text-xs mt-1 text-right ${
                              isCurrentUser ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm mt-2">Start the conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {selectedImages.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-2">
          <div className="max-w-3xl mx-auto">
            <div className="flex overflow-x-auto gap-2 py-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => {
                      const newSelectedImages = [...selectedImages];
                      newSelectedImages.splice(index, 1);
                      setSelectedImages(newSelectedImages);

                      const newImageUrls = [...imageUrls];
                      newImageUrls.splice(index, 1);
                      setImageUrls(newImageUrls);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border-t border-gray-200 p-4"
      >
        <div className="max-w-3xl mx-auto flex items-center">
          <div className="mr-2">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={imageUploadLoading || sending}
            />
            <label
              htmlFor="image-upload"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer block"
            >
              <ImageIcon className="w-5 h-5" />
            </label>
          </div>

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
            disabled={sending || imageUploadLoading}
          />

          <button
            type="submit"
            disabled={
              (!messageText.trim() && imageUrls.length === 0) ||
              sending ||
              imageUploadLoading
            }
            className="bg-[#2A9D8F] text-white px-4 py-2 rounded-r-lg hover:bg-[#2A9D8F]/90 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {(sending || imageUploadLoading) && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
          {imageUploadLoading ? "Uploading images..." : "Sending message..."}
        </div>
      )}
    </div>
  );
};

export default ChatPage;
