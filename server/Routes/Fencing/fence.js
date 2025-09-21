// routes/fencing.js
const express = require('express');
const router = express.Router();
const FencedArea = require('../../Models/Fencing/fence'); // Adjust path as needed

// GET /api/authorities/fencing/areas - Get all fenced areas (open access)
router.get('/areas', async (req, res) => {
  try {
    // Use a default user ID for open access, or remove user filtering entirely
    const areas = await FencedArea.find({})
      .sort({ createdAt: -1 });
    
    res.json(areas);
  } catch (error) {
    console.error('Error fetching fenced areas:', error);
    res.status(500).json({ 
      message: 'Failed to fetch fenced areas',
      error: error.message 
    });
  }
});

// POST /api/authorities/fencing/mark-area - Create a new fenced area (open access)
router.post('/mark-area', async (req, res) => {
  try {
    const { latitude, longitude, radius, description } = req.body;

    // Use a default user ID for open access
    const userId = 'anonymous-user';

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        message: 'Invalid latitude. Must be between -90 and 90' 
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        message: 'Invalid longitude. Must be between -180 and 180' 
      });
    }

    if (!radius || radius < 1 || radius > 10000) {
      return res.status(400).json({ 
        message: 'Invalid radius. Must be between 1 and 10000 meters' 
      });
    }

    // Check if area already exists in close proximity
    const existingArea = await FencedArea.findOne({
      latitude: { $gte: latitude - 0.001, $lte: latitude + 0.001 },
      longitude: { $gte: longitude - 0.001, $lte: longitude + 0.001 }
    });

    if (existingArea) {
      return res.status(409).json({ 
        message: 'A fenced area already exists in close proximity to this location' 
      });
    }

    // Create new fenced area
    const newArea = new FencedArea({
      userId: userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseInt(radius),
      description: description || `Fenced area at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      status: 'active'
    });

    const savedArea = await newArea.save();
    
    res.status(201).json(savedArea);
  } catch (error) {
    console.error('Error creating fenced area:', error);
    res.status(500).json({ 
      message: 'Failed to create fenced area',
      error: error.message 
    });
  }
});

// GET /api/authorities/fencing/area/:id - Get a specific fenced area (open access)
router.get('/area/:id', async (req, res) => {
  try {
    const area = await FencedArea.findById(req.params.id);

    if (!area) {
      return res.status(404).json({ 
        message: 'Fenced area not found' 
      });
    }

    res.json(area);
  } catch (error) {
    console.error('Error fetching fenced area:', error);
    res.status(500).json({ 
      message: 'Failed to fetch fenced area',
      error: error.message 
    });
  }
});

// PUT /api/authorities/fencing/area/:id - Update a fenced area (open access)
router.put('/area/:id', async (req, res) => {
  try {
    const { latitude, longitude, radius, description, status } = req.body;
    
    const updateData = {};
    
    if (latitude !== undefined) {
      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({ 
          message: 'Invalid latitude. Must be between -90 and 90' 
        });
      }
      updateData.latitude = parseFloat(latitude);
    }
    
    if (longitude !== undefined) {
      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({ 
          message: 'Invalid longitude. Must be between -180 and 180' 
        });
      }
      updateData.longitude = parseFloat(longitude);
    }
    
    if (radius !== undefined) {
      if (radius < 1 || radius > 10000) {
        return res.status(400).json({ 
          message: 'Invalid radius. Must be between 1 and 10000 meters' 
        });
      }
      updateData.radius = parseInt(radius);
    }
    
    if (description !== undefined) {
      updateData.description = description;
    }
    
    if (status !== undefined) {
      if (!['active', 'inactive', 'pending'].includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status. Must be active, inactive, or pending' 
        });
      }
      updateData.status = status;
    }
    
    updateData.updatedAt = new Date();

    const updatedArea = await FencedArea.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArea) {
      return res.status(404).json({ 
        message: 'Fenced area not found' 
      });
    }

    res.json(updatedArea);
  } catch (error) {
    console.error('Error updating fenced area:', error);
    res.status(500).json({ 
      message: 'Failed to update fenced area',
      error: error.message 
    });
  }
});

// DELETE /api/authorities/fencing/area/:id - Delete a fenced area (open access)
router.delete('/area/:id', async (req, res) => {
  try {
    const deletedArea = await FencedArea.findByIdAndDelete(req.params.id);

    if (!deletedArea) {
      return res.status(404).json({ 
        message: 'Fenced area not found' 
      });
    }

    res.json({ 
      message: 'Fenced area deleted successfully',
      deletedArea 
    });
  } catch (error) {
    console.error('Error deleting fenced area:', error);
    res.status(500).json({ 
      message: 'Failed to delete fenced area',
      error: error.message 
    });
  }
});

// GET /api/authorities/fencing/nearby - Get fenced areas near a location (open access)
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 1000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const maxDist = parseInt(maxDistance);

    // Convert meters to degrees (rough approximation)
    const degreeDistance = maxDist / 111000;

    const nearbyAreas = await FencedArea.find({
      status: 'active',
      latitude: { $gte: lat - degreeDistance, $lte: lat + degreeDistance },
      longitude: { $gte: lng - degreeDistance, $lte: lng + degreeDistance }
    }).sort({ createdAt: -1 });

    // Calculate actual distances and filter
    const areasWithDistance = nearbyAreas.map(area => {
      const distance = calculateDistance(lat, lng, area.latitude, area.longitude);
      return { ...area.toObject(), distance };
    }).filter(area => area.distance <= maxDist);

    res.json(areasWithDistance);
  } catch (error) {
    console.error('Error fetching nearby areas:', error);
    res.status(500).json({ 
      message: 'Failed to fetch nearby areas',
      error: error.message 
    });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c;
  return Math.round(distance);
}

// GET /api/authorities/fencing/stats - Get statistics (open access)
router.get('/stats', async (req, res) => {
  try {
    const stats = await FencedArea.aggregate([
      { $match: {} }, // Remove user filtering
      {
        $group: {
          _id: null,
          totalAreas: { $sum: 1 },
          activeAreas: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          averageRadius: { $avg: '$radius' },
          totalCoverage: { $sum: { $multiply: ['$radius', '$radius', 3.14159] } }
        }
      }
    ]);

    const result = stats[0] || {
      totalAreas: 0,
      activeAreas: 0,
      averageRadius: 0,
      totalCoverage: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

module.exports = router;