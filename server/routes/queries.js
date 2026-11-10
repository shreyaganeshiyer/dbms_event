import { Router } from 'express';
const router = Router();

import { validateReadOnly, SqlGuardError } from '../sqlGuard.js';

// currently idont have theseee
import { getActivePool } from '../pool.js';
import { friendlyError } from '../errors.js';



const QUERY_TIMEOUT_MS = 10000; // stop queries that run longer than 10 seconds
const MAX_ROWS = 1000;          // cap what goes back to the browser

// Returns the active pool, or sends a 409 and returns null
function requireConnection(res) {
    const pool = getActivePool();
    if (!pool) {
        res.status(409).json({
            ok: false,
            message: 'No database connected. Connect a database first.',
        });
        return null;
    }
    return pool;
}

// MySQL includes "at line N" in syntax error messages. Pull that number out for the frontend - editor.
// from actual database
function extractLine(sqlMessage = '') {
    const match = / at line (\d+) /i.exec(sqlMessage);
    return match ? Number(match[1]) : null;
}

// POST /api/queries/execute
// Runs a read-only query and returns the rows.

router.post('/execute', async (req, res) => {
    const pool = requireConnection(res);
    if (!pool) return;

    let sql;
    try {
        sql = validateReadOnly(req.body?.sql);
    } catch (err) {
        if (err instanceof SqlGuardError) {
            return res.status(400).json({ ok: false, kind: 'guard', message: err.message });
        }
        throw err;
    }

    const started = Date.now();
    try {
        const [rows, fields] = await pool.query({ sql, timeout: QUERY_TIMEOUT_MS });
        const allRows = Array.isArray(rows) ? rows : [];

        res.json({
            ok: true,
            columns: (fields ?? []).map((f) => f.name),
            //If fields is NOT null or undefined → use fields.
            //If fields IS null or undefined → use [].
            rows: allRows.slice(0, MAX_ROWS),
            rowCount: allRows.length,
            truncated: allRows.length > MAX_ROWS,
            durationMs: Date.now() - started,
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            kind: 'sql',
            message: err.sqlMessage || friendlyError(err),
            code: err.code ?? null,
            line: extractLine(err.sqlMessage),
            durationMs: Date.now() - started,
        });
    }
});

// POST /api/queries/analyze
// Runs EXPLAIN on a read-only query and returns the plan rows.
router.post('/analyze', async (req, res) => {
    const pool = requireConnection(res);
    if (!pool) return;
    // same shit
    let sql;
    try {
        sql = validateReadOnly(req.body?.sql);
    } catch (err) {
        if (err instanceof SqlGuardError) {
            return res.status(400).json({ ok: false, kind: 'guard', message: err.message });
        }
        throw err;
    }

    try {
        // EXPLAIN describes the plan without returning the query's data
        const [plan] = await pool.query({ sql: `EXPLAIN ${sql}`, timeout: QUERY_TIMEOUT_MS });
        res.json({ ok: true, plan });
    } catch (err) {
        res.status(400).json({
            ok: false,
            kind: 'sql',
            message: err.sqlMessage || friendlyError(err),
            code: err.code ?? null,
            line: extractLine(err.sqlMessage),
        });
    }
});

export default router;