import { useState, useEffect } from "react";
import { Calendar, IndianRupee, BarChart, Activity, Clock } from "lucide-react";
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

interface DashboardData {
  totalBookings: number;
  vendorRevenue: number;
  upcomingBookings: number;
  monthlyRevenue: { month: number; revenue: number }[];
}

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBookings: 0,
    vendorRevenue: 0,
    upcomingBookings: 0,
    monthlyRevenue: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const { getVendorDashboard } = useAuthStore();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const calculateAverageRevenue = (
    monthlyRevenue: { month: number; revenue: number }[]
  ) => {
    if (!monthlyRevenue || monthlyRevenue.length === 0) return 0;
    return (
      monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) /
      monthlyRevenue.length
    );
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await getVendorDashboard();

        const validatedData: DashboardData = response.dashboardData
          ? {
              totalBookings: response.dashboardData.totalBookings ?? 0,
              vendorRevenue: response.dashboardData.vendorRevenue ?? 0,
              upcomingBookings: response.dashboardData.upcomingBookings ?? 0,
              monthlyRevenue: Array.isArray(
                response.dashboardData.monthlyRevenue
              )
                ? response.dashboardData.monthlyRevenue
                : [],
            }
          : {
              totalBookings: 0,
              vendorRevenue: 0,
              upcomingBookings: 0,
              monthlyRevenue: [],
            };

        setDashboardData(validatedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to load dashboard. Please try again later.");
        setDashboardData({
          totalBookings: 0,
          vendorRevenue: 0,
          upcomingBookings: 0,
          monthlyRevenue: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getVendorDashboard]);

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
    dashboardData.monthlyRevenue.map((item) => [item.month, item.revenue])
  );

  const fullYearData = monthNames.map((_, index) => ({
    month: index + 1,
    revenue: revenueByMonth.get(index + 1) || 0,
  }));

  const chartLabels = fullYearData.map((item) => monthNames[item.month - 1]);
  const chartDataValues = fullYearData.map((item) => item.revenue);

  const gradientColors = {
    start: "rgba(59, 130, 246, 0.15)",
    end: "rgba(59, 130, 246, 0.02)",
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: chartDataValues,
        borderColor: "#3B82F6",
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
          value > 0 ? "#3B82F6" : "#E9ECEF"
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

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span className="text-gray-600 font-medium">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.vendorRevenue),
      icon: IndianRupee,
      color: "blue",
      subtitle: "After platform fees",
    },
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: Calendar,
      color: "green",
      subtitle: "All-time bookings",
    },
    {
      title: "Upcoming Bookings",
      value: dashboardData.upcomingBookings,
      icon: Clock,
      color: "purple",
      subtitle: "Scheduled ahead",
    },
    {
      title: "Avg Monthly Revenue",
      value: formatCurrency(
        calculateAverageRevenue(dashboardData.monthlyRevenue)
      ),
      icon: BarChart,
      color: "indigo",
      subtitle: "Monthly average earnings",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Last updated:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${card.color}-50`}>
                    <card.icon className={`w-6 h-6 text-${card.color}-500`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Revenue Trend
            </h2>
            <div className="h-[400px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Dashboard Overview
              </h3>
              <p className="text-sm text-blue-800">
                Track your business performance with real-time metrics. Revenue
                figures shown are your earnings after platform fees. Monitor
                your booking trends and upcoming schedules to optimize your
                services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
