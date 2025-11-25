import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import PrayerRequest from '../models/PrayerRequest.js';

// @desc    Create prayer request
// @route   POST /api/prayers
// @access  Private
export const createPrayer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { content, visibility } = req.body;

  const prayer = await PrayerRequest.create({
    content,
    visibility: visibility || 'public',
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Prayer request submitted successfully',
    data: prayer
  });
});

// @desc    Get public prayers (approved only)
// @route   GET /api/prayers/public
// @access  Public
export const getPublicPrayers = asyncHandler(async (req, res) => {
  const prayers = await PrayerRequest.find({
    status: 'approved',
    visibility: { $in: ['public', 'anonymous'] }
  })
    .populate('user', 'name')
    .sort('-createdAt');

  // Hide user info for anonymous prayers
  const formattedPrayers = prayers.map(prayer => {
    const prayerObj = prayer.toObject();
    if (prayerObj.visibility === 'anonymous') {
      delete prayerObj.user;
    }
    return prayerObj;
  });

  res.json({
    success: true,
    count: formattedPrayers.length,
    data: formattedPrayers
  });
});

// @desc    Get all prayers for admin review
// @route   GET /api/prayers/admin
// @access  Private/Admin
export const getAllPrayers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  const filter = {};
  if (status) {
    filter.status = status;
  }

  const prayers = await PrayerRequest.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json({
    success: true,
    count: prayers.length,
    data: prayers
  });
});

// @desc    Update prayer status (approve/reject)
// @route   PATCH /api/prayers/:id/status
// @access  Private/Admin
export const updatePrayerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "approved" or "rejected"'
    });
  }

  const prayer = await PrayerRequest.findById(req.params.id);

  if (!prayer) {
    return res.status(404).json({
      success: false,
      message: 'Prayer request not found'
    });
  }

  prayer.status = status;
  await prayer.save();

  res.json({
    success: true,
    message: `Prayer request ${status} successfully`,
    data: prayer
  });
});