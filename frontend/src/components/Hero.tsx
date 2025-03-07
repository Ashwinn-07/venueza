import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 md:pt-0">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"
          alt="Wedding Venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-white leading-tight">
          Find Your Perfect Venue
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto text-white/90 px-4">
          Connect with premium venues for your next event. Simple booking,
          secure payments, and instant communication.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Link
            to="/user/signup"
            className="w-full sm:w-auto bg-[#F4A261] text-white px-8 py-3 rounded-md text-lg hover:bg-[#E76F51] transition duration-300"
          >
            Book a venue
          </Link>
          <Link
            to="/vendor/signup"
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-md text-lg hover:bg-white/20 transition duration-300"
          >
            List your venue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
