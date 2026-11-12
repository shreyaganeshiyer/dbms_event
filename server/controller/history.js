import { listHistory, removeHistoryItem, clearHistory } from '../utility/historyDb.js';

export async function getHistory(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  try {
    const items = await listHistory(req.user.id, limit);
    res.json({ ok: true, items });
  } catch (err) {
    console.error('listHistory failed:', err);
    res.status(500).json({ ok: false, message: 'Could not load history.' });
  }
}

export async function deleteHistory(req, res) {
  try {
    const removed = await removeHistoryItem(req.user.id, req.params.id);
    if (!removed) {
      return res.status(404).json({ ok: false, message: 'History item not found.' });
    }
    res.json({ ok: true, message: 'Deleted.' });
  } catch (err) {
    console.error('removeHistoryItem failed:', err);
    res.status(500).json({ ok: false, message: 'Could not delete this item.' });
  }
}

export async function clearAllHistory(req, res) {
  try {
    await clearHistory(req.user.id);
    res.json({ ok: true, message: 'History cleared.' });
  } catch (err) {
    console.error('clearHistory failed:', err);
    res.status(500).json({ ok: false, message: 'Could not clear history.' });
  }
}