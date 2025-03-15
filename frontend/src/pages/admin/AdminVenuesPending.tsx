import { useState, useEffect } from "react";
import VenueNavigation from "../../components/admin/VenueNavigation";
import { Search, FileText, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const AdminVenuesPending = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingVenueId, setProcessingVenueId] = useState(null);

  const { listPendingVenues, updateVenueVerificationStatus } = useAuthStore();

  useEffect(() => {
    fetchPendingVenues();
  }, []);

  const fetchPendingVenues = async () => {
    try {
      setLoading(true);
      const result = await listPendingVenues();
      setVenues(result.venues || []);
    } catch (err: any) {
      setError(err.message);
      notifyError("Failed to fetch pending venues");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredVenues = venues.filter(
    (venue: any) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleReject = async (venueId: any) => {
    try {
      setProcessingVenueId(venueId);

      const result = await updateVenueVerificationStatus(venueId, "rejected");

      notifySuccess(result.message || "Venue rejected successfully");

      setVenues(venues.filter((venue: any) => venue._id !== venueId));
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

  if (loading) {
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search venues..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {venues.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No pending venues found
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
                    {filteredVenues.map((venue: any) => (
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
                              onClick={() => handleReject(venue._id)}
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
                  <span className="font-medium">{filteredVenues.length}</span>{" "}
                  of <span className="font-medium">{venues.length}</span> venues
                </p>
                <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                  <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150 cursor-pointer">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default AdminVenuesPending;
