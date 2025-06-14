import { useEffect, useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";
import { Download } from "lucide-react";

const TransactionHistoryPage = () => {
  const { getBookingsByUser } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookingsByUser("all");
      setBookings(response.bookings || []);
    } catch (err: any) {
      console.error("Error fetching transaction history:", err);
      setError(err.message || "Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [getBookingsByUser]);

  const exportToCSV = () => {
    const headers = [
      "Booking ID",
      "Venue",
      "Start Date",
      "End Date",
      "Advance (₹)",
      "Balance (₹)",
      "Refund (₹)",
      "Status",
      "Total Price (₹)",
    ];

    const csvRows = [
      headers.join(","),
      ...bookings.map((booking) =>
        [
          booking.id,
          booking.venue?.name || "N/A",
          format(new Date(booking.startDate), "MMM dd, yyyy"),
          format(new Date(booking.endDate), "MMM dd, yyyy"),
          booking.advancePaid ? booking.advanceAmount : "-",
          booking.status === "fully_paid"
            ? booking.totalPrice - booking.advanceAmount
            : "-",
          booking.status === "cancelled_by_vendor"
            ? booking.advanceAmount
            : "-",
          booking.status
            .split("_")
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" "),
          booking.totalPrice || "-",
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "user_transaction_history.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 mt-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <UserProfileNavigation />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Transaction History</h1>
              {bookings.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No transactions found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Venue
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Advance (₹)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Balance (₹)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Refund (₹)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {booking.id.substring(0, 8)}...
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {booking.venue?.name || "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>
                              {format(
                                new Date(booking.startDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                            <div className="text-gray-500">
                              to{" "}
                              {format(
                                new Date(booking.endDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            {booking.advancePaid ? booking.advanceAmount : "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            {booking.status === "fully_paid" &&
                              booking.totalPrice - booking.advanceAmount}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            {booking.status === "cancelled_by_vendor"
                              ? booking.advanceAmount
                              : "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {booking.status
                              .split("_")
                              .map(
                                (s: string) =>
                                  s.charAt(0).toUpperCase() + s.slice(1)
                              )
                              .join(" ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 cursor-pointer">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
