import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import VendorNavigation from "../../components/admin/VendorNavigation";

const AdminVendors = () => {
  // Sample active vendors data
  const initialActiveVendors = [
    {
      id: 1,
      company: "Luxury Events Center",
      email: "jane.cooper@example.com",
      description: "dummy texts here dummy",
      venues: 7,
      status: "Active",
    },
    {
      id: 2,
      company: "Garden Paradise",
      email: "cody.fisher@example.com",
      description: "dummy texts here dummy",
      venues: 6,
      status: "Active",
    },
    {
      id: 3,
      company: "Golden Paradise",
      email: "esther.howard@example.com",
      description: "dummy texts here dummy",
      venues: 3,
      status: "Active",
    },
    {
      id: 4,
      company: "City Convention Center",
      email: "jenny.wilson@example.com",
      description: "dummy texts here dummy",
      venues: 1,
      status: "Active",
    },
    {
      id: 5,
      company: "TK Paradise",
      email: "kristin.watson@example.com",
      description: "dummy texts here dummy",
      venues: 5,
      status: "Active",
    },
    {
      id: 6,
      company: "KT Convention Center",
      email: "cameron.williamson@example.com",
      description: "dummy texts here dummy",
      venues: 2,
      status: "Active",
    },
  ];

  const [vendors, setVendors] = useState(initialActiveVendors);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = (vendorId: any) => {
    setVendors(
      vendors.map((vendor) => {
        if (vendor.id === vendorId) {
          const newStatus = vendor.status === "Active" ? "Blocked" : "Active";
          alert(
            `Vendor ${vendor.company} ${
              newStatus === "Active" ? "unblocked" : "blocked"
            } successfully`
          );
          return { ...vendor, status: newStatus };
        }
        return vendor;
      })
    );
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
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            vendor.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className={`px-3 py-1 border rounded text-sm font-medium ${
                            vendor.status === "Active"
                              ? "border-red-300 text-red-600 hover:bg-red-50"
                              : "border-green-300 text-green-600 hover:bg-green-50"
                          }`}
                          onClick={() => handleToggleBlock(vendor.id)}
                        >
                          {vendor.status === "Active" ? "Block" : "Unblock"}
                        </button>
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
                  <span className="font-medium">{filteredVendors.length}</span>{" "}
                  of <span className="font-medium">{vendors.length}</span>{" "}
                  vendors
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
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    2
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

export default AdminVendors;
