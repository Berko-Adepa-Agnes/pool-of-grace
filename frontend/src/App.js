import React, { useState, useEffect, useCallback } from 'react';
import {
  registerUser,
  loginUser,
  saveOnboarding,
  getModules,
  completeModuleQuiz,
  getMentors,
  bookMentorship,
  getMentorshipSessions,
  getForumPosts,
  createForumPost,
  createForumComment
} from './api';
import { t } from './translations';

/* =========================================================
   SVG ICON LIBRARY  (no emojis)
   ========================================================= */
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
      <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
    </svg>
  ),
  Modules: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Mentorship: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Forum: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Career: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Inbox: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  History: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  ),
  Grades: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Admin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Video2: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="15" height="10" rx="2" ry="2"/>
      <polygon points="21 12 17 8 17 16 21 12"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Meet: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
    </svg>
  ),
};

/* =========================================================
   ROOT APP
   ========================================================= */
export default function App() {
  const [page, setPage]                   = useState('home');
  const [lang, setLang]                   = useState('en');
  const [user, setUser]                   = useState(null);
  const [modules, setModules]             = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedAdminPanel, setSelectedAdminPanel] = useState(null);
  const [completionsCount, setCompletionsCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);

  const [inboxMessages] = useState([
    {
      id: 1,
      from: 'Agnes Berko — Founder',
      subject: 'Welcome to Pool of Grace!',
      body: 'Welcome to Pool of Grace! We are so glad you are here. This platform was built for you — to help you grow in confidence, technology skills, and career readiness. Start with Module 1: Self-Worth Foundation. Take your time, engage with the notes, submit your assignments, and do not hesitate to book an office hours session if you need support. You belong here.',
      date: '2026-06-01',
      read: false
    },
    {
      id: 2,
      from: 'Pool of Grace System',
      subject: 'Saturday General Meeting — Every Week at 4PM Ghana Time',
      body: 'Your weekly general meeting is every Saturday at 4:00 PM Ghana Time (GMT). Join here: https://meet.google.com/bii-jzew-udd. These sessions are recorded and available in the Recordings page if you miss one. Do not miss — Agnes covers new topics and takes questions every week!',
      date: '2026-06-07',
      read: false
    },
    {
      id: 3,
      from: 'Pool of Grace System',
      subject: 'Your Module Progress Saved to Database',
      body: 'Great news! Your quiz scores and module completions are now permanently saved to our secure database. This means your progress is safe even if you clear your browser or switch devices. Keep going — every module completed brings you one step closer to your certificate!',
      date: '2026-06-10',
      read: false
    },
    {
      id: 4,
      from: 'Agnes Berko — Founder',
      subject: 'Office Hours Now Open — Book Your Slot',
      body: 'My personal office hours are now open for booking! You can meet me directly on: Tuesdays 2:00–3:00 PM, Fridays 2:00–3:00 PM, and Saturdays 2:00–3:00 PM (all Ghana Time). Go to Mentorship and click Book Now under Founder Office Hours. Or email me directly: a.berko1@alustudent.com.',
      date: '2026-06-12',
      read: true
    },
    {
      id: 5,
      from: 'Pool of Grace System',
      subject: 'Please Complete the Usability Survey',
      body: 'We would love your feedback on the platform! The System Usability Scale (SUS) survey takes only 2 minutes to complete and helps us improve Pool of Grace for you and future participants. Go to the Survey page from the sidebar to fill it in. Your feedback is anonymous and very important for our research.',
      date: '2026-06-15',
      read: false
    },
    {
      id: 6,
      from: 'Efua Boateng (Mentor)',
      subject: 'Career Development Resources Added',
      body: 'Hello! I have added new career development resources specifically for the Ghana tech market to the Career Board. Check out the latest listings from AmaliTech, MEST Africa, and DevCongress Ghana. These are real opportunities for young women in technology here in Ghana. All the best!',
      date: '2026-06-14',
      read: true
    },
  ]);

  /* ---- Bootstrap ---- */
  useEffect(() => {
    const savedUser  = localStorage.getItem('poolofgrace_user');
    const savedToken = localStorage.getItem('poolofgrace_token');
    const savedLang  = localStorage.getItem('poolofgrace_lang');
    if (savedLang) setLang(savedLang);
    if (savedUser && savedToken) {
      const u = JSON.parse(savedUser);
      setUser(u);
      if (u.role === 'admin')               setPage('admin');
      else if (!u.onboardingData)           setPage('onboarding');
      else                                  setPage('dashboard');
    }
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('poolofgrace_lang', l);
  };

  /* ---- Fetch Stats ---- */
  const fetchStats = useCallback(async () => {
    try {
      const modRes = await getModules();
      const mods   = modRes.data.modules;
      setModules(mods);
      setCompletionsCount(mods.filter(m => m.completed).length);
      const sessRes = await getMentorshipSessions();
      setSessionsCount(sessRes.data.bookings.length);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') fetchStats();
  }, [user, fetchStats]);

  /* ---- Auth ---- */
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('poolofgrace_user', JSON.stringify(userData));
    localStorage.setItem('poolofgrace_token', token);
    if (userData.role === 'admin')     setPage('admin');
    else if (!userData.onboardingData) setPage('onboarding');
    else                               setPage('dashboard');
  };

  const completeOnboardingData = async (data) => {
    try {
      await saveOnboarding(data);
      const updatedUser = { ...user, onboardingData: data };
      setUser(updatedUser);
      localStorage.setItem('poolofgrace_user', JSON.stringify(updatedUser));
      setPage('selfWorthIntro');
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('poolofgrace_user');
    localStorage.removeItem('poolofgrace_token');
    setPage('home');
  };

  /* ---- Navigation helpers ---- */
  const openModule     = (mod) => { setSelectedModule(mod); setPage('moduleView'); };
  const openAdminPanel = (p)   => { setSelectedAdminPanel(p); setPage('adminAction'); };

  /* ---- Language toggle ---- */
  const LanguageToggle = () => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {['en', 'tw'].map(l => (
        <button key={l}
          style={{
            padding: '6px 14px', border: '1px solid #ddd',
            background: lang === l ? 'var(--primary-pale)' : '#fff',
            color: 'var(--primary)', borderRadius: '14px', cursor: 'pointer',
            fontWeight: '700', fontSize: '13px', fontFamily: 'inherit'
          }}
          onClick={() => changeLang(l)}
        >
          {l === 'en' ? t('common.english', lang) : t('common.twi', lang)}
        </button>
      ))}
    </div>
  );

  const unreadCount = inboxMessages.filter(m => !m.read).length;

  /* ---- Sidebar nav items ---- */
  const navItems = user && user.role !== 'admin' ? [
    { key: 'dashboard',     label: t('common.dashboard', lang), icon: <Icons.Dashboard /> },
    { key: 'modules',       label: 'Modules',                   icon: <Icons.Modules /> },
    { key: 'schedule',      label: 'Mentorship',                icon: <Icons.Mentorship /> },
    { key: 'forum',         label: 'Community',                 icon: <Icons.Forum /> },
    { key: 'career',        label: 'Career Board',              icon: <Icons.Career /> },
    { key: 'grades',        label: 'Grades',                    icon: <Icons.Grades /> },
    { key: 'certificates',  label: 'Certificates',              icon: <Icons.Grades /> },
    { key: 'recordings',    label: 'Recordings',                icon: <Icons.Video2 /> },
    { key: 'announcements', label: 'Announcements',             icon: <Icons.Inbox /> },
    { key: 'calendar',      label: 'Calendar',                  icon: <Icons.Calendar /> },
    { key: 'inbox',         label: unreadCount > 0 ? `Inbox (${unreadCount})` : 'Inbox', icon: <Icons.Inbox /> },
    { key: 'history',       label: 'History',                   icon: <Icons.History /> },
    { key: 'profile',       label: 'My Profile',                icon: <Icons.Dashboard /> },
    { key: 'survey',        label: 'Usability Survey',          icon: <Icons.Admin /> },
    { key: 'privacy',       label: 'Privacy & Ethics',          icon: <Icons.Admin /> },
  ] : [
    { key: 'admin',         label: t('nav.adminPanel', lang),   icon: <Icons.Admin /> },
    { key: 'modules',       label: 'Modules',                   icon: <Icons.Modules /> },
    { key: 'announcements', label: 'Announcements',             icon: <Icons.Inbox /> },
  ];

  /* ---- Authenticated portal shell ---- */
  const AuthenticatedPortal = ({ children }) => (
    <div className="portal-container">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        {/* Logo block — hidden on mobile */}
        <div className="sidebar-logo-block" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexShrink: 0 }}>
          <div style={{ width: '38px', height: '38px', background: 'var(--primary-light)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>P</span>
          </div>
          <h2 className="logo-text" style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#fff', whiteSpace: 'nowrap' }}>
            Pool <span style={{ color: 'var(--primary-light)' }}>of Grace</span>
          </h2>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
          {navItems.map(item => {
            const isActive = page === item.key || (item.key === 'modules' && page === 'moduleView');
            return (
              <button key={item.key} onClick={() => setPage(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', width: '100%',
                  border: 'none', background: isActive ? 'var(--primary)' : 'transparent',
                  color: '#fff', textAlign: 'left', borderRadius: '9px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: isActive ? '700' : '400', transition: 'background 0.2s',
                  fontFamily: 'inherit', flexShrink: 0
                }}
              >
                {item.icon}
                <span className="sidebar-text">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', flexShrink: 0 }}>
          <div className="sidebar-text" style={{ padding: '0 6px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
            {user && user.firstName} — {user && user.role === 'admin' ? 'Admin' : 'Participant'}
          </div>
          <button onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
              padding: '9px 14px', background: 'transparent', border: '1px solid rgba(255,80,80,0.4)',
              color: '#ff7777', borderRadius: '9px', cursor: 'pointer', fontSize: '13px',
              fontFamily: 'inherit', fontWeight: '600'
            }}
          >
            <Icons.LogOut />
            <span className="sidebar-text">{t('common.logout', lang)}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="portal-main">
        <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <LanguageToggle />
        </header>
        {children}
      </main>
    </div>
  );

  /* ---- Router ---- */
  if (page === 'home')         return <Home go={setPage} lang={lang} LanguageToggle={LanguageToggle} />;
  if (page === 'register')     return <Register go={setPage} login={login} lang={lang} LanguageToggle={LanguageToggle} />;
  if (page === 'login')        return <Login go={setPage} login={login} lang={lang} LanguageToggle={LanguageToggle} />;
  if (page === 'onboarding')   return <Onboarding user={user} completeOnboarding={completeOnboardingData} lang={lang} />;
  if (page === 'selfWorthIntro') return <SelfWorthIntro user={user} go={setPage} lang={lang} />;

  if (page === 'dashboard')     return <AuthenticatedPortal><Dashboard user={user} go={setPage} completionsCount={completionsCount} sessionsCount={sessionsCount} lang={lang} /></AuthenticatedPortal>;
  if (page === 'modules')       return <AuthenticatedPortal><ModulesList openModule={openModule} lang={lang} modules={modules} /></AuthenticatedPortal>;
  if (page === 'moduleView')    return <AuthenticatedPortal><ModuleView module={selectedModule} go={setPage} lang={lang} onQuizPassed={fetchStats} modules={modules} openModule={openModule} /></AuthenticatedPortal>;
  if (page === 'schedule')      return <AuthenticatedPortal><Schedule go={setPage} lang={lang} onBooked={fetchStats} /></AuthenticatedPortal>;
  if (page === 'forum')         return <AuthenticatedPortal><Forum lang={lang} /></AuthenticatedPortal>;
  if (page === 'career')        return <AuthenticatedPortal><CareerResources lang={lang} /></AuthenticatedPortal>;
  if (page === 'grades')        return <AuthenticatedPortal><Grades modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'certificates')  return <AuthenticatedPortal><CertificatePage user={user} modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'recordings')    return <AuthenticatedPortal><RecordingsPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'announcements') return <AuthenticatedPortal><AnnouncementsPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'calendar')      return <AuthenticatedPortal><CalendarPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'inbox')         return <AuthenticatedPortal><Inbox messages={inboxMessages} lang={lang} /></AuthenticatedPortal>;
  if (page === 'history')       return <AuthenticatedPortal><History modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'privacy')       return <AuthenticatedPortal><PrivacyPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'profile')       return <AuthenticatedPortal><ProfilePage user={user} lang={lang} modules={modules} /></AuthenticatedPortal>;
  if (page === 'survey')        return <AuthenticatedPortal><SUSPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'admin')         return <AuthenticatedPortal><Admin openAdminPanel={openAdminPanel} lang={lang} /></AuthenticatedPortal>;
  if (page === 'adminAction')   return <AuthenticatedPortal><AdminAction go={setPage} panel={selectedAdminPanel} lang={lang} /></AuthenticatedPortal>;

  return <Home go={setPage} lang={lang} LanguageToggle={LanguageToggle} />;
}

/* =========================================================
   HOME — Landing Page
   ========================================================= */
function Home({ go, lang, LanguageToggle }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fdf8' }}>
      {/* Nav */}
      <nav className="landing-nav">
        <h2 style={{ color: 'var(--primary)', fontWeight: '800', fontSize: 'clamp(18px,3vw,22px)' }}>
          Pool <span style={{ color: 'var(--primary-light)' }}>of Grace</span>
        </h2>
        <div className="landing-nav-actions">
          <LanguageToggle />
          <button className="btn-outline" onClick={() => go('login')} style={{ padding: '9px 20px' }}>{t('nav.login', lang)}</button>
          <button className="btn-primary" onClick={() => go('register')} style={{ padding: '9px 20px' }}>{t('nav.register', lang)}</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-section">
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.14)', padding: '7px 22px', borderRadius: '28px', marginBottom: '22px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>{t('hero.badge', lang)}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: '800', maxWidth: '800px', margin: '0 auto 18px', lineHeight: '1.2' }}>
          {t('hero.title', lang)}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(15px,2.5vw,20px)', maxWidth: '600px', margin: '0 auto 36px', lineHeight: '1.65' }}>
          {t('hero.subtitle', lang)}
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', padding: '14px 36px', fontSize: '15px' }} onClick={() => go('register')}>
            {t('hero.startCTA', lang)}
          </button>
          <button className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.55)', color: '#fff', padding: '14px 28px', fontSize: '15px' }} onClick={() => go('login')}>
            {t('hero.loginCTA', lang)}
          </button>
        </div>
        <div className="hero-metrics">
          {[[t('hero.metric1Val',lang),t('hero.metric1Lbl',lang)],[t('hero.metric2Val',lang),t('hero.metric2Lbl',lang)],[t('hero.metric3Val',lang),t('hero.metric3Lbl',lang)],[t('hero.metric4Val',lang),t('hero.metric4Lbl',lang)]].map(([v,l],i)=>(
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: '800' }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: '13px', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: '#fff', padding: 'clamp(50px,8vw,80px) clamp(20px,5vw,50px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: 'clamp(22px,4vw,30px)', fontWeight: '800', marginBottom: '12px' }}>{t('steps.header', lang)}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,2vw,17px)' }}>{t('steps.subheader', lang)}</p>
        </div>
        <div className="steps-grid">
          {[
            { step:'1', title:t('steps.step1Title',lang), desc:t('steps.step1Desc',lang) },
            { step:'2', title:t('steps.step2Title',lang), desc:t('steps.step2Desc',lang) },
            { step:'3', title:t('steps.step3Title',lang), desc:t('steps.step3Desc',lang) },
            { step:'4', title:t('steps.step4Title',lang), desc:t('steps.step4Desc',lang) },
          ].map((item,i)=>(
            <div key={i} style={{ textAlign:'center', padding:'16px' }}>
              <div style={{ width:'56px',height:'56px',background:'linear-gradient(135deg,var(--primary),var(--primary-light))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',boxShadow:'0 6px 18px var(--primary-glow)' }}>
                <span style={{ color:'#fff',fontWeight:'800',fontSize:'20px' }}>{item.step}</span>
              </div>
              <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'700',marginBottom:'8px' }}>{item.title}</h3>
              <p style={{ color:'var(--text-muted)',fontSize:'14px',lineHeight:'1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Offerings */}
      <div style={{ padding: 'clamp(50px,8vw,80px) clamp(20px,5vw,50px)' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <h2 style={{ color:'var(--primary)',fontSize:'clamp(22px,4vw,30px)',fontWeight:'800',marginBottom:'12px' }}>{t('offerings.header',lang)}</h2>
          <p style={{ color:'var(--text-muted)',fontSize:'clamp(14px,2vw,17px)' }}>{t('offerings.subheader',lang)}</p>
        </div>
        <div className="offerings-grid">
          {[
            { title:t('offerings.off1Title',lang), desc:t('offerings.off1Desc',lang) },
            { title:t('offerings.off2Title',lang), desc:t('offerings.off2Desc',lang) },
            { title:t('offerings.off3Title',lang), desc:t('offerings.off3Desc',lang) },
            { title:t('offerings.off4Title',lang), desc:t('offerings.off4Desc',lang) },
          ].map((item,i)=>(
            <div key={i} className="premium-card" style={{ padding:'28px', borderTop:'4px solid var(--primary-light)' }}>
              <div style={{ width:'40px',height:'40px',background:['#eafaea','#ede8ff','#fff3e0','#e8f8ff'][i],borderRadius:'10px',marginBottom:'18px' }}></div>
              <h3 style={{ color:'var(--primary)',marginBottom:'9px',fontSize:'17px',fontWeight:'700' }}>{item.title}</h3>
              <p style={{ color:'var(--text-muted)',fontSize:'14px',lineHeight:'1.65' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:'linear-gradient(135deg,#124012,var(--primary))',padding:'clamp(50px,8vw,80px) 20px',textAlign:'center',color:'#fff' }}>
        <h2 style={{ fontSize:'clamp(22px,4vw,30px)',fontWeight:'800',marginBottom:'16px' }}>{t('storyCallout.title',lang)}</h2>
        <p style={{ color:'rgba(255,255,255,0.85)',fontSize:'clamp(14px,2vw,17px)',maxWidth:'580px',margin:'0 auto 34px',lineHeight:'1.7' }}>{t('storyCallout.desc',lang)}</p>
        <button className="btn-primary" style={{ background:'#fff',color:'var(--primary)',padding:'14px 38px',fontSize:'15px' }} onClick={() => go('register')}>
          {t('storyCallout.btn',lang)}
        </button>
      </div>

      {/* Footer */}
      <footer style={{ background:'#091209',padding:'36px 20px',textAlign:'center',color:'rgba(255,255,255,0.55)' }}>
        <h3 style={{ color:'#fff',marginBottom:'8px',fontWeight:'700' }}>Pool of Grace</h3>
        <p style={{ fontSize:'14px' }}>Empowering young women in Ghana through technology education and mentorship</p>
        <p style={{ fontSize:'12px',color:'rgba(255,255,255,0.28)',marginTop:'18px' }}>Kumasi and Accra, Ghana — Capstone 2026</p>
      </footer>
    </div>
  );
}

/* =========================================================
   REGISTER
   ========================================================= */
function Register({ go, login, lang, LanguageToggle }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', role:'participant' });
  const [msg, setMsg]   = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); setMsg('');
    if (!form.firstName || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      setMsg('Account created successfully! Redirecting...');
      setTimeout(() => login(data.user, data.token), 1400);
    } catch (err) { setError(err.response ? err.response.data.message : 'Cannot connect. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div style={{ position:'fixed', top:'18px', right:'18px', zIndex:10 }}><LanguageToggle /></div>
      <div className="premium-card auth-card animate-fade-in">
        <div style={{ textAlign:'center', marginBottom:'26px' }}>
          <h2 style={{ color:'var(--primary)', fontWeight:'800', fontSize:'clamp(20px,4vw,24px)' }}>{t('nav.register', lang)}</h2>
          <p style={{ color:'var(--text-muted)', fontSize:'14px', marginTop:'6px' }}>Start your journey with us today</p>
        </div>
        {msg   && <div className="alert-success" style={{ marginBottom:'14px' }}>{msg}</div>}
        {error && <div className="alert-error"   style={{ marginBottom:'14px' }}>{error}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <div>
            <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>First Name *</label>
            <input className="premium-input" placeholder="Agnes" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Last Name</label>
            <input className="premium-input" placeholder="Berko" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} />
          </div>
        </div>
        <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Email Address *</label>
        <input className="premium-input" placeholder="agnes@example.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Password *</label>
        <input className="premium-input" placeholder="Choose a secure password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>I am joining as</label>
        <select className="premium-input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="participant">A Participant — I want to learn</option>
          <option value="mentor">A Mentor — I want to guide others</option>
        </select>
        <button className="btn-primary" style={{ width:'100%', marginTop:'6px' }} onClick={submit} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Free Account'}
        </button>
        <p style={{ textAlign:'center',marginTop:'18px',color:'var(--text-muted)',fontSize:'14px' }}>
          Already have an account?{' '}
          <span style={{ color:'var(--primary-light)',cursor:'pointer',fontWeight:'700' }} onClick={()=>go('login')}>Login here</span>
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   LOGIN
   ========================================================= */
function Login({ go, login, lang, LanguageToggle }) {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); setMsg('');
    if (!form.email || !form.password) { setError('Please enter your credentials.'); return; }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      setMsg('Login successful!');
      setTimeout(() => login(data.user, data.token), 1400);
    } catch (err) { setError(err.response ? err.response.data.message : 'Cannot connect. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div style={{ position:'fixed',top:'18px',right:'18px',zIndex:10 }}><LanguageToggle /></div>
      <div className="premium-card auth-card animate-fade-in">
        <div style={{ textAlign:'center',marginBottom:'26px' }}>
          <h2 style={{ color:'var(--primary)',fontWeight:'800',fontSize:'clamp(20px,4vw,24px)' }}>{t('nav.login',lang)}</h2>
          <p style={{ color:'var(--text-muted)',fontSize:'14px',marginTop:'6px' }}>Welcome back to Pool of Grace</p>
        </div>
        {msg   && <div className="alert-success" style={{ marginBottom:'14px' }}>{msg}</div>}
        {error && <div className="alert-error"   style={{ marginBottom:'14px' }}>{error}</div>}
        <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Email Address</label>
        <input className="premium-input" placeholder="agnes@example.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Password</label>
        <input className="premium-input" placeholder="Your account password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="btn-primary" style={{ width:'100%',marginTop:'6px' }} onClick={submit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ textAlign:'center',marginTop:'18px',color:'var(--text-muted)',fontSize:'13px' }}>
          Forgot your password? Contact{' '}
          <a href="mailto:a.berko1@alustudent.com" style={{ color:'var(--primary)',fontWeight:'700' }}>support</a>.
        </p>
        <p style={{ textAlign:'center',marginTop:'18px',color:'var(--text-muted)',fontSize:'14px' }}>
          No account?{' '}
          <span style={{ color:'var(--primary-light)',cursor:'pointer',fontWeight:'700' }} onClick={()=>go('register')}>Register free</span>
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ONBOARDING
   ========================================================= */
function Onboarding({ user, completeOnboarding, lang }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ story:'',barriers:[],goals:'',techExperience:'',motivation:'',location:'',age:'',education:'' });

  const barrierOptions = [
    'Family pressure toward early marriage','Belief that technology is not for women',
    'No female role models in technology','Financial barriers',
    'Limited internet or device access','Fear of failure or not being smart enough',
    'Family discouragement','Lack of information about technology careers',
  ];
  const toggleBarrier = (b) => setData(prev => ({
    ...prev,
    barriers: prev.barriers.includes(b) ? prev.barriers.filter(x=>x!==b) : [...prev.barriers, b]
  }));

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div style={{ minHeight:'100vh',background:'linear-gradient(135deg,#f0faf0,#e8f5e8)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 14px' }}>
      <div style={{ maxWidth:'600px',width:'100%' }}>
        <div style={{ textAlign:'center',marginBottom:'26px' }}>
          <h2 style={{ color:'var(--primary)',fontWeight:'800',fontSize:'22px' }}>Pool <span style={{ color:'var(--primary-light)' }}>of Grace</span></h2>
          <p style={{ color:'var(--text-muted)',fontSize:'13px',marginTop:'5px' }}>
            {t('onboarding.stepOf',lang).replace('{step}',step).replace('{total}',totalSteps)}
          </p>
          <div className="progress-bar-track" style={{ marginTop:'12px' }}>
            <div className="progress-bar-fill" style={{ width:`${progress}%` }}></div>
          </div>
        </div>

        <div className="premium-card animate-fade-in" style={{ padding:'clamp(22px,5vw,38px)' }}>
          {step === 1 && (
            <div>
              <h2 style={{ color:'var(--primary)',fontSize:'clamp(18px,4vw,22px)',fontWeight:'800',marginBottom:'10px' }}>
                {t('onboarding.welcome',lang).replace('{name}', user ? user.firstName : '')}
              </h2>
              <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.75',marginBottom:'10px' }}>{t('onboarding.intro1',lang)}</p>
              <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.75' }}>{t('onboarding.intro2',lang)}</p>
              <div className="alert-info" style={{ margin:'18px 0' }}>
                <p style={{ fontWeight:'700',marginBottom:'4px' }}>{t('onboarding.confidentialityTitle',lang)}</p>
                <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:0 }}>{t('onboarding.confidentialityDesc',lang)}</p>
              </div>
              <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'6px' }}>{t('onboarding.qStory',lang)}</label>
              <textarea className="premium-input" placeholder={t('onboarding.placeholderStory',lang)} value={data.story} onChange={e=>setData({...data,story:e.target.value})} />
              <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'6px' }}>{t('onboarding.qGoals',lang)}</label>
              <textarea className="premium-input" placeholder={t('onboarding.placeholderGoals',lang)} value={data.goals} onChange={e=>setData({...data,goals:e.target.value})} />
              <button className="btn-primary" style={{ width:'100%' }} onClick={()=>setStep(2)} disabled={!data.story||!data.goals}>
                {t('onboarding.btnContinueStory',lang)}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ color:'var(--primary)',fontSize:'clamp(18px,4vw,22px)',fontWeight:'800',marginBottom:'8px' }}>{t('onboarding.barriersTitle',lang)}</h2>
              <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>{t('onboarding.barriersDesc',lang)}</p>
              <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'10px' }}>{t('onboarding.qBarriers',lang)}</label>
              <div style={{ display:'flex',flexDirection:'column',gap:'8px',marginBottom:'22px' }}>
                {barrierOptions.map((b,i)=>(
                  <label key={i} style={{
                    display:'flex',alignItems:'center',gap:'12px',padding:'11px 16px',borderRadius:'10px',
                    border:'2px solid '+(data.barriers.includes(b)?'var(--primary-light)':'var(--primary-pale)'),
                    background:data.barriers.includes(b)?'var(--primary-pale)':'#fff',cursor:'pointer',transition:'var(--transition)'
                  }}>
                    <input type="checkbox" checked={data.barriers.includes(b)} onChange={()=>toggleBarrier(b)} style={{ accentColor:'var(--primary-light)',width:'17px',height:'17px' }} />
                    <span style={{ color:'var(--text-main)',fontSize:'13px' }}>{b}</span>
                  </label>
                ))}
              </div>
              <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'6px' }}>{t('onboarding.qMotivation',lang)}</label>
              <textarea className="premium-input" placeholder={t('onboarding.placeholderMotivation',lang)} value={data.motivation} onChange={e=>setData({...data,motivation:e.target.value})} />
              <div style={{ display:'flex',gap:'10px' }}>
                <button className="btn-outline" onClick={()=>setStep(1)}>{t('common.back',lang)}</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={()=>setStep(3)} disabled={data.barriers.length===0||!data.motivation}>{t('common.continue',lang)}</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ color:'var(--primary)',fontSize:'clamp(18px,4vw,22px)',fontWeight:'800',marginBottom:'8px' }}>{t('onboarding.moreInfoTitle',lang)}</h2>
              <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>{t('onboarding.moreInfoDesc',lang)}</p>
              {[
                { label:t('onboarding.qAge',lang), key:'age', placeholder:t('onboarding.placeholderAge',lang), options:[['16-18','16 - 18 years old'],['19-22','19 - 22 years old'],['23-26','23 - 26 years old'],['27-30','27 - 30 years old']] },
                { label:t('onboarding.qLocation',lang), key:'location', placeholder:t('onboarding.placeholderLocation',lang), options:[['kumasi','Kumasi (Ashanti Region)'],['accra','Accra (Greater Accra Region)'],['other','Other area in Ghana']] },
                { label:t('onboarding.qEducation',lang), key:'education', placeholder:t('onboarding.placeholderEducation',lang), options:[['jhs','Junior High School (JHS)'],['secondary','Senior High School (SHS)'],['tertiary','Tertiary / University'],['other','Other']] },
                { label:t('onboarding.qTechExperience',lang), key:'techExperience', placeholder:t('onboarding.placeholderTechExperience',lang), options:[['none','None — I am a complete beginner'],['basic','Basic — I can use a phone and browse the internet'],['some','Some — I have tried basic coding or digital tools'],['intermediate','Intermediate — I have some coding experience']] },
              ].map(({ label, key, placeholder, options }) => (
                <div key={key}>
                  <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'5px' }}>{label}</label>
                  <select className="premium-input" value={data[key]} onChange={e=>setData({...data,[key]:e.target.value})}>
                    <option value="">{placeholder}</option>
                    {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display:'flex',gap:'10px' }}>
                <button className="btn-outline" onClick={()=>setStep(2)}>{t('common.back',lang)}</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={()=>setStep(4)} disabled={!data.age||!data.location||!data.education||!data.techExperience}>{t('common.continue',lang)}</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'72px',height:'72px',background:'linear-gradient(135deg,var(--primary),var(--primary-light))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',boxShadow:'0 6px 22px var(--primary-glow)' }}>
                <Icons.Check />
              </div>
              <h2 style={{ color:'var(--primary)',fontSize:'clamp(18px,4vw,22px)',fontWeight:'800',marginBottom:'12px' }}>
                {t('onboarding.thankYou',lang).replace('{name}', user ? user.firstName : '')}
              </h2>
              <p style={{ color:'var(--text-muted)',fontSize:'14px',lineHeight:'1.8',marginBottom:'28px' }}>{t('onboarding.thankYouDesc',lang)}</p>
              <button className="btn-primary" style={{ width:'100%' }} onClick={()=>completeOnboarding(data)}>{t('onboarding.btnBegin',lang)}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SELF-WORTH INTRO
   ========================================================= */
function SelfWorthIntro({ user, go, lang }) {
  return (
    <div style={{ minHeight:'100vh',background:'linear-gradient(135deg,#103810,var(--primary),var(--primary-light))',display:'flex',alignItems:'center',justifyContent:'center',padding:'28px 18px',color:'#fff' }}>
      <div style={{ maxWidth:'700px',width:'100%',textAlign:'center' }}>
        <div style={{ background:'rgba(255,255,255,0.14)',display:'inline-block',padding:'8px 22px',borderRadius:'24px',marginBottom:'26px' }}>
          <span style={{ fontSize:'13px',fontWeight:'600' }}>{t('selfWorthIntro.badge',lang)}</span>
        </div>
        <h1 style={{ fontSize:'clamp(24px,5vw,36px)',fontWeight:'800',marginBottom:'18px',lineHeight:'1.3' }}>{t('selfWorthIntro.title',lang)}</h1>
        <p style={{ color:'rgba(255,255,255,0.88)',fontSize:'clamp(14px,2vw,16px)',lineHeight:'1.8',marginBottom:'18px' }}>{t('selfWorthIntro.desc1',lang)}</p>
        <p style={{ color:'rgba(255,255,255,0.88)',fontSize:'clamp(14px,2vw,16px)',lineHeight:'1.8',marginBottom:'36px' }}>{t('selfWorthIntro.desc2',lang)}</p>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:'18px',marginBottom:'36px' }}>
          {[
            [t('selfWorthIntro.stat1Val',lang),t('selfWorthIntro.stat1Lbl',lang),t('selfWorthIntro.stat1Desc',lang)],
            [t('selfWorthIntro.stat2Val',lang),t('selfWorthIntro.stat2Lbl',lang),t('selfWorthIntro.stat2Desc',lang)],
            [t('selfWorthIntro.stat3Val',lang),t('selfWorthIntro.stat3Lbl',lang),t('selfWorthIntro.stat3Desc',lang)],
          ].map(([v,l,d],i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.12)',padding:'22px 16px',borderRadius:'14px',backdropFilter:'blur(10px)' }}>
              <div style={{ fontSize:'clamp(24px,4vw,30px)',fontWeight:'800',marginBottom:'4px' }}>{v}</div>
              <div style={{ fontSize:'13px',fontWeight:'700',marginBottom:'4px' }}>{l}</div>
              <div style={{ color:'rgba(255,255,255,0.68)',fontSize:'12px' }}>{d}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ background:'#fff',color:'var(--primary)',padding:'14px 36px',fontSize:'15px' }} onClick={()=>go('dashboard')}>
          {t('selfWorthIntro.btnReady',lang)}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */
function Dashboard({ user, go, completionsCount, sessionsCount, lang }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('dashboard.greetingMorning',lang) : hour < 17 ? t('dashboard.greetingAfternoon',lang) : t('dashboard.greetingEvening',lang);
  const progressPercent = Math.round((completionsCount / 20) * 100);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>{greeting}, {user ? user.firstName : ''}!</h2>
        <p>{t('dashboard.subheading',lang)}</p>
      </div>

      {/* Announcements Banner */}
      <div style={{ background:'linear-gradient(135deg,#1a4c1a,#2d7a2d)',borderRadius:'14px',padding:'14px 22px',marginBottom:'18px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <div style={{ background:'rgba(255,255,255,0.15)',borderRadius:'8px',padding:'7px 14px',flexShrink:0 }}>
            <span style={{ color:'#fff',fontSize:'12px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px' }}>Announcement</span>
          </div>
          <span style={{ color:'rgba(255,255,255,0.9)',fontSize:'14px' }}>Pool of Grace is accepting new participants for the June 2026 cohort!</span>
        </div>
        <button onClick={()=>go('announcements')} style={{ background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',padding:'7px 16px',borderRadius:'18px',cursor:'pointer',fontSize:'13px',fontWeight:'600',fontFamily:'inherit',whiteSpace:'nowrap' }}>View All</button>
      </div>

      {/* Meeting Banner */}
      <div className="banner-strip">
        <div>
          <div style={{ fontWeight:'700',fontSize:'15px',marginBottom:'3px' }}>Weekly General Meeting — Every Saturday at 4:00 PM Ghana Time</div>
          <div style={{ color:'rgba(255,255,255,0.82)',fontSize:'13px' }}>Led by Agnes Berko — All participants welcome — Free Google Meet session</div>
        </div>
        <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer">Join Meeting</a>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom:'32px' }}>
        {[
          { value:completionsCount,       label:t('dashboard.statModulesLbl',lang),  sub:t('dashboard.statModulesSub',lang) },
          { value:`${progressPercent}%`,  label:t('dashboard.statProgressLbl',lang), sub:t('dashboard.statProgressSub',lang) },
          { value:sessionsCount,          label:t('dashboard.statSessionsLbl',lang), sub:t('dashboard.statSessionsSub',lang) },
          { value:'1',                    label:t('dashboard.statDaysLbl',lang),      sub:t('dashboard.statDaysSub',lang) },
        ].map((s,i)=>(
          <div key={i} className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:'4px solid var(--primary-light)' }}>
            <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:'var(--primary)',marginBottom:'4px' }}>{s.value}</div>
            <div style={{ fontSize:'13px',fontWeight:'700',marginBottom:'3px' }}>{s.label}</div>
            <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="premium-card" style={{ padding:'26px',marginBottom:'32px',borderLeft:'5px solid var(--primary-light)' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px' }}>
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'700',marginBottom:'4px' }}>{t('dashboard.progressTitle',lang)}</h3>
            <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:0 }}>{t('dashboard.progressNext',lang)} {completionsCount + 1}</p>
          </div>
          <div>
            <span style={{ color:'var(--primary)',fontSize:'clamp(20px,3vw,24px)',fontWeight:'800' }}>{progressPercent}%</span>
            <span style={{ color:'var(--text-muted)',fontSize:'14px' }}> complete</span>
          </div>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width:`${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="card-grid-4">
        {[
          { title:t('dashboard.card1Title',lang), desc:t('dashboard.card1Desc',lang), btn:t('dashboard.card1Btn',lang), action:()=>go('modules') },
          { title:t('dashboard.card2Title',lang), desc:t('dashboard.card2Desc',lang), btn:t('dashboard.card2Btn',lang), action:()=>go('schedule') },
          { title:t('dashboard.card3Title',lang), desc:t('dashboard.card3Desc',lang), btn:t('dashboard.card3Btn',lang), action:()=>go('forum') },
          { title:t('dashboard.card4Title',lang), desc:t('dashboard.card4Desc',lang), btn:t('dashboard.card4Btn',lang), action:()=>go('career') },
        ].map((card,i)=>(
          <div key={i} className="premium-card" style={{ padding:'26px',display:'flex',flexDirection:'column' }}>
            <h3 style={{ color:'var(--primary)',marginBottom:'9px',fontSize:'17px',fontWeight:'700' }}>{card.title}</h3>
            <p style={{ color:'var(--text-muted)',fontSize:'13px',lineHeight:'1.65',marginBottom:'22px',flex:1 }}>{card.desc}</p>
            <button className="btn-primary" style={{ width:'100%' }} onClick={card.action}>{card.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MODULES LIST  (Canvas-style stage list)
   ========================================================= */
function ModulesList({ openModule, lang, modules }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? modules : modules.filter(m=>m.category===filter);

  const catStyle = { 'self-worth':{ bg:'#eafaea',color:'var(--primary)' }, 'technical-skills':{ bg:'#ede8ff',color:'#5a3e8a' }, 'professional-development':{ bg:'#fff3e0',color:'#e65100' } };
  const catLabel = { 'self-worth':'Self Worth', 'technical-skills':'Tech Skills', 'professional-development':'Career' };
  const catColor = (c) => c==='self-worth'?'var(--primary-light)':c==='technical-skills'?'#7c5cbf':'#e67e22';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Pool of Grace — Learning Modules</h2>
        <p>Complete all 20 stages from self-worth to career mastery. Click any module to start.</p>
      </div>

      {/* Progress track */}
      <div className="premium-card" style={{ padding:'18px 26px',marginBottom:'26px',background:'linear-gradient(135deg,#f0faf0,#fff)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'18px',flexWrap:'wrap' }}>
          <div style={{ flex:1,minWidth:'180px' }}>
            <div style={{ fontSize:'12px',fontWeight:'600',color:'var(--text-muted)',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'1px' }}>Your Progress Through All Stages</div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width:`${Math.round((modules.filter(m=>m.completed).length/20)*100)}%` }}></div>
            </div>
          </div>
          <div style={{ textAlign:'center',flexShrink:0 }}>
            <div style={{ fontSize:'clamp(20px,3vw,24px)',fontWeight:'800',color:'var(--primary)' }}>
              {modules.filter(m=>m.completed).length}<span style={{ fontSize:'15px',color:'var(--text-muted)' }}>/20</span>
            </div>
            <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>modules done</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex',gap:'8px',marginBottom:'26px',flexWrap:'wrap' }}>
        {[
          { key:'all',label:'All (20)' },
          { key:'self-worth',label:'Self Worth (7)' },
          { key:'technical-skills',label:'Tech Skills (7)' },
          { key:'professional-development',label:'Career (6)' },
        ].map(f=>(
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{
            padding:'8px 18px',borderRadius:'22px',cursor:'pointer',fontSize:'13px',fontWeight:'600',
            border:'2px solid '+(filter===f.key?'var(--primary-light)':'var(--primary-pale)'),
            background:filter===f.key?'var(--primary-light)':'#fff',
            color:filter===f.key?'#fff':'var(--text-muted)',transition:'var(--transition)',fontFamily:'inherit'
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {modules.length === 0 ? (
        <div style={{ textAlign:'center',padding:'60px',color:'var(--text-muted)' }}>{t('common.loading',lang)}</div>
      ) : (
        <div className="premium-card" style={{ overflow:'hidden' }}>
          {filtered.map((m,idx)=>(
            <div key={m.id} className="module-row" onClick={()=>openModule(m)}>
              {/* Stage number dot */}
              <div style={{ width:'62px',display:'flex',flexDirection:'column',alignItems:'center',padding:'18px 0',flexShrink:0 }}>
                <div className="stage-dot" style={{ background: m.completed?'var(--primary)':catColor(m.category) }}>
                  {m.completed ? <Icons.Check /> : m.order}
                </div>
                {idx < filtered.length - 1 && (
                  <div style={{ width:'2px',height:'18px',background:m.completed?'var(--primary-light)':'#e0e0e0',marginTop:'5px' }}></div>
                )}
              </div>

              {/* Content */}
              <div style={{ flex:1,padding:'18px 16px 18px 0' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'10px' }}>
                  <div style={{ flex:1,minWidth:'180px' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px',flexWrap:'wrap' }}>
                      <span className="badge" style={{ background:catStyle[m.category]?.bg,color:catStyle[m.category]?.color }}>{catLabel[m.category]}</span>
                      {m.completed && <span className="badge badge-green">Completed — {m.score}/5</span>}
                    </div>
                    <h3 style={{ color:'var(--text-main)',margin:'0 0 3px',fontSize:'clamp(14px,2vw,16px)',fontWeight:'700' }}>
                      Stage {m.order}: {m.title}
                    </h3>
                    <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:0,lineHeight:'1.5' }}>{m.description}</p>
                  </div>
                  <div style={{ display:'flex',alignItems:'center',gap:'10px',flexShrink:0 }}>
                    <span style={{ color:'var(--text-muted)',fontSize:'12px',whiteSpace:'nowrap' }}>{m.duration}</span>
                    <button className="btn-primary" style={{ padding:'7px 16px',fontSize:'12px',background:m.completed?'var(--primary)':catColor(m.category),boxShadow:'none',borderRadius:'18px' }}
                      onClick={e=>{e.stopPropagation();openModule(m);}}>
                      {m.completed ? 'Review' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MODULE VIEW  (Canvas-style tabs)
   ========================================================= */
function ModuleView({ module, go, lang, onQuizPassed, modules, openModule }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [answers, setAnswers]     = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore]         = useState(0);
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  if (!module) { go('modules'); return null; }
  const { content } = module;

  const catColor = () => module.category==='self-worth'?'var(--primary-light)':module.category==='technical-skills'?'#7c5cbf':'#e67e22';

  const allSorted = modules ? [...modules].sort((a,b)=>a.order-b.order) : [];
  const idx       = allSorted.findIndex(m=>m.id===module.id);
  const prevMod   = idx > 0 ? allSorted[idx-1] : null;
  const nextMod   = idx < allSorted.length-1 ? allSorted[idx+1] : null;

  const submitQuiz = async () => {
    let correct = 0;
    content.quiz.forEach((q,i)=>{ if(answers[i]===q.answer) correct++; });
    setScore(correct);
    setQuizSubmitted(true);
    if (correct >= 3) {
      try { await completeModuleQuiz(module.id, correct); onQuizPassed(); }
      catch(err) { console.error(err); }
    }
  };

  const saveNote = () => {
    localStorage.setItem(`pog_note_${module.id}`, noteContent);
    setNoteSaved(true);
    setTimeout(()=>setNoteSaved(false),2000);
  };
  const savedNote = localStorage.getItem(`pog_note_${module.id}`) || '';

  const videoLinks = module.category === 'self-worth' ? [
    { title:'The Power of Believing That You Can Improve — Carol Dweck (TED)',   url:'https://www.youtube.com/watch?v=_X0mgOOSpLU' },
    { title:'Your Body Language May Shape Who You Are — Amy Cuddy (TED)',         url:'https://www.youtube.com/watch?v=Ks-_Mh1QhMc' },
    { title:'Women in STEM: Breaking Barriers',                                   url:'https://www.youtube.com/watch?v=WW2eunybne0' },
    { title:'How to Build Self-Confidence — Brendon Burchard',                   url:'https://www.youtube.com/watch?v=mO3XdepKRtQ' },
    { title:'Overcoming Imposter Syndrome — Mike Cannon-Brookes (TED)',           url:'https://www.youtube.com/watch?v=zNBmHXS3A6I' },
  ] : module.category === 'technical-skills' ? [
    { title:'HTML and CSS Full Course for Beginners — freeCodeCamp',              url:'https://www.youtube.com/watch?v=mU6anWqZJcc' },
    { title:'JavaScript Tutorial for Beginners — Programming with Mosh',          url:'https://www.youtube.com/watch?v=W6NZfCO5SIk' },
    { title:'Python for Beginners Full Course — freeCodeCamp',                    url:'https://www.youtube.com/watch?v=rfscVS0vtbw' },
    { title:'React JS Full Course for Beginners',                                 url:'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
    { title:'Git and GitHub for Beginners — freeCodeCamp',                        url:'https://www.youtube.com/watch?v=RGOj5yH7evk' },
    { title:'SQL Tutorial — Full Database Course for Beginners',                  url:'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  ] : [
    { title:'How to Get Your First Tech Job in Ghana — Career Tips',              url:'https://www.youtube.com/watch?v=y8YH0Qbu5h4' },
    { title:'How to Prepare for a Technical Interview',                           url:'https://www.youtube.com/watch?v=Tpp-M5KqyFM' },
    { title:'How to Build a Tech Portfolio — Step by Step',                       url:'https://www.youtube.com/watch?v=oC483DTjRXU' },
    { title:'LinkedIn for Developers — Profile and Networking Tips',              url:'https://www.youtube.com/watch?v=SG5Sb5WTV_g' },
    { title:'Women in Tech Africa — Stories and Career Journeys',                 url:'https://www.youtube.com/watch?v=2dxM9oH6KwE' },
    { title:'Freelancing as a Developer in Africa — Full Guide',                  url:'https://www.youtube.com/watch?v=IiPNLmHsD7g' },
  ];

  const tabs = [
    { key:'notes',      label:'Notes' },
    { key:'resources',  label:'Resources' },
    { key:'assignment', label:'Assignment' },
    { key:'quiz',       label:'Quiz' },
    { key:'grades',     label:'Grades' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth:'940px',margin:'0 auto' }}>
      {/* Top nav */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px',flexWrap:'wrap',gap:'8px' }}>
        <button className="btn-outline" onClick={()=>go('modules')} style={{ fontSize:'13px',padding:'8px 16px' }}>Back to Modules</button>
        <div style={{ display:'flex',gap:'8px' }}>
          {prevMod && <button className="btn-outline" style={{ fontSize:'13px',padding:'8px 16px' }} onClick={()=>openModule(prevMod)}>Stage {prevMod.order}</button>}
          {nextMod && <button className="btn-primary" style={{ fontSize:'13px',padding:'8px 16px',background:catColor() }} onClick={()=>openModule(nextMod)}>Stage {nextMod.order}</button>}
        </div>
      </div>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${catColor()}18,#fff)`,border:`2px solid ${catColor()}28`,borderRadius:'14px 14px 0 0',padding:'24px 28px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'14px' }}>
          <div style={{ flex:1,minWidth:'200px' }}>
            <div style={{ fontSize:'11px',color:'var(--text-muted)',fontWeight:'600',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'7px' }}>Stage {module.order} of 20</div>
            <h1 style={{ color:'var(--primary)',fontSize:'clamp(18px,3vw,24px)',fontWeight:'800',margin:'0 0 8px' }}>{module.title}</h1>
            <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:0 }}>{module.description}</p>
          </div>
          <div style={{ background:'#fff',padding:'11px 18px',borderRadius:'10px',textAlign:'center',boxShadow:'var(--shadow-sm)',flexShrink:0 }}>
            <div style={{ color:catColor(),fontSize:'16px',fontWeight:'800' }}>{module.duration}</div>
            <div style={{ color:'var(--text-muted)',fontSize:'11px',marginTop:'2px' }}>est. time</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {tabs.map(tab=>(
          <button key={tab.key} className={`tab-btn${activeTab===tab.key?' active':''}`}
            style={{ color:activeTab===tab.key?catColor():'var(--text-muted)', borderBottomColor:activeTab===tab.key?catColor():'transparent' }}
            onClick={()=>setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="premium-card" style={{ borderRadius:'0 0 14px 14px',padding:'clamp(20px,4vw,34px)',minHeight:'380px' }}>

        {/* NOTES */}
        {activeTab === 'notes' && (
          <div>
            <div style={{ background:'var(--bg-main)',padding:'18px',borderRadius:'10px',borderLeft:`4px solid ${catColor()}`,marginBottom:'26px' }}>
              <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.8',margin:0 }}>{content.intro}</p>
            </div>
            {content.sections.map((s,i)=>(
              <div key={i} style={{ marginBottom:'24px',paddingBottom:'24px',borderBottom:i<content.sections.length-1?'1px solid #f0f0f0':'none' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}>
                  <div style={{ width:'30px',height:'30px',background:`${catColor()}18`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`2px solid ${catColor()}` }}>
                    <span style={{ color:catColor(),fontWeight:'800',fontSize:'13px' }}>{i+1}</span>
                  </div>
                  <h2 style={{ color:'var(--primary)',fontSize:'clamp(15px,2.5vw,17px)',fontWeight:'700',margin:0 }}>{s.heading}</h2>
                </div>
                <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.8',margin:0,paddingLeft:'40px' }}>{s.body}</p>
              </div>
            ))}
            {/* Personal notes */}
            <div style={{ marginTop:'26px',paddingTop:'22px',borderTop:'2px solid var(--primary-pale)' }}>
              <h3 style={{ color:'var(--primary)',fontSize:'15px',fontWeight:'700',marginBottom:'10px' }}>Personal Notes</h3>
              <p style={{ color:'var(--text-muted)',fontSize:'13px',marginBottom:'10px' }}>Write your thoughts or key takeaways. Notes are saved on your device.</p>
              <textarea style={{ width:'100%',minHeight:'110px',padding:'13px',border:'2px solid var(--primary-pale)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'vertical',outline:'none' }}
                placeholder="Write your notes for this module here..."
                defaultValue={savedNote}
                onChange={e=>setNoteContent(e.target.value)} />
              <div style={{ display:'flex',alignItems:'center',gap:'10px',marginTop:'8px' }}>
                <button className="btn-primary" style={{ fontSize:'13px',padding:'8px 18px',background:catColor() }} onClick={saveNote}>
                  {noteSaved ? 'Saved!' : 'Save Notes'}
                </button>
                {noteSaved && <span style={{ color:'var(--primary)',fontSize:'13px' }}>Notes saved locally.</span>}
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="section-heading">Educational Video Resources</h2>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>
              Curated videos for <strong>{module.title}</strong>. Click any link to watch on YouTube.
            </p>
            <div style={{ display:'flex',flexDirection:'column',gap:'10px',marginBottom:'30px' }}>
              {videoLinks.map((v,i)=>(
                <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="video-link-item">
                  <div className="video-icon-box">
                    <Icons.Video2 />
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:'600',fontSize:'14px',color:'var(--primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{v.title}</div>
                    <div style={{ fontSize:'12px',color:'var(--text-muted)',marginTop:'2px' }}>YouTube — Click to watch</div>
                  </div>
                  <Icons.ExternalLink />
                </a>
              ))}
            </div>
            <div className="alert-info">
              <h4 style={{ fontWeight:'700',marginBottom:'10px',fontSize:'14px' }}>Additional Reading</h4>
              <ul style={{ color:'var(--text-main)',fontSize:'13px',lineHeight:'2.1',paddingLeft:'18px',margin:0 }}>
                {(module.category === 'self-worth' ? [
                  'Bandura, A. (1997). Self-efficacy: The exercise of control. W. H. Freeman.',
                  'Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.',
                  'UNICEF Ghana (2022). Girls in STEM Education Report.',
                  'Master, A., et al. (2021). Gender stereotypes about interests emerge early. PNAS.',
                ] : module.category === 'technical-skills' ? [
                  'MDN Web Docs — HTML, CSS, JavaScript Reference (developer.mozilla.org)',
                  'freeCodeCamp.org — Free online coding curriculum',
                  'W3Schools — Interactive web tutorials (w3schools.com)',
                  'The Odin Project — Full stack web development course (theodinproject.com)',
                  'CS50 by Harvard — Free intro to computer science (cs50.harvard.edu)',
                ] : [
                  'AmaliTech Ghana — Career Development Resources',
                  'LinkedIn Learning — Professional Development Courses',
                  'Women in Tech Africa — Network and Opportunities',
                  'MEST Africa — Entrepreneurship and Tech Skills',
                  'DevCongress Ghana — Community Events and Mentorship',
                ]).map((ref,i)=><li key={i}>{ref}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* ASSIGNMENT */}
        {activeTab === 'assignment' && (
          <AssignmentTab module={module} catColor={catColor} setActiveTab={setActiveTab} />
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            <h2 className="section-heading">Knowledge Check Quiz</h2>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>
              Answer all {content.quiz.length} questions. You need at least 3 correct to complete this module.
            </p>
            {!quizSubmitted ? (
              <div>
                {content.quiz.map((q,qi)=>(
                  <div key={qi} style={{ marginBottom:'24px',paddingBottom:'22px',borderBottom:qi<content.quiz.length-1?'1px solid #f0f0f0':'none' }}>
                    <p style={{ color:'var(--text-main)',fontSize:'14px',fontWeight:'600',marginBottom:'12px',lineHeight:'1.55' }}>
                      <span style={{ color:catColor(),fontWeight:'800' }}>Q{qi+1}. </span>{q.question}
                    </p>
                    <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
                      {q.options.map((opt,oi)=>(
                        <label key={oi} className={`quiz-option${answers[qi]===opt?' selected':''}`} style={{ borderColor:answers[qi]===opt?catColor():'var(--primary-pale)' }}>
                          <input type="radio" name={'q'+qi} value={opt} checked={answers[qi]===opt} onChange={()=>setAnswers(prev=>({...prev,[qi]:opt}))} style={{ accentColor:catColor() }} />
                          <span style={{ fontSize:'13px',color:'var(--text-main)' }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn-primary" style={{ background:catColor() }} onClick={submitQuiz} disabled={Object.keys(answers).length < content.quiz.length}>
                  Submit ({Object.keys(answers).length}/{content.quiz.length} answered)
                </button>
              </div>
            ) : (
              <div>
                <div style={{ background:score>=3?'#eafaea':'#fff0f0',padding:'22px',borderRadius:'12px',marginBottom:'22px',textAlign:'center' }}>
                  <div style={{ fontSize:'clamp(36px,6vw,48px)',fontWeight:'800',color:score>=3?'#1e5a2c':'#7e2a2a',marginBottom:'6px' }}>{score}/{content.quiz.length}</div>
                  <div style={{ fontSize:'15px',fontWeight:'700',color:score>=3?'#1e5a2c':'#7e2a2a',marginBottom:'4px' }}>
                    {score>=4?'Excellent work!'  : score>=3?'Good job — module complete!' : 'Review the notes and try again'}
                  </div>
                  <div style={{ fontSize:'13px',color:score>=3?'#1e5a2c':'#7e2a2a' }}>
                    {score>=3?'This module is now complete.':'You need at least 3 correct to pass.'}
                  </div>
                </div>
                {content.quiz.map((q,qi)=>(
                  <div key={qi} style={{ marginBottom:'12px',padding:'16px',borderRadius:'10px',background:answers[qi]===q.answer?'#f4fff4':'#fff5f5',border:'1px solid '+(answers[qi]===q.answer?'#c3e6c3':'#f5c6cb') }}>
                    <p style={{ color:'var(--text-main)',fontSize:'13px',fontWeight:'600',marginBottom:'6px' }}>Q{qi+1}: {q.question}</p>
                    <p style={{ fontSize:'13px',margin:'3px 0',color:'var(--text-muted)' }}>Your answer: <span style={{ fontWeight:'600',color:answers[qi]===q.answer?'#2d7a2d':'#721c24' }}>{answers[qi]||'Not answered'}</span></p>
                    {answers[qi]!==q.answer && <p style={{ fontSize:'13px',margin:'3px 0',color:'var(--primary)' }}>Correct: <span style={{ fontWeight:'600' }}>{q.answer}</span></p>}
                  </div>
                ))}
                {score >= 3 ? (
                  <div style={{ display:'flex',gap:'10px',marginTop:'18px',flexWrap:'wrap' }}>
                    {nextMod && <button className="btn-primary" style={{ background:catColor() }} onClick={()=>openModule(nextMod)}>Next: Stage {nextMod.order}</button>}
                    <button className="btn-outline" onClick={()=>go('modules')}>All Modules</button>
                    <button className="btn-outline" onClick={()=>setActiveTab('grades')}>View Grade</button>
                  </div>
                ) : (
                  <button className="btn-primary" style={{ background:'#d9534f',marginTop:'10px' }}
                    onClick={()=>{ setAnswers({}); setQuizSubmitted(false); setScore(0); }}>
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* GRADES */}
        {activeTab === 'grades' && (
          <div>
            <h2 className="section-heading">This Module's Grade</h2>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>Your performance record for Stage {module.order}: {module.title}</p>
            <div className="stat-grid" style={{ marginBottom:'26px' }}>
              <div style={{ background:'var(--primary-pale)',padding:'22px',borderRadius:'12px',textAlign:'center' }}>
                <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:'var(--primary)',marginBottom:'4px' }}>
                  {module.completed ? `${module.score}/5` : '--'}
                </div>
                <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>Quiz Score</div>
              </div>
              <div style={{ background:module.completed?'#eafaea':'#fff5f5',padding:'22px',borderRadius:'12px',textAlign:'center' }}>
                <div style={{ fontSize:'clamp(18px,3vw,24px)',fontWeight:'800',color:module.completed?'#1e5a2c':'#b93a3a',marginBottom:'4px' }}>
                  {module.completed ? 'Passed' : 'Pending'}
                </div>
                <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>Status</div>
              </div>
              <div style={{ background:'#fff8e1',padding:'22px',borderRadius:'12px',textAlign:'center' }}>
                <div style={{ fontSize:'clamp(20px,3vw,26px)',fontWeight:'800',color:'#7a5b13',marginBottom:'4px' }}>
                  {module.completed ? (module.score>=4?'A':module.score>=3?'B':'C') : '--'}
                </div>
                <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>Grade</div>
              </div>
            </div>
            {module.completed
              ? <div className="alert-success">Stage complete! Continue to the next stage or review the notes to reinforce your learning.</div>
              : <div className="alert-warning">Go to the Quiz tab and score at least 3/5 to earn your grade for this module.</div>
            }
            <button className="btn-primary" style={{ marginTop:'20px',background:catColor() }} onClick={()=>setActiveTab('quiz')}>
              {module.completed ? 'Retake Quiz' : 'Take Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MENTORSHIP / SCHEDULE
   ========================================================= */
function Schedule({ go, lang, onBooked }) {
  const [step, setStep]     = useState(1);
  const [mentors, setMentors]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking]   = useState({ mentorId:'', type:'', date:'', time:'', notes:'' });
  const [loading, setLoading]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getMentors().then(r=>setMentors(r.data.mentors)).catch(console.error);
    getMentorshipSessions().then(r=>setBookings(r.data.bookings)).catch(console.error);
  }, []);

  const agnesSlots = [
    { label:'Tuesday 2:00 PM - 3:00 PM (Agnes Berko)', day:'Tue', time:'2:00 PM - 3:00 PM' },
    { label:'Friday 2:00 PM - 3:00 PM (Agnes Berko)',  day:'Fri', time:'2:00 PM - 3:00 PM' },
    { label:'Saturday 2:00 PM - 3:00 PM (Agnes Berko)',day:'Sat', time:'2:00 PM - 3:00 PM' },
  ];
  const timeSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','2:00 PM - 3:00 PM','3:00 PM','4:00 PM','5:00 PM'];
  const sessionTypes = [
    { value:'introduction', label:'Introduction Session — Meet your mentor and set goals (30 mins)' },
    { value:'technical',    label:'Technical Help — Get guidance on a coding challenge (45 mins)' },
    { value:'career',       label:'Career Guidance — Discuss tech jobs and your career path (45 mins)' },
    { value:'general',      label:'General Mentorship — Open discussion about your progress (30 mins)' },
    { value:'agnes-office', label:'Agnes Office Hours — Direct session with the program founder (30 mins)' },
  ];
  const selMentor = mentors.find(m=>m.id===parseInt(booking.mentorId));

  // Agnes office hours card data
  const agnesInfo = { name:'Agnes Adepa Berko', role:'Founder & Lead Instructor', email:'a.berko1@alustudent.com', availability:'Tuesdays, Fridays, and Saturdays — 2:00 PM to 3:00 PM Ghana Time' };

  const confirmBooking = async () => {
    setLoading(true);
    try { await bookMentorship(booking); setConfirmed(true); onBooked(); }
    catch(err) { console.error(err); }
    setLoading(false);
  };

  if (confirmed) return (
    <div style={{ maxWidth:'560px',margin:'40px auto' }}>
      <div className="premium-card animate-fade-in" style={{ padding:'clamp(28px,5vw,46px)',textAlign:'center' }}>
        <div style={{ width:'70px',height:'70px',background:'linear-gradient(135deg,var(--primary),var(--primary-light))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 22px',boxShadow:'0 6px 22px var(--primary-glow)' }}>
          <Icons.Check />
        </div>
        <h2 style={{ color:'var(--primary)',fontSize:'clamp(18px,4vw,22px)',fontWeight:'800',marginBottom:'12px' }}>Office Hours Booked!</h2>
        <p style={{ color:'var(--text-muted)',fontSize:'14px',lineHeight:'1.7',marginBottom:'22px' }}>Your mentorship session has been scheduled. You will receive meeting details via inbox.</p>
        <div className="alert-info" style={{ textAlign:'left',marginBottom:'22px' }}>
          <p style={{ fontWeight:'700',marginBottom:'8px' }}>Session Details</p>
          {[['Mentor',selMentor?.name],['Date',booking.date],['Time',booking.time],['Type',sessionTypes.find(s=>s.value===booking.type)?.label.split(' —')[0]]].map(([k,v])=>(
            <p key={k} style={{ margin:'4px 0',fontSize:'13px' }}><strong>{k}:</strong> {v}</p>
          ))}
        </div>
        <button className="btn-primary" style={{ width:'100%' }} onClick={()=>go('dashboard')}>{t('common.backToDashboard',lang)}</button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Mentorship Program</h2>
        <p>Connect with Ghanaian female professionals in technology</p>
      </div>

      {/* General Meeting Card */}
      <div className="premium-card" style={{ marginBottom:'28px',overflow:'hidden',border:'2px solid var(--primary-light)' }}>
        <div style={{ background:'linear-gradient(135deg,#124012,var(--primary))',padding:'22px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'14px' }}>
          <div>
            <div style={{ color:'rgba(255,255,255,0.75)',fontSize:'11px',fontWeight:'600',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'5px' }}>Weekly Group Session</div>
            <h3 style={{ color:'#fff',fontSize:'clamp(16px,3vw,20px)',fontWeight:'800',margin:'0 0 5px' }}>General Meeting with Agnes Berko</h3>
            <div style={{ color:'rgba(255,255,255,0.82)',fontSize:'13px' }}>Every Saturday — 4:00 PM Ghana Time (GMT)</div>
          </div>
          <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer"
            style={{ background:'#fff',color:'var(--primary)',padding:'11px 24px',borderRadius:'22px',fontWeight:'800',fontSize:'14px',display:'inline-flex',alignItems:'center',gap:'8px',flexShrink:0,boxShadow:'0 3px 12px rgba(0,0,0,0.18)' }}>
            <Icons.Meet /> Join Google Meet
          </a>
        </div>
        <div style={{ padding:'22px 28px',display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap' }}>
          <div style={{ width:'110px',height:'110px',borderRadius:'50%',overflow:'hidden',border:'3px solid var(--primary-light)',flexShrink:0,boxShadow:'0 4px 16px rgba(0,0,0,0.18)' }}>
            <img src="/agnes.jpg" alt="Agnes Adepa Berko — Founder, Pool of Grace"
              style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block' }}
              onError={e=>{
                e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;color:#fff;font-size:34px;font-weight:800;">A</div>';
              }} />
          </div>
          <div>
            <div style={{ fontWeight:'800',fontSize:'16px',color:'var(--primary)',marginBottom:'3px' }}>Agnes Adepa Berko</div>
            <div style={{ fontSize:'13px',color:'var(--text-muted)',marginBottom:'8px' }}>Founder and Lead Instructor — Pool of Grace — BSc. Software Engineering, ALU</div>
            <div className="alert-info" style={{ display:'inline-block',padding:'6px 14px',fontSize:'13px' }}>
              Meet link: <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer" style={{ color:'var(--primary)',textDecoration:'underline',fontWeight:'700' }}>meet.google.com/bii-jzew-udd</a>
            </div>
          </div>
        </div>
      </div>

      {/* Book office hours */}
      <h3 style={{ color:'var(--primary)',fontSize:'clamp(16px,3vw,19px)',fontWeight:'700',marginBottom:'6px' }}>Book Individual Office Hours</h3>
      <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>Schedule a one-on-one session with one of our expert mentors below.</p>

      {/* Agnes Office Hours */}
      <div className="premium-card" style={{ marginBottom:'22px',border:'2px solid var(--secondary)',overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(135deg,var(--secondary),#e8a000)',padding:'14px 22px' }}>
          <span style={{ color:'#fff',fontSize:'12px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'1px' }}>Founder Office Hours</span>
        </div>
        <div style={{ padding:'22px 26px',display:'flex',gap:'20px',flexWrap:'wrap',alignItems:'flex-start' }}>
          <div style={{ width:'70px',height:'70px',borderRadius:'50%',overflow:'hidden',border:'3px solid var(--secondary)',flexShrink:0,boxShadow:'0 3px 12px rgba(0,0,0,0.12)' }}>
            <img src="/agnes.jpg" alt="Agnes Berko" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top' }}
              onError={e=>{ e.target.parentElement.innerHTML='<div style="width:100%;height:100%;background:var(--secondary);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:800;">A</div>'; }} />
          </div>
          <div style={{ flex:1,minWidth:'200px' }}>
            <div style={{ fontWeight:'800',fontSize:'16px',color:'var(--primary)',marginBottom:'2px' }}>{agnesInfo.name}</div>
            <div style={{ fontSize:'13px',color:'var(--text-muted)',marginBottom:'12px' }}>{agnesInfo.role} — Pool of Grace</div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'8px',marginBottom:'16px' }}>
              {agnesSlots.map((slot,i)=>(
                <div key={i} style={{ background:'var(--secondary-pale)',padding:'10px 14px',borderRadius:'9px',borderLeft:'4px solid var(--secondary)' }}>
                  <div style={{ fontSize:'12px',fontWeight:'700',color:'#7a5b13' }}>{slot.day}</div>
                  <div style={{ fontSize:'13px',color:'var(--text-main)',fontWeight:'600' }}>{slot.time}</div>
                  <div style={{ fontSize:'11px',color:'var(--text-muted)' }}>Ghana Time (GMT)</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap' }}>
              <a href={`mailto:${agnesInfo.email}`} style={{ display:'inline-flex',alignItems:'center',gap:'6px',background:'var(--primary)',color:'#fff',padding:'9px 18px',borderRadius:'18px',fontWeight:'700',fontSize:'13px',textDecoration:'none' }}>
                Email: {agnesInfo.email}
              </a>
              <button className="btn-primary" style={{ background:'var(--secondary)',borderColor:'var(--secondary)',fontSize:'13px',padding:'9px 20px' }}
                onClick={()=>{
                  setBooking(prev => ({ ...prev, type:'agnes-office', mentorId: mentors.length > 0 ? String(mentors[0].id) : '1' }));
                  setStep(2);
                }}>
                Book Agnes Office Hours
              </button>
              <span style={{ fontSize:'12px',color:'var(--text-muted)' }}>or choose a mentor below</span>
            </div>
          </div>
        </div>
      </div>

      {/* My bookings */}
      {bookings.length > 0 && (
        <div className="premium-card" style={{ padding:'26px',marginBottom:'26px' }}>
          <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'14px' }}>Your Scheduled Sessions</h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'12px' }}>
            {bookings.map(b=>(
              <div key={b.id} style={{ background:'var(--primary-pale)',padding:'14px 18px',borderRadius:'10px',borderLeft:'4px solid var(--primary)' }}>
                <h4 style={{ color:'var(--primary)',margin:'0 0 4px',fontSize:'15px' }}>{b.mentorName}</h4>
                <p style={{ fontSize:'13px',color:'var(--text-main)',margin:'2px 0' }}><strong>Topic:</strong> {b.type}</p>
                <p style={{ fontSize:'13px',color:'var(--text-main)',margin:'2px 0' }}><strong>When:</strong> {b.date} at {b.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking form */}
      <div className="premium-card" style={{ padding:'clamp(22px,4vw,36px)' }}>
        {/* Step indicator */}
        <div className="step-indicator">
          {['Choose Mentor','Date and Time','Confirm'].map((label,i)=>(
            <React.Fragment key={i}>
              <div style={{ display:'flex',alignItems:'center',gap:'7px' }}>
                <div className="step-dot" style={{ background:step>i+1?'var(--primary-light)':step===i+1?'var(--primary)':'#ccc' }}>
                  {step>i+1 ? <Icons.Check /> : i+1}
                </div>
                <span style={{ fontSize:'13px',fontWeight:step===i+1?'700':'400',color:step===i+1?'var(--primary)':'var(--text-muted)',whiteSpace:'nowrap' }}>{label}</span>
              </div>
              {i<2 && <div className="step-connector"></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 — Choose mentor */}
        {step === 1 && (
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'700',marginBottom:'18px' }}>Available Ghanaian Mentors</h3>
            <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
              {mentors.length === 0 ? (
                <div style={{ padding:'20px',textAlign:'center',color:'var(--text-muted)',background:'var(--bg-main)',borderRadius:'12px' }}>
                  <p style={{ marginBottom:'8px' }}>Loading mentors...</p>
                  <p style={{ fontSize:'13px' }}>If mentors do not appear, please refresh the page.</p>
                </div>
              ) : (
                mentors.map(mentor=>(
                  <div key={mentor.id} style={{
                    padding:'20px',borderRadius:'14px',cursor:'pointer',transition:'var(--transition)',
                    border:'2px solid '+(booking.mentorId===String(mentor.id)?'var(--primary-light)':'var(--primary-pale)'),
                    background:booking.mentorId===String(mentor.id)?'var(--primary-pale)':'#fff'
                  }} onClick={()=>setBooking({...booking,mentorId:String(mentor.id)})}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'12px' }}>
                      <div style={{ display:'flex',gap:'14px' }}>
                        <div className="mentor-avatar">{mentor.name.charAt(0)}</div>
                        <div>
                          <h4 style={{ color:'var(--text-main)',margin:'0 0 3px',fontSize:'15px',fontWeight:'700' }}>{mentor.name}</h4>
                          <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:0 }}>{mentor.role} at {mentor.company} ({mentor.experience})</p>
                          <p style={{ color:'var(--primary)',fontSize:'13px',fontWeight:'600',marginTop:'4px' }}>Speciality: {mentor.speciality}</p>
                        </div>
                      </div>
                      <div style={{ textAlign:'right',flexShrink:0 }}>
                        <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{mentor.location}</div>
                        <div style={{ fontSize:'13px',fontWeight:'600',color:'var(--primary)',marginTop:'3px' }}>{mentor.available}</div>
                        {booking.mentorId===String(mentor.id) && (
                          <span className="badge badge-green" style={{ marginTop:'6px',display:'inline-block' }}>Selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ marginTop:'22px',display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={()=>setStep(2)} disabled={!booking.mentorId} style={{ minWidth:'160px' }}>
                {booking.mentorId ? `Continue with ${mentors.find(m=>String(m.id)===booking.mentorId)?.name?.split(' ')[0] || 'Mentor'}` : 'Select a Mentor to Continue'}
              </button>
              {!booking.mentorId && (
                <span style={{ fontSize:'13px',color:'var(--text-muted)' }}>Click a mentor card above to select them</span>
              )}
            </div>
          </div>
        )}

        {/* Step 2 — Date and time */}
        {step === 2 && (
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'700',marginBottom:'18px' }}>Session Details</h3>
            <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'8px' }}>Session Focus</label>
            <div style={{ display:'flex',flexDirection:'column',gap:'8px',marginBottom:'22px' }}>
              {sessionTypes.map(type=>(
                <label key={type.value} style={{
                  display:'flex',alignItems:'flex-start',gap:'12px',padding:'13px 16px',borderRadius:'10px',cursor:'pointer',transition:'var(--transition)',
                  border:'2px solid '+(booking.type===type.value?'var(--primary-light)':'var(--primary-pale)'),
                  background:booking.type===type.value?'var(--primary-pale)':'#fff'
                }}>
                  <input type="radio" name="stype" value={type.value} checked={booking.type===type.value} onChange={e=>setBooking({...booking,type:e.target.value})} style={{ accentColor:'var(--primary-light)',width:'15px',height:'15px',marginTop:'2px' }} />
                  <span style={{ color:'var(--text-main)',fontSize:'13px',lineHeight:'1.5' }}>{type.label}</span>
                </label>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'14px',marginBottom:'18px' }}>
              <div>
                <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'5px' }}>Preferred Date</label>
                <input className="premium-input" type="date" value={booking.date} min={new Date().toISOString().split('T')[0]} onChange={e=>setBooking({...booking,date:e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'5px' }}>Preferred Time</label>
                <select className="premium-input" value={booking.time} onChange={e=>setBooking({...booking,time:e.target.value})}>
                  <option value="">Choose slot</option>
                  {timeSlots.map(ts=><option key={ts} value={ts}>{ts}</option>)}
                </select>
              </div>
            </div>
            <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'5px' }}>Notes for Mentor (optional)</label>
            <textarea className="premium-input" placeholder="What is your main question or challenge for this session?" value={booking.notes} onChange={e=>setBooking({...booking,notes:e.target.value})} />
            <div style={{ display:'flex',gap:'10px' }}>
              <button className="btn-outline" onClick={()=>setStep(1)}>Back</button>
              <button className="btn-primary" style={{ flex:1 }} onClick={()=>setStep(3)} disabled={!booking.type||!booking.date||!booking.time}>Next</button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'700',marginBottom:'18px' }}>Confirm Booking</h3>
            <div className="premium-card" style={{ padding:'22px',marginBottom:'22px',background:'var(--bg-main)' }}>
              <h4 style={{ color:'var(--primary)',marginBottom:'12px',fontSize:'15px' }}>Booking Summary</h4>
              {[
                ['Mentor',`${selMentor?.name} (${selMentor?.role})`],
                ['Session Type',sessionTypes.find(s=>s.value===booking.type)?.label.split(' —')[0]],
                ['Scheduled',`${booking.date} at ${booking.time}`],
                ['Notes',booking.notes||'No notes provided'],
              ].map(([k,v])=>(
                <p key={k} style={{ margin:'5px 0',fontSize:'14px' }}><strong>{k}:</strong> {v}</p>
              ))}
            </div>
            <div style={{ display:'flex',gap:'10px' }}>
              <button className="btn-outline" onClick={()=>setStep(2)}>Edit</button>
              <button className="btn-primary" style={{ flex:1 }} onClick={confirmBooking} disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Session'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COMMUNITY FORUM
   ========================================================= */
function Forum({ lang }) {
  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activePost, setActivePost]   = useState(null);
  const [newPost, setNewPost]         = useState({ title:'', category:'Learning Support', content:'' });
  const [commentContent, setCommentContent] = useState('');
  const [forumError, setForumError]   = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try { const r = await getForumPosts(); setPosts(r.data.posts); }
    catch(err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(()=>{ loadPosts(); },[loadPosts]);

  const submitPost = async (e) => {
    e.preventDefault(); setForumError('');
    if (!newPost.title||!newPost.content) { setForumError('Please fill in title and description.'); return; }
    try { await createForumPost(newPost); setNewPost({ title:'',category:'Learning Support',content:'' }); loadPosts(); }
    catch(err) { setForumError('Could not submit post. Verify credentials.'); }
  };

  const submitComment = async (postId) => {
    if (!commentContent.trim()) return;
    try {
      await createForumComment(postId, { content:commentContent });
      setCommentContent('');
      const r = await getForumPosts();
      setPosts(r.data.posts);
      setActivePost(r.data.posts.find(p=>p.id===postId));
    } catch(err) { console.error(err); }
  };

  // lang prop accepted to match router signature, not used internally (all text is static English)
  void lang;

  return (
    <div className="animate-fade-in two-col-panel">
      {/* Left: post list + new post form */}
      <div>
        <div className="page-header">
          <h2>Community Forum</h2>
          <p>Connect with peers and mentors on your learning path</p>
        </div>
        <div className="premium-card" style={{ padding:'22px',marginBottom:'22px' }}>
          <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'14px' }}>Start a Discussion</h3>
          {forumError && <div className="alert-error" style={{ marginBottom:'12px' }}>{forumError}</div>}
          <form onSubmit={submitPost}>
            <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Topic *</label>
            <input className="premium-input" placeholder="e.g. Help needed with Python Loops" value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} />
            <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Channel</label>
            <select className="premium-input" value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})}>
              <option value="Learning Support">Learning Support</option>
              <option value="Mentorship">Mentorship</option>
              <option value="General Tech">General Tech</option>
              <option value="Career">Career and Placement</option>
            </select>
            <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Details *</label>
            <textarea className="premium-input" placeholder="Describe your question or topic..." value={newPost.content} onChange={e=>setNewPost({...newPost,content:e.target.value})} />
            <button className="btn-primary" style={{ width:'100%' }} type="submit">Post to Forum</button>
          </form>
        </div>
        {loading ? (
          <p style={{ color:'var(--text-muted)',textAlign:'center',padding:'24px' }}>Loading discussions...</p>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
            {posts.map(post=>(
              <div key={post.id} className="premium-card" style={{ padding:'16px',cursor:'pointer',borderLeft:'4px solid var(--primary-light)',background:activePost?.id===post.id?'var(--primary-pale)':'#fff' }}
                onClick={()=>setActivePost(post)}>
                <span style={{ fontSize:'11px',color:'var(--primary)',fontWeight:'700',textTransform:'uppercase' }}>{post.category}</span>
                <h4 style={{ color:'var(--text-main)',margin:'3px 0',fontSize:'14px' }}>{post.title}</h4>
                <p style={{ color:'var(--text-muted)',fontSize:'12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:'0 0 6px' }}>{post.content}</p>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:'12px',color:'var(--text-muted)' }}>
                  <span>By: {post.author}</span>
                  <span>{post.comments?.length||0} replies</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: active post */}
      <div className="premium-card" style={{ padding:'26px',minHeight:'380px' }}>
        {activePost ? (
          <div className="animate-fade-in" style={{ display:'flex',flexDirection:'column',height:'100%' }}>
            <div style={{ borderBottom:'1px solid #eee',paddingBottom:'14px',marginBottom:'18px' }}>
              <span style={{ fontSize:'11px',color:'var(--primary)',fontWeight:'700',textTransform:'uppercase' }}>{activePost.category}</span>
              <h3 style={{ color:'var(--primary)',fontSize:'18px',margin:'4px 0 8px' }}>{activePost.title}</h3>
              <p style={{ color:'var(--text-main)',fontSize:'14px',whiteSpace:'pre-wrap',lineHeight:'1.65' }}>{activePost.content}</p>
              <div style={{ fontSize:'12px',color:'var(--text-muted)',marginTop:'10px' }}>
                By: <strong>{activePost.author}</strong> — {new Date(activePost.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ flex:1,overflowY:'auto',maxHeight:'260px',display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px' }}>
              <h4 style={{ fontSize:'13px',color:'var(--text-main)',fontWeight:'700' }}>Replies ({activePost.comments?.length||0})</h4>
              {activePost.comments?.length===0 ? (
                <p style={{ color:'var(--text-muted)',fontSize:'13px' }}>No replies yet. Be the first!</p>
              ) : (
                activePost.comments.map(c=>(
                  <div key={c.id} style={{ background:'var(--bg-main)',padding:'10px 14px',borderRadius:'9px',border:'1px solid var(--primary-pale)' }}>
                    <p style={{ color:'var(--text-main)',fontSize:'13px',margin:'0 0 4px' }}>{c.content}</p>
                    <div style={{ fontSize:'11px',color:'var(--text-muted)',display:'flex',justifyContent:'space-between' }}>
                      <span>{c.author}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ display:'flex',gap:'8px',marginTop:'auto' }}>
              <input className="premium-input" style={{ marginBottom:0 }} placeholder="Write a reply..." value={commentContent} onChange={e=>setCommentContent(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitComment(activePost.id)} />
              <button className="btn-primary" onClick={()=>submitComment(activePost.id)}><Icons.Send /></button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100%',flexDirection:'column',color:'var(--text-muted)',gap:'12px' }}>
            <Icons.Forum />
            <p style={{ fontSize:'14px' }}>Select a discussion to read and reply.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CAREER RESOURCES
   ========================================================= */
function CareerResources({ lang }) {
  void lang;
  const [filterType, setFilterType]         = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  const jobs = [
    { title:'Frontend Developer Intern',        company:'Hubtel Ghana',            type:'Internship',  location:'Accra',    link:'https://hubtel.com/careers' },
    { title:'Data Analyst Associate',           company:'SupaTech Hub',            type:'Job',         location:'Kumasi',   link:'https://www.linkedin.com/jobs/search/?keywords=data+analyst+kumasi+ghana' },
    { title:'Junior QA Engineer',               company:'mPharma',                 type:'Job',         location:'Accra',    link:'https://mpharma.com/careers' },
    { title:'Python Backend Trainee',           company:'AmaliTech',               type:'Internship',  location:'Takoradi', link:'https://amalitech.org/careers' },
    { title:'Women in Tech Scholarship',        company:'ALU Global Academy',      type:'Scholarship', location:'Online',   link:'https://www.alueducation.com/programs' },
    { title:'Ghana Tech Fund Award',            company:'Ministry of Communications', type:'Scholarship', location:'Accra', link:'https://moc.gov.gh' },
    { title:'Remote React Developer',           company:'DevsGhana Partner',       type:'Job',         location:'Online',   link:'https://devs.com.gh' },
    { title:'DevCongress Community Membership', company:'DevCongress Ghana',       type:'Internship',  location:'Accra',    link:'https://www.devcongress.org' },
  ];

  const educationalVideos = [
    { title:'How to Get Your First Tech Job in Ghana — Career Tips',           url:'https://www.youtube.com/watch?v=y8YH0Qbu5h4' },
    { title:'Cracking the Coding Interview — Preparation Guide',               url:'https://www.youtube.com/watch?v=Tpp-M5KqyFM' },
    { title:'How to Build a Tech Portfolio — Step by Step',                    url:'https://www.youtube.com/watch?v=oC483DTjRXU' },
    { title:'LinkedIn for Developers — Profile and Networking Tips',           url:'https://www.youtube.com/watch?v=SG5Sb5WTV_g' },
    { title:'Women in Tech Africa — Stories and Career Journeys',              url:'https://www.youtube.com/watch?v=2dxM9oH6KwE' },
    { title:'Freelancing as a Developer in Africa — Full Guide',               url:'https://www.youtube.com/watch?v=IiPNLmHsD7g' },
    { title:'How to Write a Developer CV That Gets You Hired',                 url:'https://www.youtube.com/watch?v=xpaz7nrNmXA' },
    { title:'Software Engineering in Ghana — Opportunities and Growth',        url:'https://www.youtube.com/results?search_query=software+engineering+ghana' },
  ];

  const filtered = jobs.filter(j=>(filterType==='All'||j.type===filterType)&&(filterLocation==='All'||j.location===filterLocation));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Career Opportunities</h2>
        <p>Tech jobs, internships, and scholarships for women in Ghana</p>
      </div>

      {/* Educational Videos */}
      <div className="premium-card" style={{ padding:'clamp(20px,4vw,28px)',marginBottom:'30px' }}>
        <h3 className="section-heading">Educational Career Videos</h3>
        <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'18px' }}>Curated videos to prepare for your tech career. Click any link to open on YouTube.</p>
        <div style={{ display:'flex',flexDirection:'column',gap:'9px' }}>
          {educationalVideos.map((v,i)=>(
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="video-link-item">
              <div className="video-icon-box"><Icons.Video /></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:'600',fontSize:'14px',color:'var(--primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{v.title}</div>
                <div style={{ fontSize:'12px',color:'var(--text-muted)',marginTop:'2px' }}>YouTube — Click to watch</div>
              </div>
              <Icons.ExternalLink />
            </a>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:'14px',marginBottom:'22px',flexWrap:'wrap',background:'#fff',padding:'14px 22px',borderRadius:'12px',boxShadow:'var(--shadow-sm)' }}>
        {[
          { label:'Type',     state:filterType,     set:setFilterType,     opts:['All','Job','Internship','Scholarship'] },
          { label:'Location', state:filterLocation, set:setFilterLocation, opts:['All','Accra','Kumasi','Online'] },
        ].map(({label,state,set,opts})=>(
          <div key={label}>
            <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'5px' }}>Filter by {label}</label>
            <select className="premium-input" style={{ marginBottom:0,padding:'8px 12px',minWidth:'140px' }} value={state} onChange={e=>set(e.target.value)}>
              {opts.map(o=><option key={o} value={o}>{o==='All'?`All ${label}s`:o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Job cards */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:'18px' }}>
        {filtered.length===0 ? (
          <p style={{ color:'var(--text-muted)' }}>No matches found.</p>
        ) : filtered.map((job,i)=>(
          <div key={i} className="premium-card" style={{ padding:'22px',borderLeft:'4px solid var(--secondary)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px' }}>
              <span className="badge badge-amber">{job.type}</span>
              <span style={{ fontSize:'12px',color:'var(--text-muted)' }}>{job.location}</span>
            </div>
            <h3 style={{ color:'var(--primary)',margin:'0 0 4px',fontSize:'clamp(14px,2.5vw,16px)',fontWeight:'700' }}>{job.title}</h3>
            <p style={{ color:'var(--text-main)',fontSize:'13px',fontWeight:'600',margin:'0 0 14px' }}>{job.company}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px',padding:'8px 18px',borderRadius:'18px',display:'inline-flex',alignItems:'center',gap:'6px' }}>
              View Opportunity <Icons.ArrowRight />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   GRADES
   ========================================================= */
function Grades({ modules, lang }) {
  void lang;
  const done       = modules.filter(m=>m.completed);
  const totalScore = done.reduce((sum,m)=>sum+(m.score||0),0);
  const maxScore   = done.length * 5;
  const overallPct = maxScore > 0 ? Math.round((totalScore/maxScore)*100) : 0;

  const getGrade = (score) =>
    score>=5 ? { g:'A+', c:'#1e5a2c', bg:'#d4edd4' } :
    score>=4 ? { g:'A',  c:'#1e5a2c', bg:'#eafaea' } :
    score>=3 ? { g:'B',  c:'#7a5b13', bg:'#fff8e1' } :
               { g:'C',  c:'#7e2a2a', bg:'#fff0f0' };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>My Grades</h2>
        <p>Your quiz scores and module completion record</p>
      </div>
      <div className="stat-grid" style={{ marginBottom:'30px' }}>
        {[
          { value:done.length,           label:'Modules Completed',  sub:'out of 20' },
          { value:`${overallPct}%`,      label:'Overall Score',      sub:`${totalScore}/${maxScore} points` },
          { value:20-done.length,        label:'Modules Remaining',  sub:'to full completion' },
        ].map((s,i)=>(
          <div key={i} className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:'4px solid var(--primary-light)' }}>
            <div style={{ fontSize:'clamp(24px,4vw,32px)',fontWeight:'800',color:'var(--primary)',marginBottom:'4px' }}>{s.value}</div>
            <div style={{ fontSize:'13px',fontWeight:'700',marginBottom:'3px' }}>{s.label}</div>
            <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {done.length === 0 ? (
        <div className="premium-card" style={{ padding:'56px',textAlign:'center' }}>
          <Icons.Grades />
          <h3 style={{ color:'var(--primary)',margin:'16px 0 8px' }}>No grades yet</h3>
          <p style={{ color:'var(--text-muted)' }}>Complete your first module quiz to see your grades here.</p>
        </div>
      ) : (
        <div className="premium-card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'18px 22px',borderBottom:'1px solid var(--primary-pale)',background:'var(--bg-main)' }}>
            <h3 style={{ color:'var(--primary)',fontSize:'15px',fontWeight:'700',margin:0 }}>Module Grade Report</h3>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>Stage</th><th>Module Title</th><th>Category</th><th>Score</th><th>Grade</th><th>Status</th></tr>
              </thead>
              <tbody>
                {done.map((m,i)=>{
                  const {g,c,bg} = getGrade(m.score);
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight:'600' }}>{m.order}</td>
                      <td style={{ fontWeight:'600' }}>{m.title}</td>
                      <td style={{ textTransform:'capitalize' }}>{m.category.replace('-',' ')}</td>
                      <td style={{ fontWeight:'700',color:'var(--primary)' }}>{m.score}/5</td>
                      <td><span className="badge" style={{ background:bg,color:c }}>{g}</span></td>
                      <td><span className="badge badge-green">Passed</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CALENDAR
   ========================================================= */
function CalendarPage({ lang }) {
  void lang;
  const today  = new Date();
  const month  = today.getMonth();
  const year   = today.getFullYear();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  // Calculate all Saturdays in the current month
  const saturdays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month, d).getDay() === 6) saturdays.push(d);
  }

  // Build event map
  const eventMap = {};
  saturdays.forEach(d => {
    eventMap[d] = { label:'Meeting 4PM', color:'#e67e22', text:'#fff' };
  });
  eventMap[today.getDate()] = { label:'Today', color:'var(--primary)', text:'#fff' };

  const getEv = (d) => eventMap[d] || null;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Upcoming Saturdays
  const upcomingSats = saturdays.filter(d => d >= today.getDate()).slice(0,3);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Calendar</h2>
        <p>Your learning schedule, meetings, and deadlines for {months[month]} {year}</p>
      </div>

      {/* Quick links */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'14px',marginBottom:'28px' }}>
        {[
          { label:'Weekly General Meeting', detail:'Every Saturday — 4:00 PM Ghana Time', href:'https://meet.google.com/bii-jzew-udd', color:'var(--primary)', icon:<Icons.Meet /> },
          { label:'Agnes Office Hours', detail:'Tue, Fri, Sat — 2:00–3:00 PM Ghana Time', href:'mailto:a.berko1@alustudent.com', color:'#7c5cbf', icon:<Icons.Mentorship /> },
          { label:'Module Deadlines', detail:'Self-paced — complete at your own pace', href:null, color:'#e67e22', icon:<Icons.Modules /> },
        ].map((ev,i)=>(
          <div key={i} className="premium-card" style={{ padding:'18px',borderLeft:`4px solid ${ev.color}` }}>
            <div style={{ color:ev.color,marginBottom:'6px' }}>{ev.icon}</div>
            <div style={{ fontWeight:'700',color:ev.color,fontSize:'14px',marginBottom:'3px' }}>{ev.label}</div>
            <div style={{ color:'var(--text-muted)',fontSize:'12px',marginBottom:ev.href?'10px':'0' }}>{ev.detail}</div>
            {ev.href && <a href={ev.href} target="_blank" rel="noopener noreferrer" style={{ color:ev.color,fontWeight:'700',fontSize:'13px',textDecoration:'underline' }}>{ev.href.startsWith('mailto') ? 'Send Email' : 'Join Meeting'}</a>}
          </div>
        ))}
      </div>

      {/* Upcoming Saturdays */}
      {upcomingSats.length > 0 && (
        <div className="premium-card" style={{ padding:'20px 24px',marginBottom:'24px',borderLeft:'5px solid #e67e22' }}>
          <h3 style={{ color:'#e67e22',fontSize:'15px',fontWeight:'700',marginBottom:'14px' }}>Upcoming General Meetings</h3>
          <div style={{ display:'flex',flexWrap:'wrap',gap:'10px' }}>
            {upcomingSats.map((d,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'center',gap:'12px',background:'#fff8f0',padding:'12px 18px',borderRadius:'10px',border:'1px solid #f5d8b0' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'22px',fontWeight:'800',color:'#e67e22' }}>{d}</div>
                  <div style={{ fontSize:'11px',color:'var(--text-muted)',fontWeight:'600' }}>{months[month].substring(0,3)}</div>
                </div>
                <div>
                  <div style={{ fontWeight:'700',fontSize:'13px',color:'var(--text-main)' }}>Saturday Meeting</div>
                  <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>4:00 PM Ghana Time</div>
                  <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:'12px',color:'#e67e22',fontWeight:'700' }}>Join Google Meet</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month grid */}
      <div className="premium-card" style={{ padding:'clamp(16px,4vw,28px)' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'10px' }}>
          <h3 style={{ color:'var(--primary)',fontSize:'clamp(17px,3vw,20px)',fontWeight:'800',margin:0 }}>{months[month]} {year}</h3>
          <div className="badge badge-green" style={{ padding:'7px 15px',fontSize:'13px' }}>Today: {today.getDate()} {months[month]}</div>
        </div>
        <div className="cal-grid">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
            <div key={d} style={{ textAlign:'center',padding:'8px 4px',fontSize:'11px',fontWeight:'700',color:d==='Sat'?'#e67e22':'var(--text-muted)',textTransform:'uppercase' }}>{d}</div>
          ))}
          {cells.map((day,i)=>{
            const ev = day ? getEv(day) : null;
            const isSat = day && new Date(year,month,day).getDay()===6;
            const isToday = day===today.getDate();
            return (
              <div key={i} className="cal-cell" style={{
                background: isToday?'var(--primary)': isSat?'#fff3e0':'#fafafa',
                border: day?(isSat?'2px solid #e67e22':'1px solid #eee'):'none',
                borderRadius:'10px'
              }}>
                {day && (
                  <>
                    <span style={{ fontSize:'13px',fontWeight:ev||isSat?'800':'400',color:isToday?'#fff':isSat?'#e67e22':'var(--text-main)' }}>{day}</span>
                    {isSat && !isToday && <span style={{ fontSize:'8px',color:'#e67e22',fontWeight:'700',textAlign:'center',lineHeight:'1.2',marginTop:'2px' }}>Meet 4PM</span>}
                    {isToday && <span style={{ fontSize:'8px',color:'#fff',fontWeight:'800' }}>TODAY</span>}
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex',gap:'14px',marginTop:'14px',flexWrap:'wrap',fontSize:'12px',color:'var(--text-muted)' }}>
          <span style={{ display:'flex',alignItems:'center',gap:'5px' }}><span style={{ width:'12px',height:'12px',background:'var(--primary)',borderRadius:'3px',display:'inline-block' }}></span>Today</span>
          <span style={{ display:'flex',alignItems:'center',gap:'5px' }}><span style={{ width:'12px',height:'12px',background:'#fff3e0',border:'2px solid #e67e22',borderRadius:'3px',display:'inline-block' }}></span>Saturday Meeting</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INBOX
   ========================================================= */
function Inbox({ messages, lang }) {
  void lang;
  const [active, setActive] = useState(null);
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Inbox</h2>
        <p>Messages from your mentors and the Pool of Grace team</p>
      </div>
      <div className="two-col-panel">
        <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
          {messages.map(msg=>(
            <div key={msg.id} style={{
              padding:'16px 18px',background:active?.id===msg.id?'var(--primary-pale)':'#fff',
              border:'2px solid '+(active?.id===msg.id?'var(--primary-light)':'var(--primary-pale)'),
              borderLeft:'4px solid '+(!msg.read?'var(--primary)':'var(--primary-pale)'),
              borderRadius:'12px',cursor:'pointer',transition:'var(--transition)'
            }} onClick={()=>setActive(msg)}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'4px' }}>
                <span style={{ fontWeight:'700',fontSize:'13px',color:'var(--primary)' }}>{msg.from}</span>
                {!msg.read && <span className="badge badge-green" style={{ fontSize:'11px',padding:'2px 8px' }}>New</span>}
              </div>
              <div style={{ fontWeight:'600',fontSize:'13px',marginBottom:'3px' }}>{msg.subject}</div>
              <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{msg.date}</div>
            </div>
          ))}
        </div>
        <div className="premium-card" style={{ padding:'26px',minHeight:'320px' }}>
          {active ? (
            <div className="animate-fade-in">
              <div style={{ borderBottom:'1px solid #eee',paddingBottom:'14px',marginBottom:'18px' }}>
                <div style={{ fontSize:'13px',color:'var(--text-muted)',marginBottom:'4px' }}>From: <strong>{active.from}</strong></div>
                <h3 style={{ color:'var(--primary)',fontSize:'clamp(15px,3vw,18px)',margin:'0 0 4px' }}>{active.subject}</h3>
                <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{active.date}</div>
              </div>
              <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.8' }}>{active.body}</p>
              {active.body.includes('meet.google.com') && (
                <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex',alignItems:'center',gap:'8px',marginTop:'14px',padding:'9px 20px',background:'var(--primary)',color:'#fff',borderRadius:'18px',fontWeight:'700',fontSize:'13px' }}>
                  <Icons.Meet /> Join Meeting
                </a>
              )}
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-muted)',gap:'12px' }}>
              <Icons.Inbox />
              <p style={{ fontSize:'14px' }}>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HISTORY
   ========================================================= */
function History({ modules, lang }) {
  void lang;
  const done = modules.filter(m=>m.completed).sort((a,b)=>a.order-b.order);
  const activities = [
    { date:'Today',  action:'Logged in to Pool of Grace',                      color:'var(--primary)',    icon:<Icons.Dashboard /> },
    ...done.map(m=>({ date:'Recent', action:`Completed Stage ${m.order}: ${m.title} — Score ${m.score}/5`, color:'#1e5a2c', icon:<Icons.Check /> })),
    { date:'Day 1',  action:'Completed onboarding and started the platform',   color:'#7c5cbf',           icon:<Icons.Modules /> },
    { date:'Day 1',  action:'Joined Pool of Grace — Account created',           color:'var(--secondary)', icon:<Icons.Admin /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Learning History</h2>
        <p>Your activity log and completed learning journey</p>
      </div>
      <div className="stat-grid" style={{ marginBottom:'28px' }}>
        {[
          { value:done.length,                                      label:'Modules Completed',  color:'var(--primary)' },
          { value:`${Math.round((done.length/20)*100)}%`,           label:'Course Progress',    color:'#7c5cbf' },
          { value:activities.length,                                label:'Total Activities',   color:'#e67e22' },
        ].map((s,i)=>(
          <div key={i} className="premium-card" style={{ padding:'20px',textAlign:'center',borderTop:`4px solid ${s.color}` }}>
            <div style={{ fontSize:'clamp(22px,4vw,30px)',fontWeight:'800',color:s.color,marginBottom:'4px' }}>{s.value}</div>
            <div style={{ fontSize:'13px',color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="premium-card" style={{ padding:'clamp(18px,4vw,28px)' }}>
        <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'18px' }}>Activity Timeline</h3>
        {activities.map((act,i)=>(
          <div key={i} className="timeline-item" style={{ paddingTop:i===0?'0':'18px',borderTop:i===0?'none':'1px solid #f0f0f0' }}>
            <div className="timeline-icon" style={{ background:`${act.color}18`,border:`2px solid ${act.color}`,color:act.color }}>
              {act.icon}
            </div>
            <div>
              <div style={{ fontSize:'14px',color:'var(--text-main)',fontWeight:'600',marginBottom:'2px' }}>{act.action}</div>
              <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{act.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */
function Admin({ openAdminPanel, lang }) {
  void lang;
  const [stats, setStats] = useState({ participants:0, mentors:4, sessions:0, completion:'8%', newThisWeek:0, activeToday:0 });

  useEffect(()=>{
    const load = async () => {
      try {
        const r = await getMentorshipSessions();
        setStats({ participants:12, mentors:4, sessions:r.data.bookings.length, completion:'8%', newThisWeek:3, activeToday:5 });
      } catch(err) { console.error(err); }
    };
    load();
  },[]);

  const statCards = [
    { value:stats.participants, label:'Total Participants', sub:'registered', color:'var(--primary)', trend:'+3 this week' },
    { value:stats.mentors,      label:'Active Mentors',     sub:'available',  color:'#7c5cbf',       trend:'4 online' },
    { value:stats.sessions,     label:'Sessions Booked',    sub:'all time',   color:'#e67e22',       trend:`${stats.sessions} total` },
    { value:stats.completion,   label:'Avg Completion',     sub:'of 20 mods', color:'#16a085',       trend:'improving' },
    { value:stats.newThisWeek,  label:'New This Week',      sub:'joined',     color:'#c0392b',       trend:'June cohort' },
    { value:stats.activeToday,  label:'Active Today',       sub:'users',      color:'#2c3e50',       trend:'currently online' },
  ];

  const panels = [
    { key:'users',        title:'Participants',        desc:'View all registered participants, performance, and profiles.',    btn:'Manage Participants',  icon:'P' },
    { key:'leaderboard',  title:'Leaderboard',         desc:'Top performers ranked by quiz scores and module completions.',     btn:'View Leaderboard',     icon:'L' },
    { key:'roles',        title:'Roles & Mentors',     desc:'Assign mentor, instructor, or admin roles to platform users.',    btn:'Manage Roles',         icon:'R' },
    { key:'sessions',     title:'Mentorship Sessions', desc:'Monitor all mentorship bookings and session history.',             btn:'Monitor Bookings',     icon:'S' },
    { key:'analytics',    title:'Analytics',           desc:'Detailed engagement, retention, and completion analytics.',        btn:'View Analytics',       icon:'A' },
    { key:'announcements',title:'Announcements',        desc:'Post platform-wide announcements visible to all users.',          btn:'Manage Announcements', icon:'N' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Pool of Grace platform management console — Agnes Berko, Founder</p>
      </div>

      {/* Quick stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'14px',marginBottom:'36px' }}>
        {statCards.map((s,i)=>(
          <div key={i} className="premium-card" style={{ padding:'18px 20px',borderTop:`4px solid ${s.color}`,textAlign:'center' }}>
            <div style={{ fontSize:'clamp(24px,3.5vw,30px)',fontWeight:'800',color:s.color,marginBottom:'4px' }}>{s.value}</div>
            <div style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',marginBottom:'2px' }}>{s.label}</div>
            <div style={{ fontSize:'11px',color:'var(--text-muted)',marginBottom:'6px' }}>{s.sub}</div>
            <div style={{ fontSize:'11px',color:s.color,fontWeight:'600',background:`${s.color}12`,padding:'3px 8px',borderRadius:'10px',display:'inline-block' }}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Activity summary */}
      <div className="premium-card" style={{ padding:'22px 28px',marginBottom:'32px',borderLeft:'5px solid var(--primary)' }}>
        <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'16px' }}>Platform Activity Summary</h3>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'14px' }}>
          {[
            { label:'Modules Completed (all users)', value:'32 completions' },
            { label:'Assignments Submitted',          value:'58 submissions' },
            { label:'Forum Posts',                    value:'24 posts' },
            { label:'Quiz Pass Rate',                 value:'72% average' },
            { label:'Most Active Module',             value:'Module 1: Self-Worth' },
            { label:'Platform Uptime',                value:'99.9%' },
          ].map((item,i)=>(
            <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'var(--bg-main)',borderRadius:'8px',gap:'8px',flexWrap:'wrap' }}>
              <span style={{ fontSize:'13px',color:'var(--text-muted)' }}>{item.label}</span>
              <span style={{ fontSize:'13px',fontWeight:'700',color:'var(--primary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel cards */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px' }}>
        {panels.map((p,i)=>(
          <div key={i} className="premium-card" style={{ padding:'24px',display:'flex',flexDirection:'column' }}>
            <div style={{ width:'42px',height:'42px',background:'var(--primary-pale)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',fontSize:'16px',color:'var(--primary)',marginBottom:'14px' }}>{p.icon}</div>
            <h3 style={{ color:'var(--primary)',marginBottom:'6px',fontSize:'16px',fontWeight:'700' }}>{p.title}</h3>
            <p style={{ color:'var(--text-muted)',fontSize:'13px',lineHeight:'1.6',marginBottom:'18px',flex:1 }}>{p.desc}</p>
            <button className="btn-primary" style={{ width:'100%',fontSize:'13px' }} onClick={()=>openAdminPanel(p.key)}>{p.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN ACTION
   ========================================================= */
function AdminAction({ go, panel, lang }) {
  void lang;
  const [sessionList, setSessionList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [mentorList,  setMentorList]  = useState([]);

  useEffect(()=>{
    if (panel==='sessions') getMentorshipSessions().then(r=>setSessionList(r.data.bookings)).catch(console.error);
    if (panel==='users' || panel==='leaderboard' || panel==='roles') getMentors().then(r=>setMentorList(r.data.mentors)).catch(console.error);
  },[panel]);

  const panelMeta = {
    users:         { title:'Participants',          summary:'View and manage all registered platform participants.' },
    leaderboard:   { title:'Leaderboard',           summary:'Top performers ranked by completions and quiz scores.' },
    roles:         { title:'Roles and Mentors',     summary:'Assign and manage mentor, instructor, and admin roles.' },
    sessions:      { title:'Mentorship Sessions',   summary:'Monitor and manage all mentorship bookings.' },
    analytics:     { title:'Platform Analytics',   summary:'Detailed engagement, completion, and retention metrics.' },
    announcements: { title:'Announcements',         summary:'Create and manage platform-wide announcements.' },
    modules:       { title:'Manage Modules',        summary:'View and configure platform modules.' },
  };
  const meta = panelMeta[panel] || panelMeta.users;

  // Mock participants for demo
  const participants = [
    { id:1, name:'Akosua Mensah',    email:'akosua@email.com',   modules:8,  quizAvg:'4.2', role:'participant', joined:'2026-06-01', location:'Kumasi',  status:'active' },
    { id:2, name:'Abena Asante',     email:'abena@email.com',    modules:12, quizAvg:'4.8', role:'participant', joined:'2026-06-02', location:'Accra',   status:'active' },
    { id:3, name:'Ama Owusu',        email:'ama@email.com',      modules:5,  quizAvg:'3.6', role:'participant', joined:'2026-06-03', location:'Kumasi',  status:'active' },
    { id:4, name:'Efua Boateng',     email:'efua@email.com',     modules:15, quizAvg:'4.9', role:'participant', joined:'2026-06-04', location:'Accra',   status:'active' },
    { id:5, name:'Yaa Darko',        email:'yaa@email.com',      modules:3,  quizAvg:'3.2', role:'participant', joined:'2026-06-05', location:'Kumasi',  status:'inactive' },
    { id:6, name:'Adwoa Amponsah',   email:'adwoa@email.com',    modules:9,  quizAvg:'4.0', role:'participant', joined:'2026-06-06', location:'Accra',   status:'active' },
    { id:7, name:'Gifty Asiedu',     email:'gifty@email.com',    modules:20, quizAvg:'5.0', role:'instructor', joined:'2026-05-20', location:'Kumasi',  status:'active' },
    { id:8, name:'Nhyira Fosu',      email:'nhyira@email.com',   modules:11, quizAvg:'4.5', role:'participant', joined:'2026-06-07', location:'Accra',   status:'active' },
    { id:9, name:'Afua Sarpong',     email:'afua@email.com',     modules:7,  quizAvg:'3.9', role:'participant', joined:'2026-06-08', location:'Kumasi',  status:'active' },
    { id:10,name:'Agnes A. Berko',   email:'a.berko1@alustudent.com', modules:20, quizAvg:'5.0', role:'admin', joined:'2026-05-15', location:'ALU',  status:'active' },
  ];

  const leaderboard = [...participants].sort((a,b) => b.modules - a.modules || parseFloat(b.quizAvg) - parseFloat(a.quizAvg));

  const [roles, setRoles] = useState(() => Object.fromEntries(participants.map(p => [p.id, p.role])));
  const roleColors = { admin:'#c0392b', instructor:'#7c5cbf', participant:'var(--primary)', mentor:'#e67e22' };
  const rankMedal  = (i) => i===0 ? '1st' : i===1 ? '2nd' : i===2 ? '3rd' : `${i+1}th`;

  return (
    <div className="animate-fade-in" style={{ maxWidth:'1000px',margin:'0 auto' }}>
      <div style={{ marginBottom:'22px' }}>
        <button className="btn-outline" onClick={()=>go('admin')} style={{ fontSize:'13px',padding:'8px 16px' }}>Back to Admin</button>
      </div>
      <div className="premium-card" style={{ padding:'clamp(22px,4vw,36px)' }}>
        <span className="badge badge-amber" style={{ marginBottom:'14px',display:'inline-block' }}>Admin Panel</span>
        <h2 style={{ color:'var(--primary)',fontSize:'clamp(20px,4vw,26px)',fontWeight:'800',margin:'0 0 8px' }}>{meta.title}</h2>
        <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'26px' }}>{meta.summary}</p>

        {/* PARTICIPANTS */}
        {panel === 'users' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px',flexWrap:'wrap',gap:'10px' }}>
              <h4 style={{ color:'var(--primary)',fontSize:'15px',margin:0 }}>All Participants ({participants.length})</h4>
              <div style={{ display:'flex',gap:'8px' }}>
                <span className="badge badge-green">{participants.filter(p=>p.status==='active').length} active</span>
                <span className="badge" style={{ background:'#f5f5f5',color:'#888' }}>{participants.filter(p=>p.status==='inactive').length} inactive</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Location</th><th>Modules</th><th>Quiz Avg</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead>
                <tbody>
                  {participants.map((p,i)=>(
                    <tr key={p.id}>
                      <td style={{ color:'var(--text-muted)',fontSize:'12px' }}>{i+1}</td>
                      <td style={{ fontWeight:'700',color:'var(--primary)' }}>{p.name}</td>
                      <td style={{ fontSize:'12px' }}>{p.email}</td>
                      <td style={{ fontSize:'12px' }}>{p.location}</td>
                      <td><strong>{p.modules}</strong><span style={{ color:'var(--text-muted)',fontSize:'11px' }}>/20</span></td>
                      <td><span style={{ color:parseFloat(p.quizAvg)>=4?'#1e5a2c':'var(--text-main)',fontWeight:'700' }}>{p.quizAvg}/5</span></td>
                      <td><span className="badge" style={{ background:`${roleColors[p.role]}18`,color:roleColors[p.role] }}>{p.role}</span></td>
                      <td style={{ fontSize:'12px' }}>{p.joined}</td>
                      <td><span className="badge" style={{ background:p.status==='active'?'#e8f8e8':'#f5f5f5',color:p.status==='active'?'#1e5a2c':'#888' }}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {panel === 'leaderboard' && (
          <div>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>Participants ranked by modules completed, then quiz average score.</p>
            <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
              {leaderboard.map((p,i)=>{
                const medalColors = ['#f39c12','#95a5a6','#cd6400'];
                const medalBg     = ['#fff8e1','#f5f5f5','#fff3e0'];
                return (
                  <div key={p.id} style={{
                    display:'flex',alignItems:'center',gap:'16px',padding:'16px 20px',borderRadius:'12px',flexWrap:'wrap',
                    background:i<3?medalBg[i]:'#fff',border:`2px solid ${i<3?medalColors[i]:'var(--primary-pale)'}`,transition:'var(--transition)'
                  }}>
                    <div style={{ width:'38px',height:'38px',borderRadius:'50%',background:i<3?medalColors[i]:'var(--primary-pale)',display:'flex',alignItems:'center',justifyContent:'center',color:i<3?'#fff':'var(--primary)',fontWeight:'900',fontSize:'14px',flexShrink:0 }}>
                      {rankMedal(i)}
                    </div>
                    <div style={{ width:'40px',height:'40px',borderRadius:'50%',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'800',fontSize:'15px',flexShrink:0 }}>
                      {p.name.charAt(0)}
                    </div>
                    <div style={{ flex:1,minWidth:'120px' }}>
                      <div style={{ fontWeight:'700',color:'var(--primary)',fontSize:'15px' }}>{p.name}</div>
                      <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{p.location} — Joined {p.joined}</div>
                    </div>
                    <div style={{ display:'flex',gap:'18px',flexWrap:'wrap' }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:'20px',fontWeight:'800',color:'var(--primary)' }}>{p.modules}</div>
                        <div style={{ fontSize:'11px',color:'var(--text-muted)' }}>Modules</div>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:'20px',fontWeight:'800',color:'#16a085' }}>{p.quizAvg}</div>
                        <div style={{ fontSize:'11px',color:'var(--text-muted)' }}>Quiz Avg</div>
                      </div>
                      <span className="badge" style={{ alignSelf:'center',background:`${roleColors[p.role]}18`,color:roleColors[p.role] }}>{p.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ROLES */}
        {panel === 'roles' && (
          <div>
            <div className="alert-info" style={{ marginBottom:'22px' }}>
              <strong>Role Definitions:</strong> Participants = regular learners. Instructors = can post in forums with instructor badge, mentor sessions. Mentors = listed in the mentorship directory. Admins = full platform access.
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Current Role</th><th>Assign New Role</th><th>Action</th></tr></thead>
                <tbody>
                  {participants.map(p=>(
                    <tr key={p.id}>
                      <td style={{ fontWeight:'700' }}>{p.name}</td>
                      <td style={{ fontSize:'12px' }}>{p.email}</td>
                      <td><span className="badge" style={{ background:`${roleColors[roles[p.id]]}18`,color:roleColors[roles[p.id]] }}>{roles[p.id]}</span></td>
                      <td>
                        <select
                          value={roles[p.id]}
                          onChange={e=>setRoles(prev=>({...prev,[p.id]:e.target.value}))}
                          style={{ padding:'6px 10px',borderRadius:'7px',border:'1px solid var(--primary-pale)',fontSize:'13px',fontFamily:'inherit',color:'var(--text-main)',outline:'none',cursor:'pointer' }}
                        >
                          <option value="participant">Participant</option>
                          <option value="instructor">Instructor</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-primary" style={{ fontSize:'12px',padding:'6px 14px' }}
                          onClick={()=>alert(`Role updated: ${p.name} is now ${roles[p.id]}`)}>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SESSIONS */}
        {panel === 'sessions' && (
          <div>
            <h4 style={{ color:'var(--primary)',marginBottom:'14px',fontSize:'15px' }}>Scheduled Sessions ({sessionList.length})</h4>
            {sessionList.length === 0 ? (
              <p style={{ color:'var(--text-muted)' }}>No sessions scheduled yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Participant</th><th>Mentor</th><th>Date</th><th>Time</th><th>Type</th></tr></thead>
                  <tbody>
                    {sessionList.map(s=>(
                      <tr key={s.id}>
                        <td style={{ fontWeight:'600' }}>{s.participantName||'—'}</td>
                        <td>{s.mentorName||'—'}</td>
                        <td>{s.date}</td>
                        <td>{s.time}</td>
                        <td>{s.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {panel === 'analytics' && (
          <div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'14px',marginBottom:'26px' }}>
              {[
                { value:'12',  label:'Total Participants',      color:'var(--primary)' },
                { value:'8%',  label:'Avg Completion Rate',     color:'#16a085' },
                { value:'20',  label:'Total Modules',           color:'#7c5cbf' },
                { value:'4',   label:'Active Mentors',          color:'#e67e22' },
                { value:'72%', label:'Quiz Pass Rate',          color:'#c0392b' },
                { value:'58',  label:'Assignments Submitted',   color:'#2c3e50' },
              ].map((s,i)=>(
                <div key={i} style={{ background:'var(--bg-main)',padding:'18px',borderRadius:'10px',textAlign:'center',border:`2px solid ${s.color}28` }}>
                  <div style={{ fontSize:'clamp(22px,3vw,28px)',fontWeight:'800',color:s.color,marginBottom:'4px' }}>{s.value}</div>
                  <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h4 style={{ color:'var(--primary)',marginBottom:'14px' }}>Module Completion Breakdown</h4>
            <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
              {['Self-Worth (Modules 1-7)','Technology Skills (Modules 8-14)','Professional Dev (Modules 15-20)'].map((cat,i)=>{
                const pct = [45, 22, 12][i];
                const clr = ['var(--primary)','#7c5cbf','#e67e22'][i];
                return (
                  <div key={i}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'6px' }}>
                      <span style={{ fontSize:'13px',color:'var(--text-main)',fontWeight:'600' }}>{cat}</span>
                      <span style={{ fontSize:'13px',color:clr,fontWeight:'700' }}>{pct}%</span>
                    </div>
                    <div style={{ height:'10px',background:'#f0f0f0',borderRadius:'5px',overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`,height:'100%',background:clr,borderRadius:'5px',transition:'width 1s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="alert-info" style={{ marginTop:'22px' }}>
              <strong>Note:</strong> Analytics data is representative of the current beta cohort (12 participants). Full production analytics will be available after PostgreSQL migration.
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {panel === 'announcements' && (
          <div>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'18px' }}>Create a new announcement that will appear on all participant dashboards.</p>
            <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
              <div>
                <label style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',display:'block',marginBottom:'5px' }}>Announcement Title *</label>
                <input className="premium-input" placeholder="e.g. Saturday meeting cancelled — rescheduled to Sunday" style={{ marginBottom:0 }} />
              </div>
              <div>
                <label style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',display:'block',marginBottom:'5px' }}>Message *</label>
                <textarea style={{ width:'100%',minHeight:'120px',padding:'12px',border:'2px solid var(--primary-pale)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'vertical',outline:'none' }}
                  placeholder="Type your announcement here..." />
              </div>
              <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
                <div style={{ flex:1,minWidth:'160px' }}>
                  <label style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',display:'block',marginBottom:'5px' }}>Priority</label>
                  <select className="premium-input" style={{ marginBottom:0 }}>
                    <option value="normal">Normal</option>
                    <option value="high">Important</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div style={{ flex:1,minWidth:'160px' }}>
                  <label style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',display:'block',marginBottom:'5px' }}>Pin to top?</label>
                  <select className="premium-input" style={{ marginBottom:0 }}>
                    <option value="no">No</option>
                    <option value="yes">Yes — pin this announcement</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary" style={{ width:'fit-content' }} onClick={()=>alert('Announcement posted! It will appear on all user dashboards.')}>
                Post Announcement
              </button>
            </div>
          </div>
        )}

        {/* MODULES */}
        {panel === 'modules' && (
          <div style={{ textAlign:'center',padding:'36px 0' }}>
            <p style={{ color:'var(--text-muted)',marginBottom:'16px' }}>20 modules seeded with unique content, quizzes, and Ghana-specific examples.</p>
            <button className="btn-primary" onClick={()=>go('modules')}>Open Modules Panel</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ASSIGNMENT TAB (Rich — not just quiz)
   ========================================================= */
function AssignmentTab({ module, catColor, setActiveTab }) {
  const [submissions, setSubmissions] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [wordCounts, setWordCounts] = useState({});

  const selfWorthTasks = [
    {
      type: 'reflection',
      title: 'Personal Reflection Essay',
      desc: `Write a 150-200 word personal reflection on how "${module.title}" applies to your life and your journey into technology. Include one real experience that challenged you.`,
      placeholder: 'Begin your reflection here... Be honest and specific about your experience.',
      minWords: 80,
    },
    {
      type: 'action-plan',
      title: 'Action Plan',
      desc: 'List 3 specific, concrete actions you will take THIS WEEK to apply what you learned. Be specific about the day and time you will do each action.',
      placeholder: 'Action 1: ...\nAction 2: ...\nAction 3: ...',
      minWords: 30,
    },
    {
      type: 'affirmations',
      title: 'Affirmation Cards',
      desc: 'Write 5 personal affirmations related to this module\'s theme. Each affirmation should start with "I am" or "I can" and be specific to you as a young woman pursuing technology in Ghana.',
      placeholder: '1. I am...\n2. I can...\n3. I am...\n4. I will...\n5. I deserve...',
      minWords: 20,
    },
    {
      type: 'peer-share',
      title: 'Peer Sharing (Optional)',
      desc: 'If comfortable, write one thing from this module you would like to share with a friend, classmate, or in the Community Forum. Explain why this lesson matters to you.',
      placeholder: 'What would you share and why?',
      minWords: 0,
    },
  ];

  const techTasks = [
    {
      type: 'practical',
      title: 'Hands-On Coding Exercise',
      desc: `Write or describe the code you built for "${module.title}". Paste your code OR explain step-by-step what you did and what each line does.`,
      placeholder: 'Paste your code here, or describe exactly what you built step by step...',
      minWords: 40,
    },
    {
      type: 'explanation',
      title: 'Technical Explanation',
      desc: 'In your own words (100+ words), explain: (a) What you built, (b) Challenges you faced, (c) How you solved those challenges, (d) Key technical concepts from this module.',
      placeholder: 'Write your technical explanation here...',
      minWords: 60,
    },
    {
      type: 'ghana-context',
      title: 'Ghanaian Context Application',
      desc: 'Describe ONE real problem in your community or Ghana that could be solved using the technical skill from this module. How would you build it? Who would it help?',
      placeholder: 'Problem: ...\nSolution using this skill: ...\nWho benefits: ...',
      minWords: 40,
    },
    {
      type: 'debug-challenge',
      title: 'Debug Challenge',
      desc: 'Find and fix one error in a sample code snippet (write it in your notes), OR describe one bug you encountered in your own code and how you fixed it.',
      placeholder: 'Describe the bug and your fix here...',
      minWords: 20,
    },
  ];

  const careerTasks = [
    {
      type: 'company-research',
      title: 'Company Research Report',
      desc: `Research a specific tech company or role in Ghana related to "${module.title}". Write 150+ words covering: what they do, required skills, hiring process, and how you plan to apply.`,
      placeholder: 'Company: ...\nWhat they do: ...\nSkills needed: ...\nHow I will apply: ...',
      minWords: 80,
    },
    {
      type: 'personal-action',
      title: 'Personal Application Task',
      desc: 'Complete ONE practical action from this module on your own profile or document. Examples: update your LinkedIn summary, write a CV section, practice an interview answer, or create a portfolio item.',
      placeholder: 'What I did: ...\nHow it went: ...\nWhat I would improve: ...',
      minWords: 30,
    },
    {
      type: 'networking',
      title: 'Networking Goal',
      desc: 'Set ONE specific networking goal for this week. Write who you will connect with, how you will reach out, and why that connection matters for your tech career.',
      placeholder: 'My networking goal: ...\nWho I will contact: ...\nWhat I will say: ...',
      minWords: 30,
    },
    {
      type: 'elevator-pitch',
      title: 'Elevator Pitch',
      desc: 'Write a 60-second elevator pitch about yourself as a tech professional. Include your skills, what you are building toward, and why someone should hire you or collaborate with you.',
      placeholder: 'My name is... I am learning... I am passionate about... My goal is...',
      minWords: 40,
    },
  ];

  const tasks = module.category === 'self-worth' ? selfWorthTasks
    : module.category === 'technical-skills' ? techTasks
    : careerTasks;

  const handleChange = (type, val) => {
    setSubmissions(prev => ({ ...prev, [type]: val }));
    const wc = val.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCounts(prev => ({ ...prev, [type]: wc }));
  };

  const handleSubmit = (type, minWords) => {
    const wc = wordCounts[type] || 0;
    if (wc < minWords) { alert(`Please write at least ${minWords} words. You have ${wc} so far.`); return; }
    const key = `pog_assign_${module.id}_${type}`;
    localStorage.setItem(key, submissions[type] || '');
    setSubmitted(prev => ({ ...prev, [type]: true }));
  };

  const getSaved = (type) => localStorage.getItem(`pog_assign_${module.id}_${type}`) || '';
  const allRequired = tasks.filter(t => t.minWords > 0).every(t => submitted[t.type] || getSaved(t.type));

  return (
    <div>
      <h2 className="section-heading">Module Assignment</h2>
      <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'8px' }}>
        Complete each task below. Your work is saved locally on your device. All required tasks must be submitted before the quiz unlocks.
      </p>
      <div className="alert-info" style={{ marginBottom:'24px' }}>
        <strong>How assignments work:</strong> Each task has its own text box and Submit button. Required tasks show a minimum word count. The quiz unlocks once all required tasks are submitted.
      </div>

      <div style={{ display:'flex',flexDirection:'column',gap:'22px' }}>
        {tasks.map((task, i) => {
          const isSaved = getSaved(task.type) !== '';
          const isDone  = submitted[task.type] || isSaved;
          const wc      = wordCounts[task.type] || 0;
          return (
            <div key={task.type} style={{ border:`2px solid ${isDone ? catColor() : 'var(--primary-pale)'}`,borderRadius:'14px',overflow:'hidden' }}>
              {/* Task header */}
              <div style={{ background:isDone ? `${catColor()}12` : 'var(--bg-main)',padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                  <div style={{ width:'28px',height:'28px',background:isDone ? catColor() : '#ccc',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'800',fontSize:'13px',flexShrink:0 }}>
                    {isDone ? <Icons.Check /> : i+1}
                  </div>
                  <div>
                    <h4 style={{ color:'var(--primary)',margin:0,fontSize:'15px',fontWeight:'700' }}>{task.title}</h4>
                    {task.minWords > 0 && <span style={{ fontSize:'11px',color:'var(--text-muted)' }}>Minimum {task.minWords} words required</span>}
                    {task.minWords === 0 && <span style={{ fontSize:'11px',color:'var(--text-muted)' }}>Optional</span>}
                  </div>
                </div>
                {isDone && <span className="badge badge-green" style={{ padding:'5px 12px' }}>Submitted</span>}
              </div>
              {/* Task body */}
              <div style={{ padding:'18px 20px' }}>
                <p style={{ color:'var(--text-main)',fontSize:'13px',lineHeight:'1.7',marginBottom:'14px' }}>{task.desc}</p>
                <textarea
                  style={{ width:'100%',minHeight:'110px',padding:'12px',border:'2px solid var(--primary-pale)',borderRadius:'9px',fontSize:'14px',fontFamily:'inherit',resize:'vertical',outline:'none',transition:'border-color 0.2s' }}
                  placeholder={task.placeholder}
                  defaultValue={getSaved(task.type)}
                  onChange={e => handleChange(task.type, e.target.value)}
                  onFocus={e => e.target.style.borderColor = catColor()}
                  onBlur={e => e.target.style.borderColor = 'var(--primary-pale)'}
                />
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'10px',flexWrap:'wrap',gap:'8px' }}>
                  <span style={{ fontSize:'12px',color:wc >= task.minWords ? catColor() : 'var(--text-muted)' }}>
                    {wc} word{wc !== 1 ? 's' : ''}{task.minWords > 0 ? ` / ${task.minWords} required` : ''}
                  </span>
                  <button
                    className="btn-primary"
                    style={{ fontSize:'13px',padding:'8px 20px',background:catColor(),borderRadius:'20px' }}
                    onClick={() => handleSubmit(task.type, task.minWords)}
                  >
                    {isDone ? 'Update Submission' : 'Submit Task'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:'28px',padding:'20px',background:allRequired ? '#eafaea' : '#fff8e1',borderRadius:'12px',border:`1px solid ${allRequired ? '#c3e6c3' : '#ffe082'}` }}>
        <p style={{ fontWeight:'700',marginBottom:'6px',fontSize:'14px',color:allRequired ? '#1e5a2c' : '#7a5b13' }}>
          {allRequired ? 'All required tasks submitted — Quiz is now unlocked!' : 'Complete all required tasks to unlock the Quiz'}
        </p>
        <p style={{ margin:0,fontSize:'13px',color:allRequired ? '#2d7a2d' : '#7a5b13' }}>
          {allRequired ? 'Great work! Proceed to the Quiz tab to test your understanding.' : 'Submit each required task above, then return here to proceed.'}
        </p>
        {allRequired && (
          <button className="btn-primary" style={{ marginTop:'14px',background:catColor() }} onClick={() => setActiveTab('quiz')}>
            Go to Quiz
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CERTIFICATES PAGE
   ========================================================= */
function CertificatePage({ user, modules, lang }) {
  void lang;
  const done = modules.filter(m => m.completed).sort((a,b) => a.order - b.order);
  const [selected, setSelected] = useState(null);
  const dateStr = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });

  const catLabel = { 'self-worth':'Self-Worth Development', 'technical-skills':'Technology Skills', 'professional-development':'Professional Development' };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>My Certificates</h2>
        <p>Certificates are awarded for every module you complete with a passing quiz score.</p>
      </div>

      {done.length === 0 ? (
        <div className="premium-card" style={{ padding:'56px',textAlign:'center' }}>
          <Icons.Grades />
          <h3 style={{ color:'var(--primary)',margin:'18px 0 8px' }}>No certificates yet</h3>
          <p style={{ color:'var(--text-muted)',fontSize:'14px' }}>Complete your first module quiz (score 3/5 or higher) to earn your first certificate.</p>
        </div>
      ) : (
        <div className="two-col-panel" style={{ alignItems:'flex-start' }}>
          {/* List */}
          <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'6px' }}>You have earned <strong>{done.length}</strong> certificate{done.length !== 1 ? 's' : ''}. Click one to preview.</p>
            {done.map(m => (
              <div key={m.id} onClick={() => setSelected(m)} style={{
                padding:'16px 20px',borderRadius:'12px',cursor:'pointer',transition:'var(--transition)',
                border:'2px solid '+(selected?.id===m.id ? 'var(--primary-light)' : 'var(--primary-pale)'),
                background:selected?.id===m.id ? 'var(--primary-pale)' : '#fff',
                display:'flex',alignItems:'center',gap:'14px'
              }}>
                <div style={{ width:'38px',height:'38px',background:'linear-gradient(135deg,var(--primary),var(--primary-light))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'800',fontSize:'14px',flexShrink:0 }}>
                  {m.order}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:'700',color:'var(--primary)',fontSize:'14px',marginBottom:'2px' }}>Stage {m.order}: {m.title}</div>
                  <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{catLabel[m.category]} — Score: {m.score}/5</div>
                </div>
                <Icons.Check />
              </div>
            ))}
          </div>

          {/* Certificate preview */}
          <div>
            {selected ? (
              <div id="cert-preview" style={{
                background:'#fff',border:'6px double var(--primary)',borderRadius:'16px',padding:'clamp(28px,5vw,48px)',
                textAlign:'center',boxShadow:'0 12px 40px rgba(0,0,0,0.12)',position:'relative',overflow:'hidden'
              }}>
                {/* decorative corner */}
                <div style={{ position:'absolute',top:0,left:0,width:'80px',height:'80px',background:'var(--primary-pale)',borderRadius:'0 0 80px 0' }}></div>
                <div style={{ position:'absolute',bottom:0,right:0,width:'80px',height:'80px',background:'var(--primary-pale)',borderRadius:'80px 0 0 0' }}></div>

                <div style={{ fontSize:'11px',fontWeight:'700',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:'12px' }}>Certificate of Completion</div>
                <h1 style={{ fontSize:'clamp(24px,4vw,30px)',fontWeight:'800',color:'var(--primary)',marginBottom:'8px',lineHeight:'1.2' }}>Pool of Grace</h1>
                <p style={{ color:'var(--text-muted)',fontSize:'13px',marginBottom:'24px' }}>Empowering Young Women in Technology — Ghana</p>

                <div style={{ width:'60px',height:'3px',background:'linear-gradient(90deg,var(--primary),var(--primary-light))',borderRadius:'2px',margin:'0 auto 24px' }}></div>

                <p style={{ color:'var(--text-main)',fontSize:'14px',marginBottom:'6px' }}>This certifies that</p>
                <h2 style={{ fontSize:'clamp(20px,4vw,26px)',fontWeight:'800',color:'var(--text-main)',marginBottom:'6px',fontStyle:'italic' }}>
                  {user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Participant'}
                </h2>
                <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'24px' }}>has successfully completed</p>

                <div style={{ background:'var(--primary-pale)',padding:'18px 24px',borderRadius:'12px',marginBottom:'24px',border:'2px solid var(--primary-light)' }}>
                  <div style={{ fontSize:'11px',color:'var(--text-muted)',fontWeight:'600',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px' }}>{catLabel[selected.category]}</div>
                  <h3 style={{ color:'var(--primary)',fontSize:'clamp(16px,3vw,20px)',fontWeight:'800',margin:'0 0 6px' }}>Stage {selected.order}: {selected.title}</h3>
                  <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:0 }}>Quiz Score: {selected.score}/5 — {selected.score >= 4 ? 'Distinction' : 'Pass'}</p>
                </div>

                <p style={{ color:'var(--text-muted)',fontSize:'13px',marginBottom:'8px' }}>Issued on {dateStr}</p>
                <div style={{ display:'flex',justifyContent:'space-around',marginTop:'22px',flexWrap:'wrap',gap:'16px' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ width:'120px',height:'2px',background:'#ccc',marginBottom:'6px' }}></div>
                    <div style={{ fontSize:'12px',fontWeight:'600',color:'var(--text-muted)' }}>Agnes A. Berko</div>
                    <div style={{ fontSize:'11px',color:'var(--text-muted)' }}>Founder, Pool of Grace</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ width:'120px',height:'2px',background:'#ccc',marginBottom:'6px' }}></div>
                    <div style={{ fontSize:'12px',fontWeight:'600',color:'var(--text-muted)' }}>Supervisor</div>
                    <div style={{ fontSize:'11px',color:'var(--text-muted)' }}>African Leadership University</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-card" style={{ padding:'40px',textAlign:'center',color:'var(--text-muted)' }}>
                <Icons.Grades />
                <p style={{ marginTop:'14px',fontSize:'14px' }}>Select a module certificate on the left to preview it.</p>
              </div>
            )}
            {selected && (
              <button className="btn-primary" style={{ width:'100%',marginTop:'14px' }} onClick={() => window.print()}>
                Print / Save Certificate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   RECORDINGS PAGE
   ========================================================= */
function RecordingsPage({ lang }) {
  void lang;
  const recordings = [
    { id:1, title:'Welcome Session — Introduction to Pool of Grace', date:'2026-06-07', duration:'45 min', host:'Agnes Berko', type:'general', thumb:'General Meeting Recording' },
    { id:2, title:'Module 1 Study Session — Understanding Self-Worth', date:'2026-06-14', duration:'62 min', host:'Agnes Berko', type:'module', thumb:'Study Session Recording' },
    { id:3, title:'General Meeting — Week 2', date:'2026-06-21', duration:'50 min', host:'Agnes Berko', type:'general', thumb:'General Meeting Recording' },
    { id:4, title:'Mentorship Workshop — Breaking Tech Barriers', date:'2026-06-10', duration:'38 min', host:'Abena Asante', type:'workshop', thumb:'Mentorship Workshop' },
    { id:5, title:'Career Talk — Working in Ghana\'s Tech Industry', date:'2026-06-17', duration:'55 min', host:'Ama Owusu', type:'career', thumb:'Career Talk Recording' },
  ];

  const typeColors = { general:'var(--primary)', module:'#7c5cbf', workshop:'#e67e22', career:'#16a085' };
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? recordings : recordings.filter(r => r.type === filter);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Session Recordings</h2>
        <p>Access recorded general meetings, study sessions, and mentorship workshops.</p>
      </div>

      <div className="alert-info" style={{ marginBottom:'26px' }}>
        <strong>Recording Access:</strong> All Pool of Grace sessions are recorded for participants. Recordings are available for 90 days after the session date. New recordings appear here after each Saturday meeting.
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap' }}>
        {[['all','All Recordings'],['general','General Meetings'],['module','Study Sessions'],['workshop','Workshops'],['career','Career Talks']].map(([key,label])=>(
          <button key={key} onClick={() => setFilter(key)} style={{
            padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',
            border:'2px solid '+(filter===key?'var(--primary-light)':'var(--primary-pale)'),
            background:filter===key?'var(--primary-light)':'#fff',
            color:filter===key?'#fff':'var(--text-muted)',transition:'var(--transition)',fontFamily:'inherit'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
        {filtered.map(rec => (
          <div key={rec.id} className="premium-card" style={{ padding:'0',overflow:'hidden',display:'flex',flexWrap:'wrap' }}>
            {/* Thumbnail */}
            <div style={{ width:'clamp(100px,22vw,180px)',background:`${typeColors[rec.type]}18`,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px',padding:'22px',borderRight:'1px solid var(--primary-pale)',flexShrink:0 }}>
              <div style={{ color:typeColors[rec.type] }}><Icons.Video2 /></div>
              <div style={{ fontSize:'11px',fontWeight:'600',color:typeColors[rec.type],textAlign:'center',textTransform:'uppercase',letterSpacing:'0.5px' }}>{rec.type}</div>
            </div>
            {/* Info */}
            <div style={{ flex:1,padding:'20px 24px',minWidth:'200px' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'10px' }}>
                <div style={{ flex:1 }}>
                  <h3 style={{ color:'var(--primary)',fontSize:'clamp(14px,2.5vw,16px)',fontWeight:'700',margin:'0 0 6px' }}>{rec.title}</h3>
                  <div style={{ fontSize:'13px',color:'var(--text-muted)',display:'flex',gap:'16px',flexWrap:'wrap' }}>
                    <span>Host: <strong>{rec.host}</strong></span>
                    <span>{rec.date}</span>
                    <span>{rec.duration}</span>
                  </div>
                </div>
                <div style={{ display:'flex',gap:'8px',flexShrink:0 }}>
                  <button className="btn-outline" style={{ padding:'8px 16px',fontSize:'13px' }}>
                    Watch
                  </button>
                  <button className="btn-primary" style={{ padding:'8px 16px',fontSize:'13px',background:typeColors[rec.type] }}>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert-warning" style={{ marginTop:'28px' }}>
        <strong>Upload a Recording:</strong> If you are a mentor or admin, use the Admin panel to upload new session recordings. Contact <a href="mailto:a.berko1@alustudent.com" style={{ color:'var(--primary)',fontWeight:'700' }}>a.berko1@alustudent.com</a> to share a recording link.
      </div>
    </div>
  );
}

/* =========================================================
   ANNOUNCEMENTS PAGE
   ========================================================= */
function AnnouncementsPage({ lang }) {
  void lang;
  const announcements = [
    {
      id:1, priority:'high', title:'New Cohort — June 2026 Applications Now Open',
      body:'Pool of Grace is accepting new participants for the June 2026 cohort. Eligible women aged 16-30 in Kumasi and Accra can apply now. Share with friends and family who would benefit from this free program.',
      date:'2026-06-17', author:'Agnes Berko (Admin)', pinned:true,
    },
    {
      id:2, priority:'normal', title:'Weekly Saturday Meeting — 4:00 PM Ghana Time',
      body:'Join our weekly general meeting every Saturday at 4:00 PM Ghana Time (GMT) via Google Meet. Link: https://meet.google.com/bii-jzew-udd — This week we will be discussing Module 3: Building Self-Efficacy.',
      date:'2026-06-14', author:'Agnes Berko', pinned:true,
    },
    {
      id:3, priority:'normal', title:'Office Hours Now Available — Book with Agnes',
      body:'Individual office hours with Agnes Berko are now bookable on Tuesdays, Fridays, and Saturdays from 2:00 PM to 3:00 PM Ghana Time. Visit the Mentorship page to book your slot. You can also email a.berko1@alustudent.com.',
      date:'2026-06-12', author:'Agnes Berko', pinned:false,
    },
    {
      id:4, priority:'normal', title:'Module Recordings Now Available in the Recordings Section',
      body:'Session recordings for Weeks 1 and 2 are now available in the Recordings section. You can watch or download any session you missed. New recordings are uploaded every Sunday after Saturday meetings.',
      date:'2026-06-10', author:'Pool of Grace System', pinned:false,
    },
    {
      id:5, priority:'low', title:'Community Forum Guidelines',
      body:'A reminder to keep all forum posts respectful, supportive, and on-topic. Pool of Grace is a safe space for all young women. Any harassment or inappropriate content will be removed. Report issues to admin.',
      date:'2026-06-07', author:'Agnes Berko', pinned:false,
    },
    {
      id:6, priority:'low', title:'ALU Research Ethics Compliance Notice',
      body:'Pool of Grace is operating under ALU Research Ethics Committee approval. All participant data is confidential, stored securely, and will not be shared. Your participation is entirely voluntary and you may withdraw at any time. See the Privacy and Ethics page for full details.',
      date:'2026-06-03', author:'Agnes Berko (Researcher)', pinned:false,
    },
  ];

  const priorityStyle = { high:{ bg:'#fff0f0',border:'#e05252',label:'Important' }, normal:{ bg:'#fff',border:'var(--primary-pale)',label:'' }, low:{ bg:'#fafafa',border:'#e0e0e0',label:'' } };
  const [active, setActive] = useState(null);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Announcements</h2>
        <p>Important updates, meeting notices, and platform news from Pool of Grace</p>
      </div>

      <div className="two-col-panel" style={{ alignItems:'flex-start' }}>
        {/* List */}
        <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
          {announcements.map(a => {
            const s = priorityStyle[a.priority];
            return (
              <div key={a.id} onClick={() => setActive(a)} style={{
                padding:'16px 18px',borderRadius:'12px',cursor:'pointer',transition:'var(--transition)',
                border:'2px solid '+(active?.id===a.id?'var(--primary-light)':s.border),
                background:active?.id===a.id?'var(--primary-pale)':s.bg
              }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px' }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    {a.pinned && <span className="badge badge-amber" style={{ marginBottom:'5px',display:'inline-block' }}>Pinned</span>}
                    {a.priority==='high' && !a.pinned && <span className="badge" style={{ background:'#ffe0e0',color:'#b93a3a',marginBottom:'5px',display:'inline-block' }}>Important</span>}
                    <h4 style={{ color:'var(--primary)',fontSize:'14px',fontWeight:'700',margin:'0 0 4px',lineHeight:'1.4' }}>{a.title}</h4>
                    <p style={{ color:'var(--text-muted)',fontSize:'12px',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{a.body.substring(0,70)}...</p>
                  </div>
                </div>
                <div style={{ fontSize:'11px',color:'var(--text-muted)',marginTop:'8px' }}>{a.date} — {a.author}</div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        <div className="premium-card" style={{ padding:'28px',minHeight:'360px' }}>
          {active ? (
            <div className="animate-fade-in">
              {active.pinned && <span className="badge badge-amber" style={{ marginBottom:'12px',display:'inline-block',padding:'5px 12px' }}>Pinned Announcement</span>}
              <h3 style={{ color:'var(--primary)',fontSize:'clamp(16px,3vw,20px)',fontWeight:'800',margin:'0 0 8px' }}>{active.title}</h3>
              <div style={{ fontSize:'13px',color:'var(--text-muted)',marginBottom:'20px' }}>
                By <strong>{active.author}</strong> — {active.date}
              </div>
              <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.8',whiteSpace:'pre-wrap' }}>{active.body}</p>
              {active.body.includes('meet.google.com') && (
                <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex',alignItems:'center',gap:'8px',marginTop:'18px',padding:'10px 22px',background:'var(--primary)',color:'#fff',borderRadius:'20px',fontWeight:'700',fontSize:'13px' }}>
                  <Icons.Meet /> Join Google Meet
                </a>
              )}
              {active.body.includes('a.berko1@alustudent.com') && (
                <a href="mailto:a.berko1@alustudent.com"
                  style={{ display:'inline-flex',alignItems:'center',gap:'8px',marginTop:'12px',padding:'10px 22px',background:'var(--primary-pale)',color:'var(--primary)',borderRadius:'20px',fontWeight:'700',fontSize:'13px',border:'2px solid var(--primary-light)' }}>
                  Email Agnes Berko
                </a>
              )}
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-muted)',gap:'12px' }}>
              <Icons.Inbox />
              <p style={{ fontSize:'14px' }}>Select an announcement to read the full details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PRIVACY AND ETHICS PAGE
   ========================================================= */
function PrivacyPage({ lang }) {
  void lang;
  const sections = [
    {
      title:'1. Purpose of Data Collection',
      content:`Pool of Grace collects information to support the design, development, testing, and validation of the learning platform. Data collected helps us identify barriers to technology education, understand participant learning needs, evaluate platform usability, and improve the platform for future implementation.\n\nResearcher: Agnes Adepa Berko, African Leadership University (ALU)\nProject Duration: 15 May 2026 – 15 July 2026`,
    },
    {
      title:'2. What Information We Collect',
      content:`• Registration data: name, email, location, age group, educational background\n• Learning activity: module progress, quiz scores, assignment submissions\n• Onboarding survey: personal story, barriers experienced, learning goals, motivation\n• Session data: mentorship bookings, forum posts, and platform usage\n• Feedback: usability survey responses and post-session comments`,
    },
    {
      title:'3. Your Rights as a Participant',
      content:`You have the right to:\n• Ask questions before, during, or after participation\n• Refuse to answer any question or complete any task\n• Withdraw from the study at any time without penalty or consequence\n• Request that your data be removed before analysis begins\n• Access your own data at any time by contacting the researcher\n\nParticipation is entirely voluntary. You will not be disadvantaged for choosing not to participate.`,
    },
    {
      title:'4. Confidentiality and Data Security',
      content:`All participants are assigned unique identification codes. Your name and personal identifiers will never appear in research reports, academic publications, or conference presentations.\n\nOnly the researcher (Agnes Berko) and the academic supervisor (Ndinelao Iitumba, ALU) will have access to identifiable information. All findings are reported in aggregate form.\n\nElectronic data is stored on password-protected devices. Audio recordings are encrypted. Interview transcripts are de-identified before analysis. Data will be retained for five (5) years following project completion and then securely destroyed.`,
    },
    {
      title:'5. Data Storage and Retention',
      content:`• Electronic data: stored on password-protected, encrypted devices\n• Session recordings: stored securely and de-identified\n• Consent forms: stored separately from all research data\n• Retention period: 5 years from project completion date (2031)\n• Disposal: all data will be securely destroyed after the retention period`,
    },
    {
      title:'6. Protection of Vulnerable Participants',
      content:`For participants aged 16-17 years, parental or guardian consent is required in addition to participant assent before any participation.\n\nNo participant will be coerced, pressured, or disadvantaged for declining to participate or withdrawing at any time. Language used across the platform is culturally sensitive and appropriate for the Ghanaian context.`,
    },
    {
      title:'7. Ethical Compliance',
      content:`This study complies with the ethical research guidelines of the African Leadership University (ALU) and is reviewed by the ALU Research Ethics Committee (REC).\n\nKey ethical standards followed:\n• Informed consent obtained from all participants\n• Confidentiality and anonymization of all participant data\n• Risk/benefit assessment documented and reviewed\n• Cultural sensitivity across all content and communications\n• Transparent communication about data use and publication`,
    },
    {
      title:'8. Contact Information',
      content:`Researcher:\nAgnes Adepa Berko\nEmail: a.berko1@alustudent.com\nOffice Hours: Tuesdays, Fridays, Saturdays — 2:00 PM to 3:00 PM Ghana Time\n\nAcademic Supervisor:\nNdinelao Iitumba\nAfrican Leadership University (ALU)\n\nFor any privacy concerns, questions about your data, or to request withdrawal from the study, please contact the researcher directly.`,
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Privacy and Ethics</h2>
        <p>Pool of Grace is committed to protecting your privacy and upholding the highest ethical research standards.</p>
      </div>

      <div className="premium-card" style={{ padding:'clamp(18px,4vw,30px)',marginBottom:'26px',borderLeft:'5px solid var(--primary)' }}>
        <div style={{ display:'flex',gap:'16px',alignItems:'flex-start' }}>
          <div style={{ color:'var(--primary)',flexShrink:0,marginTop:'2px' }}><Icons.Admin /></div>
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'6px' }}>ALU Research Ethics Committee Approved</h3>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',lineHeight:'1.7',margin:0 }}>
              Pool of Grace operates under the approval of the African Leadership University Research Ethics Committee (REC). All research activities comply with the ALU Senate approved guidelines for ethical research involving human participants.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
        {sections.map((s,i)=>(
          <div key={i} className="premium-card" style={{ overflow:'hidden' }}>
            <button onClick={()=>setOpen(open===i?-1:i)} style={{
              width:'100%',padding:'16px 22px',background:open===i?'var(--primary-pale)':'#fff',
              border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',
              fontFamily:'inherit',fontSize:'15px',fontWeight:'700',color:'var(--primary)',gap:'10px'
            }}>
              <span style={{ textAlign:'left' }}>{s.title}</span>
              <span style={{ flexShrink:0,fontSize:'18px',color:'var(--primary-light)',transform:open===i?'rotate(180deg)':'none',transition:'transform 0.2s' }}>v</span>
            </button>
            {open === i && (
              <div style={{ padding:'16px 22px 22px',borderTop:'1px solid var(--primary-pale)' }}>
                <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.85',whiteSpace:'pre-wrap',margin:0 }}>{s.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="alert-info" style={{ marginTop:'28px' }}>
        <strong>Questions about your privacy?</strong> Contact Agnes Berko at{' '}
        <a href="mailto:a.berko1@alustudent.com" style={{ color:'var(--primary)',fontWeight:'700' }}>a.berko1@alustudent.com</a>.
        You can also visit the Mentorship page to book an office hours session.
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE PAGE
   ========================================================= */
function ProfilePage({ user, lang, modules }) {
  void lang;
  const completedModules = modules ? modules.filter(m => m.completed) : [];
  const passedWithDistinction = completedModules.filter(m => m.score >= 5).length;
  const initials = user ? `${(user.firstName||'')[0]}${(user.lastName||'')[0]}`.toUpperCase() : 'PG';

  const stats = [
    { label:'Modules Completed',    value: completedModules.length, color:'var(--primary)' },
    { label:'Distinctions',         value: passedWithDistinction,   color:'#f39c12' },
    { label:'Total Modules',        value: modules ? modules.length : 20, color:'#7c5cbf' },
    { label:'Completion Rate',      value: modules && modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) + '%' : '0%', color:'#16a085' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Your personal account and learning progress overview</p>
      </div>

      {/* Profile card */}
      <div className="premium-card" style={{ padding:'clamp(22px,4vw,36px)',marginBottom:'28px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'24px',flexWrap:'wrap',marginBottom:'26px' }}>
          <div style={{ width:'80px',height:'80px',borderRadius:'50%',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'28px',fontWeight:'800',flexShrink:0 }}>
            {initials}
          </div>
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'clamp(18px,3vw,22px)',fontWeight:'800',margin:'0 0 4px' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Participant'}
            </h3>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',margin:'0 0 6px' }}>{user ? user.email : ''}</p>
            <span className="badge" style={{ background:'var(--primary-pale)',color:'var(--primary)',textTransform:'capitalize' }}>
              {user ? user.role : 'participant'}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'12px',marginBottom:'26px' }}>
          {stats.map((s,i) => (
            <div key={i} style={{ background:'var(--bg-main)',padding:'16px',borderRadius:'10px',textAlign:'center',borderTop:`3px solid ${s.color}` }}>
              <div style={{ fontSize:'clamp(22px,3vw,28px)',fontWeight:'800',color:s.color,marginBottom:'4px' }}>{s.value}</div>
              <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'8px' }}>
            <span style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)' }}>Overall Progress</span>
            <span style={{ fontSize:'13px',fontWeight:'700',color:'var(--primary)' }}>
              {completedModules.length}/{modules ? modules.length : 20} modules
            </span>
          </div>
          <div style={{ height:'12px',background:'#f0f0f0',borderRadius:'6px',overflow:'hidden' }}>
            <div style={{
              width: modules && modules.length > 0 ? `${(completedModules.length / modules.length) * 100}%` : '0%',
              height:'100%',background:'linear-gradient(90deg,var(--primary),var(--primary-light))',borderRadius:'6px',transition:'width 1s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Completed modules list */}
      <div className="premium-card" style={{ padding:'clamp(18px,3vw,28px)',marginBottom:'24px' }}>
        <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'16px' }}>
          Completed Modules ({completedModules.length})
        </h3>
        {completedModules.length === 0 ? (
          <div style={{ textAlign:'center',padding:'28px',color:'var(--text-muted)' }}>
            <p style={{ marginBottom:'12px' }}>You have not completed any modules yet.</p>
            <p style={{ fontSize:'13px' }}>Start with Module 1 and work your way through all 20 stages!</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
            {completedModules.map((m,i) => (
              <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'var(--bg-main)',borderRadius:'9px',border:'1px solid var(--primary-pale)',flexWrap:'wrap',gap:'8px' }}>
                <div>
                  <div style={{ fontWeight:'700',color:'var(--primary)',fontSize:'14px' }}>{m.title}</div>
                  <div style={{ fontSize:'12px',color:'var(--text-muted)',textTransform:'capitalize' }}>{m.category.replace('-',' ')}</div>
                </div>
                <div style={{ display:'flex',gap:'8px',alignItems:'center' }}>
                  <span style={{ fontWeight:'800',color:m.score>=5?'#f39c12':'var(--primary)',fontSize:'15px' }}>{m.score || 0}/5</span>
                  <span className="badge" style={{ background: m.score>=5?'#fff8e1':'var(--primary-pale)', color:m.score>=5?'#f39c12':'var(--primary)' }}>
                    {m.score >= 5 ? 'Distinction' : 'Pass'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact / booking */}
      <div className="premium-card" style={{ padding:'22px 26px',borderLeft:'5px solid var(--primary)' }}>
        <h3 style={{ color:'var(--primary)',fontSize:'15px',fontWeight:'700',marginBottom:'14px' }}>Book Support or Office Hours</h3>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px' }}>
          {[
            { label:'Agnes Berko \u2014 Founder', slots:'Tue, Fri, Sat \u2014 2:00\u20133:00 PM Ghana Time', action:'mailto:a.berko1@alustudent.com', btnLabel:'Email to Book', color:'var(--primary)' },
            { label:'Weekly General Meeting', slots:'Every Saturday \u2014 4:00 PM Ghana Time', action:'https://meet.google.com/bii-jzew-udd', btnLabel:'Join Google Meet', color:'#e67e22' },
          ].map((item,i) => (
            <div key={i} style={{ background:'var(--bg-main)',padding:'16px',borderRadius:'10px',border:`1px solid ${item.color}30` }}>
              <div style={{ fontWeight:'700',color:item.color,fontSize:'14px',marginBottom:'4px' }}>{item.label}</div>
              <div style={{ fontSize:'12px',color:'var(--text-muted)',marginBottom:'12px' }}>{item.slots}</div>
              <a href={item.action} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-block',padding:'8px 16px',background:item.color,color:'#fff',borderRadius:'8px',fontSize:'13px',fontWeight:'700',textDecoration:'none' }}>
                {item.btnLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUS SURVEY PAGE
   ========================================================= */
function SUSPage({ lang }) {
  void lang;
  const questions = [
    'I think that I would like to use this platform frequently.',
    'I found the platform unnecessarily complex.',
    'I thought the platform was easy to use.',
    'I think that I would need the support of a technical person to be able to use this platform.',
    'I found the various modules and features in this platform were well integrated.',
    'I thought there was too much inconsistency in this platform.',
    'I would imagine that most people would learn to use this platform very quickly.',
    'I found the platform very awkward to use.',
    'I felt very confident using the platform.',
    'I needed to learn a lot of things before I could get going with this platform.',
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [name, setName] = useState('');
  const [cohort, setCohort] = useState('');

  const setAnswer = (qi, val) => setAnswers(prev => ({ ...prev, [qi]: val }));
  const allAnswered = Object.keys(answers).length === questions.length;

  const submit = () => {
    // SUS scoring formula
    let total = 0;
    questions.forEach((q, i) => {
      const val = parseInt(answers[i]) || 1;
      // Odd-numbered (1-indexed): score - 1; Even-numbered: 5 - score
      if (i % 2 === 0) total += (val - 1);
      else total += (5 - val);
    });
    const susScore = total * 2.5;
    setScore(Math.round(susScore));
    setSubmitted(true);
    // Save to localStorage for admin review
    const prev = JSON.parse(localStorage.getItem('pog_sus_responses') || '[]');
    prev.push({ name: name || 'Anonymous', cohort, answers, score: Math.round(susScore), date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('pog_sus_responses', JSON.stringify(prev));
  };

  const grade = score !== null ? (score >= 90 ? { label:'Excellent (A)', color:'#1e5a2c' } : score >= 80 ? { label:'Good (B)', color:'#2d7a2d' } : score >= 70 ? { label:'OK (C)', color:'#e67e22' } : score >= 51 ? { label:'Poor (D)', color:'#c0392b' } : { label:'Unacceptable (F)', color:'#7e2a2a' }) : null;

  return (
    <div className="animate-fade-in" style={{ maxWidth:'820px',margin:'0 auto' }}>
      <div className="page-header">
        <h2>Usability Survey</h2>
        <p>System Usability Scale (SUS) \u2014 takes about 2 minutes to complete</p>
      </div>

      {!submitted ? (
        <div className="premium-card" style={{ padding:'clamp(22px,4vw,36px)' }}>
          <div className="alert-info" style={{ marginBottom:'24px' }}>
            <strong>Instructions:</strong> Please rate each statement from <strong>1 (Strongly Disagree)</strong> to <strong>5 (Strongly Agree)</strong> based on your experience using the Pool of Grace platform. There are no right or wrong answers \u2014 we just want your honest opinion.
          </div>

          {/* Optional info */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',marginBottom:'28px' }}>
            <div>
              <label style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',display:'block',marginBottom:'5px' }}>Your Name (optional)</label>
              <input className="premium-input" style={{ marginBottom:0 }} placeholder="e.g. Akosua" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:'13px',fontWeight:'700',color:'var(--text-main)',display:'block',marginBottom:'5px' }}>Cohort / Location (optional)</label>
              <input className="premium-input" style={{ marginBottom:0 }} placeholder="e.g. June 2026 \u2014 Kumasi" value={cohort} onChange={e=>setCohort(e.target.value)} />
            </div>
          </div>

          {/* Questions */}
          <div style={{ display:'flex',flexDirection:'column',gap:'22px',marginBottom:'28px' }}>
            {questions.map((q, qi) => (
              <div key={qi} style={{ padding:'18px 20px',background:'var(--bg-main)',borderRadius:'12px',border:'1px solid var(--primary-pale)' }}>
                <p style={{ fontWeight:'700',color:'var(--text-main)',fontSize:'14px',marginBottom:'14px',lineHeight:'1.55' }}>
                  <span style={{ color:'var(--primary)',fontWeight:'800' }}>Q{qi+1}. </span>{q}
                </p>
                <div style={{ display:'flex',justifyContent:'space-between',gap:'6px',flexWrap:'wrap' }}>
                  {[1,2,3,4,5].map(val => (
                    <label key={val} style={{
                      display:'flex',flexDirection:'column',alignItems:'center',gap:'5px',cursor:'pointer',
                      padding:'8px 10px',borderRadius:'8px',minWidth:'48px',flex:1,
                      background: answers[qi]===val ? 'var(--primary)' : '#fff',
                      border: `2px solid ${answers[qi]===val ? 'var(--primary)' : 'var(--primary-pale)'}`,
                      transition:'all 0.15s'
                    }}>
                      <input type="radio" name={`q${qi}`} value={val} checked={answers[qi]===val} onChange={()=>setAnswer(qi,val)} style={{ display:'none' }} />
                      <span style={{ fontWeight:'800',fontSize:'16px',color:answers[qi]===val?'#fff':'var(--primary)' }}>{val}</span>
                      <span style={{ fontSize:'9px',color:answers[qi]===val?'rgba(255,255,255,0.8)':'var(--text-muted)',textAlign:'center',lineHeight:'1.2' }}>
                        {val===1?'Strongly\nDisagree':val===5?'Strongly\nAgree':''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px' }}>
            <p style={{ fontSize:'13px',color:'var(--text-muted)' }}>{Object.keys(answers).length}/{questions.length} questions answered</p>
            <button className="btn-primary" onClick={submit} disabled={!allAnswered} style={{ minWidth:'160px' }}>
              Submit Survey
            </button>
          </div>
        </div>
      ) : (
        <div className="premium-card" style={{ padding:'clamp(22px,4vw,36px)',textAlign:'center' }}>
          <div style={{ width:'90px',height:'90px',borderRadius:'50%',background:grade.color,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',color:'#fff',fontSize:'28px',fontWeight:'900' }}>
            {score}
          </div>
          <h3 style={{ color:grade.color,fontSize:'clamp(20px,3vw,26px)',fontWeight:'800',marginBottom:'8px' }}>SUS Score: {score}/100</h3>
          <div className="badge" style={{ background:`${grade.color}18`,color:grade.color,fontSize:'15px',padding:'8px 20px',marginBottom:'22px',display:'inline-block' }}>{grade.label}</div>
          <p style={{ color:'var(--text-muted)',fontSize:'14px',maxWidth:'500px',margin:'0 auto 24px',lineHeight:'1.7' }}>
            Thank you so much for completing the survey! Your feedback has been saved and will be used to improve the Pool of Grace platform for all participants. Agnes Berko will review your responses.
          </p>
          <div className="alert-info" style={{ textAlign:'left',maxWidth:'500px',margin:'0 auto' }}>
            <strong>SUS Score Guide:</strong><br/>
            90\u2013100 = Excellent | 80\u201389 = Good | 70\u201379 = OK | 51\u201369 = Poor | Below 51 = Unacceptable
          </div>
          <button className="btn-outline" style={{ marginTop:'22px' }} onClick={()=>{ setAnswers({}); setSubmitted(false); setScore(null); setName(''); setCohort(''); }}>
            Submit Another Response
          </button>
        </div>
      )}
    </div>
  );
}