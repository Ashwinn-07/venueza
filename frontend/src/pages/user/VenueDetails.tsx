import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  IndianRupee,
  MessageCircle,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Image,
  Send,
  Reply,
} from "lucide-react";
import LocationPicker from "../../components/maps/LocationPicker";
import { useAuthStore } from "../../stores/authStore";
import { useAnimation } from "../../utils/animation";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { notifyError, notifySuccess } from "../../utils/notifications";

const VenueDetails = () => {
  const { id }: any = useParams();
  const { getUserVenue, getReviewsUser, createReview, user } = useAuthStore();
  const [venue, setVenue] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingVenue, setLoadingVenue] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [carousalRef] = useAnimation();
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [selectedImageNames, setSelectedImageNames] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(3);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoadingVenue(true);
        const response = await getUserVenue(id);
        setVenue(response.result?.venue);
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError("Failed to load venue details. Please try again later.");
      } finally {
        setLoadingVenue(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await getReviewsUser(id);
        setAllReviews(response.reviews || []);

        if (user && response.reviews) {
          const hasReviewed = response.reviews.some(
            (review: any) => review.user._id === user._id
          );
          setUserHasReviewed(hasReviewed);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) {
      fetchVenueData();
      fetchReviews();
    }
  }, [id, getUserVenue, getReviewsUser, user]);

  useEffect(() => {
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    setReviews(allReviews.slice(indexOfFirstReview, indexOfLastReview));
  }, [currentPage, reviewsPerPage, allReviews]);

  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const nextImage = () => {
    if (!venue || !venue.images || venue.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    if (!venue || !venue.images || venue.images.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + venue.images.length) % venue.images.length
    );
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleReviewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setReviewImages(files);
      setSelectedImageNames(files.map((file) => file.name));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;
    setIsSubmittingReview(true);
    try {
      const imageUrls = await Promise.all(
        reviewImages.map((file) => uploadImageToCloudinary(file))
      );
      await createReview(venue._id, rating, reviewText, imageUrls);
      notifySuccess("Review posted successfully!");
      const response = await getReviewsUser(id);
      setAllReviews(response.reviews || []);
      setUserHasReviewed(true);
      setRating(5);
      setReviewText("");
      setReviewImages([]);
      setSelectedImageNames([]);
    } catch (error: any) {
      console.error("Error posting review:", error);
      notifyError(error.message || "Failed to post review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loadingVenue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading venue details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Venue not found</div>
      </div>
    );
  }

  const averageRating = allReviews.length
    ? (
        allReviews.reduce((sum, review) => sum + review.rating, 0) /
        allReviews.length
      ).toFixed(1)
    : "No ratings";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {venue.images && venue.images.length > 0 ? (
            <>
              <div
                ref={carousalRef}
                className="relative rounded-lg overflow-hidden"
              >
                <img
                  key={currentImageIndex}
                  src={venue.images[currentImageIndex]}
                  alt={`Venue image ${currentImageIndex + 1}`}
                  className="w-full h-[400px] object-cover"
                />
                {venue.images.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                      <button
                        onClick={prevImage}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {venue.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {venue.images.length > 1 && (
                <div className="flex space-x-4">
                  {venue.images.map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden cursor-pointer ${
                        index === currentImageIndex
                          ? "ring-2 ring-[#F4A261]"
                          : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-24 h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center h-[400px]">
              <p className="text-gray-500">No images available</p>
            </div>
          )}

          <div className="rounded-lg overflow-hidden h-[300px]">
            {venue.location && venue.location.coordinates ? (
              <LocationPicker
                initialCoordinates={{
                  lat: venue.location.coordinates[1],
                  lng: venue.location.coordinates[0],
                }}
                initialAddress={venue.address}
                readOnly={true}
                height="300px"
              />
            ) : (
              <div className="h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Location not available</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  venue.status
                )}`}
              >
                {venue.status || "Status not available"}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2 text-[#F4A261]" />
              {venue.address || "Address not available"}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#F4A261]" />
                <span>Up to {venue.capacity || "N/A"} guests</span>
              </div>
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-[#F4A261]" />
                <span>{venue.price || "Price not available"}</span>
              </div>
            </div>
            {venue.services && venue.services.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.services.map((service: any) => (
                    <span
                      key={service}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => navigate(`/user/chat/${venue.vendor._id}`)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#F4A261] text-white rounded-md hover:bg-[#E76F51] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Vendor</span>
              </button>
              <button
                onClick={() => navigate(`/user/booking/${id}`)}
                disabled={venue.status === "closed"}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  venue.status === "closed"
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#2A9D8F] text-white hover:bg-[#264653]"
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Book Now</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-medium">{averageRating}</span>
                <span className="text-gray-500 ml-1">
                  ({allReviews.length})
                </span>
              </div>
            </div>

            {loadingReviews ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-t-[#F4A261] border-b-[#F4A261] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {review.user.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{review.reviewText}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.images.map((img: string, i: number) => (
                          <div key={i} className="relative group">
                            <img
                              src={img}
                              alt={`Review image ${i + 1}`}
                              className="w-20 h-20 object-cover rounded-md transition-transform group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {review.vendorReply && review.vendorReply.trim() !== "" && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <div className="flex items-center mb-2">
                          <Reply className="w-4 h-4 text-gray-400 mr-2" />
                          <h4 className="text-sm font-medium text-gray-800">
                            Vendor's Response
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm italic">
                          {review.vendorReply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center items-center space-x-2 pt-4">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md cursor-pointer ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-[#F4A261] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-600">No reviews yet.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Be the first to review this venue!
                </p>
              </div>
            )}

            {!userHasReviewed && (
              <form
                onSubmit={handleReviewSubmit}
                className="mt-8 space-y-5 border-t border-gray-200 pt-6"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  Share Your Experience
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this venue..."
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#F4A261] focus:border-transparent outline-none transition-all"
                    rows={4}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleReviewImageChange}
                      className="hidden"
                      id="review-images"
                      accept="image/*"
                    />
                    <label
                      htmlFor="review-images"
                      className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <Image className="w-6 h-6 mx-auto text-gray-400" />
                        <span className="mt-2 block text-sm">
                          {selectedImageNames.length > 0
                            ? `${selectedImageNames.length} image(s) selected`
                            : "Click to upload images"}
                        </span>
                      </div>
                    </label>
                  </div>
                  {selectedImageNames.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      {selectedImageNames.map((name, index) => (
                        <div key={index} className="truncate">
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewText.trim()}
                  className={`flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-md text-white transition-colors cursor-pointer ${
                    isSubmittingReview || !reviewText.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#F4A261] hover:bg-[#E76F51]"
                  }`}
                >
                  <Send className="w-5 h-5 cursor-pointer" />
                  <span className="cursor-pointer">
                    {isSubmittingReview ? "Posting Review..." : "Post Review"}
                  </span>
                </button>
              </form>
            )}

            {userHasReviewed && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      Thank you for your review!
                    </h3>
                    <p className="text-sm mt-1">
                      Your feedback helps others make better decisions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
