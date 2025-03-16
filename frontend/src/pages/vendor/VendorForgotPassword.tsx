import { useState } from "react";
import { ArrowLeft, Building2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { isValidEmail } from "../../utils/validators";
import { useAnimation } from "../../utils/animation";

const VendorForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { forgotPassword } = useAuthStore();

  const [animationParent] = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      const msg = "Email is required";
      setEmailError(msg);
      notifyError(msg);
      return;
    }
    if (!isValidEmail(email)) {
      const msg = "Invalid email format";
      setEmailError(msg);
      notifyError(msg);
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email, "vendor");
      notifySuccess("Verification code sent to your email");
      setIsSubmitted(true);
      setEmailError("");

      setTimeout(() => {
        navigate("/vendor/reset-password", { state: { email } });
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to send verification code";
      notifyError(errorMessage);
      setEmailError(errorMessage);
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

      <div className="w-full max-w-md px-6 py-12">
        <div
          ref={animationParent}
          className="bg-white/90 p-8 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              {isSubmitted ? (
                <Mail className="h-10 w-10 text-green-500" />
              ) : (
                <Building2 className="h-10 w-10 text-blue-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isSubmitted ? "Check Your Email" : "Reset Business Password"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSubmitted
                ? "We've sent a verification code to your business email"
                : "Enter your business email to receive a verification code"}
            </p>
          </div>

          {!isSubmitted ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={isLoading}
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
                      Sending...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                If we found a business account associated with that email, we've
                sent you a verification code.
              </p>
              <p className="text-sm text-gray-600">
                You'll be redirected to the reset password page...
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <div className="mt-4">
              <Link
                to="/vendor/login"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
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

export default VendorForgotPassword;
