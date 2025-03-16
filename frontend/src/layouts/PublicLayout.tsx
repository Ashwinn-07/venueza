import { Outlet } from "react-router-dom";
import { useAnimation } from "../utils/animation";

const PublicLayout = () => {
  const [animationParent] = useAnimation({
    duration: 500,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  });

  return (
    <div ref={animationParent} className="public-layout">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
