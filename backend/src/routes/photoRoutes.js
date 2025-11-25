import express from 'express';
import {
  uploadPhoto,
  getPhotos,
  deletePhoto
} from '../controllers/photoController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { uploadImage } from '../config/cloud.js';
import { photoValidator, objectIdValidator } from '../utils/validators.js';

const router = express.Router();

router
  .route('/')
  .post(protect, admin, uploadImage.single('photo'), photoValidator, uploadPhoto)
  .get(getPhotos);

router
  .route('/:id')
  .delete(protect, admin, objectIdValidator(), deletePhoto);

export default router;