
// routes/auth.js
const express = require('express');
const router = express.Router();
const Authority = require('../../Models/Authorities/Authority');
const OTPVerification = require('../../Models/Authorities/OTPVerification');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { generateOTP, sendVerificationEmail } = require('../../config/mailer');

// Rate limiting for signup route
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    error: 'Too many signup attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateSignup = (req, res, next) => {
  const { fullName, email, phone, department, badgeNumber, jurisdiction, password, confirmPassword } = req.body;
  
  // Check required fields
  const requiredFields = ['fullName', 'email', 'phone', 'department', 'badgeNumber', 'jurisdiction', 'password', 'confirmPassword'];
  const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      missingFields
    });
  }
  
  // Validate password match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }
  
  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    });
  }
  
  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }
  
  next();
};

// POST /api/auth/signup - Authority registration
router.post('/signup', signupLimiter, validateSignup, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      badgeNumber,
      jurisdiction,
      password
    } = req.body;

    // Check if authority already exists with email or badge number
    const existingAuthority = await Authority.findOne({
      $or: [
        { email: email.toLowerCase() },
        { badgeNumber: badgeNumber.trim() }
      ]
    });

    if (existingAuthority) {
      const field = existingAuthority.email === email.toLowerCase() ? 'email' : 'badge number';
      return res.status(409).json({
        success: false,
        message: `An authority with this ${field} already exists`
      });
    }

    // Create new authority
    const authority = new Authority({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      department,
      badgeNumber: badgeNumber.trim(),
      jurisdiction: jurisdiction.trim(),
      password
    });

    // Save to database
    await authority.save();

    // Generate JWT token (optional - for immediate login after signup)
    const token = jwt.sign(
      { 
        id: authority._id,
        email: authority.email,
        status: authority.status 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log the registration attempt
    console.log(`New authority registration: ${authority.email} - ${authority.department}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending approval by system administrators.',
      data: {
        authority: {
          id: authority._id,
          fullName: authority.fullName,
          email: authority.email,
          department: authority.department,
          status: authority.status,
          createdAt: authority.createdAt
        },
        token // Include token if you want immediate login capability
      }
    });

  } catch (error) {
    console.error('Authority signup error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `An authority with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/auth/verify-email/:email - Check if email is available
router.get('/verify-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const existingAuthority = await Authority.findOne({ email: email.toLowerCase() });
    
    res.json({
      success: true,
      available: !existingAuthority
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking email availability'
    });
  }
});

// GET /api/auth/verify-badge/:badgeNumber - Check if badge number is available
router.get('/verify-badge/:badgeNumber', async (req, res) => {
  try {
    const { badgeNumber } = req.params;
    const existingAuthority = await Authority.findOne({ badgeNumber: badgeNumber.trim() });
    
    res.json({
      success: true,
      available: !existingAuthority
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking badge number availability'
    });
  }
});

// POST /api/auth/send-verification - Send email verification OTP
router.post('/send-verification', async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email and full name are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Create OTP record in database
    await OTPVerification.createOTP(email, otp, fullName);

    // Send email
    await sendVerificationEmail(email, otp, fullName);

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again.'
    });
  }
});

// POST /api/auth/verify-otp - Verify email OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate OTP format (4 characters)
    if (otp.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be exactly 4 characters'
      });
    }

    // Verify OTP using the model
    const result = await OTPVerification.verifyOTP(email, otp);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying code. Please try again.'
    });
  }
});

module.exports = router;