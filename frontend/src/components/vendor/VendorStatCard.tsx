const VendorStatCard = ({ icon, title, value, change, isPositive }: any) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm flex items-center">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-lg mr-4 ${icon.bg}`}
      >
        {icon.content}
      </div>
      <div>
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-2xl font-semibold mb-1">{value}</div>
        <div
          className={`text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "↑" : "↓"} {change}
        </div>
      </div>
    </div>
  );
};

export default VendorStatCard;
