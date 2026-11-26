import { Router } from 'express';
import { firestore } from '../config/firebase.js';
import { requireAdmin } from '../middleware/auth.js';
import { CONTACT_COLLECTION } from '../models/Portfolio.js';
const router = Router();
router.use(requireAdmin);
router.get('/', async (_req, res, next) => {
  try {
    if (!firestore) return res.status(503).json({ error: 'Firebase is not configured.' });
    const snap = await firestore.collection(CONTACT_COLLECTION).orderBy('createdAt', 'desc').limit(200).get();
    res.json({ messages: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) { next(error); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    const status = req.body?.status;
    if (!['unread', 'read', 'archived'].includes(status)) return res.status(400).json({ error: 'Invalid message status.' });
    await firestore.collection(CONTACT_COLLECTION).doc(req.params.id).update({ status });
    res.json({ message: 'Message updated.' });
  } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    await firestore.collection(CONTACT_COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Message deleted.' });
  } catch (error) { next(error); }
});
export default router;
