import { Shield, Check } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";

const VendorOtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp, resendOtp } = useAuthStore();

  const handleVerifyOtp = async () => {
    if (otp.length != 6) {
      notifyError("Please enter a valid 6 digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(email, otp, "vendor");
      notifySuccess("OTP Verified Successfully");
      navigate("/vendor/login");
    } catch (err: any) {
      console.error("error verifying OTP", err);
      const errMsg =
        err.response?.data?.message ||
        "OTP Verification failed! Please try again";
      notifyError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    try {
      await resendOtp(email, "vendor");
      notifySuccess("New verification code sent");
    } catch (err: any) {
      notifyError(err.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-md px-6 py-12">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              <Shield className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Verify Your Vendor Account
            </h2>
            <p className="mt-2 text-gray-600 text-center">
              We've sent a verification code to your email address
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>

              <div className="flex justify-center space-x-3">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  className="px-4 py-3 text-center text-lg tracking-widest w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleVerifyOtp}
                className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" />
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
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

export default VendorOtpVerification;
