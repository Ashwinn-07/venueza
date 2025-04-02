import { useState, useEffect } from "react";
import VenueNavigation from "../../components/admin/VenueNavigation";
import { Search, FileText, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const AdminVenuesPending = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingVenueId, setProcessingVenueId] = useState(null);

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [venueToReject, setVenueToReject] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { listPendingVenues, updateVenueVerificationStatus } = useAuthStore();

  const [modalParent] = useAutoAnimate();

  useEffect(() => {
    fetchPendingVenues();
  }, []);

  const fetchPendingVenues = async (search = "") => {
    try {
      setLoading(true);
      const result = await listPendingVenues(search);
      setVenues(result.venues || []);
    } catch (err: any) {
      setError(err.message);
      notifyError("Failed to fetch pending venues");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearchInput = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async () => {
    setSearchLoading(true);
    setCurrentPage(1);
    await fetchPendingVenues(searchTerm);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVenues = venues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(venues.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleApprove = async (venueId: any) => {
    try {
      setProcessingVenueId(venueId);

      const result = await updateVenueVerificationStatus(venueId, "approved");

      notifySuccess(result.message || "Venue approved successfully");

      setVenues(venues.filter((venue: any) => venue._id !== venueId));
    } catch (err) {
      notifyError("Failed to approve venue");
    } finally {
      setProcessingVenueId(null);
    }
  };

  const openRejectionModal = (venue: any) => {
    setVenueToReject(venue._id);
    setRejectionReason("");
    setIsRejectionModalOpen(true);
  };

  const handleRejectWithReason = async () => {
    if (!venueToReject) return;

    try {
      setProcessingVenueId(venueToReject);

      const result = await updateVenueVerificationStatus(
        venueToReject,
        "rejected",
        rejectionReason.trim() || ""
      );

      notifySuccess(result.message || "Venue rejected successfully");

      setVenues(venues.filter((venue: any) => venue._id !== venueToReject));
      setIsRejectionModalOpen(false);
      setVenueToReject(null);
      setRejectionReason("");
    } catch (err) {
      notifyError("Failed to reject venue");
    } finally {
      setProcessingVenueId(null);
    }
  };

  const handleViewDocuments = (documents: any) => {
    setSelectedDocs(documents);
    setIsDocsModalOpen(true);
  };

  if (loading && !searchLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-lg text-gray-600">Loading pending venues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Pending Venues
          </h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <VenueNavigation />
                <div className="relative flex">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search venues..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-l-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    value={searchTerm}
                    onChange={handleSearchInput}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={handleSearchSubmit}
                    disabled={searchLoading}
                    className={`${
                      searchLoading
                        ? "bg-gray-300"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white px-4 py-2.5 rounded-r-lg transition duration-150 cursor-pointer`}
                  >
                    {searchLoading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {venues.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm
                    ? "No venues match your search criteria"
                    : "No pending venues found"}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Services
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Capacity
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
                    {currentVenues.map((venue: any) => (
                      <tr
                        key={venue._id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={venue.images[0]}
                                alt={venue.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {venue.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {venue.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {venue.services &&
                              venue.services.map((service: any, index: any) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
                                >
                                  {service}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {venue.capacity} guests
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {venue.documents && venue.documents.length > 0 ? (
                            <button
                              onClick={() =>
                                handleViewDocuments(venue.documents)
                              }
                              className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
                            >
                              <FileText className="w-4 h-4 mr-1.5 cursor-pointer" />
                              <span className="text-sm font-medium cursor-pointer">
                                View ({venue.documents.length})
                              </span>
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No documents
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(venue._id)}
                              disabled={processingVenueId === venue._id}
                              className={`px-3 py-1.5 ${
                                processingVenueId === venue._id
                                  ? "bg-gray-400"
                                  : "bg-green-500 hover:bg-green-600"
                              } text-white rounded-lg flex items-center text-sm transition duration-150 cursor-pointer`}
                            >
                              {processingVenueId === venue._id
                                ? "Processing..."
                                : "Accept"}
                            </button>
                            <button
                              onClick={() => openRejectionModal(venue)}
                              disabled={processingVenueId === venue._id}
                              className={`px-3 py-1.5 ${
                                processingVenueId === venue._id
                                  ? "bg-gray-400"
                                  : "bg-red-500 hover:bg-red-600"
                              } text-white rounded-lg flex items-center text-sm transition duration-150 cursor-pointer`}
                            >
                              {processingVenueId === venue._id
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {venues.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
                    {Math.min(indexOfLastItem, venues.length)}
                  </span>{" "}
                  of <span className="font-medium">{venues.length}</span> venues
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
                    className="text-gray-400 hover:text-gray-600 transition duration-150 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDocs.map((doc: any, index: any) => (
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
                    Reject Venue
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
                    placeholder="Please provide a reason for rejecting this venue..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This reason will be shared with the venue owner to help them
                    understand why their venue was rejected.
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
                    onClick={handleRejectWithReason}
                    disabled={processingVenueId !== null}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer ${
                      processingVenueId !== null
                        ? "bg-gray-400"
                        : "bg-red-500 hover:bg-red-600"
                    } transition duration-150`}
                  >
                    {processingVenueId !== null
                      ? "Processing..."
                      : "Reject Venue"}
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

export default AdminVenuesPending;
