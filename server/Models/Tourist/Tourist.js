// models/Tourist.js
const mongoose = require("mongoose");

const TouristSchema = new mongoose.Schema(
  {
    // --- Auth essentials ---
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // store hashed password only
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },

    // --- Profile Info ---
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    passportNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      country: String,
      state: String,
      city: String,
      street: String,
      zipCode: String,
    },
    preferences: {
      languages: [String],
      interests: [String],
    },

    // --- Emergency Contacts ---
    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
        relationship: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // --- Live Location ---
    currentLocation: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
      accuracy: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      address: String,
    },
    locationHistory: [
      {
        latitude: {
          type: Number,
          required: true,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          required: true,
          min: -180,
          max: 180,
        },
        accuracy: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        address: String,
      },
    ],
    locationTrackingEnabled: {
      type: Boolean,
      default: false,
    },

    // --- KYC Status ---
    kycStatus: {
      type: String,
      enum: ["not_applied", "pending", "approved", "rejected"],
      default: "not_applied",
    },
    kycAppliedAt: {
      type: Date,
    },
    kycVerifiedAt: {
      type: Date,
    },
    kycVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
    },
    kycRejectionReason: {
      type: String,
      trim: true,
    },
    kycDocuments: [
      {
        type: {
          type: String,
          enum: ["passport", "id_card", "photo", "address_proof", "other"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // --- QR Verification History ---
    verificationHistory: [
      {
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Authority",
          required: true,
        },
        verifiedAt: {
          type: Date,
          required: true,
        },
        qrCodeData: {
          scannedAt: {
            type: Date,
            required: true,
          },
          verificationMethod: {
            type: String,
            enum: ["qr_scan", "manual"],
            default: "qr_scan",
          },
        },
      },
    ],

    // --- Trips ---
    trips: [
      {
        title: { type: String, required: true },
        destination: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        bookingRef: { type: String },
        status: {
          type: String,
          enum: ["Planned", "Ongoing", "Completed", "Cancelled"],
          default: "Planned",
        },
        activities: [String],
        notes: String,
      },
    ],

    // --- Linked bookings if needed ---
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tourist", TouristSchema);
