import { Link } from "react-router-dom";

const VendorSidebar = () => {
  const menuItems = [
    { icon: "🏠", text: "Dashboard", path: "/" },
    { icon: "🏢", text: "Venue Management", path: "/venue" },
    { icon: "📅", text: "Bookings Management", path: "/bookings" },
    { icon: "💰", text: "Payments & Earnings", path: "/payments" },
    { icon: "💬", text: "Messages", path: "/messages" },
    { icon: "⚙️", text: "Settings", path: "/settings" },
  ];

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

      <div className="py-4 border-t border-gray-200">
        <Link
          to="/logout"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="mr-3 text-lg">🚪</span>
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default VendorSidebar;
