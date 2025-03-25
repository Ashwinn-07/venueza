import { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  IndianRupee,
  BarChart,
  Activity,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

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

  const { getVendorDashboard } = useAuthStore();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
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

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 animate-pulse">
          <Activity className="w-6 h-6 text-blue-500" />
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

  const { totalBookings, vendorRevenue, upcomingBookings, monthlyRevenue } =
    dashboardData;

  const statCards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(vendorRevenue),
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Upcoming Bookings",
      value: upcomingBookings,
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Avg Monthly Revenue",
      value: formatCurrency(calculateAverageRevenue(monthlyRevenue)),
      icon: BarChart,
      color: "red",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Vendor Dashboard
          </h1>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Last updated:</span>
            <span className="font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`bg-${card.color}-100 text-${card.color}-600 p-3 rounded-lg`}
                  >
                    <card.icon size={24} />
                  </div>
                  <span
                    className={`text-${card.color}-600 text-sm font-medium`}
                  ></span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>
              </div>
              <div className={`h-1 bg-${card.color}-500`} />
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Monthly Revenue Trend
            </h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                This Year
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                Last Year
              </button>
            </div>
          </div>

          {monthlyRevenue && monthlyRevenue.length > 0 ? (
            <div className="flex items-end h-64 space-x-2">
              {monthlyRevenue.map((month, index) => {
                const height = `${
                  (month.revenue /
                    Math.max(...monthlyRevenue.map((m) => m.revenue))) *
                  100
                }%`;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 group"
                    title={`Month ${month.month}: ${formatCurrency(
                      month.revenue
                    )}`}
                  >
                    <div className="relative w-full">
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500"
                        style={{ height }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(month.revenue)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-500 mt-2">
                      {
                        [
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
                        ][month.month - 1]
                      }
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-center">
                No monthly revenue data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
