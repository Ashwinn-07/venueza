import { useState } from "react";
import { ArrowLeft, KeyRound, Check } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { isValidPassword } from "../../utils/validators";

const VendorResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuthStore();
  const email = location.state?.email || "";

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input if exists
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `vendor-otp-${index + 1}`
      ) as HTMLInputElement | null;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace: if current field is empty, focus previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `vendor-otp-${index - 1}`
      ) as HTMLInputElement | null;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ otp: "", password: "", confirmPassword: "" });

    const joinedOtp = otp.join("");

    if (joinedOtp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be exactly 6 digits." }));
      notifyError("OTP must be exactly 6 digits.");
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "New password is required." }));
      notifyError("New password is required.");
      return;
    }
    if (!isValidPassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      }));
      notifyError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      notifyError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const resetData = {
        email,
        otp: joinedOtp,
        password,
        confirmPassword,
      };

      await resetPassword(resetData, "vendor");
      notifySuccess("Password reset successfully!");
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/vendor/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Password reset failed";

      if (errorMessage.toLowerCase().includes("otp")) {
        setErrors((prev) => ({ ...prev, otp: errorMessage }));
      } else {
        notifyError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Wedding vendor background"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-md px-6 py-12 animate-fade-in">
        <div className="glass-morphism p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              {isSubmitted ? (
                <Check className="h-10 w-10 text-green-500" />
              ) : (
                <KeyRound className="h-10 w-10 text-brand" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-shadow-sm animate-slide-up">
              {isSubmitted
                ? "Password Reset Complete"
                : "Set New Business Password"}
            </h2>
            <p className="mt-2 text-gray-600 animate-slide-up delay-100">
              {isSubmitted
                ? "Your business account password has been reset successfully"
                : "Enter the verification code and create a new password"}
            </p>
          </div>

          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="flex justify-between mb-1">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`vendor-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-sm text-red-600">{errors.otp}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  We've sent a 6-digit code to {email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand text-white py-2 px-4 rounded-md shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Your business account password has been reset successfully. You
                will be redirected to the login page.
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <div className="mt-4">
              <Link
                to="/vendor/login"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorResetPassword;
