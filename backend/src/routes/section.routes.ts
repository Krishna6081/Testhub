import { Router } from 'express';
import { getSections, getSectionById, createSection, updateSection, deleteSection } from '../controllers/section.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createSectionSchema, updateSectionSchema } from '../validators/section.validator';

const router = Router();

router.get('/', getSections);
router.get('/:id', getSectionById);
router.post('/', authenticate, authorizeAdmin, validateBody(createSectionSchema), createSection);
router.put('/:id', authenticate, authorizeAdmin, validateBody(updateSectionSchema), updateSection);
router.delete('/:id', authenticate, authorizeAdmin, deleteSection);

export default router;
