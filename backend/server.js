const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const seed = require('./seed');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Pool of Grace API is running!' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/modules', require('./routes/modules'));

// New persistent routes
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/forum', require('./routes/forum'));

const PORT = process.env.PORT || 5000;

// Initialize Database & Run Seed if empty before starting the server
db.initDb().then(async () => {
  try {
    const modules = await db.getModules();
    if (modules.length === 0) {
      console.log('Modules database is empty. Seeding defaults...');
      await seed();
    }
  } catch (err) {
    console.error('Error during database checking/seeding:', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database. Server cannot start.', err);
});