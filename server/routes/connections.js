import { Router } from 'express';
const router = Router();

import {
    testConnection,
    activate_pool,
    rm_active_pool,
    getActiveMeta,
} from '../pool.js';

import { friendlyError } from '../errors.js';


// Reads the request body and checks the required fields.
function readDetails(body = {}) {
    const details = {
        name: typeof body.name === 'string' ? body.name.trim() : '',
        host: String(body.host ?? '').trim(),
        port: Number(body.port) || 3306,
        database: String(body.database ?? '').trim(),
        username: String(body.username ?? '').trim(),
        password: String(body.password ?? ''),
    };

    if (!details.host || !details.database || !details.username || !details.password) {
        return { error: 'Host, database, username, and password are required.' };
    }
    return { details };
}

// POST /api/connections/test
router.post('/test', async (req, res) => {
    const { details, error } = readDetails(req.body);
    if (error) return res.status(400).json({ ok: false, message: error });

    try {
        const { version } = await testConnection(details);
        res.json({
            ok: true,
            message: `Connection successful - MySQL ${version.split('-')[0]} detected.`,
            version,
        });
    } catch (err) {
        res.status(400).json({ ok: false, message: friendlyError(err) });
    }
});

// POST /api/connections/connect
router.post('/connect', async (req, res) => {
    const { details, error } = readDetails(req.body);
    if (error) return res.status(400).json({ ok: false, message: error });

    try {
        const connection = await activate_pool(details);
        res.json({ ok: true, message: 'Connected.', connection });
    } catch (err) {
        res.status(400).json({ ok: false, message: friendlyError(err) });
    }
});

// GET /api/connections/active
router.get('/active', (req, res) => {
    const connection = getActiveMeta();
    res.json({ ok: true, connected: Boolean(connection), connection });
});

// POST /api/connections/disconnect
router.post('/disconnect', async (req, res) => {
    await rm_active_pool();
    res.json({ ok: true, message: 'Disconnected.' });
});

export default router;