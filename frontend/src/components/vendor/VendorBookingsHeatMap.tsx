const VendorBookingsHeatmap = () => {
  // This would typically be populated from your data
  const hours = [
    "0:00",
    "2:00",
    "4:00",
    "6:00",
    "8:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const values = ["200", "350", "500", "650", "800"];

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">BOOKINGS BY TIME OF DAY</h3>
      </div>

      <div className="relative h-64">
        {/* Time labels (Y-axis) */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-gray-400 text-xs">
          {hours.map((hour, idx) => (
            <div key={idx}>{hour}</div>
          ))}
        </div>

        <div className="absolute left-12 right-12 top-0 bottom-8 bg-gray-50">
          {/* In a real app, you would render your heatmap here */}
        </div>

        {/* Days labels (X-axis) */}
        <div className="absolute left-12 right-12 bottom-0 flex justify-between text-gray-400 text-xs">
          {days.map((day, idx) => (
            <div key={idx}>{day}</div>
          ))}
        </div>

        {/* Legend values */}
        <div className="absolute bottom-0 translate-y-6 left-12 right-12 flex justify-between text-gray-400 text-xs">
          {values.map((value, idx) => (
            <div key={idx}>{value}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorBookingsHeatmap;
