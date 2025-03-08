import { Link, useLocation } from "react-router-dom";

const VendorNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="mb-6 border-b">
      <div className="flex space-x-4">
        <Link
          to="/admin/vendors"
          className={`px-4 py-2 font-medium text-sm ${
            currentPath === "/admin/vendors"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Vendors
        </Link>
        <Link
          to="/admin/vendors/pending"
          className={`px-4 py-2 font-medium text-sm ${
            currentPath.includes("/pending")
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending Requests
        </Link>
      </div>
    </div>
  );
};

export default VendorNavigation;
