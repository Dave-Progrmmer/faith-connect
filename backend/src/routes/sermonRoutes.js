import express from 'express';
import {
  createSermon,
  getSermons,
  getSermon,
  deleteSermon
} from '../controllers/sermonController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { uploadSermon } from '../config/cloud.js';
import { sermonValidator, objectIdValidator } from '../utils/validators.js';

const router = express.Router();

router
  .route('/')
  .post(
    protect, 
    admin, 
    uploadSermon.fields([
      { name: 'audio', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'notes', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    sermonValidator, 
    createSermon
  )
  .get(getSermons);

router
  .route('/:id')
  .get(objectIdValidator(), getSermon)
  .delete(protect, admin, objectIdValidator(), deleteSermon);

export default router;