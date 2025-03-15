import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  IndianRupee,
  MessageCircle,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LocationPicker from "../../components/maps/LocationPicker";
import { useAuthStore } from "../../stores/authStore";

const VenueDetails = () => {
  const { id }: any = useParams();
  const { getUserVenue } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        const response = await getUserVenue(id);
        setVenue(response.result?.venue);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError("Failed to load venue details. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchVenueData();
    }
  }, [id]);

  const nextImage = () => {
    if (!venue || !venue.images || venue.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    if (!venue || !venue.images || venue.images.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + venue.images.length) % venue.images.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading venue details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Venue not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {venue.images && venue.images.length > 0 ? (
              <>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={venue.images[currentImageIndex]}
                    alt={`Venue image ${currentImageIndex + 1}`}
                    className="w-full h-[400px] object-cover"
                  />

                  {venue.images.length > 1 && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <button
                          onClick={prevImage}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {venue.images.map((_: any, index: any) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {venue.images.length > 1 && (
                  <div className="flex space-x-4">
                    {venue.images.map((image: any, index: any) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative rounded-lg overflow-hidden cursor-pointer  ${
                          index === currentImageIndex
                            ? "ring-2 ring-[#F4A261]"
                            : ""
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-24 h-24 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center h-[400px]">
                <p className="text-gray-500">No images available</p>
              </div>
            )}

            <div className="rounded-lg overflow-hidden h-[300px]">
              {venue.location && venue.location.coordinates ? (
                <LocationPicker
                  initialCoordinates={{
                    lat: venue.location.coordinates[1],
                    lng: venue.location.coordinates[0],
                  }}
                  initialAddress={venue.address}
                  readOnly={true}
                  height="300px"
                />
              ) : (
                <div className="h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Location not available</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {venue.name}
              </h1>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-[#F4A261]" />
                {venue.address || "Address not available"}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#F4A261]" />
                  <span>Up to {venue.capacity || "N/A"} guests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5 text-[#F4A261]" />
                  <span>{venue.price || "Price not available"}</span>
                </div>
              </div>

              {venue.services && venue.services.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.services.map((service: any) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-8">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#F4A261] text-white rounded-md hover:bg-[#E76F51] transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat with Vendor</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#264653] transition-colors cursor-pointer">
                  <Calendar className="w-5 h-5" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>

            {venue.reviews && venue.reviews.length > 0 ? (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Reviews
                </h2>

                <div className="space-y-6">
                  {venue.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {review.user}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Reviews
                </h2>
                <p className="text-gray-600">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
