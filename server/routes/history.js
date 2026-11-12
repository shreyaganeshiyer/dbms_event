import { Router } from 'express';
import { getHistory, deleteHistory, clearAllHistory } from '../controller/history.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getHistory);
router.delete('/', clearAllHistory);
router.delete('/:id', deleteHistory);

export default router;