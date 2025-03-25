import { useState, useEffect } from "react";
import { Users, ShoppingBag, Calendar, Activity } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuthStore } from "../../stores/authStore";
import { notifyError } from "../../utils/notifications";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
}

const AdminDashboard = () => {
  const { getDashboardStats } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          totalUsers: data.totalUsers,
          totalVendors: data.totalVendors,
          totalBookings: data.totalBookings,
        });
        setError(null);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        notifyError("Failed to load dashboard data");
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getDashboardStats]);

  const pieChartData = {
    labels: ["Users", "Vendors", "Bookings"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalVendors, stats.totalBookings],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Platform Overview",
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
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      subtitle: "Registered platform users",
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: ShoppingBag,
      color: "green",
      subtitle: "Active service providers",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "purple",
      subtitle: "All-time bookings",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Last updated:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Platform Composition
            </h2>
            <div className="h-[350px]">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Insights
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  User to Vendor Ratio
                </h3>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalUsers > 0
                    ? (stats.totalUsers / stats.totalVendors).toFixed(2)
                    : "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Bookings per Vendor
                </h3>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalVendors > 0
                    ? (stats.totalBookings / stats.totalVendors).toFixed(2)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
          <div className="flex items-start space-x-3">
            <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Dashboard Overview
              </h3>
              <p className="text-sm text-blue-800">
                View key metrics of your platform. The dashboard provides a
                snapshot of total users, vendors, and bookings to help you
                understand platform growth and activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
