// routes/tourist.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tourist = require('../../Models/Tourist/Tourist');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// @route POST /api/tourist/signup
// @desc Register a new tourist
// @access Public
router.post('/signup', async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      fullName, 
      phone, 
      nationality,
      dateOfBirth,
      gender 
    } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if tourist already exists
    const existingTourist = await Tourist.findOne({
      $or: [{ email }, { username }]
    });

    if (existingTourist) {
      return res.status(409).json({
        message: 'Tourist with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new tourist
    const newTourist = new Tourist({
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
      nationality,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      isVerified: false // You might want to implement email verification
    });

    await newTourist.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newTourist._id, 
        email: newTourist.email,
        username: newTourist.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const touristResponse = newTourist.toObject();
    delete touristResponse.password;

    res.status(201).json({
      message: 'Tourist registered successfully',
      token,
      tourist: touristResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/tourist/login
// @desc Login tourist
// @access Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find tourist by email
    const tourist = await Tourist.findOne({ email });
    if (!tourist) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, tourist.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Update last login
    tourist.lastLogin = new Date();
    await tourist.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: tourist._id, 
        email: tourist.email,
        username: tourist.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const touristResponse = tourist.toObject();
    delete touristResponse.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      tourist: touristResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route GET /api/tourist/profile
// @desc Get tourist profile
// @access Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id).select('-password');
    
    if (!tourist) {
      return res.status(404).json({
        message: 'Tourist not found'
      });
    }

    res.status(200).json({
      tourist
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route PUT /api/tourist/profile
// @desc Update tourist profile
// @access Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this route
    delete updates.password;
    delete updates.email;
    delete updates.username;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const tourist = await Tourist.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!tourist) {
      return res.status(404).json({
        message: 'Tourist not found'
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      tourist
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/tourist/trips
// @desc Add a new trip
// @access Private
router.post('/trips', authenticateToken, async (req, res) => {
  try {
    const { title, destination, startDate, endDate, activities, notes } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Title, destination, start date, and end date are required'
      });
    }

    const tourist = await Tourist.findById(req.user.id);
    if (!tourist) {
      return res.status(404).json({
        message: 'Tourist not found'
      });
    }

    const newTrip = {
      title,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      activities: activities || [],
      notes: notes || '',
      status: 'Planned'
    };

    tourist.trips.push(newTrip);
    await tourist.save();

    res.status(201).json({
      message: 'Trip added successfully',
      trip: newTrip
    });

  } catch (error) {
    console.error('Add trip error:', error);
    res.status(500).json({
      message: 'Server error adding trip',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route GET /api/tourist/trips
// @desc Get all trips for a tourist
// @access Private
router.get('/trips', authenticateToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.user.id).select('trips');
    
    if (!tourist) {
      return res.status(404).json({
        message: 'Tourist not found'
      });
    }

    res.status(200).json({
      trips: tourist.trips
    });

  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      message: 'Server error fetching trips',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route POST /api/tourist/logout
// @desc Logout tourist (mainly for client-side token removal)
// @access Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more advanced setup, you might maintain a blacklist of tokens
    // For now, we just return success and let the client handle token removal
    
    res.status(200).json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;