// middleware/roleCheck.js
const jwt = require('jsonwebtoken');
const Authority = require('../Models/Authorities/Authority');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authority = await Authority.findById(decoded.id);
    
    if (!authority) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    if (authority.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Account not approved.'
      });
    }

    req.authority = authority;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Department check middleware functions
const isPolice = (req, res, next) => {
  if (req.authority?.department !== 'police') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Police department only.'
    });
  }
  next();
};

const isTourism = (req, res, next) => {
  if (req.authority?.department !== 'tourism') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Tourism department only.'
    });
  }
  next();
};

const isEmergency = (req, res, next) => {
  if (req.authority?.department !== 'emergency') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Emergency department only.'
    });
  }
  next();
};

const isCustoms = (req, res, next) => {
  if (req.authority?.department !== 'customs') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customs department only.'
    });
  }
  next();
};

const isTransport = (req, res, next) => {
  if (req.authority?.department !== 'transport') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Transport department only.'
    });
  }
  next();
};

const isAdministration = (req, res, next) => {
  if (req.authority?.department !== 'administration') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administration department only.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  isPolice,
  isTourism,
  isEmergency,
  isCustoms,
  isTransport,
  isAdministration
};