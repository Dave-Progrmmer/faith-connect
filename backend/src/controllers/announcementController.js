import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import Announcement from '../models/Announcement.js';
import { cloudinary } from '../config/cloud.js';

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { title, content } = req.body;

  const announcementData = {
    title,
    content,
    createdBy: req.user._id
  };

  // Add image if uploaded
  if (req.file) {
    announcementData.image = {
      url: req.file.path,
      public_id: req.file.filename
    };
  }

  const announcement = await Announcement.create(announcementData);
  await announcement.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Announcement created successfully',
    data: announcement
  });
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find()
    .populate('createdBy', 'name email')
    .sort('-createdAt');

  res.json({
    success: true,
    count: announcements.length,
    data: announcements
  });
});

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  res.json({
    success: true,
    data: announcement
  });
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  // Delete image from Cloudinary if exists
  if (announcement.image && announcement.image.public_id) {
    await cloudinary.uploader.destroy(announcement.image.public_id, {
      resource_type: 'auto'
    });
  }

  await announcement.deleteOne();

  res.json({
    success: true,
    message: 'Announcement deleted successfully'
  });
});