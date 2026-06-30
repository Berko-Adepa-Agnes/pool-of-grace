const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
require('dotenv').config();
const db = require('./db');
const seed = require('./seed');

const app = express();

/* =========================================================
   Security Headers
   Adds X-Frame-Options, X-Content-Type-Options,
   Strict-Transport-Security, and more.
   ========================================================= */
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

/* =========================================================
   CORS Configuration
   Only your frontend can call the API.
   ========================================================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL,       // Set in production (e.g. your Render URL)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, same-origin in prod)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

/* =========================================================
   XSS Input Sanitization Middleware
   Strips malicious HTML/JS from all string fields in
   request bodies before they reach route handlers.
   ========================================================= */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  return value;
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  next();
});

/* =========================================================
   Rate Limiting on Auth Routes
   Max 10 login/register attempts per IP per 15 minutes.
   ========================================================= */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                      // 10 attempts per window
  message: { message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api', (req, res) => {
  res.json({ message: 'Pool of Grace API is running!' });
});

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/modules', require('./routes/modules'));

// Persistent routes
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/forum', require('./routes/forum'));

/* Careers route */
app.use('/api/careers', require('./routes/careers'));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// Initialize Database & Run Seed on every startup to keep content fresh
db.initDb().then(async () => {
  try {
    console.log('Running database seed (upsert)...');
    await seed();
    console.log('Database seed completed successfully!');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database. Server cannot start.', err);
});