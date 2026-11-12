import { friendlyError } from '../errors.js';
import { validateReadOnly, SqlGuardError } from '../sqlGuard.js';
import {requireConnection,extractLine} from '../utility/queries_utils.js'

const QUERY_TIMEOUT_MS = 10000; 
const MAX_ROWS = 1000;   


export async function execute(req, res){
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


