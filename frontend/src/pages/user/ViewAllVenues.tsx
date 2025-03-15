import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import VenueSearch from "../../components/VenueSearch";

const VenueCard = ({
  id,
  title,
  location,
  capacity,
  pricePerDay,
  imageUrl,
}: {
  id: string;
  title: string;
  location: string;
  capacity: number;
  pricePerDay: string;
  imageUrl: string;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/user/venues/${id}`)}
      className="flex flex-col rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-[#F4A261] bg-white"
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-[#F4A261]" />
          {location}
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 mr-2 text-[#F4A261]" />
            <span className="text-gray-700">Up to {capacity}</span>
          </div>
          <div className="flex items-center font-medium text-[#E76F51]">
            <DollarSign className="w-4 h-4 mr-1" />
            {pricePerDay}
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewAllVenues = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 9;

  // Mock venue data - In production, this would come from an API
  const venues = Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    title: `Venue ${i + 1}`,
    location: ["Manhattan, NY", "Chicago, IL", "Los Angeles, CA", "Miami, FL"][
      i % 4
    ],
    capacity: [100, 150, 200, 250, 300][i % 5],
    pricePerDay: [`${(i + 5) * 100}/day`],
    imageUrl: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
    ][i % 4],
  }));

  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = venues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(venues.length / venuesPerPage);

  const handleSearch = (criteria: any) => {
    console.log("Search criteria:", criteria);
    // Implement search logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Venues</h1>
          <VenueSearch onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentVenues.map((venue: any) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? "bg-[#F4A261] text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllVenues;
