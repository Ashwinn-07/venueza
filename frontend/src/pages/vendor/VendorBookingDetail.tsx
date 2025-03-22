import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";

const VendorBookingDetail = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getBookingById } = useAuthStore();
  const [booking, setBooking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setIsLoading(true);
        if (!bookingId) throw new Error("Booking ID is required");

        const response = await getBookingById(bookingId);

        if (!response || !response.booking) {
          setError("Booking not found");
        } else {
          setBooking(response.booking);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch booking details.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId, getBookingById]);

  const updateBookingStatus = async (newStatus: "confirmed" | "cancelled") => {
    try {
      if (booking) {
        setBooking({ ...booking, status: newStatus });
      }
    } catch (err: any) {
      console.error("Error updating booking status:", err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading booking details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!booking) {
    return <div className="p-8 text-center">Booking not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate("/vendor/bookings")}
            className="flex items-center text-blue-600 mb-4 cursor-pointer"
          >
            ← Back to Bookings
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Booking Details</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
              booking.status
            )}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>

          {booking.status === "pending" && (
            <div className="flex space-x-2">
              <button
                onClick={() => updateBookingStatus("confirmed")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => updateBookingStatus("cancelled")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Venue Details</h3>
            <div className="flex items-start">
              <img
                src={booking.venue.images[0] || "/placeholder.jpg"}
                alt={booking.venue.name}
                className="w-24 h-24 object-cover rounded mr-4"
              />
              <div>
                <p className="font-medium">{booking.venue.name}</p>
                <p className="text-gray-600">{booking.venue.address}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-medium">{booking._id}</p>
              </div>
              <div>
                <p className="text-gray-600">Booking Date</p>
                <p className="font-medium">
                  {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Event Start</p>
                <p className="font-medium">
                  {format(new Date(booking.startDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Event End</p>
                <p className="font-medium">
                  {format(new Date(booking.endDate), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{booking.user.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{booking.user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">
                  {booking.user.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>

          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">
                ₹{booking.totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Advance Payment</span>
              <span className="font-medium">
                ₹{booking.advanceAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance Due</span>
              <span className="font-medium">
                ₹{booking.balanceDue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Payment Status</span>
              <span
                className={`font-medium ${
                  booking.advancePaid ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {booking.advancePaid ? "Advance Paid" : "Payment Pending"}
              </span>
            </div>
            {booking.paymentId && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment ID</span>
                <span className="font-medium">{booking.paymentId}</span>
              </div>
            )}
            {booking.razorpayOrderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{booking.razorpayOrderId}</span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Payment Timeline</h3>
            <ul className="text-sm">
              <li className="flex justify-between mb-1">
                <span>Advance payment</span>
                <span>{booking.advancePaid ? "Completed" : "Pending"}</span>
              </li>
              <li className="flex justify-between">
                <span>Balance payment</span>
                <span>Due at venue</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBookingDetail;
