import { createUser, findUserByUsername } from '../userAuth/usersDb.js';
import { hashPassword, verifyPassword } from '../userAuth/passwords.js';
import { createSession, deleteSession } from '../userAuth/sessions.js';
import { COOKIE_NAME, readCookie, setSessionCookie, clearSessionCookie } from '../userAuth/cookies.js';

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

function readCredentials(body) {
  return {
    username: String(body?.username ?? '').trim(),
    password: String(body?.password ?? ''),
  };
}

export async function signup(req, res) {
  const { username, password } = readCredentials(req.body);

  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({ ok: false, message: 'Username must be 3-30 letters, numbers or underscores.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 8 characters.' });
  }

  try {
    if (await findUserByUsername(username)) { // ohhmagad
      return res.status(409).json({ ok: false, message: 'That username is taken.' });
    }

    const user = await createUser(username, await hashPassword(password));
    const { token, expires } = await createSession(user.id);

    setSessionCookie(res, token, expires);
    res.status(201).json({ ok: true, message: 'Account created.', user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, message: 'That username is taken.' });
    }
    console.error('signup failed:', err);
    res.status(500).json({ ok: false, message: 'Could not create your account.' });
  }
}

export async function login(req, res) {
  const { username, password } = readCredentials(req.body);

  try {
    const row = await findUserByUsername(username);

    const valid = row && (await verifyPassword(password, row.password_hash)); //fahhh
    if (!valid) {
      return res.status(401).json({ ok: false, message: 'Wrong username or password.' });
    }
    
    const { token, expires } = await createSession(row.id);
    setSessionCookie(res, token, expires);
    res.json({ ok: true, message: 'Logged in.', user: { id: row.id, username: row.username } });
  } catch (err) {
    console.error('login failed:', err);
    res.status(500).json({ ok: false, message: 'Could not log you in.' });
  }
}

export async function logout(req, res) {
  const token = readCookie(req.headers.cookie, COOKIE_NAME);
  try {
    if (token) await deleteSession(token);
  } catch (err) {
    console.error('logout failed:', err);
  }
  clearSessionCookie(res);
  res.json({ ok: true, message: 'Logged out.' });
}

// Runs after requireAuth, so req.user is already set.
export function me(req, res) {
  res.json({ ok: true, user: req.user });
}