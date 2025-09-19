// models/Authority.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authoritySchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  
  // Authority Details
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: ['police', 'tourism', 'emergency', 'customs', 'transport', 'administration'],
      message: 'Department must be one of: police, tourism, emergency, customs, transport'
    }
  },
  badgeNumber: {
    type: String,
    required: [true, 'Badge/ID number is required'],
    trim: true,
    unique: true,
    minlength: [3, 'Badge number must be at least 3 characters'],
    maxlength: [50, 'Badge number cannot exceed 50 characters']
  },
  jurisdiction: {
    type: String,
    required: [true, 'Area of jurisdiction is required'],
    trim: true,
    minlength: [2, 'Jurisdiction must be at least 2 characters'],
    maxlength: [100, 'Jurisdiction cannot exceed 100 characters']
  },
  
  // Security
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authority',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  
  // Security and Tracking
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
authoritySchema.index({ email: 1 });
authoritySchema.index({ badgeNumber: 1 });
authoritySchema.index({ status: 1 });
authoritySchema.index({ department: 1 });

// Pre-save middleware to hash password
authoritySchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
authoritySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for account lock status
authoritySchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Instance method to compare password
authoritySchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
authoritySchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have exceeded max attempts and account is not locked, lock it
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

// Static method to find authorities by department
authoritySchema.statics.findByDepartment = function(department) {
  return this.find({ department, status: 'approved' });
};

// Static method to find pending authorities
authoritySchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Authority', authoritySchema);