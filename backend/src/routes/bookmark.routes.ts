import { Router } from 'express';
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmark.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBookmarks);
router.post('/', authenticate, addBookmark);
router.delete('/:id', authenticate, removeBookmark);

export default router;
