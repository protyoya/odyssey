import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Phone, Globe, Navigation } from 'lucide-react';

const PlacesFinder = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [places, setPlaces] = useState({
    restaurants: [],
    hotels: [],
    attractions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Backend API URL - adjust if your backend runs on different port
  const API_BASE_URL = 'http://localhost:3000/api';

  const tabs = [
    { id: 'restaurants', label: 'Restaurants', type: 'restaurant' },
    { id: 'hotels', label: 'Hotels', type: 'lodging' },
    { id: 'attractions', label: 'Places to Visit', type: 'tourist_attraction' }
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchPlaces(activeTab);
    }
  }, [activeTab, userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const fetchPlaces = async (category) => {
    if (!userLocation) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const placeType = tabs.find(tab => tab.id === category)?.type;
      const response = await fetch(
        `${API_BASE_URL}/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=5000&type=${placeType}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.results) {
        setPlaces(prev => ({
          ...prev,
          [category]: data.results
        }));
      } else {
        throw new Error(data.error || 'Failed to fetch places');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message.includes('fetch')) {
        setError('Unable to connect to server. Please make sure your backend is running on http://localhost:5000');
      } else {
        setError(err.message || 'An error occurred while fetching places');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (photoRef) => {
    if (!photoRef) {
      return '/api/placeholder/300/200';
    }
    return `${API_BASE_URL}/places/photo/${photoRef}?maxwidth=400`;
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  const renderPriceLevel = (priceLevel) => {
    if (!priceLevel) return null;
    return (
      <div className="flex items-center">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < priceLevel ? 'text-green-400' : 'text-gray-600'}`}
          >
            $
          </span>
        ))}
      </div>
    );
  };

  const PlaceCard = ({ place }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gray-700 relative">
        {place.photos && place.photos[0] ? (
          <img
            src={getPhotoUrl(place.photos[0].photo_reference)}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-500" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">{place.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-400 truncate">{place.vicinity}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          {renderStars(place.rating)}
          {renderPriceLevel(place.price_level)}
        </div>

        <div className="flex flex-wrap gap-2">
          {place.opening_hours?.open_now !== undefined && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              place.opening_hours.open_now 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-red-900/30 text-red-400'
            }`}>
              <Clock className="w-3 h-3 mr-1" />
              {place.opening_hours.open_now ? 'Open' : 'Closed'}
            </span>
          )}
          
          {place.formatted_phone_number && (
            <a
              href={`tel:${place.formatted_phone_number}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400 hover:bg-blue-800/30 transition-colors"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </a>
          )}
          
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-900/30 text-purple-400 hover:bg-purple-800/30 transition-colors"
            >
              <Globe className="w-3 h-3 mr-1" />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (error && error.includes('server')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Backend Connection Error</h2>
          <p className="text-gray-400 mb-6">
            Unable to connect to the backend server. Please make sure your Express server is running on port 5000.
          </p>
          <div className="text-sm text-gray-500">
            <p>1. Start your backend server: npm start</p>
            <p>2. Check if it's running on http://localhost:5000</p>
            <p>3. Ensure CORS is configured properly</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 mt-20 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            {error.includes('location') && (
              <button
                onClick={getUserLocation}
                className="mt-2 text-sm bg-red-700 hover:bg-red-600 px-3 py-1 rounded transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Places Grid */}
        {!loading && places[activeTab] && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {places[activeTab].map((place) => (
              <PlaceCard key={place.place_id} place={place} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && places[activeTab] && places[activeTab].length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No places found</h3>
            <p className="text-gray-500">
              We couldn't find any {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} near your location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesFinder;