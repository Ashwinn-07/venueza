import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export const PublicOnlyRoute = () => {
  const { isAuthenticated, authType } = useAuthStore();

  if (isAuthenticated) {
    const dashboardPath =
      authType === "vendor"
        ? "/vendor/dashboard"
        : authType === "admin"
        ? "/admin/dashboard"
        : "/user/home";

    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};
