import { Users, MapPin, DollarSign } from "lucide-react";
import VenueSearch from "../../components/VenueSearch";
import { Link } from "react-router-dom";

const VenueCard = ({
  title,
  location,
  capacity,
  pricePerDay,
  imageUrl,
}: {
  title: string;
  location: string;
  capacity: number;
  pricePerDay: string;
  imageUrl: string;
}) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-[#F4A261] bg-white">
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

const UserHomePage = () => {
  // Mock venue data
  const venues = [
    {
      id: "1",
      title: "Grand Ballroom",
      location: "Downtown Manhattan, NY",
      capacity: 250,
      pricePerDay: "1,000/day",
      imageUrl:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "2",
      title: "Modern Conference Center",
      location: "Midtown, Chicago",
      capacity: 180,
      pricePerDay: "850/day",
      imageUrl:
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "3",
      title: "Garden Pavilion",
      location: "Beverly Hills, LA",
      capacity: 120,
      pricePerDay: "750/day",
      imageUrl:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const handleSearch = (criteria: any) => {
    console.log("Search criteria:", criteria);
    // Searching functionality would go here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12">
          <section className="relative bg-gradient-to-r from-[#F4A261]/10 to-[#E76F51]/10 rounded-2xl p-8 md:p-12 text-center mb-16 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-tight">
                Find Your Perfect Venue
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Discover unique venues for your next event, carefully curated
                for unforgettable experiences
              </p>

              <VenueSearch onSearch={handleSearch} />
            </div>

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80')] opacity-5" />
          </section>

          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Featured Venues
                </h2>
                <p className="text-gray-600">
                  Explore our handpicked selection of stunning venues
                </p>
              </div>
              <Link
                to="/user/venues"
                className="px-6 py-2.5 bg-[#F4A261] text-white rounded-md font-medium transition-all duration-300 hover:bg-[#E76F51] hover:shadow-md active:transform active:scale-95 cursor-pointer"
              >
                View All Venues
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
              {venues.map((venue) => (
                <VenueCard key={venue.id} {...venue} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { number: "500+", label: "Unique Venues" },
              { number: "10,000+", label: "Happy Customers" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg text-center shadow-sm border border-gray-100"
              >
                <div className="text-3xl font-bold text-[#E76F51] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserHomePage;
