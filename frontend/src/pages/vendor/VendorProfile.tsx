import { useEffect, useState, useRef } from "react";
import ProfileTabs from "../../components/vendor/ProfileTabs";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { isValidPhone } from "../../utils/validators";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const VendorProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, uploadDocuments, isAuthenticated } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessAddress: "",
    phone: "",
    profileImage: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const [selectedDocuments, setSelectedDocuments] = useState<FileList | null>(
    null
  );
  const documentInputRef = useRef<HTMLInputElement>(null);

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

  const handleDocumentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedDocuments(e.target.files);
    }
  };

  const handleUploadDocuments = async () => {
    if (!selectedDocuments || selectedDocuments.length === 0) {
      notifyError("Please select document(s) to upload");
      return;
    }
    setIsLoading(true);
    try {
      const filesArray = Array.from(selectedDocuments);
      const urls = await Promise.all(
        filesArray.map((file) => uploadImageToCloudinary(file))
      );
      await uploadDocuments(urls);
      notifySuccess("Verification documents uploaded successfully");
    } catch (error: any) {
      console.error("error uploading documents", error);
      notifyError("Failed to upload documents. Please try again");
    } finally {
      setIsLoading(false);
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

  const renderVerificationSection = () => {
    if (user?.status === "active") {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
          <h3 className="font-medium text-green-800 mb-2">Verified Vendor</h3>
          <p className="text-sm text-green-600 text-center">
            Your account has been verified and is active. You can now access all
            vendor features.
          </p>
        </div>
      );
    }

    if (user?.status === "blocked") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
            <div className="flex items-center mb-2">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-medium text-red-800">
                Verification Rejected
              </h3>
            </div>
            <p className="text-sm text-red-600">
              Your verification was not approved. Please upload new documents to
              try again.
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-800 mb-3">
              Upload New Documents
            </h3>
            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center mb-4 bg-white">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600 mt-2">
                <label
                  htmlFor="document-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Click to upload</span>
                  <input
                    id="document-upload"
                    name="document-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleDocumentChange}
                    ref={documentInputRef}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Up to 10MB</p>
            </div>

            <button
              onClick={handleUploadDocuments}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Upload Documents
            </button>
          </div>
        </div>
      );
    }

    if (user?.status === "pending") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-yellow-800">
                Verification Pending
              </h3>
            </div>
            <p className="text-sm text-yellow-600">
              Your documents are being reviewed. We'll notify you once the
              verification is complete.
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-800 mb-3">
              Verification Documents
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload documents for account verification. Images and PDFs
              supported.
            </p>

            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center mb-4 bg-white">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600 mt-2">
                <label
                  htmlFor="document-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Click to upload</span>
                  <input
                    id="document-upload"
                    name="document-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleDocumentChange}
                    ref={documentInputRef}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Up to 10MB</p>
            </div>

            <button
              onClick={handleUploadDocuments}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Upload Documents
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-medium text-gray-800 mb-3">
          Verification Documents
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload documents for account verification. Images and PDFs supported.
        </p>

        <div className="border border-dashed border-gray-300 rounded-md p-4 text-center mb-4 bg-white">
          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600 mt-2">
            <label
              htmlFor="document-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
            >
              <span>Click to upload</span>
              <input
                id="document-upload"
                name="document-upload"
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleDocumentChange}
                ref={documentInputRef}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Up to 10MB</p>
        </div>

        <button
          onClick={handleUploadDocuments}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        >
          Upload Documents
        </button>
      </div>
    );
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
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
              </div>

              <div className="lg:col-span-1">{renderVerificationSection()}</div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
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
  );
};

export default VendorProfile;
