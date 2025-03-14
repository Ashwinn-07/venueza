import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const VenueList = () => {
  const navigate = useNavigate();
  const { getVenues } = useAuthStore();
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getVenues();
        setVenues(response.result?.venues || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch venues.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVenues();
  }, [getVenues]);

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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => navigate("/vendor/venues/add")}
        >
          Add New Venue
        </button>
      </div>

      {venues.length === 0 ? (
        <p className="text-gray-600">
          No venues found. Add a new venue to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
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
                  <span className="text-gray-700">{venue.capacity} guests</span>
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
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      venue.status === "closed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {venue.status === "closed" ? "Open" : "Closed"}
                  </span>
                  <button
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    onClick={() => navigate(`/vendor/venues/${venue._id}`)}
                  >
                    Edit Venue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueList;
