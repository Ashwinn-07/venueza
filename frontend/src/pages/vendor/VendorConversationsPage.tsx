import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";

interface Conversation {
  _id: string;
  partner: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCount: number;
}

const VendorConversationsPage = () => {
  const navigate = useNavigate();
  const { user, getConversations } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        if (response && response.data) {
          setConversations(response.data);
          setFilteredConversations(response.data);
        }
      } catch (err: any) {
        console.error("Error fetching conversations:", err);
        setError(err.message || "Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [getConversations]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conversation) =>
        conversation.partner.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const handleChatSelect = (userId: string) => {
    navigate(`/vendor/chat/${userId}`);
  };

  const formatTimeOrDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();

    if (isToday) {
      return format(messageDate, "h:mm a");
    } else if (
      now.getTime() - messageDate.getTime() <
      7 * 24 * 60 * 60 * 1000
    ) {
      return format(messageDate, "EEE");
    } else {
      return format(messageDate, "MMM d");
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <p className="text-xl text-gray-600">Loading conversations...</p>
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
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Customer Conversations
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg">No conversations found</p>
                {searchQuery ? (
                  <p className="text-sm mt-2">Try a different search term</p>
                ) : (
                  <p className="text-sm mt-2">
                    Your customer inquiries will appear here
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => {
                  const isUnread = conversation.unreadCount > 0;
                  const isVendorSender =
                    conversation.lastMessage?.sender === user?.id;

                  return (
                    <div
                      key={conversation._id}
                      onClick={() => handleChatSelect(conversation.partner._id)}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 hover:border-gray-200"
                    >
                      {conversation.partner.profileImage ? (
                        <img
                          src={conversation.partner.profileImage}
                          alt={conversation.partner.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getInitials(conversation.partner.name)}
                        </div>
                      )}

                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3
                            className={`font-semibold text-gray-900 truncate ${
                              isUnread ? "font-bold" : ""
                            }`}
                          >
                            {conversation.partner.name}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {conversation.lastMessage?.createdAt &&
                              formatTimeOrDate(
                                conversation.lastMessage.createdAt
                              )}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <p
                            className={`text-sm truncate max-w-xs ${
                              isUnread
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {isVendorSender && "You: "}
                            {conversation.lastMessage?.content ||
                              "No messages yet"}
                          </p>

                          {isUnread && (
                            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorConversationsPage;
