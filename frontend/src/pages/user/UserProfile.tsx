import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { isValidPhone } from "../../utils/validators";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      notifyError("Name cannot be empty");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      notifyError("Invalid phone number format");
      return;
    }
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

  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/user/login");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Failed to logout. Please try again.";
      notifyError(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-200 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`px-6 py-2.5 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md transition duration-200 font-medium cursor-pointer ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
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

export default UserProfile;
