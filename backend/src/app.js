require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/error.middleware');
const weatherRoutes = require('./routes/weather.routes');
const cacheRoutes = require('./routes/cache.routes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/weather', weatherRoutes);
app.use('/api/cache', cacheRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
