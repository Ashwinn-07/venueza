const VendorRevenueChart = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue</h3>
        <div className="flex items-center">
          <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs">
            This month
          </button>
          <button className="ml-2 text-gray-400">•••</button>
        </div>
      </div>

      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-gray-400 text-xs">
          <div>50</div>
          <div>40</div>
          <div>30</div>
          <div>20</div>
          <div>10</div>
        </div>

        {/* Chart area (placeholder) */}
        <div className="absolute left-8 right-0 top-0 h-full border-l border-b border-gray-200">
          {/* In a real app, you would render your chart here */}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-8 right-0 bottom-0 translate-y-6 flex justify-between text-gray-400 text-xs">
          {months.map((month, idx) => (
            <div key={idx}>{month}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorRevenueChart;
