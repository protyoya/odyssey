// pages/fence-marking.js or app/fence-marking/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import {
  Menu,
  Search,
  MapPin,
  Shield,
  RotateCcw,
  Plus,
  Target,
  Calendar,
  Map,
  BarChart3,
  Lightbulb,
  Loader2,
  Navigation,
  Crosshair,
  Zap,
  Eye,
} from "lucide-react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function FenceMarking() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [fencedAreas, setFencedAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCircle, setCurrentCircle] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        const leafletCSS = document.createElement("link");
        leafletCSS.rel = "stylesheet";
        leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(leafletCSS);

        const leafletJS = document.createElement("script");
        leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        leafletJS.onload = initializeMap;
        document.head.appendChild(leafletJS);
      } else if (window.L) {
        initializeMap();
      }
    };

    loadLeaflet();
    loadFencedAreas();
  }, []);

  const initializeMap = () => {
    if (mapRef.current && window.L && !map) {
      const newMap = window.L.map(mapRef.current).setView(
        [28.4595, 77.0266],
        10
      ); // Default to Gurugram

      // Dark theme tiles
      window.L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(newMap);

      // Add click handler for manual location selection
      newMap.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        updateMapMarker(newMap, lat, lng);
      });

      setMap(newMap);
    }
  };

  const updateMapMarker = (mapInstance, lat, lng) => {
    // Remove existing circle
    if (currentCircle) {
      mapInstance.removeLayer(currentCircle);
    }

    // Add new marker and circle with enhanced styling
    const customIcon = window.L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 24px; 
        height: 24px; 
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
        animation: pulse 2s infinite;
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(
      mapInstance
    );
    const circle = window.L.circle([lat, lng], {
      color: "#ff6b6b",
      fillColor: "#ff6b6b",
      fillOpacity: 0.2,
      weight: 2,
      radius: radius,
      dashArray: "10, 10",
    }).addTo(mapInstance);

    setCurrentCircle(circle);
    mapInstance.setView([lat, lng], 14);
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        setSelectedLocation({ lat: latitude, lng: longitude });
        if (map) {
          updateMapMarker(map, latitude, longitude);
        }
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location");
    } finally {
      setIsLoading(false);
    }
  };

  const markFencedArea = async () => {
    if (!selectedLocation) {
      alert("Please select a location first");
      return;
    }

    setIsLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const response = await fetch(
        `${backendUrl}/api/authorities/fencing/mark-area`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            radius: radius,
            description:
              searchQuery ||
              `Fenced area at ${selectedLocation.lat.toFixed(
                6
              )}, ${selectedLocation.lng.toFixed(6)}`,
          }),
        }
      );

      if (response.ok) {
        const newArea = await response.json();
        setFencedAreas([...fencedAreas, newArea]);
        alert("Area marked successfully!");

        // Reset selection
        setSelectedLocation(null);
        setSearchQuery("");
        if (currentCircle && map) {
          map.removeLayer(currentCircle);
          setCurrentCircle(null);
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error marking area:", error);
      alert("Error marking fenced area");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFencedAreas = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const response = await fetch(
        `${backendUrl}/api/authorities/fencing/areas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const areas = await response.json();
        setFencedAreas(areas);

        // Display existing fenced areas on map with enhanced styling
        if (map && areas.length > 0) {
          areas.forEach((area) => {
            window.L.circle([area.latitude, area.longitude], {
              color: "#4facfe",
              fillColor: "#4facfe",
              fillOpacity: 0.15,
              weight: 2,
              radius: area.radius,
            }).addTo(map).bindPopup(`
              <div style="background: #1a1a1a; color: white; padding: 12px; border-radius: 8px; font-family: Inter, sans-serif;">
                <h3 style="color: #4facfe; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.91 11.7c-1.39-2.3-4.18-3.7-8.91-3.7s-7.52 1.4-8.91 3.7a1.1 1.1 0 0 0 0 1.2c1.39 2.3 4.18 3.7 8.91 3.7s7.52-1.4 8.91-3.7a1.1 1.1 0 0 0 0-1.2z"/><circle cx="12" cy="12" r="2"/></svg>
                  Fenced Area
                </h3>
                <p style="margin: 4px 0; font-size: 12px;">${
                  area.description
                }</p>
                <p style="margin: 4px 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8"/><path d="M8 8l8 8"/></svg>
                  Radius: ${area.radius}m
                </p>
                <p style="margin: 4px 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  ${new Date(area.createdAt).toLocaleDateString()}
                </p>
              </div>
            `);
          });
        }
      }
    } catch (error) {
      console.error("Error loading fenced areas:", error);
    }
  };

  // Re-display fenced areas when map is loaded
  useEffect(() => {
    if (map && fencedAreas.length > 0) {
      fencedAreas.forEach((area) => {
        window.L.circle([area.latitude, area.longitude], {
          color: "#4facfe",
          fillColor: "#4facfe",
          fillOpacity: 0.15,
          weight: 2,
          radius: area.radius,
        }).addTo(map).bindPopup(`
          <div style="background: #1a1a1a; color: white; padding: 12px; border-radius: 8px; font-family: Inter, sans-serif;">
            <h3 style="color: #4facfe; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.91 11.7c-1.39-2.3-4.18-3.7-8.91-3.7s-7.52 1.4-8.91 3.7a1.1 1.1 0 0 0 0 1.2c1.39 2.3 4.18 3.7 8.91 3.7s7.52-1.4 8.91-3.7a1.1 1.1 0 0 0 0-1.2z"/><circle cx="12" cy="12" r="2"/></svg>
              Fenced Area
            </h3>
            <p style="margin: 4px 0; font-size: 12px;">${area.description}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8"/><path d="M8 8l8 8"/></svg>
              Radius: ${area.radius}m
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              ${new Date(area.createdAt).toLocaleDateString()}
            </p>
          </div>
        `);
      });
    }
  }, [map, fencedAreas]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Fence Area Marking</title>
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

          * {
            font-family: "Inter", sans-serif;
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }

          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .sidebar-animate {
            animation: slideIn 0.3s ease-out;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .gradient-border {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1px;
            border-radius: 12px;
          }

          .gradient-border > div {
            background: #1f2937;
            border-radius: 11px;
          }
        `}</style>
      </Head>

      <div className="bg-black mh-20 h-20 text-white"></div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-96" : "w-0"
          } transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden sidebar-animate`}
        >
          <div className="p-6 space-y-6">
            {/* Search Section */}
            <div className="gradient-border">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  Location Search
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Search Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter address or coordinates..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        onKeyPress={(e) =>
                          e.key === "Enter" && searchLocation()
                        }
                      />
                      <div className="absolute right-3 top-3">
                        <Navigation className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fence Radius
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="50"
                        max="5000"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #4facfe 0%, #4facfe ${
                            ((radius - 50) / 4950) * 100
                          }%, #374151 ${
                            ((radius - 50) / 4950) * 100
                          }%, #374151 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>50m</span>
                        <span className="text-cyan-400 font-semibold">
                          {radius}m
                        </span>
                        <span>5km</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={searchLocation}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Location
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Location */}
            {selectedLocation && (
              <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 border border-green-700/50 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Location Selected
                </h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedLocation.lat.toFixed(6)},{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                  <p className="text-gray-300 flex items-center gap-2">
                    <Crosshair className="w-4 h-4" />
                    Radius: {radius} meters
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={markFencedArea}
                disabled={!selectedLocation || isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Marking Area...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Mark Fenced Area
                  </>
                )}
              </button>

              <button
                onClick={loadFencedAreas}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reload Areas
              </button>
            </div>

            {/* Instructions */}
            <div className="glass-effect rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Quick Guide
              </h3>
              <ul className="text-xs text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                  Search or click map to select location
                </li>
                <li className="flex items-start gap-2">
                  <Crosshair className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                  Adjust radius with slider
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                  Mark area to save to database
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                  Red = current, Blue = saved
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />

            {/* Floating Stats */}
            <div className="absolute top-4 right-4 glass-effect rounded-lg p-4 min-w-48">
              <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistics
              </h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Areas:</span>
                  <span className="text-white font-semibold">
                    {fencedAreas.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Coverage:</span>
                  <span className="text-white font-semibold">
                    {(
                      fencedAreas.reduce(
                        (acc, area) => acc + Math.PI * Math.pow(area.radius, 2),
                        0
                      ) / 1000000
                    ).toFixed(1)}
                    km²
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel - Fenced Areas List */}
          {fencedAreas.length > 0 && (
            <div className="h-64 bg-gray-800 border-t border-gray-700 overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Active Fenced Areas ({fencedAreas.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {fencedAreas.map((area, index) => (
                    <div
                      key={area._id || index}
                      className="glass-effect rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <h4 className="font-medium text-white mb-2 truncate">
                        {area.description}
                      </h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">
                            {area.latitude.toFixed(4)},{" "}
                            {area.longitude.toFixed(4)}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Crosshair className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {area.radius}m radius
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          {new Date(area.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
