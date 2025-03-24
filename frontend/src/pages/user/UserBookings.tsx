import { useEffect, useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../../utils/notifications";

const UserBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getBookingsByUser } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">(
    "upcoming"
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login");
      return;
    }

    fetchBookings();
  }, [isAuthenticated, navigate, activeTab]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await getBookingsByUser();
      setBookings(response.bookings);
    } catch (error: any) {
      console.error("Error fetching bookings", error);
      notifyError(error.message || "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusLabel = (status: any) => {
    switch (status) {
      case "fully_paid":
        return "Fully Paid";
      case "cancelled":
        return "Cancelled";
      case "pending":
        return "Pending Payment";
      case "advance_paid":
        return "Advance Paid";
      default:
        return "Unknown Status";
    }
  };

  const handleCancelBooking = () => {
    alert("Coming soon: Cancel booking functionality");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeTab === "upcoming"
                      ? "bg-[#F4A261] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeTab === "past"
                      ? "bg-[#F4A261] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Past
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeTab === "all"
                      ? "bg-[#F4A261] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-[#F4A261]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found.</p>
                  <button
                    onClick={() => navigate("/user/venues")}
                    className="mt-4 px-4 py-2 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md transition duration-200 cursor-pointer"
                  >
                    Find Venues
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          {booking.venue.images &&
                          booking.venue.images.length > 0 ? (
                            <img
                              src={booking.venue.images[0]}
                              alt={booking.venue.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          <div
                            className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded ${
                              booking.status === "fully_paid"
                                ? "bg-green-500"
                                : booking.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {getStatusLabel(booking.status)}
                          </div>
                          ;
                        </div>
                        <div className="p-4 md:w-2/3">
                          <h3 className="text-xl font-semibold mb-2">
                            {booking.venue.name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {booking.venue.address}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Event Start
                              </p>
                              <p className="font-semibold">
                                {formatDate(booking.startDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Event Finish
                              </p>
                              <p className="font-semibold">
                                {formatDate(booking.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Booking Date
                              </p>
                              <p className="font-semibold">
                                {formatDate(booking.createdAt)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Total Price
                              </p>
                              <p className="font-semibold">
                                ₹{booking.totalPrice.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-4 flex justify-between items-center">
                            <div>
                              {!booking.advancePaid ? (
                                <p className="text-red-500 text-sm">
                                  Advance payment pending
                                </p>
                              ) : booking.balanceDue > 0 ? (
                                <p className="text-amber-600 text-sm">
                                  Balance due: ₹
                                  {booking.balanceDue.toLocaleString()}
                                </p>
                              ) : (
                                <p className="text-green-600 text-sm">
                                  Fully paid
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {booking.status === "pending" && (
                                <button
                                  onClick={() => handleCancelBooking()}
                                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-sm"
                                >
                                  Cancel
                                </button>
                              )}
                              {booking.advancePaid &&
                                booking.balanceDue > 0 &&
                                booking.status !== "cancelled" && (
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/user/bookings/balance/${booking._id}`
                                      )
                                    }
                                    className="px-3 py-1 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md text-sm cursor-pointer"
                                  >
                                    Pay Balance
                                  </button>
                                )}

                              {booking.status === "fully_paid" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/user/bookings/details/${booking._id}`
                                    )
                                  }
                                  className="px-3 py-1 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md text-sm cursor-pointer"
                                >
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
