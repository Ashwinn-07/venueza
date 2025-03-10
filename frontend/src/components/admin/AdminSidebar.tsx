import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const menuItems = [
    { icon: "🏠", text: "Dashboard", path: "/admin/dashboard" },
    { icon: "👥", text: "Users", path: "/admin/users" },
    { icon: "🚚", text: "Vendors", path: "/admin/vendors" },
    { icon: "📅", text: "Bookings", path: "/bookings" },
  ];
  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/admin/login");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Failed to logout. Please try again.";
      notifyError(errMsg);
    }
  };

  return (
    <div className="w-72 bg-gray-900 h-screen flex flex-col text-white">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold">Admin</h1>
        </div>
      </div>

      <div className="flex-1 py-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-6 py-3 hover:bg-gray-800 transition-colors ${
              item.text === "Dashboard" ? "bg-gray-800" : ""
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-base font-medium">{item.text}</span>
          </Link>
        ))}
      </div>

      <div className="py-4 mt-auto flex items-center px-6 hover:bg-gray-800 transition-colors cursor-pointer">
        <span className="mr-3 text-lg">↩️</span>
        <span onClick={handleLogout} className="text-base font-medium">
          Logout
        </span>
      </div>
    </div>
  );
};

export default AdminSidebar;
