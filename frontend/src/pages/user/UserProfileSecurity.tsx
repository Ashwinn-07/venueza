import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserProfileSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = () => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Security Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            {/* Security Form */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full p-2.5 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-2.5 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full p-2.5 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-200 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    className="px-6 py-2.5 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md transition duration-200 font-medium cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileSecurity;
