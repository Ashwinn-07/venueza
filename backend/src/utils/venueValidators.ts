export const validateVenueData = (data: any): string[] => {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.push("Venue name is required.");
  }
  if (
    !data.address ||
    typeof data.address !== "string" ||
    data.address.trim().length === 0
  ) {
    errors.push("Address is required.");
  }
  if (
    !data.location ||
    data.location.type !== "Point" ||
    !Array.isArray(data.location.coordinates) ||
    data.location.coordinates.length !== 2
  ) {
    errors.push("Valid location is required");
  } else {
    const [lng, lat] = data.location.coordinates;
    if (typeof lng !== "number" || typeof lat !== "number") {
      errors.push("Coordinates must be numbers.");
    }
    if (lat < -90 || lat > 90) {
      errors.push("Latitude must be between -90 and 90.");
    }
    if (lng < -180 || lng > 180) {
      errors.push("Longitude must be between -180 and 180.");
    }
  }
  if (
    !data.capacity ||
    typeof data.capacity !== "number" ||
    data.capacity <= 0
  ) {
    errors.push("Capacity must be a positive number.");
  }
  if (data.price == null || typeof data.price !== "number" || data.price < 0) {
    errors.push("Price must be a non-negative number.");
  }

  return errors;
};
