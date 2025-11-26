import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import serverless from 'serverless-http';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';

let isConnected = false;

// Connect to the database (with connection reuse)
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

// Wrap the handler to ensure DB connection
const handler = async (event, context) => {
  // Important for connection reuse
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connect();
    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

export default handler;