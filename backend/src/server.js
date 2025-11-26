import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import serverless from 'serverless-http';

const PORT = process.env.PORT || 5000;

// Check if running on Vercel (serverless)
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';

let isConnected = false;

// Database connection with reuse for serverless
const connect = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await connectDB();
    isConnected = true;
    console.log('New database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Top-level serverless handler so the export can be top-level
const handler = async (req, res) => {
  try {
    await connect();
    const serverlessHandler = serverless(app);
    return await serverlessHandler(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

if (isVercel) {
  // SERVERLESS MODE (Vercel)
  console.log('Running in serverless mode (Vercel)');
} else {
  // LOCAL DEVELOPMENT MODE
  console.log('Running in local development mode');
  
  // Connect to MongoDB
  connect();

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`✅ Faith Connect API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

// Export handler at top level (valid ES module export)
export default handler;