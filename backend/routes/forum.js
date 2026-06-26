const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Helper middleware to get authenticated user detail
// FIX 7: Look up user in DB to get their first name instead of leaking email
const getUserInfo = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'poolofgrace_secret_key_2026');

    // Look up user in database to get their actual first name (not email)
    const users = await db.getUsers();
    const user = users.find(u => u.id === decoded.id);
    req.userName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Participant';
    next();
  } catch (err) {
    // If verification fails but token was provided, fall back or deny
    return res.status(401).json({ message: 'Session expired. Please login again.' });
  }
};

// GET all forum posts with comments
router.get('/posts', async (req, res) => {
  try {
    const posts = await db.getForumPosts();
    const comments = await db.getForumComments();

    const postsWithComments = posts.map(p => {
      const postComments = comments
        .filter(c => c.postId === p.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return {
        ...p,
        comments: postComments
      };
    });

    res.json({ posts: postsWithComments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST new forum post
router.post('/posts', getUserInfo, async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: 'Title, category, and content are required' });
    }

    const newPost = await db.saveForumPost({
      title,
      category,
      content,
      author: req.userName
    });

    res.status(201).json({ message: 'Post created successfully', post: { ...newPost, comments: [] } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST reply comment on a post
router.post('/posts/:id/comments', getUserInfo, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.id);

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const newComment = await db.saveForumComment({
      postId,
      author: req.userName,
      content
    });

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
