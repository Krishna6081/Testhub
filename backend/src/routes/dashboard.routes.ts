import { Router } from 'express';
import { getDashboardStats, getPerformanceAnalytics, getWeakTopics } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getDashboardStats);
router.get('/performance', authenticate, getPerformanceAnalytics);
router.get('/weak-topics', authenticate, getWeakTopics);

export default router;
