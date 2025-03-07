import { Users } from "lucide-react";
import VenueSearch from "../../components/VenueSearch";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const VenueCard = ({
  title,
  location,
  capacity,
  pricePerDay,
  imageUrl,
}: any) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 bg-white">
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{location}</p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-700">Capacity: {capacity}</span>
          </div>
          <div className="font-medium text-blue-600">{pricePerDay}</div>
        </div>
      </div>
    </div>
  );
};

const UserHomePage = () => {
  // Mock venue data
  const venues = [
    {
      id: "1",
      title: "Grand Ballroom",
      location: "Downtown",
      capacity: 250,
      pricePerDay: "$1000/day",
      imageUrl:
        "public/lovable-uploads/568ec9c1-a18e-4c7f-a008-80569f7e61b7.png",
    },
    {
      id: "2",
      title: "Conference Center",
      location: "Midtown",
      capacity: 180,
      pricePerDay: "$850/day",
      imageUrl:
        "public/lovable-uploads/568ec9c1-a18e-4c7f-a008-80569f7e61b7.png",
    },
    {
      id: "3",
      title: "Garden Pavilion",
      location: "Westside",
      capacity: 120,
      pricePerDay: "$750/day",
      imageUrl:
        "public/lovable-uploads/568ec9c1-a18e-4c7f-a008-80569f7e61b7.png",
    },
  ];

  const handleSearch = (criteria: any) => {
    console.log("Search criteria:", criteria);
    // Searching functionality would go here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Search Section */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-12 text-center mb-16 shadow-sm">
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              Find Your Perfect Venue
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Discover unique venues for your next event, carefully curated for
              unforgettable experiences
            </p>

            <VenueSearch onSearch={handleSearch} />
          </section>

          {/* Featured Venues */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Featured Venues
              </h2>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95 cursor-pointer ">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <VenueCard key={venue.id} {...venue} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserHomePage;
