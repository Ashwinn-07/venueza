import { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import ProfileTabs from "../../components/vendor/ProfileTabs";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

const VendorProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isAuthenticated, authType } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    businessAddress: "",
  });

  useEffect(() => {
    if (!isAuthenticated || authType !== "vendor") {
      navigate("/vendor/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        phone: user.phone || "",
        businessAddress: user.businessAddress || "",
      });
    }
  }, [user, isAuthenticated, authType, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      notifySuccess("Profile updated successfully!");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";
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
          Profile Settings
        </h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Navigation Tabs */}
          <div className="px-6 pt-6">
            <ProfileTabs />
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <div className="max-w-lg">
              <div className="space-y-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input
                    name="businessAddress"
                    type="text"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
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

export default VendorProfile;
