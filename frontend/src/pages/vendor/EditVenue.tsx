import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationPicker from "../../components/maps/LocationPicker";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const EditVenue = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVenue, updateVenue } = useAuthStore();

  const availableServices = [
    "Catering",
    "Decoration",
    "Photography",
    "Sound",
    "Lighting",
    "Security",
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pricing: "",
    capacity: "",
    status: "open",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [coordinates, setCoordinates] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);

  const [existingImages, setExistingImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [existingDocuments, setExistingDocuments] = useState<
    { id: string; name: string; url: string }[]
  >([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) return;

      try {
        const venueData = await getVenue(id);

        if (venueData) {
          setFormData({
            name: venueData.name || "",
            address: venueData.address || "",
            pricing: venueData.price?.toString() || "",
            capacity: venueData.capacity?.toString() || "",
            status: venueData.status || "open",
          });

          if (venueData.services && Array.isArray(venueData.services)) {
            setSelectedServices(venueData.services);
          }

          if (venueData.location?.coordinates) {
            setCoordinates({
              lat: venueData.location.coordinates[1],
              lng: venueData.location.coordinates[0],
            });
          }

          if (venueData.images && venueData.images.length > 0) {
            setExistingImages(
              venueData.images.map((url: string, index: number) => ({
                id: `img-${index}`,
                url,
              }))
            );
          }

          if (venueData.documents && venueData.documents.length > 0) {
            setExistingDocuments(
              venueData.documents.map((url: string, index: number) => {
                const filename =
                  url.split("/").pop() || `Document ${index + 1}`;
                return {
                  id: `doc-${index}`,
                  name: filename,
                  url,
                };
              })
            );
          }
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        notifyError("Failed to load venue data");
      }
    };

    fetchVenueData();
  }, [id, getVenue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setDocuments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });

    setImagePreviews((prev) => {
      const newArr = [...prev];
      URL.revokeObjectURL(newArr[index]);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const removeExistingImage = (id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const removeExistingDocument = (id: string) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleLocationChange = (
    coords: { lat: number; lng: number },
    address: string
  ) => {
    setCoordinates(coords);
    setFormData((prev) => ({ ...prev, address }));
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      notifyError("Venue ID is missing");
      return;
    }

    try {
      const newImageUrls = await Promise.all(
        images.map(async (file) => await uploadImageToCloudinary(file))
      );

      const newDocumentUrls = await Promise.all(
        documents.map(async (file) => await uploadImageToCloudinary(file))
      );

      const allImageUrls = [
        ...existingImages.map((img) => img.url),
        ...newImageUrls,
      ];

      const allDocumentUrls = [
        ...existingDocuments.map((doc) => doc.url),
        ...newDocumentUrls,
      ];

      const venueData = {
        id,
        name: formData.name,
        address: formData.address,
        services: selectedServices,
        price: Number(formData.pricing),
        capacity: Number(formData.capacity),
        location: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
        status: formData.status,
        images: allImageUrls,
        documents: allDocumentUrls,
      };

      await updateVenue(id, venueData);
      notifySuccess("Venue updated successfully!");

      navigate("/vendor/venues");
    } catch (error: any) {
      console.error("Failed to update venue:", error);
      notifyError(error.message || "Failed to update venue. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Venue</h1>
        <button
          onClick={() => navigate("/vendor/venues")}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <LocationPicker
            initialCoordinates={coordinates}
            initialAddress={formData.address}
            onChange={handleLocationChange}
            height="300px"
          />
          <div className="text-xs text-gray-500 mt-1">
            Coordinates: {coordinates.lat.toFixed(6)},{" "}
            {coordinates.lng.toFixed(6)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Images
          </label>

          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Existing Images:</p>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.url}
                      alt="Venue"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => removeExistingImage(img.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 mx-auto mb-1 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload additional venue images
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, or GIF (max. 5MB each)
              </p>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={() => removeImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Documents
          </label>

          {existingDocuments.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Existing Documents:</p>
              <div className="space-y-2">
                {existingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 mr-2 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                      <span className="text-sm truncate max-w-xs">
                        {doc.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeExistingDocument(doc.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDocumentUpload}
              className="hidden"
              id="document-upload"
            />
            <label htmlFor="document-upload" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 mx-auto mb-1 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload additional venue documents
              </p>
              <p className="text-xs text-gray-400">PDF, DOC, or IMAGES</p>
            </label>
          </div>

          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-2 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <span className="text-sm truncate max-w-xs">
                      {doc.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeDocument(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pricing (₹)
            </label>
            <input
              type="number"
              name="pricing"
              value={formData.pricing}
              onChange={(e) =>
                setFormData({ ...formData, pricing: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Services
          </label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableServices.map((service) => (
              <div key={service} className="flex items-center">
                <input
                  type="checkbox"
                  id={`service-${service}`}
                  checked={selectedServices.includes(service)}
                  onChange={() => toggleService(service)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor={`service-${service}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Update Venue
        </button>
      </form>
    </div>
  );
};

export default EditVenue;
