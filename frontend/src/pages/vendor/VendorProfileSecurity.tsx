import { useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import ProfileTabs from "../../components/vendor/ProfileTabs";

const VendorProfileSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = () => {
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1000);
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
                      className={`w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.currentPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.currentPassword}
                    </p>
                  )}
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
                      className={`w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
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
                      className={`w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
