import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoutes";
import VendorSignup from "./pages/vendor/VendorSignup";
import VendorOtpVerification from "./pages/vendor/VendorOtpVerification";
import UserSignup from "./pages/user/UserSignup";
import UserOtpVerification from "./pages/user/UserOtpVerification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VendorLogin from "./pages/vendor/VendorLogin";
import UserLogin from "./pages/user/UserLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import UserHomePage from "./pages/user/UserHomePage";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfile from "./pages/user/UserProfile";
import UserProfileSecurity from "./pages/user/UserProfileSecurity";
import VendorProfile from "./pages/vendor/VendorProfile";
import VendorProfileSecurity from "./pages/vendor/VendorProfileSecurity";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminVendorsPending from "./pages/admin/AdminVendorsPending";
import VendorForgotPassword from "./pages/vendor/VendorForgotPassword";
import VendorResetPassword from "./pages/vendor/VendorResetPassword";
import UserForgotPassword from "./pages/user/UserForgotPassword";
import UserResetPassword from "./pages/user/UserResetPassword";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import GoogleAuthCallback from "./components/user/GoogleAuthCallback";
import VendorLayout from "./layouts/VendorLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        <Route path="/user/verify-otp" element={<UserOtpVerification />} />
        <Route path="/vendor/verify-otp" element={<VendorOtpVerification />} />

        <Route path="/user/forgot-password" element={<UserForgotPassword />} />
        <Route path="/user/reset-password" element={<UserResetPassword />} />

        <Route
          path="/vendor/forgot-password"
          element={<VendorForgotPassword />}
        />
        <Route
          path="/vendor/reset-password"
          element={<VendorResetPassword />}
        />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute allowedTypes={["user"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/home" element={<UserHomePage />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/security" element={<UserProfileSecurity />} />
          </Route>
        </Route>
        {/* Protected vendor routes */}
        <Route element={<ProtectedRoute allowedTypes={["vendor"]} />}>
          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route
              path="/vendor/settings/profile"
              element={<VendorProfile />}
            />
            <Route
              path="/vendor/settings/security"
              element={<VendorProfileSecurity />}
            />
          </Route>
        </Route>
        {/* Protected admin routes */}
        <Route element={<ProtectedRoute allowedTypes={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route
              path="/admin/vendors/pending"
              element={<AdminVendorsPending />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
