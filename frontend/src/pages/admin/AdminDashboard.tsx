import { useEffect, useState } from "react";
import AdminRevenueChart from "../../components/admin/AdminRevenueChart";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { useAuthStore } from "../../stores/authStore";
import { notifyError } from "../../utils/notifications";

const AdminDashboard = () => {
  const { getDashboardStats } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalBookings: 0,
    revenueData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          totalUsers: data.totalUsers,
          totalVendors: data.totalVendors,
          totalBookings: data.totalBookings,
          revenueData: data.revenueData,
        });
      } catch (error) {
        notifyError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [getDashboardStats]);
  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: "users" },
    { title: "Total Vendors", value: stats.totalVendors, icon: "vendors" },
    { title: "Total Bookings", value: stats.totalBookings, icon: "bookings" },
  ];

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <AdminStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AdminRevenueChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
