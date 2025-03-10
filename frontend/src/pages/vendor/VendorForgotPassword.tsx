import { useState } from "react";
import { ArrowLeft, Building2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const VendorForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await forgotPassword(email, "vendor");
      notifySuccess("Verification code sent to your email");
      setIsSubmitted(true);

      // Navigate after short delay
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
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Wedding vendor background"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Card container with animation */}
      <div className="w-full max-w-md px-6 py-12 animate-fade-in">
        <div className="glass-morphism p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              {isSubmitted ? (
                <Mail className="h-10 w-10 text-green-500" />
              ) : (
                <Building2 className="h-10 w-10 text-brand" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-shadow-sm animate-slide-up">
              {isSubmitted ? "Check Your Email" : "Reset Business Password"}
            </h2>
            <p className="mt-2 text-gray-600 animate-slide-up delay-100">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  placeholder="Enter your email address"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand text-white py-2 px-4 rounded-md shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
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

export default VendorForgotPassword;
