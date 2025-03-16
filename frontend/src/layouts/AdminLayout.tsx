import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAnimation } from "../utils/animation";

const AdminLayout = () => {
  const [animationParent] = useAnimation({
    duration: 300,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  });
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div ref={animationParent} className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
