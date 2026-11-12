import { getActivePool } from '../pool.js';

export function requireConnection(res) {
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


export function extractLine(sqlMessage = '') {
    const match = / at line (\d+) /i.exec(sqlMessage);
    return match ? Number(match[1]) : null;
}

