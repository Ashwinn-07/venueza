import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import {
  Search,
  X,
  Star,
  AlertCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { useAnimation } from "../../utils/animation";

const VendorReviews = () => {
  const { getVenues, getReviewsVendor, vendorReplyReview } = useAuthStore();
  const [venues, setVenues] = useState([]);
  const [reviews, setReviews] = useState<any>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [modalParent] = useAnimation();

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await getVenues("all");
        setVenues(response.result?.venues);
        if (response.venues && response.venues.length > 0) {
          setSelectedVenue(response.venues[0]);
        }
      } catch (error) {
        console.error("Failed to load venues:", error);
        notifyError("Failed to load your venues.");
      } finally {
        setIsLoading(false);
      }
    };
    loadVenues();
  }, [getVenues]);

  useEffect(() => {
    const loadReviews = async () => {
      if (selectedVenue) {
        try {
          setIsLoading(true);
          const response = await getReviewsVendor(selectedVenue._id);
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
  }, [selectedVenue, getReviewsVendor]);

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

  const handleRespondToReview = (review: any) => {
    setSelectedReview(review);
    setReplyText(review.vendorReply || "");
    setIsReplyModalOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      notifyError("Please enter a reply.");
      return;
    }

    try {
      setIsSubmitting(true);
      await vendorReplyReview(selectedReview._id, replyText);

      const updatedReviews = reviews.map((review: any) =>
        review._id === selectedReview._id
          ? { ...review, vendorReply: replyText }
          : review
      );
      setReviews(updatedReviews);

      setSelectedReview({ ...selectedReview, vendorReply: replyText });

      notifySuccess("Reply submitted successfully!");
      setIsReplyModalOpen(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
      notifyError("Failed to submit reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce(
      (acc: number, review: any) => acc + review.rating,
      0
    );
    return (sum / reviews.length).toFixed(1);
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

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review: any) => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++;
      }
    });
    return distribution;
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Venue Reviews
          </h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Venues
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search venues..."
                    className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150"
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
                  {filteredVenues.length > 0 ? (
                    filteredVenues.map((venue: any) => (
                      <tr
                        key={venue._id}
                        className={`hover:bg-gray-50 transition duration-150 ${
                          selectedVenue && selectedVenue._id === venue._id
                            ? "bg-teal-50"
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
                            className="px-3.5 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer"
                          >
                            View Reviews
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <AlertCircle className="w-12 h-12 mb-2" />
                          <p className="text-lg">No venues found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedVenue && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Overall Rating
                  </h3>
                  <div className="flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-teal-600">
                      {calculateAverageRating()}
                    </span>
                    <div className="flex mt-2">
                      {renderStars(calculateAverageRating())}
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">
                      Based on {reviews.length} reviews
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Rating Distribution
                  </h3>
                  <div className="space-y-2">
                    {getRatingDistribution()
                      .reverse()
                      .map((count, reversedIndex) => {
                        const index = 4 - reversedIndex;
                        const percentage =
                          reviews.length > 0
                            ? Math.round((count / reviews.length) * 100)
                            : 0;
                        return (
                          <div key={index} className="flex items-center">
                            <div className="flex items-center w-16">
                              {index + 1} {index === 0 ? "star" : "stars"}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                              <div
                                className="bg-teal-500 h-2.5 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-gray-600 text-sm w-12 text-right">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

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
                        className="pl-10 p-2.5 border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150"
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
                              Status
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
                                  <div className="text-sm">
                                    {review.vendorReply ? (
                                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        Replied
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                        Awaiting Reply
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleViewReview(review)}
                                      className="px-3 py-1 text-teal-600 hover:text-teal-800 text-sm font-medium transition duration-150 cursor-pointer"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRespondToReview(review)
                                      }
                                      className="px-3 py-1 text-teal-600 hover:text-teal-800 text-sm font-medium transition duration-150 cursor-pointer flex items-center"
                                    >
                                      <MessageSquare className="w-4 h-4 mr-1" />
                                      {review.vendorReply
                                        ? "Edit Reply"
                                        : "Respond"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center">
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
                              {Math.min(
                                indexOfLastItem,
                                filteredReviews.length
                              )}
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
                              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-teal-50 text-sm font-medium text-teal-600 hover:bg-teal-100 transition duration-150 cursor-pointer">
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
                    )}
                  </>
                )}
              </div>
            </>
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
                  {selectedReview.vendorReply && (
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                      <p className="text-sm font-medium text-teal-700 mb-1">
                        Your Reply
                      </p>
                      <p className="text-base text-gray-800 whitespace-pre-line">
                        {selectedReview.vendorReply}
                      </p>
                    </div>
                  )}
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
                      onClick={() => {
                        setIsReviewModalOpen(false);
                        handleRespondToReview(selectedReview);
                      }}
                      className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer flex items-center justify-center"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      {selectedReview.vendorReply
                        ? "Edit Reply"
                        : "Respond to Review"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isReplyModalOpen && selectedReview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedReview.vendorReply
                      ? "Edit Your Reply"
                      : "Respond to Review"}
                  </h3>
                  <button
                    onClick={() => setIsReplyModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition duration-150"
                  >
                    <X className="w-6 h-6 cursor-pointer" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {renderStars(selectedReview.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({selectedReview.rating})
                        </span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600">
                        {selectedReview.user.name || "Anonymous User"}
                      </span>
                    </div>
                    <p className="text-gray-800">{selectedReview.reviewText}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 resize-none"
                      rows={6}
                    ></textarea>
                    <p className="mt-2 text-sm text-gray-500">
                      Your reply will be visible to all users viewing this
                      review.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsReplyModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReply}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Reply
                        </>
                      )}
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

export default VendorReviews;
