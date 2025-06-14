import { MapPin, Users, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VenueCard = ({
  venue,
}: {
  venue: {
    id: string;
    name: string;
    address: string;
    capacity: number;
    price: number;
    images: string[];
  };
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/user/venues/${venue.id}`)}
      className="flex flex-col rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-[#F4A261] bg-white cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={venue.images[0] || "/default-venue.jpg"}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">
          {venue.name}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-[#F4A261]" />
          {venue.address}
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 mr-2 text-[#F4A261]" />
            <span className="text-gray-700">Up to {venue.capacity}</span>
          </div>
          <div className="flex items-center font-medium text-[#E76F51]">
            <IndianRupee className="w-4 h-4 mr-1" />
            {venue.price}/day
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
