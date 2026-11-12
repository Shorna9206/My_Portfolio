import { Router } from 'express';
import Portfolio from '../models/Portfolio.js';
import { requireAdmin } from '../middleware/auth.js';
const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    const record = await Portfolio.findOne({ key: 'main' }).lean();
    res.set('Cache-Control', 'no-store');
    res.json({ content: record?.content || null, updatedAt: record?.updatedAt || null });
  } catch (error) { next(error); }
});
router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const content = req.body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) return res.status(400).json({ error: 'A valid content object is required.' });
    const record = await Portfolio.findOneAndUpdate(
      { key: 'main' },
      { $set: { content, updatedBy: req.admin.email || req.admin.uid } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    res.json({ message: 'Portfolio published successfully.', content: record.content, updatedAt: record.updatedAt });
  } catch (error) { next(error); }
});
export default router;
