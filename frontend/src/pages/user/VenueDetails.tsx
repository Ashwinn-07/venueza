import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  DollarSign,
  MessageCircle,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const VenueDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock venue data - In production, this would come from an API
  const venue = {
    id,
    title: "Grand Ballroom",
    description:
      "A stunning venue perfect for weddings, corporate events, and special occasions. Features high ceilings, crystal chandeliers, and state-of-the-art amenities.",
    location: "123 Main St, Manhattan, NY 10001",
    capacity: 250,
    pricePerDay: "1,000/day",
    amenities: ["WiFi", "Parking", "Catering Kitchen", "AV Equipment", "Stage"],
    coordinates: { lat: 40.7128, lng: -74.006 },
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
    ],
    reviews: [
      {
        id: 1,
        user: "John Doe",
        rating: 5,
        comment: "Amazing venue! Perfect for our wedding reception.",
        date: "2024-02-15",
      },
      {
        id: 2,
        user: "Jane Smith",
        rating: 4,
        comment: "Great space and excellent service. Highly recommended.",
        date: "2024-02-10",
      },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + venue.images.length) % venue.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images and Map */}
          <div className="space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={venue.images[currentImageIndex]}
                alt={`Venue image ${currentImageIndex + 1}`}
                className="w-full h-[400px] object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={prevImage}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {venue.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div className="flex space-x-4">
              {venue.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    index === currentImageIndex ? "ring-2 ring-[#F4A261]" : ""
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

            {/* Map */}
            {/* <div className="rounded-lg overflow-hidden h-[300px]">
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={venue.coordinates}
                  zoom={15}
                >
                  <Marker position={venue.coordinates} />
                </GoogleMap>
              </LoadScript>
            </div> */}
          </div>

          {/* Right Column - Venue Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {venue.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-[#F4A261]" />
                {venue.location}
              </div>

              <p className="text-gray-600 mb-6">{venue.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#F4A261]" />
                  <span>Up to {venue.capacity} guests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-[#F4A261]" />
                  <span>{venue.pricePerDay}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#F4A261] text-white rounded-md hover:bg-[#E76F51] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat with Vendor</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#2A9D8F] text-white rounded-md hover:bg-[#264653] transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

              <div className="space-y-6">
                {venue.reviews.map((review) => (
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
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
