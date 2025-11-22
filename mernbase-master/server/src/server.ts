import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/db';
import authRoutes from './routes/authRoute';

dotenv.config({ path: './.env' });

const app = express();

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true, // allow cookies / auth headers
};

app.use(cors(corsOptions));
// Optional but nice: handle preflight explicitly
app.options('*', cors(corsOptions));

app.use(express.json()); // you can drop bodyParser.json() if you use this

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
