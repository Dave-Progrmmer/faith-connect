import 'dotenv/config';
import connectDB from './config/db';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// Connect to the database
connectDB();