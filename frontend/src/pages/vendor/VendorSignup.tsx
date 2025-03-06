import { Building2, ArrowLeft } from "lucide-react";

const VendorSignup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with different wedding vendor image */}
      <div className="absolute inset-0 -z-10">
        <img
          className="w-full h-full object-cover"
          src="/api/placeholder/1200/800"
          alt="Wedding vendor background"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Card container with animation */}
      <div className="w-full max-w-md px-6 py-12">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Vendor Registration
            </h2>
            <p className="mt-2 text-gray-600">Create your business account</p>
          </div>

          <form className="space-y-5">
            {/* Contact Person Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jane Smith"
              />
            </div>

            {/* Business Name Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Elegant Events LLC"
              />
            </div>

            {/* Business Address Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Wedding Lane, Suite 101"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="business@example.com"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-2">
              {/* Create Vendor Account Button */}
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Vendor Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
              >
                Sign in
              </a>
            </p>

            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
              </a>
            </div>

            <div className="mt-2">
              <a
                href="#"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Sign up as a user instead
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
