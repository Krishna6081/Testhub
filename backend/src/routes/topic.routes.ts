import { Router } from 'express';
import { getTopics, getTopicById, createTopic, updateTopic, deleteTopic } from '../controllers/topic.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createTopicSchema, updateTopicSchema } from '../validators/topic.validator';

const router = Router();

router.get('/', getTopics);
router.get('/:id', getTopicById);
router.post('/', authenticate, authorizeAdmin, validateBody(createTopicSchema), createTopic);
router.put('/:id', authenticate, authorizeAdmin, validateBody(updateTopicSchema), updateTopic);
router.delete('/:id', authenticate, authorizeAdmin, deleteTopic);

export default router;
