import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/vendor/VendorSidebar";
import { useAnimation } from "../utils/animation";

const VendorLayout = () => {
  const [animationParent] = useAnimation({
    duration: 300,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  });
  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <div ref={animationParent} className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
