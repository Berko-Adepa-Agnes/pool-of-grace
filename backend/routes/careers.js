const express = require('express');
const router = express.Router();

const jobs = [
  { id:1, type:'job', title:'Junior Web Developer', company:'Hubtel', location:'Accra, Ghana', salary:'3,500 — 4,500 GHS/month', description:'Build and maintain web applications for Ghana\'s leading payments platform. HTML CSS JavaScript React experience preferred. Training provided for strong candidates.', deadline:'30 June 2026', tags:['HTML', 'CSS', 'JavaScript', 'React'] },
  { id:2, type:'job', title:'IT Support Specialist', company:'MTN Ghana', location:'Kumasi, Ghana', salary:'2,800 — 3,500 GHS/month', description:'Provide technical support for MTN Ghana\'s internal systems and customer-facing platforms. Strong communication skills and basic IT knowledge required.', deadline:'25 June 2026', tags:['IT Support', 'Networking', 'Customer Service'] },
  { id:3, type:'internship', title:'Software Development Intern', company:'mPedigree', location:'Accra, Ghana', salary:'1,500 GHS/month stipend', description:'6-month paid internship with Ghana\'s medicine verification platform. Learn real-world software development while contributing to healthcare technology that saves lives.', deadline:'15 July 2026', tags:['Python', 'JavaScript', 'Database'] },
  { id:4, type:'job', title:'Data Entry and Analytics Assistant', company:'GCB Bank', location:'Accra, Ghana', salary:'2,500 — 3,200 GHS/month', description:'Support the digital banking team with data management, reporting, and basic analytics. Excel and basic database skills required. Women strongly encouraged to apply.', deadline:'20 June 2026', tags:['Excel', 'SQL', 'Data Analysis'] },
  { id:5, type:'scholarship', title:'Women in Tech Africa Scholarship', company:'Mastercard Foundation', location:'Online', salary:'Full tuition covered', description:'Full scholarship for young women in Ghana to complete a 6-month online technology bootcamp. Pool of Grace graduates are eligible to apply. Covers tuition, device, and internet costs.', deadline:'1 July 2026', tags:['Scholarship', 'Bootcamp', 'Full Coverage'] },
  { id:6, type:'internship', title:'UX Design Intern', company:'Vodafone Ghana', location:'Accra, Ghana', salary:'2,000 GHS/month stipend', description:'Join Vodafone Ghana\'s digital product team as a UX design intern. Learn user research, wireframing, and product design. No prior experience required — just creativity and curiosity.', deadline:'10 July 2026', tags:['UX Design', 'Figma', 'User Research'] },
  { id:7, type:'job', title:'Social Media and Digital Marketing', company:'Melcom Group', location:'Kumasi, Ghana', salary:'2,200 — 2,800 GHS/month', description:'Manage digital marketing campaigns and social media presence for one of Ghana\'s largest retail chains. Content creation and basic graphic design skills preferred.', deadline:'28 June 2026', tags:['Digital Marketing', 'Social Media', 'Content Creation'] },
  { id:8, type:'scholarship', title:'ALX Africa Software Engineering Program', company:'ALX Africa', location:'Online / Accra', salary:'Subsidized — 500 GHS total', description:'Intensive 12-month software engineering program with job placement support. Highly subsidized for women applicants. Pool of Grace technical module completion counts as prior experience.', deadline:'31 July 2026', tags:['Software Engineering', 'Subsidized', 'Job Placement'] },
  { id:9, type:'job', title:'Junior Python Developer', company:'Farmerline', location:'Accra, Ghana', salary:'3,200 — 4,000 GHS/month', description:'Build technology solutions for Ghana\'s agricultural sector. Python and basic database knowledge required. Farmerline actively recruits women in technology.', deadline:'5 July 2026', tags:['Python', 'Django', 'Database'] },
  { id:10, type:'certification', title:'Google IT Support Certificate', company:'Google via Coursera', location:'Online', salary:'Free for Pool of Grace participants', description:'Industry-recognized IT support certification from Google. Completed entirely online at your own pace. Pool of Grace participants receive free access through our partnership.', deadline:'Open enrollment', tags:['IT Support', 'Free', 'Google Certified'] },
];

router.get('/', (req, res) => { res.json({ jobs }); });
router.get('/type/:type', (req, res) => {
  const filtered = jobs.filter(j => j.type === req.params.type);
  res.json({ jobs: filtered });
});

module.exports = router;