// models/FencedArea.js
const mongoose = require('mongoose');

const fencedAreaSchema = new mongoose.Schema({
  // User who created this fenced area
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Geographic coordinates
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
    validate: {
      validator: function(v) {
        return v >= -90 && v <= 90;
      },
      message: 'Latitude must be between -90 and 90 degrees'
    }
  },
  
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
    validate: {
      validator: function(v) {
        return v >= -180 && v <= 180;
      },
      message: 'Longitude must be between -180 and 180 degrees'
    }
  },
  
  // Fence radius in meters
  radius: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
    validate: {
      validator: function(v) {
        return v >= 1 && v <= 10000;
      },
      message: 'Radius must be between 1 and 10000 meters'
    }
  },
  
  // Description of the fenced area
  description: {
    type: String,
    required: true,
    maxLength: 500,
    trim: true
  },
  
  // Status of the fenced area
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
    index: true
  },
  
  // Additional metadata
  metadata: {
    // Type of fence (virtual, physical, etc.)
    fenceType: {
      type: String,
      enum: ['virtual', 'physical', 'warning', 'restricted'],
      default: 'virtual'
    },
    
    // Priority level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Tags for categorization
    tags: [{
      type: String,
      trim: true
    }],
    
    // Additional notes
    notes: {
      type: String,
      maxLength: 1000
    },
    
    // Alert settings
    alertSettings: {
      enabled: {
        type: Boolean,
        default: true
      },
      
      alertTypes: [{
        type: String,
        enum: ['entry', 'exit', 'proximity', 'time_based']
      }],
      
      notificationMethods: [{
        type: String,
        enum: ['email', 'sms', 'push', 'webhook']
      }]
    }
  },
  
  // Geospatial index for location-based queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  
  // Activity tracking
  activity: {
    totalAlerts: {
      type: Number,
      default: 0
    },
    
    lastAlert: {
      type: Date
    },
    
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  collection: 'fenced_areas'
});

// Indexes for better query performance
fencedAreaSchema.index({ userId: 1, status: 1 });
fencedAreaSchema.index({ latitude: 1, longitude: 1 });
fencedAreaSchema.index({ createdAt: -1 });
fencedAreaSchema.index({ 'metadata.priority': 1 });
fencedAreaSchema.index({ 'metadata.tags': 1 });

// Pre-save middleware to set location coordinates
fencedAreaSchema.pre('save', function(next) {
  if (this.latitude !== undefined && this.longitude !== undefined) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude]
    };
  }
  next();
});

// Pre-update middleware to set location coordinates
fencedAreaSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.latitude !== undefined && update.longitude !== undefined) {
    update.location = {
      type: 'Point',
      coordinates: [update.longitude, update.latitude]
    };
  } else if (update.$set && (update.$set.latitude !== undefined || update.$set.longitude !== undefined)) {
    // Handle $set operations
    const lat = update.$set.latitude || this.getQuery().latitude;
    const lng = update.$set.longitude || this.getQuery().longitude;
    if (lat !== undefined && lng !== undefined) {
      update.$set.location = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }
  }
  next();
});

// Virtual property to calculate area in square meters
fencedAreaSchema.virtual('area').get(function() {
  return Math.PI * Math.pow(this.radius, 2);
});

// Virtual property to get human-readable location
fencedAreaSchema.virtual('locationString').get(function() {
  return `${this.latitude.toFixed(6)}, ${this.longitude.toFixed(6)}`;
});

// Instance methods
fencedAreaSchema.methods.isPointInside = function(lat, lng) {
  const distance = this.calculateDistance(lat, lng);
  return distance <= this.radius;
};

fencedAreaSchema.methods.calculateDistance = function(lat, lng) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = this.latitude * Math.PI / 180;
  const φ2 = lat * Math.PI / 180;
  const Δφ = (lat - this.latitude) * Math.PI / 180;
  const Δλ = (lng - this.longitude) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

fencedAreaSchema.methods.incrementAlert = function() {
  this.activity.totalAlerts += 1;
  this.activity.lastAlert = new Date();
  return this.save();
};

fencedAreaSchema.methods.updateLastAccessed = function() {
  this.activity.lastAccessed = new Date();
  return this.save();
};

// Static methods
fencedAreaSchema.statics.findByUserId = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.priority) {
    query['metadata.priority'] = options.priority;
  }
  
  if (options.tags && options.tags.length > 0) {
    query['metadata.tags'] = { $in: options.tags };
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

fencedAreaSchema.statics.findNearLocation = function(lat, lng, maxDistance = 1000, userId = null) {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  };
  
  if (userId) {
    query.userId = userId;
  }
  
  return this.find(query);
};

fencedAreaSchema.statics.findIntersecting = function(lat, lng, radius, userId = null) {
  // Find areas that intersect with the given circle
  const query = {
    status: 'active',
    $where: function() {
      const distance = this.calculateDistance(lat, lng);
      return distance <= (this.radius + radius);
    }
  };
  
  if (userId) {
    query.userId = userId;
  }
  
  return this.find(query);
};

fencedAreaSchema.statics.getStatistics = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalAreas: { $sum: 1 },
        activeAreas: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        inactiveAreas: {
          $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
        },
        pendingAreas: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        averageRadius: { $avg: '$radius' },
        minRadius: { $min: '$radius' },
        maxRadius: { $max: '$radius' },
        totalCoverage: { 
          $sum: { 
            $multiply: ['$radius', '$radius', 3.14159] 
          } 
        },
        totalAlerts: { $sum: '$activity.totalAlerts' },
        priorityBreakdown: {
          $push: '$metadata.priority'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalAreas: 1,
        activeAreas: 1,
        inactiveAreas: 1,
        pendingAreas: 1,
        averageRadius: { $round: ['$averageRadius', 2] },
        minRadius: 1,
        maxRadius: 1,
        totalCoverage: { $round: ['$totalCoverage', 2] },
        totalAlerts: 1,
        priorityBreakdown: 1
      }
    }
  ]);
};

// Transform function to customize JSON output
fencedAreaSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.area = doc.area;
    ret.locationString = doc.locationString;
    delete ret.__v;
    delete ret.location; // Hide the GeoJSON field from API responses
    return ret;
  }
});

// Transform function to customize Object output
fencedAreaSchema.set('toObject', {
  transform: function(doc, ret, options) {
    ret.area = doc.area;
    ret.locationString = doc.locationString;
    delete ret.__v;
    return ret;
  }
});

// Create and export the model
const FencedArea = mongoose.model('FencedArea', fencedAreaSchema);

module.exports = FencedArea;