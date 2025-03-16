import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAnimation } from "../utils/animation";

const UserLayout = () => {
  const [animationParent] = useAnimation({
    duration: 300,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  });
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div
        ref={animationParent}
        className="pt-16 flex-grow container mx-auto px-4 py-8"
      >
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
