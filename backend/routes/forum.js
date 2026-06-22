const express = require('express');
const router = express.Router();

const posts = [
  { id:1, author:'Akosua M.', authorInitial:'A', date:'2 days ago', category:'motivation', title:'I just completed my first HTML module!', content:'I never thought I could learn coding but I just finished Module 8 and built my first webpage. If I can do it anyone can. Keep going sisters!', likes:24, replies:8 },
  { id:2, author:'Abena K.', authorInitial:'A', date:'3 days ago', category:'question', title:'How do I balance learning with family responsibilities?', content:'I am finding it hard to find time to study with my home responsibilities. Does anyone have tips on how to manage time while learning on Pool of Grace?', likes:15, replies:12 },
  { id:3, author:'Efua D.', authorInitial:'E', date:'5 days ago', category:'career', title:'I got an interview at a tech company in Accra!', content:'After completing the career modules and working on my CV with my mentor I just received an interview invitation from a startup in Accra. Pool of Grace is working!', likes:67, replies:23 },
  { id:4, author:'Ama B.', authorInitial:'A', date:'1 week ago', category:'motivation', title:'To every woman who doubts herself', content:'Six months ago I believed technology was not for me. My family said the same. Today I have completed 15 modules and I am building real projects. Your background does not determine your future.', likes:89, replies:31 },
  { id:5, author:'Adjoa S.', authorInitial:'A', date:'1 week ago', category:'question', title:'Which programming language should I focus on first?', content:'I have finished the self worth modules and I am starting the technical modules. Should I focus more on HTML CSS or jump to JavaScript? My mentor said both but I want your opinions.', likes:11, replies:19 },
  { id:6, author:'Yaa F.', authorInitial:'Y', date:'2 weeks ago', category:'career', title:'Ghana tech salaries are real — I verified it!', content:'I did research after Module 15 about Ghana tech jobs. Entry level web developers in Accra earn between 3000 and 5000 GHS per month. That is more than I ever imagined earning. This is our opportunity.', likes:45, replies:14 },
];

router.get('/', (req, res) => { res.json({ posts }); });
router.post('/', (req, res) => {
  const { author, title, content, category } = req.body;
  const newPost = { id: posts.length + 1, author, authorInitial: author.charAt(0), date:'Just now', category: category || 'general', title, content, likes:0, replies:0 };
  posts.unshift(newPost);
  res.status(201).json({ post: newPost });
});

module.exports = router;