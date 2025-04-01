import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, User } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";
import { io, Socket } from "socket.io-client";

interface Message {
  _id: string;
  sender: string | { _id: string; [key: string]: any };
  content: string;
  createdAt: string;
  read: boolean;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !user?.id) return;

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
      };

      await sendMessage(data);
      setNewMessage("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();

    if (isToday) {
      return format(messageDate, "h:mm a");
    } else {
      return format(messageDate, "MMM d, h:mm a");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const senderId =
                  typeof message.sender === "object"
                    ? message.sender._id
                    : message.sender;

                const isVendor = senderId === user?.id;
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
                      <p className="break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          isVendor ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {sending && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
            Sending message...
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorChatPage;
