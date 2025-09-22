// routes/profile.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Tourist = require('../../Models/Tourist/Tourist');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// @route GET /api/profile
// @desc Get user profile
// @access Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id).select('-password');
    
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tourist
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/basic
// @desc Update basic profile information
// @access Private
router.put('/basic', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      nationality,
      dateOfBirth,
      gender,
      address
    } = req.body;

    const updateData = {};
    
    // Only update provided fields
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;

    const tourist = await Tourist.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: tourist
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/preferences
// @desc Update user preferences
// @access Private
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { languages, interests } = req.body;

    const updateData = {};
    if (languages !== undefined) updateData['preferences.languages'] = languages;
    if (interests !== undefined) updateData['preferences.interests'] = interests;

    const tourist = await Tourist.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: tourist
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      message: 'Server error updating preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/password
// @desc Change user password
// @access Private
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find user and include password for verification
    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, tourist.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    tourist.password = hashedNewPassword;
    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      message: 'Server error updating password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/profile/trips
// @desc Add a new trip
// @access Private
router.post('/trips', authenticateToken, async (req, res) => {
  try {
    const { 
      title, 
      destination, 
      startDate, 
      endDate, 
      activities, 
      notes 
    } = req.body;

    // Validation
    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Title, destination, start date, and end date are required'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        message: 'End date must be after start date'
      });
    }

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const newTrip = {
      title,
      destination,
      startDate: start,
      endDate: end,
      activities: activities || [],
      notes: notes || '',
      status: 'Planned'
    };

    tourist.trips.push(newTrip);
    await tourist.save();

    res.status(201).json({
      success: true,
      message: 'Trip added successfully',
      data: newTrip
    });

  } catch (error) {
    console.error('Add trip error:', error);
    res.status(500).json({
      message: 'Server error adding trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/trips/:tripId
// @desc Update a specific trip
// @access Private
router.put('/trips/:tripId', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const updates = req.body;

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const trip = tourist.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    // Update trip fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'startDate' || key === 'endDate') {
          trip[key] = new Date(updates[key]);
        } else {
          trip[key] = updates[key];
        }
      }
    });

    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });

  } catch (error) {
    console.error('Trip update error:', error);
    res.status(500).json({
      message: 'Server error updating trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route DELETE /api/profile/trips/:tripId
// @desc Delete a specific trip
// @access Private
router.delete('/trips/:tripId', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const trip = tourist.trips.id(tripId);
    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    trip.deleteOne();
    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Trip deletion error:', error);
    res.status(500).json({
      message: 'Server error deleting trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route GET /api/profile/trips
// @desc Get all trips for the user
// @access Private
router.get('/trips', authenticateToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id).select('trips');
    
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Sort trips by start date (most recent first)
    const sortedTrips = tourist.trips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    res.status(200).json({
      success: true,
      data: sortedTrips
    });

  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      message: 'Server error fetching trips',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/passport
// @desc Update passport information
// @access Private
router.put('/passport', authenticateToken, async (req, res) => {
  try {
    const { passportNumber } = req.body;

    if (!passportNumber) {
      return res.status(400).json({
        message: 'Passport number is required'
      });
    }

    // Check if passport number is already taken by another user
    const existingTourist = await Tourist.findOne({
      passportNumber,
      _id: { $ne: req.user.id }
    });

    if (existingTourist) {
      return res.status(409).json({
        message: 'Passport number is already registered'
      });
    }

    const tourist = await Tourist.findByIdAndUpdate(
      req.user.id,
      { passportNumber },
      { new: true, runValidators: true }
    ).select('-password');

    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Passport information updated successfully',
      data: tourist
    });

  } catch (error) {
    console.error('Passport update error:', error);
    res.status(500).json({
      message: 'Server error updating passport information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/profile/emergency-contacts
// @desc Add emergency contact
// @access Private
router.post('/emergency-contacts', authenticateToken, async (req, res) => {
  try {
    const { name, phone, relationship, email } = req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({
        message: 'Name, phone, and relationship are required'
      });
    }

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const newContact = { name, phone, relationship, email };
    tourist.emergencyContacts.push(newContact);
    await tourist.save();

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: newContact
    });

  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({
      message: 'Server error adding emergency contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/emergency-contacts/:contactId
// @desc Update emergency contact
// @access Private
router.put('/emergency-contacts/:contactId', authenticateToken, async (req, res) => {
  try {
    const { contactId } = req.params;
    const updates = req.body;

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const contact = tourist.emergencyContacts.id(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Emergency contact not found'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        contact[key] = updates[key];
      }
    });

    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({
      message: 'Server error updating emergency contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route DELETE /api/profile/emergency-contacts/:contactId
// @desc Delete emergency contact
// @access Private
router.delete('/emergency-contacts/:contactId', authenticateToken, async (req, res) => {
  try {
    const { contactId } = req.params;

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const contact = tourist.emergencyContacts.id(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Emergency contact not found'
      });
    }

    contact.deleteOne();
    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({
      message: 'Server error deleting emergency contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/profile/location
// @desc Update current location
// @access Private
router.post('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, accuracy, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Latitude and longitude are required'
      });
    }

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (!tourist.locationTrackingEnabled) {
      return res.status(403).json({
        message: 'Location tracking is disabled'
      });
    }

    const locationData = {
      latitude,
      longitude,
      accuracy,
      address,
      timestamp: new Date()
    };

    tourist.currentLocation = locationData;

    if (tourist.locationHistory.length >= 100) {
      tourist.locationHistory.shift();
    }
    tourist.locationHistory.push(locationData);

    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      message: 'Server error updating location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/profile/location-tracking
// @desc Toggle location tracking
// @access Private
router.put('/location-tracking', authenticateToken, async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        message: 'Enabled field must be a boolean'
      });
    }

    const tourist = await Tourist.findByIdAndUpdate(
      req.user.id,
      { locationTrackingEnabled: enabled },
      { new: true }
    ).select('-password');

    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Location tracking ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: { locationTrackingEnabled: tourist.locationTrackingEnabled }
    });

  } catch (error) {
    console.error('Location tracking toggle error:', error);
    res.status(500).json({
      message: 'Server error toggling location tracking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/profile/kyc/apply
// @desc Apply for KYC verification
// @access Private
router.post('/kyc/apply', authenticateToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (tourist.kycStatus === 'pending') {
      return res.status(400).json({
        message: 'KYC application is already pending'
      });
    }

    if (tourist.kycStatus === 'approved') {
      return res.status(400).json({
        message: 'KYC is already verified'
      });
    }

    const requiredFields = ['fullName', 'phone', 'nationality', 'dateOfBirth', 'gender'];
    const missingFields = requiredFields.filter(field => !tourist[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Profile incomplete. Please fill all required fields',
        missingFields
      });
    }

    tourist.kycStatus = 'pending';
    tourist.kycAppliedAt = new Date();
    tourist.kycRejectionReason = undefined;
    await tourist.save();

    res.status(200).json({
      success: true,
      message: 'KYC application submitted successfully'
    });

  } catch (error) {
    console.error('KYC apply error:', error);
    res.status(500).json({
      message: 'Server error submitting KYC application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route GET /api/profile/completion
// @desc Get profile completion percentage
// @access Private
router.get('/completion', authenticateToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id).select('-password');
    if (!tourist) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const requiredFields = [
      'fullName', 'phone', 'nationality', 'passportNumber',
      'dateOfBirth', 'gender', 'address.country', 'address.city'
    ];

    let completedFields = 0;
    requiredFields.forEach(field => {
      const fieldValue = field.includes('.')
        ? field.split('.').reduce((obj, key) => obj?.[key], tourist)
        : tourist[field];

      if (fieldValue) completedFields++;
    });

    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);

    tourist.profileCompletionPercentage = completionPercentage;
    await tourist.save();

    res.status(200).json({
      success: true,
      data: {
        completionPercentage,
        completedFields,
        totalFields: requiredFields.length,
        canApplyKyc: completionPercentage === 100
      }
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({
      message: 'Server error calculating profile completion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router