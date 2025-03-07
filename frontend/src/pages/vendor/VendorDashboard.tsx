import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorStatCard from "../../components/vendor/VendorStatCard";
import VendorBookingsHeatmap from "../../components/vendor/VendorBookingsHeatMap";
import VendorRevenueChart from "../../components/vendor/VendorRevenueChart";
const VendorDashboard = () => {
  // Stats data
  const stats = [
    {
      icon: { content: "👥", bg: "bg-blue-500 text-white" },
      title: "Total Customers",
      value: "28",
      change: "22",
      isPositive: true,
    },
    {
      icon: { content: "📧", bg: "bg-blue-500 text-white" },
      title: "Total Bookings",
      value: "37",
      change: "5.4%",
      isPositive: true,
    },
    {
      icon: { content: "💎", bg: "bg-blue-500 text-white" },
      title: "Total Revenue",
      value: "8,00,000",
      change: "3.2%",
      isPositive: false,
    },
  ];

  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <VendorStatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
            />
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <VendorRevenueChart />
          </div>
          <div className="col-span-2">
            <VendorBookingsHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
