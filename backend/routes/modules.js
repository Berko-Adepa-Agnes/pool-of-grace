const express = require('express');
const router = express.Router();

const modules = [
  { id:1, title:'Understanding Your Worth', category:'self-worth', description:'Discover your identity and challenge limiting beliefs about yourself and technology.', order:1, duration:'45 minutes' },
  { id:2, title:'Breaking Cultural Barriers', category:'self-worth', description:'Explore cultural narratives about women in technology and rewrite your story.', order:2, duration:'50 minutes' },
  { id:3, title:'Building Confidence in Tech', category:'self-worth', description:'Develop self-efficacy and belief in your ability to succeed in technology.', order:3, duration:'40 minutes' },
  { id:4, title:'Overcoming Fear of Failure', category:'self-worth', description:'Learn how to embrace mistakes as part of your learning journey.', order:4, duration:'45 minutes' },
  { id:5, title:'Your Vision and Goals', category:'self-worth', description:'Create a clear vision for your technology career and set achievable goals.', order:5, duration:'50 minutes' },
  { id:6, title:'Community and Support Systems', category:'self-worth', description:'Build your support network and learn how community accelerates growth.', order:6, duration:'40 minutes' },
  { id:7, title:'Celebrating Your Progress', category:'self-worth', description:'Recognize and celebrate your achievements on your technology journey.', order:7, duration:'35 minutes' },
  { id:8, title:'Introduction to HTML and CSS', category:'technical-skills', description:'Learn the building blocks of web development from absolute scratch.', order:8, duration:'60 minutes' },
  { id:9, title:'JavaScript Fundamentals', category:'technical-skills', description:'Learn programming logic and JavaScript basics with hands-on exercises.', order:9, duration:'75 minutes' },
  { id:10, title:'Building Your First Website', category:'technical-skills', description:'Put your HTML CSS and JavaScript skills together to build a real website.', order:10, duration:'90 minutes' },
  { id:11, title:'Introduction to Python', category:'technical-skills', description:'Learn Python programming from scratch with practical Ghanaian examples.', order:11, duration:'75 minutes' },
  { id:12, title:'Databases and SQL', category:'technical-skills', description:'Understand how data is stored and learn to query databases using SQL.', order:12, duration:'60 minutes' },
  { id:13, title:'Web Development Project', category:'technical-skills', description:'Build a complete web application project for your portfolio.', order:13, duration:'120 minutes' },
  { id:14, title:'Version Control with GitHub', category:'technical-skills', description:'Learn how to use GitHub to manage and share your code professionally.', order:14, duration:'60 minutes' },
  { id:15, title:'Ghana Tech Job Market', category:'professional-development', description:'Discover technology career opportunities and salary expectations in Ghana.', order:15, duration:'45 minutes' },
  { id:16, title:'Building Your CV and Portfolio', category:'professional-development', description:'Create a professional CV and portfolio that showcases your tech skills.', order:16, duration:'60 minutes' },
  { id:17, title:'Interview Preparation', category:'professional-development', description:'Prepare for technology job interviews with practice questions and techniques.', order:17, duration:'60 minutes' },
  { id:18, title:'Networking and LinkedIn', category:'professional-development', description:'Build your professional network and create a strong LinkedIn presence.', order:18, duration:'45 minutes' },
  { id:19, title:'Freelancing and Entrepreneurship', category:'professional-development', description:'Explore freelancing opportunities and how to start your own tech business in Ghana.', order:19, duration:'60 minutes' },
  { id:20, title:'Continuing Your Tech Journey', category:'professional-development', description:'Plan your next steps and discover advanced learning pathways in technology.', order:20, duration:'45 minutes' },
];

router.get('/', (req, res) => { res.json({ modules }); });
router.get('/:id', (req, res) => {
  const module = modules.find(m => m.id === parseInt(req.params.id));
  if (!module) return res.status(404).json({ message:'Module not found' });
  res.json({ module });
});

module.exports = router;