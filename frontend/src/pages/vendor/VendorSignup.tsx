import { useState } from "react";
import { Building2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "../../utils/validators";
import { useAnimation } from "../../utils/animation";

const VendorSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessAddress: "",
    email: "",
    phone: "",
    password: "",
  });

  const [animationParent] = useAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, businessName, businessAddress, email, phone, password } =
      formData;
    if (
      !name ||
      !businessName ||
      !businessAddress ||
      !email ||
      !phone ||
      !password
    ) {
      const msg = "All fields are required.";
      setError(msg);
      notifyError(msg);
      return;
    }
    if (!isValidEmail(email)) {
      const msg = "Invalid email format.";
      setError(msg);
      notifyError(msg);
      return;
    }
    if (!isValidPhone(phone)) {
      const msg = "Invalid phone number format.";
      setError(msg);
      notifyError(msg);
      return;
    }
    if (!isValidPassword(password)) {
      const msg =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      setError(msg);
      notifyError(msg);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signup(formData, "vendor");
      notifySuccess("Signup successful. Please verify your email.");
      navigate("/vendor/verify-otp", {
        state: { email: formData.email, authType: "vendor" },
      });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to sign up. Please try again.";
      setError(errMsg);
      notifyError(errMsg);
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
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/80 p-3 rounded-full shadow-lg mb-4">
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Vendor Registration
            </h2>
            <p className="mt-2 text-gray-600">Create your business account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your business name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your business address"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Vendor Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/vendor/login"
                className="font-medium text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-4">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
              </Link>
            </div>

            <div className="mt-2">
              <Link
                to="/user/signup"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Sign up as a user instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
