import { useEffect, useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import { useAuthStore } from "../../stores/authStore";
import { format } from "date-fns";

const TransactionHistoryPage = () => {
  const { getBookingsByUser } = useAuthStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getBookingsByUser();
      setTransactions(response.bookings || []);
    } catch (err: any) {
      console.error("Error fetching transaction history:", err);
      setError(err.message || "Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [getBookingsByUser]);

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

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
          {/* Navigation consistent with the UserProfile page */}
          <div className="px-6 py-4 border-b border-gray-200">
            <UserProfileNavigation />
          </div>
          {/* Main Content */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No transactions found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Venue
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Total Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Payment Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTransactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tx._id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tx.venue?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              {format(new Date(tx.startDate), "MMM dd, yyyy")}
                            </div>
                            <div className="text-gray-500">
                              to {format(new Date(tx.endDate), "MMM dd, yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{tx.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {tx.status
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
                {/* Pagination Controls */}
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
