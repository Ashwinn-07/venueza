import { useEffect, useState } from "react";
import ProfileTabs from "../../components/vendor/ProfileTabs";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { isValidPhone } from "../../utils/validators";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

const VendorProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessAddress: "",
    phone: "",
    profileImage: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/vendor/login");
      return;
    }
    if (user) {
      setFormData({
        name: user.name || "",
        businessName: user.businessName || "",
        businessAddress: user.businessAddress || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
      });
      setImagePreview(user.profileImage || "");
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
        setImagePreview(imageUrl);
        notifySuccess("Profile image uploaded successfully!");
      } catch (error: any) {
        console.error("Image upload failed", error);
        notifyError("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      notifyError("Name cannot be empty");
      return;
    }
    if (!formData.businessName.trim()) {
      notifyError("Business name cannot be empty");
      return;
    }
    if (!formData.businessAddress.trim()) {
      notifyError("Business address cannot be empty");
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

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Vendor Profile Settings
        </h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 pt-6">
            <ProfileTabs />
          </div>

          <div className="p-6">
            <div className="max-w-lg space-y-6">
              <div>
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

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
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] transition duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] transition duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="businessAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Address
                </label>
                <input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Enter your business address"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] transition duration-200"
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
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] transition duration-200"
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
  );
};

export default VendorProfile;
