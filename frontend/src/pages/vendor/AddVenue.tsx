import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../components/maps/LocationPicker";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { validateVenueForm } from "../../utils/validateVenueForm";

const AddVenue = () => {
  const navigate = useNavigate();
  const { createVenue } = useAuthStore();

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
    status: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [coordinates, setCoordinates] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      if (errors.images) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setDocuments((prev) => [...prev, ...Array.from(files)]);

    if (errors.documents) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.documents;
        return newErrors;
      });
    }
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

  const removeDocument = (index: number) => {
    setDocuments((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const handleLocationChange = (
    coords: { lat: number; lng: number },
    address: string
  ) => {
    setCoordinates(coords);
    setFormData((prev) => ({ ...prev, address }));

    if (errors.address) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.address;
        return newErrors;
      });
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service);
      } else {
        const newServices = [...prev, service];

        if (newServices.length > 0 && errors.services) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.services;
            return newErrors;
          });
        }

        return newServices;
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateVenueForm(
      formData,
      images,
      [],
      documents,
      [],
      selectedServices
    );

    if (!validation.isValid) {
      setErrors(validation.errors);

      window.scrollTo(0, 0);
      return;
    }

    try {
      const imageUrls = await Promise.all(
        images.map(async (file) => await uploadImageToCloudinary(file))
      );

      const documentUrls = await Promise.all(
        documents.map(async (file) => await uploadImageToCloudinary(file))
      );

      const venueData = {
        name: formData.name,
        address: formData.address,
        services: selectedServices,
        price: Number(formData.pricing),
        capacity: Number(formData.capacity),
        location: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
        status: "closed",
        images: imageUrls,
        documents: documentUrls,
      };

      await createVenue(venueData);
      notifySuccess("Venue created successfully!");

      navigate("/vendor/venues");
    } catch (error: any) {
      console.error("Failed to create venue:", error);
      notifyError("Failed to create venue. Please try again.");
    }
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Venue</h1>
        <button
          onClick={() => navigate("/vendor/venues")}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          Please fix the errors below before submitting.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.name ? "border-red-300" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
          />
          {renderError("name")}
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
          {renderError("address")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Images
          </label>
          <div
            className={`border-2 border-dashed ${
              errors.images ? "border-red-300" : "border-gray-300"
            } rounded-lg p-4 text-center`}
          >
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
                Click to upload venue images
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, or GIF</p>
            </label>
          </div>
          {renderError("images")}
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
          <div
            className={`border-2 border-dashed ${
              errors.documents ? "border-red-300" : "border-gray-300"
            } rounded-lg p-4 text-center`}
          >
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
                Click to upload venue documents
              </p>
              <p className="text-xs text-gray-400">PDF, DOC, or IMAGES</p>
            </label>
          </div>
          {renderError("documents")}
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
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.pricing ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.pricing ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {renderError("pricing")}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.capacity ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.capacity ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {renderError("capacity")}
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
                  className={`h-4 w-4 ${
                    errors.services ? "text-red-600" : "text-blue-600"
                  } border-gray-300 rounded focus:ring-blue-500 cursor-pointer`}
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
          {renderError("services")}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Venue
        </button>
      </form>
    </div>
  );
};

export default AddVenue;
