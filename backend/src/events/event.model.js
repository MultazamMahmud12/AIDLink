const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
   
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],

  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['natural_disaster', 'environmental', 'humanitarian', 'fire_emergency', 'health_crisis', 'education', 'poverty'],
      message: 'Category must be one of: natural_disaster, environmental, humanitarian, fire_emergency, health_crisis, education, poverty'
    }
  },
  isOngoing: {
    type: Boolean,
    default: true
  },
  estimatedAffectedPeople: {
    type: Number,
    required: [true, 'Estimated affected people count is required'],
  
  },
  severity: {
    type: String,
    required: [true, 'Event severity is required'],
    enum: {
      values: ['low', 'moderate', 'severe', 'critical'],
      message: 'Severity must be one of: low, moderate, severe, critical'
    }
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
  
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
   
  },
  coverImage: {
    url: {
      type: String,
      required: [true, 'Cover image URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required']
    },
    originalName: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    originalName: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    caption: {
      type: String
    }
  }],
  urgencyLevel: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Urgency level must be one of: low, medium, high, critical'
    }
  },
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required'],
    min: [0, 'Funding goal cannot be negative']
  },
  currentFunding: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, 
{
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Pre-save middleware to update isOngoing based on endDate
eventSchema.pre('save', function(next) {
  if (this.endDate && new Date() > this.endDate) {
    this.isOngoing = false;
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
