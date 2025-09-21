// backend/routes/places.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Store your Google Places API key in environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({
      error: 'Google Places API key not configured on server'
    });
  }
  next();
};

// GET /api/places/nearby - Get nearby places
router.get('/nearby', validateApiKey, async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query;

    // Validate required parameters
    if (!lat || !lng || !type) {
      return res.status(400).json({
        error: 'Missing required parameters: lat, lng, type'
      });
    }

    // Validate coordinates
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({
        error: 'Invalid coordinates provided'
      });
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius,
          type: type,
          key: GOOGLE_API_KEY
        }
      }
    );

    if (response.data.status === 'OK') {
      res.json({
        success: true,
        results: response.data.results,
        status: response.data.status
      });
    } else {
      res.status(400).json({
        error: response.data.error_message || 'Failed to fetch places',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Places API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Internal server error while fetching places'
    });
  }
});

// GET /api/places/photo/:photoRef - Get place photo
router.get('/photo/:photoRef', validateApiKey, async (req, res) => {
  try {
    const { photoRef } = req.params;
    const { maxwidth = 400, maxheight = 400 } = req.query;

    if (!photoRef) {
      return res.status(400).json({
        error: 'Photo reference is required'
      });
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/photo',
      {
        params: {
          photo_reference: photoRef,
          maxwidth: maxwidth,
          maxheight: maxheight,
          key: GOOGLE_API_KEY
        },
        responseType: 'stream'
      }
    );

    // Set appropriate headers
    res.set({
      'Content-Type': response.headers['content-type'],
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    });

    // Pipe the image stream to response
    response.data.pipe(res);
  } catch (error) {
    console.error('Photo API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch photo'
    });
  }
});

// GET /api/places/details/:placeId - Get detailed place information
router.get('/details/:placeId', validateApiKey, async (req, res) => {
  try {
    const { placeId } = req.params;
    const { fields = 'name,rating,formatted_phone_number,opening_hours,website,photos,price_level,reviews' } = req.query;

    if (!placeId) {
      return res.status(400).json({
        error: 'Place ID is required'
      });
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: fields,
          key: GOOGLE_API_KEY
        }
      }
    );

    if (response.data.status === 'OK') {
      res.json({
        success: true,
        result: response.data.result,
        status: response.data.status
      });
    } else {
      res.status(400).json({
        error: response.data.error_message || 'Failed to fetch place details',
        status: response.data.status
      });
    }
  } catch (error) {
    console.error('Place Details API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Internal server error while fetching place details'
    });
  }
});

module.exports = router;
