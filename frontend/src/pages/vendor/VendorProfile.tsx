import { useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import ProfileTabs from "../../components/vendor/ProfileTabs";

const VendorProfile = () => {
  const [name, setName] = useState("Jane Smith");
  const [businessName, setBusinessName] = useState("Elegant Events LLC");
  const [phone, setPhone] = useState("(123) 456-7890");
  const [businessAddress, setBusinessAddress] = useState(
    "123 Wedding Lane, Suite 101"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Profile updated successfully");
    }, 1000);
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
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter contact name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Enter business address"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
