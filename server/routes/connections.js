import { Router } from 'express';
const router = Router();

import {test,connect,active,deactivate} from '../controller/connections.js'

router.post('/test',test);
router.post('/connect',connect);
router.get('/active',active );
router.post('/disconnect',deactivate);

export default router;