const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../.env.local' });

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ 
  origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please wait a moment.' },
});
app.use(limiter);

// ── MongoDB ─────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paraphrasing-x')
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => console.warn('⚠️  MongoDB not connected (continuing without DB):', err.message));

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ 
  status: 'ok', 
  port: PORT,
  timestamp: new Date().toISOString()
}));

// ── Fallback Route Info ─────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({ 
  message: 'Paraphrasing X Backend',
  version: '1.0.0',
  status: 'running',
  apiEndpoints: [
    'POST /api/test - Test endpoint',
    'GET /health - Health check'
  ],
  note: 'All main endpoints are served via Next.js API routes at http://localhost:3002/api/*'
}));

// ── Test Endpoint ───────────────────────────────────────────────────────────
app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'This endpoint does not exist. All AI processing endpoints are handled by Next.js.',
    path: req.path,
    availableEndpoints: ['/health', '/api/test']
  });
});

// ── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Paraphrasing X Backend running at http://localhost:${PORT}`);
  console.log(`📡  MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/paraphrasing-x'}`);
  console.log(`🌐  Frontend:  http://localhost:3002`);
  console.log(`📖  API Docs: http://localhost:${PORT}/health\n`);
});
