import React, { useState, useCallback, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  initialCoordinates: { lat: number; lng: number };
  initialAddress?: string;
  onChange: (
    coordinates: { lat: number; lng: number },
    address: string
  ) => void;
  height?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialCoordinates,
  initialAddress = "",
  onChange,
  height = "300px",
}) => {
  const [coordinates, setCoordinates] =
    useState<LocationData>(initialCoordinates);
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setCoordinates(initialCoordinates);
    setAddress(initialAddress);
  }, [initialCoordinates, initialAddress]);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "";
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return "";
    }
  };

  const handleMapClick = useCallback(
    async (e: L.LeafletMouseEvent) => {
      const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      const newAddress = await reverseGeocode(newCoords.lat, newCoords.lng);
      setCoordinates({ ...newCoords, address: newAddress });
      setAddress(newAddress);
      onChange(newCoords, newAddress);
    },
    [onChange]
  );

  const searchAddress = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=jsonv2`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const newCoords = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        };
        const newAddress = result.display_name;
        setCoordinates({ ...newCoords, address: newAddress });
        setAddress(newAddress);
        onChange(newCoords, newAddress);
        if (mapRef.current) {
          mapRef.current.setView(newCoords, 13);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const MapClickHandler = () => {
    const map = useMap();
    mapRef.current = map;
    map.on("click", handleMapClick);
    return null;
  };

  const markerIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchAddress}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ height }}>
        <MapContainer
          center={coordinates}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          <Marker position={coordinates} icon={markerIcon} />
        </MapContainer>
      </div>

      <div className="text-xs text-gray-500">
        Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
      </div>
      {address && (
        <div className="text-xs text-gray-500">Address: {address}</div>
      )}
    </div>
  );
};

export default LocationPicker;
