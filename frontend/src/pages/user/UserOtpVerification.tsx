import { Shield, Check } from "lucide-react";

const UserOtpVerification = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          className="w-full h-full object-cover"
          src="/api/placeholder/1200/800"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Card container with animation */}
      <div className="w-full max-w-md px-6 py-12">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              <Shield className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Verify Your User Account
            </h2>
            <p className="mt-2 text-gray-600 text-center">
              We've sent a verification code to your email address
            </p>
          </div>

          <form className="space-y-5">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>

              <div className="flex justify-center space-x-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit code"
                  className="px-4 py-3 text-center text-lg tracking-widest w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Check className="w-4 h-4 mr-2" />
                Verify Code
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserOtpVerification;
