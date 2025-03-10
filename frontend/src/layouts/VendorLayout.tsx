import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/vendor/VendorSidebar";

const VendorLayout = () => {
  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
