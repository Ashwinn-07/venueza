import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../utils/notifications";

const BlockDatesPage = () => {
  const { getVenues, addBlockedDateForVenue } = useAuthStore();
  const navigate = useNavigate();

  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getVenues("all");
        const approvedVenues = (response.venues || []).filter(
          (venue: any) => venue.verificationStatus === "approved"
        );
        setVenues(approvedVenues);
      } catch (err: any) {
        setError(err.message || "Failed to fetch venues.");
        console.error("Error fetching venues:", err);
      }
    };
    fetchVenues();
  }, [getVenues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedVenueId.trim()) {
      setError("Please select a venue.");
      return;
    }
    if (startDate > endDate) {
      setError("Start date cannot be later than end date.");
      return;
    }
    try {
      setIsSubmitting(true);
      await addBlockedDateForVenue({
        venueId: selectedVenueId,
        startDate,
        endDate,
        reason,
      });
      notifySuccess("Successfully blocked dates");
      navigate("/vendor/dashboard");
    } catch (err: any) {
      console.error("Failed to add blocked date:", err);
      setError(err.message || "Failed to add blocked date");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow rounded-lg w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Block Offline Booking Dates
        </h1>
        <p className="text-gray-600 mb-6">
          Select a venue and enter the details below to block dates for offline
          bookings.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Venue
            </label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              dateFormat="dd-MM-yyyy"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
              dateFormat="dd-MM-yyyy"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter a reason for blocking dates"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Block Dates"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlockDatesPage;
