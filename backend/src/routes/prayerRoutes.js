import express from 'express';
import {
  createPrayer,
  getPublicPrayers,
  getAllPrayers,
  updatePrayerStatus
} from '../controllers/prayerController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { prayerValidator, objectIdValidator } from '../utils/validators.js';

const router = express.Router();

router.post('/', protect, prayerValidator, createPrayer);
router.get('/public', getPublicPrayers);
router.get('/admin', protect, admin, getAllPrayers);
router.patch('/:id/status', protect, admin, objectIdValidator(), updatePrayerStatus);

export default router;