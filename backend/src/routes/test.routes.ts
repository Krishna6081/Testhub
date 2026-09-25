import { Router } from 'express';
import {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  startTest,
  submitTest,
} from '../controllers/test.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createTestSchema, updateTestSchema, submitTestSchema } from '../validators/test.validator';

const router = Router();

router.get('/', getTests);
router.get('/:id', getTestById);
router.post('/', authenticate, authorizeAdmin, validateBody(createTestSchema), createTest);
router.put('/:id', authenticate, authorizeAdmin, validateBody(updateTestSchema), updateTest);
router.delete('/:id', authenticate, authorizeAdmin, deleteTest);

router.post('/:id/start', authenticate, startTest);
router.post('/:id/submit', authenticate, validateBody(submitTestSchema), submitTest);

export default router;
