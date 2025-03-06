import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white z-50 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-[#F4A261]" />
            <span className="text-xl font-semibold text-gray-800">Venueza</span>
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
            <button className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </button>
            <button className="bg-[#F4A261] text-white px-6 py-2 rounded-md hover:bg-[#E76F51] transition duration-300">
              Get Started
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <button className="text-gray-600 hover:text-gray-900 font-medium py-2">
                Log in
              </button>
              <button className="bg-[#F4A261] text-white px-6 py-2 rounded-md hover:bg-[#E76F51] transition duration-300">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
