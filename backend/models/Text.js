const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  originalText: { type: String, required: true },
  paraphrasedText: { type: String, required: true },
  mode: { type: String, default: 'academic' },
  stats: {
    plagiarismBefore: Number,
    plagiarismAfter: Number,
    aiDetectionBefore: Number,
    aiDetectionAfter: Number,
  },
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // auto-delete after 24h
});

module.exports = mongoose.models.Text || mongoose.model('Text', TextSchema);
