import { useState } from "react";

const BookingPage = () => {
  // Mock venue data
  const venue = {
    id: "1",
    name: "Grand Ballroom & Conference Center",
    address: "123 Wedding Lane, New York, NY 10001",
    photos: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    pricing: 5000,
    capacity: 250,
    vendorName: "Elite Venues & Events",
  };

  // Form state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState(venue.pricing);
  const [advanceAmount, setAdvanceAmount] = useState(venue.pricing * 0.2);

  // Format date for display
  // const formatDate = (date: any) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return date.toLocaleDateString(undefined, options);
  // };

  // Calculate price based on date range
  const calculatePrice = (start: any, end: any) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays > 0 ? diffDays : 1;

    const calculatedTotal = venue.pricing * days;
    setTotalPrice(calculatedTotal);
    setAdvanceAmount(calculatedTotal * 0.2);
  };

  // Handle date changes
  const handleStartDateChange = (e: any) => {
    const newDate = new Date(e.target.value);
    setStartDate(newDate);
    calculatePrice(newDate, endDate);
  };

  const handleEndDateChange = (e: any) => {
    const newDate = new Date(e.target.value);
    setEndDate(newDate);
    calculatePrice(startDate, newDate);
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Booking created successfully! Redirecting to confirmation page...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 border rounded hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Book Venue</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left column - Venue summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={venue.photos[0]}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
                <p className="text-gray-600 mb-4">{venue.address}</p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      ${venue.pricing.toLocaleString()}/day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{venue.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-medium">{venue.vendorName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Booking form */}
          <div className="lg:col-span-7">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Book {venue.name}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate.toISOString().split("T")[0]}
                      onChange={handleStartDateChange}
                      className="p-2 border rounded-md"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate.toISOString().split("T")[0]}
                      onChange={handleEndDateChange}
                      className="p-2 border rounded-md"
                      min={startDate.toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Venue price per day:</span>
                    <span className="font-medium">
                      ${venue.pricing.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total booking amount:</span>
                    <span className="font-semibold">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3 border-dashed border-gray-300">
                    <span className="text-gray-600">Advance amount (20%):</span>
                    <span className="font-semibold text-blue-600">
                      ${advanceAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Balance due at venue:</span>
                    <span className="font-semibold">
                      ${(totalPrice - advanceAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
