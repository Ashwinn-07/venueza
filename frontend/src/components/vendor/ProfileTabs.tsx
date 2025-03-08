import { Link, useLocation } from "react-router-dom";

const ProfileTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { path: "/vendor/settings/profile", label: "Profile" },
    { path: "/vendor/settings/security", label: "Security" },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`px-6 py-3 font-medium text-sm ${
            currentPath === tab.path
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default ProfileTabs;
