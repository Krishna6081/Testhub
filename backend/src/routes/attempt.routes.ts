import { Router } from 'express';
import { getUserAttempts, getAttemptDetails } from '../controllers/attempt.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUserAttempts);
router.get('/:id', authenticate, getAttemptDetails);

export default router;
