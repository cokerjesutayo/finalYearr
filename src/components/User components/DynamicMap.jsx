import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

import React, { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

const DynamicMap = ({ location }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const markerRef = useRef();

  const accessToken =
    "pk.eyJ1IjoiamVzdXRheW9jb2tlciIsImEiOiJjbTl4OWxvOXEwenczMnFzY2M4aGV6d2syIn0.nO9STHj9wYscjJ7zX1c6XA";

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    // Initialize empty map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0], // default center
      zoom: 2,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // Geocode location string
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location
          )}.json?access_token=${accessToken}`
        );
        const data = await response.json();
        const [lng, lat] = data.features[0].center;

        // Fly to new location
        mapRef.current.flyTo({ center: [lng, lat], zoom: 13 });

        // Add or update marker
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();

    return () => {
      mapRef.current.remove();
    };
  }, [location]);

  return <div ref={mapContainerRef} style={{ height: "450px" }}></div>;
};

export default DynamicMap;
