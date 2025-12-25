import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini auth service is running' });
});

app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

export default app;

