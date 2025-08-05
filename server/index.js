import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json());// body parser
app.use(cookieParser());// to read cookies 

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sentify server is running' });
});

// Routes
app.use('/api/auth', authRoutes);

// Test DB connection and start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);// means that all the routes are now available
    //and the server is responding
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1); // Exit with failure
  }
}

startServer();
