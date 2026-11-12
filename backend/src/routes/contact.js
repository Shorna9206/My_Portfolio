import { Router } from 'express';
const router = Router();
const limit = (value, max) => String(value || '').trim().slice(0, max);
router.post('/', async (req, res) => {
  const name = limit(req.body?.name, 100), email = limit(req.body?.email, 180), subject = limit(req.body?.subject, 180), message = limit(req.body?.message, 5000);
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !message) return res.status(400).json({ error: 'Please provide a valid name, email and message.' });
  // Store contact submissions in MongoDB using the same portfolio database.
  const mongoose = (await import('mongoose')).default;
  const Contact = mongoose.models.Contact || mongoose.model('Contact', new mongoose.Schema({ name: String, email: String, subject: String, message: String, status: { type: String, default: 'new' } }, { timestamps: true }));
  try { await Contact.create({ name, email, subject, message }); return res.status(201).json({ message: 'Thanks! Your message has been received.' }); }
  catch { return res.status(500).json({ error: 'Your message could not be saved. Please try again later.' }); }
});
export default router;
