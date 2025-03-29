import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthStore } from "../../stores/authStore";

type CalendarDate = {
  date: Date;
  status: "available" | "blocked";
  reason?: string;
};

type VenueBookingData = {
  venueId: string;
  venueName: string;
  dates: CalendarDate[];
};

const VenueCalendarPage = () => {
  const { getVenues, getBookedDatesForVenueForVendor } = useAuthStore();
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [calendarData, setCalendarData] = useState<VenueBookingData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<any>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch venues on component mount
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await getVenues();
        const approvedVenues = (response.result?.venues || []).filter(
          (venue: any) => venue.verificationStatus === "approved"
        );
        setVenues(approvedVenues);
        if (approvedVenues.length > 0) {
          setSelectedVenueId(approvedVenues[0]._id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch venues.");
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [getVenues]);

  // Fetch blocked dates for selected venue
  useEffect(() => {
    const fetchDatesForVenue = async () => {
      if (!selectedVenueId) return;

      // Clear previous errors when trying a new venue
      setError("");

      try {
        setLoading(true);

        // Get the selected venue details
        const selectedVenue = venues.find(
          (venue) => venue._id === selectedVenueId
        );

        // Prepare calendar data for the venue
        const venueData: VenueBookingData = {
          venueId: selectedVenueId,
          venueName: selectedVenue?.name || "Unknown Venue",
          dates: [],
        };

        try {
          // Get all unavailable dates (both online bookings and offline blocked dates)
          const unavailableDatesResponse =
            await getBookedDatesForVenueForVendor(selectedVenueId);

          const unavailableDates = unavailableDatesResponse.bookedDates;
          console.log(unavailableDates);

          // Process unavailable dates
          unavailableDates.forEach((block: any) => {
            if (block && block.startDate && block.endDate) {
              const start = new Date(block.startDate);
              const end = new Date(block.endDate);

              // Add each day in the blocked range
              const currentDate = new Date(start);
              while (currentDate <= end) {
                venueData.dates.push({
                  date: new Date(currentDate),
                  status: "blocked",
                  reason: block.reason || "Not available",
                });
                currentDate.setDate(currentDate.getDate() + 1);
              }
            }
          });
        } catch (apiErr: any) {
          console.error("API Error fetching dates:", apiErr);
          setError(
            "Could not load booking data. Showing all dates as available."
          );
        }

        setCalendarData([venueData]);
      } catch (err: any) {
        setError(
          "Could not load calendar data properly. All dates are shown as available."
        );
        console.error("Error in calendar processing:", err);

        // Still set empty calendar data so the component renders
        if (selectedVenueId) {
          const selectedVenue = venues.find(
            (venue) => venue._id === selectedVenueId
          );

          setCalendarData([
            {
              venueId: selectedVenueId,
              venueName: selectedVenue?.name || "Unknown Venue",
              dates: [],
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDatesForVenue();
  }, [selectedVenueId, getBookedDatesForVenueForVendor, venues]);

  // Get date status for the currently selected venue
  const getDateInfo = (date: Date) => {
    if (!calendarData.length) return { status: "available" };

    const venueData = calendarData[0];
    const matchingDate = venueData.dates.find(
      (item) =>
        item.date.getDate() === date.getDate() &&
        item.date.getMonth() === date.getMonth() &&
        item.date.getFullYear() === date.getFullYear()
    );

    return matchingDate
      ? { status: matchingDate.status, reason: matchingDate.reason }
      : { status: "available" };
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const { status } = getDateInfo(date);

    if (status === "available") {
      return <div className="h-1 w-full bg-green-500 rounded-full mt-1"></div>;
    } else if (status === "blocked") {
      return <div className="h-1 w-full bg-red-500 rounded-full mt-1"></div>;
    }

    return null;
  };

  // Custom class names for calendar tiles
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";

    const { status } = getDateInfo(date);

    if (status === "available") {
      return "available-day cursor-pointer";
    } else if (status === "blocked") {
      return "unavailable-day cursor-pointer";
    }

    return "";
  };

  // Handle calendar tile click to show details
  const handleTileClick = (date: Date) => {
    const { status, reason } = getDateInfo(date);
    const formattedDate = date.toLocaleDateString();

    if (status === "blocked") {
      alert(
        `Date: ${formattedDate}\nStatus: Not Available\nReason: ${
          reason || "Date is not available for booking"
        }`
      );
    } else {
      alert(
        `Date: ${formattedDate}\nStatus: Available\nThis date is available for booking.`
      );
    }
  };

  if (loading && !venues.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Venue Calendar
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-yellow-100 text-yellow-800 rounded">
              <p className="font-medium">Note:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Venue
            </label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {venues.length > 0 ? (
                venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ))
              ) : (
                <option value="">No venues available</option>
              )}
            </select>
          </div>

          {loading && selectedVenueId ? (
            <div className="flex justify-center py-8">
              <div className="text-lg text-gray-600">
                Loading calendar data...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Not Available</span>
                </div>
              </div>

              <div className="calendar-container">
                <Calendar
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  onClickDay={handleTileClick}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  className="w-full border-none shadow-none"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  Instructions:
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click on any date to see its status details</li>
                  <li>• To block dates, visit the "Block Dates" page</li>
                  <li>• Green dates are available for booking</li>
                  <li>• Red dates are not available for booking</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .calendar-container .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }

        .calendar-container .react-calendar__tile {
          position: relative;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding-top: 10px;
        }

        .calendar-container .react-calendar__month-view__days__day--weekend {
          color: #d10000;
        }

        .calendar-container .available-day:hover {
          background-color: rgba(0, 128, 0, 0.1);
        }

        .calendar-container .unavailable-day:hover {
          background-color: rgba(255, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default VenueCalendarPage;
