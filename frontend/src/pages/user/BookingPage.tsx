import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const BookingPage = () => {
  const { id: venueId } = useParams();
  const navigate = useNavigate();
  const { getUserVenue, createBooking, getBookedDatesForVenue } =
    useAuthStore();

  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);

  const getDatesInRange = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!venueId) return;
      try {
        setLoading(true);
        const response = await getUserVenue(venueId);
        const venueData = response.result?.venue;
        setVenue(venueData);
        setTotalPrice(venueData.price || 0);
        setAdvanceAmount((venueData.price || 0) * 0.2);
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError("Failed to load venue details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenueData();
  }, [venueId, getUserVenue]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!venueId) return;
      try {
        const response = await getBookedDatesForVenue(venueId);
        let allBookedDates: Date[] = [];
        response.bookedDates.forEach((booking: any) => {
          const bookingDates = getDatesInRange(
            new Date(booking.startDate),
            new Date(booking.endDate)
          );
          allBookedDates = allBookedDates.concat(bookingDates);
        });

        const today = new Date();
        const blockedDays: Date[] = [];
        for (let i = 0; i < 5; i++) {
          const day = new Date(today);
          day.setDate(today.getDate() + i);
          blockedDays.push(day);
        }

        const excluded = allBookedDates.concat(blockedDays);
        setExcludedDates(excluded);
      } catch (err) {
        console.error("Error fetching booked dates:", err);
      }
    };
    fetchBookedDates();
  }, [venueId, getBookedDatesForVenue]);

  const calculatePrice = (start: Date, end: Date) => {
    if (!venue || !venue.price) return;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays > 0 ? diffDays : 1;
    const calculatedTotal = venue.price * days;
    setTotalPrice(calculatedTotal);
    setAdvanceAmount(calculatedTotal * 0.2);
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    setStartDate(date);
    calculatePrice(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    setEndDate(date);
    calculatePrice(startDate, date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId || !venue) {
      setError("Invalid venue information");
      return;
    }
    try {
      setIsSubmitting(true);
      const bookingData = {
        startDate,
        endDate,
        totalPrice,
      };
      const response = await createBooking(venueId, bookingData);
      if (!response?.booking?._id) {
        throw new Error("Invalid booking response from server");
      }
      navigate(`/user/payment/${response.booking._id}`);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading venue details...</div>
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

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Venue not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Book {venue.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 overflow-hidden">
                {venue.images && venue.images.length > 0 ? (
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
                <p className="text-gray-600 mb-4">
                  {venue.address || "Address not available"}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">₹{venue.price}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{venue.capacity} people</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      excludeDates={excludedDates}
                      minDate={new Date()}
                      dateFormat="dd-MM-yyyy"
                      className="p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium mb-1">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      excludeDates={excludedDates}
                      minDate={startDate}
                      dateFormat="dd-MM-yyyy"
                      className="p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Venue price per day:</span>
                    <span className="font-medium">
                      ₹{venue.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total booking amount:</span>
                    <span className="font-semibold">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3 border-dashed border-gray-300">
                    <span className="text-gray-600">Advance amount (20%):</span>
                    <span className="font-semibold text-blue-600">
                      ₹{advanceAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Balance due at venue:</span>
                    <span className="font-semibold">
                      ₹{(totalPrice - advanceAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#2A9D8F] text-white py-2 px-4 rounded-md hover:bg-[#264653] transition-colors cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
