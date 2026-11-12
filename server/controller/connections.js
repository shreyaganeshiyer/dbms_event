import { testConnection, activate_pool, rm_active_pool, getActiveMeta, } from '../pool.js';
import { readDetails } from '../utility/readForm.js';
import { friendlyError } from '../errors.js';

import {
    listSaved,
    addSaved,
    removeSaved,
    getSavedDetails,
} from '../utility/savedConnections.js';

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


export async function listSavedConnections(req, res) {
    try {
        const connections = await listSaved();
        res.json({ ok: true, connections });
    } catch (err) {
        console.error('listSaved failed:', err);
        res.status(500).json({ ok: false, message: 'Could not load saved connections.' });
    }
}

export async function saveConnection(req, res) {
    const { details, error } = readDetails(req.body);
    if (error) return res.status(400).json({ ok: false, message: error });
    if (!details.name) {
        return res.status(400).json({ ok: false, message: 'Give this connection a name.' });
    }
    try {
        const connection = await addSaved(details);
        res.json({ ok: true, message: 'Saved.', connection });
    } catch (err) {
        console.error('addSaved failed:', err);
        res.status(500).json({ ok: false, message: 'Could not save this connection.' });
    }
}

export async function deleteSaved(req, res) {
    try {
        await removeSaved(req.params.id);
        res.json({ ok: true, message: 'Deleted.' });
    } catch (err) {
        console.error('removeSaved failed:', err);
        res.status(500).json({ ok: false, message: 'Could not delete this connection.' });
    }
}

export async function connectSaved(req, res) {
    try {
        const saved = await getSavedDetails(req.params.id);
        if (!saved) {
            return res.status(404).json({ ok: false, message: 'Saved connection not found.' });
        }
        const connection = await activate_pool(saved);
        res.json({ ok: true, message: 'Connected.', connection });
    } catch (err) {
        res.status(400).json({ ok: false, message: friendlyError(err) });
    }
}

