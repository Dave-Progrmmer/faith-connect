import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { uploadImage } from '../config/cloud.js';
import { announcementValidator, objectIdValidator } from '../utils/validators.js';

const router = express.Router();

router
  .route('/')
  .post(protect, admin, uploadImage.single('image'), announcementValidator, createAnnouncement)
  .get(getAnnouncements);

router
  .route('/:id')
  .get(objectIdValidator(), getAnnouncement)
  .delete(protect, admin, objectIdValidator(), deleteAnnouncement);

export default router;