import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import portfolioRoutes from './routes/portfolio.js';
import mediaRoutes from './routes/media.js';
import contactRoutes from './routes/contact.js';

const app = express();
const port = Number(process.env.PORT || 5000);
const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map(v => v.trim());
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) return callback(null, true); return callback(new Error('Origin is not allowed by CORS')); }, credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'portfolio-api', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', rateLimit({ windowMs: 60 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false }), contactRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message }); });

try {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy backend/.env.example to backend/.env and configure it.');
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`));
} catch (error) {
  console.error(`[Startup] ${error.message}`);
  process.exit(1);
}
