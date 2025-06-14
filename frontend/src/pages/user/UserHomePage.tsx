import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";
import VenueCard from "../../components/user/VenueCard";
import BannerCarousel from "../../components/BannerCarousel";

const UserHomePage = () => {
  const { getFeaturedVenues } = useAuthStore();
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedVenues = async () => {
      try {
        const response = await getFeaturedVenues();
        setVenues(response.venues || []);
      } catch (err) {
        setError("Failed to load venues");
        console.error("Venue fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVenues();
  }, [getFeaturedVenues]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E76F51]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12">
          <section className="mb-16">
            <BannerCarousel />
          </section>

          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Featured Venues
                </h2>
                <p className="text-gray-600">
                  Explore our handpicked selection of stunning venues
                </p>
              </div>
              <Link
                to="/user/venues"
                className="px-6 py-2.5 bg-[#F4A261] text-white rounded-md font-medium transition-all duration-300 hover:bg-[#E76F51] hover:shadow-md active:transform active:scale-95 cursor-pointer"
              >
                View All Venues
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { number: "500+", label: "Unique Venues" },
              { number: "10,000+", label: "Happy Customers" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg text-center shadow-sm border border-gray-100"
              >
                <div className="text-3xl font-bold text-[#E76F51] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserHomePage;
