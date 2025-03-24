import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VendorRevenuePage = () => {
  const { getVendorRevenue } = useAuthStore();
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    { month: number; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await getVendorRevenue();

        setMonthlyRevenueData(response.revenue);
      } catch (err: any) {
        console.error("Error fetching vendor revenue data:", err);
        setError(err.message || "Failed to fetch vendor revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [getVendorRevenue]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const sortedData = [...monthlyRevenueData].sort((a, b) => a.month - b.month);

  const chartLabels = sortedData.map((item) => monthNames[item.month - 1]);
  const chartDataValues = sortedData.map((item) => item.revenue);

  const overallRevenue = sortedData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: chartDataValues,
        borderColor: "#2A9D8F",
        backgroundColor: "rgba(42, 157, 143, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Revenue Trend (Monthly)" },
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <p className="text-xl text-gray-600">Loading revenue data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Vendor Revenue Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
          <div className="text-4xl font-bold text-blue-600">
            ₹{overallRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Total Revenue Received
          </div>
          <div className="mt-1 text-xs text-gray-400">(After platform fee)</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          Note: The revenue figure represents the total amount you have received
          after the platform fee has been deducted.
        </p>
      </div>
    </div>
  );
};

export default VendorRevenuePage;
