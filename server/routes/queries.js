import { Router } from 'express';
const router = Router();
import {execute,analyze} from '../controller/queries.js'

router.post('/execute',execute);
router.post('/analyze',analyze);

export default router;