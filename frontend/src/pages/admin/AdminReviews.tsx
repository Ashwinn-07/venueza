import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { Search, X, Star, AlertCircle } from "lucide-react";
import { useAnimation } from "../../utils/animation";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminReviews = () => {
  const { listApprovedVenues, getReviewsAdmin, adminDeleteReview } =
    useAuthStore();
  const [venues, setVenues] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;

  const [modalParent] = useAnimation();

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await listApprovedVenues("");
        setVenues(response.venues);
      } catch (error) {
        console.error("Failed to load venues:", error);
        notifyError("Failed to load venues.");
      } finally {
        setIsLoading(false);
      }
    };
    loadVenues();
  }, [listApprovedVenues]);

  useEffect(() => {
    const loadReviews = async () => {
      if (selectedVenue) {
        try {
          setIsLoading(true);
          const response = await getReviewsAdmin(selectedVenue._id);
          setReviews(response.reviews);
        } catch (error) {
          console.error("Failed to load reviews:", error);
          notifyError("Failed to load reviews.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadReviews();
  }, [selectedVenue, getReviewsAdmin]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectVenue = (venue: any) => {
    setSelectedVenue(venue);
    setCurrentPage(1);
  };

  const filteredVenues = venues.filter(
    (venue: any) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(
    (review: any) =>
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.user.name &&
        review.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (reviewId: any) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this review?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setIsDeleting(true);
              await adminDeleteReview(reviewId);
              setReviews(
                reviews.filter((review: any) => review._id !== reviewId)
              );

              if (
                isReviewModalOpen &&
                selectedReview &&
                selectedReview._id === reviewId
              ) {
                setIsReviewModalOpen(false);
              }

              notifySuccess("Review Deleted Successfully");
            } catch (error) {
              console.error("Failed to delete review:", error);
              notifyError("Failed to delete review.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const renderStars = (rating: any) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ));
  };

  if (isLoading && !selectedVenue) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Reviews</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select Venue
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search venues..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
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
                      Venue Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredVenues.map((venue: any) => (
                    <tr
                      key={venue._id}
                      className={`hover:bg-gray-50 transition duration-150 ${
                        selectedVenue && selectedVenue._id === venue._id
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {venue.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {venue.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectVenue(venue)}
                          className="px-3.5 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                          View Reviews
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedVenue && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Reviews for {selectedVenue.name}
                  </h2>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      placeholder="Search reviews..."
                      className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-lg text-gray-600">
                    Loading reviews...
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Review
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {currentReviews.length > 0 ? (
                          currentReviews.map((review: any) => (
                            <tr
                              key={review._id}
                              className="hover:bg-gray-50 transition duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">
                                  {review.user.name || "Anonymous User"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                  <span className="ml-2 text-sm text-gray-600">
                                    ({review.rating})
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600 truncate max-w-xs">
                                  {review.reviewText}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewReview(review)}
                                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-150 cursor-pointer"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteReview(review._id)
                                    }
                                    className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium transition duration-150 cursor-pointer"
                                    disabled={isDeleting}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <AlertCircle className="w-12 h-12 mb-2" />
                                <p className="text-lg">
                                  No reviews found for this venue
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {currentReviews.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Showing{" "}
                          <span className="font-medium">
                            {indexOfFirstItem + 1} -{" "}
                            {Math.min(indexOfLastItem, filteredReviews.length)}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {filteredReviews.length}
                          </span>{" "}
                          reviews
                        </p>
                        <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                          <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed "
                          >
                            Previous
                          </button>
                          <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition duration-150 cursor-pointer">
                            {currentPage}
                          </button>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed "
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div ref={modalParent}>
          {isReviewModalOpen && selectedReview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Review Details
                  </h3>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition duration-150"
                  >
                    <X className="w-6 h-6 cursor-pointer" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User</p>
                    <p className="text-base font-semibold">
                      {selectedReview.user.name || "Anonymous User"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2">({selectedReview.rating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base">
                      {new Date(selectedReview.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Review</p>
                    <p className="text-base whitespace-pre-line">
                      {selectedReview.reviewText}
                    </p>
                  </div>
                  {selectedReview.images &&
                    selectedReview.images.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Images
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedReview.images.map(
                            (image: any, index: any) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-auto object-cover"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteReview(selectedReview._id)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Review"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
