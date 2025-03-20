export const validateVenueForm = (
  formData: {
    name: string;
    address: string;
    pricing: string;
    capacity: string;
  },
  images: File[],
  existingImages: { id: string; url: string }[] = [],
  documents: File[],
  existingDocuments: { id: string; name: string; url: string }[] = [],
  selectedServices: string[]
) => {
  const errors: { [key: string]: string } = {};

  if (!formData.name) {
    errors.name = "Venue name is required";
  } else if (formData.name.length < 3) {
    errors.name = "Venue name must be at least 3 characters";
  }

  if (!formData.address) {
    errors.address = "Address is required";
  }

  if (!formData.pricing) {
    errors.pricing = "Price is required";
  } else if (Number(formData.pricing) <= 0) {
    errors.pricing = "Price must be a positive number";
  }

  if (!formData.capacity) {
    errors.capacity = "Capacity is required";
  } else if (!/^\d+$/.test(formData.capacity)) {
    errors.capacity = "Capacity must be a whole number";
  } else if (Number(formData.capacity) <= 0) {
    errors.capacity = "Capacity must be a positive number";
  }

  if (images.length === 0 && existingImages.length === 0) {
    errors.images = "At least one venue image is required";
  }

  if (documents.length === 0 && existingDocuments.length === 0) {
    errors.documents = "At least one venue document is required";
  }

  if (selectedServices.length === 0) {
    errors.services = "At least one service must be selected";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
