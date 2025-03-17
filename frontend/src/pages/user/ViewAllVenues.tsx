import { useEffect, useState, useCallback } from "react";
import VenueSearch from "../../components/VenueSearch";
import { useAuthStore } from "../../stores/authStore";
import VenueCard from "../../components/user/VenueCard";

const ViewAllVenues = () => {
  const { getUserVenues } = useAuthStore();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalCount, setTotalCount] = useState(0);

  const [searchCriteria, setSearchCriteria] = useState({
    query: "",
    location: "",
    capacity: "",
  });

  const fetchVenues = useCallback(
    async (page = 1, criteria = searchCriteria) => {
      try {
        setLoading(true);
        setError("");
        const params = {
          page,
          limit: pageSize,
          query: criteria.query,
          location: criteria.location,
          capacity: criteria.capacity ? Number(criteria.capacity) : undefined,
        };
        const response = await getUserVenues(params);
        setVenues(response.result?.venues || []);
        setTotalCount(response.result?.totalCount || 0);
        setCurrentPage(page);
      } catch (err) {
        setError("Failed to load venues");
        console.error("Venue fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [getUserVenues, pageSize, searchCriteria]
  );

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleSearch = (criteria: any) => {
    setSearchCriteria(criteria);
    fetchVenues(1, criteria);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchVenues(page, searchCriteria);
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
          {venues.map((venue: any) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium ${
                    page === currentPage
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  } cursor-pointer`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              &gt;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ViewAllVenues;
