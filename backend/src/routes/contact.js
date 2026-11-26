import { Router } from 'express';
import { firestore } from '../config/firebase.js';
import { CONTACT_COLLECTION } from '../models/Portfolio.js';
const router = Router();
const limit = (value, max) => String(value || '').trim().slice(0, max);
router.post('/', async (req, res) => {
  const name = limit(req.body?.name, 100);
  const email = limit(req.body?.email, 180);
  const subject = limit(req.body?.subject, 180);
  const message = limit(req.body?.message, 5000);
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return res.status(400).json({ error: 'Please provide a valid name, email and message.' });
  }
  if (!firestore) return res.status(503).json({ error: 'Firebase is not configured on the API.' });
  try {
    await firestore.collection(CONTACT_COLLECTION).add({
      name, email, subject, message, status: 'unread',
      createdAt: new Date().toISOString()
    });
    return res.status(201).json({ message: 'Thanks! Your message has been received.' });
  } catch {
    return res.status(500).json({ error: 'Your message could not be saved. Please try again later.' });
  }
});
export default router;
