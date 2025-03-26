import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../stores/authStore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleLogoutConfirm = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to Logout from this account?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleLogout(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <nav className="fixed w-full bg-white z-50 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="text-[#F4A261]" />
              <span className="text-xl font-semibold text-gray-800">
                Venueza
              </span>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          <div className="hidden md:flex gap-4 items-center">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-[#F4A261] text-white p-2 rounded-full">
                      <User className="h-5 w-5 cursor-pointer" />
                    </div>
                  )}
                  <span className="font-medium cursor-pointer">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown className="h-4 w-4 cursor-pointer" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-in fade-in-50 slide-in-from-top-5">
                    <Link
                      to="/user/home"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </div>
                    </Link>
                    <button
                      onClick={handleLogoutConfirm}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4 cursor-pointer" />
                        Log out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/user/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/user/signup"
                  className="bg-[#F4A261] text-white px-6 py-2 rounded-md hover:bg-[#E76F51] transition duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/user/home"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/user/login"
                    className="text-gray-600 hover:text-gray-900 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/user/signup"
                    className="bg-[#F4A261] text-white px-6 py-2 rounded-md hover:bg-[#E76F51] transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
