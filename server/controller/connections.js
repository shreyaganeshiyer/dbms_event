import {testConnection, activate_pool, rm_active_pool, getActiveMeta,} from '../pool.js';
import { readDetails } from '../utility/readForm.js';
import { friendlyError } from '../errors.js';

export async function test(req, res) {
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
}

export async function connect(req, res) {
    const { details, error } = readDetails(req.body);
    if (error) return res.status(400).json({ ok: false, message: error });
    try {
        const connection = await activate_pool(details);
        res.json({ ok: true, message: 'Connected.', connection });
    } catch (err) {
        res.status(400).json({ ok: false, message: friendlyError(err) });
    }
}

export function active(req, res) {
    const connection = getActiveMeta();
    res.json({ ok: true, connected: Boolean(connection), connection });
}

export async function deactivate(req, res) {
    await rm_active_pool();
    res.json({ ok: true, message: 'Disconnected.' });
}


