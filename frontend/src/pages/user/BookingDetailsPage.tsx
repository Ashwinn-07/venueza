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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No booking found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <div className="space-y-4">
          <p>
            <span className="font-medium">Booking ID:</span> {booking._id}
          </p>
          <p>
            <span className="font-medium">Venue:</span>{" "}
            {booking.venue?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium">Venue Address:</span>{" "}
            {booking.venue?.address || "N/A"}
          </p>
          <p>
            <span className="font-medium">Booking Start Date:</span>{" "}
            {new Date(booking.startDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Booking End Date:</span>{" "}
            {new Date(booking.endDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Total Price:</span> ₹
            {booking.totalPrice}
          </p>
          <p>
            <span className="font-medium">Advance Paid:</span>{" "}
            {booking.advancePaid ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Balance Due:</span> ₹
            {booking.balanceDue}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {booking.status.replace("_", " ").toUpperCase()}
          </p>
        </div>
        <button
          onClick={() => navigate("/user/bookings")}
          className="mt-6 w-full bg-[#2A9D8F] text-white py-2 px-4 rounded-md hover:bg-[#264653] transition-colors cursor-pointer"
        >
          Back to My Bookings
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
