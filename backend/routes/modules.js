const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Helper to get user ID from token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'poolofgrace_secret_key_2026');
      return decoded.id;
    } catch (err) {
      return null;
    }
  }
  return null;
};

// GET all modules
router.get('/', async (req, res) => {
  try {
    const modules = await db.getModules();
    const userId = getUserIdFromToken(req);

    if (userId) {
      const completions = await db.getCompletions();
      const userCompletions = completions.filter(c => c.userId === userId);
      
      const modulesWithStatus = modules.map(m => {
        const completion = userCompletions.find(c => c.moduleId === m.id);
        return {
          ...m,
          completed: completion ? (completion.score >= 3 && completion.assignmentCompleted && completion.projectCompleted) : false,
          score: completion ? completion.score : null,
          assignmentCompleted: completion ? completion.assignmentCompleted : false,
          projectCompleted: completion ? completion.projectCompleted : false
        };
      });
      return res.json({ modules: modulesWithStatus });
    }

    res.json({ modules });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET module by ID
router.get('/:id', async (req, res) => {
  try {
    const modules = await db.getModules();
    const module = modules.find(m => m.id === parseInt(req.params.id));
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const userId = getUserIdFromToken(req);
    if (userId) {
      const completions = await db.getCompletions();
      const completion = completions.find(c => c.userId === userId && c.moduleId === module.id);
      return res.json({
        module: {
          ...module,
          completed: completion ? (completion.score >= 3 && completion.assignmentCompleted && completion.projectCompleted) : false,
          score: completion ? completion.score : null,
          assignmentCompleted: completion ? completion.assignmentCompleted : false,
          projectCompleted: completion ? completion.projectCompleted : false
        }
      });
    }

    res.json({ module });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST mark module as complete with score
router.post('/:id/complete', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    const { score, assignmentCompleted, projectCompleted } = req.body;
    const moduleId = parseInt(req.params.id);

    await db.saveCompletion(userId, moduleId, score, assignmentCompleted, projectCompleted);
    res.json({ message: 'Progress saved successfully', completed: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;