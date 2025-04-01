import { Link, useLocation } from "react-router-dom";

const UserProfileNavigation = () => {
  const location = useLocation();
  const basePath = "/user";

  const navItems = [
    { name: "Profile", path: `${basePath}/profile` },
    { name: "Security", path: `${basePath}/security` },
    { name: "Bookings", path: `${basePath}/bookings` },
    { name: "Transactions", path: `${basePath}/transactions` },
    { name: "Chats", path: `${basePath}/conversations` },
  ];

  return (
    <div className="w-full mb-8">
      <div className="border-b border-gray-200">
        <nav
          className="flex space-x-8 overflow-x-auto"
          aria-label="User Profile Navigation"
        >
          {navItems.map((item) => {
            const isActive =
              (item.path === basePath && location.pathname === basePath) ||
              (item.path !== basePath &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default UserProfileNavigation;
