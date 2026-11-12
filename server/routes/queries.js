import { Router } from 'express';
const router = Router();
import {execute,analyze} from '../controller/queries.js'
import { requireAuth } from '../middleware/requireAuth.js';



router.use(requireAuth);

router.post('/execute',execute);
router.post('/analyze',analyze);

export default router;