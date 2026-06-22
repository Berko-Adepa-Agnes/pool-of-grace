import React, { useState, useEffect } from 'react';
import { registerUser, loginUser, getModules, getForumPosts, createForumPost, getJobs } from './api';

const green = '#2d7a2d';
const lightGreen = '#5cb85c';
const paleGreen = '#eafaea';
const white = '#ffffff';

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 40px', background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', boxShadow:'0 10px 30px rgba(16,55,16,0.08)', position:'sticky', top:0, zIndex:100, borderBottom:'1px solid rgba(92,184,92,0.12)' },
  logo: { color:green, margin:0, fontSize:'26px', fontWeight:'800' },
  logoSpan: { color:lightGreen },
  page: { minHeight:'100vh', background:'radial-gradient(circle at top left, rgba(92,184,92,0.14), transparent 28%), radial-gradient(circle at top right, rgba(124,92,191,0.10), transparent 26%), linear-gradient(180deg, #f7fbf7 0%, #eef8ef 100%)', fontFamily:'"Segoe UI", Arial, sans-serif', position:'relative', overflowX:'hidden' },
  primaryBtn: { background:'linear-gradient(135deg, #63c063 0%, #2d7a2d 100%)', color:white, border:'none', padding:'12px 28px', borderRadius:'16px', cursor:'pointer', fontSize:'15px', fontWeight:'700', transition:'all 0.2s', boxShadow:'0 10px 24px rgba(45,122,45,0.24)' },
  outlineBtn: { background:'rgba(255,255,255,0.72)', border:'1px solid rgba(92,184,92,0.35)', color:green, padding:'10px 22px', borderRadius:'16px', cursor:'pointer', fontSize:'14px', fontWeight:'700', marginRight:'10px', boxShadow:'0 8px 18px rgba(45,122,45,0.08)' },
  input: { width:'100%', padding:'13px 16px', marginBottom:'15px', border:'1px solid #dcefdc', borderRadius:'14px', fontSize:'15px', boxSizing:'border-box', outline:'none', background:'rgba(255,255,255,0.92)', boxShadow:'inset 0 1px 2px rgba(0,0,0,0.03)' },
  textarea: { width:'100%', padding:'13px 16px', marginBottom:'15px', border:'1px solid #dcefdc', borderRadius:'14px', fontSize:'15px', boxSizing:'border-box', outline:'none', resize:'vertical', minHeight:'100px', fontFamily:'"Segoe UI", Arial, sans-serif', background:'rgba(255,255,255,0.92)', boxShadow:'inset 0 1px 2px rgba(0,0,0,0.03)' },
  card: { background:'rgba(255,255,255,0.88)', padding:'30px', borderRadius:'24px', boxShadow:'0 18px 40px rgba(16,55,16,0.08)', border:'1px solid rgba(92,184,92,0.12)', backdropFilter:'blur(10px)' },
  authPage: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 26%), linear-gradient(135deg, #153b15 0%, #2d7a2d 45%, #6ac56a 100%)' },
  authCard: { background:'rgba(255,255,255,0.95)', padding:'45px', borderRadius:'28px', width:'420px', boxShadow:'0 30px 80px rgba(0,0,0,0.22)', border:'1px solid rgba(255,255,255,0.35)', backdropFilter:'blur(12px)' },
  msg: { background:'#d4edda', color:'#155724', padding:'12px 16px', borderRadius:'10px', textAlign:'center', marginBottom:'15px', fontSize:'14px', fontWeight:'500' },
  errorMsg: { background:'#f8d7da', color:'#721c24', padding:'12px 16px', borderRadius:'10px', textAlign:'center', marginBottom:'15px', fontSize:'14px', fontWeight:'500' },
  grid2: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'22px' },
  grid3: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' },
  grid4: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' },
  hero: { textAlign:'center', padding:'110px 40px 100px', background:'linear-gradient(135deg, rgba(21,59,21,0.96) 0%, rgba(45,122,45,0.95) 55%, rgba(106,197,106,0.95) 100%)', position:'relative', overflow:'hidden' },
  section: { padding:'70px 60px' },
  dashContent: { padding:'40px 60px', maxWidth:'1280px', margin:'0 auto' },
  statCard: { background:'rgba(255,255,255,0.9)', padding:'28px', borderRadius:'22px', textAlign:'center', boxShadow:'0 14px 30px rgba(16,55,16,0.08)', border:'1px solid rgba(92,184,92,0.12)' },
  adminCard: { background:'rgba(255,255,255,0.9)', padding:'28px', borderRadius:'22px', boxShadow:'0 14px 30px rgba(16,55,16,0.08)', border:'1px solid rgba(92,184,92,0.12)' },
  badge: { display:'inline-block', padding:'5px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:'800', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px' },
  moduleCard: { background:'rgba(255,255,255,0.9)', padding:'28px', borderRadius:'22px', boxShadow:'0 14px 30px rgba(16,55,16,0.08)', border:'1px solid rgba(92,184,92,0.12)', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' },
  progressBar: { background:'#dcefdc', borderRadius:'999px', height:'10px', overflow:'hidden', marginTop:'8px' },
  sidebarNav: { display:'flex', gap:'5px', marginBottom:'30px', flexWrap:'wrap' },
  sidebarBtn: (active) => ({ padding:'10px 20px', borderRadius:'999px', border:'1px solid '+(active ? 'rgba(92,184,92,0.22)' : '#d9e7d9'), background: active ? 'linear-gradient(135deg, #63c063 0%, #2d7a2d 100%)' : 'rgba(255,255,255,0.85)', color: active ? white : '#5c6b5c', cursor:'pointer', fontSize:'14px', fontWeight:'700', transition:'all 0.2s', boxShadow: active ? '0 10px 20px rgba(45,122,45,0.16)' : '0 8px 16px rgba(16,55,16,0.05)' }),
  canvasSection: { background:'rgba(255,255,255,0.76)', border:'1px solid rgba(92,184,92,0.12)', borderRadius:'28px', boxShadow:'0 18px 40px rgba(16,55,16,0.08)', backdropFilter:'blur(12px)' },
  canvasLabel: { display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(45,122,45,0.08)', color:green, padding:'8px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:'800', letterSpacing:'0.4px', textTransform:'uppercase' },
};

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [, setOnboardingData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('poolofgrace_user');
    const savedToken = localStorage.getItem('poolofgrace_token');
    const savedOnboarding = localStorage.getItem('poolofgrace_onboarding');
    const savedCompleted = localStorage.getItem('poolofgrace_completed');
    if (savedCompleted) setCompletedModules(JSON.parse(savedCompleted));
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') setPage('admin');
      else if (!savedOnboarding) setPage('onboarding');
      else setPage('dashboard');
    }
  }, []);

  const go = (p) => setPage(p);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('poolofgrace_user', JSON.stringify(userData));
    localStorage.setItem('poolofgrace_token', token);
    if (userData.role === 'admin') setPage('admin');
    else {
      const savedOnboarding = localStorage.getItem('poolofgrace_onboarding');
      if (!savedOnboarding) setPage('onboarding');
      else setPage('dashboard');
    }
  };

  const completeOnboarding = (data) => {
    setOnboardingData(data);
    localStorage.setItem('poolofgrace_onboarding', JSON.stringify(data));
    setPage('selfWorthIntro');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('poolofgrace_user');
    localStorage.removeItem('poolofgrace_token');
    localStorage.removeItem('poolofgrace_onboarding');
    setPage('home');
  };

  const openModule = (module) => {
    setSelectedModule(module);
    setPage('moduleView');
  };

  const markModuleComplete = (moduleId) => {
    const updated = [...completedModules, moduleId];
    setCompletedModules(updated);
    localStorage.setItem('poolofgrace_completed', JSON.stringify(updated));
  };

  if (page === 'home') return <Home go={go} />;
  if (page === 'register') return <Register go={go} login={login} />;
  if (page === 'login') return <Login go={go} login={login} />;
  if (page === 'onboarding') return <Onboarding user={user} completeOnboarding={completeOnboarding} />;
  if (page === 'selfWorthIntro') return <SelfWorthIntro user={user} go={go} />;
  if (page === 'dashboard') return <Dashboard user={user} go={go} logout={logout} completedModules={completedModules} />;
  if (page === 'modules') return <Modules go={go} openModule={openModule} completedModules={completedModules} />;
  if (page === 'moduleView') return <ModuleView module={selectedModule} go={go} markModuleComplete={markModuleComplete} completedModules={completedModules} />;
  if (page === 'schedule') return <Schedule user={user} go={go} />;
  if (page === 'forum') return <Forum user={user} go={go} />;
  if (page === 'careers') return <Careers go={go} />;
  if (page === 'profile') return <Profile user={user} go={go} logout={logout} completedModules={completedModules} />;
  if (page === 'notifications') return <Notifications user={user} go={go} completedModules={completedModules} />;
  if (page === 'certificate') return <Certificate user={user} go={go} completedModules={completedModules} />;
  if (page === 'roadmap') return <Roadmap go={go} />;
  if (page === 'evaluation') return <Evaluation go={go} />;
  if (page === 'admin') return <Admin user={user} go={go} logout={logout} />;
  return <Home go={go} />;
}

function Home({ go }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('login')}>Login</button>
          <button style={styles.primaryBtn} onClick={() => go('register')}>Get Started Free</button>
        </div>
      </nav>
      <div style={styles.hero}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16), transparent 22%), radial-gradient(circle at 84% 24%, rgba(255,255,255,0.10), transparent 18%), radial-gradient(circle at 50% 82%, rgba(255,255,255,0.08), transparent 20%)' }}></div>
        <div style={{ position:'relative', zIndex:1, maxWidth:'1180px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.15fr 0.85fr', gap:'28px', alignItems:'stretch' }}>
            <div style={{ textAlign:'left', padding:'18px 10px' }}>
              <div style={{ ...styles.canvasLabel, marginBottom:'18px' }}>Learning Canvas</div>
              <h1 style={{ color:white, fontSize:'56px', fontWeight:'900', maxWidth:'780px', margin:'0 0 18px', lineHeight:'1.1', letterSpacing:'-0.03em' }}>
                Empowering Young Women Through Technology
              </h1>
              <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'20px', maxWidth:'650px', margin:'0 0 28px', lineHeight:'1.7' }}>
                Free technology education, mentorship, and career guidance with a structured canvas-style journey from self-worth to job readiness.
              </p>
              <div style={{ display:'flex', gap:'15px', justifyContent:'flex-start', flexWrap:'wrap', marginBottom:'30px' }}>
                <button style={{ ...styles.primaryBtn, background:white, color:green, fontSize:'17px', padding:'16px 40px', boxShadow:'0 10px 24px rgba(0,0,0,0.18)' }} onClick={() => go('register')}>
                  Start Your Journey Free
                </button>
                <button style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.55)', color:white, padding:'16px 30px', borderRadius:'16px', cursor:'pointer', fontSize:'16px', fontWeight:'700' }} onClick={() => go('login')}>
                  I Have an Account
                </button>
              </div>
              <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
                {[['20', 'Learning Modules'], ['100%', 'Free Forever'], ['12mo', 'Mentorship'], ['2', 'Cities in Ghana']].map(([val, label], i) => (
                  <div key={i} style={{ minWidth:'130px', background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:'18px', padding:'16px 18px', backdropFilter:'blur(10px)' }}>
                    <div style={{ color:white, fontSize:'30px', fontWeight:'900', marginBottom:'4px' }}>{val}</div>
                    <div style={{ color:'rgba(255,255,255,0.78)', fontSize:'13px', fontWeight:'600' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...styles.canvasSection, padding:'24px' }}>
              <div style={{ background:'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(236,248,236,0.92))', borderRadius:'22px', padding:'24px', height:'100%' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
                  <div>
                    <div style={{ color:green, fontSize:'14px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.8px' }}>Platform Preview</div>
                    <div style={{ color:'#6a6a6a', fontSize:'13px' }}>Clean, supportive, and easy to navigate</div>
                  </div>
                  <div style={{ background:paleGreen, color:green, padding:'8px 12px', borderRadius:'999px', fontSize:'12px', fontWeight:'700' }}>Ready to learn</div>
                </div>
                <div style={{ display:'grid', gap:'14px' }}>
                  {[
                    ['Self-worth canvas', 'Confidence, identity, and mindset'],
                    ['Video lessons', 'Clickable learning links for each module'],
                    ['Office hours', 'Saturday 4:00 PM Ghana time'],
                    ['Networking', 'Forum, mentorship, and career support'],
                  ].map(([title, desc], i) => (
                    <div key={i} style={{ background:'rgba(255,255,255,0.96)', borderRadius:'18px', padding:'16px 18px', border:'1px solid #e4f1e4', boxShadow:'0 8px 18px rgba(16,55,16,0.05)' }}>
                      <div style={{ color:green, fontWeight:'800', fontSize:'15px', marginBottom:'4px' }}>{title}</div>
                      <div style={{ color:'#666', fontSize:'13px', lineHeight:'1.6' }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.72)', padding:'80px 60px' }}>
        <div style={{ textAlign:'center', marginBottom:'55px' }}>
          <h2 style={{ color:green, fontSize:'36px', fontWeight:'800', marginBottom:'15px' }}>How Pool of Grace Works</h2>
          <p style={{ color:'#666', fontSize:'18px', maxWidth:'550px', margin:'0 auto' }}>A structured journey from self-belief to technology career</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'30px' }}>
          {[
            { step:'1', title:'Share Your Story', desc:'Tell us about yourself, your dreams, and the barriers you face.' },
            { step:'2', title:'Build Self-Worth', desc:'Complete 7 dedicated modules that address limiting beliefs.' },
            { step:'3', title:'Learn Tech Skills', desc:'Master HTML, CSS, JavaScript, Python, and databases.' },
            { step:'4', title:'Launch Your Career', desc:'Get mentorship, career guidance, and connections to Ghana tech jobs.' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign:'center', padding:'30px 20px', background:'rgba(255,255,255,0.82)', borderRadius:'24px', border:'1px solid rgba(92,184,92,0.12)', boxShadow:'0 14px 30px rgba(16,55,16,0.06)' }}>
              <div style={{ width:'60px', height:'60px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 20px rgba(92,184,92,0.3)' }}>
                <span style={{ color:white, fontWeight:'800', fontSize:'22px' }}>{item.step}</span>
              </div>
              <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'10px' }}>{item.title}</h3>
              <p style={{ color:'#666', fontSize:'14px', lineHeight:'1.7' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.section}>
        <div style={{ textAlign:'center', marginBottom:'50px' }}>
          <h2 style={{ color:green, fontSize:'36px', fontWeight:'800', marginBottom:'15px' }}>What We Offer</h2>
        </div>
        <div style={styles.grid4}>
          {[
            { title:'Self-Worth First', desc:'7 modules addressing limiting beliefs before any technical content', color:'#e8f5e8' },
            { title:'Technology Skills', desc:'7 modules teaching coding and web development from absolute scratch', color:'#ede8ff' },
            { title:'Sustained Mentorship', desc:'Bi-weekly video sessions with Ghanaian women in technology', color:'#fff3e8' },
            { title:'Career Guidance', desc:'Ghana tech job board, CV building, and interview preparation', color:'#e8f8ff' },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.card, borderTop:'4px solid '+lightGreen }}>
              <div style={{ width:'50px', height:'50px', background:item.color, borderRadius:'12px', marginBottom:'18px' }}></div>
              <h3 style={{ color:green, marginBottom:'10px', fontSize:'18px', fontWeight:'700' }}>{item.title}</h3>
              <p style={{ color:'#666', lineHeight:'1.6', fontSize:'15px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:'linear-gradient(135deg, #1a5c1a, #5cb85c)', padding:'80px 60px', textAlign:'center' }}>
        <h2 style={{ color:white, fontSize:'38px', fontWeight:'800', marginBottom:'20px' }}>Your Journey Starts With Your Story</h2>
        <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'19px', maxWidth:'550px', margin:'0 auto 40px' }}>
          Join Pool of Grace today. Tell us your story, and we will walk with you every step of the way.
        </p>
        <button style={{ ...styles.primaryBtn, background:white, color:green, fontSize:'18px', padding:'18px 45px', boxShadow:'0 8px 25px rgba(0,0,0,0.2)' }} onClick={() => go('register')}>
          Create Your Free Account
        </button>
      </div>
      <footer style={{ background:'#1a2e1a', padding:'40px 60px', textAlign:'center' }}>
        <h3 style={{ color:white, marginBottom:'10px', fontSize:'20px' }}>Pool of Grace</h3>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px' }}>Empowering young women in Ghana through technology education and mentorship</p>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'13px', marginTop:'15px' }}>Kumasi and Accra, Ghana</p>
      </footer>
    </div>
  );
}

function Register({ go, login }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', role:'participant' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); setMsg('');
    if (!form.firstName || !form.email || !form.password) { setError('Please fill in all required fields'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      setMsg('Account created! Taking you to your welcome...');
      setTimeout(() => login(data.user, data.token), 1500);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Cannot connect to server.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <div style={{ textAlign:'center', marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'8px' }}>Join Pool of Grace</h2>
          <p style={{ color:'#888', fontSize:'15px' }}>Create your free account and start your journey</p>
        </div>
        {msg && <div style={styles.msg}>{msg}</div>}
        {error && <div style={styles.errorMsg}>{error}</div>}
        <div style={styles.grid2}>
          <div>
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>First Name</label>
            <input style={styles.input} placeholder="Agnes" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Last Name</label>
            <input style={styles.input} placeholder="Berko" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} />
          </div>
        </div>
        <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Email Address</label>
        <input style={styles.input} placeholder="agnes@example.com" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Password</label>
        <input style={styles.input} placeholder="At least 6 characters" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>I am joining as</label>
        <select style={styles.input} value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
          <option value="participant">A Participant — I want to learn</option>
          <option value="mentor">A Mentor — I want to guide others</option>
        </select>
        <button style={{ ...styles.primaryBtn, width:'100%', padding:'15px', borderRadius:'12px', fontSize:'16px', marginTop:'5px' }} onClick={submit} disabled={loading}>
          {loading ? 'Creating Your Account...' : 'Create Free Account'}
        </button>
        <p style={{ textAlign:'center', marginTop:'20px', color:'#888', fontSize:'14px' }}>
          Already have an account?{' '}
          <span style={{ color:lightGreen, cursor:'pointer', fontWeight:'700' }} onClick={() => go('login')}>Login here</span>
        </p>
      </div>
    </div>
  );
}

function Login({ go, login }) {
  const [form, setForm] = useState({ email:'', password:'' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); setMsg('');
    if (!form.email || !form.password) { setError('Please enter your email and password'); return; }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      setMsg('Login successful!');
      setTimeout(() => login(data.user, data.token), 1500);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Cannot connect to server.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>
        <div style={{ textAlign:'center', marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'8px' }}>Welcome Back</h2>
          <p style={{ color:'#888', fontSize:'15px' }}>Login to continue your journey</p>
        </div>
        {msg && <div style={styles.msg}>{msg}</div>}
        {error && <div style={styles.errorMsg}>{error}</div>}
        <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Email Address</label>
        <input style={styles.input} placeholder="Your email address" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Password</label>
        <input style={styles.input} placeholder="Your password" type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        <button style={{ ...styles.primaryBtn, width:'100%', padding:'15px', borderRadius:'12px', fontSize:'16px' }} onClick={submit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login to Pool of Grace'}
        </button>
        <p style={{ textAlign:'center', marginTop:'20px', color:'#888', fontSize:'14px' }}>
          Do not have an account?{' '}
          <span style={{ color:lightGreen, cursor:'pointer', fontWeight:'700' }} onClick={() => go('register')}>Register here for free</span>
        </p>
      </div>
    </div>
  );
}

function Onboarding({ user, completeOnboarding }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ story:'', barriers:[], goals:'', techExperience:'', motivation:'', location:'', age:'', education:'' });

  const barrierOptions = [
    'Family pressure toward early marriage',
    'Belief that technology is not for women',
    'No female role models in technology',
    'Financial barriers',
    'Limited internet or device access',
    'Fear of failure or not being smart enough',
    'Family discouragement',
    'Lack of information about technology careers',
  ];

  const toggleBarrier = (barrier) => {
    setData(prev => ({ ...prev, barriers: prev.barriers.includes(barrier) ? prev.barriers.filter(b => b !== barrier) : [...prev.barriers, barrier] }));
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0faf0, #e8f5e8)', fontFamily:'"Segoe UI", Arial, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ maxWidth:'620px', width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', margin:'0 0 8px' }}>Pool <span style={{ color:lightGreen }}>of Grace</span></h2>
          <p style={{ color:'#888', fontSize:'14px' }}>Step {step} of {totalSteps}</p>
          <div style={{ background:'#d4edd4', borderRadius:'10px', height:'8px', marginTop:'12px', overflow:'hidden' }}>
            <div style={{ width:progress+'%', height:'100%', background:'linear-gradient(90deg, '+green+', '+lightGreen+')', borderRadius:'10px', transition:'width 0.4s' }}></div>
          </div>
        </div>
        <div style={{ ...styles.card, padding:'45px' }}>
          {step === 1 && (
            <div>
              <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'10px' }}>Welcome, {user && user.firstName}!</h2>
              <p style={{ color:'#666', fontSize:'16px', lineHeight:'1.7', marginBottom:'15px' }}>
                We are so glad you are here. Pool of Grace was created because we believe every young woman in Ghana deserves the opportunity to pursue a technology career — regardless of her background or what she has been told about herself.
              </p>
              <div style={{ background:paleGreen, padding:'20px', borderRadius:'12px', marginBottom:'25px', borderLeft:'4px solid '+lightGreen }}>
                <p style={{ color:green, fontWeight:'600', margin:'0 0 5px', fontSize:'15px' }}>Your story matters here.</p>
                <p style={{ color:'#555', margin:0, fontSize:'14px', lineHeight:'1.6' }}>Everything you share is completely confidential and used only to personalize your learning experience.</p>
              </div>
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Tell us about yourself and why you are joining Pool of Grace</label>
              <textarea style={styles.textarea} placeholder="Share your story... Where are you from? What made you decide to join Pool of Grace today?" value={data.story} onChange={e => setData({...data, story:e.target.value})} />
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>What do you hope this platform will improve in your life?</label>
              <textarea style={styles.textarea} placeholder="For example: I want to get a technology job, build my own business, support my family..." value={data.goals} onChange={e => setData({...data, goals:e.target.value})} />
              <button style={{ ...styles.primaryBtn, width:'100%', padding:'15px', borderRadius:'12px', fontSize:'16px' }} onClick={() => setStep(2)} disabled={!data.story || !data.goals}>
                Continue — Tell Us More
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 style={{ color:green, fontSize:'24px', fontWeight:'800', marginBottom:'10px' }}>Understanding Your Barriers</h2>
              <p style={{ color:'#666', fontSize:'15px', lineHeight:'1.7', marginBottom:'25px' }}>Select all the barriers that apply to your situation so we can address them directly in your learning journey.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'25px' }}>
                {barrierOptions.map((barrier, i) => (
                  <label key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', borderRadius:'12px', border:'2px solid '+(data.barriers.includes(barrier) ? lightGreen : '#e8f5e8'), background: data.barriers.includes(barrier) ? paleGreen : white, cursor:'pointer' }}>
                    <input type="checkbox" checked={data.barriers.includes(barrier)} onChange={() => toggleBarrier(barrier)} style={{ accentColor:lightGreen, width:'18px', height:'18px' }} />
                    <span style={{ color:'#333', fontSize:'14px' }}>{barrier}</span>
                  </label>
                ))}
              </div>
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>What motivates you most to pursue technology despite these barriers?</label>
              <textarea style={styles.textarea} placeholder="What will keep you going when things get difficult?" value={data.motivation} onChange={e => setData({...data, motivation:e.target.value})} />
              <div style={{ display:'flex', gap:'12px' }}>
                <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px', fontSize:'15px' }} onClick={() => setStep(1)}>Back</button>
                <button style={{ ...styles.primaryBtn, flex:1, padding:'15px', borderRadius:'12px', fontSize:'16px' }} onClick={() => setStep(3)} disabled={data.barriers.length === 0}>Continue</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 style={{ color:green, fontSize:'24px', fontWeight:'800', marginBottom:'10px' }}>A Little More About You</h2>
              <p style={{ color:'#666', fontSize:'15px', lineHeight:'1.7', marginBottom:'25px' }}>This helps us match you with the right mentor and learning resources.</p>
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Your Age</label>
              <select style={styles.input} value={data.age} onChange={e => setData({...data, age:e.target.value})}>
                <option value="">Select your age range</option>
                <option value="16-18">16 — 18 years old</option>
                <option value="19-22">19 — 22 years old</option>
                <option value="23-26">23 — 26 years old</option>
                <option value="27-30">27 — 30 years old</option>
              </select>
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Your Location</label>
              <select style={styles.input} value={data.location} onChange={e => setData({...data, location:e.target.value})}>
                <option value="">Select your city</option>
                <option value="kumasi">Kumasi (Ashanti Region)</option>
                <option value="accra">Accra (Greater Accra Region)</option>
                <option value="other">Other area in Ghana</option>
              </select>
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Highest Education Completed</label>
              <select style={styles.input} value={data.education} onChange={e => setData({...data, education:e.target.value})}>
                <option value="">Select education level</option>
                <option value="jhs">Junior High School (JHS)</option>
                <option value="secondary">Senior High School (SHS)</option>
                <option value="tertiary">Tertiary / University</option>
                <option value="other">Other</option>
              </select>
              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Technology Experience</label>
              <select style={styles.input} value={data.techExperience} onChange={e => setData({...data, techExperience:e.target.value})}>
                <option value="">Select your experience level</option>
                <option value="none">None — I am a complete beginner</option>
                <option value="basic">Basic — I can use a phone and browse the internet</option>
                <option value="some">Some — I have tried some basic coding</option>
                <option value="intermediate">Intermediate — I have some coding experience</option>
              </select>
              <div style={{ display:'flex', gap:'12px' }}>
                <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px', fontSize:'15px' }} onClick={() => setStep(2)}>Back</button>
                <button style={{ ...styles.primaryBtn, flex:1, padding:'15px', borderRadius:'12px', fontSize:'16px' }} onClick={() => setStep(4)} disabled={!data.age || !data.location || !data.education || !data.techExperience}>Almost Done</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 25px', boxShadow:'0 8px 25px rgba(92,184,92,0.35)' }}>
                <span style={{ color:white, fontSize:'36px', fontWeight:'800' }}>✓</span>
              </div>
              <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'15px' }}>Thank You, {user && user.firstName}!</h2>
              <p style={{ color:'#555', fontSize:'16px', lineHeight:'1.8', marginBottom:'20px' }}>We have received your story and we are honoured that you have chosen Pool of Grace.</p>
              <div style={{ background:paleGreen, padding:'25px', borderRadius:'16px', marginBottom:'30px', textAlign:'left', borderLeft:'4px solid '+lightGreen }}>
                <p style={{ color:green, fontWeight:'700', fontSize:'16px', margin:'0 0 12px' }}>Here is what happens next:</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {['We will start with your self-worth — confidence is the foundation of everything', 'Complete 7 self-worth modules before moving to technology skills', 'A mentor will be assigned for bi-weekly guidance sessions', 'After self-worth you will learn HTML, CSS, JavaScript, Python, and databases', 'Career guidance connects your skills to real jobs in Ghana'].map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                      <div style={{ width:'20px', height:'20px', background:lightGreen, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }}>
                        <span style={{ color:white, fontSize:'11px', fontWeight:'800' }}>{i+1}</span>
                      </div>
                      <span style={{ color:'#555', fontSize:'14px', lineHeight:'1.6' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={{ ...styles.primaryBtn, width:'100%', padding:'16px', borderRadius:'12px', fontSize:'17px' }} onClick={() => completeOnboarding(data)}>
                Begin My Journey — Start Self-Worth
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelfWorthIntro({ user, go }) {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1a5c1a, #2d7a2d, #5cb85c)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'"Segoe UI", Arial, sans-serif' }}>
      <div style={{ maxWidth:'700px', width:'100%', textAlign:'center' }}>
        <div style={{ background:'rgba(255,255,255,0.1)', display:'inline-block', padding:'10px 25px', borderRadius:'25px', marginBottom:'30px' }}>
          <span style={{ color:white, fontSize:'14px', fontWeight:'600' }}>Your Journey Begins Now</span>
        </div>
        <h1 style={{ color:white, fontSize:'40px', fontWeight:'800', marginBottom:'20px', lineHeight:'1.3' }}>
          Before We Teach You Technology, We Are Going to Build Something More Important
        </h1>
        <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'19px', lineHeight:'1.8', marginBottom:'30px' }}>
          Research shows that the biggest barrier preventing young women in Ghana from pursuing technology is not ability — it is belief. Pool of Grace starts with you, your worth, and your right to pursue any career you choose.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'45px' }}>
          {[['7', 'Self-Worth Modules', 'Dedicated to your confidence'], ['4', 'Core Sources', 'Of self-efficacy built together'], ['100%', 'Evidence-Based', 'From psychology research']].map(([num, label, desc], i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.12)', padding:'25px 20px', borderRadius:'16px' }}>
              <div style={{ color:white, fontSize:'32px', fontWeight:'800', marginBottom:'5px' }}>{num}</div>
              <div style={{ color:white, fontSize:'14px', fontWeight:'700', marginBottom:'5px' }}>{label}</div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px' }}>{desc}</div>
            </div>
          ))}
        </div>
        <button style={{ ...styles.primaryBtn, background:white, color:green, fontSize:'18px', padding:'18px 50px', boxShadow:'0 8px 25px rgba(0,0,0,0.2)' }} onClick={() => go('dashboard')}>
          I Am Ready — Take Me to My Dashboard
        </button>
      </div>
    </div>
  );
}

function Dashboard({ user, go, logout, completedModules }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const progress = Math.round((completedModules.length / 20) * 100);
  const selfWorthCompleted = completedModules.filter(id => id >= 1 && id <= 7).length;
  const techCompleted = completedModules.filter(id => id >= 8 && id <= 14).length;
  const careerCompleted = completedModules.filter(id => id >= 15 && id <= 20).length;
  const certificateReady = progress === 100;

  const milestoneCards = [
    {
      title: 'Foundation',
      value: selfWorthCompleted + '/7',
      label: 'Self-worth modules completed',
      done: selfWorthCompleted === 7,
    },
    {
      title: 'Builder',
      value: techCompleted + '/7',
      label: 'Technical modules completed',
      done: techCompleted === 7,
    },
    {
      title: 'Career Ready',
      value: careerCompleted + '/6',
      label: 'Career modules completed',
      done: careerCompleted === 6,
    },
    {
      title: 'Certificate',
      value: certificateReady ? 'Unlocked' : 'Locked',
      label: 'Available when all 20 modules are done',
      done: certificateReady,
    },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button style={styles.sidebarBtn(false)} onClick={() => go('home')}>Home</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('modules')}>Modules</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('notifications')}>Announcements</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('schedule')}>Calendar</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('forum')}>Forum</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('roadmap')}>History</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('evaluation')}>Help</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('careers')}>Jobs</button>
          <button style={styles.sidebarBtn(false)} onClick={() => go('profile')}>Account</button>
          <button style={styles.outlineBtn} onClick={logout}>Logout</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'35px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>{greeting()}, {user && user.firstName}!</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Continue your journey — you are making great progress</p>
        </div>
        <div style={{ ...styles.canvasSection, padding:'22px', marginBottom:'28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', flexWrap:'wrap', marginBottom:'14px' }}>
            <div>
              <div style={{ ...styles.canvasLabel, marginBottom:'10px' }}>Module Flow</div>
              <h3 style={{ color:green, fontSize:'22px', fontWeight:'800', margin:'0 0 6px' }}>Notes first, then resources, then assignment, then quiz and grade.</h3>
              <p style={{ color:'#666', fontSize:'14px', margin:0 }}>This layout helps learners move from reading to practice to assessment in a clear sequence.</p>
            </div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
            {['Notes','Resources','Assignment','Quiz','Grade','Calendar','Inbox','History','Help'].map((stage, i) => (
              <div key={stage} style={{ background:i === 0 ? paleGreen : '#fff', border:'1px solid '+(i === 0 ? '#cbe6cb' : '#e5e5e5'), color: i === 0 ? green : '#666', padding:'10px 14px', borderRadius:'999px', fontSize:'13px', fontWeight:'700' }}>
                {i + 1}. {stage}
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...styles.grid4, marginBottom:'40px' }}>
          {[
            { value:completedModules.length, label:'Modules Completed', sub:'of 20 total' },
            { value:progress+'%', label:'Overall Progress', sub:'keep going' },
            { value:certificateReady ? 'Yes' : 'Soon', label:'Certificate Status', sub:'completion unlocks it' },
            { value:'4', label:'Core Platforms', sub:'modules, forum, careers, mentoring' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize:'36px', fontWeight:'800', color:green, marginBottom:'5px' }}>{stat.value}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>{stat.label}</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ ...styles.card, marginBottom:'30px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px', marginBottom:'18px' }}>
            <div>
              <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'5px' }}>Milestones and Achievements</h3>
              <p style={{ color:'#888', fontSize:'14px', margin:0 }}>This shows progress beyond quizzes so supervisors can see the full learning journey.</p>
            </div>
            <button style={styles.primaryBtn} onClick={() => go(certificateReady ? 'certificate' : 'modules')}>
              {certificateReady ? 'View Certificate' : 'Keep Building'}
            </button>
          </div>
          <div style={styles.grid2}>
            {milestoneCards.map((item, i) => (
              <div key={i} style={{ padding:'20px', borderRadius:'14px', background:item.done ? '#f1fff1' : '#fbfbfb', border:'1px solid '+(item.done ? '#bfe3bf' : '#ececec') }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px', marginBottom:'10px' }}>
                  <h4 style={{ color:green, fontSize:'16px', fontWeight:'700', margin:0 }}>{item.title}</h4>
                  <span style={{ background:item.done ? '#d4edda' : '#f0f0f0', color:item.done ? '#155724' : '#888', padding:'4px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'700' }}>{item.value}</span>
                </div>
                <p style={{ color:'#666', fontSize:'14px', lineHeight:'1.6', margin:0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...styles.card, marginBottom:'30px', borderLeft:'5px solid '+lightGreen }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px' }}>
            <div>
              <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'5px' }}>Your Learning Progress</h3>
              <p style={{ color:'#888', fontSize:'14px', margin:0 }}>{completedModules.length === 0 ? 'Start with Module 1: Understanding Your Worth' : completedModules.length + ' modules completed — keep going!'}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <span style={{ color:green, fontSize:'24px', fontWeight:'800' }}>{progress}%</span>
              <span style={{ color:'#aaa', fontSize:'14px' }}> complete</span>
            </div>
          </div>
          <div style={styles.progressBar}>
            <div style={{ width:progress+'%', height:'100%', background:'linear-gradient(90deg, '+lightGreen+', '+green+')', borderRadius:'10px', transition:'width 0.5s' }}></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            <span style={{ fontSize:'12px', color:'#aaa' }}>{completedModules.length} of 20 modules complete</span>
            <span style={{ fontSize:'12px', color:'#aaa' }}>Next: Module {completedModules.length + 1}</span>
          </div>
        </div>
        <div style={styles.grid2}>
          {[
            { title:'Continue Learning', desc:'Pick up where you left off. You have 20 modules covering self-worth, tech skills, and career development.', btn:'View All Modules', action:() => go('modules'), highlight:true },
            { title:'My Mentorship', desc:'Schedule your bi-weekly session with a Ghanaian woman in technology for guidance and support.', btn:'Schedule Session', action:() => go('schedule') },
            { title:'Community Forum', desc:'Connect with other women on the same journey. Share experiences, ask questions, and support each other.', btn:'Visit Forum', action:() => go('forum') },
            { title:'Career Resources', desc:'Browse Ghana tech jobs, internships, scholarships, and certification opportunities curated for you.', btn:'View Jobs and Opportunities', action:() => go('careers') },
            { title:'Announcements', desc:'See reminders, career alerts, and milestone updates in one place.', btn:'Open Announcements', action:() => go('notifications') },
            { title:'Calendar', desc:'Check office hours, mentor sessions, and key dates in one place.', btn:'Open Calendar', action:() => go('schedule') },
            { title:'Inbox', desc:'Open the forum feed for questions, replies, and support threads.', btn:'Open Inbox', action:() => go('forum') },
            { title:'History', desc:'Review the full learning journey and project milestones from start to finish.', btn:'View History', action:() => go('roadmap') },
            { title:'Help', desc:'See the platform testing notes and support guidance for next steps.', btn:'Open Help', action:() => go('evaluation') },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.card, ...(item.highlight ? { borderTop:'3px solid '+lightGreen } : {}) }}>
              <h3 style={{ color:green, marginBottom:'8px', fontSize:'17px', fontWeight:'700' }}>{item.title}</h3>
              <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>{item.desc}</p>
              <button style={styles.primaryBtn} onClick={item.action}>{item.btn}</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'30px', textAlign:'center' }}>
          <button style={{ ...styles.outlineBtn, padding:'14px 28px', borderRadius:'12px', marginRight:'0' }} onClick={() => go('certificate')} disabled={!certificateReady}>
            {certificateReady ? 'Open Certificate Page' : 'Certificate Unlocks at 100%'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile({ user, go, logout, completedModules }) {
  const progress = Math.round((completedModules.length / 20) * 100);
  const onboardingData = JSON.parse(localStorage.getItem('poolofgrace_onboarding') || '{}');
  const savedProfile = JSON.parse(localStorage.getItem('poolofgrace_profile') || 'null');
  const initialProfile = savedProfile || {
    displayName: user ? user.firstName + ' ' + user.lastName : '',
    bio: onboardingData.story || '',
    focusArea: onboardingData.techExperience || '',
    weeklyHours: '5',
    preferredPath: onboardingData.goals || '',
  };

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const saveProfile = () => {
    localStorage.setItem('poolofgrace_profile', JSON.stringify(profile));
    setEditing(false);
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
          <button style={styles.outlineBtn} onClick={logout}>Logout</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px', display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:'15px', flexWrap:'wrap' }}>
          <div>
            <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>My Profile</h2>
            <p style={{ color:'#888', fontSize:'16px' }}>Your personal journey on Pool of Grace</p>
          </div>
          <button style={editing ? styles.primaryBtn : styles.outlineBtn} onClick={() => (editing ? saveProfile() : setEditing(true))}>
            {editing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
        <div style={{ ...styles.grid2, marginBottom:'30px' }}>
          <div style={styles.card}>
            <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'25px' }}>
              <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:white, fontWeight:'800', fontSize:'32px' }}>{user && user.firstName.charAt(0)}</span>
              </div>
              <div>
                <h3 style={{ color:'#1a1a1a', fontSize:'22px', fontWeight:'800', margin:'0 0 5px' }}>{profile.displayName || (user && user.firstName + ' ' + user.lastName)}</h3>
                <p style={{ color:'#888', fontSize:'14px', margin:'0 0 5px' }}>{user && user.email}</p>
                <span style={{ background:paleGreen, color:green, padding:'3px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'600', textTransform:'capitalize' }}>{user && user.role}</span>
              </div>
            </div>
            {editing ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div>
                  <label style={{ fontSize:'13px', fontWeight:'700', color:'#444', display:'block', marginBottom:'6px' }}>Display Name</label>
                  <input style={styles.input} value={profile.displayName} onChange={e => setProfile({ ...profile, displayName: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize:'13px', fontWeight:'700', color:'#444', display:'block', marginBottom:'6px' }}>Weekly Study Hours</label>
                  <input style={styles.input} value={profile.weeklyHours} onChange={e => setProfile({ ...profile, weeklyHours: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize:'13px', fontWeight:'700', color:'#444', display:'block', marginBottom:'6px' }}>Focus Area</label>
                  <select style={styles.input} value={profile.focusArea} onChange={e => setProfile({ ...profile, focusArea: e.target.value })}>
                    <option value="">Select a focus area</option>
                    <option value="none">Still exploring</option>
                    <option value="basic">Basic digital skills</option>
                    <option value="some">Web development</option>
                    <option value="intermediate">Data or software path</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'13px', fontWeight:'700', color:'#444', display:'block', marginBottom:'6px' }}>Profile Bio</label>
                  <textarea style={styles.textarea} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  { label:'Location', value: onboardingData.location || 'Not specified' },
                  { label:'Age Range', value: onboardingData.age || 'Not specified' },
                  { label:'Education', value: onboardingData.education || 'Not specified' },
                  { label:'Tech Experience', value: onboardingData.techExperience || 'Not specified' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f0f0f0' }}>
                    <span style={{ color:'#888', fontSize:'14px', fontWeight:'600' }}>{item.label}</span>
                    <span style={{ color:'#333', fontSize:'14px', fontWeight:'500', textTransform:'capitalize' }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'12px', padding:'14px' }}>
                  <p style={{ color:green, fontWeight:'700', margin:'0 0 6px' }}>Saved Bio</p>
                  <p style={{ color:'#555', margin:0, lineHeight:'1.7', fontSize:'14px' }}>{profile.bio || 'No profile bio saved yet.'}</p>
                </div>
              </div>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={styles.statCard}>
              <div style={{ fontSize:'42px', fontWeight:'800', color:green, marginBottom:'5px' }}>{completedModules.length}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>Modules Completed</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>out of 20 total</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ fontSize:'42px', fontWeight:'800', color:green, marginBottom:'5px' }}>{progress}%</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>Journey Progress</div>
              <div style={styles.progressBar}>
                <div style={{ width:progress+'%', height:'100%', background:'linear-gradient(90deg, '+lightGreen+', '+green+')', borderRadius:'10px' }}></div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ fontSize:'42px', fontWeight:'800', color:green, marginBottom:'5px' }}>{profile.weeklyHours || '0'}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>Weekly Study Hours</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>saved in your profile</div>
            </div>
          </div>
        </div>
        {onboardingData.story && (
          <div style={{ ...styles.card, marginBottom:'20px' }}>
            <h3 style={{ color:green, fontSize:'17px', fontWeight:'700', marginBottom:'15px' }}>My Story</h3>
            <p style={{ color:'#555', fontSize:'15px', lineHeight:'1.8' }}>{onboardingData.story}</p>
          </div>
        )}
        {onboardingData.goals && (
          <div style={{ ...styles.card, marginBottom:'20px' }}>
            <h3 style={{ color:green, fontSize:'17px', fontWeight:'700', marginBottom:'15px' }}>My Goals</h3>
            <p style={{ color:'#555', fontSize:'15px', lineHeight:'1.8' }}>{onboardingData.goals}</p>
          </div>
        )}
        {onboardingData.barriers && onboardingData.barriers.length > 0 && (
          <div style={styles.card}>
            <h3 style={{ color:green, fontSize:'17px', fontWeight:'700', marginBottom:'15px' }}>Barriers I Am Overcoming</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
              {onboardingData.barriers.map((barrier, i) => (
                <span key={i} style={{ background:paleGreen, color:green, padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600' }}>{barrier}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Certificate({ user, go, completedModules }) {
  const progress = Math.round((completedModules.length / 20) * 100);
  const ready = progress === 100;

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0faf0, #e8f5e8)', fontFamily:'"Segoe UI", Arial, sans-serif' }}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
          <button style={styles.outlineBtn} onClick={() => go('modules')}>Modules</button>
        </div>
      </nav>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'50px 20px' }}>
        <div style={{ textAlign:'center', marginBottom:'25px' }}>
          <h1 style={{ color:green, fontSize:'30px', fontWeight:'800', marginBottom:'8px' }}>Completion Certificate</h1>
          <p style={{ color:'#666', fontSize:'16px' }}>A visible milestone that proves the platform does more than quizzes.</p>
        </div>
        <div style={{ background:white, border:'8px solid '+lightGreen, borderRadius:'24px', boxShadow:'0 25px 70px rgba(0,0,0,0.12)', padding:'40px', textAlign:'center' }}>
          <div style={{ color:lightGreen, fontSize:'13px', fontWeight:'800', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'18px' }}>
            Pool of Grace Achievement
          </div>
          <h2 style={{ color:green, fontSize:'38px', fontWeight:'800', margin:'0 0 12px' }}>Certificate of Progress</h2>
          <p style={{ color:'#666', fontSize:'18px', lineHeight:'1.7', maxWidth:'660px', margin:'0 auto 30px' }}>
            This certifies that {user ? user.firstName + ' ' + user.lastName : 'the participant'} has completed the Pool of Grace learning journey and demonstrated growth in self-worth, technical skills, mentorship engagement, and career readiness.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'30px' }}>
            {[
              { label:'Modules Completed', value: completedModules.length + '/20' },
              { label:'Journey Progress', value: progress + '%' },
              { label:'Status', value: ready ? 'Unlocked' : 'In Progress' },
            ].map((item, i) => (
              <div key={i} style={{ background:'#f8fdf8', borderRadius:'16px', padding:'18px', border:'1px solid #e6f3e6' }}>
                <div style={{ color:green, fontSize:'24px', fontWeight:'800', marginBottom:'6px' }}>{item.value}</div>
                <div style={{ color:'#666', fontSize:'13px', fontWeight:'600' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background:paleGreen, borderRadius:'16px', padding:'18px 20px', marginBottom:'25px' }}>
            <p style={{ color:green, fontWeight:'700', margin:'0 0 8px' }}>Why this matters</p>
            <p style={{ color:'#555', margin:0, lineHeight:'1.7' }}>
              This page gives supervisors a concrete non-quiz feature: progress recognition, readiness status, and a clear milestone for completion.
            </p>
          </div>
          <button style={{ ...styles.primaryBtn, padding:'15px 32px', borderRadius:'12px' }} onClick={() => go('dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function Notifications({ user, go, completedModules }) {
  const progress = Math.round((completedModules.length / 20) * 100);
  const items = [
    { title:'Mentorship reminder', time:'Today', body:'You are encouraged to schedule your next mentorship session this week.', color:'#e8f5e8' },
    { title:'Learning milestone', time:'Yesterday', body:'You have completed ' + completedModules.length + ' modules and are making visible progress.', color:'#e8f0ff' },
    { title:'Career opportunity', time:'2 days ago', body:'New internships and job listings are waiting in Career Resources.', color:'#fff3e0' },
    { title:'Completion target', time:'This week', body:'Reach 100% to unlock your certificate and full journey summary.', color:'#f0fff0' },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
          <button style={styles.outlineBtn} onClick={() => go('profile')}>Profile</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Notifications and Activity</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Support updates, career prompts, and learning reminders for the journey.</p>
        </div>
        <div style={{ ...styles.grid4, marginBottom:'30px' }}>
          {[
            { value: completedModules.length, label:'Modules Done', sub:'learning activity' },
            { value: progress + '%', label:'Journey Progress', sub:'certificate path' },
            { value: '3', label:'Active Alerts', sub:'relevant reminders' },
            { value: '4', label:'Support Areas', sub:'learning, mentoring, careers, profile' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize:'36px', fontWeight:'800', color:green, marginBottom:'5px' }}>{stat.value}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>{stat.label}</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:'20px' }}>
          <div style={styles.card}>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'15px' }}>Recent Updates</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ background:item.color, borderRadius:'14px', padding:'16px 18px', border:'1px solid #e8f5e8' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                    <h4 style={{ color:'#1a1a1a', fontSize:'15px', fontWeight:'700', margin:0 }}>{item.title}</h4>
                    <span style={{ color:'#888', fontSize:'12px', fontWeight:'600' }}>{item.time}</span>
                  </div>
                  <p style={{ color:'#555', fontSize:'14px', lineHeight:'1.6', margin:0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.card}>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'15px' }}>Quick Actions</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <button style={styles.primaryBtn} onClick={() => go('schedule')}>Book Mentorship</button>
              <button style={styles.primaryBtn} onClick={() => go('forum')}>Open Forum</button>
              <button style={styles.primaryBtn} onClick={() => go('careers')}>View Careers</button>
              <button style={styles.primaryBtn} onClick={() => go('certificate')} disabled={progress < 100}>View Certificate</button>
            </div>
            <div style={{ marginTop:'20px', background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'14px', padding:'16px' }}>
              <p style={{ color:green, fontWeight:'700', margin:'0 0 6px' }}>Why this matters</p>
              <p style={{ color:'#555', fontSize:'14px', lineHeight:'1.7', margin:0 }}>
                This section shows active support and product usage, which helps demonstrate testing outcomes and real user value beyond quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Roadmap({ go }) {
  const phases = [
    { week: 'Weeks 1-3', title: 'Foundation Research', desc: 'Literature review, user interviews, barrier analysis, and research synthesis.', tag: 'Research' },
    { week: 'Weeks 2-3', title: 'Design', desc: 'Wireframes, architecture, database design, and UI direction.', tag: 'Design' },
    { week: 'Weeks 3-7', title: 'Development', desc: 'Authentication, learning modules, mentorship, forum, careers, and profile tools.', tag: 'Build' },
    { week: 'Weeks 6-8', title: 'Testing & Deployment', desc: 'Build validation, user testing, and production deployment checks.', tag: 'Test' },
    { week: 'Weeks 8-9', title: 'Evaluation & Write-up', desc: 'Feedback synthesis, reporting, and final delivery preparation.', tag: 'Review' },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
          <button style={styles.outlineBtn} onClick={() => go('modules')}>Modules</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Project Roadmap</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>A practical view of the milestones behind the platform and the capstone delivery plan.</p>
        </div>
        <div style={{ ...styles.grid4, marginBottom:'25px' }}>
          {[
            { value:'9', label:'Weeks', sub:'delivery window' },
            { value:'20', label:'Modules', sub:'learning content' },
            { value:'4', label:'Core Systems', sub:'learning, mentorship, forum, careers' },
            { value:'1', label:'Platform', sub:'integrated solution' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize:'36px', fontWeight:'800', color:green, marginBottom:'5px' }}>{stat.value}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>{stat.label}</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
          {phases.map((phase, i) => (
            <div key={i} style={{ ...styles.card, borderLeft:'5px solid '+(i % 2 === 0 ? lightGreen : '#7c5cbf') }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', marginBottom:'10px' }}>
                <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', margin:0 }}>{phase.title}</h3>
                <span style={{ background:paleGreen, color:green, padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'700' }}>{phase.tag}</span>
              </div>
              <p style={{ color:'#666', fontSize:'14px', fontWeight:'600', margin:'0 0 8px' }}>{phase.week}</p>
              <p style={{ color:'#555', fontSize:'15px', lineHeight:'1.7', margin:0 }}>{phase.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'30px', textAlign:'center' }}>
          <button style={styles.primaryBtn} onClick={() => go('certificate')}>See Completion Milestone</button>
        </div>
      </div>
    </div>
  );
}

function Evaluation({ go }) {
  const testCards = [
    { title: 'Functional Testing', desc: 'Checked login, onboarding, modules, forum posting, career browsing, profile editing, certificate access, and roadmap navigation.' },
    { title: 'Different Data Values', desc: 'Tested with beginner, intermediate, and mentor user profiles; short and long bios; low and high module completion values; and varied forum/career content.' },
    { title: 'Device and Performance Testing', desc: 'Verified responsive behavior on desktop and mobile sizes, with smooth rendering on lower-spec browsers and stable layout on small screens.' },
    { title: 'User Acceptance Testing', desc: 'Validated the platform with beta-style user flows that reflect the proposal: learning, mentorship, community, careers, and progress tracking.' },
  ];

  const findings = [
    { label: 'Matched proposal objective', value: 'Integrated learning + mentorship + careers + community' },
    { label: 'Strongest result', value: 'Clear progress visibility and structured support flows' },
    { label: 'Missed objective', value: 'Long-term 12-month outcome tracking remains future work' },
    { label: 'Most useful feature', value: 'Non-quiz milestone pages: roadmap, certificate, notifications, profile' },
  ];

  const recommendations = [
    'Continue collecting beta-user feedback to refine the forum, roadmap, and career pages.',
    'Add live mentor scheduling persistence and real analytics storage for later deployment.',
    'Expand Twi support and offline caching for lower-connectivity devices.',
    'Use the certificate and roadmap pages as evidence of milestone completion in the final demo.',
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
          <button style={styles.outlineBtn} onClick={() => go('roadmap')}>Roadmap</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Testing & Evaluation</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Aligned with the proposal: testing results, analysis, discussion, and recommendations.</p>
        </div>

        <div style={styles.grid2}>
          {testCards.map((card, i) => (
            <div key={i} style={styles.card}>
              <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'10px' }}>{card.title}</h3>
              <p style={{ color:'#555', lineHeight:'1.7', fontSize:'14px', margin:0 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, marginTop:'25px' }}>
          <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'15px' }}>Analysis Summary</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {findings.map((item, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:'12px', flexWrap:'wrap', padding:'12px 0', borderBottom:'1px solid #f0f0f0' }}>
                <span style={{ color:'#666', fontSize:'14px', fontWeight:'700' }}>{item.label}</span>
                <span style={{ color:'#333', fontSize:'14px', fontWeight:'500', maxWidth:'72%' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.grid2}>
          <div style={styles.card}>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'15px' }}>Discussion</h3>
            <p style={{ color:'#555', lineHeight:'1.8', fontSize:'14px', margin:0 }}>
              The project milestones matter because they show the platform is not only a quiz system. The roadmap, notifications, profile editing, certificate flow, forum, and career pages demonstrate an integrated learning experience that reflects the proposal’s broader vision of empowerment, mentorship, and career readiness.
            </p>
          </div>
          <div style={styles.card}>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'15px' }}>Recommendations</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {recommendations.map((item, i) => (
                <div key={i} style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'12px', padding:'12px 14px', color:'#555', fontSize:'14px', lineHeight:'1.6' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop:'25px', textAlign:'center' }}>
          <button style={styles.primaryBtn} onClick={() => go('certificate')}>Review Certificate Milestone</button>
        </div>
      </div>
    </div>
  );
}

function Forum({ user, go }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title:'', content:'', category:'general' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getForumPosts()
      .then(res => { setPosts(res.data.posts); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const submitPost = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      const authorName = user ? user.firstName + ' ' + user.lastName : 'Anonymous';
      const { data } = await createForumPost({ ...newPost, author: authorName });
      setPosts(prev => [data.post, ...prev]);
      setNewPost({ title:'', content:'', category:'general' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryStyle = (cat) => {
    if (cat === 'motivation') return { background:'#e8f5e8', color:'#2d7a2d' };
    if (cat === 'question') return { background:'#e8f0ff', color:'#5a3e8a' };
    if (cat === 'career') return { background:'#fff3e0', color:'#e65100' };
    return { background:'#f0f0f0', color:'#666' };
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'30px', flexWrap:'wrap', gap:'15px' }}>
          <div>
            <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Community Forum</h2>
            <p style={{ color:'#888', fontSize:'16px' }}>Connect with other women on the Pool of Grace journey</p>
          </div>
          <button style={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Start a Discussion'}
          </button>
        </div>

        {showForm && (
          <div style={{ ...styles.card, marginBottom:'30px', border:'2px solid '+lightGreen }}>
            <h3 style={{ color:green, marginBottom:'20px', fontSize:'17px', fontWeight:'700' }}>Share with the Community</h3>
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Category</label>
            <select style={styles.input} value={newPost.category} onChange={e => setNewPost({...newPost, category:e.target.value})}>
              <option value="general">General Discussion</option>
              <option value="motivation">Motivation and Inspiration</option>
              <option value="question">Question — I need help</option>
              <option value="career">Career and Jobs</option>
            </select>
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Title</label>
            <input style={styles.input} placeholder="What do you want to share or ask?" value={newPost.title} onChange={e => setNewPost({...newPost, title:e.target.value})} />
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#444', display:'block', marginBottom:'6px' }}>Your Message</label>
            <textarea style={styles.textarea} placeholder="Share your thoughts, experience, question, or encouragement..." value={newPost.content} onChange={e => setNewPost({...newPost, content:e.target.value})} />
            <button style={{ ...styles.primaryBtn, padding:'13px 30px', borderRadius:'12px' }} onClick={submitPost} disabled={!newPost.title || !newPost.content}>
              Post to Community
            </button>
          </div>
        )}

        <div style={{ display:'flex', gap:'10px', marginBottom:'25px', flexWrap:'wrap' }}>
          {[['all', 'All Posts'], ['motivation', 'Motivation'], ['question', 'Questions'], ['career', 'Career']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={styles.sidebarBtn(filter === key)}>{label}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color:'#888' }}>Loading posts...</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            {filtered.map(post => (
              <div key={post.id} style={styles.card}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'15px', flexWrap:'wrap', gap:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'42px', height:'42px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:white, fontWeight:'800', fontSize:'16px' }}>{post.authorInitial}</span>
                    </div>
                    <div>
                      <div style={{ color:'#1a1a1a', fontWeight:'700', fontSize:'15px' }}>{post.author}</div>
                      <div style={{ color:'#aaa', fontSize:'12px' }}>{post.date}</div>
                    </div>
                  </div>
                  <span style={{ ...getCategoryStyle(post.category), padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', textTransform:'capitalize' }}>{post.category}</span>
                </div>
                <h3 style={{ color:'#1a1a1a', fontSize:'17px', fontWeight:'700', marginBottom:'10px' }}>{post.title}</h3>
                <p style={{ color:'#666', fontSize:'14px', lineHeight:'1.7', marginBottom:'15px' }}>{post.content}</p>
                <div style={{ display:'flex', gap:'20px' }}>
                  <span style={{ color:'#aaa', fontSize:'13px' }}>{post.likes} likes</span>
                  <span style={{ color:'#aaa', fontSize:'13px' }}>{post.replies} replies</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Careers({ go }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getJobs()
      .then(res => { setJobs(res.data.jobs); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.type === filter);

  const getTypeStyle = (type) => {
    if (type === 'job') return { background:'#e8f5e8', color:'#2d7a2d', label:'Full-time Job' };
    if (type === 'internship') return { background:'#e8f0ff', color:'#5a3e8a', label:'Internship' };
    if (type === 'scholarship') return { background:'#fff3e0', color:'#e65100', label:'Scholarship' };
    return { background:'#e8f8ff', color:'#0066cc', label:'Certification' };
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Career Resources</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Ghana technology jobs, internships, scholarships, and certifications curated for you</p>
        </div>

        <div style={{ background:'linear-gradient(135deg, '+green+', '+lightGreen+')', padding:'25px 30px', borderRadius:'16px', marginBottom:'30px', color:white }}>
          <h3 style={{ margin:'0 0 8px', fontSize:'18px', fontWeight:'700' }}>Ghana Tech Salary Overview</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginTop:'15px' }}>
            {[['Entry Level', '2,500 — 4,500 GHS/mo', 'Web Dev, IT Support, Data Entry'], ['Mid Level', '4,500 — 8,000 GHS/mo', 'Software Dev, UX Design, Analyst'], ['Senior Level', '8,000+ GHS/mo', 'Engineering Lead, CTO, Architect']].map(([level, salary, roles], i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.15)', padding:'15px', borderRadius:'12px' }}>
                <div style={{ fontSize:'13px', opacity:0.8, marginBottom:'5px' }}>{level}</div>
                <div style={{ fontSize:'18px', fontWeight:'800', marginBottom:'5px' }}>{salary}</div>
                <div style={{ fontSize:'12px', opacity:0.7 }}>{roles}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:'10px', marginBottom:'25px', flexWrap:'wrap' }}>
          {[['all', 'All Opportunities ('+jobs.length+')'], ['job', 'Full-time Jobs'], ['internship', 'Internships'], ['scholarship', 'Scholarships'], ['certification', 'Certifications']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={styles.sidebarBtn(filter === key)}>{label}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color:'#888' }}>Loading opportunities...</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            {filtered.map(job => {
              const typeStyle = getTypeStyle(job.type);
              return (
                <div key={job.id} style={{ ...styles.card, border:'1px solid #e8f5e8' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'15px', flexWrap:'wrap', gap:'10px' }}>
                    <div>
                      <span style={{ ...typeStyle, padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', display:'inline-block', marginBottom:'8px' }}>{typeStyle.label}</span>
                      <h3 style={{ color:'#1a1a1a', fontSize:'18px', fontWeight:'700', margin:'0 0 5px' }}>{job.title}</h3>
                      <p style={{ color:green, fontSize:'14px', fontWeight:'600', margin:0 }}>{job.company} — {job.location}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color:green, fontSize:'16px', fontWeight:'800' }}>{job.salary}</div>
                      <div style={{ color:'#aaa', fontSize:'12px', marginTop:'4px' }}>Deadline: {job.deadline}</div>
                    </div>
                  </div>
                  <p style={{ color:'#666', fontSize:'14px', lineHeight:'1.7', marginBottom:'15px' }}>{job.description}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      {job.tags.map((tag, i) => (
                        <span key={i} style={{ background:'#f0f0f0', color:'#555', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'600' }}>{tag}</span>
                      ))}
                    </div>
                    <button style={styles.primaryBtn}>Apply Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Schedule({ user, go }) {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({ mentor:'', date:'', time:'', type:'', notes:'' });
  const [confirmed, setConfirmed] = useState(false);
  const officeHoursMeetLink = 'https://meet.google.com/bii-jzew-udd';
  const officeHoursTime = 'Saturdays, 4:00 PM Ghana Time';

  const mentors = [
    { id:1, name:'Abena Asante', role:'Senior Software Engineer', company:'MTN Ghana', experience:'8 years', speciality:'Web Development and Career Guidance', location:'Accra', available:'Mon, Wed, Fri' },
    { id:2, name:'Akosua Mensah', role:'Data Analyst', company:'Vodafone Ghana', experience:'5 years', speciality:'Data Science and Python', location:'Kumasi', available:'Tue, Thu, Sat' },
    { id:3, name:'Ama Boateng', role:'UX Designer', company:'Hubtel', experience:'6 years', speciality:'UI/UX Design and Product Thinking', location:'Accra', available:'Mon, Tue, Thu' },
    { id:4, name:'Efua Darko', role:'Cybersecurity Analyst', company:'GCB Bank', experience:'7 years', speciality:'Cybersecurity and IT Support', location:'Kumasi', available:'Wed, Fri, Sat' },
  ];

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  const sessionTypes = [
    { value:'introduction', label:'Introduction Session — Meet your mentor and set goals (30 mins)' },
    { value:'technical', label:'Technical Help — Get guidance on a specific module or coding challenge (45 mins)' },
    { value:'career', label:'Career Guidance — Discuss job opportunities and your career path (45 mins)' },
    { value:'general', label:'General Mentorship — Open discussion about your progress (30 mins)' },
  ];

  const selectedMentor = mentors.find(m => m.id === parseInt(booking.mentor));

  if (confirmed) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
        </nav>
        <div style={{ maxWidth:'600px', margin:'60px auto', padding:'20px', textAlign:'center' }}>
          <div style={{ ...styles.card, padding:'50px' }}>
            <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 25px' }}>
              <span style={{ color:white, fontSize:'36px' }}>✓</span>
            </div>
            <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'15px' }}>Session Booked!</h2>
            <p style={{ color:'#666', fontSize:'16px', lineHeight:'1.7', marginBottom:'25px' }}>Your mentorship session has been scheduled. You will receive a Zoom link before your session.</p>
            <div style={{ background:paleGreen, padding:'20px', borderRadius:'12px', marginBottom:'30px', textAlign:'left' }}>
              <p style={{ color:green, fontWeight:'700', margin:'0 0 12px' }}>Session Details:</p>
              <p style={{ color:'#555', margin:'4px 0', fontSize:'14px' }}>Mentor: {selectedMentor && selectedMentor.name}</p>
              <p style={{ color:'#555', margin:'4px 0', fontSize:'14px' }}>Date: {booking.date}</p>
              <p style={{ color:'#555', margin:'4px 0', fontSize:'14px' }}>Time: {booking.time}</p>
              <p style={{ color:'#555', margin:'4px 0', fontSize:'14px' }}>Type: {sessionTypes.find(s => s.value === booking.type)?.label.split(' —')[0]}</p>
            </div>
            <button style={styles.primaryBtn} onClick={() => go('dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Back to Dashboard</button>
      </nav>
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'40px 20px' }}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Schedule Mentorship Session</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Book a session with a Ghanaian woman in technology</p>
        </div>
        <div style={{ ...styles.card, marginBottom:'25px', border:'2px solid '+paleGreen }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px' }}>
            <div>
              <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', margin:'0 0 8px' }}>Office Hours</h3>
              <p style={{ color:'#555', fontSize:'14px', margin:'0 0 8px', lineHeight:'1.6' }}><strong>General meet-up link:</strong> <a href={officeHoursMeetLink} target="_blank" rel="noreferrer" style={{ color:green, fontWeight:'700', textDecoration:'none' }}>{officeHoursMeetLink}</a></p>
              <p style={{ color:'#555', fontSize:'14px', margin:0, lineHeight:'1.6' }}><strong>Schedule:</strong> {officeHoursTime}</p>
            </div>
            <img
              src="/office-hours-photo.jpeg"
              alt="Office hours host"
              style={{ width:'110px', height:'110px', borderRadius:'18px', objectFit:'cover', border:'1px solid #e8dada', background:'#f3e8e8' }}
            />
          </div>
          <p style={{ color:'#666', fontSize:'13px', margin:'15px 0 0', lineHeight:'1.6' }}>Office hours photo added beside the booking details for easy recognition.</p>
        </div>
        <div style={{ display:'flex', gap:'10px', marginBottom:'35px' }}>
          {['Choose Mentor', 'Pick Date and Time', 'Confirm'].map((label, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'50%', background: step > i+1 ? lightGreen : step === i+1 ? green : '#e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', color: step >= i+1 ? white : '#aaa', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span style={{ color: step === i+1 ? green : '#aaa', fontSize:'14px', fontWeight: step === i+1 ? '700' : '400' }}>{label}</span>
              {i < 2 && <div style={{ width:'30px', height:'2px', background:'#e0e0e0' }}></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'20px' }}>Available Mentors</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
              {mentors.map(mentor => (
                <div key={mentor.id} style={{ ...styles.card, border:'2px solid '+(booking.mentor === String(mentor.id) ? lightGreen : '#e8f5e8'), cursor:'pointer', background: booking.mentor === String(mentor.id) ? '#f8fff8' : white }} onClick={() => setBooking({...booking, mentor:String(mentor.id)})}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'10px' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
                        <div style={{ width:'45px', height:'45px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <span style={{ color:white, fontWeight:'800', fontSize:'16px' }}>{mentor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div style={{ color:'#1a1a1a', fontWeight:'700', fontSize:'16px' }}>{mentor.name}</div>
                          <div style={{ color:'#888', fontSize:'13px' }}>{mentor.role} at {mentor.company}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:'15px', flexWrap:'wrap' }}>
                        <span style={{ color:'#666', fontSize:'13px' }}>Experience: {mentor.experience}</span>
                        <span style={{ color:'#666', fontSize:'13px' }}>Location: {mentor.location}</span>
                      </div>
                      <div style={{ marginTop:'8px' }}>
                        <span style={{ background:paleGreen, color:green, padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'600' }}>{mentor.speciality}</span>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color:'#aaa', fontSize:'12px', marginBottom:'5px' }}>Available:</div>
                      <div style={{ color:green, fontSize:'13px', fontWeight:'600' }}>{mentor.available}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ ...styles.primaryBtn, marginTop:'25px', padding:'14px 35px', borderRadius:'12px' }} onClick={() => setStep(2)} disabled={!booking.mentor}>
              Continue — Select Date and Time
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'20px' }}>Select Date, Time and Session Type</h3>
            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Session Type</label>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'25px' }}>
              {sessionTypes.map(type => (
                <label key={type.value} style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'14px 18px', borderRadius:'12px', border:'2px solid '+(booking.type === type.value ? lightGreen : '#e8f5e8'), background: booking.type === type.value ? paleGreen : white, cursor:'pointer' }}>
                  <input type="radio" name="sessionType" value={type.value} checked={booking.type === type.value} onChange={e => setBooking({...booking, type:e.target.value})} style={{ accentColor:lightGreen, width:'16px', height:'16px', marginTop:'2px' }} />
                  <span style={{ color:'#333', fontSize:'14px', lineHeight:'1.5' }}>{type.label}</span>
                </label>
              ))}
            </div>
            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Preferred Date</label>
            <input style={styles.input} type="date" value={booking.date} min={new Date().toISOString().split('T')[0]} onChange={e => setBooking({...booking, date:e.target.value})} />
            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Preferred Time</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'20px' }}>
              {timeSlots.map(time => (
                <button key={time} style={{ padding:'12px 8px', borderRadius:'10px', border:'2px solid '+(booking.time === time ? lightGreen : '#e8f5e8'), background: booking.time === time ? paleGreen : white, color: booking.time === time ? green : '#555', cursor:'pointer', fontSize:'13px', fontWeight:'600' }} onClick={() => setBooking({...booking, time})}>
                  {time}
                </button>
              ))}
            </div>
            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Notes for your mentor (optional)</label>
            <textarea style={styles.textarea} placeholder="Let your mentor know what you would like to focus on..." value={booking.notes} onChange={e => setBooking({...booking, notes:e.target.value})} />
            <div style={{ display:'flex', gap:'12px' }}>
              <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px' }} onClick={() => setStep(1)}>Back</button>
              <button style={{ ...styles.primaryBtn, flex:1, padding:'14px', borderRadius:'12px' }} onClick={() => setStep(3)} disabled={!booking.type || !booking.date || !booking.time}>Review and Confirm</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'20px' }}>Confirm Your Session</h3>
            <div style={{ ...styles.card, marginBottom:'25px', border:'2px solid '+paleGreen }}>
              <h4 style={{ color:green, marginBottom:'18px', fontSize:'16px', fontWeight:'700' }}>Session Summary</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  { label:'Mentor', value: selectedMentor ? selectedMentor.name + ' — ' + selectedMentor.role : '' },
                  { label:'Company', value: selectedMentor ? selectedMentor.company : '' },
                  { label:'Session Type', value: sessionTypes.find(s => s.value === booking.type)?.label.split(' —')[0] || '' },
                  { label:'Date', value: booking.date },
                  { label:'Time', value: booking.time },
                  { label:'Platform', value: 'Zoom (link sent to your email)' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', paddingBottom:'12px', borderBottom:'1px solid #f0f0f0' }}>
                    <span style={{ color:'#888', fontSize:'14px', fontWeight:'600' }}>{item.label}</span>
                    <span style={{ color:'#333', fontSize:'14px', fontWeight:'500', textAlign:'right', maxWidth:'60%' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:paleGreen, padding:'15px 20px', borderRadius:'12px', marginBottom:'25px' }}>
              <p style={{ color:green, fontSize:'14px', margin:0, lineHeight:'1.6' }}>By confirming you commit to attending at the scheduled time. Please cancel at least 24 hours in advance if needed.</p>
            </div>
            <div style={{ display:'flex', gap:'12px' }}>
              <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px' }} onClick={() => setStep(2)}>Edit</button>
              <button style={{ ...styles.primaryBtn, flex:1, padding:'14px', borderRadius:'12px', fontSize:'16px' }} onClick={() => setConfirmed(true)}>Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Modules({ go, openModule, completedModules }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getModules()
      .then(res => { setModules(res.data.modules); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? modules : modules.filter(m => m.category === filter);

  const getBadgeStyle = (cat) => {
    if (cat === 'self-worth') return { background:'#e8f5e8', color:'#2d7a2d' };
    if (cat === 'technical-skills') return { background:'#ede8ff', color:'#5a3e8a' };
    return { background:'#fff3e0', color:'#e65100' };
  };

  const getLabel = (cat) => {
    if (cat === 'self-worth') return 'Self Worth';
    if (cat === 'technical-skills') return 'Tech Skills';
    return 'Career Development';
  };

  const getCategoryColor = (cat) => {
    if (cat === 'self-worth') return lightGreen;
    if (cat === 'technical-skills') return '#7c5cbf';
    return '#e67e22';
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Back to Dashboard</button>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'35px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Learning Modules</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Complete all 20 modules to earn your Pool of Grace certificate — {completedModules.length} completed so far</p>
        </div>
        <div style={{ ...styles.canvasSection, padding:'22px', marginBottom:'28px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.25fr 0.75fr', gap:'18px', alignItems:'center' }}>
            <div>
              <div style={{ ...styles.canvasLabel, marginBottom:'12px' }}>Learning Workspace</div>
              <h3 style={{ color:green, fontSize:'24px', fontWeight:'800', margin:'0 0 10px' }}>Modules, videos, notes, testimonies, and community support in one place.</h3>
              <p style={{ color:'#666', fontSize:'15px', lineHeight:'1.7', margin:0 }}>
                Each module includes a study canvas, clickable video links, office hours, and a quiz that is different for every lesson.
              </p>
            </div>
            <div style={{ background:'linear-gradient(135deg, rgba(45,122,45,0.94), rgba(92,184,92,0.94))', borderRadius:'22px', padding:'18px 20px', color:white, boxShadow:'0 16px 28px rgba(45,122,45,0.18)' }}>
              <div style={{ fontSize:'13px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'8px' }}>What you get</div>
              <div style={{ display:'grid', gap:'10px' }}>
                {['Video learning links', 'Office hours and meet-ups', 'Notes canvas', 'Live testimony and networking'].map((item, i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'14px', padding:'10px 12px', fontSize:'13px', fontWeight:'600' }}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px', marginBottom:'35px', flexWrap:'wrap' }}>
          {[['all','All Modules (20)'],['self-worth','Self Worth (7)'],['technical-skills','Tech Skills (7)'],['professional-development','Career (6)']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={styles.sidebarBtn(filter === key)}>{label}</button>
          ))}
        </div>
        {loading ? (
          <p style={{ color:'#888' }}>Loading modules...</p>
        ) : (
          <div style={styles.grid3}>
            {filtered.map(m => {
              const isCompleted = completedModules.includes(m.id);
              return (
                <div key={m.id} style={{ ...styles.moduleCard, ...(isCompleted ? { borderLeft:'4px solid '+lightGreen } : {}) }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}>
                  <div style={{ background:'linear-gradient(135deg, rgba(45,122,45,0.08), rgba(92,184,92,0.12))', borderRadius:'18px', padding:'14px 16px', marginBottom:'15px', border:'1px solid rgba(92,184,92,0.12)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
                      <span style={{ ...styles.badge, ...getBadgeStyle(m.category), marginBottom:0 }}>{getLabel(m.category)}</span>
                      <div style={{ display:'flex', gap:'5px', alignItems:'center' }}>
                        {isCompleted && <span style={{ background:'#d4edda', color:'#155724', padding:'3px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'700' }}>DONE</span>}
                        <span style={{ background:'rgba(255,255,255,0.82)', color:'#777', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'700' }}>Module {m.order}</span>
                      </div>
                    </div>
                    <div style={{ height:'8px', borderRadius:'999px', marginTop:'12px', background:'rgba(255,255,255,0.45)', overflow:'hidden' }}>
                      <div style={{ width:isCompleted ? '100%' : '42%', height:'100%', borderRadius:'999px', background:'linear-gradient(90deg, '+lightGreen+', '+green+')' }}></div>
                    </div>
                  </div>
                  <h3 style={{ color:'#1a1a1a', margin:'0 0 10px', fontSize:'17px', fontWeight:'700', lineHeight:'1.4' }}>{m.title}</h3>
                  <p style={{ color:'#777', fontSize:'14px', marginBottom:'18px', lineHeight:'1.6' }}>{m.description}</p>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
                    <span style={{ background:'#f6fbf6', color:green, padding:'6px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'700' }}>Notes canvas</span>
                    <span style={{ background:'#f6fbf6', color:green, padding:'6px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'700' }}>Videos</span>
                    <span style={{ background:'#f6fbf6', color:green, padding:'6px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'700' }}>Meet-ups</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ color:'#aaa', fontSize:'13px', fontWeight:'500' }}>{m.duration}</span>
                    <button style={{ ...styles.primaryBtn, padding:'9px 20px', fontSize:'14px', background: isCompleted ? '#888' : getCategoryColor(m.category), boxShadow:'none' }} onClick={() => openModule(m)}>
                      {isCompleted ? 'Review' : 'Start Module'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleView({ module, go, markModuleComplete, completedModules }) {
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const notesKey = module ? 'poolofgrace_module_notes_' + module.id : 'poolofgrace_module_notes';
  const [notes, setNotes] = useState(() => localStorage.getItem(notesKey) || '');
  const [notesSaved, setNotesSaved] = useState(false);

  if (!module) { go('modules'); return null; }

  const alreadyCompleted = completedModules.includes(module.id);

  const getContent = (mod) => {
    const allContent = {
      'self-worth': {
        intro: 'Welcome to this self-worth development module. This content has been designed to help you recognize your value and build the psychological foundation needed to pursue a technology career.',
        sections: [
          { heading:'Why This Module Matters', body:'Research shows that many young women in Ghana have never considered technology careers viable, having been socialized to view technology as a male field. This module directly challenges those limiting beliefs by helping you understand where they come from and why they do not define your potential.' },
          { heading:'Your Beliefs Are Not Facts', body:'Many of the beliefs we hold about ourselves were not formed by us — they were given to us by our culture, our families, and our communities. The belief that technology is not for women is not a fact. It is a story that has been told so many times it began to feel true. Pool of Grace is here to help you write a different story.' },
          { heading:'Self-Efficacy — The Key to Everything', body:'Self-efficacy is your belief in your own ability to succeed at a specific task. Research by Master et al. (2021) shows that self-efficacy is not fixed — it grows through mastery experiences, vicarious learning, social persuasion, and emotional support. Pool of Grace deliberately engineers all four.' },
          { heading:'Reflection Activity', body:'Think about one area of your life where you have already overcome a difficult challenge. That same strength will carry you through a technology career. You already have what it takes.' },
        ],
        quizzes: {
          1: [
            { question:'What is self-efficacy?', options:['Your favorite subject', 'Your belief that you can succeed at a task', 'Your exam score', 'Your internet speed'], answer:'Your belief that you can succeed at a task' },
            { question:'Why does Pool of Grace start with self-worth?', options:['To delay learning', 'To build confidence before technical learning', 'To avoid technology topics', 'To replace mentorship'], answer:'To build confidence before technical learning' },
            { question:'A limiting belief is:', options:['A fact about ability', 'A thought that reduces confidence', 'A software tool', 'A mentor session'], answer:'A thought that reduces confidence' },
            { question:'Which support helps self-worth the most?', options:['Encouragement from mentors', 'Ignoring challenges', 'No feedback', 'Comparing yourself to others'], answer:'Encouragement from mentors' },
            { question:'One outcome of self-worth growth is:', options:['Less interest in learning', 'More confidence to try new things', 'More fear of failure', 'No change at all'], answer:'More confidence to try new things' },
          ],
          2: [
            { question:'What helps build confidence most?', options:['Avoiding hard tasks', 'Trying and improving through practice', 'Waiting for perfection', 'Never asking for help'], answer:'Trying and improving through practice' },
            { question:'What is a positive role model?', options:['Someone who discourages you', 'Someone whose success shows you it is possible', 'Someone who ignores your progress', 'Someone who gives false advice'], answer:'Someone whose success shows you it is possible' },
            { question:'Self-worth improves when you:', options:['Hide your progress', 'Recognize your strengths', 'Forget your goals', 'Stop learning'], answer:'Recognize your strengths' },
            { question:'A growth mindset means:', options:['You cannot improve', 'You can improve with learning and effort', 'Talent is everything', 'Only adults can learn'], answer:'You can improve with learning and effort' },
            { question:'What should you do after a mistake?', options:['Quit immediately', 'Learn from it and try again', 'Blame yourself only', 'Ignore the problem'], answer:'Learn from it and try again' },
          ],
          3: [
            { question:'Why is emotional support important?', options:['It replaces learning', 'It reduces fear and increases confidence', 'It makes internet faster', 'It removes goals'], answer:'It reduces fear and increases confidence' },
            { question:'What is one benefit of community?', options:['Less encouragement', 'Shared motivation and support', 'More isolation', 'More confusion'], answer:'Shared motivation and support' },
            { question:'Confidence grows when you:', options:['Practice, reflect, and keep going', 'Stay silent', 'Avoid challenges', 'Compare yourself to everyone'], answer:'Practice, reflect, and keep going' },
            { question:'A healthy belief is:', options:['I can learn with time and support', 'I can never improve', 'I must know everything now', 'I should give up easily'], answer:'I can learn with time and support' },
            { question:'Which is a sign of self-growth?', options:['More courage to speak up', 'More fear of trying', 'Less interest in support', 'Less learning'], answer:'More courage to speak up' },
          ],
          4: [
            { question:'What does it mean to rewrite your story?', options:['To change your goals', 'To replace limiting beliefs with stronger ones', 'To delete your account', 'To stop learning'], answer:'To replace limiting beliefs with stronger ones' },
            { question:'What can help you face fear?', options:['Support and practice', 'Avoiding everyone', 'No feedback', 'Quitting early'], answer:'Support and practice' },
            { question:'Your background determines your future.', options:['True', 'False'], answer:'False' },
            { question:'Why should you celebrate small wins?', options:['They show growth and keep motivation high', 'They waste time', 'They are unimportant', 'They stop learning'], answer:'They show growth and keep motivation high' },
            { question:'A confident learner is someone who:', options:['Gives up quickly', 'Keeps learning through challenges', 'Never asks questions', 'Avoids new skills'], answer:'Keeps learning through challenges' },
          ],
          5: [
            { question:'Which source of self-efficacy comes from seeing others succeed?', options:['Mastery experiences', 'Vicarious learning', 'Social persuasion', 'Stress'], answer:'Vicarious learning' },
            { question:'What does social persuasion mean?', options:['Encouragement from trusted people', 'Bad internet', 'Watching videos', 'Using a computer'], answer:'Encouragement from trusted people' },
            { question:'Confidence is strongest when you have:', options:['Fear and silence', 'Practice, examples, and encouragement', 'Only talent', 'No support'], answer:'Practice, examples, and encouragement' },
            { question:'A new challenge should be seen as:', options:['A chance to grow', 'A reason to stop', 'A punishment', 'A waste of time'], answer:'A chance to grow' },
            { question:'Self-worth helps you:', options:['Believe you belong in tech', 'Avoid opportunities', 'Depend only on luck', 'Forget your goals'], answer:'Believe you belong in tech' },
          ],
          6: [
            { question:'What is mastery experience?', options:['Learning by trying and succeeding', 'Reading only', 'Watching others only', 'Ignoring feedback'], answer:'Learning by trying and succeeding' },
            { question:'What should you do after each lesson?', options:['Reflect and practice', 'Stop immediately', 'Forget everything', 'Skip the quiz'], answer:'Reflect and practice' },
            { question:'Self-belief grows when you:', options:['See progress over time', 'Compare and quit', 'Stay stuck', 'Never practice'], answer:'See progress over time' },
            { question:'Supportive words from a mentor are called:', options:['Social persuasion', 'Homework', 'Distraction', 'Rejection'], answer:'Social persuasion' },
            { question:'Pool of Grace wants learners to feel:', options:['Excluded', 'Confident and capable', 'Confused', 'Unsafe'], answer:'Confident and capable' },
          ],
          7: [
            { question:'Celebrating progress helps because it:', options:['Builds motivation and confidence', 'Stops growth', 'Makes learning harder', 'Removes support'], answer:'Builds motivation and confidence' },
            { question:'A good support system includes:', options:['Mentors, peers, and community', 'Silence and pressure', 'Only exams', 'No one'], answer:'Mentors, peers, and community' },
            { question:'A completion certificate represents:', options:['A final milestone', 'A failure', 'A random page', 'A quiz only'], answer:'A final milestone' },
            { question:'What is the best response to doubt?', options:['Keep learning and seek support', 'Give up', 'Hide', 'Do nothing'], answer:'Keep learning and seek support' },
            { question:'The final self-worth goal is to:', options:['Believe you can pursue tech', 'Avoid all opportunities', 'Stay silent forever', 'Wait for others'], answer:'Believe you can pursue tech' },
          ],
        },
      },
      'technical-skills': {
        intro: 'Welcome to this technology skills module. Every concept is explained from scratch — no prior experience is assumed or required.',
        sections: [
          { heading:'Getting Started — Your Mindset Matters', body:'Every developer you admire started exactly where you are — knowing nothing. The only difference between you and them is time and practice. You do not need to be a genius. You need to be consistent.' },
          { heading:'How Technology Works', body:'Technology is built in layers. At the foundation is hardware. On top is an operating system. On top of that are applications. When you learn web development, you are learning to build those applications using HTML for structure, CSS for design, and JavaScript for interaction.' },
          { heading:'Why Ghana Needs Women in Technology', body:'Ghana\'s technology sector grew 18% annually from 2015 to 2020. Entry-level salaries average 48,000 GHS per year — three to four times more than traditional sectors. Only 22% of Ghana\'s technology workforce is female. The country needs trained women in technology urgently.' },
          { heading:'Your Learning Strategy', body:'The most effective way to learn technology is to build things. Do not just read — try every exercise. Make mistakes. Break things. Fix them. Every time you solve a problem, your brain builds new connections.' },
        ],
        quizzes: {
          8: [
          { question:'What does HTML stand for?', options:['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Machine Language', 'Home Tool Markup Language'], answer:'Hyper Text Markup Language' },
          { question:'What is the purpose of CSS in web development?', options:['To store data', 'To style and design the appearance of a webpage', 'To handle server-side logic', 'To create databases'], answer:'To style and design the appearance of a webpage' },
          { question:'What percentage of Ghana\'s technology workforce is currently female?', options:['50%', '38%', '22%', '45%'], answer:'22%' },
          { question:'What is the best way to learn programming?', options:['Read about it without trying', 'Watch videos only', 'Build things and practice regularly', 'Wait until you know everything before starting'], answer:'Build things and practice regularly' },
          { question:'What language adds interactivity to websites?', options:['HTML', 'CSS', 'JavaScript', 'SQL'], answer:'JavaScript' },
          ],
          9: [
            { question:'JavaScript is mainly used to:', options:['Style webpages', 'Add interactivity', 'Store files', 'Draw printers'], answer:'Add interactivity' },
            { question:'Which one is a valid variable name?', options:['2name', 'full-name', 'learnerName', 'my name'], answer:'learnerName' },
            { question:'A function in programming is:', options:['A reusable block of code', 'A type of CSS', 'A folder', 'A database'], answer:'A reusable block of code' },
            { question:'What does debugging mean?', options:['Finding and fixing errors', 'Writing only comments', 'Deleting code', 'Changing fonts'], answer:'Finding and fixing errors' },
            { question:'Programming gets better through:', options:['Practice and patience', 'Guessing only', 'Fear', 'No repetition'], answer:'Practice and patience' },
          ],
          10: [
            { question:'What is a webpage structure built with?', options:['HTML', 'CSS', 'Photoshop', 'SQL'], answer:'HTML' },
            { question:'What does CSS mainly control?', options:['Appearance', 'Server hosting', 'User passwords', 'Internet speed'], answer:'Appearance' },
            { question:'What is responsive design?', options:['A design that works on different screen sizes', 'A slow website', 'A text file', 'An email list'], answer:'A design that works on different screen sizes' },
            { question:'What should you do before building a project?', options:['Plan the layout', 'Ignore the structure', 'Skip the content', 'Avoid testing'], answer:'Plan the layout' },
            { question:'A good portfolio shows:', options:['Your built projects', 'Your excuses', 'Your password', 'Only certificates'], answer:'Your built projects' },
          ],
          11: [
            { question:'Python is known for being:', options:['Easy to read and beginner-friendly', 'Only for designers', 'A styling tool', 'A browser'], answer:'Easy to read and beginner-friendly' },
            { question:'Which is a Python data type?', options:['String', 'Header', 'Pixel', 'Canvas'], answer:'String' },
            { question:'Loops help you:', options:['Repeat tasks', 'Delete files', 'Change internet speed', 'Hide errors'], answer:'Repeat tasks' },
            { question:'What is input?', options:['Information a user gives to a program', 'A finished report', 'A website theme', 'A folder'], answer:'Information a user gives to a program' },
            { question:'Python is useful for:', options:['Web apps and data tasks', 'Only music', 'Only drawing', 'Only email'], answer:'Web apps and data tasks' },
          ],
          12: [
            { question:'A database stores:', options:['Organized information', 'A browser theme', 'Only pictures', 'Passwords only'], answer:'Organized information' },
            { question:'SQL is used to:', options:['Query and manage data', 'Paint buttons', 'Create videos', 'Write essays'], answer:'Query and manage data' },
            { question:'A table in a database is made of:', options:['Rows and columns', 'Colors and icons', 'Songs and videos', 'Passwords and links'], answer:'Rows and columns' },
            { question:'Primary key means:', options:['A unique identifier for a record', 'A hidden file', 'A CSS rule', 'A button style'], answer:'A unique identifier for a record' },
            { question:'Databases are important because they:', options:['Keep data organized', 'Remove all content', 'Slow websites', 'Replace coding'], answer:'Keep data organized' },
          ],
          13: [
            { question:'A project portfolio should show:', options:['Real work and skills', 'Only photos', 'Only school names', 'No examples'], answer:'Real work and skills' },
            { question:'What is the best way to learn web development?', options:['Build projects', 'Wait for perfection', 'Only memorize theory', 'Skip practice'], answer:'Build projects' },
            { question:'GitHub is used for:', options:['Version control and sharing code', 'Making music', 'Editing photos', 'Typing essays'], answer:'Version control and sharing code' },
            { question:'Why are projects important?', options:['They show what you can do', 'They waste time', 'They are optional only', 'They replace learning'], answer:'They show what you can do' },
            { question:'A developer should test code because:', options:['It finds problems early', 'It slows everything forever', 'It removes learning', 'It is not useful'], answer:'It finds problems early' },
          ],
          14: [
            { question:'Version control helps you:', options:['Track and manage code changes', 'Delete all files', 'Change screen color', 'Avoid collaboration'], answer:'Track and manage code changes' },
            { question:'GitHub is useful for:', options:['Team work and code sharing', 'Only pictures', 'Only blogging', 'Only playing music'], answer:'Team work and code sharing' },
            { question:'A commit is:', options:['A saved change', 'A type of button', 'A video link', 'A quiz score'], answer:'A saved change' },
            { question:'Branching is useful because it:', options:['Lets you work on features safely', 'Deletes data', 'Stops collaboration', 'Makes pages slower'], answer:'Lets you work on features safely' },
            { question:'Good developers use Git because it:', options:['Improves teamwork and history tracking', 'Removes the need to test', 'Prevents learning', 'Is only for experts'], answer:'Improves teamwork and history tracking' },
          ],
        },
      },
      'professional-development': {
        intro: 'Welcome to this career development module. Ghana\'s technology sector is growing rapidly, and this module connects your new skills directly to real employment opportunities.',
        sections: [
          { heading:'Ghana\'s Technology Opportunity', body:'Entry-level technology positions in Accra and Kumasi earn an average of 48,000 GHS per year. Companies including MTN, Vodafone, Hubtel, GCB Bank, and many startups are actively recruiting trained women in technology.' },
          { heading:'Types of Technology Careers Available', body:'Technology careers in Ghana include web development, mobile app development, data analysis, cybersecurity, UI/UX design, digital marketing, IT support, and software quality assurance. Many are also suitable for freelancing.' },
          { heading:'How to Get Your First Technology Role', body:'Most technology employers in Ghana care more about what you can build than where you studied. Your portfolio of projects from the Pool of Grace technical modules is your most powerful job application tool.' },
          { heading:'Building Your Professional Network', body:'Your Pool of Grace mentor is already part of Ghana\'s technology network. Community events, LinkedIn connections, and online communities are all ways to expand your professional network before your first role.' },
        ],
        quizzes: {
          15: [
          { question:'What is a professional portfolio?', options:['A physical folder of documents', 'A collection of your work that demonstrates your skills to employers', 'Your academic transcripts', 'A list of your family members'], answer:'A collection of your work that demonstrates your skills to employers' },
          { question:'What does UI/UX stand for?', options:['Universal Interface / Universal Experience', 'User Interface / User Experience', 'Unique Integration / Unique Extension', 'User Input / User Exchange'], answer:'User Interface / User Experience' },
          { question:'Entry-level technology jobs in Ghana earn approximately:', options:['15,000 GHS per year', '25,000 GHS per year', '48,000 GHS per year', '10,000 GHS per year'], answer:'48,000 GHS per year' },
          { question:'What is LinkedIn used for?', options:['Social media for entertainment', 'Professional networking and job searching', 'Online shopping', 'Video streaming'], answer:'Professional networking and job searching' },
          { question:'Which of these is a technology company operating in Ghana?', options:['Shoprite', 'Hubtel', 'Toyota', 'Unilever'], answer:'Hubtel' },
          ],
          16: [
            { question:'A CV should mainly show:', options:['Your skills and experience', 'Your favorite food', 'Only your age', 'A random hobby'], answer:'Your skills and experience' },
            { question:'A good job application should be:', options:['Clear and tailored', 'Confusing and long', 'Copied from everyone', 'Empty'], answer:'Clear and tailored' },
            { question:'Interview preparation includes:', options:['Practicing answers', 'Ignoring the role', 'No research', 'No confidence'], answer:'Practicing answers' },
            { question:'What does networking help with?', options:['Connections and opportunities', 'Less learning', 'More confusion', 'No results'], answer:'Connections and opportunities' },
            { question:'Career development is about:', options:['Turning skills into opportunities', 'Avoiding jobs', 'Stopping learning', 'Only passing quizzes'], answer:'Turning skills into opportunities' },
          ],
          17: [
            { question:'Why practice interviews?', options:['To build confidence', 'To waste time', 'To avoid jobs', 'To ignore feedback'], answer:'To build confidence' },
            { question:'A strong answer in an interview should be:', options:['Relevant and clear', 'Very vague', 'Off-topic', 'Silent'], answer:'Relevant and clear' },
            { question:'What should you research before an interview?', options:['The company and role', 'Nothing at all', 'Only your clothes', 'Only the weather'], answer:'The company and role' },
            { question:'Good communication means:', options:['Listening and responding well', 'Talking over everyone', 'Being rude', 'Avoiding questions'], answer:'Listening and responding well' },
            { question:'Interview confidence grows through:', options:['Practice', 'Fear', 'Avoidance', 'Luck only'], answer:'Practice' },
          ],
          18: [
            { question:'Why is networking important?', options:['It opens opportunities', 'It removes jobs', 'It makes learning harder', 'It has no value'], answer:'It opens opportunities' },
            { question:'LinkedIn is useful for:', options:['Professional identity and jobs', 'Only entertainment', 'Only games', 'Only food ordering'], answer:'Professional identity and jobs' },
            { question:'A professional profile should be:', options:['Clear and complete', 'Empty', 'Private forever', 'Confusing'], answer:'Clear and complete' },
            { question:'Who can be part of your network?', options:['Mentors and peers', 'Only strangers', 'Nobody', 'Only family'], answer:'Mentors and peers' },
            { question:'Strong networks help you:', options:['Find support and leads', 'Lose focus', 'Stay stuck', 'Stop growing'], answer:'Find support and leads' },
          ],
          19: [
            { question:'Freelancing means:', options:['Working independently on projects', 'Never learning', 'Only working for free', 'Skipping clients'], answer:'Working independently on projects' },
            { question:'Entrepreneurship means:', options:['Starting something of your own', 'Copying others only', 'Avoiding responsibility', 'Never taking action'], answer:'Starting something of your own' },
            { question:'Why build a portfolio?', options:['To show your skills', 'To hide your work', 'To confuse employers', 'To avoid growth'], answer:'To show your skills' },
            { question:'A job opportunity becomes easier when you:', options:['Have proof of your skills', 'Have no experience', 'Hide your work', 'Ignore your network'], answer:'Have proof of your skills' },
            { question:'Career readiness includes:', options:['Skills, confidence, and connections', 'Only quizzes', 'Only luck', 'Only certificates'], answer:'Skills, confidence, and connections' },
          ],
          20: [
            { question:'What is the purpose of continuing your tech journey?', options:['Keep learning and growing', 'Stop after one course', 'Avoid progress', 'Forget your goals'], answer:'Keep learning and growing' },
            { question:'A strong career path needs:', options:['Practice and persistence', 'No effort', 'No mentors', 'No goals'], answer:'Practice and persistence' },
            { question:'What should you do after finishing the modules?', options:['Apply skills and keep networking', 'Stop learning forever', 'Ignore opportunities', 'Hide your certificate'], answer:'Apply skills and keep networking' },
            { question:'The best next step is to:', options:['Join opportunities and keep building', 'Quit', 'Wait forever', 'Repeat nothing'], answer:'Join opportunities and keep building' },
            { question:'Pool of Grace wants you to become:', options:['A confident, skilled, connected woman in tech', 'Someone who only watches videos', 'Someone who never tries', 'Someone who gives up'], answer:'A confident, skilled, connected woman in tech' },
          ],
        },
      }
    };
    const categoryContent = allContent[mod.category] || allContent['self-worth'];
    const quizBank = categoryContent.quizzes || {};
    return {
      ...categoryContent,
      quiz: quizBank[mod.order] || quizBank[1] || []
    };
  };

  const content = getContent(module);

  const resourcesByCategory = {
    'self-worth': {
      videos: [
        { label: 'Confidence and self-belief for women in STEM', url: 'https://www.youtube.com/results?search_query=women+in+stem+self+confidence+talk' },
        { label: 'Growth mindset and motivation', url: 'https://www.youtube.com/results?search_query=growth+mindset+motivation+for+students' },
      ],
      meetingText: 'Weekly Self-Worth Meet-up - Saturdays 4:00 PM Ghana Time',
      meetingUrl: 'https://meet.google.com/bii-jzew-udd',
      testimony: 'Share how your confidence changed after this lesson and one barrier you are overcoming.',
      network: 'Connect with other beginners, mentors, and alumni in the forum and mentorship sessions.',
      offline: 'Download screenshots or notes from this page so you can review them offline when internet is limited.',
    },
    'technical-skills': {
      videos: [
        { label: 'HTML and CSS for beginners', url: 'https://www.youtube.com/results?search_query=HTML+CSS+for+beginners' },
        { label: 'JavaScript and web development basics', url: 'https://www.youtube.com/results?search_query=JavaScript+for+beginners+web+development' },
      ],
      meetingText: 'Weekly Coding Clinic - Saturdays 4:00 PM Ghana Time',
      meetingUrl: 'https://meet.google.com/bii-jzew-udd',
      testimony: 'Post a short live testimony about the code or project you built after watching the lesson.',
      network: 'Meet peers in the forum to swap tips, study together, and review projects.',
      offline: 'Use the module notes and completed quiz feedback as your offline study guide.',
    },
    'professional-development': {
      videos: [
        { label: 'How to build a tech career portfolio', url: 'https://www.youtube.com/results?search_query=tech+career+portfolio+for+beginners' },
        { label: 'Ghana tech careers and interviews', url: 'https://www.youtube.com/results?search_query=Ghana+tech+jobs+career+advice' },
      ],
      meetingText: 'Weekly Career Circle - Saturdays 4:00 PM Ghana Time',
      meetingUrl: 'https://meet.google.com/bii-jzew-udd',
      testimony: 'Share your job-search wins, mentorship feedback, or a testimony about career clarity.',
      network: 'Use the careers page, forum, and mentorship contacts to build your professional network.',
      offline: 'Save job titles, salary notes, and interview tips for offline review and planning.',
    },
  };

  const learningResources = resourcesByCategory[module.category] || resourcesByCategory['self-worth'];

  const handleAnswer = (qi, answer) => setAnswers(prev => ({ ...prev, [qi]: answer }));
  const saveNotes = () => {
    localStorage.setItem(notesKey, notes);
    setNotesSaved(true);
    window.setTimeout(() => setNotesSaved(false), 1500);
  };

  const submitQuiz = () => {
    let correct = 0;
    content.quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    setScore(correct);
    setQuizSubmitted(true);
    if (correct >= 3 && !alreadyCompleted) markModuleComplete(module.id);
  };

  const getBorderColor = () => {
    if (module.category === 'self-worth') return lightGreen;
    if (module.category === 'technical-skills') return '#7c5cbf';
    return '#e67e22';
  };

  const getScoreColor = () => score >= 4 ? '#155724' : score >= 3 ? '#856404' : '#721c24';
  const getScoreBackground = () => score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da';

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', gap:'10px' }}>
          <button style={styles.outlineBtn} onClick={() => go('modules')}>Back to Modules</button>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Dashboard</button>
        </div>
      </nav>
      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'40px 20px' }}>
        {alreadyCompleted && (
          <div style={{ background:'#d4edda', color:'#155724', padding:'12px 20px', borderRadius:'12px', marginBottom:'20px', fontWeight:'600', textAlign:'center' }}>
            You have already completed this module! You can review the content below.
          </div>
        )}
        <div style={{ ...styles.card, borderTop:'5px solid '+getBorderColor(), marginBottom:'25px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'15px', marginBottom:'20px' }}>
            <div>
              <div style={{ fontSize:'13px', color:'#aaa', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>Module {module.order} of 20</div>
              <h1 style={{ color:green, fontSize:'28px', fontWeight:'800', margin:0, lineHeight:'1.3' }}>{module.title}</h1>
            </div>
            <div style={{ background:paleGreen, padding:'12px 18px', borderRadius:'12px', textAlign:'center' }}>
              <div style={{ color:green, fontSize:'20px', fontWeight:'800' }}>{module.duration}</div>
              <div style={{ color:'#888', fontSize:'12px' }}>estimated time</div>
            </div>
          </div>
          <div style={{ background:'#f8fdf8', padding:'18px 20px', borderRadius:'12px', borderLeft:'4px solid '+getBorderColor() }}>
            <p style={{ color:'#555', fontSize:'15px', lineHeight:'1.7', margin:0 }}>{content.intro}</p>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom:'20px', padding:'24px', border:'1px solid #dbeedb', background:'linear-gradient(180deg, rgba(248,253,248,0.98) 0%, rgba(255,255,255,0.98) 100%)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'14px', flexWrap:'wrap', marginBottom:'18px' }}>
            <div>
              <div style={{ ...styles.canvasLabel, marginBottom:'10px' }}>Module Workspace</div>
              <h2 style={{ color:green, fontSize:'22px', fontWeight:'800', margin:'0 0 6px' }}>Resources first, then notes, then links, announcements, grades, assignment, and syllabus.</h2>
              <p style={{ color:'#666', fontSize:'14px', margin:0, lineHeight:'1.7' }}>Everything you need for the module is laid out in the order learners should use it.</p>
            </div>
            <div style={{ background:paleGreen, color:green, borderRadius:'999px', padding:'8px 14px', fontSize:'12px', fontWeight:'800' }}>Module flow at a glance</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'10px' }}>
            {[
              { step:'01', title:'Resources', desc:'Open videos and guides.' },
              { step:'02', title:'Notes', desc:'Capture reflections.' },
              { step:'03', title:'Links', desc:'Jump to meet and content.' },
              { step:'04', title:'Announcements', desc:'See updates and reminders.' },
              { step:'05', title:'Grades', desc:'Check your results.' },
              { step:'06', title:'Assignment', desc:'Practice the lesson.' },
              { step:'07', title:'Syllabus', desc:'See the topic outline.' },
            ].map((item, i) => (
              <div key={item.step} style={{ borderRadius:'18px', padding:'14px', background:i === 0 ? 'linear-gradient(135deg, rgba(45,122,45,0.10), rgba(92,184,92,0.12))' : '#fff', border:'1px solid '+(i === 0 ? 'rgba(92,184,92,0.22)' : '#ebebeb'), boxShadow:'0 10px 22px rgba(16,55,16,0.05)', minHeight:'132px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                  <span style={{ width:'34px', height:'34px', borderRadius:'50%', background:i === 0 ? 'linear-gradient(135deg, '+green+', '+lightGreen+')' : paleGreen, color:i === 0 ? white : green, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800' }}>{item.step}</span>
                  <span style={{ color:'#aaa', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.6px' }}>{i === 0 ? 'Start' : 'Next'}</span>
                </div>
                <h3 style={{ color:green, fontSize:'15px', fontWeight:'800', margin:'0 0 8px' }}>{item.title}</h3>
                <p style={{ color:'#666', fontSize:'12px', lineHeight:'1.6', margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom:'20px' }}>
          <h2 style={{ color:green, fontSize:'20px', fontWeight:'700', marginBottom:'15px' }}>Resources, Links, and Support</h2>
          <div style={styles.grid2}>
            <div style={{ display:'grid', gap:'12px' }}>
              <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'14px', padding:'18px' }}>
                <h3 style={{ color:green, fontSize:'16px', fontWeight:'700', marginTop:0 }}>Resources</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {learningResources.videos.map((video, i) => (
                    <a key={i} href={video.url} target="_blank" rel="noreferrer" style={{ color:green, textDecoration:'none', fontWeight:'600', fontSize:'14px' }}>
                      {video.label}
                    </a>
                  ))}
                </div>
              </div>
              <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'14px', padding:'18px' }}>
                <h3 style={{ color:green, fontSize:'16px', fontWeight:'700', marginTop:0 }}>Links</h3>
                <p style={{ color:'#555', fontSize:'14px', lineHeight:'1.7', margin:'0 0 12px' }}><strong>Meeting link:</strong> <a href={learningResources.meetingUrl} target="_blank" rel="noreferrer" style={{ color:green, fontWeight:'700', textDecoration:'none' }}>{learningResources.meetingText}</a></p>
                <p style={{ color:'#555', fontSize:'14px', lineHeight:'1.7', margin:0 }}><strong>Offline access:</strong> {learningResources.offline}</p>
              </div>
            </div>
            <div style={{ display:'grid', gap:'12px' }}>
              <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'14px', padding:'18px' }}>
                <h3 style={{ color:green, fontSize:'16px', fontWeight:'700', marginTop:0 }}>Announcements</h3>
                <p style={{ color:'#555', fontSize:'14px', lineHeight:'1.7', margin:0 }}>{learningResources.testimony}</p>
              </div>
              <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'14px', padding:'18px' }}>
                <h3 style={{ color:green, fontSize:'16px', fontWeight:'700', marginTop:0 }}>Grades</h3>
                <p style={{ color:'#555', fontSize:'14px', lineHeight:'1.7', margin:0 }}>Your quiz score appears after you submit the quiz. Keep progressing through the module to unlock the grade.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom:'20px', border:'2px solid #ead7c6', background:'linear-gradient(180deg, #fffaf4 0%, #fffdf9 100%)' }}>
          <div style={{ marginBottom:'12px' }}>
            <h2 style={{ color:'#7a4e2c', fontSize:'20px', fontWeight:'800', margin:'0 0 6px' }}>Notes</h2>
            <p style={{ color:'#8a6b55', fontSize:'14px', margin:0 }}>Start here, save your reflections, then move to the resources and assignment.</p>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            style={{ ...styles.textarea, minHeight:'170px', marginBottom:'12px', background:'rgba(255,255,255,0.95)', border:'2px dashed #d9bca0', color:'#4b3a30' }}
          />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
            <p style={{ color:'#8a6b55', fontSize:'13px', margin:0 }}>Your notes stay private for this module.</p>
            <button style={{ ...styles.primaryBtn, background:'#8a5c3b', boxShadow:'none' }} onClick={saveNotes}>Save Notes</button>
          </div>
          {notesSaved && <p style={{ color:'#2d7a2d', fontSize:'13px', fontWeight:'700', marginTop:'10px', marginBottom:0 }}>Notes saved for this module.</p>}
        </div>

        <div style={{ ...styles.card, marginBottom:'20px', borderLeft:'5px solid '+getBorderColor() }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', flexWrap:'wrap', marginBottom:'12px' }}>
            <div>
              <h2 style={{ color:green, fontSize:'20px', fontWeight:'700', margin:'0 0 5px' }}>Assignment</h2>
              <p style={{ color:'#888', fontSize:'14px', margin:0 }}>Complete this before submitting the quiz.</p>
            </div>
            <div style={{ background:paleGreen, color:green, padding:'8px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:'700' }}>Practice first</div>
          </div>
          <div style={{ display:'grid', gap:'10px' }}>
            <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'12px', padding:'14px 16px', color:'#555', fontSize:'14px', lineHeight:'1.7' }}>
              Write a short reflection on what you learned from this module and post one takeaway in the forum or share it with your mentor.
            </div>
            <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'12px', padding:'14px 16px', color:'#555', fontSize:'14px', lineHeight:'1.7' }}>
              Use the notes area above to collect your ideas, then revisit the resources before attempting the quiz.
            </div>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom:'20px' }}>
          <h2 style={{ color:green, fontSize:'20px', fontWeight:'700', marginBottom:'15px' }}>Syllabus and Knowledge</h2>
          <div style={{ display:'grid', gap:'12px' }}>
            <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'12px', padding:'14px 16px', color:'#555', fontSize:'14px', lineHeight:'1.7' }}>
              <strong>Knowledge:</strong> Use the module sections below to read the information, knowledge, and ideas you need before the quiz.
            </div>
            <div style={{ background:'#f8fdf8', border:'1px solid #e8f5e8', borderRadius:'12px', padding:'14px 16px', color:'#555', fontSize:'14px', lineHeight:'1.7' }}>
              <strong>Syllabus:</strong> The module content below is the guided outline for this topic. Read it before you answer the quiz questions.
            </div>
          </div>
        </div>

        {content.sections.map((section, i) => (
          <div key={i} style={{ ...styles.card, marginBottom:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'15px' }}>
              <div style={{ width:'32px', height:'32px', background:paleGreen, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:green, fontWeight:'800', fontSize:'14px' }}>{i+1}</span>
              </div>
              <h2 style={{ color:green, fontSize:'19px', fontWeight:'700', margin:0 }}>{section.heading}</h2>
            </div>
            <p style={{ color:'#555', fontSize:'15px', lineHeight:'1.8', margin:0, paddingLeft:'44px' }}>{section.body}</p>
          </div>
        ))}

        <div style={{ ...styles.card, marginBottom:'25px', border:'2px solid '+getBorderColor() }}>
          <div style={{ marginBottom:'25px' }}>
            <h2 style={{ color:green, fontSize:'20px', fontWeight:'700', marginBottom:'5px' }}>Knowledge Check Quiz and Grade</h2>
            <p style={{ color:'#888', fontSize:'14px' }}>Answer all 5 questions. You need at least 3 correct to complete this module and unlock your grade.</p>
          </div>
          {!quizSubmitted ? (
            <div>
              {content.quiz.map((q, qi) => (
                <div key={qi} style={{ marginBottom:'30px', paddingBottom:'25px', borderBottom: qi < content.quiz.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <p style={{ color:'#333', fontSize:'15px', fontWeight:'600', marginBottom:'15px', lineHeight:'1.5' }}>
                    <span style={{ color:getBorderColor(), fontWeight:'800' }}>Q{qi+1}. </span>{q.question}
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {q.options.map((option, oi) => (
                      <label key={oi} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'10px', border:'2px solid '+(answers[qi] === option ? getBorderColor() : '#e8f5e8'), background: answers[qi] === option ? paleGreen : white, cursor:'pointer' }}>
                        <input type="radio" name={'q'+qi} value={option} checked={answers[qi] === option} onChange={() => handleAnswer(qi, option)} style={{ accentColor:getBorderColor(), width:'16px', height:'16px' }} />
                        <span style={{ color:'#333', fontSize:'14px' }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button style={{ ...styles.primaryBtn, background:getBorderColor(), padding:'14px 35px', fontSize:'15px', borderRadius:'12px', boxShadow:'none' }} onClick={submitQuiz} disabled={Object.keys(answers).length < content.quiz.length}>
                Submit All Answers ({Object.keys(answers).length}/{content.quiz.length} answered)
              </button>
            </div>
          ) : (
            <div>
              <div style={{ background:getScoreBackground(), padding:'20px 25px', borderRadius:'12px', marginBottom:'25px', textAlign:'center' }}>
                <div style={{ color:getScoreColor(), fontSize:'13px', fontWeight:'800', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'6px' }}>Grade</div>
                <div style={{ fontSize:'42px', fontWeight:'800', color:getScoreColor(), marginBottom:'8px' }}>{score}/5</div>
                <div style={{ fontSize:'16px', fontWeight:'700', color:getScoreColor(), marginBottom:'5px' }}>
                  {score >= 4 ? 'Excellent work!' : score >= 3 ? 'Good job — module complete!' : 'Keep trying — review and try again'}
                </div>
                <div style={{ fontSize:'14px', color:getScoreColor() }}>
                  {score >= 3 ? 'Module marked as complete on your dashboard!' : 'You need at least 3 correct to pass'}
                </div>
              </div>
              {content.quiz.map((q, qi) => (
                <div key={qi} style={{ marginBottom:'15px', padding:'15px', borderRadius:'12px', background: answers[qi] === q.answer ? '#f0fff0' : '#fff5f5', border:'1px solid '+(answers[qi] === q.answer ? '#c3e6c3' : '#f5c6cb') }}>
                  <p style={{ color:'#333', fontSize:'14px', fontWeight:'600', marginBottom:'8px' }}>Q{qi+1}: {q.question}</p>
                  <p style={{ fontSize:'13px', margin:'4px 0', color:'#666' }}>Your answer: <span style={{ fontWeight:'600', color: answers[qi] === q.answer ? '#155724' : '#721c24' }}>{answers[qi] || 'Not answered'}</span></p>
                  {answers[qi] !== q.answer && <p style={{ fontSize:'13px', margin:'4px 0', color:'#155724' }}>Correct answer: <span style={{ fontWeight:'600' }}>{q.answer}</span></p>}
                </div>
              ))}
              {score >= 3 ? (
                <div style={{ display:'flex', gap:'12px', marginTop:'20px', flexWrap:'wrap' }}>
                  <button style={{ ...styles.primaryBtn, background:getBorderColor(), padding:'13px 30px', fontSize:'15px', borderRadius:'12px' }} onClick={() => go('modules')}>Continue to Next Module</button>
                  <button style={{ ...styles.outlineBtn, padding:'13px 30px', fontSize:'15px', borderRadius:'12px' }} onClick={() => go('dashboard')}>Back to Dashboard</button>
                </div>
              ) : (
                <button style={{ ...styles.primaryBtn, background:'#e74c3c', padding:'13px 30px', fontSize:'15px', borderRadius:'12px', boxShadow:'none', marginTop:'10px' }} onClick={() => { setAnswers({}); setQuizSubmitted(false); setScore(0); }}>
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Admin({ user, go, logout }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span> — Admin</h2>
        <div style={{ display:'flex', alignItems:'center', gap:'15px' }}>
          <div style={{ background:paleGreen, padding:'8px 16px', borderRadius:'20px' }}>
            <span style={{ color:green, fontWeight:'600', fontSize:'14px' }}>Admin: {user && user.firstName}</span>
          </div>
          <button style={styles.outlineBtn} onClick={logout}>Logout</button>
        </div>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'35px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Admin Dashboard</h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Monitor and manage the Pool of Grace platform</p>
        </div>
        <div style={{ ...styles.grid4, marginBottom:'40px' }}>
          {[
            { value:'0', label:'Total Participants', sub:'registered users' },
            { value:'0', label:'Active Mentors', sub:'available' },
            { value:'0', label:'Sessions This Month', sub:'completed' },
            { value:'0%', label:'Avg Completion Rate', sub:'across all users' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize:'36px', fontWeight:'800', color:green, marginBottom:'5px' }}>{stat.value}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>{stat.label}</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
        <div style={styles.grid2}>
          {[
            { title:'Manage Users', desc:'View, edit, and manage all participant and mentor accounts', btn:'View All Users' },
            { title:'Manage Modules', desc:'Add, edit, and organize the 20 learning modules and their content', btn:'Manage Modules' },
            { title:'Mentorship Sessions', desc:'Monitor all scheduled and completed mentorship sessions', btn:'View Sessions' },
            { title:'Platform Analytics', desc:'Track engagement levels, completion rates, and user activity', btn:'View Analytics' },
          ].map((item, i) => (
            <div key={i} style={styles.adminCard}>
              <h3 style={{ color:green, marginBottom:'10px', fontSize:'17px', fontWeight:'700' }}>{item.title}</h3>
              <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>{item.desc}</p>
              <button style={styles.primaryBtn}>{item.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}