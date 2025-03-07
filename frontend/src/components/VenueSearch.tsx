import { useState } from "react";
import { Search, MapPin, Users, Calendar } from "lucide-react";

const VenueSearch = ({ onSearch }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [criteria, setCriteria] = useState({
    query: "",
    location: "",
    capacity: "",
    date: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(criteria);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="relative">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                name="query"
                placeholder="Search venues..."
                value={criteria.query}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 rounded-l-lg border border-gray-300 focus:outline-none"
                onFocus={() => setIsExpanded(true)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg cursor-pointer"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="relative">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={criteria.location}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none"
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={criteria.capacity}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none"
              />
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={criteria.date}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none"
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueSearch;
