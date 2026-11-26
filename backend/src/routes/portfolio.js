import { Router } from 'express';
import { firestore, firebaseAdmin } from '../config/firebase.js';
import { requireAdmin } from '../middleware/auth.js';
import { PORTFOLIO_COLLECTION, PORTFOLIO_DOCUMENT } from '../models/Portfolio.js';

const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    if (!firestore) return res.status(503).json({ error: 'Firebase is not configured on the API.' });
    const snapshot = await firestore.collection(PORTFOLIO_COLLECTION).doc(PORTFOLIO_DOCUMENT).get();
    const data = snapshot.exists ? snapshot.data() : {};
    res.set('Cache-Control', 'no-store');
    res.json({ content: data.content || null, updatedAt: data.updatedAt?.toDate?.() || null });
  } catch (error) { next(error); }
});
router.put('/', requireAdmin, async (req, res, next) => {
  try {
    if (!firestore || !firebaseAdmin) return res.status(503).json({ error: 'Firebase is not configured on the API.' });
    const content = req.body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) return res.status(400).json({ error: 'A valid content object is required.' });
    const ref = firestore.collection(PORTFOLIO_COLLECTION).doc(PORTFOLIO_DOCUMENT);
    await ref.set({ content, updatedBy: req.admin.email || req.admin.uid, updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    const saved = await ref.get();
    const data = saved.data() || {};
    res.json({ message: 'Portfolio published successfully.', content: data.content, updatedAt: data.updatedAt?.toDate?.() || null });
  } catch (error) { next(error); }
});
export default router;
