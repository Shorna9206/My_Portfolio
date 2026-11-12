import mongoose from 'mongoose';
const portfolioSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true, index: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedBy: { type: String, default: 'system' }
}, { timestamps: true, minimize: false });
export default mongoose.model('Portfolio', portfolioSchema);
