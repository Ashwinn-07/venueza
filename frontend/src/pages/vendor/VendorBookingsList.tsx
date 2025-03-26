import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";
import { notifyError, notifySuccess } from "../../utils/notifications";
// import { useNavigate } from "react-router-dom";

const VendorBookingsList = () => {
  const { getBookingsByVendor, cancelBookingByVendor } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  // const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await getBookingsByVendor();
        setBookings(response.bookings || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [getBookingsByVendor]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "pending") return booking.status === "pending";
    if (filter === "advance_paid") return booking.status === "advance_paid";
    if (filter === "balance_pending")
      return booking.status === "balance_pending";
    if (filter === "fully_paid")
      return booking.status === "fully_paid" || booking.status === "confirmed";
    if (filter === "cancelled")
      return (
        booking.status === "cancelled" ||
        booking.status === "cancelled_by_user" ||
        booking.status === "cancelled_by_vendor"
      );
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "advance_paid":
        return "bg-blue-100 text-blue-800";
      case "balance_pending":
        return "bg-purple-100 text-purple-800";
      case "fully_paid":
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled_by_user":
      case "cancelled_by_vendor":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const openModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancelReason("");
    setShowModal(true);
  };
  const confirmCancellation = async () => {
    if (!cancelReason.trim()) {
      notifyError("Please enter a cancellation reason.");
      return;
    }
    try {
      await cancelBookingByVendor(selectedBookingId, cancelReason);
      notifySuccess("Booking cancelled and refund processed.");
      const response = await getBookingsByVendor();
      setBookings(response.bookings || []);
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      notifyError(err.message || "Cancellation failed");
    } finally {
      setShowModal(false);
      setSelectedBookingId("");
    }
  };

  const cancelModal = () => {
    setShowModal(false);
    setSelectedBookingId("");
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading bookings...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bookings Management
        </h1>
        <p className="text-gray-600">
          View and manage all bookings for your venues
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All Bookings
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "advance_paid" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("advance_paid")}
        >
          Advance Paid
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "balance_pending"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setFilter("balance_pending")}
        >
          Balance Pending
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "fully_paid" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("fully_paid")}
        >
          Fully Paid
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "cancelled" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No bookings found for this category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.venue?.name || "Venue name"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(booking.startDate), "MMM dd, yyyy")}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {format(new Date(booking.endDate), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.user?.name || "Customer name"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.user?.email || "customer@example.com"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{booking.totalPrice}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.advancePaid ? "Advance paid" : "Advance pending"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status
                        .split("_")
                        .map(
                          (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === "advance_paid" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(booking._id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {/* <button
                      onClick={() =>
                        navigate(`/vendor/bookings/${booking._id}`)
                      }
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    >
                      View Details
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to cancel this booking? Please provide a
              cancellation reason:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              rows={3}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorBookingsList;
