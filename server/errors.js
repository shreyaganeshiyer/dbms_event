// Turns MySQL and Node network errors into messages a user can act on.
const MESSAGES = {
    ER_ACCESS_DENIED_ERROR: 'Access denied. Check the username and password.',
    ER_BAD_DB_ERROR: 'That database does not exist on this server.',
    ECONNREFUSED: 'Could not reach MySQL. Check the host and port, and make sure MySQL is running.',
    ENOTFOUND: 'That host name could not be found.',
    ETIMEDOUT: 'The connection timed out.',
    PROTOCOL_CONNECTION_LOST: 'The connection to MySQL was lost.',
};

export function friendlyError(err) {
    return MESSAGES[err?.code] || err?.sqlMessage || err?.message || 'Something went wrong.';
}