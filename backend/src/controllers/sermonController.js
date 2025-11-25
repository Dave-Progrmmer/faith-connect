import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import Sermon from '../models/Sermon.js';
import { cloudinary } from '../config/cloud.js';

// @desc    Create sermon
// @route   POST /api/sermons
// @access  Private/Admin
export const createSermon = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { title, speaker, description, date } = req.body;

  const sermonData = {
    title,
    speaker,
    description,
    date: date || Date.now(),
    uploadedBy: req.user._id
  };

  // Handle file uploads
  if (req.files) {
    if (req.files.audio) {
      sermonData.audio = {
        url: req.files.audio[0].path,
        public_id: req.files.audio[0].filename
      };
    }
    if (req.files.video) {
      sermonData.video = {
        url: req.files.video[0].path,
        public_id: req.files.video[0].filename
      };
    }
    if (req.files.notes) {
      sermonData.notes = {
        url: req.files.notes[0].path,
        public_id: req.files.notes[0].filename
      };
    }
    if (req.files.thumbnail) {
      sermonData.thumbnail = {
        url: req.files.thumbnail[0].path,
        public_id: req.files.thumbnail[0].filename
      };
    }
  }

  const sermon = await Sermon.create(sermonData);
  await sermon.populate('uploadedBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Sermon created successfully',
    data: sermon
  });
});

// @desc    Get all sermons
// @route   GET /api/sermons
// @access  Public
export const getSermons = asyncHandler(async (req, res) => {
  const sermons = await Sermon.find()
    .populate('uploadedBy', 'name')
    .sort('-date');

  res.json({
    success: true,
    count: sermons.length,
    data: sermons
  });
});

// @desc    Get single sermon
// @route   GET /api/sermons/:id
// @access  Public
export const getSermon = asyncHandler(async (req, res) => {
  const sermon = await Sermon.findById(req.params.id)
    .populate('uploadedBy', 'name email');

  if (!sermon) {
    return res.status(404).json({
      success: false,
      message: 'Sermon not found'
    });
  }

  res.json({
    success: true,
    data: sermon
  });
});

// @desc    Delete sermon
// @route   DELETE /api/sermons/:id
// @access  Private/Admin
export const deleteSermon = asyncHandler(async (req, res) => {
  const sermon = await Sermon.findById(req.params.id);

  if (!sermon) {
    return res.status(404).json({
      success: false,
      message: 'Sermon not found'
    });
  }

  // Delete all media files from Cloudinary
  const deletePromises = [];

  if (sermon.audio && sermon.audio.public_id) {
    deletePromises.push(
      cloudinary.uploader.destroy(sermon.audio.public_id, { resource_type: 'auto' })
    );
  }
  if (sermon.video && sermon.video.public_id) {
    deletePromises.push(
      cloudinary.uploader.destroy(sermon.video.public_id, { resource_type: 'auto' })
    );
  }
  if (sermon.notes && sermon.notes.public_id) {
    deletePromises.push(
      cloudinary.uploader.destroy(sermon.notes.public_id, { resource_type: 'auto' })
    );
  }
  if (sermon.thumbnail && sermon.thumbnail.public_id) {
    deletePromises.push(
      cloudinary.uploader.destroy(sermon.thumbnail.public_id, { resource_type: 'auto' })
    );
  }

  await Promise.all(deletePromises);
  await sermon.deleteOne();

  res.json({
    success: true,
    message: 'Sermon and associated media deleted successfully'
  });
});