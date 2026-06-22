const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db');
const seed = require('./seed');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Pool of Grace API is running!' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/modules', require('./routes/modules'));

// New persistent routes
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/forum', require('./routes/forum'));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  app.get('/{*path}', (req, res) => {
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