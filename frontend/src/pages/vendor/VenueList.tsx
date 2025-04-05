import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const VenueList = () => {
  const navigate = useNavigate();
  const { getVenues, user } = useAuthStore();
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("approved");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isVendorVerified = user?.status === "active";

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getVenues(filter);
        setVenues(response.result?.venues || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch venues.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, [getVenues, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = venues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(venues.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading venues...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Venues</h1>
        {isVendorVerified ? (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => navigate("/vendor/venues/add")}
          >
            Add New Venue
          </button>
        ) : (
          <div className="flex flex-col items-end">
            <p className="text-red-600 mb-2">Get verified to add venues</p>
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer"
              onClick={() => navigate("/vendor/settings/profile")}
            >
              Get Verified
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "approved" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("approved")}
        >
          Approved Venues
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "rejected" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("rejected")}
        >
          Rejected Venues
        </button>
        <button
          className={`px-4 py-2 rounded cursor-pointer ${
            filter === "pending" ? "bg-gray-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending Venues
        </button>
      </div>

      {venues.length === 0 ? (
        <p className="text-gray-600">No venues found for this category.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentVenues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-2">{venue.address}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700">₹{venue.price}</span>
                    <span className="text-gray-700">
                      {venue.capacity} guests
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.services &&
                      venue.services.map((service: any, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      {venue.status === "open" && (
                        <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          Open
                        </span>
                      )}
                      {venue.status === "closed" && (
                        <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                          Closed
                        </span>
                      )}
                      {venue.verificationStatus === "rejected" && (
                        <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-700">
                          Rejected
                        </span>
                      )}
                      {venue.verificationStatus !== "rejected" && (
                        <button
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                          onClick={() =>
                            navigate(`/vendor/venues/${venue._id}`)
                          }
                        >
                          Edit Venue
                        </button>
                      )}
                    </div>
                    {venue.verificationStatus === "rejected" && (
                      <div className="text-red-600 text-sm mt-2">
                        <p>
                          Reason:{" "}
                          {venue.rejectionReason
                            ? venue.rejectionReason
                            : "No Reason given by the admin"}
                        </p>
                        <p>
                          You can try again by clicking on the add venue button
                          on top.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, venues.length)}
              </span>{" "}
              of <span className="font-medium">{venues.length}</span> venues
            </p>
            <nav className="relative z-0 inline-flex shadow-sm rounded-md">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150 cursor-pointer">
                {currentPage}
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default VenueList;
