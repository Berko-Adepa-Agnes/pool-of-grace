const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to get user ID
const getUserId = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access. Please login.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'poolofgrace_secret_key_2026');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// GET mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await db.getMentors();
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST book session
router.post('/book', getUserId, async (req, res) => {
  try {
    const { mentorId, type, date, time, notes } = req.body;

    if (!mentorId || !type || !date || !time) {
      return res.status(400).json({ message: 'Please provide mentorId, type, date and time' });
    }

    const booking = await db.saveBooking({
      userId: req.userId,
      mentorId: parseInt(mentorId),
      type,
      date,
      time,
      notes: notes || ''
    });

    res.status(201).json({ message: 'Mentorship session booked successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET user sessions (bookings)
router.get('/sessions', getUserId, async (req, res) => {
  try {
    const allBookings = await db.getBookings();
    
    let userBookings;
    if (req.userRole === 'admin') {
      userBookings = allBookings; // Admins see all bookings
    } else {
      userBookings = allBookings.filter(b => b.userId === req.userId);
    }
    
    // Fetch mentors and users for detail mapping
    const mentors = await db.getMentors();
    const users = await db.getUsers();

    const enrichedBookings = userBookings.map(b => {
      const mentor = mentors.find(m => m.id === b.mentorId);
      const userObj = users.find(u => u.id === b.userId);
      return {
        ...b,
        mentorName: mentor ? mentor.name : 'Unknown Mentor',
        mentorRole: mentor ? mentor.role : 'Mentor',
        mentorCompany: mentor ? mentor.company : '',
        participantName: userObj ? `${userObj.firstName} ${userObj.lastName}` : 'Participant'
      };
    });

    res.json({ bookings: enrichedBookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
