import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Line } from "react-chartjs-2";
import { IndianRupee, TrendingUp, AlertCircle } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminRevenuePage = () => {
  const { getAdminRevenue } = useAuthStore();
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    { month: number; revenue: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await getAdminRevenue();
        setMonthlyRevenueData(response.revenue || []);
      } catch (err: any) {
        console.error("Error fetching admin revenue data:", err);
        setError(err.message || "Failed to fetch revenue data");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, [getAdminRevenue]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const revenueByMonth = new Map(
    monthlyRevenueData.map((item) => [item.month, item.revenue])
  );

  const fullYearData = monthNames.map((_, index) => ({
    month: index + 1,
    revenue: revenueByMonth.get(index + 1) || 0,
  }));

  const chartLabels = fullYearData.map((item) => monthNames[item.month - 1]);
  const chartDataValues = fullYearData.map((item) => item.revenue);
  const overallRevenue = fullYearData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const maxRevenue = Math.max(...chartDataValues);
  const averageRevenue = overallRevenue / 12;

  const gradientColors = {
    start: "rgba(42, 157, 143, 0.15)",
    end: "rgba(42, 157, 143, 0.02)",
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: chartDataValues,
        borderColor: "#2A9D8F",
        borderWidth: 2,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, gradientColors.start);
          gradient.addColorStop(1, gradientColors.end);
          return gradient;
        },
        tension: 0.4,
        pointRadius: (context: any) => {
          const index = context.dataIndex;
          return hoveredMonth === index
            ? 8
            : chartDataValues[index] > 0
            ? 6
            : 4;
        },
        pointHoverRadius: 10,
        pointBackgroundColor: chartDataValues.map((value) =>
          value > 0 ? "#2A9D8F" : "#E9ECEF"
        ),
        pointBorderColor: chartDataValues.map((value) =>
          value > 0 ? "#FFFFFF" : "#E9ECEF"
        ),
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    onHover: (_: any, elements: any[]) => {
      setHoveredMonth(elements.length > 0 ? elements[0].index : null);
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: (value: any) => `₹${value.toLocaleString()}`,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Revenue (₹)",
          font: {
            size: 14,
            weight: "bold" as const,
          },
          padding: { bottom: 10 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Platform Fee Trend",
        font: {
          size: 20,
          weight: "bold" as const,
        },
        padding: { bottom: 30 },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1F2937",
        bodyColor: "#1F2937",
        bodyFont: {
          size: 14,
        },
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context: any) =>
            `Revenue: ₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full" />
          <p className="text-xl">Loading revenue data...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Revenue Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                Total Revenue
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              ₹{overallRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Platform fee collected</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Highest Revenue
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              ₹{maxRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Best performing month</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                Average Revenue
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              ₹{Math.round(averageRevenue).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Monthly average</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              The revenue displayed represents the total platform fee collected
              by the admin from all bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenuePage;
