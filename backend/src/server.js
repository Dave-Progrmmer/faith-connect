import express from 'express';
import connectDB from './config/db.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Faith Connect Backend is running');
});

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});