import { useState, useEffect } from "react";
import VendorNavigation from "../../components/admin/VendorNavigation";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { FileText, Search, Check, X } from "lucide-react";
import { useAnimation } from "../../utils/animation";

const AdminVendorsPending = () => {
  const { listPendingVendors, updateVendorStatus } = useAuthStore();
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [vendorToReject, setVendorToReject] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [modalParent] = useAnimation();

  const loadPendingVendors = async (search: string = "") => {
    setIsLoading(true);
    try {
      const response = await listPendingVendors(search);
      setPendingVendors(response.vendors);
    } catch (error) {
      console.error("Failed to load pending vendors:", error);
      notifyError("Failed to load pending vendors.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingVendors();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPendingVendors(searchTerm);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPendingVendors = pendingVendors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(pendingVendors.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleApproveVendor = async (vendorId: any) => {
    try {
      await updateVendorStatus(vendorId, "active");
      loadPendingVendors(searchTerm);
      notifySuccess("Vendor approved successfully");
    } catch (error) {
      console.error("Failed to approve vendor:", error);
      notifyError(
        error instanceof Error ? error.message : "Failed to approve vendor"
      );
    }
  };

  const openRejectionModal = (vendor: any) => {
    setVendorToReject(vendor.id || vendor._id);
    setRejectionReason("");
    setIsRejectionModalOpen(true);
  };

  const handleRejectVendor = async () => {
    if (!vendorToReject) return;

    try {
      await updateVendorStatus(
        vendorToReject,
        "blocked",
        rejectionReason.trim() || ""
      );
      loadPendingVendors(searchTerm);
      notifySuccess("Vendor rejected successfully");

      setIsRejectionModalOpen(false);
      setVendorToReject(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Failed to reject vendor:", error);
      notifyError(
        error instanceof Error ? error.message : "Failed to reject vendor"
      );
    }
  };

  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocs(documents);
    setIsDocsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading pending vendors...</div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Pending Vendors
          </h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <VendorNavigation />
                <form onSubmit={handleSearchSubmit} className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      placeholder="Search vendors..."
                      className="pl-10 p-2.5 border border-gray-200 rounded-l-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-r-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  >
                    Search
                  </button>
                </form>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentPendingVendors.map((vendor) => (
                    <tr
                      key={vendor.id || vendor._id}
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
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleApproveVendor(vendor.id || vendor._id)
                            }
                            className="px-3.5 py-1.5 bg-green-500 text-white rounded-lg flex items-center text-sm font-medium transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Accept
                          </button>
                          <button
                            onClick={() => openRejectionModal(vendor)}
                            className="px-3.5 py-1.5 bg-red-500 text-white rounded-lg flex items-center text-sm font-medium transition duration-150 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                          >
                            <X className="w-4 h-4 mr-1.5" />
                            Reject
                          </button>
                        </div>
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
                    {pendingVendors.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
                    {Math.min(indexOfLastItem, pendingVendors.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pendingVendors.length}</span>{" "}
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
                    disabled={currentPage === totalPages || totalPages === 0}
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

          {isRejectionModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Reject Vendor
                  </h3>
                  <button
                    onClick={() => setIsRejectionModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition duration-150 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="rejectionReason"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Reason for rejection
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide a reason for rejecting this vendor..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This reason will be shared with the vendor to help them
                    understand why their application was rejected.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsRejectionModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectVendor}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150 cursor-pointer"
                  >
                    Reject Vendor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendorsPending;
