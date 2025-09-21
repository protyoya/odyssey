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
