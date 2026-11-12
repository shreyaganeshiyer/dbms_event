import { activate_pool } from '../pool.js';
import { readDetails } from '../utility/readForm.js';
import { friendlyError } from '../errors.js';
import {
  listSaved,
  addSaved,
  removeSaved,
  getSavedDetails,
} from '../utility/savedConnections.js';

export async function listSavedConnections(req, res) {
  try {
    const connections = await listSaved(req.user.id);
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
    const connection = await addSaved(req.user.id, details);
    res.json({ ok: true, message: 'Saved.', connection });
  } catch (err) {
    console.error('addSaved failed:', err);
    res.status(500).json({ ok: false, message: 'Could not save this connection.' });
  }
}

export async function deleteSaved(req, res) {
  try {
    const removed = await removeSaved(req.user.id, req.params.id);
    if (!removed) {
      return res.status(404).json({ ok: false, message: 'Saved connection not found.' });
    }
    res.json({ ok: true, message: 'Deleted.' });
  } catch (err) {
    console.error('removeSaved failed:', err);
    res.status(500).json({ ok: false, message: 'Could not delete this connection.' });
  }
}

export async function connectSaved(req, res) {
  try {
    const saved = await getSavedDetails(req.user.id, req.params.id);
    if (!saved) {
      return res.status(404).json({ ok: false, message: 'Saved connection not found.' });
    }
    const connection = await activate_pool(saved);
    res.json({ ok: true, message: 'Connected.', connection });
  } catch (err) {
    res.status(400).json({ ok: false, message: friendlyError(err) });
  }
}