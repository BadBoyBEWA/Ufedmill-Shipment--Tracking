require('dotenv').config();

// ============================================================
// Environment Validation — Fail fast on missing secrets
// ============================================================
const CRITICAL_ENV = ['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'DATABASE_URL', 'FRONTEND_URL'];
for (const key of CRITICAL_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Missing critical environment variable: ${key}`);
    process.exit(1);
  }
}

const MAILGUN_CONFIGURED = !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
if (!MAILGUN_CONFIGURED) {
  console.warn('⚠️ Mailgun not configured. Password reset links will be logged to console only.');
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters long.');
  process.exit(1);
}
if (process.env.REFRESH_TOKEN_SECRET.length < 32) {
  console.error('❌ REFRESH_TOKEN_SECRET must be at least 32 characters long.');
  process.exit(1);
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { apiRateLimiter } = require('./middleware/rateLimit');

// Route modules
const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipments');
const dashboardRoutes = require('./routes/dashboard');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;


// ===================================

// ============================================================
// Middleware
// ============================================================
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Required for HTTP-only cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(apiRateLimiter);

// ============================================================
// Health check
// ============================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================
// Routes
// ============================================================
app.use('/api/admin', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);

// ============================================================
// 404 handler
// ============================================================
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ============================================================
// Global error handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// ============================================================
// Start server
// ============================================================
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Ufedmill API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
