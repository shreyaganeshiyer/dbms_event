import { Router } from 'express';
import { test, connect, active, deactivate } from '../controller/connections.js';
import {
  listSavedConnections,
  saveConnection,
  deleteSaved,
  connectSaved,
} from '../controller/savedConnections.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.post('/test', test);
router.post('/connect', connect);
router.get('/active', active);
router.post('/disconnect', deactivate);

router.get('/saved', listSavedConnections);
router.post('/saved', saveConnection);
router.delete('/saved/:id', deleteSaved);
router.post('/saved/:id/connect', connectSaved);

export default router;