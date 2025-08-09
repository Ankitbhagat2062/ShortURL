import React, { useEffect, useRef } from "react";

const MapWithAdvancedMarker = ({ lat, lng, apiKey }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  useEffect(() => {
    if (!lat || !lng || !apiKey) {
      console.log("Missing lat, lng, or API key");
      return;
    }

    if (!window.google) {
      console.log("Loading Google Maps script...");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps script loaded");
        initMap();
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps script");
      };
      document.head.appendChild(script);
    } else {
      console.log("Google Maps already loaded");
      initMap();
    }

    function initMap() {
      const location = { lat: Number(lat), lng: Number(lng) };
      console.log("Initializing map at", location);

      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 12,
        });
      } else {
        mapInstance.current.setCenter(location);
      }

      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }

      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        markerInstance.current = new window.google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: mapInstance.current,
        });
        console.log("AdvancedMarkerElement created");
      } else {
        console.warn("AdvancedMarkerElement not available, falling back to Marker");
        markerInstance.current = new window.google.maps.Marker({
          position: location,
          map: mapInstance.current,
        });
      }
    }
  }, [lat, lng, apiKey]);

  return (
    <div
      ref={mapRef}
      style={{ width: "300px", height: "200px", border: "1px solid black" }}
    />
  );
};

export default MapWithAdvancedMarker;
