import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, User, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";
import { io, Socket } from "socket.io-client";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { notifyError, notifySuccess } from "../../utils/notifications";

interface Message {
  _id: string;
  content: string;
  sender: string | { _id: string; [key: string]: any };
  senderModel: string;
  receiver: string;
  receiverModel: string;
  images?: string[];
  readAt: string;
  createdAt: string;
}

interface Partner {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

const VendorChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, sendMessage, getConversation } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sending, setSending] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.userId || user?.id;

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
    if (!socket || !user?.id || !userId) return;

    const room = [user.id, userId].sort().join("-");
    socket.emit("joinRoom", room);

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, user?.id, userId]);

  useEffect(() => {
    if (!socket || !user?.id || !userId) return;

    socket.on("messagesRead", ({ conversation }) => {
      console.log("Messages read event received:", conversation);

      setMessages((prev) =>
        prev.map((msg) => {
          const messageSenderId =
            typeof msg.sender === "object" ? msg.sender._id : msg.sender;

          if (
            messageSenderId === user.id &&
            msg.receiver === conversation.sender
          ) {
            return { ...msg, readAt: new Date().toISOString() };
          }
          return msg;
        })
      );
    });

    return () => {
      socket.off("messagesRead");
    };
  }, [socket, user?.id, userId]);

  useEffect(() => {
    if (!userId || !user?.id) return;

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const response = await getConversation(user.id, userId);
        if (response) {
          setMessages(response.data || []);
          setPartner(response.partner || null);
        }
      } catch (err: any) {
        console.error("Error fetching conversation:", err);
        setError(err.message || "Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [userId, user?.id, getConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && imageUrls.length === 0) || !userId || !user?.id)
      return;

    try {
      setSending(true);
      const room = [user.id, userId].sort().join("-");

      const data = {
        sender: user.id,
        senderModel: "Vendor",
        receiver: userId,
        receiverModel: "User",
        content: newMessage,
        room,
        images: imageUrls,
      };

      await sendMessage(data);
      setNewMessage("");
      setSelectedImages([]);
      setImageUrls([]);
    } catch (err: any) {
      console.error("Error sending message:", err);
      notifyError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const messageDate = new Date(dateString);
    return format(messageDate, "h:mm a");
  };

  const formatDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    return format(messageDate, "MMMM d, yyyy");
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

  const normalizeId = (id: any): string | null => {
    if (!id) return null;

    if (typeof id === "string") {
      const objectIdMatch = id.match(/new ObjectId\('([^']+)'\)/);
      if (objectIdMatch && objectIdMatch[1]) {
        return objectIdMatch[1];
      }
      return id;
    }

    if (typeof id === "object") {
      if (id._id) {
        return id._id.toString();
      }
      return id.toString();
    }

    return id.toString();
  };

  const messageGroups = groupMessagesByDate();

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <p className="text-xl text-gray-600">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center">
          <button
            onClick={() => navigate("/vendor/conversations")}
            className="mr-4 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center">
            {partner?.profileImage ? (
              <img
                src={partner.profileImage}
                alt={partner.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {partner?.name ? getInitials(partner.name) : <User size={20} />}
              </div>
            )}

            <div className="ml-3">
              <h2 className="font-semibold text-gray-900">
                {partner?.name || "Customer"}
              </h2>
              <p className="text-xs text-gray-500">{partner?.email || ""}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              Object.entries(messageGroups).map(([date, messagesForDate]) => (
                <div key={date} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {date}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {messagesForDate.map((message) => {
                      const senderId = normalizeId(message.sender);
                      const isVendor = senderId === currentUserId;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            isVendor ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                              isVendor
                                ? "bg-blue-600 text-white rounded-br-none"
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
                                      onClick={() =>
                                        window.open(image, "_blank")
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            <p
                              className={`text-xs mt-1 text-right ${
                                isVendor ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              <p
                                className={`text-xs mt-1 text-right ${
                                  isVendor ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                                {isVendor && (
                                  <span className="ml-1">
                                    {message.readAt ? "✓✓" : "✓"}
                                  </span>
                                )}
                              </p>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
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

        <div className="bg-white border-t border-gray-200 p-4">
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
                <ImageIcon size={20} />
              </label>
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending || imageUploadLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={
                (!newMessage.trim() && imageUrls.length === 0) ||
                sending ||
                imageUploadLoading
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {(sending || imageUploadLoading) && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
            {imageUploadLoading ? "Uploading images..." : "Sending message..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorChatPage;
