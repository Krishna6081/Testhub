import { Router } from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  importQuestions,
} from '../controllers/question.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createQuestionSchema, updateQuestionSchema } from '../validators/question.validator';

const router = Router();

router.get('/', getQuestions);
router.post('/import', authenticate, authorizeAdmin, importQuestions);
router.get('/:id', getQuestionById);
router.post('/', authenticate, authorizeAdmin, validateBody(createQuestionSchema), createQuestion);
router.put('/:id', authenticate, authorizeAdmin, validateBody(updateQuestionSchema), updateQuestion);
router.delete('/:id', authenticate, authorizeAdmin, deleteQuestion);
router.post('/:id/duplicate', authenticate, authorizeAdmin, duplicateQuestion);

export default router;
