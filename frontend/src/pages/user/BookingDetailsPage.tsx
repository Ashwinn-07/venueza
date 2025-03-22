import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookingById } = useAuthStore();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await getBookingById(id);
        setBooking(response.booking);
      } catch (err: any) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, getBookingById]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-[#2A9D8F] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-700">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/user/bookings")}
              className="px-6 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#264653] transition-colors"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Booking Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the booking you're looking for.
            </p>
            <button
              onClick={() => navigate("/user/bookings")}
              className="px-6 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#264653] transition-colors"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = booking.status.replace("_", " ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-[#264653] p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  status
                )}`}
              >
                {status.toUpperCase()}
              </span>
            </div>
            <p className="text-teal-200 mt-1">Reference ID: {booking._id}</p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                Venue Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-[#2A9D8F] mb-2">
                  {booking.venue?.name || "N/A"}
                </h3>
                <p className="text-gray-600">
                  {booking.venue?.address || "Address not available"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                Booking Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">From</p>
                  <p className="text-gray-800 font-bold">
                    {formatDate(booking.startDate)}
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-teal-600 font-medium">To</p>
                  <p className="text-gray-800 font-bold">
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                Payment Details
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="text-gray-900 font-bold">
                    ₹{booking.totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Advance Payment:</span>
                  <span
                    className={
                      booking.advancePaid
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {booking.advancePaid ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-800 font-semibold">
                    Balance Due:
                  </span>
                  <span className="text-xl text-gray-900 font-bold">
                    ₹{booking.balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={() => navigate("/user/bookings")}
              className="w-full bg-[#2A9D8F] text-white py-3 px-4 rounded-lg hover:bg-[#264653] transition-colors flex items-center justify-center font-medium cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
