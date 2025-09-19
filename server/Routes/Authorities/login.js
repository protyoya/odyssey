// routes/auth.js (add this to your existing auth routes)
const express = require('express');
const router = express.Router();
const Authority = require('../../Models/Authorities/Authority');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');

// Rate limiting for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email and password cannot be empty'
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  next();
};

// POST /api/auth/authorities/login - Authority login
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find authority by email and include password field
    const authority = await Authority.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');

    if (!authority) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (authority.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check account status
    if (authority.status !== 'approved') {
      let message = 'Your account is not approved yet.';
      if (authority.status === 'pending') {
        message = 'Your account is pending approval by administrators.';
      } else if (authority.status === 'rejected') {
        message = 'Your account has been rejected. Please contact support.';
      } else if (authority.status === 'suspended') {
        message = 'Your account has been suspended. Please contact support.';
      }
      
      return res.status(403).json({
        success: false,
        message
      });
    }

    // Verify password
    const isValidPassword = await authority.comparePassword(password);

    if (!isValidPassword) {
      // Increment login attempts
      await authority.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    if (authority.loginAttempts > 0) {
      await authority.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
      });
    }

    // Update last login
    authority.lastLogin = new Date();
    await authority.save();

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { 
        id: authority._id,
        email: authority.email,
        department: authority.department,
        status: authority.status,
        badgeNumber: authority.badgeNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Log successful login
    console.log(`Authority login: ${authority.email} - ${authority.department}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        authority: {
          id: authority._id,
          fullName: authority.fullName,
          email: authority.email,
          department: authority.department,
          jurisdiction: authority.jurisdiction,
          status: authority.status,
          lastLogin: authority.lastLogin
        },
        token,
        expiresIn: rememberMe ? '30 days' : '7 days'
      }
    });

  } catch (error) {
    console.error('Authority login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// POST /api/auth/authorities/logout - Authority logout (optional)
router.post('/authorities/logout', async (req, res) => {
  try {
    // In a more complex setup, you might invalidate tokens here
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Authority logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// GET /api/auth/authorities/me - Get current authority info (protected route)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.authority = decoded;
    next();
  });
};

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const authority = await Authority.findById(req.authority.id);
    
    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    res.json({
      success: true,
      data: {
        authority: {
          id: authority._id,
          fullName: authority.fullName,
          email: authority.email,
          department: authority.department,
          jurisdiction: authority.jurisdiction,
          status: authority.status,
          lastLogin: authority.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get authority info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get authority information'
    });
  }
});

module.exports = router;