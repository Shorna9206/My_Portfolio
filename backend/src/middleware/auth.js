import { firebaseAdmin } from '../config/firebase.js';
export async function requireAdmin(req, res, next) {
  try {
    if (!firebaseAdmin) return res.status(503).json({ error: 'Authentication service is not configured on the API.' });
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Authentication token is required.' });
    const decoded = await firebaseAdmin.auth().verifyIdToken(token, true);
    if (decoded.admin !== true) return res.status(403).json({ error: 'Administrator access is required.' });
    req.admin = decoded;
    next();
  } catch { return res.status(401).json({ error: 'Your session is invalid or expired. Please sign in again.' }); }
}
