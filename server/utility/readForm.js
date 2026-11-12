export function readDetails(body = {}) {
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

