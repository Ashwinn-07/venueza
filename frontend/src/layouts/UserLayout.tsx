import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="pt-16 flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
