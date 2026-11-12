import { friendlyError } from '../errors.js';
import { validateReadOnly, SqlGuardError } from '../sqlGuard.js';
import {requireConnection,extractLine} from '../utility/queries_utils.js'

import { recordQuery } from '../utility/historyDb.js';
import { getActiveMeta } from '../pool.js';

const QUERY_TIMEOUT_MS = 10000; 
const MAX_ROWS = 1000;   


export async function execute(req, res) {
    const pool = requireConnection(res);
    if (!pool) return;

    const rawSql = req.body?.sql;
    const connectionName = getActiveMeta()?.name ?? null;
    const started = Date.now();

    let sql;
    try {
        sql = validateReadOnly(rawSql);
    } catch (err) {
        if (err instanceof SqlGuardError) {
            recordQuery(req.user.id, {
                sql: String(rawSql ?? ''),
                connectionName,
                status: 'error',
                durationMs: 0,
                errorMessage: err.message,
            });
            return res.status(400).json({ ok: false, kind: 'guard', message: err.message });
        }
        throw err;
    }

    try {
        const [rows, fields] = await pool.query({ sql, timeout: QUERY_TIMEOUT_MS });
        const allRows = Array.isArray(rows) ? rows : [];
        const durationMs = Date.now() - started;

        recordQuery(req.user.id, {
            sql,
            connectionName,
            status: 'success',
            rowCount: allRows.length,
            durationMs,
        });

        res.json({
            ok: true,
            columns: (fields ?? []).map((f) => f.name),
            rows: allRows.slice(0, MAX_ROWS),
            rowCount: allRows.length,
            truncated: allRows.length > MAX_ROWS,
            durationMs,
        });
    } catch (err) {
        const durationMs = Date.now() - started;
        const message = err.sqlMessage || friendlyError(err);

        recordQuery(req.user.id, {
            sql,
            connectionName,
            status: 'error',
            durationMs,
            errorMessage: message,
        });

        res.status(400).json({
            ok: false,
            kind: 'sql',
            message,
            code: err.code ?? null,
            line: extractLine(err.sqlMessage),
            durationMs,
        });
    }
}

export async function analyze(req, res){
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
}


