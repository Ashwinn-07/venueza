import { useState } from "react";
import { useForm } from "react-hook-form";
import { Heart } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [userType, setUserType] = useState<"user" | "vendor">("user");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log(data, userType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80"
          alt="Wedding background"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center">
          <Heart className="h-12 w-12 text-[#F4A261]" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-md ${
              userType === "user"
                ? "bg-[#F4A261] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("user")}
          >
            User
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              userType === "vendor"
                ? "bg-[#F4A261] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("vendor")}
          >
            Vendor
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A261] focus:border-[#F4A261]"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A261] focus:border-[#F4A261]"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F4A261] hover:bg-[#E76F51] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A261]"
            >
              Sign in
            </button>
          </div>

          {userType === "user" && (
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-4 h-4"
                />
                Sign in with Google
              </button>
            </div>
          )}
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-medium text-[#F4A261] hover:text-[#E76F51]"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
