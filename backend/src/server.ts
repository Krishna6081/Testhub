import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import sectionRoutes from './routes/section.routes';
import topicRoutes from './routes/topic.routes';
import questionRoutes from './routes/question.routes';
import testRoutes from './routes/test.routes';
import attemptRoutes from './routes/attempt.routes';
import bookmarkRoutes from './routes/bookmark.routes';
import dashboardRoutes from './routes/dashboard.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS configuration - Permissive for dev & production API access
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TestHub API is active and healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 TestHub Backend Server running on http://localhost:${PORT}`);
});

export default app;
