import dotenv from 'dotenv';
dotenv.config();

import serverless from 'serverless-http';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Connect to the database on cold start
connectDB();

// Export serverless handler for Vercel (or other serverless platforms)
export default serverless(app);
