// models/OTPVerification.js
const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: [4, 'OTP must be exactly 4 characters']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    index: { expireAfterSeconds: 0 } // MongoDB TTL index - automatically delete expired documents
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: [5, 'Maximum verification attempts exceeded']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance and cleanup
otpVerificationSchema.index({ email: 1 });
otpVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 }); // Auto-delete after 15 minutes

// Static method to create or update OTP for an email
otpVerificationSchema.statics.createOTP = async function(email, otp, fullName) {
  // Remove any existing OTP for this email
  await this.deleteMany({ email: email.toLowerCase() });

  // Create new OTP record
  return await this.create({
    email: email.toLowerCase(),
    otp,
    fullName,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
};

// Static method to verify OTP
otpVerificationSchema.statics.verifyOTP = async function(email, otp) {
  const otpRecord = await this.findOne({
    email: email.toLowerCase(),
    verified: false
  });

  if (!otpRecord) {
    return { success: false, message: 'No verification code found. Please request a new one.' };
  }

  // Check if expired
  if (new Date() > otpRecord.expiresAt) {
    await this.deleteOne({ _id: otpRecord._id });
    return { success: false, message: 'Verification code has expired. Please request a new one.' };
  }

  // Check attempts limit
  if (otpRecord.attempts >= 5) {
    await this.deleteOne({ _id: otpRecord._id });
    return { success: false, message: 'Maximum verification attempts exceeded. Please request a new code.' };
  }

  // Increment attempts
  otpRecord.attempts += 1;
  await otpRecord.save();

  // Check if OTP matches
  if (otpRecord.otp !== otp.toUpperCase()) {
    return { success: false, message: 'Invalid verification code.' };
  }

  // Mark as verified and clean up
  otpRecord.verified = true;
  await otpRecord.save();

  // Delete the OTP record after successful verification
  setTimeout(async () => {
    await this.deleteOne({ _id: otpRecord._id });
  }, 1000);

  return { success: true, message: 'Email verified successfully' };
};

// Static method to clean up expired OTPs (optional, since TTL handles this)
otpVerificationSchema.statics.cleanupExpired = async function() {
  return await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// Instance method to check if OTP is expired
otpVerificationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Instance method to check if max attempts reached
otpVerificationSchema.methods.isMaxAttemptsReached = function() {
  return this.attempts >= 5;
};

module.exports = mongoose.model('OTPVerification', otpVerificationSchema);