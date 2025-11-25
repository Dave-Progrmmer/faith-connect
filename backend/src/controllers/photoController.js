import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import Photo from '../models/Photo.js';
import { cloudinary } from '../config/cloud.js';

// @desc    Upload photo
// @route   POST /api/photos
// @access  Private/Admin
export const uploadPhoto = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a photo'
    });
  }

  const { title, description } = req.body;

  const photo = await Photo.create({
    title,
    description,
    photo: {
      url: req.file.path,
      public_id: req.file.filename
    },
    uploadedBy: req.user._id
  });

  await photo.populate('uploadedBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Photo uploaded successfully',
    data: photo
  });
});

// @desc    Get all photos
// @route   GET /api/photos
// @access  Public
export const getPhotos = asyncHandler(async (req, res) => {
  const photos = await Photo.find()
    .populate('uploadedBy', 'name')
    .sort('-createdAt');

  res.json({
    success: true,
    count: photos.length,
    data: photos
  });
});

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private/Admin
export const deletePhoto = asyncHandler(async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo) {
    return res.status(404).json({
      success: false,
      message: 'Photo not found'
    });
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(photo.photo.public_id, {
    resource_type: 'auto'
  });

  await photo.deleteOne();

  res.json({
    success: true,
    message: 'Photo deleted successfully'
  });
});