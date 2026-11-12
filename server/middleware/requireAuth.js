import { COOKIE_NAME, readCookie } from '../userAuth/cookies.js';
import { findSession } from '../userAuth/sessions.js';

export async function requireAuth(req, res, next) {
  const token = readCookie(req.headers.cookie, COOKIE_NAME);
  if (!token) return res.status(401).json({ ok: false, message: 'Please log in.' });

  try {
    const user = await findSession(token);
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Session expired. Please log in again.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('requireAuth failed:', err);
    res.status(500).json({ ok: false, message: 'Could not check your session.' });
  }
}