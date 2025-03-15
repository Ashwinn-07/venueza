import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import VendorLayout from "./layouts/VendorLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import PageLoader from "./components/PageLoader";

const Landing = lazy(() => import("./pages/Landing"));
const VendorSignup = lazy(() => import("./pages/vendor/VendorSignup"));
const VendorOtpVerification = lazy(
  () => import("./pages/vendor/VendorOtpVerification")
);
const UserSignup = lazy(() => import("./pages/user/UserSignup"));
const UserOtpVerification = lazy(
  () => import("./pages/user/UserOtpVerification")
);
const VendorLogin = lazy(() => import("./pages/vendor/VendorLogin"));
const UserLogin = lazy(() => import("./pages/user/UserLogin"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const UserHomePage = lazy(() => import("./pages/user/UserHomePage"));
const ViewAllVenues = lazy(() => import("./pages/user/ViewAllVenues"));
const VenueDetails = lazy(() => import("./pages/user/VenueDetails"));
const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const UserProfileSecurity = lazy(
  () => import("./pages/user/UserProfileSecurity")
);
const VendorProfile = lazy(() => import("./pages/vendor/VendorProfile"));
const VendorProfileSecurity = lazy(
  () => import("./pages/vendor/VendorProfileSecurity")
);
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminVendors = lazy(() => import("./pages/admin/AdminVendors"));
const AdminVendorsPending = lazy(
  () => import("./pages/admin/AdminVendorsPending")
);
const VendorForgotPassword = lazy(
  () => import("./pages/vendor/VendorForgotPassword")
);
const VendorResetPassword = lazy(
  () => import("./pages/vendor/VendorResetPassword")
);
const UserForgotPassword = lazy(
  () => import("./pages/user/UserForgotPassword")
);
const UserResetPassword = lazy(() => import("./pages/user/UserResetPassword"));
const GoogleAuthCallback = lazy(
  () => import("./components/user/GoogleAuthCallback")
);
const VenueList = lazy(() => import("./pages/vendor/VenueList"));
const AddVenue = lazy(() => import("./pages/vendor/AddVenue"));
const EditVenue = lazy(() => import("./pages/vendor/EditVenue"));
const AdminVenues = lazy(() => import("./pages/admin/AdminVenues"));
const AdminVenuesPending = lazy(
  () => import("./pages/admin/AdminVenuesPending")
);

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
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Landing />
            </Suspense>
          }
        />

        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/vendor/signup"
            element={
              <Suspense fallback={<PageLoader />}>
                <VendorSignup />
              </Suspense>
            }
          />
          <Route
            path="/user/signup"
            element={
              <Suspense fallback={<PageLoader />}>
                <UserSignup />
              </Suspense>
            }
          />
          <Route
            path="/vendor/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <VendorLogin />
              </Suspense>
            }
          />
          <Route
            path="/user/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <UserLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminLogin />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/auth/google/callback"
          element={
            <Suspense fallback={<PageLoader />}>
              <GoogleAuthCallback />
            </Suspense>
          }
        />

        <Route
          path="/user/verify-otp"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserOtpVerification />
            </Suspense>
          }
        />
        <Route
          path="/vendor/verify-otp"
          element={
            <Suspense fallback={<PageLoader />}>
              <VendorOtpVerification />
            </Suspense>
          }
        />

        <Route
          path="/user/forgot-password"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/user/reset-password"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserResetPassword />
            </Suspense>
          }
        />

        <Route
          path="/vendor/forgot-password"
          element={
            <Suspense fallback={<PageLoader />}>
              <VendorForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/vendor/reset-password"
          element={
            <Suspense fallback={<PageLoader />}>
              <VendorResetPassword />
            </Suspense>
          }
        />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute allowedTypes={["user"]} />}>
          <Route element={<UserLayout />}>
            <Route
              path="/user/home"
              element={
                <Suspense fallback={<PageLoader />}>
                  <UserHomePage />
                </Suspense>
              }
            />
            <Route
              path="/user/venues"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ViewAllVenues />
                </Suspense>
              }
            />
            <Route
              path="/user/venues/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VenueDetails />
                </Suspense>
              }
            />
            <Route
              path="/user/profile"
              element={
                <Suspense fallback={<PageLoader />}>
                  <UserProfile />
                </Suspense>
              }
            />
            <Route
              path="/user/security"
              element={
                <Suspense fallback={<PageLoader />}>
                  <UserProfileSecurity />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* Protected vendor routes */}
        <Route element={<ProtectedRoute allowedTypes={["vendor"]} />}>
          <Route element={<VendorLayout />}>
            <Route
              path="/vendor/dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VendorDashboard />
                </Suspense>
              }
            />
            <Route
              path="/vendor/settings/profile"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VendorProfile />
                </Suspense>
              }
            />
            <Route
              path="/vendor/settings/security"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VendorProfileSecurity />
                </Suspense>
              }
            />
            <Route
              path="/vendor/venues"
              element={
                <Suspense fallback={<PageLoader />}>
                  <VenueList />
                </Suspense>
              }
            />
            <Route
              path="/vendor/venues/add"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AddVenue />
                </Suspense>
              }
            />
            <Route
              path="/vendor/venues/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <EditVenue />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute allowedTypes={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminUsers />
                </Suspense>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminVendors />
                </Suspense>
              }
            />
            <Route
              path="/admin/venues"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminVenues />
                </Suspense>
              }
            />
            <Route
              path="/admin/venues/pending"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminVenuesPending />
                </Suspense>
              }
            />
            <Route
              path="/admin/vendors/pending"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminVendorsPending />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
