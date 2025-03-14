import { Link, useLocation } from "react-router-dom";

const VenueNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath.includes(path);

  return (
    <div className="flex space-x-4">
      <Link
        to="/admin/venues"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ${
          isActive("/admin/venues") && !isActive("/pending")
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Approved Venues
      </Link>
      <Link
        to="/admin/venues/pending"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ${
          isActive("/pending")
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        Pending Venues
      </Link>
    </div>
  );
};

export default VenueNavigation;
