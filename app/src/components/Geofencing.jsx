import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, MapPin, Square, RotateCcw, Volume2, VolumeX, Settings, AlertTriangle, Clock, Target, Menu, X, Zap, Radar } from 'lucide-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const FenceMonitoring = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fencedAreas, setFencedAreas] = useState([]);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const audioContextRef = useRef(null);
  const buzzerRef = useRef(null);
  const lastAlertRef = useRef(null);
  const leafletLoadedRef = useRef(false);
  const mapLayersRef = useRef([]);
  const [proximitySettings, setProximitySettings] = useState({
    warningDistance: 100, // meters
    buzzerEnabled: true,
    alertCooldown: 10000, // 10 seconds
  });

  // Initialize Web Audio API for buzzer
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    };
    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Cleanup function
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (error) {
        console.warn('Error cleaning up map:', error);
      }
      mapInstanceRef.current = null;
    }
    setMap(null);
    setMapLoaded(false);
    mapLayersRef.current = [];
  }, []);

  // Load Leaflet and initialize map
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (leafletLoadedRef.current || !isMounted) return;

      if (typeof window !== 'undefined' && !window.L) {
        try {
          // Load CSS
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          leafletCSS.crossOrigin = '';
          document.head.appendChild(leafletCSS);

          // Load JS
          return new Promise((resolve, reject) => {
            const leafletJS = document.createElement('script');
            leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            leafletJS.crossOrigin = '';
            leafletJS.onload = () => {
              leafletLoadedRef.current = true;
              if (isMounted) {
                resolve();
                setTimeout(() => initializeMap(), 100);
              }
            };
            leafletJS.onerror = reject;
            document.head.appendChild(leafletJS);
          });
        } catch (error) {
          console.error('Error loading Leaflet:', error);
        }
      } else if (window.L && !leafletLoadedRef.current) {
        leafletLoadedRef.current = true;
        if (isMounted) {
          setTimeout(() => initializeMap(), 100);
        }
      }
    };

    loadLeaflet();
    loadFencedAreas();

    return () => {
      isMounted = false;
      cleanupMap();
    };
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.L || mapInstanceRef.current || !leafletLoadedRef.current) {
      return;
    }

    try {
      // Clear any existing content
      mapRef.current.innerHTML = '';
      
      const newMap = window.L.map(mapRef.current, {
        center: [28.4595, 77.0266],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(newMap);

      // Wait for map to be ready
      newMap.whenReady(() => {
        mapInstanceRef.current = newMap;
        setMap(newMap);
        setMapLoaded(true);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Load fenced areas from backend
  const loadFencedAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/authorities/fencing/areas`);
      if (response.ok) {
        const areas = await response.json();
        setFencedAreas(areas);
      }
    } catch (error) {
      console.error('Error loading fenced areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear existing layers
  const clearMapLayers = useCallback(() => {
    if (!map) return;
    
    mapLayersRef.current.forEach(layer => {
      try {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      } catch (error) {
        console.warn('Error removing layer:', error);
      }
    });
    mapLayersRef.current = [];
  }, [map]);

  // Display fenced areas on map
  useEffect(() => {
    if (!map || !mapLoaded || !fencedAreas.length || !window.L) return;

    try {
      // Clear existing fence layers
      clearMapLayers();

      // Add fenced areas
      fencedAreas.forEach(area => {
        try {
          if (!area.latitude || !area.longitude || !area.radius) return;

          // Add fence circle
          const circle = window.L.circle([area.latitude, area.longitude], {
            color: area.status === 'active' ? '#dc2626' : '#6b7280',
            fillColor: area.status === 'active' ? '#fca5a5' : '#d1d5db',
            fillOpacity: 0.3,
            radius: area.radius,
            weight: 2
          });

          // Add warning zone circle
          const warningCircle = window.L.circle([area.latitude, area.longitude], {
            color: '#f59e0b',
            fillColor: '#fde68a',
            fillOpacity: 0.1,
            radius: area.radius + proximitySettings.warningDistance,
            weight: 1,
            dashArray: '5, 5'
          });

          // Add center marker
          const marker = window.L.marker([area.latitude, area.longitude], {
            icon: window.L.divIcon({
              className: 'fence-marker',
              html: `<div style="background: ${area.status === 'active' ? '#dc2626' : '#6b7280'}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${area.status === 'active' ? '⚠️' : '🚫'}</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          });

          // Bind popup
          const popupContent = `
            <div style="color: #1f2937; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${area.description || 'Fenced Area'}</h3>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${area.status}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Radius:</strong> ${area.radius}m</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Warning Zone:</strong> ${area.radius + proximitySettings.warningDistance}m</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Created:</strong> ${new Date(area.createdAt).toLocaleDateString()}</p>
              ${area.metadata?.priority ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Priority:</strong> ${area.metadata.priority}</p>` : ''}
            </div>
          `;
          
          circle.bindPopup(popupContent);
          marker.bindPopup(popupContent);

          // Add to map and track layers
          circle.addTo(map);
          warningCircle.addTo(map);
          marker.addTo(map);
          
          mapLayersRef.current.push(circle, warningCircle, marker);

        } catch (error) {
          console.error('Error adding area to map:', error);
        }
      });

      // Re-add current location marker if exists
      if (currentLocation && currentMarker) {
        try {
          if (!map.hasLayer(currentMarker)) {
            currentMarker.addTo(map);
          }
        } catch (error) {
          console.warn('Error re-adding current marker:', error);
        }
      }

    } catch (error) {
      console.error('Error displaying fenced areas:', error);
    }
  }, [map, mapLoaded, fencedAreas, proximitySettings.warningDistance, clearMapLayers]);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Generate buzzer sound
  const playBuzzer = (type = 'warning') => {
    if (!proximitySettings.buzzerEnabled || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      if (type === 'inside') {
        // High-pitched continuous beep for inside fence
        oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
        
        // Second beep
        setTimeout(() => {
          try {
            const osc2 = audioContextRef.current.createOscillator();
            const gain2 = audioContextRef.current.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContextRef.current.destination);
            osc2.frequency.setValueAtTime(1200, audioContextRef.current.currentTime);
            gain2.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
            osc2.start();
            osc2.stop(audioContextRef.current.currentTime + 0.3);
          } catch (error) {
            console.warn('Error playing second beep:', error);
          }
        }, 600);
      } else {
        // Lower-pitched single beep for proximity warning
        oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.3);
      }
    } catch (error) {
      console.warn('Error playing buzzer:', error);
    }
  };

  // Check proximity to fenced areas
  const checkProximity = useCallback((userLat, userLng) => {
    if (!fencedAreas.length) return;

    const now = Date.now();
    let alerts = [];

    fencedAreas.forEach(area => {
      if (area.status !== 'active') return;

      const distance = calculateDistance(userLat, userLng, area.latitude, area.longitude);
      const fenceRadius = area.radius;
      const warningRadius = fenceRadius + proximitySettings.warningDistance;

      let alertType = null;
      let alertMessage = '';

      if (distance <= fenceRadius) {
        alertType = 'inside';
        alertMessage = `⚠️ ALERT: You are inside the fenced area "${area.description || 'Unknown Area'}"`;
      } else if (distance <= warningRadius) {
        alertType = 'nearby';
        alertMessage = `⚠️ WARNING: Approaching fenced area "${area.description || 'Unknown Area'}" (${Math.round(distance - fenceRadius)}m away)`;
      }

      if (alertType) {
        const alertKey = `${area._id}-${alertType}`;
        
        // Check cooldown
        if (!lastAlertRef.current || !lastAlertRef.current[alertKey] || 
            (now - lastAlertRef.current[alertKey]) > proximitySettings.alertCooldown) {
          
          alerts.push({
            id: Date.now() + Math.random(),
            type: alertType,
            area: area,
            distance: Math.round(distance),
            message: alertMessage,
            timestamp: now
          });

          // Update last alert time
          if (!lastAlertRef.current) lastAlertRef.current = {};
          lastAlertRef.current[alertKey] = now;

          // Play buzzer
          playBuzzer(alertType);
        }
      }
    });

    if (alerts.length > 0) {
      setAlertHistory(prev => [...alerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    }
  }, [fencedAreas, proximitySettings]);

  // Update current location
  const updateCurrentLocation = useCallback((position) => {
    if (!map || !mapLoaded) return;

    const { latitude, longitude, accuracy } = position.coords;
    const newLocation = { lat: latitude, lng: longitude, accuracy };
    
    setCurrentLocation(newLocation);

    try {
      // Remove existing user location marker
      if (currentMarker) {
        if (map.hasLayer(currentMarker)) {
          map.removeLayer(currentMarker);
        }
      }

      // Add new user location marker
      const marker = window.L.marker([latitude, longitude], {
        icon: window.L.divIcon({
          className: 'user-location-marker',
          html: `
            <div style="position: relative; width: 20px; height: 20px;">
              <div style="position: absolute; top: 0; left: 0; width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; opacity: 0.3; animation: pulse 2s ease-in-out infinite;"></div>
              <div style="position: absolute; top: 4px; left: 4px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      });

      marker.addTo(map);
      setCurrentMarker(marker);

      // Add accuracy circle
      const accuracyCircle = window.L.circle([latitude, longitude], {
        color: '#3b82f6',
        fillColor: '#bfdbfe',
        fillOpacity: 0.2,
        radius: accuracy,
        weight: 1
      });

      accuracyCircle.addTo(map);

      // Bind popup
      marker.bindPopup(`
        <div style="color: #1f2937; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">📍 Your Location</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Accuracy:</strong> ±${Math.round(accuracy)}m</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}</p>
        </div>
      `);

      // Center map on user location on first load
      if (!isLocationEnabled) {
        map.setView([latitude, longitude], 15);
        setIsLocationEnabled(true);
      }

      // Check proximity to fenced areas
      checkProximity(latitude, longitude);

    } catch (error) {
      console.error('Error updating current location:', error);
    }
  }, [map, mapLoaded, currentMarker, isLocationEnabled, checkProximity]);

  // Handle location errors
  const handleLocationError = (error) => {
    console.error('Location error:', error);
    let errorMessage = 'Unable to get your location. ';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += 'Please allow location access to use this feature.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage += 'Location request timed out.';
        break;
      default:
        errorMessage += 'An unknown error occurred.';
        break;
    }
    
    alert(errorMessage);
  };

  // Start location tracking
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // 30 seconds
    };

    const id = navigator.geolocation.watchPosition(
      updateCurrentLocation,
      handleLocationError,
      options
    );

    setWatchId(id);
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsLocationEnabled(false);
      
      if (currentMarker && map) {
        try {
          if (map.hasLayer(currentMarker)) {
            map.removeLayer(currentMarker);
          }
        } catch (error) {
          console.warn('Error removing current marker:', error);
        }
        setCurrentMarker(null);
      }
      
      setCurrentLocation(null);
    }
  };

  // Clear alert history
  const clearAlerts = () => {
    setAlertHistory([]);
    lastAlertRef.current = {};
  };

  // Get location status
  const getLocationStatus = () => {
    if (!isLocationEnabled) return 'Disabled';
    if (!currentLocation) return 'Searching...';
    return `Active (±${Math.round(currentLocation.accuracy)}m)`;
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
      </div>
      
      {/* Dynamic background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden relative z-50 bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Fence Monitor
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar - Responsive */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative z-40 w-80 xl:w-96 h-full bg-slate-800/30 backdrop-blur-xl border-r border-slate-700/50 overflow-y-auto`}>
          
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Fence Monitor
                </h1>
                <p className="text-slate-400 text-sm">Real-time surveillance</p>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6 space-y-6">
            {/* Enhanced Status Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Location Status */}
              <div className="group bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 hover:border-cyan-400/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    isLocationEnabled 
                      ? 'bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-400 shadow-emerald-500/20' 
                      : 'bg-gradient-to-br from-slate-500/20 to-slate-600/20 text-slate-400'
                  } shadow-lg`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300">Location Status</p>
                    <p className={`text-sm font-bold ${isLocationEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {getLocationStatus()}
                    </p>
                  </div>
                  {isLocationEnabled && (
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              {/* Fenced Areas */}
              <div className="group bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 hover:border-blue-400/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 text-blue-400 shadow-lg shadow-blue-500/20">
                    <Radar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300">Monitored Areas</p>
                    <p className="text-sm font-bold text-blue-400">{fencedAreas.length} zones</p>
                  </div>
                  <div className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                    {fencedAreas.filter(a => a.status === 'active').length} active
                  </div>
                </div>
              </div>

              {/* Alert Status */}
              <div className="group bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 hover:border-red-400/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-600/20 text-red-400 shadow-lg shadow-red-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300">Active Alerts</p>
                    <p className="text-sm font-bold text-red-400">
                      {alertHistory.filter(a => Date.now() - a.timestamp < 60000).length}
                    </p>
                  </div>
                  {alertHistory.filter(a => Date.now() - a.timestamp < 60000).length > 0 && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-100"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={startLocationTracking}
                disabled={isLocationEnabled || !mapLoaded}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isLocationEnabled 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl shadow-cyan-500/25'
                }`}
              >
                <Zap className="w-5 h-5" />
                {isLocationEnabled ? 'Location Active' : 'Start Tracking'}
              </button>
              
              <button
                onClick={stopLocationTracking}
                disabled={!isLocationEnabled}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Square className="w-5 h-5" />
                Stop Tracking
              </button>
              
              <button
                onClick={loadFencedAreas}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
              >
                <RotateCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh Areas'}
              </button>
            </div>

            {/* Enhanced Settings Panel */}
            <div className="bg-slate-700/20 backdrop-blur-sm border border-slate-600/30 rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-600/30">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-200">Configuration</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Warning Distance
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      value={proximitySettings.warningDistance}
                      onChange={(e) => setProximitySettings(prev => ({
                        ...prev,
                        warningDistance: parseInt(e.target.value) || 100
                      }))}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>10m</span>
                      <span className="font-semibold text-cyan-400">{proximitySettings.warningDistance}m</span>
                      <span>1km</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {proximitySettings.buzzerEnabled ? (
                      <Volume2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-400" />
                    )}
                    <span className="text-sm font-medium text-slate-300">Alert Sounds</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proximitySettings.buzzerEnabled}
                      onChange={(e) => setProximitySettings(prev => ({
                        ...prev,
                        buzzerEnabled: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-300/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Alert History */}
            {alertHistory.length > 0 && (
              <div className="bg-slate-700/20 backdrop-blur-sm border border-slate-600/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-slate-200">Recent Alerts</h3>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                      {alertHistory.length}
                    </span>
                  </div>
                  <button 
                    onClick={clearAlerts} 
                    className="text-xs bg-slate-600/50 hover:bg-slate-500/50 px-3 py-1 rounded-lg text-slate-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {alertHistory.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 transition-all duration-300 ${
                        alert.type === 'inside' 
                          ? 'bg-red-500/10 border-red-500 shadow-red-500/20' 
                          : 'bg-yellow-500/10 border-yellow-500 shadow-yellow-500/20'
                      } shadow-sm`}
                    >
                      <div className="space-y-2">
                        <p className={`text-sm font-medium ${alert.type === 'inside' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {alert.area.description || 'Fenced Area'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {alert.distance}m
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Details */}
            {currentLocation && (
              <div className="bg-slate-700/20 backdrop-blur-sm border border-slate-600/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-slate-200">Location Data</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400">Latitude</span>
                      <p className="font-mono text-white text-xs">{currentLocation.lat.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Longitude</span>
                      <p className="font-mono text-white text-xs">{currentLocation.lng.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Accuracy</span>
                      <p className="text-white">±{Math.round(currentLocation.accuracy)}m</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Updated</span>
                      <p className="text-white">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <div ref={mapRef} className="w-full h-full" />
              
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-2 border-blue-500/20 border-r-blue-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <p className="text-slate-300 font-medium">Loading Map Interface...</p>
                    <p className="text-slate-500 text-sm mt-1">Initializing surveillance system</p>
                  </div>
                </div>
              )}
              
              {/* Enhanced Map Legend */}
              {mapLoaded && (
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl max-w-xs">
                  <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    Map Legend
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-30"></div>
                      </div>
                      <span className="text-slate-300">Critical Zone</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-60 border-dashed border-2 border-yellow-500"></div>
                      <span className="text-slate-300">Warning Zone</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-500 animate-pulse opacity-50"></div>
                      </div>
                      <span className="text-slate-300">Your Position</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-slate-500"></div>
                      <span className="text-slate-300">Inactive Zone</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats Overlay */}
              <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:w-80">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">{fencedAreas.length}</div>
                      <div className="text-xs text-slate-400">Total Areas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">{fencedAreas.filter(a => a.status === 'active').length}</div>
                      <div className="text-xs text-slate-400">Active</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">
                        {alertHistory.filter(a => Date.now() - a.timestamp < 60000).length}
                      </div>
                      <div className="text-xs text-slate-400">Live Alerts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(15px) rotate(-90deg);
          }
          66% {
            transform: translateY(-10px) rotate(-180deg);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default FenceMonitoring;