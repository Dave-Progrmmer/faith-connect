import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import Event from '../models/Event.js';

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { title, description, location, startDate, endDate } = req.body;

  const event = await Event.create({
    title,
    description,
    location,
    startDate,
    endDate,
    createdBy: req.user._id
  });

  await event.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const { upcoming } = req.query;

  let query = {};
  
  // Filter for upcoming events only
  if (upcoming === 'true') {
    query.startDate = { $gte: new Date() };
  }

  const events = await Event.find(query)
    .populate('createdBy', 'name')
    .sort('startDate');

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  res.json({
    success: true,
    data: event
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  await event.deleteOne();

  res.json({
    success: true,
    message: 'Event deleted successfully'
  });
});