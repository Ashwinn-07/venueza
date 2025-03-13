interface Venue {
  id: string;
  name: string;
  address: string;
  photos: string[];
  services: string[];
  pricing: number;
  capacity: number;
  isOpen: boolean;
}

const initialVenues: Venue[] = [
  {
    id: "1",
    name: "Elegant Wedding Hall",
    address: "123 Wedding Lane, New York, NY",
    photos: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    services: ["Catering", "Decoration", "Photography"],
    pricing: 5000,
    capacity: 200,
    isOpen: true,
  },
  {
    id: "2",
    name: "Lakeside Retreat",
    address: "456 Lake View Road, Seattle, WA",
    photos: [
      "https://images.unsplash.com/photo-1464366400160-e82894203e3b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    services: ["Catering", "Sound System", "Outdoor Setup"],
    pricing: 3500,
    capacity: 150,
    isOpen: false,
  },
];

const VenueList = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Venues</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => (window.location.href = "/vendor/venues/add")}
        >
          Add New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialVenues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <img
              src={venue.photos[0]}
              alt={venue.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{venue.name}</h3>
              <p className="text-gray-600 mb-2">{venue.address}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700">${venue.pricing}</span>
                <span className="text-gray-700">{venue.capacity} guests</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {venue.services.map((service, index) => (
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
                    venue.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {venue.isOpen ? "Open" : "Closed"}
                </span>
                <button
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() =>
                    (window.location.href = `/vendor/venues/${venue.id}`)
                  }
                >
                  Edit Venue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueList;
