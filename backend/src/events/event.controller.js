const Event = require('./event.model');
const { deleteImageFromCloudinary, formatImageResponse } = require('../config/cloudinary');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { 
      category, 
      isOngoing, 
      severity, 
      urgencyLevel, 
      limit = 10, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (isOngoing !== undefined) filter.isOngoing = isOngoing === 'true';
    if (severity) filter.severity = severity;
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const events = await Event.find(filter)
      .sort({ [sortBy]: sortDirection })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('createdBy', 'name email');

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: events.length,
        totalEvents: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updates.author', 'name');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create new event with cover image
const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body };

    // Handle cover image upload
    if (req.file) {
      eventData.coverImage = formatImageResponse(req.file);
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    // If there's an error and image was uploaded, delete it from Cloudinary
    if (req.file) {
      await deleteImageFromCloudinary(req.file.filename);
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Add images to event
const addEventImages = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Process uploaded images
    const newImages = req.files.map(file => ({
      ...formatImageResponse(file),
      caption: req.body.caption || ''
    }));

    // Add new images to existing images array
    event.images.push(...newImages);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Images added successfully',
      data: {
        addedImages: newImages,
        totalImages: event.images.length
      }
    });
  } catch (error) {
    // If there's an error and images were uploaded, delete them from Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await deleteImageFromCloudinary(file.filename);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error adding images',
      error: error.message
    });
  }
};

// Delete specific image from event
const deleteEventImage = async (req, res) => {
  try {
    const { eventId, imageId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const imageIndex = event.images.findIndex(img => img._id.toString() === imageId);
    
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const imageToDelete = event.images[imageIndex];
    
    // Delete from Cloudinary
    await deleteImageFromCloudinary(imageToDelete.publicId);
    
    // Remove from database
    event.images.splice(imageIndex, 1);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Update funding amount
const updateFunding = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid funding amount'
      });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.currentFunding += amount;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Funding updated successfully',
      data: {
        currentFunding: event.currentFunding,
        fundingProgress: event.fundingProgress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating funding',
      error: error.message
    });
  }
};

// Add update to event
const addEventUpdate = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.updates.push({
      title,
      description,
      author: req.user?.id // Assuming user is attached to request
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event update added successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding event update',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateFunding,
  addEventUpdate,
  addEventImages,
  deleteEventImage
};
