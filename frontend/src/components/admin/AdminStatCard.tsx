const AdminStatCard = ({ title, value, icon }: any) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-500 text-base mb-1">{title}</div>
          <div className="text-4xl font-bold">{value}</div>
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${icon.bg} bg-opacity-10`}
        >
          {icon.content}
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
