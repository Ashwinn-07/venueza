import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { AlertCircle, Download } from "lucide-react";

interface Transaction {
  bookingId: string;
  totalPrice: number;
  advanceAmount: number;
  balanceDue: number;
  commission: number;
  bookingDate: string;
}

const AdminTransactionHistory = () => {
  const { getTransactionHistory } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        const response = await getTransactionHistory();
        setTransactions(response.data);
      } catch (err: any) {
        console.error("Error fetching transaction history:", err);
        setError(err.message || "Failed to fetch transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [getTransactionHistory]);

  const exportToCSV = () => {
    const headers = [
      "Booking ID",
      "Total Price (₹)",
      "Advance (₹)",
      "Balance (₹)",
      "Commission (₹)",
      "Date",
    ];

    const csvRows = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          t.bookingId,
          t.totalPrice,
          t.advanceAmount,
          t.balanceDue,
          t.commission.toFixed(2),
          new Date(t.bookingDate).toLocaleDateString(),
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transaction_history.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full" />
          <p className="text-xl">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={24} />
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction History
          </h1>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Booking ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Advance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Commission
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr
                      key={transaction.bookingId}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {transaction.bookingId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{transaction.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{transaction.advanceAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{transaction.balanceDue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ₹{transaction.commission.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.bookingDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              This table shows all confirmed and fully paid bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionHistory;
