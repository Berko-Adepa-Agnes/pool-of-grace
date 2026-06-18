const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const DATA_DIR = path.join(__dirname, 'db_data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Config file locations
const getFilePath = (table) => path.join(DATA_DIR, `${table}.json`);

// Read from JSON file
const readJson = (table) => {
  const filePath = getFilePath(table);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${table}.json:`, err);
    return [];
  }
};

// Write to JSON file
const writeJson = (table, data) => {
  const filePath = getFilePath(table);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${table}.json:`, err);
    return false;
  }
};

let pool = null;
let usePostgres = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000
    });
    usePostgres = true;
    console.log('PostgreSQL database URL found. Initializing PostgreSQL pool...');
  } catch (err) {
    console.error('Failed to configure PostgreSQL pool. Falling back to JSON files.', err);
    usePostgres = false;
  }
}

// Simple test query to ensure PG connection actually works
const testPgConnection = async () => {
  if (!usePostgres) return;
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database!');
    client.release();
  } catch (err) {
    console.warn('PostgreSQL connection failed. Falling back to JSON files.', err.message);
    usePostgres = false;
  }
};

testPgConnection();

// Initial database structure schema definition
const INIT_SCHEMAS = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'participant',
      onboarding_data JSONB DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  modules: `
    CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      order_index INT NOT NULL,
      duration VARCHAR(50) NOT NULL,
      content JSONB NOT NULL
    );
  `,
  completions: `
    CREATE TABLE IF NOT EXISTS completions (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      module_id INT NOT NULL,
      score INT NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, module_id)
    );
  `,
  mentors: `
    CREATE TABLE IF NOT EXISTS mentors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      company VARCHAR(100) NOT NULL,
      experience VARCHAR(50) NOT NULL,
      speciality VARCHAR(255) NOT NULL,
      location VARCHAR(100) NOT NULL,
      available VARCHAR(100) NOT NULL
    );
  `,
  bookings: `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      mentor_id INT NOT NULL,
      session_type VARCHAR(100) NOT NULL,
      booking_date VARCHAR(50) NOT NULL,
      booking_time VARCHAR(50) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  forum_posts: `
    CREATE TABLE IF NOT EXISTS forum_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  forum_comments: `
    CREATE TABLE IF NOT EXISTS forum_comments (
      id SERIAL PRIMARY KEY,
      post_id INT NOT NULL,
      author VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
};

const initDb = async () => {
  if (usePostgres) {
    try {
      for (const table in INIT_SCHEMAS) {
        await pool.query(INIT_SCHEMAS[table]);
      }
      console.log('PostgreSQL database schemas verified/created.');
    } catch (err) {
      console.error('Schema initialization failed, falling back to JSON...', err);
      usePostgres = false;
    }
  }

  // Ensure JSON files exist with correct data structure
  Object.keys(INIT_SCHEMAS).forEach((table) => {
    const file = getFilePath(table);
    if (!fs.existsSync(file)) {
      writeJson(table, []);
    }
  });
};

// Unified DB methods
const db = {
  initDb,

  // USERS
  getUsers: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users');
      return res.rows.map(u => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        passwordHash: u.password_hash,
        role: u.role,
        onboardingData: u.onboarding_data
      }));
    }
    return readJson('users');
  },

  getUserByEmail: async (email) => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (res.rows.length === 0) return null;
      const u = res.rows[0];
      return {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        passwordHash: u.password_hash,
        role: u.role,
        onboardingData: u.onboarding_data
      };
    }
    const users = readJson('users');
    return users.find(u => u.email === email) || null;
  },

  saveUser: async (user) => {
    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, role, onboarding_data)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, first_name, last_name, email, role`,
        [user.firstName, user.lastName, user.email, user.passwordHash, user.role || 'participant', null]
      );
      const u = res.rows[0];
      return {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        role: u.role
      };
    }
    const users = readJson('users');
    const newUser = {
      id: users.length + 1,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role || 'participant',
      onboardingData: null
    };
    users.push(newUser);
    writeJson('users', users);
    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role
    };
  },

  updateUserOnboarding: async (id, onboardingData) => {
    if (usePostgres) {
      await pool.query('UPDATE users SET onboarding_data = $1 WHERE id = $2', [onboardingData, id]);
      return true;
    }
    const users = readJson('users');
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      users[index].onboardingData = onboardingData;
      writeJson('users', users);
      return true;
    }
    return false;
  },

  // MODULES
  getModules: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM modules ORDER BY order_index ASC');
      return res.rows.map(m => ({
        id: m.id,
        title: m.title,
        category: m.category,
        description: m.description,
        order: m.order_index,
        duration: m.duration,
        content: m.content
      }));
    }
    return readJson('modules').sort((a, b) => a.order - b.order);
  },

  saveModules: async (modulesList) => {
    if (usePostgres) {
      // Clear modules first to avoid collision on seed
      await pool.query('DELETE FROM modules');
      for (const m of modulesList) {
        await pool.query(
          `INSERT INTO modules (id, title, category, description, order_index, duration, content)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [m.id, m.title, m.category, m.description, m.order, m.duration, m.content]
        );
      }
      return true;
    }
    writeJson('modules', modulesList);
    return true;
  },

  // MENTORS
  getMentors: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM mentors ORDER BY id ASC');
      return res.rows;
    }
    return readJson('mentors');
  },

  saveMentors: async (mentorsList) => {
    if (usePostgres) {
      await pool.query('DELETE FROM mentors');
      for (const m of mentorsList) {
        await pool.query(
          `INSERT INTO mentors (id, name, role, company, experience, speciality, location, available)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [m.id, m.name, m.role, m.company, m.experience, m.speciality, m.location, m.available]
        );
      }
      return true;
    }
    writeJson('mentors', mentorsList);
    return true;
  },

  // BOOKINGS
  getBookings: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
      return res.rows.map(b => ({
        id: b.id,
        userId: b.user_id,
        mentorId: b.mentor_id,
        type: b.session_type,
        date: b.booking_date,
        time: b.booking_time,
        notes: b.notes
      }));
    }
    return readJson('bookings');
  },

  saveBooking: async (booking) => {
    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO bookings (user_id, mentor_id, session_type, booking_date, booking_time, notes)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [booking.userId, booking.mentorId, booking.type, booking.date, booking.time, booking.notes]
      );
      return { ...booking, id: res.rows[0].id };
    }
    const bookings = readJson('bookings');
    const newBooking = {
      id: bookings.length + 1,
      userId: booking.userId,
      mentorId: booking.mentorId,
      type: booking.type,
      date: booking.date,
      time: booking.time,
      notes: booking.notes
    };
    bookings.push(newBooking);
    writeJson('bookings', bookings);
    return newBooking;
  },

  // FORUM POSTS
  getForumPosts: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM forum_posts ORDER BY id DESC');
      return res.rows.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        content: p.content,
        author: p.author,
        createdAt: p.created_at
      }));
    }
    return readJson('forum_posts');
  },

  saveForumPost: async (post) => {
    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO forum_posts (title, category, content, author)
         VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
        [post.title, post.category, post.content, post.author]
      );
      return { ...post, id: res.rows[0].id, createdAt: res.rows[0].created_at };
    }
    const posts = readJson('forum_posts');
    const newPost = {
      id: posts.length + 1,
      title: post.title,
      category: post.category,
      content: post.content,
      author: post.author,
      createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    writeJson('forum_posts', posts);
    return newPost;
  },

  // FORUM COMMENTS
  getForumComments: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM forum_comments ORDER BY id ASC');
      return res.rows.map(c => ({
        id: c.id,
        postId: c.post_id,
        author: c.author,
        content: c.content,
        createdAt: c.created_at
      }));
    }
    return readJson('forum_comments');
  },

  saveForumComment: async (comment) => {
    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO forum_comments (post_id, author, content)
         VALUES ($1, $2, $3) RETURNING id, created_at`,
        [comment.postId, comment.author, comment.content]
      );
      return { ...comment, id: res.rows[0].id, createdAt: res.rows[0].created_at };
    }
    const comments = readJson('forum_comments');
    const newComment = {
      id: comments.length + 1,
      postId: comment.postId,
      author: comment.author,
      content: comment.content,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    writeJson('forum_comments', comments);
    return newComment;
  },

  // PROGRESS / COMPLETIONS
  getCompletions: async () => {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM completions');
      return res.rows.map(c => ({
        id: c.id,
        userId: c.user_id,
        moduleId: c.module_id,
        score: c.score,
        completedAt: c.completed_at
      }));
    }
    return readJson('completions');
  },

  saveCompletion: async (userId, moduleId, score) => {
    if (usePostgres) {
      await pool.query(
        `INSERT INTO completions (user_id, module_id, score)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, module_id) DO UPDATE SET score = EXCLUDED.score`,
        [userId, moduleId, score]
      );
      return true;
    }
    const completions = readJson('completions');
    const index = completions.findIndex(c => c.userId === parseInt(userId) && c.moduleId === parseInt(moduleId));
    if (index !== -1) {
      completions[index].score = score;
      completions[index].completedAt = new Date().toISOString();
    } else {
      completions.push({
        id: completions.length + 1,
        userId: parseInt(userId),
        moduleId: parseInt(moduleId),
        score,
        completedAt: new Date().toISOString()
      });
    }
    writeJson('completions', completions);
    return true;
  }
};

module.exports = db;
