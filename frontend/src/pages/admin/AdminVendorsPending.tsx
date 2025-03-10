import { useState, useEffect } from "react";
import VendorNavigation from "../../components/admin/VendorNavigation";
import { useAuthStore } from "../../stores/authStore";
import { notifyError } from "../../utils/notifications";

const AdminVendorsPending = () => {
  const { listPendingVendors } = useAuthStore();
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingVendors = async () => {
      try {
        const response = await listPendingVendors();
        setPendingVendors(response.vendors);
      } catch (error) {
        console.error("Failed to load pending vendors:", error);
        notifyError("Failed to load pending vendors.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPendingVendors();
  }, [listPendingVendors]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPendingVendors = pendingVendors.filter(
    (vendor) =>
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveVendor = () => {
    alert("coming soon");
  };

  const handleRejectVendor = () => {
    alert("coming soon");
  };

  if (isLoading) return <div>Loading pending vendors...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Pending Vendors
          </h1>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <VendorNavigation />
                <div className="relative mt-3 sm:mt-0">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="search"
                    placeholder="Search"
                    className="pl-10 p-2 border rounded w-full sm:w-64"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Company</th>
                    <th className="px-6 py-3 text-left">Address</th>
                    <th className="px-6 py-3 text-left">Venues</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPendingVendors.map((vendor) => (
                    <tr
                      key={vendor.id || vendor._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.businessName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vendor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {vendor.businessAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div className="text-sm text-gray-500">
                          {vendor.venues}
                        </div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded flex items-center text-sm cursor-pointer"
                            onClick={() => handleApproveVendor()}
                          >
                            <span className="mr-1">✓</span> Accept
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded flex items-center text-sm cursor-pointer"
                            onClick={() => handleRejectVendor()}
                          >
                            <span className="mr-1">✕</span> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {filteredPendingVendors.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pendingVendors.length}</span>{" "}
                  requests
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                    &lt;
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-orange-500 text-sm font-medium text-white cursor-pointer">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                    &gt;
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

export default AdminVendorsPending;
