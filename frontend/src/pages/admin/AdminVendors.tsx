import { useState, useEffect } from "react";
import VendorNavigation from "../../components/admin/VendorNavigation";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { FileText, X, Search, Ban, CheckCircle } from "lucide-react";
import { useAnimation } from "../../utils/animation";

const AdminVendors = () => {
  const { listAllVendors, updateVendorStatus } = useAuthStore();
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [processingVendorId, setProcessingVendorId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [modalParent] = useAnimation();

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const response = await listAllVendors();
        setVendors(response.vendors);
      } catch (error) {
        console.error("Failed to load vendors:", error);
        notifyError("Failed to load vendors.");
      } finally {
        setIsLoading(false);
      }
    };
    loadVendors();
  }, [listAllVendors]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleToggleBlock = async (vendorId: string, currentStatus: string) => {
    setProcessingVendorId(vendorId);
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await updateVendorStatus(vendorId, newStatus);
      const response = await listAllVendors();
      setVendors(response.vendors);

      if (newStatus === "blocked") {
        notifySuccess("Vendor blocked successfully");
      } else {
        notifySuccess("Vendor unblocked successfully");
      }
    } catch (error) {
      console.error("Failed to update vendor status:", error);
      notifyError(
        error instanceof Error
          ? error.message
          : "Failed to update vendor status"
      );
    } finally {
      setProcessingVendorId(null);
    }
  };

  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocs(documents);
    setIsDocsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading vendors...</div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Vendors</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <VendorNavigation />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search vendors..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentVendors.map((vendor) => (
                    <tr
                      key={vendor._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {vendor.businessName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vendor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {vendor.businessAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vendor.documents && vendor.documents.length > 0 ? (
                          <button
                            onClick={() =>
                              handleViewDocuments(vendor.documents)
                            }
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
                          >
                            <FileText className="w-4 h-4 mr-1.5" />
                            <span className="text-sm font-medium cursor-pointer">
                              View ({vendor.documents.length})
                            </span>
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No documents
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full cursor-pointer ${
                            vendor.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {vendor.status === "active" ? (
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                          ) : (
                            <Ban className="w-4 h-4 mr-1.5" />
                          )}
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`px-3.5 py-1.5 rounded-lg flex items-center text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                            vendor.status === "active"
                              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                              : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                          }`}
                          onClick={() =>
                            handleToggleBlock(vendor._id, vendor.status)
                          }
                          disabled={processingVendorId === vendor._id}
                        >
                          {processingVendorId === vendor._id ? (
                            <span>Processing...</span>
                          ) : vendor.status === "active" ? (
                            <>
                              <Ban className="w-4 h-4 mr-1.5" />
                              Block
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1.5 " />
                              Unblock
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, filteredVendors.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredVendors.length}</span>{" "}
                  vendors
                </p>
                <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150 cursor-pointer">
                    {currentPage}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div ref={modalParent}>
          {isDocsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Documents
                  </h3>
                  <button
                    onClick={() => setIsDocsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition duration-150"
                  >
                    <X className="w-6 h-6 cursor-pointer" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="aspect-video bg-gray-50">
                        {doc.toLowerCase().endsWith(".pdf") ? (
                          <iframe
                            src={doc}
                            className="w-full h-full"
                            title={`Document ${index + 1}`}
                          />
                        ) : (
                          <img
                            src={doc}
                            alt={`Document ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4 bg-white">
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium transition duration-150 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendors;
