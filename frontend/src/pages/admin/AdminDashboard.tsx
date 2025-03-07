import AdminRevenueChart from "../../components/admin/AdminRevenueChart";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminStatCard from "../../components/admin/AdminStatCard";

const AdminDashboard = () => {
  // Stats data
  const stats = [
    {
      title: "Total Users",
      value: "1234",
      icon: {
        content: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
        bg: "bg-blue-500",
      },
    },
    {
      title: "Total Vendors",
      value: "56",
      icon: {
        content: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"
            />
          </svg>
        ),
        bg: "bg-indigo-500",
      },
    },
    {
      title: "Total Bookings",
      value: "89",
      icon: {
        content: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
        bg: "bg-orange-500",
      },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
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
