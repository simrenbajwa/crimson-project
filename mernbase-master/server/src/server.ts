import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/db';
import authRoutes from './routes/authRoute';

dotenv.config({ path: './.env' });

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(bodyParser.json());

connectDB()
  .then(() => {
    console.log('Database connection established, starting the server...');
  })
  .catch((err) => {
    console.error('Failed to connect to the database. Exiting...', err);
    process.exit(1);
  });

// Test route
app.get('/home', (req: Request, res: Response) => {
  res.send('Welcome to the AI Model API');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
