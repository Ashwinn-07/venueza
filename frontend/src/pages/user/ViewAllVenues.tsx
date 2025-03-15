import { useEffect, useState } from "react";
import VenueSearch from "../../components/VenueSearch";
import { useAuthStore } from "../../stores/authStore";
import VenueCard from "../../components/user/VenueCard";

const ViewAllVenues = () => {
  const { getUserVenues } = useAuthStore();
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserVenues();
        setVenues(response.result?.venues || []);
      } catch (err) {
        setError("Failed to load venues");
        console.error("Venue fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [getUserVenues]);

  const handleSearch = () => {
    console.log("coming soon");
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E76F51]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Venues</h1>
          <VenueSearch onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {venues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{venues.length}</span> of{" "}
              <span className="font-medium">{venues.length}</span> venues
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                &lt;
              </button>
              <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-orange-500 text-sm font-medium text-white cursor-pointer">
                1
              </button>
              <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer ">
                2
              </button>
              <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllVenues;
