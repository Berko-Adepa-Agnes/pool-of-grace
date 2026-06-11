import React, { useState, useEffect } from 'react';
import { registerUser, loginUser, getModules } from './api';

const green = '#2d7a2d';
const lightGreen = '#5cb85c';
const paleGreen = '#eafaea';
const white = '#ffffff';

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', padding:'15px 40px', background:white, boxShadow:'0 2px 15px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100, flexWrap:'wrap' },
  logo: { color:green, margin:0, fontSize:'26px', fontWeight:'800' },
  logoSpan: { color:lightGreen },
  page: { minHeight:'100vh', background:'#f8fdf8', fontFamily:'"Segoe UI", Arial, sans-serif', overflowX:'hidden' },
  primaryBtn: { background:lightGreen, color:white, border:'none', padding:'12px 28px', borderRadius:'25px', cursor:'pointer', fontSize:'15px', fontWeight:'700', transition:'all 0.2s', boxShadow:'0 4px 15px rgba(92,184,92,0.3)' },
  outlineBtn: { background:'transparent', border:'2px solid '+lightGreen, color:lightGreen, padding:'10px 22px', borderRadius:'25px', cursor:'pointer', fontSize:'14px', fontWeight:'600', marginRight:'10px' },
  input: { width:'100%', padding:'13px 16px', marginBottom:'15px', border:'2px solid #e8f5e8', borderRadius:'12px', fontSize:'15px', boxSizing:'border-box', outline:'none' },
  textarea: { width:'100%', padding:'13px 16px', marginBottom:'15px', border:'2px solid #e8f5e8', borderRadius:'12px', fontSize:'15px', boxSizing:'border-box', outline:'none', resize:'vertical', minHeight:'100px', fontFamily:'"Segoe UI", Arial, sans-serif' },
  card: { background:white, padding:'30px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' },
  authPage: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #1a5c1a 0%, #2d7a2d 40%, #5cb85c 100%)' },
  authCard: { background:white, padding:'45px', borderRadius:'20px', width:'min(420px, calc(100vw - 32px))', boxShadow:'0 25px 70px rgba(0,0,0,0.25)', boxSizing:'border-box' },
  msg: { background:'#d4edda', color:'#155724', padding:'12px 16px', borderRadius:'10px', textAlign:'center', marginBottom:'15px', fontSize:'14px', fontWeight:'500' },
  errorMsg: { background:'#f8d7da', color:'#721c24', padding:'12px 16px', borderRadius:'10px', textAlign:'center', marginBottom:'15px', fontSize:'14px', fontWeight:'500' },
  grid2: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px' },
  grid3: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px' },
  grid4: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'20px' },
  hero: { textAlign:'center', padding:'100px 40px', background:'linear-gradient(135deg, #1a5c1a 0%, #2d7a2d 50%, #5cb85c 100%)' },
  section: { padding:'70px clamp(20px, 5vw, 60px)' },
  dashContent: { padding:'40px clamp(20px, 5vw, 60px)' },
  statCard: { background:white, padding:'28px', borderRadius:'16px', textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', borderTop:'4px solid '+lightGreen },
  adminCard: { background:white, padding:'28px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', borderLeft:'5px solid '+lightGreen, minWidth:0 },
  badge: { display:'inline-block', padding:'5px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px' },
  moduleCard: { background:white, padding:'28px', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #e8f5e8', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' },
  progressBar: { background:'#e8f5e8', borderRadius:'10px', height:'10px', overflow:'hidden', marginTop:'8px' },
};

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedAdminPanel, setSelectedAdminPanel] = useState(null);
const [, setOnboardingData] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem('poolofgrace_user');
    const savedToken = localStorage.getItem('poolofgrace_token');
    const savedOnboarding = localStorage.getItem('poolofgrace_onboarding');
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        setPage('admin');
      } else if (!savedOnboarding) {
        setPage('onboarding');
      } else {
        setPage('dashboard');
      }
    }
  }, []);

  const go = (p) => setPage(p);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('poolofgrace_user', JSON.stringify(userData));
    localStorage.setItem('poolofgrace_token', token);
    if (userData.role === 'admin') {
      setPage('admin');
    } else {
      const savedOnboarding = localStorage.getItem('poolofgrace_onboarding');
      if (!savedOnboarding) {
        setPage('onboarding');
      } else {
        setPage('dashboard');
      }
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

  const openAdminPanel = (panel) => {
    setSelectedAdminPanel(panel);
    setPage('adminAction');
  };

  if (page === 'home') return <Home go={go} />;
  if (page === 'register') return <Register go={go} login={login} />;
  if (page === 'login') return <Login go={go} login={login} />;
  if (page === 'onboarding') return <Onboarding user={user} completeOnboarding={completeOnboarding} />;
  if (page === 'selfWorthIntro') return <SelfWorthIntro user={user} go={go} />;
  if (page === 'dashboard') return <Dashboard user={user} go={go} logout={logout} />;
  if (page === 'modules') return <Modules go={go} openModule={openModule} />;
  if (page === 'moduleView') return <ModuleView module={selectedModule} go={go} />;
  if (page === 'schedule') return <Schedule user={user} go={go} />;
  if (page === 'forum') return <Forum go={go} />;
  if (page === 'career') return <CareerResources go={go} />;
  if (page === 'admin') return <Admin user={user} go={go} logout={logout} openAdminPanel={openAdminPanel} />;
  if (page === 'adminAction') return <AdminAction user={user} go={go} panel={selectedAdminPanel} />;
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
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', padding:'8px 20px', borderRadius:'20px', marginBottom:'25px' }}>
            <span style={{ color:white, fontSize:'14px', fontWeight:'600' }}>100% Free — Designed for Young Women in Ghana</span>
          </div>
          <h1 style={{ color:white, fontSize:'48px', fontWeight:'800', maxWidth:'700px', margin:'0 auto 20px', lineHeight:'1.2' }}>
            Empowering Young Women Through Technology
          </h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'20px', maxWidth:'580px', margin:'0 auto 45px', lineHeight:'1.6' }}>
            Free technology education, mentorship, and career guidance — starting with building your self-worth
          </p>
          <div style={{ display:'flex', gap:'15px', justifyContent:'center', flexWrap:'wrap' }}>
            <button style={{ ...styles.primaryBtn, background:white, color:green, fontSize:'17px', padding:'16px 40px', boxShadow:'0 8px 25px rgba(0,0,0,0.2)' }} onClick={() => go('register')}>
              Start Your Journey Free
            </button>
            <button style={{ background:'transparent', border:'2px solid rgba(255,255,255,0.6)', color:white, padding:'16px 30px', borderRadius:'25px', cursor:'pointer', fontSize:'16px', fontWeight:'600' }} onClick={() => go('login')}>
              I Have an Account
            </button>
          </div>
          <div style={{ display:'flex', gap:'40px', justifyContent:'center', marginTop:'55px', flexWrap:'wrap' }}>
            {[['20', 'Learning Modules'], ['100%', 'Free Forever'], ['12mo', 'Mentorship'], ['2', 'Cities in Ghana']].map(([val, label], i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ color:white, fontSize:'32px', fontWeight:'800' }}>{val}</div>
                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'14px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:white, padding:'80px 60px' }}>
        <div style={{ textAlign:'center', marginBottom:'55px' }}>
          <h2 style={{ color:green, fontSize:'36px', fontWeight:'800', marginBottom:'15px' }}>How Pool of Grace Works</h2>
          <p style={{ color:'#666', fontSize:'18px', maxWidth:'550px', margin:'0 auto' }}>A structured journey from self-belief to technology career</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'30px', position:'relative' }}>
          {[
            { step:'1', title:'Share Your Story', desc:'Tell us about yourself, your dreams, and the barriers you face. Your journey begins with your story.' },
            { step:'2', title:'Build Self-Worth', desc:'Complete 7 dedicated modules that address limiting beliefs and build your psychological foundation.' },
            { step:'3', title:'Learn Tech Skills', desc:'Master HTML, CSS, JavaScript, Python, and databases through 7 beginner-friendly modules.' },
            { step:'4', title:'Launch Your Career', desc:'Get mentorship, career guidance, and connections to Ghana\'s growing technology job market.' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign:'center', padding:'30px 20px' }}>
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
          <p style={{ color:'#666', fontSize:'18px', maxWidth:'550px', margin:'0 auto' }}>A complete platform built specifically for young women in Ghana</p>
        </div>
        <div style={styles.grid4}>
          {[
            { title:'Self-Worth First', desc:'7 modules addressing limiting beliefs before any technical content — because confidence is the foundation of everything', color:'#e8f5e8' },
            { title:'Technology Skills', desc:'7 modules teaching coding and web development from absolute scratch with Ghanaian examples', color:'#ede8ff' },
            { title:'Sustained Mentorship', desc:'Bi-weekly video sessions with Ghanaian women in technology for 12 months of guided support', color:'#fff3e8' },
            { title:'Career Guidance', desc:'6 modules plus a Ghana tech job board, CV building, interview preparation, and networking', color:'#e8f8ff' },
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
        <div style={{ background:paleGreen, padding:'15px', borderRadius:'12px', marginTop:'20px', border:'1px solid #c3e6c3' }}>
          <p style={{ color:green, fontWeight:'700', margin:'0 0 8px', fontSize:'13px' }}>Admin Test Account:</p>
          <p style={{ color:'#555', margin:'2px 0', fontSize:'13px' }}>Email: admin@poolofgrace.com</p>
          <p style={{ color:'#555', margin:'2px 0', fontSize:'13px' }}>Password: admin123</p>
        </div>
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
  const [data, setData] = useState({
    story: '',
    barriers: [],
    goals: '',
    techExperience: '',
    motivation: '',
    location: '',
    age: '',
    education: ''
  });

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
    setData(prev => ({
      ...prev,
      barriers: prev.barriers.includes(barrier)
        ? prev.barriers.filter(b => b !== barrier)
        : [...prev.barriers, barrier]
    }));
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
              <div style={{ marginBottom:'30px' }}>
                <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'10px' }}>
                  Welcome, {user && user.firstName}!
                </h2>
                <p style={{ color:'#666', fontSize:'16px', lineHeight:'1.7' }}>
                  We are so glad you are here. Pool of Grace was created because we believe every young woman in Ghana deserves the opportunity to pursue a technology career — regardless of her background, family situation, or what she has been told about herself.
                </p>
                <p style={{ color:'#666', fontSize:'16px', lineHeight:'1.7', marginTop:'15px' }}>
                  Before we begin, we want to hear your story. This helps us understand where you are and how we can best support your journey.
                </p>
                <div style={{ background:paleGreen, padding:'20px', borderRadius:'12px', marginTop:'20px', borderLeft:'4px solid '+lightGreen }}>
                  <p style={{ color:green, fontWeight:'600', margin:'0 0 5px', fontSize:'15px' }}>Your story matters here.</p>
                  <p style={{ color:'#555', margin:0, fontSize:'14px', lineHeight:'1.6' }}>Everything you share is completely confidential and used only to personalize your learning experience on Pool of Grace.</p>
                </div>
              </div>

              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>
                Tell us about yourself and why you are joining Pool of Grace
              </label>
              <textarea
                style={styles.textarea}
                placeholder="Share your story... Where are you from? What is your current situation? What made you decide to join Pool of Grace today?"
                value={data.story}
                onChange={e => setData({...data, story:e.target.value})}
              />

              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>
                What do you hope this platform will improve in your life?
              </label>
              <textarea
                style={styles.textarea}
                placeholder="For example: I want to get a technology job so I can support my family. I want to prove that women can succeed in technology. I want to build my own business..."
                value={data.goals}
                onChange={e => setData({...data, goals:e.target.value})}
              />

              <button
                style={{ ...styles.primaryBtn, width:'100%', padding:'15px', borderRadius:'12px', fontSize:'16px' }}
                onClick={() => setStep(2)}
                disabled={!data.story || !data.goals}
              >
                Continue — Tell Us More
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ color:green, fontSize:'24px', fontWeight:'800', marginBottom:'10px' }}>Understanding Your Barriers</h2>
              <p style={{ color:'#666', fontSize:'15px', lineHeight:'1.7', marginBottom:'25px' }}>
                Many young women in Ghana face real barriers when it comes to pursuing technology. You are not alone. Select all the barriers that apply to your situation so we can address them directly in your learning journey.
              </p>

              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'15px' }}>
                Which of these barriers have you faced? (Select all that apply)
              </label>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'25px' }}>
                {barrierOptions.map((barrier, i) => (
                  <label
                    key={i}
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'12px',
                      padding:'14px 18px',
                      borderRadius:'12px',
                      border:'2px solid '+(data.barriers.includes(barrier) ? lightGreen : '#e8f5e8'),
                      background: data.barriers.includes(barrier) ? paleGreen : white,
                      cursor:'pointer',
                      transition:'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={data.barriers.includes(barrier)}
                      onChange={() => toggleBarrier(barrier)}
                      style={{ accentColor:lightGreen, width:'18px', height:'18px' }}
                    />
                    <span style={{ color:'#333', fontSize:'14px' }}>{barrier}</span>
                  </label>
                ))}
              </div>

              <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>
                What motivates you most to pursue technology despite these barriers?
              </label>
              <textarea
                style={styles.textarea}
                placeholder="What is your driving motivation? What will keep you going when things get difficult?"
                value={data.motivation}
                onChange={e => setData({...data, motivation:e.target.value})}
              />

              <div style={{ display:'flex', gap:'12px' }}>
                <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px', fontSize:'15px' }} onClick={() => setStep(1)}>Back</button>
                <button
                  style={{ ...styles.primaryBtn, flex:1, padding:'15px', borderRadius:'12px', fontSize:'16px' }}
                  onClick={() => setStep(3)}
                  disabled={data.barriers.length === 0}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ color:green, fontSize:'24px', fontWeight:'800', marginBottom:'10px' }}>A Little More About You</h2>
              <p style={{ color:'#666', fontSize:'15px', lineHeight:'1.7', marginBottom:'25px' }}>
                This helps us match you with the right mentor and learning resources for your specific situation.
              </p>

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
                <option value="some">Some — I have tried some basic coding or digital tools</option>
                <option value="intermediate">Intermediate — I have some coding experience</option>
              </select>

              <div style={{ display:'flex', gap:'12px' }}>
                <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px', fontSize:'15px' }} onClick={() => setStep(2)}>Back</button>
                <button
                  style={{ ...styles.primaryBtn, flex:1, padding:'15px', borderRadius:'12px', fontSize:'16px' }}
                  onClick={() => setStep(4)}
                  disabled={!data.age || !data.location || !data.education || !data.techExperience}
                >
                  Almost Done
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 25px', boxShadow:'0 8px 25px rgba(92,184,92,0.35)' }}>
                <span style={{ color:white, fontSize:'36px', fontWeight:'800' }}>✓</span>
              </div>
              <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'15px' }}>
                Thank You, {user && user.firstName}!
              </h2>
              <p style={{ color:'#555', fontSize:'16px', lineHeight:'1.8', marginBottom:'20px' }}>
                We have received your story and we are honoured that you have chosen Pool of Grace to support your journey.
              </p>
              <div style={{ background:paleGreen, padding:'25px', borderRadius:'16px', marginBottom:'30px', textAlign:'left', borderLeft:'4px solid '+lightGreen }}>
                <p style={{ color:green, fontWeight:'700', fontSize:'16px', margin:'0 0 12px' }}>Here is what happens next:</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {[
                    'We will start with your self-worth — because confidence is the foundation of everything else',
                    'You will complete 7 self-worth modules before moving to technology skills',
                    'A mentor will be assigned to you for bi-weekly guidance sessions',
                    'You will have access to a community of women on the same journey',
                    'After self-worth, you will learn HTML, CSS, JavaScript, Python, and databases',
                    'Career guidance will connect your skills to real jobs in Ghana',
                  ].map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                      <div style={{ width:'20px', height:'20px', background:lightGreen, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }}>
                        <span style={{ color:white, fontSize:'11px', fontWeight:'800' }}>{i+1}</span>
                      </div>
                      <span style={{ color:'#555', fontSize:'14px', lineHeight:'1.6' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                style={{ ...styles.primaryBtn, width:'100%', padding:'16px', borderRadius:'12px', fontSize:'17px' }}
                onClick={() => completeOnboarding(data)}
              >
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
          Research shows that the biggest barrier preventing young women in Ghana from pursuing technology is not ability. It is belief. Many talented women have been told — directly and indirectly — that technology is not for them.
        </p>
        <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'19px', lineHeight:'1.8', marginBottom:'40px' }}>
          Pool of Grace starts differently. Before any coding, before any technical training, we are going to spend time on <strong style={{ color:white }}>you</strong> — your worth, your potential, and your right to pursue any career you choose.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'45px' }}>
          {[
            { num:'7', label:'Self-Worth Modules', desc:'Dedicated to your confidence and belief' },
            { num:'4', label:'Core Sources', desc:'Of self-efficacy we will build together' },
            { num:'100%', label:'Evidence-Based', desc:'Designed from psychology research' },
          ].map((item, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.12)', padding:'25px 20px', borderRadius:'16px', backdropFilter:'blur(10px)' }}>
              <div style={{ color:white, fontSize:'32px', fontWeight:'800', marginBottom:'5px' }}>{item.num}</div>
              <div style={{ color:white, fontSize:'14px', fontWeight:'700', marginBottom:'5px' }}>{item.label}</div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(255,255,255,0.1)', padding:'25px 30px', borderRadius:'16px', marginBottom:'40px', textAlign:'left' }}>
          <p style={{ color:white, fontWeight:'700', fontSize:'16px', margin:'0 0 15px' }}>The 7 Self-Worth Modules you will complete:</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {[
              'Module 1: Understanding Your Worth',
              'Module 2: Breaking Cultural Barriers',
              'Module 3: Building Confidence in Tech',
              'Module 4: Overcoming Fear of Failure',
              'Module 5: Your Vision and Goals',
              'Module 6: Community and Support',
              'Module 7: Celebrating Your Progress',
            ].map((mod, i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <div style={{ width:'6px', height:'6px', background:lightGreen, borderRadius:'50%', flexShrink:0 }}></div>
                <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'13px' }}>{mod}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          style={{ ...styles.primaryBtn, background:white, color:green, fontSize:'18px', padding:'18px 50px', boxShadow:'0 8px 25px rgba(0,0,0,0.2)' }}
          onClick={() => go('dashboard')}
        >
          I Am Ready — Take Me to My Dashboard
        </button>

        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', marginTop:'20px' }}>
          You can always return to this introduction from your dashboard
        </p>
      </div>
    </div>
  );
}

function Dashboard({ user, go, logout }) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <div style={{ display:'flex', alignItems:'center', gap:'15px' }}>
          <div style={{ background:paleGreen, padding:'8px 16px', borderRadius:'20px' }}>
            <span style={{ color:green, fontWeight:'600', fontSize:'14px' }}>{user && user.firstName} {user && user.lastName}</span>
          </div>
          <button style={styles.outlineBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={styles.dashContent}>
        <div style={{ marginBottom:'35px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>
            {greeting()}, {user && user.firstName}!
          </h2>
          <p style={{ color:'#888', fontSize:'16px' }}>Continue your journey — you are just getting started</p>
        </div>

        <div style={{ ...styles.grid4, marginBottom:'40px' }}>
          {[
            { value:'0', label:'Modules Completed', sub:'of 20 total' },
            { value:'0%', label:'Overall Progress', sub:'keep going' },
            { value:'0', label:'Mentorship Sessions', sub:'completed' },
            { value:'0', label:'Days on Platform', sub:'since joining' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize:'36px', fontWeight:'800', color:green, marginBottom:'5px' }}>{stat.value}</div>
              <div style={{ fontSize:'15px', fontWeight:'600', color:'#333', marginBottom:'4px' }}>{stat.label}</div>
              <div style={{ fontSize:'13px', color:'#aaa' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, marginBottom:'30px', borderLeft:'5px solid '+lightGreen }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px' }}>
            <div>
              <h3 style={{ color:green, fontSize:'18px', fontWeight:'700', marginBottom:'5px' }}>Your Learning Progress</h3>
              <p style={{ color:'#888', fontSize:'14px', margin:0 }}>Start with Module 1: Understanding Your Worth</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <span style={{ color:green, fontSize:'24px', fontWeight:'800' }}>0%</span>
              <span style={{ color:'#aaa', fontSize:'14px' }}> complete</span>
            </div>
          </div>
          <div style={styles.progressBar}>
            <div style={{ width:'0%', height:'100%', background:'linear-gradient(90deg, '+lightGreen+', '+green+')', borderRadius:'10px', transition:'width 0.5s' }}></div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            <span style={{ fontSize:'12px', color:'#aaa' }}>0 of 20 modules complete</span>
            <span style={{ fontSize:'12px', color:'#aaa' }}>Next: Self-Worth Module 1</span>
          </div>
        </div>

        <div style={{ ...styles.grid2, marginBottom:'20px' }}>
          <div style={{ ...styles.card, borderTop:'3px solid '+lightGreen }}>
            <h3 style={{ color:green, marginBottom:'8px', fontSize:'17px', fontWeight:'700' }}>Start Learning</h3>
            <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>Begin with your self-worth modules. These 7 modules build the psychological foundation for everything that follows.</p>
            <button style={styles.primaryBtn} onClick={() => go('modules')}>View All 20 Modules</button>
          </div>
          <div style={styles.card}>
            <h3 style={{ color:green, marginBottom:'8px', fontSize:'17px', fontWeight:'700' }}>My Mentorship</h3>
            <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>Schedule your first bi-weekly mentorship session with a Ghanaian woman in technology.</p>
            <button style={styles.primaryBtn} onClick={() => go('schedule')}>Schedule a Session</button>
          </div>
          <div style={styles.card}>
            <h3 style={{ color:green, marginBottom:'8px', fontSize:'17px', fontWeight:'700' }}>Community Forum</h3>
            <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>Connect with other young women on the same journey. Share experiences and support each other.</p>
            <button style={styles.primaryBtn} onClick={() => go('forum')}>Visit Forum</button>
          </div>
          <div style={styles.card}>
            <h3 style={{ color:green, marginBottom:'8px', fontSize:'17px', fontWeight:'700' }}>Career Resources</h3>
            <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>Browse Ghana tech jobs, internships, scholarships, and certification opportunities.</p>
            <button style={styles.primaryBtn} onClick={() => go('career')}>View Opportunities</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Forum({ go }) {
  const posts = [
    {
      author: 'Ama',
      title: 'Starting HTML as a beginner',
      category: 'Learning Support',
      content: 'I just finished the first self-worth modules and want to start HTML. What should I practice first?',
    },
    {
      author: 'Efua',
      title: 'Mentor session preparation tips',
      category: 'Mentorship',
      content: 'Has anyone prepared questions before a mentorship session? I want to make the most of my first call.',
    },
    {
      author: 'Akosua',
      title: 'Laptop alternatives for learning',
      category: 'Access and Devices',
      content: 'If you do not have a laptop yet, you can still use the mobile lessons and save notes offline.',
    },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Back to Dashboard</button>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Community Forum</h2>
          <p style={{ color:'#888', fontSize:'16px', maxWidth:'760px' }}>A safe space for questions, encouragement, and peer support while you learn.</p>
        </div>
        <div style={styles.grid3}>
          {posts.map((post, index) => (
            <div key={index} style={styles.card}>
              <div style={{ marginBottom:'12px' }}>
                <span style={{ ...styles.badge, background:'#e8f5e8', color:green }}>{post.category}</span>
              </div>
              <h3 style={{ color:green, margin:'0 0 10px', fontSize:'18px' }}>{post.title}</h3>
              <p style={{ color:'#666', lineHeight:'1.7', fontSize:'14px', marginBottom:'18px' }}>{post.content}</p>
              <div style={{ color:'#888', fontSize:'13px' }}>Posted by {post.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareerResources({ go }) {
  const resources = [
    { title: 'Junior Web Developer', company: 'Local Ghana Startup', type: 'Job', location: 'Accra' },
    { title: 'Frontend Internship', company: 'Digital Skills Hub', type: 'Internship', location: 'Kumasi' },
    { title: 'Women in Tech Scholarship', company: 'Tech Education Fund', type: 'Scholarship', location: 'Nationwide' },
    { title: 'CV and Interview Prep', company: 'Pool of Grace', type: 'Support', location: 'Online' },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
        <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Back to Dashboard</button>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ marginBottom:'30px' }}>
          <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', marginBottom:'8px' }}>Career Resources</h2>
          <p style={{ color:'#888', fontSize:'16px', maxWidth:'760px' }}>Find opportunities, preparation tools, and next-step guidance for your technology journey.</p>
        </div>
        <div style={styles.grid2}>
          {resources.map((resource, index) => (
            <div key={index} style={styles.card}>
              <div style={{ marginBottom:'12px' }}>
                <span style={{ ...styles.badge, background:'#fff3e8', color:'#b85c00' }}>{resource.type}</span>
              </div>
              <h3 style={{ color:green, margin:'0 0 10px', fontSize:'18px' }}>{resource.title}</h3>
              <p style={{ color:'#666', margin:'0 0 6px', fontSize:'14px' }}>{resource.company}</p>
              <p style={{ color:'#888', margin:0, fontSize:'13px' }}>{resource.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Schedule({ user, go }) {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({ mentor:'', date:'', time:'', type:'', notes:'' });
  const [confirmed, setConfirmed] = useState(false);

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

  const confirm = () => setConfirmed(true);

  if (confirmed) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span></h2>
          <button style={styles.outlineBtn} onClick={() => go('dashboard')}>Back to Dashboard</button>
        </nav>
        <div style={{ maxWidth:'600px', margin:'60px auto', padding:'20px', textAlign:'center' }}>
          <div style={{ ...styles.card, padding:'50px' }}>
            <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, '+green+', '+lightGreen+')', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 25px', boxShadow:'0 8px 25px rgba(92,184,92,0.35)' }}>
              <span style={{ color:white, fontSize:'36px' }}>✓</span>
            </div>
            <h2 style={{ color:green, fontSize:'26px', fontWeight:'800', marginBottom:'15px' }}>Session Booked!</h2>
            <p style={{ color:'#666', fontSize:'16px', lineHeight:'1.7', marginBottom:'25px' }}>
              Your mentorship session has been scheduled. You will receive a confirmation with the Zoom link before your session.
            </p>
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
          <p style={{ color:'#888', fontSize:'16px' }}>Book a bi-weekly session with a Ghanaian woman in technology</p>
        </div>

        <div style={{ display:'flex', gap:'10px', marginBottom:'35px' }}>
          {['Choose Mentor', 'Pick Date and Time', 'Confirm'].map((label, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{
                width:'30px', height:'30px', borderRadius:'50%',
                background: step > i+1 ? lightGreen : step === i+1 ? green : '#e0e0e0',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: step >= i+1 ? white : '#aaa',
                fontSize:'13px', fontWeight:'700', flexShrink:0
              }}>
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
                <div
                  key={mentor.id}
                  style={{
                    ...styles.card,
                    border:'2px solid '+(booking.mentor === String(mentor.id) ? lightGreen : '#e8f5e8'),
                    cursor:'pointer',
                    background: booking.mentor === String(mentor.id) ? '#f8fff8' : white,
                    transition:'all 0.2s'
                  }}
                  onClick={() => setBooking({...booking, mentor:String(mentor.id)})}
                >
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
            <button
              style={{ ...styles.primaryBtn, marginTop:'25px', padding:'14px 35px', borderRadius:'12px', fontSize:'15px' }}
              onClick={() => setStep(2)}
              disabled={!booking.mentor}
            >
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
                <label
                  key={type.value}
                  style={{
                    display:'flex', alignItems:'flex-start', gap:'12px', padding:'14px 18px',
                    borderRadius:'12px', border:'2px solid '+(booking.type === type.value ? lightGreen : '#e8f5e8'),
                    background: booking.type === type.value ? paleGreen : white,
                    cursor:'pointer', transition:'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="sessionType"
                    value={type.value}
                    checked={booking.type === type.value}
                    onChange={e => setBooking({...booking, type:e.target.value})}
                    style={{ accentColor:lightGreen, width:'16px', height:'16px', marginTop:'2px' }}
                  />
                  <span style={{ color:'#333', fontSize:'14px', lineHeight:'1.5' }}>{type.label}</span>
                </label>
              ))}
            </div>

            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Preferred Date</label>
            <input
              style={styles.input}
              type="date"
              value={booking.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setBooking({...booking, date:e.target.value})}
            />

            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>Preferred Time</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'20px' }}>
              {timeSlots.map(time => (
                <button
                  key={time}
                  style={{
                    padding:'12px 8px', borderRadius:'10px', border:'2px solid '+(booking.time === time ? lightGreen : '#e8f5e8'),
                    background: booking.time === time ? paleGreen : white,
                    color: booking.time === time ? green : '#555',
                    cursor:'pointer', fontSize:'13px', fontWeight:'600', transition:'all 0.2s'
                  }}
                  onClick={() => setBooking({...booking, time})}
                >
                  {time}
                </button>
              ))}
            </div>

            <label style={{ fontSize:'14px', fontWeight:'700', color:'#333', display:'block', marginBottom:'8px' }}>
              Notes for your mentor (optional)
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Let your mentor know what you would like to focus on in this session..."
              value={booking.notes}
              onChange={e => setBooking({...booking, notes:e.target.value})}
            />

            <div style={{ display:'flex', gap:'12px' }}>
              <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px', fontSize:'15px' }} onClick={() => setStep(1)}>Back</button>
              <button
                style={{ ...styles.primaryBtn, flex:1, padding:'14px', borderRadius:'12px', fontSize:'15px' }}
                onClick={() => setStep(3)}
                disabled={!booking.type || !booking.date || !booking.time}
              >
                Review and Confirm
              </button>
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
                  { label:'Platform', value: 'Zoom (link will be sent to your email)' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', paddingBottom:'12px', borderBottom:'1px solid #f0f0f0' }}>
                    <span style={{ color:'#888', fontSize:'14px', fontWeight:'600' }}>{item.label}</span>
                    <span style={{ color:'#333', fontSize:'14px', fontWeight:'500', textAlign:'right', maxWidth:'60%' }}>{item.value}</span>
                  </div>
                ))}
                {booking.notes && (
                  <div>
                    <span style={{ color:'#888', fontSize:'14px', fontWeight:'600' }}>Your Notes:</span>
                    <p style={{ color:'#555', fontSize:'14px', marginTop:'5px', lineHeight:'1.6' }}>{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ background:paleGreen, padding:'15px 20px', borderRadius:'12px', marginBottom:'25px' }}>
              <p style={{ color:green, fontSize:'14px', margin:0, lineHeight:'1.6' }}>
                By confirming this session, you commit to attending at the scheduled time. If you need to cancel, please do so at least 24 hours in advance so your mentor can make herself available to other participants.
              </p>
            </div>
            <div style={{ display:'flex', gap:'12px' }}>
              <button style={{ ...styles.outlineBtn, padding:'14px 25px', borderRadius:'12px', fontSize:'15px' }} onClick={() => setStep(2)}>Edit</button>
              <button style={{ ...styles.primaryBtn, flex:1, padding:'14px', borderRadius:'12px', fontSize:'16px' }} onClick={confirm}>
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Modules({ go, openModule }) {
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
          <p style={{ color:'#888', fontSize:'16px' }}>Complete all 20 modules to earn your Pool of Grace certificate</p>
        </div>

        <div style={{ display:'flex', gap:'10px', marginBottom:'35px', flexWrap:'wrap' }}>
          {[
            { key:'all', label:'All Modules (20)' },
            { key:'self-worth', label:'Self Worth (7)' },
            { key:'technical-skills', label:'Tech Skills (7)' },
            { key:'professional-development', label:'Career (6)' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding:'10px 22px', borderRadius:'25px',
                border:'2px solid '+(filter === f.key ? lightGreen : '#e0e0e0'),
                background: filter === f.key ? lightGreen : white,
                color: filter === f.key ? white : '#666',
                cursor:'pointer', fontSize:'14px', fontWeight:'600', transition:'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'60px' }}>
            <p style={{ color:'#888', fontSize:'18px' }}>Loading modules...</p>
          </div>
        ) : (
          <div style={styles.grid3}>
            {filtered.map(m => (
              <div
                key={m.id}
                style={styles.moduleCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'15px' }}>
                  <span style={{ ...styles.badge, ...getBadgeStyle(m.category) }}>{getLabel(m.category)}</span>
                  <span style={{ background:'#f0f0f0', color:'#888', padding:'4px 10px', borderRadius:'12px', fontSize:'12px', fontWeight:'600' }}>
                    Module {m.order}
                  </span>
                </div>
                <h3 style={{ color:'#1a1a1a', margin:'0 0 10px', fontSize:'17px', fontWeight:'700', lineHeight:'1.4' }}>{m.title}</h3>
                <p style={{ color:'#777', fontSize:'14px', marginBottom:'18px', lineHeight:'1.6' }}>{m.description}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ color:'#aaa', fontSize:'13px', fontWeight:'500' }}>{m.duration}</span>
                  <button
                    style={{ ...styles.primaryBtn, padding:'9px 20px', fontSize:'14px', background:getCategoryColor(m.category), boxShadow:'none' }}
                    onClick={() => openModule(m)}
                  >
                    Start Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleView({ module, go }) {
// eslint-disable-next-line no-unused-vars
const [completed, setCompleted] = useState(false);  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!module) { go('modules'); return null; }

  const getContent = (mod) => {
    const allContent = {
      'self-worth': {
        intro: 'Welcome to this self-worth development module. This content has been designed to help you recognize your value and build the psychological foundation needed to pursue a technology career.',
        sections: [
          { heading:'Why This Module Matters', body:'Research shows that many young women in Ghana have never considered technology careers viable, having been socialized to view technology as a male field. This module directly challenges those limiting beliefs by helping you understand where they come from and why they do not define your potential.' },
          { heading:'Your Beliefs Are Not Facts', body:'Many of the beliefs we hold about ourselves were not formed by us — they were given to us by our culture, our families, and our communities. The belief that technology is not for women is not a fact. It is a story that has been told so many times it began to feel true. Pool of Grace is here to help you write a different story.' },
          { heading:'Self-Efficacy — The Key to Everything', body:'Self-efficacy is your belief in your own ability to succeed at a specific task. Research by Master et al. (2021) shows that self-efficacy is not fixed — it grows through mastery experiences (completing challenging tasks), vicarious learning (seeing women like you succeed), social persuasion (encouragement from credible people), and emotional support (reduced anxiety). Pool of Grace deliberately engineers all four.' },
          { heading:'Reflection Activity', body:'Take a moment to think about one area of your life where you have already overcome a difficult challenge. Maybe you completed school despite financial pressure. Maybe you supported your family through hardship. That strength — whatever its source — is the same strength that will carry you through a technology career. You already have it.' },
        ],
        quiz: [
          { question:'Self-efficacy refers to:', options:['Your intelligence level', 'Your belief in your own ability to succeed at a task', 'How much education you have', 'Your natural talent in technology'], answer:'Your belief in your own ability to succeed at a task' },
          { question:'According to research, self-efficacy is:', options:['Fixed from birth', 'Only for naturally talented people', 'Developed through experience and support', 'Determined by your gender'], answer:'Developed through experience and support' },
          { question:'Which of these is NOT one of the four sources of self-efficacy?', options:['Mastery experiences', 'Vicarious learning', 'Memorizing facts', 'Social persuasion'], answer:'Memorizing facts' },
          { question:'The belief that technology is not for women is:', options:['A scientific fact', 'A cultural story that can be changed', 'Proven by research', 'An unchangeable truth'], answer:'A cultural story that can be changed' },
          { question:'Pool of Grace starts with self-worth modules because:', options:['Technology is too hard to start with', 'Confidence is the foundation for learning technology', 'Self-worth is more important than technical skills', 'It is easier than coding'], answer:'Confidence is the foundation for learning technology' },
        ]
      },
      'technical-skills': {
        intro: 'Welcome to this technology skills module. Every concept is explained from scratch — no prior experience is assumed or required. Technology skills are learned through practice, not talent.',
        sections: [
          { heading:'Getting Started — Your Mindset Matters', body:'Before we begin any technical content, remember this: every developer you admire started exactly where you are — knowing nothing. The only difference between you and them is time and practice. You do not need to be a genius. You need to be consistent.' },
          { heading:'How Technology Works', body:'Technology is built in layers. At the foundation is hardware — the physical machine. On top of that is an operating system. On top of that are applications — the websites and apps you use every day. When you learn web development, you are learning to build those applications. You will start with HTML (structure), then CSS (design), then JavaScript (interaction).' },
          { heading:'Why Ghana Needs Women in Technology', body:'Ghana\'s technology sector grew 18% annually from 2015 to 2020. Entry-level technology salaries average 48,000 GHS per year — three to four times more than traditional sectors. Only 22% of Ghana\'s technology workforce is female. The country needs trained women in technology urgently, and Pool of Grace exists to help you be one of them.' },
          { heading:'Your Learning Strategy', body:'The most effective way to learn technology is to build things. Do not just read — try every exercise. Make mistakes. Break things. Fix them. Every time you solve a problem, your brain builds new connections. Within seven technical modules, you will have built real projects for your portfolio that you can show to employers.' },
        ],
        quiz: [
          { question:'What does HTML stand for?', options:['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Machine Language', 'Home Tool Markup Language'], answer:'Hyper Text Markup Language' },
          { question:'What is the purpose of CSS in web development?', options:['To store data', 'To style and design the appearance of a webpage', 'To handle server-side logic', 'To create databases'], answer:'To style and design the appearance of a webpage' },
          { question:'What percentage of Ghana\'s technology workforce is currently female?', options:['50%', '38%', '22%', '45%'], answer:'22%' },
          { question:'What is the best way to learn programming?', options:['Read about it without trying', 'Watch videos only', 'Build things and practice regularly', 'Wait until you know everything before starting'], answer:'Build things and practice regularly' },
          { question:'What language adds interactivity to websites?', options:['HTML', 'CSS', 'JavaScript', 'SQL'], answer:'JavaScript' },
        ]
      },
      'professional-development': {
        intro: 'Welcome to this career development module. Ghana\'s technology sector is growing rapidly, and this module connects your new skills directly to real employment opportunities in Kumasi and Accra.',
        sections: [
          { heading:'Ghana\'s Technology Opportunity', body:'Ghana\'s technology sector is one of the fastest growing in West Africa. Entry-level technology positions in Accra and Kumasi earn an average of 48,000 GHS per year — significantly more than most traditional careers. Companies including MTN, Vodafone, Hubtel, GCB Bank, and many startups are actively recruiting trained women in technology.' },
          { heading:'Types of Technology Careers Available', body:'Technology careers in Ghana include web development, mobile app development, data analysis, cybersecurity, UI/UX design, digital marketing, IT support, and software quality assurance. Each of these fields has growing demand. Many are also suitable for freelancing, meaning you can work from anywhere in Ghana and even serve international clients.' },
          { heading:'How to Get Your First Technology Role', body:'Most technology employers in Ghana care more about what you can build than where you studied. Your portfolio of projects from the Pool of Grace technical modules is your most powerful job application tool. Pair it with a well-crafted CV, a professional LinkedIn profile, and references from your Pool of Grace mentor.' },
          { heading:'Building Your Professional Network', body:'In Ghana\'s technology sector, who you know matters as much as what you know. Your Pool of Grace mentor is already part of this network. Community events, women in tech meetups, LinkedIn connections, and online communities are all ways to expand your professional network before you even land your first role.' },
        ],
        quiz: [
          { question:'What is a professional portfolio?', options:['A physical folder of documents', 'A collection of your work and projects that demonstrates your skills to employers', 'Your academic transcripts', 'A list of your family members'], answer:'A collection of your work and projects that demonstrates your skills to employers' },
          { question:'What does UI/UX stand for?', options:['Universal Interface / Universal Experience', 'User Interface / User Experience', 'Unique Integration / Unique Extension', 'User Input / User Exchange'], answer:'User Interface / User Experience' },
          { question:'Entry-level technology jobs in Ghana earn approximately:', options:['15,000 GHS per year', '25,000 GHS per year', '48,000 GHS per year', '10,000 GHS per year'], answer:'48,000 GHS per year' },
          { question:'What is LinkedIn used for?', options:['Social media for entertainment', 'Professional networking and job searching', 'Online shopping', 'Video streaming'], answer:'Professional networking and job searching' },
          { question:'Which of these is a technology company operating in Ghana?', options:['Shoprite', 'Hubtel', 'Toyota', 'Unilever'], answer:'Hubtel' },
        ]
      }
    };
    return allContent[mod.category] || allContent['self-worth'];
  };

  const content = getContent(module);

  const handleAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const submitQuiz = () => {
    let correct = 0;
    content.quiz.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setQuizSubmitted(true);
  };

  const getBorderColor = () => {
    if (module.category === 'self-worth') return lightGreen;
    if (module.category === 'technical-skills') return '#7c5cbf';
    return '#e67e22';
  };

  const getScoreColor = () => {
    if (score >= 4) return '#155724';
    if (score >= 3) return '#856404';
    return '#721c24';
  };

  const getScoreBackground = () => {
    if (score >= 4) return '#d4edda';
    if (score >= 3) return '#fff3cd';
    return '#f8d7da';
  };

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

        <div style={{ ...styles.card, borderTop:'5px solid '+getBorderColor(), marginBottom:'25px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'15px', marginBottom:'20px' }}>
            <div>
              <div style={{ fontSize:'13px', color:'#aaa', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>
                Module {module.order} of 20
              </div>
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
            <h2 style={{ color:green, fontSize:'20px', fontWeight:'700', marginBottom:'5px' }}>Knowledge Check Quiz</h2>
            <p style={{ color:'#888', fontSize:'14px' }}>Answer all 5 questions. You need at least 3 correct to complete this module.</p>
          </div>

          {!quizSubmitted ? (
            <div>
              {content.quiz.map((q, qi) => (
                <div key={qi} style={{ marginBottom:'30px', paddingBottom:'25px', borderBottom: qi < content.quiz.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <p style={{ color:'#333', fontSize:'15px', fontWeight:'600', marginBottom:'15px', lineHeight:'1.5' }}>
                    <span style={{ color:getBorderColor(), fontWeight:'800' }}>Q{qi+1}. </span>
                    {q.question}
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                    {q.options.map((option, oi) => (
                      <label
                        key={oi}
                        style={{
                          display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px',
                          borderRadius:'10px', border:'2px solid '+(answers[qi] === option ? getBorderColor() : '#e8f5e8'),
                          background: answers[qi] === option ? paleGreen : white,
                          cursor:'pointer', transition:'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name={'q'+qi}
                          value={option}
                          checked={answers[qi] === option}
                          onChange={() => handleAnswer(qi, option)}
                          style={{ accentColor:getBorderColor(), width:'16px', height:'16px' }}
                        />
                        <span style={{ color:'#333', fontSize:'14px' }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                style={{ ...styles.primaryBtn, background:getBorderColor(), padding:'14px 35px', fontSize:'15px', borderRadius:'12px', boxShadow:'none' }}
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < content.quiz.length}
              >
                Submit All Answers ({Object.keys(answers).length}/{content.quiz.length} answered)
              </button>
            </div>
          ) : (
            <div>
              <div style={{ background:getScoreBackground(), padding:'20px 25px', borderRadius:'12px', marginBottom:'25px', textAlign:'center' }}>
                <div style={{ fontSize:'42px', fontWeight:'800', color:getScoreColor(), marginBottom:'8px' }}>{score}/5</div>
                <div style={{ fontSize:'16px', fontWeight:'700', color:getScoreColor(), marginBottom:'5px' }}>
                  {score >= 4 ? 'Excellent work!' : score >= 3 ? 'Good job — module complete!' : 'Keep trying — review the content and try again'}
                </div>
                <div style={{ fontSize:'14px', color:getScoreColor() }}>
                  {score >= 3 ? 'You passed this module!' : 'You need at least 3 correct to pass'}
                </div>
              </div>

              {content.quiz.map((q, qi) => (
                <div key={qi} style={{ marginBottom:'20px', padding:'15px', borderRadius:'12px', background: answers[qi] === q.answer ? '#f0fff0' : '#fff5f5', border:'1px solid '+(answers[qi] === q.answer ? '#c3e6c3' : '#f5c6cb') }}>
                  <p style={{ color:'#333', fontSize:'14px', fontWeight:'600', marginBottom:'8px' }}>
                    Q{qi+1}: {q.question}
                  </p>
                  <p style={{ fontSize:'13px', margin:'4px 0', color:'#666' }}>
                    Your answer: <span style={{ fontWeight:'600', color: answers[qi] === q.answer ? '#155724' : '#721c24' }}>{answers[qi] || 'Not answered'}</span>
                  </p>
                  {answers[qi] !== q.answer && (
                    <p style={{ fontSize:'13px', margin:'4px 0', color:'#155724' }}>
                      Correct answer: <span style={{ fontWeight:'600' }}>{q.answer}</span>
                    </p>
                  )}
                </div>
              ))}

              {score >= 3 ? (
                <div style={{ display:'flex', gap:'12px', marginTop:'20px', flexWrap:'wrap' }}>
                  <button style={{ ...styles.primaryBtn, background:getBorderColor(), padding:'13px 30px', fontSize:'15px', borderRadius:'12px' }} onClick={() => go('modules')}>
                    Continue to Next Module
                  </button>
                  <button style={{ ...styles.outlineBtn, padding:'13px 30px', fontSize:'15px', borderRadius:'12px' }} onClick={() => go('dashboard')}>
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <button
                  style={{ ...styles.primaryBtn, background:'#e74c3c', padding:'13px 30px', fontSize:'15px', borderRadius:'12px', boxShadow:'none', marginTop:'10px' }}
                  onClick={() => { setAnswers({}); setQuizSubmitted(false); setScore(0); }}
                >
                  Try Again — Review and Retake
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Admin({ user, go, logout, openAdminPanel }) {
  const adminItems = [
    { title:'Manage Users', desc:'View, edit, and manage all participant and mentor accounts on the platform', btn:'View All Users', action:() => openAdminPanel('users') },
    { title:'Manage Modules', desc:'Add, edit, and organize the 20 learning modules and their content', btn:'Manage Modules', action:() => go('modules') },
    { title:'Mentorship Sessions', desc:'Monitor all scheduled and completed mentorship sessions across the platform', btn:'View Sessions', action:() => openAdminPanel('sessions') },
    { title:'Platform Analytics', desc:'Track engagement levels, completion rates, and user activity reports', btn:'View Analytics', action:() => openAdminPanel('analytics') },
  ];

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
          {adminItems.map((item, i) => (
            <div key={i} style={{ ...styles.adminCard, cursor:'pointer', display:'flex', flexDirection:'column', gap:'10px' }} onClick={item.action} role="button" tabIndex={0}>
              <h3 style={{ color:green, marginBottom:'10px', fontSize:'17px', fontWeight:'700' }}>{item.title}</h3>
              <p style={{ color:'#666', lineHeight:'1.6', fontSize:'14px', marginBottom:'20px' }}>{item.desc}</p>
              <button style={{ ...styles.primaryBtn, width:'100%' }} onClick={(event) => { event.stopPropagation(); item.action(); }}>{item.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminAction({ user, go, panel }) {
  const panels = {
    users: {
      title: 'Manage Users',
      summary: 'Review participant and mentor accounts, update profiles, and monitor access.',
      stats: ['12 participants', '4 mentors', '2 pending approvals'],
    },
    modules: {
      title: 'Manage Modules',
      summary: 'Edit learning modules, reorder content, and publish updates to the platform.',
      stats: ['20 learning modules', '7 self-worth', '7 technical', '6 career'],
    },
    sessions: {
      title: 'Mentorship Sessions',
      summary: 'Track scheduled sessions, attendance, and mentor availability across the program.',
      stats: ['8 scheduled', '6 completed', '2 upcoming'],
    },
    analytics: {
      title: 'Platform Analytics',
      summary: 'Monitor engagement, completion trends, and participation across the dashboard.',
      stats: ['0% completion', '0 active users', '0 forum posts'],
    },
  };

  const content = panels[panel] || panels.modules;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Pool <span style={styles.logoSpan}>of Grace</span> — Admin</h2>
        <button style={styles.outlineBtn} onClick={() => go('admin')}>Back to Admin</button>
      </nav>
      <div style={styles.dashContent}>
        <div style={{ maxWidth:'920px', margin:'0 auto' }}>
          <div style={styles.card}>
            <span style={{ ...styles.badge, background:'#e8f5e8', color:green }}>Admin Panel</span>
            <h2 style={{ color:green, fontSize:'28px', fontWeight:'800', margin:'10px 0' }}>{content.title}</h2>
            <p style={{ color:'#666', fontSize:'16px', lineHeight:'1.7', marginBottom:'24px' }}>{content.summary}</p>
            <div style={styles.grid3}>
              {content.stats.map((stat, index) => (
                <div key={index} style={{ ...styles.statCard, textAlign:'left' }}>
                  <div style={{ fontSize:'16px', fontWeight:'700', color:green }}>{stat}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'28px' }}>
              <button style={styles.primaryBtn} onClick={() => go('modules')}>Open Learning Modules</button>
              <button style={styles.outlineBtn} onClick={() => go('admin')}>Back to Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}