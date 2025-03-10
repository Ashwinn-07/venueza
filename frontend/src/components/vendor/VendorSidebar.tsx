import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";

const VendorSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const menuItems = [
    { icon: "🏠", text: "Dashboard", path: "/vendor/dashboard" },
    { icon: "🏢", text: "Venue Management", path: "/venue" },
    { icon: "📅", text: "Bookings Management", path: "/bookings" },
    { icon: "💰", text: "Payments & Earnings", path: "/payments" },
    { icon: "💬", text: "Messages", path: "/messages" },
    { icon: "⚙️", text: "Settings", path: "/vendor/settings/profile" },
  ];
  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/vendor/login");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Failed to logout. Please try again.";
      notifyError(errMsg);
    }
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-md mr-3">
            V
          </div>
          <h1 className="text-xl font-semibold">Venueza</h1>
        </div>
      </div>

      <div className="flex-1 py-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-sm">{item.text}</span>
          </Link>
        ))}
      </div>

      <div className="py-4 border-t border-gray-200 flex items-center px-6  text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
        <span className="mr-3 text-lg">🚪</span>
        <span onClick={handleLogout} className="text-sm">
          Logout
        </span>
      </div>
    </div>
  );
};

export default VendorSidebar;
