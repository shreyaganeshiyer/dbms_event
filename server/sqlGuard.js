// the queries allowed is READ ONLY to the database!

//1. Checks a SQL string before it reaches MySQL.
// 2.The read-only MySQL user is the second.

const ALLOWED_START = ['SELECT', 'WITH', 'SHOW', 'DESCRIBE', 'DESC', 'EXPLAIN'];

const BLOCKED_PATTERNS = [
    {
        re: /\bINTO\s+(OUTFILE|DUMPFILE)\b/i,
        msg: 'Writing to files is not allowed.'
    },
    {
        re: /\bLOAD_FILE\s*\(/i,
        msg: 'Reading server files is not allowed.'
    },
];

// handling these kinda error
export class SqlGuardError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SqlGuardError';
    }
}

// this is some regularExpression thing my brain is fried i can't
// this removes all comments are strings things from the query and not consider it as sql cmd

function stripLiteralsAndComments(sql) {
    const pattern = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`|\/\*[\s\S]*?\*\/|--[^\n]*|#[^\n]*/g;
    return sql.replace(pattern, ' ');
}

// Returns the SQL to run (trimmed, no trailing semicolon) or throws SqlGuardError.
export function validateReadOnly(input) {
    if (typeof input !== 'string' || !input.trim()) {
        throw new SqlGuardError('The editor is empty. Write a query first.');
    }

    const sql = input.trim().replace(/;\s*$/, '');

    const checkable = stripLiteralsAndComments(sql).trim();

    if (checkable.includes(';')) {
        throw new SqlGuardError('Only one statement can run at a time. Remove the extra semicolon.');
    }

    const firstWord = checkable.split(/\s+/)[0].toUpperCase();
    
    if (!ALLOWED_START.includes(firstWord)) {
        throw new SqlGuardError(
            `${firstWord} statements are not allowed. QueryLens only runs SELECT, SHOW, DESCRIBE, and EXPLAIN.`
        );
    }

    for (const { re, msg } of BLOCKED_PATTERNS) {
        if (re.test(checkable)) throw new SqlGuardError(msg);
    }

    return sql;
}
