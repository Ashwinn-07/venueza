import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#F4A261] to-[#E76F51]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          Ready to Get Started?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
          <Link
            to="/user/home"
            className="w-full sm:w-auto bg-white text-[#E76F51] px-6 md:px-8 py-3 rounded-md text-base md:text-lg hover:bg-gray-50 transition duration-300 sm:min-w-[200px]"
          >
            Find a venue
          </Link>
          <Link
            to="/vendor/signup"
            className="w-full sm:w-auto bg-transparent border border-white text-white px-6 md:px-8 py-3 rounded-md text-base md:text-lg hover:bg-white/10 transition duration-300 sm:min-w-[200px]"
          >
            List your venue
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
