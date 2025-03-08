import { useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";

const UserProfileSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = () => {
    // Simple password update functionality
    if (newPassword === confirmPassword) {
      console.log("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      console.log("Passwords do not match");
    }
  };

  const handleLogout = () => {
    console.log("Logged out");
    // Navigation would be handled here
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          {/* Header */}

          {/* Security Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            {/* User Profile Navigation - Dedicated component */}
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            {/* Security Form */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Current Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 flex items-center"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default UserProfileSecurity;
