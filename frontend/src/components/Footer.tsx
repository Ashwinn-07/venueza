import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-12">
          <Heart className="text-[#F4A261]" />
          <span className="text-xl font-semibold text-gray-800">Venueza</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 md:mb-4 text-sm md:text-base">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 md:mb-4 text-sm md:text-base">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Accessibility
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Partners
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 md:mb-4 text-sm md:text-base">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 md:mb-4 text-sm md:text-base">
              Social
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-[#F4A261] transition duration-300 text-sm md:text-base"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6 md:pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Venueza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
