import { useState } from "react";
import UserProfileNavigation from "../../components/user/UserProfileNavigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    console.log("Profile saved:", { name, phone });
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6">
              <UserProfileNavigation />
            </div>

            {/* Profile Form */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] outline-none transition duration-200"
                  />
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
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md transition duration-200 font-medium cursor-pointer"
                  >
                    Save Changes
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
