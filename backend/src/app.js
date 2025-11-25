import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import prayerRoutes from './routes/prayerRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import sermonRoutes from './routes/sermonRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bibleRoutes from './routes/bibleRoutes.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Faith Connect API is running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bible', bibleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;