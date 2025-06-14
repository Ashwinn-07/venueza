import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuthStore } from "../../stores/authStore";
import { X } from "lucide-react";

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

type DateDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  status: string;
  reason?: string;
};

const DateDetailsModal = ({
  isOpen,
  onClose,
  date,
  status,
  reason,
}: DateDetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full ${
                status === "available" ? "bg-green-500" : "bg-red-500"
              } mr-3`}
            ></div>
            <span className="text-gray-700 font-medium">
              {status === "available"
                ? "Available for Booking"
                : "Not Available"}
            </span>
          </div>

          {reason && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VenueCalendarPage = () => {
  const { getVenues, getBookedDatesForVenueForVendor } = useAuthStore();
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [calendarData, setCalendarData] = useState<VenueBookingData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<any>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    date: Date;
    status: string;
    reason?: string;
  }>({
    isOpen: false,
    date: new Date(),
    status: "available",
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await getVenues("all");
        const approvedVenues = (response.venues || []).filter(
          (venue: any) => venue.verificationStatus === "approved"
        );
        setVenues(approvedVenues);
        if (approvedVenues.length > 0) {
          setSelectedVenueId(approvedVenues[0].id);
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

  useEffect(() => {
    const fetchDatesForVenue = async () => {
      if (!selectedVenueId) return;
      setError("");

      try {
        setLoading(true);
        const selectedVenue = venues.find(
          (venue) => venue.id === selectedVenueId
        );

        const venueData: VenueBookingData = {
          venueId: selectedVenueId,
          venueName: selectedVenue?.name || "Unknown Venue",
          dates: [],
        };

        try {
          const unavailableDatesResponse =
            await getBookedDatesForVenueForVendor(selectedVenueId);
          const unavailableDates = unavailableDatesResponse.bookedDates;

          unavailableDates.forEach((block: any) => {
            if (block && block.startDate && block.endDate) {
              const start = new Date(block.startDate);
              const end = new Date(block.endDate);
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

        if (selectedVenueId) {
          const selectedVenue = venues.find(
            (venue) => venue.id === selectedVenueId
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

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const { status } = getDateInfo(date);
    const isToday = new Date().toDateString() === date.toDateString();

    return (
      <div className="flex flex-col items-center">
        {isToday && <div className="text-xs text-blue-500 mb-1">Today</div>}
        <div
          className={`h-1.5 w-1.5 rounded-full mt-1 ${
            status === "available" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>
    );
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";

    const { status } = getDateInfo(date);
    const baseClass =
      "rounded-lg transition-colors duration-200 hover:bg-opacity-10";

    return `${baseClass} ${
      status === "available" ? "hover:bg-green-500" : "hover:bg-red-500"
    }`;
  };

  const handleTileClick = (date: Date) => {
    const { status, reason } = getDateInfo(date);
    setModalData({
      isOpen: true,
      date,
      status,
      reason,
    });
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
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Venue Calendar
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl">
              <p className="font-medium">Note:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Venue
            </label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="w-full md:w-1/2 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
            >
              {venues.length > 0 ? (
                venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
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
            <div className="space-y-8">
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
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
                  calendarType="iso8601"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3">Instructions</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Click on any date to see its status details
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2"></div>
                    To block dates, visit the "Block Dates" page
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Green indicator shows dates available for booking
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2"></div>
                    Red indicator shows dates not available for booking
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <DateDetailsModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        date={modalData.date}
        status={modalData.status}
        reason={modalData.reason}
      />

      {/* using style because tailwind cannot override some default calendar styles */}

      <style>{`
        .calendar-container .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
          padding: 20px;
          background: transparent;
        }

        .calendar-container .react-calendar__tile {
          position: relative;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding-top: 15px;
          font-size: 0.95rem;
          color: #374151;
          border-radius: 12px;
          margin: 2px;
        }

        .calendar-container .react-calendar__month-view__days__day--weekend {
          color: #4B5563;
        }

        .calendar-container .react-calendar__month-view__days__day--neighboringMonth {
          color: #9CA3AF;
        }

        .calendar-container .react-calendar__navigation {
          margin-bottom: 20px;
        }

        .calendar-container .react-calendar__navigation button {
          font-size: 1.1rem;
          color: #1F2937;
          background: none;
          border-radius: 8px;
          min-width: 44px;
          height: 44px;
          margin: 0 2px;
        }

        .calendar-container .react-calendar__navigation button:enabled:hover,
        .calendar-container .react-calendar__navigation button:enabled:focus {
          background-color: #F3F4F6;
        }

        .calendar-container .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.875rem;
          padding: 8px 0;
        }

        .calendar-container .react-calendar__month-view__weekdays__weekday {
          padding: 8px;
          font-size: 0.875rem;
          color: #6B7280;
          text-transform: uppercase;
          font-weight: 500;
          text-align: center;
        }

        .calendar-container .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          cursor: default;
        }

        .calendar-container .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .calendar-container .react-calendar__tile:enabled:hover,
        .calendar-container .react-calendar__tile:enabled:focus {
          background-color: transparent;
        }

        .calendar-container .react-calendar__tile--now {
          background: #EFF6FF;
        }

        .calendar-container .react-calendar__tile--now:enabled:hover,
        .calendar-container .react-calendar__tile--now:enabled:focus {
          background: #EFF6FF;
        }

        .calendar-container .react-calendar__month-view__days__day {
          padding: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default VenueCalendarPage;
