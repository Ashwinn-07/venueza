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
        <Route path="/user/home" element={<UserHomePage />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>
        <Route path="/vendor/verify-otp" element={<VendorOtpVerification />} />
        <Route path="/user/verify-otp" element={<UserOtpVerification />} />
        {/* Protected user routes */}
        {/* <Route element={<ProtectedRoute allowedTypes={["user"]} />}>
          <Route path="/user/home" element={<UserHomePage />} /> */}
        {/* Other user routes */}
        {/* </Route> */}
        {/* Protected vendor routes */}
        {/* <Route element={<ProtectedRoute allowedTypes={["vendor"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} /> */}{" "}
        */
        {/* Other vendor routes
        {/* </Route> */}
        {/* Protected admin routes */}
        {/* <Route element={<ProtectedRoute allowedTypes={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* Other admin routes */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
