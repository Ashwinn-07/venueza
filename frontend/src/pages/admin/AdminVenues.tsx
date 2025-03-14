import { useState } from "react";
import VenueNavigation from "../../components/admin/VenueNavigation";
import { Search, Ban, CheckCircle } from "lucide-react";

const mockVenues = [
  {
    _id: "1",
    name: "Grand Ballroom",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=500",
    address: "123 Main St, New York, NY 10001",
    services: ["Wedding", "Corporate Events", "Parties"],
    capacity: 500,
    status: "Active",
  },
  {
    _id: "2",
    name: "Seaside Resort",
    image:
      "https://images.unsplash.com/photo-1439130490301-25e322d88054?auto=format&fit=crop&q=80&w=500",
    address: "789 Beach Road, Miami, FL 33139",
    services: ["Wedding", "Parties", "Conferences"],
    capacity: 300,
    status: "Blocked",
  },
  {
    _id: "3",
    name: "Mountain View Hall",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=500",
    address: "456 Pine Ave, Denver, CO 80202",
    services: ["Corporate Events", "Seminars", "Exhibitions"],
    capacity: 400,
    status: "Active",
  },
];

const AdminVenues = () => {
  const [venues] = useState(mockVenues);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = () => {
    alert("coming soon");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Venues</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <VenueNavigation />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search venues..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredVenues.map((venue) => (
                    <tr
                      key={venue._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={venue.image}
                              alt={venue.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {venue.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {venue.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {venue.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {venue.capacity} guests
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full ${
                            venue.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {venue.status === "Active" ? (
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                          ) : (
                            <Ban className="w-4 h-4 mr-1.5" />
                          )}
                          {venue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`px-3.5 py-1.5 rounded-lg flex items-center text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            venue.status === "Active"
                              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                              : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                          }`}
                          onClick={() => handleToggleBlock()}
                        >
                          {venue.status === "Active" ? (
                            <>
                              <Ban className="w-4 h-4 mr-1.5" />
                              Block
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Unblock
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{filteredVenues.length}</span>{" "}
                  of <span className="font-medium">{venues.length}</span> venues
                </p>
                <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                  <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVenues;
