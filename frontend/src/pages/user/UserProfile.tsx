import { useEffect, useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { isValidPhone } from "../../utils/validators";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: "",
  });
  const [originalFormData, setOriginalFormData] = useState({
    name: "",
    phone: "",
    profileImage: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login");
      return;
    }
    if (user) {
      const userData = {
        name: user.name || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
      };
      setFormData(userData);
      setOriginalFormData(userData);
      setImagePreview(user.profileImage || "");
      setHasUnsavedChanges(false);
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    const hasChanges =
      formData.name !== originalFormData.name ||
      formData.phone !== originalFormData.phone ||
      formData.profileImage !== originalFormData.profileImage;

    setHasUnsavedChanges(hasChanges);
  }, [formData, originalFormData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

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

  const handleSave = async () => {
    if (!hasUnsavedChanges) {
      notifyError("No changes to save");
      return;
    }
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
      setOriginalFormData(formData);
      setHasUnsavedChanges(false);
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
  const handleLogoutConfirm = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to Logout from this account?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleLogout(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const handleSaveConfirm = () => {
    if (!hasUnsavedChanges) {
      notifyError("No changes to save");
      return;
    }
    confirmAlert({
      title: "Confirm Updates",
      message: "Are you sure you want to update your details?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleSave(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const handleDiscardChanges = () => {
    confirmAlert({
      title: "Discard Changes",
      message: "Are you sure you want to discard all unsaved changes?",
      buttons: [
        {
          label: "Discard",
          onClick: () => {
            setFormData(originalFormData);
            setImagePreview(originalFormData.profileImage);
            setHasUnsavedChanges(false);
            notifySuccess("Changes discarded");
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            <div className="p-6">
              {hasUnsavedChanges && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-amber-800 font-medium">
                        You have unsaved changes
                      </span>
                    </div>
                    <button
                      onClick={handleDiscardChanges}
                      className="text-amber-700 hover:text-amber-900 text-sm font-medium underline"
                    >
                      Discard Changes
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-6">
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
                    onClick={handleLogoutConfirm}
                    className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition duration-200 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleSaveConfirm}
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
    </div>
  );
};

export default UserProfile;
