import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../src/config/db.js';
import errorHandler from '../src/middleware/errorHandler.js';

// Import routes
import authRoutes from '../src/routes/authRoutes.js';
import announcementRoutes from '../src/routes/announcementRoutes.js';
import prayerRoutes from '../src/routes/prayerRoutes.js';
import sermonRoutes from '../src/routes/sermonRoutes.js';
import photoRoutes from '../src/routes/photoRoutes.js';
import eventRoutes from '../src/routes/eventRoutes.js';
import bibleRoutes from '../src/routes/bibleRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Faith Connect API is running',
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
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
app.use('/api/sermons', sermonRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bible', bibleRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler (must be last)
app.use(errorHandler);

// Connect to database before handling requests
let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }
  }
  
  return app(req, res);
};

export default handler;