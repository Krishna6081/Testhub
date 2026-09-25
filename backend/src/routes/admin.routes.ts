import { Router } from 'express';
import { getUsers, toggleUserStatus, getAdminStatistics, getAdminAttempts } from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/statistics', getAdminStatistics);
router.get('/attempts', getAdminAttempts);

export default router;
