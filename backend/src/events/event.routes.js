const express = require('express');
const router = express.Router();
const { uploadCoverImage, uploadEventImages } = require('../config/cloudinary');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateFunding,
  addEventUpdate,
  addEventImages,
  deleteEventImage
} = require('./event.controller');

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
router.get('/', getAllEvents);

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', getEventById);

// @route   POST /api/events
// @desc    Create new event with cover image
// @access  Private (Admin/Organization)
router.post('/', uploadCoverImage.single('coverImage'), createEvent);

// @route   PUT /api/events/:id
// @desc    Update event with optional new cover image
// @access  Private (Admin/Organization)
router.put('/:id', uploadCoverImage.single('coverImage'), updateEvent);

// @route   POST /api/events/:id/images
// @desc    Add multiple images to event
// @access  Private (Admin/Organization)
router.post('/:id/images', uploadEventImages.array('images', 10), addEventImages);

// @route   DELETE /api/events/:eventId/images/:imageId
// @desc    Delete specific image from event
// @access  Private (Admin/Organization)
router.delete('/:eventId/images/:imageId', deleteEventImage);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin)
router.delete('/:id', deleteEvent);

// @route   PATCH /api/events/:id/funding
// @desc    Update funding amount
// @access  Private (when donation is made)
router.patch('/:id/funding', updateFunding);

// @route   POST /api/events/:id/updates
// @desc    Add update to event
// @access  Private (Admin/Organization)
router.post('/:id/updates', addEventUpdate);

module.exports = router;
