import { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import ProfileTabs from "../../components/vendor/ProfileTabs";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notifications";

const VendorProfileSecurity = () => {
  const navigate = useNavigate();
  const { changePassword, isAuthenticated, authType } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || authType !== "vendor") {
      navigate("/vendor/login");
    }
  }, [isAuthenticated, authType, navigate]);

  const handleUpdatePassword = async () => {
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      notifySuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to update password. Please try again.";
      notifyError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <VendorSidebar />

      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Security Settings
        </h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Navigation Tabs */}
          <div className="px-6 pt-6">
            <ProfileTabs />
          </div>

          {/* Security Form */}
          <div className="p-6">
            <div className="max-w-lg">
              <div className="space-y-6">
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileSecurity;
