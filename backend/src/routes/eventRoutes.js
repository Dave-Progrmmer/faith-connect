import express from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { eventValidator, objectIdValidator } from '../utils/validators.js';

const router = express.Router();

router
  .route('/')
  .post(protect, admin, eventValidator, createEvent)
  .get(getEvents);

router
  .route('/:id')
  .get(objectIdValidator(), getEvent)
  .delete(protect, admin, objectIdValidator(), deleteEvent);

export default router;