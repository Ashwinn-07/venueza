import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import VendorNavigation from "../../components/admin/VendorNavigation";

const AdminVendorsPending = () => {
  // Sample pending vendors data
  const initialPendingVendors = [
    {
      id: 7,
      company: "Royal Weddings",
      email: "royal.weddings@example.com",
      description: "Exclusive wedding venues and planning services",
      venues: 4,
    },
    {
      id: 8,
      company: "Premier Events",
      email: "info@premierevents.example.com",
      description: "Corporate and social event specialists",
      venues: 2,
    },
    {
      id: 9,
      company: "Sunset Gatherings",
      email: "sunset@gatherings.example.com",
      description: "Beachfront and outdoor event solutions",
      venues: 3,
    },
  ];

  const [pendingVendors, setPendingVendors] = useState(initialPendingVendors);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredPendingVendors = pendingVendors.filter(
    (vendor) =>
      vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveVendor = (vendorId: any) => {
    const vendorToApprove = pendingVendors.find(
      (vendor) => vendor.id === vendorId
    );
    if (vendorToApprove) {
      setPendingVendors(
        pendingVendors.filter((vendor) => vendor.id !== vendorId)
      );
      alert(`Vendor ${vendorToApprove.company} approved successfully`);
    }
  };

  const handleRejectVendor = (vendorId: any) => {
    const vendorToReject = pendingVendors.find(
      (vendor) => vendor.id === vendorId
    );
    if (vendorToReject) {
      setPendingVendors(
        pendingVendors.filter((vendor) => vendor.id !== vendorId)
      );
      alert(`Vendor ${vendorToReject.company} rejected successfully`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Vendors</h1>

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
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Venues</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPendingVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.company}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vendor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {vendor.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {vendor.venues}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded flex items-center text-sm"
                            onClick={() => handleApproveVendor(vendor.id)}
                          >
                            <span className="mr-1">✓</span> Accept
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded flex items-center text-sm"
                            onClick={() => handleRejectVendor(vendor.id)}
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
                  <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    &lt;
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-orange-500 text-sm font-medium text-white">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
