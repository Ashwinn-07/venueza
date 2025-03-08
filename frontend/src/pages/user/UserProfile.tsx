import { useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    // Simple save functionality without toast
    console.log("Profile saved:", { name, phone });
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

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            {/* User Profile Navigation - Dedicated component */}
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            {/* Profile Form */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
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
                    onClick={handleSave}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md"
                  >
                    Save
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

export default UserProfile;
