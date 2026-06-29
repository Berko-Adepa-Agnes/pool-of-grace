import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Code: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  Share: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Timer: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Pause: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  ),
  Reset: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
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
  const [toast, setToast]                 = useState(null);
  const [darkMode, setDarkMode]           = useState(false);
  const [isOnline, setIsOnline]           = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply dark mode to root CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.style.setProperty('--bg-main',   '#121c12');
      root.style.setProperty('--card-bg',   '#1a2a1a');
      root.style.setProperty('--text-main', '#e8f5e8');
      root.style.setProperty('--text-muted','#8faa8f');
      root.style.setProperty('--primary-pale','rgba(45,122,45,0.18)');
    } else {
      root.style.setProperty('--bg-main',   '#f6fbf6');
      root.style.setProperty('--card-bg',   '#ffffff');
      root.style.setProperty('--text-main', '#2b3a2b');
      root.style.setProperty('--text-muted','#627262');
      root.style.setProperty('--primary-pale','hsl(120, 40%, 95%)');
    }
  }, [darkMode]);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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
    { key: 'practiceLab',   label: 'Practice Lab',              icon: <Icons.Code /> },
    { key: 'achievements',  label: 'Achievements',              icon: <Icons.Trophy /> },
    { key: 'schedule',      label: 'Mentorship',                icon: <Icons.Mentorship /> },
    { key: 'forum',         label: 'Community',                 icon: <Icons.Forum /> },
    { key: 'career',        label: 'Career Board',              icon: <Icons.Career /> },
    { key: 'grades',        label: 'Grades',                    icon: <Icons.Grades /> },
    { key: 'certificates',  label: 'Certificates',              icon: <Icons.Grades /> },
    { key: 'cvBuilder',     label: 'CV Builder',                icon: <Icons.Career /> },
    { key: 'discover',      label: 'Share & Grow',              icon: <Icons.Share /> },
    { key: 'recordings',    label: 'Recordings',                icon: <Icons.Video2 /> },
    { key: 'announcements', label: 'Announcements',             icon: <Icons.Inbox /> },
    { key: 'calendar',      label: 'Calendar',                  icon: <Icons.Calendar /> },
    { key: 'inbox',         label: unreadCount > 0 ? `Inbox (${unreadCount})` : 'Inbox', icon: <Icons.Inbox /> },
    { key: 'history',       label: 'History',                   icon: <Icons.History /> },
    { key: 'profile',       label: 'My Profile',                icon: <Icons.Dashboard /> },
    { key: 'survey',        label: 'Usability Survey',          icon: <Icons.Admin /> },
    { key: 'consent',       label: 'Consent Form',              icon: <Icons.Admin /> },
    { key: 'privacy',       label: 'Privacy and Ethics',        icon: <Icons.Admin /> },
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
        <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', flexShrink: 0 }}>
          <div className="sidebar-text" style={{ padding: '0 6px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
            {user && user.firstName} — {user && user.role === 'admin' ? 'Admin' : 'Participant'}
          </div>
          {/* Dark mode toggle */}
          <button onClick={()=>setDarkMode(d=>!d)}
            style={{
              display:'flex',alignItems:'center',gap:'8px',width:'100%',
              padding:'9px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',
              color:'#ccc',borderRadius:'9px',cursor:'pointer',fontSize:'13px',
              fontFamily:'inherit',fontWeight:'600',marginBottom:'8px'
            }}
          >
            <span style={{fontSize:'15px'}}>{darkMode ? 'L' : 'D'}</span>
            <span className="sidebar-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          {/* Online/Offline Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isOnline ? 'var(--primary-pale)' : '#fff0f0', border: `1px solid ${isOnline ? 'var(--primary-light)' : '#ffccd0'}`, padding: '6px 14px', borderRadius: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? 'var(--primary-light)' : '#e74c3c', display: 'inline-block' }}></span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: isOnline ? 'var(--primary)' : '#c0392b' }}>
              {isOnline ? 'Online Mode' : 'Offline Mode'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mobile-only controls */}
            <div className="mobile-only-controls">
              <button onClick={()=>setDarkMode(d=>!d)}
                style={{
                  padding:'6px 12px',background:'rgba(0,0,0,0.06)',border:'1px solid rgba(0,0,0,0.1)',
                  borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontFamily:'inherit',fontWeight:'600',
                  color:'var(--text-muted)'
                }}
              >
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button onClick={logout}
                style={{
                  padding:'6px 12px',background:'transparent',border:'1px solid rgba(255,80,80,0.4)',
                  borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontFamily:'inherit',fontWeight:'600',
                  color:'#ff5555'
                }}
              >
                Logout
              </button>
            </div>
            <LanguageToggle />
          </div>
        </header>
        {children}
      </main>
    </div>
  );

  /* ---- Router ---- */
  if (page === 'home')         return <Home go={setPage} lang={lang} LanguageToggle={LanguageToggle} />;
  if (page === 'register')     return <Register go={setPage} login={login} lang={lang} LanguageToggle={LanguageToggle} />;
  if (page === 'login')        return <Login go={setPage} login={login} lang={lang} LanguageToggle={LanguageToggle} />;
  if (page === 'forgot')       return <ForgotPassword go={setPage} lang={lang} />;
  if (page === 'onboarding')   return <Onboarding user={user} completeOnboarding={completeOnboardingData} lang={lang} />;
  if (page === 'selfWorthIntro') return <SelfWorthIntro user={user} go={setPage} lang={lang} />;
  if (page === 'consent')      return <AuthenticatedPortal><ConsentFormPage lang={lang} /></AuthenticatedPortal>;

  const ToastBar = () => toast ? (
    <div style={{
      position:'fixed',bottom:'24px',right:'24px',zIndex:9999,
      background: toast.type==='error'?'#c0392b': toast.type==='info'?'var(--primary)':'#1e5a2c',
      color:'#fff',padding:'14px 22px',borderRadius:'14px',
      fontSize:'14px',fontWeight:'600',boxShadow:'0 8px 28px rgba(0,0,0,0.22)',
      maxWidth:'320px',lineHeight:'1.5',
      animation:'fadeInUp 0.35s ease both'
    }}>
      {toast.msg}
    </div>
  ) : null;


  if (page === 'dashboard')     return <><ToastBar/><AuthenticatedPortal><Dashboard user={user} go={setPage} completionsCount={completionsCount} sessionsCount={sessionsCount} lang={lang} /></AuthenticatedPortal></>;
  if (page === 'modules')       return <><ToastBar/><AuthenticatedPortal><ModulesList openModule={openModule} lang={lang} modules={modules} /></AuthenticatedPortal></>;
  if (page === 'moduleView')    return <><ToastBar/><AuthenticatedPortal><ModuleView module={selectedModule} go={setPage} lang={lang} onQuizPassed={fetchStats} modules={modules} openModule={openModule} showToast={showToast} isOnline={isOnline} /></AuthenticatedPortal></>;
  if (page === 'schedule')      return <><ToastBar/><AuthenticatedPortal><Schedule go={setPage} lang={lang} onBooked={()=>{ fetchStats(); showToast('Session booked! Check your inbox for details.'); }} /></AuthenticatedPortal></>;
  if (page === 'forum')         return <><ToastBar/><AuthenticatedPortal><Forum lang={lang} /></AuthenticatedPortal></>;
  if (page === 'career')        return <AuthenticatedPortal><CareerResources lang={lang} /></AuthenticatedPortal>;
  if (page === 'grades')        return <AuthenticatedPortal><Grades modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'certificates')  return <AuthenticatedPortal><CertificatePage user={user} modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'cvBuilder')     return <AuthenticatedPortal><CVBuilder user={user} modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'practiceLab')   return <><ToastBar/><AuthenticatedPortal><PracticeLab lang={lang} modules={modules} showToast={showToast} /></AuthenticatedPortal></>;
  if (page === 'achievements')  return <AuthenticatedPortal><AchievementsPage user={user} modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'discover')      return <AuthenticatedPortal><DiscoverPage lang={lang} go={setPage} /></AuthenticatedPortal>;
  if (page === 'recordings')    return <AuthenticatedPortal><RecordingsPage lang={lang} user={user} /></AuthenticatedPortal>;
  if (page === 'announcements') return <AuthenticatedPortal><AnnouncementsPage lang={lang} user={user} /></AuthenticatedPortal>;
  if (page === 'calendar')      return <AuthenticatedPortal><CalendarPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'inbox')         return <AuthenticatedPortal><Inbox messages={inboxMessages} lang={lang} /></AuthenticatedPortal>;
  if (page === 'history')       return <AuthenticatedPortal><History modules={modules} lang={lang} /></AuthenticatedPortal>;
  if (page === 'privacy')       return <AuthenticatedPortal><PrivacyPage lang={lang} /></AuthenticatedPortal>;
  if (page === 'profile')       return <AuthenticatedPortal><ProfilePage user={user} lang={lang} modules={modules} /></AuthenticatedPortal>;
  if (page === 'survey')        return <><ToastBar/><AuthenticatedPortal><SUSPage lang={lang} showToast={showToast} /></AuthenticatedPortal></>;
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
      <footer style={{ background:'#0a150a',padding:'clamp(40px,6vw,64px) clamp(20px,5vw,60px) 24px',color:'rgba(255,255,255,0.65)' }}>
        <div style={{ maxWidth:'1080px',margin:'0 auto' }}>

          {/* Top row */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'36px',marginBottom:'44px' }}>

            {/* Brand column */}
            <div>
              <h3 style={{ color:'#fff',fontWeight:'800',fontSize:'20px',marginBottom:'10px' }}>Pool of Grace</h3>
              <p style={{ fontSize:'14px',lineHeight:'1.8',marginBottom:'16px' }}>Empowering young women in Ghana through structured technology education, mentorship, and community support.</p>
              <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
                <a href="mailto:a.berko1@alustudent.com" style={{ background:'var(--primary)',color:'#fff',padding:'7px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',textDecoration:'none' }}>Email Us</a>
                <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer" style={{ background:'rgba(255,255,255,0.12)',color:'#fff',padding:'7px 16px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',textDecoration:'none' }}>Join Meeting</a>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 style={{ color:'#fff',fontWeight:'700',fontSize:'14px',marginBottom:'14px',textTransform:'uppercase',letterSpacing:'1px' }}>Platform</h4>
              {['Learning Modules','Mentorship Booking','Community Forum','Career Resources','Usability Survey'].map((link,i)=>(
                <div key={i} style={{ marginBottom:'9px' }}>
                  <span style={{ fontSize:'13px',color:'rgba(255,255,255,0.65)',cursor:'pointer' }}>{link}</span>
                </div>
              ))}
            </div>

            {/* Office hours */}
            <div>
              <h4 style={{ color:'#fff',fontWeight:'700',fontSize:'14px',marginBottom:'14px',textTransform:'uppercase',letterSpacing:'1px' }}>Office Hours</h4>
              {[
                ['Agnes Berko', 'Tue, Fri, Sat — 2:00–3:00 PM'],
                ['Weekly Meeting', 'Every Saturday — 4:00 PM'],
                ['Location', 'Kumasi and Accra, Ghana'],
                ['Email', 'a.berko1@alustudent.com'],
              ].map(([label,val],i)=>(
                <div key={i} style={{ marginBottom:'9px' }}>
                  <span style={{ fontSize:'12px',fontWeight:'700',color:'rgba(255,255,255,0.45)',display:'block' }}>{label}</span>
                  <span style={{ fontSize:'13px',color:'rgba(255,255,255,0.75)' }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Research / ethics */}
            <div>
              <h4 style={{ color:'#fff',fontWeight:'700',fontSize:'14px',marginBottom:'14px',textTransform:'uppercase',letterSpacing:'1px' }}>Research</h4>
              <div style={{ background:'rgba(255,255,255,0.07)',padding:'14px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.12)',marginBottom:'14px' }}>
                <div style={{ fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px' }}>Institution</div>
                <div style={{ fontSize:'13px',color:'#fff',fontWeight:'600' }}>African Leadership University</div>
                <div style={{ fontSize:'12px',color:'rgba(255,255,255,0.55)',marginTop:'3px' }}>School of Software Engineering</div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.07)',padding:'14px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px' }}>Ethics Approval</div>
                <div style={{ fontSize:'13px',color:'#fff',fontWeight:'600' }}>ALU Research Ethics Committee</div>
                <div style={{ fontSize:'12px',color:'rgba(255,255,255,0.55)',marginTop:'3px' }}>REC Approved — 2026</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:'1px',background:'rgba(255,255,255,0.1)',marginBottom:'22px' }}></div>

          {/* Bottom row */}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px' }}>
            <p style={{ fontSize:'12px',margin:0 }}>Pool of Grace &copy; 2026 — Agnes Adepa Berko — ALU Capstone Project</p>
            <div style={{ display:'flex',gap:'16px' }}>
              <span style={{ fontSize:'12px',cursor:'pointer' }} onClick={()=>go('login')}>Login</span>
              <span style={{ fontSize:'12px',cursor:'pointer' }} onClick={()=>go('register')}>Register</span>
              <span style={{ fontSize:'12px' }}>|</span>
              <span style={{ fontSize:'12px',color:'rgba(255,255,255,0.4)' }}>Ghana Time (GMT+0)</span>
            </div>
          </div>
        </div>
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
          Forgot your password?{' '}
          <span style={{ color:'var(--primary)',fontWeight:'700',cursor:'pointer' }} onClick={()=>go('forgot')}>Reset it here</span>
        </p>
        <p style={{ textAlign:'center',marginTop:'10px',color:'var(--text-muted)',fontSize:'14px' }}>
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

  // Live countdown to next Saturday 4:00 PM GMT
  const getNextSaturday = () => {
    const now = new Date();
    const utcNow = new Date(now.toUTCString());
    const day = utcNow.getDay(); // 0=Sun,6=Sat
    const daysToSat = day === 6 ? (utcNow.getHours() < 16 ? 0 : 7) : (6 - day);
    const sat = new Date(utcNow);
    sat.setDate(sat.getDate() + daysToSat);
    sat.setHours(16, 0, 0, 0);
    return sat;
  };
  const [countdown, setCountdown] = useState({ d:0, h:0, m:0, s:0 });
  React.useEffect(() => {
    const tick = () => {
      const diff = getNextSaturday() - new Date();
      if (diff <= 0) { setCountdown({ d:0, h:0, m:0, s:0 }); return; }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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

      {/* Meeting Banner + Countdown */}
      <div className="banner-strip" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'14px' }}>
        <div>
          <div style={{ fontWeight:'700',fontSize:'15px',marginBottom:'3px' }}>Weekly General Meeting — Every Saturday at 4:00 PM Ghana Time</div>
          <div style={{ color:'rgba(255,255,255,0.82)',fontSize:'13px' }}>Led by Agnes Berko — All participants welcome — Free Google Meet session</div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap' }}>
          {/* Countdown */}
          <div style={{ display:'flex',gap:'8px' }}>
            {[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k,label])=>(
              <div key={k} style={{ textAlign:'center',background:'rgba(255,255,255,0.15)',borderRadius:'8px',padding:'6px 10px',minWidth:'42px' }}>
                <div style={{ fontSize:'18px',fontWeight:'800',lineHeight:1 }}>{String(countdown[k]).padStart(2,'0')}</div>
                <div style={{ fontSize:'9px',fontWeight:'600',color:'rgba(255,255,255,0.7)',textTransform:'uppercase',marginTop:'2px' }}>{label}</div>
              </div>
            ))}
          </div>
          <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer">Join Meeting</a>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom:'32px' }}>
        {[
          { value:completionsCount,       label:t('dashboard.statModulesLbl',lang),  sub:t('dashboard.statModulesSub',lang), color:'var(--primary-light)' },
          { value:`${progressPercent}%`,  label:t('dashboard.statProgressLbl',lang), sub:t('dashboard.statProgressSub',lang), color:'var(--primary-light)' },
          { value:sessionsCount,          label:t('dashboard.statSessionsLbl',lang), sub:t('dashboard.statSessionsSub',lang), color:'var(--primary-light)' },
          { value: (() => { try { return JSON.parse(localStorage.getItem('pog_practice_xp')) || 0; } catch { return 0; } })(), label:'Practice XP', sub:'Code challenges', color:'#f1c40f' },
          { value: (() => { try { return (JSON.parse(localStorage.getItem('pog_practice_streak')) || {}).count || 0; } catch { return 0; } })(), label:'Day Streak', sub:'Keep it going!', color:'#e67e22' },
          { value: (() => { try { return (JSON.parse(localStorage.getItem('pog_practice_completed')) || []).length; } catch { return 0; } })(), label:'Challenges Done', sub:'Practice Lab', color:'#9b59b6' },
        ].map((s,i)=>(
          <div key={i} className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:`4px solid ${s.color}` }}>
            <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:s.color,marginBottom:'4px' }}>{s.value}</div>
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

      {/* Onboarding checklist */}
      {completionsCount === 0 && (
        <div className="premium-card" style={{ padding:'24px',marginBottom:'28px',borderLeft:'5px solid var(--secondary)' }}>
          <h3 style={{ color:'var(--secondary)',fontSize:'16px',fontWeight:'700',marginBottom:'16px' }}>Getting Started Checklist</h3>
          <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
            {[
              { done: true,              label: 'Create your account and log in' },
              { done: completionsCount>0, label: 'Complete your first learning module (Module 1: Self-Worth)' },
              { done: false,              label: 'Book a mentorship session with Agnes or a mentor', action: ()=>go('schedule') },
              { done: false,              label: 'Complete the Usability Survey to help improve the platform', action: ()=>go('survey') },
              { done: false,              label: 'Join the Saturday General Meeting on Google Meet', action: ()=>window.open('https://meet.google.com/bii-jzew-udd','_blank') },
            ].map((item,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'center',gap:'12px',padding:'10px 14px',borderRadius:'9px',background: item.done?'var(--primary-pale)':'var(--bg-main)',cursor:item.action?'pointer':'default' }}
                onClick={item.action}>
                <div style={{ width:'22px',height:'22px',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
                  background:item.done?'var(--primary)':'transparent',border:`2px solid ${item.done?'var(--primary)':'#ccc'}` }}>
                  {item.done && <Icons.Check />}
                </div>
                <span style={{ fontSize:'13px',color:item.done?'var(--primary)':'var(--text-main)',fontWeight:item.done?'600':'400',textDecoration:item.done?'line-through':'none' }}>{item.label}</span>
                {item.action && !item.done && <span style={{ marginLeft:'auto',fontSize:'11px',color:'var(--secondary)',fontWeight:'700' }}>Go</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick action cards */}
      <div className="card-grid-4">
        {[
          { title:t('dashboard.card1Title',lang), desc:t('dashboard.card1Desc',lang), btn:t('dashboard.card1Btn',lang), action:()=>go('modules') },
          { title:'Practice Lab', desc:'Interactive Ghana-contextualized coding challenges with XP, badges, and streaks. Build real skills!', btn:'Start Coding', action:()=>go('practiceLab') },
          { title:'Achievements', desc:'View your trophy room — badges for modules, coding challenges, streaks, and community engagement.', btn:'View Badges', action:()=>go('achievements') },
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
  const [search, setSearch] = useState('');

  const filtered = modules
    .filter(m => filter === 'all' || m.category === filter)
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()) || (m.description||'').toLowerCase().includes(search.toLowerCase()));

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

      {/* Search bar */}
      <div style={{ marginBottom:'16px',position:'relative' }}>
        <input
          className="premium-input"
          style={{ marginBottom:0,paddingLeft:'42px' }}
          placeholder="Search modules by name or topic..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <span style={{ position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontSize:'16px',pointerEvents:'none' }}>S</span>
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
        {(search || filter !== 'all') && (
          <button onClick={()=>{setSearch('');setFilter('all');}} style={{
            padding:'8px 16px',borderRadius:'22px',cursor:'pointer',fontSize:'13px',fontWeight:'600',
            border:'2px solid #ffd0d0',background:'#fff0f0',color:'#c0392b',fontFamily:'inherit'
          }}>Clear</button>
        )}
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
   MODULE VIEW HELPERS
   ========================================================= */
const renderStoryContent = (text) => {
  if (!text) return null;
  const parts = text.split(/(\[STORY\][\s\S]*?\[\/STORY\]|\[LESSON\][\s\S]*?\[\/LESSON\]|\[YOUR_TURN\][\s\S]*?\[\/YOUR_TURN\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[STORY]')) {
      const content = part.replace('[STORY]','').replace('[/STORY]','').trim();
      return <div key={i} className="story-block">{content}</div>;
    } else if (part.startsWith('[LESSON]')) {
      const content = part.replace('[LESSON]','').replace('[/LESSON]','').trim();
      return <div key={i} className="lesson-callout"><div className="lesson-callout-title">{"Lesson from Ama's Story"}</div><p>{content}</p></div>;
    } else if (part.startsWith('[YOUR_TURN]')) {
      const content = part.replace('[YOUR_TURN]','').replace('[/YOUR_TURN]','').trim();
      return <div key={i} className="your-turn-prompt"><div className="your-turn-title">Your Turn</div><p>{content}</p></div>;
    } else if (part.trim()) {
      return <p key={i}>{part.trim()}</p>;
    }
    return null;
  }).filter(Boolean);
};

const moduleLectureMap = {
  1: [
    { title: 'What is Self-Worth?', body: 'Self-worth is the deep, unshakeable belief that you are valuable simply because you exist. It is not something you earn through grades, marriage, or approval from others — it is your birthright. In Ghana, many young women are socialized to believe their worth is tied to domestic achievement. This lesson helps you recognize that you are intrinsically valuable and fully capable of entering the tech space.' },
    { title: 'Identifying Your Limiting Beliefs', body: 'A limiting belief is a negative thought you accept as a fact. "I am not smart enough for coding," "Tech is for men," or "Girls from my town do not become developers." These are not facts — they are fears planted by socialization. Research shows that these stereotypes are absorbed as early as age 6, but they can be unlearned.' },
    { title: 'The Growth Mindset Shift', body: 'Replace "I cannot do this" with "I cannot do this YET." A growth mindset, pioneered by Carol Dweck, is the belief that abilities are developed through effort and practice rather than fixed at birth. This shift transforms coding from an intimidating test of intelligence into an exciting path of learning.' },
    { title: 'Your Worth Declaration', body: 'Write down: "I am worthy of learning tech. My background does not limit my potential. I will practice daily, make mistakes, and learn step by step." Put this in a place where you will see it every day as your psychological anchor.' }
  ],
  2: [
    { title: 'Understanding Social Stereotypes', body: 'Traditional expectations in Ghana often direct girls toward market trading or housekeeping, presenting tech as a masculine field. This division is not based on ability, but on history. Dismantling this barrier starts with understanding that your brain is just as suited for logic and code as anyone else\'s.' },
    { title: 'Setting Constructive Boundaries', body: 'When family or friends say computers are "too hard" or "not for women," answer with respect but firmness. Acknowledge their concern, state your goals, show them data about tech careers in Accra/Kumasi, and ask them to support your effort.' },
    { title: 'Ghanaian Tech Pioneers', body: 'Draw inspiration from pioneers: Ethel Cofie (Founder of Women in Tech Africa), Farida Bedwei (pioneering Software Engineer who built banking systems while managing cerebral palsy), and Regina Honu (founder of Soronko Academy). They proved that Ghanaian women can lead the global tech space.' },
    { title: 'Leveraging Cultural Strengths', body: 'Ghanaian culture values community and sharing. In tech, this translates to "developer communities" where developers collaborate, share code, and review each other\'s work. You are already culturally equipped to be an amazing team player.' }
  ],
  3: [
    { title: 'What is Self-Efficacy?', body: 'Self-efficacy is the specific belief that you can succeed at a particular task (like writing a function or styling a button). Unlike general self-esteem, self-efficacy is a skill you can build step-by-step through practice, regardless of your past experiences.' },
    { title: 'The Four Sources of Confidence', body: 'Psychologist Albert Bandura identified four sources: Mastery Experiences (getting code to run), Vicarious Learning (seeing other girls code), Social Persuasion (mentor encouragement), and Emotional States (interpreting code anxiety as excitement to learn).' },
    { title: 'The Power of Small Wins', body: 'Do not try to build a huge app on day one. Start by writing one paragraph tag. When it works, celebrate! Then add a bold tag. By breaking complex tasks into tiny, manageable steps, you stack "mastery experiences" and build massive confidence.' },
    { title: 'Managing Coding Stress', body: 'When your screen is full of red error messages, your heart rate might spike. Reframe this reaction: the computer is not shouting at you; it is giving you a map of exactly what to fix. Read the error out loud to engage your logical brain.' }
  ],
  4: [
    { title: 'Embracing Mistakes as the Method', body: 'In tech, failure is the core way we learn. Professional programmers write broken code every single day. If your code runs perfectly on the first try, you probably did not learn anything new. Bugs are expected and normal.' },
    { title: 'Reading Error Messages', body: 'Error messages are diagnostic tools. Look at the line number, search for the error code, and check for simple typos. The computer is giving you hints on where the issue is. Treat debugging like solving a fun riddle.' },
    { title: 'Overcoming Perfectionism', body: 'Many women feel pressure to code perfectly due to "stereotype threat" (the fear of confirming negative gender stereotypes). Let go of perfectionism. The fastest developers are those who write messy drafts, break them, and fix them.' },
    { title: 'Ghanaian Developer Resilience', body: 'dumsor (power outages), expensive mobile data, and slow internet are real challenges. Build resilience by saving your work constantly, downloading notes for offline reading, and studying during stable hours.' }
  ],
  5: [
    { title: 'Defining Your Tech Vision', body: 'Why are you learning to code? Is it to build websites for local businesses, analyze agricultural data, create mobile apps, or support your family? Clear vision keeps you motivated when the lessons get difficult.' },
    { title: 'Writing SMART Learning Goals', body: 'Instead of "I will learn JavaScript," set SMART goals: "I will spend 30 minutes every Monday and Wednesday coding JavaScript functions." This keeps goals specific, measurable, and highly realistic.' },
    { title: 'Creating Your Study Routine', body: 'Create a dedicated block of time for study. Let your household know that during this time, you are in the "focus room." Even 30 minutes of uninterrupted study is better than 2 hours of distracted reading.' },
    { title: 'Tracking Your Milestones', body: 'Keep a simple physical notebook or digital doc where you tick off every module completed. Seeing your progress visually builds momentum and acts as a shield against imposter syndrome.' }
  ],
  6: [
    { title: 'Why Tech is Collaborative', body: 'The image of the lone coder in a dark room is a myth. Modern software is built by teams using collaboration tools. Being able to explain your code, listen to ideas, and help others is just as important as writing logic.' },
    { title: 'Forming Study Circles', body: 'Connect with 2-3 other learners in this cohort. Create a WhatsApp or Telegram group to share questions. If you get stuck on a bug for more than 20 minutes, post a screenshot in your circle. Peer learning is extremely fast.' },
    { title: 'Giving and Receiving Feedback', body: 'When reviewing peer projects, be encouraging and specific. Instead of "Nice page," say "I love the color contrast, and your buttons are clear. Maybe check the margin on the text." Welcome suggestions on your own work as growth.' },
    { title: 'Engaging with Your Mentors', body: 'Mentors are here to guide you, not just give you answers. When asking a mentor for help: show the error, explain what you expected to happen, and list what you have already tried. This shows initiative and helps them guide you.' }
  ],
  7: [
    { title: 'The Dopamine of Celebration', body: 'When you finish a major goal, your brain needs recognition to cement the learning. Celebrating releases dopamine, which makes your brain want to learn more. Never skip celebrating your hard-won milestones.' },
    { title: 'Keeping a Win Log', body: 'Write down every breakthrough you make. "Fixed a tricky div layout," "Successfully declared my first list," "Understood how a loop works." Review this log whenever you feel stuck or discouraged.' },
    { title: 'Designing Healthy Rewards', body: 'Establish simple, healthy rewards for completing modules. It could be enjoying a cup of Sobolo, calling a friend, or taking a walk. Tie these rewards directly to completing your goals.' },
    { title: 'Reviewing Your Foundational Growth', body: 'Reflect on how much your mindset has changed since Module 1. You have built self-worth, identified limiting beliefs, and learned to handle failures. You are now mentally ready for technical coding.' }
  ],
  8: [
    { title: 'HTML: The Skeleton of the Web', body: 'HTML (HyperText Markup Language) uses "tags" to tell the browser what content is. Think of tags as labels: `<h1>` for main titles, `<p>` for paragraphs, and `<a>` for links. Every website begins as an HTML skeleton.' },
    { title: 'CSS: The Style and Colors', body: 'CSS (Cascading Style Sheets) turns a plain HTML skeleton into a beautiful page. You use CSS to change fonts, apply colors, add margins, and structure layouts. It is the creative design layer of the web.' },
    { title: 'The Box Model Concept', body: 'In CSS, everything is a box. Every element has Content, Padding (space inside the border), Border (the outline), and Margin (space outside the border). Mastering the box model is the secret to perfect layouts.' },
    { title: 'Writing Your First Page Code', body: 'Open a text editor. Write `<html>`, add a `<body>`, place a heading and a paragraph, then save the file as `index.html`. Open it in your browser to see your first webpage come to life offline.' }
  ],
  9: [
    { title: 'JavaScript: The Engine of Action', body: 'If HTML is the skeleton and CSS is the clothing, JavaScript is the muscles and brain. It makes your page interactive — responding to clicks, showing animations, calculating numbers, and validating form data.' },
    { title: 'Variables and Data Types', body: 'Variables are containers for storing information. Think of them like labeled boxes at a market stall. You can store numbers, text ("strings"), lists of items ("arrays"), or yes/no values ("booleans").' },
    { title: 'Control Flow (If/Else Conditions)', body: 'Control flow allows your program to make decisions. "IF the user score is 3 or more, THEN show the pass screen, ELSE show the try-again screen." This logic makes your application dynamic.' },
    { title: 'Functions: The Reusable Recipes', body: 'A function is a block of code designed to perform a particular task. Think of it like a recipe for Jollof rice: you define the steps once, and you can run ("call") it whenever you need to prepare the dish.' }
  ],
  10: [
    { title: 'Structuring a Web Project', body: 'A clean web project has three main files: `index.html` (structure), `style.css` (design), and `script.js` (logic). Link them together in your HTML file so they load as one functional application.' },
    { title: 'Making it Responsive', body: 'Use CSS media queries to ensure your website looks stunning on small phone screens, tablets, and large laptops. Set widths using percentages or flexbox instead of fixed pixels.' },
    { title: 'DOM Manipulation Basics', body: 'The Document Object Model (DOM) is the tree of HTML elements that JavaScript can interact with. You can select elements using JS, change their text, modify their CSS styles, or listen for user clicks.' },
    { title: 'Testing and Running Locally', body: 'Run your project locally in your web browser. Right-click the page, select "Inspect", and open the Console. This is where you can see JavaScript outputs, debug errors, and test changes instantly offline.' }
  ],
  11: [
    { title: 'Introduction to Python', body: 'Python is a highly readable programming language used for web development, data analysis, and artificial intelligence. Its clean syntax reads almost like English, making it perfect for beginners.' },
    { title: 'Lists, Dictionaries, and Tuples', body: 'Python has powerful built-in structures to store data. Lists store ordered sequences (e.g., shopping list). Dictionaries store key-value pairs (e.g., student name and their score). Tuples store fixed records.' },
    { title: 'Writing Loops and Iteration', body: 'Loops let you repeat a block of code. A `for` loop goes through a list one item at a time (e.g., printing every name). A `while` loop runs as long as a condition is true (e.g., checking user input).' },
    { title: 'Creating Python Functions', body: 'Define functions using the `def` keyword. Pass inputs ("parameters") into the function, process them, and output results using `return`. Python functions are clean, indentation-scoped, and highly reusable.' }
  ],
  12: [
    { title: 'What is a Relational Database?', body: 'Databases store app data in structured tables (like digital spreadsheets) containing rows and columns. Relational databases connect tables together using matching IDs (Primary and Foreign Keys).' },
    { title: 'SQL: The Language of Queries', body: 'SQL (Structured Query Language) is how we talk to databases. We use SQL commands to fetch data (SELECT), add new records (INSERT), update existing data (UPDATE), and remove records (DELETE).' },
    { title: 'Filtering and Sorting Results', body: 'Refine database queries using the `WHERE` clause to filter data (e.g., users from Kumasi) and `ORDER BY` to sort results (e.g., highest score first). This lets you extract exactly what you need.' },
    { title: 'Joining Multiple Tables', body: 'Use `JOIN` statements to link rows from two or more tables based on a related column. This allows you to combine user information with their corresponding test scores in one clean report.' }
  ],
  13: [
    { title: 'Full Stack Architecture', body: 'A full-stack application has three layers: the Frontend (HTML/CSS/React that users see), the Backend (Express/Python server that processes logic), and the Database (SQL/PostgreSQL that stores data).' },
    { title: 'What is an API?', body: 'An Application Programming Interface (API) is the bridge between frontend and backend. It transmits data back and forth using standard requests (GET to fetch data, POST to save data) in JSON format.' },
    { title: 'Setting up an Express Server', body: 'Express is a minimal web framework for Node.js. It listens on a specific network port (e.g., 5000), accepts incoming API requests, runs backend logic, and returns the appropriate data to the user.' },
    { title: 'Connecting Frontend and Backend', body: 'Use JavaScript\'s `fetch()` function in the frontend to request data from your Express backend routes. Learn to display this fetched data dynamically inside your React application.' }
  ],
  14: [
    { title: 'What is Version Control?', body: 'Version control tracks changes made to files over time. It lets you save snapshots of your codebase, experiment with new features safely in branches, and easily roll back to previous versions if code breaks.' },
    { title: 'Git Basics: Add, Commit, Push', body: 'Git is the tool that tracks local files. `git add` selects files to save. `git commit` takes a snapshot with a descriptive message. `git push` uploads your local commits to a remote server like GitHub.' },
    { title: 'Collaborating with Branches', body: 'Branches let multiple developers work on different features of the same project simultaneously. When a feature is finished, you merge the branch back into the main codebase without disturbing other team members.' },
    { title: 'Building Your GitHub Profile', body: 'GitHub is the Facebook of developers. Create a clean profile, write a friendly README about yourself, and display your repositories. Employers will look at your GitHub profile to assess your practical coding skills.' }
  ],
  15: [
    { title: 'Ghana\'s Tech Ecosystem', body: 'Ghana\'s tech space is growing rapidly. Learn about major tech hubs like Meltwater Entrepreneurial School of Technology (MEST), Soronko Academy, and companies hiring tech talent like Hubtel, Zeepay, and mPharma.' },
    { title: 'Key Roles in the Tech Market', body: 'Explore different career paths: Frontend Developer (building interfaces), Backend Developer (managing servers), QA Engineer (testing software), UI/UX Designer, and Technical Support Specialist.' },
    { title: 'Average Junior Developer Salaries', body: 'Junior developers in Ghana can expect entry-level salaries ranging from 2,000 GHS to 5,000 GHS per month depending on the company size. Foreign remote jobs or specialized roles can pay significantly more.' },
    { title: 'Continuous Upskilling Strategy', body: 'Tech changes quickly. Successful developers dedicate at least 3-5 hours a week to learning new frameworks, reading technical blogs, and building personal side projects to stay competitive in the job market.' }
  ],
  16: [
    { title: 'Crafting a Modern Tech CV', body: 'Traditional CVs focus on degrees; tech CVs focus on what you can build. Highlight your projects, list your technical skills (HTML, CSS, Git), and link directly to your GitHub profile and live websites.' },
    { title: 'Creating a Portfolio Website', body: 'A developer portfolio is a personal website showcasing your skills. It should include an "About Me" section, a list of projects with screenshots and links, your contact info, and a download link for your CV.' },
    { title: 'Choosing Your Project Showcase', body: 'Quality over quantity. Showcase 2-3 solid, clean projects that work perfectly. Make sure they are well-documented on GitHub, showing that you can write clean code and explain your work clearly.' },
    { title: 'Writing Compelling Project Readmes', body: 'Every repository needs a `README.md`. Explain what problem the project solves, what technologies you used to build it, how to install and run it locally, and what features you plan to add next.' }
  ],
  17: [
    { title: 'Behavioral Interviews: STAR Method', body: 'Prepare for soft-skill questions using the STAR framework: Situation, Task, Action you took, and Result achieved. For example, explain how you resolved a bug or managed a study project under pressure.' },
    { title: 'Tackling the Technical Interview', body: 'Technical tests assess your coding logic. Practice explaining your thinking out loud as you write code. Interviewers want to see how you solve problems, not just if you get the perfect syntax.' },
    { title: 'System Design Basics', body: 'For junior roles, understand the basics of app design: how database tables link, how frontend calls backend APIs, and how user authentication works. Be ready to sketch a simple architecture.' },
    { title: 'Asking Insightful Questions', body: 'At the end of the interview, ask questions that show enthusiasm: "What tech stack does the team use?", "What does a typical day look like here?", or "How does the company support junior developers?"' }
  ],
  18: [
    { title: 'Optimizing Your LinkedIn Profile', body: 'LinkedIn is a powerful job search tool. Write a professional headline (e.g., "Junior Frontend Developer | React | HTML/CSS"), add a friendly photo, and write a summary about your tech journey and projects.' },
    { title: 'Connecting with Ghana\'s Tech Scene', body: 'Join local developer groups like DevCongress Ghana, attend tech meetups, and participate in hackathons. Networking helps you hear about job openings before they are publicly advertised.' },
    { title: 'Sharing Your Learning in Public', body: 'Post regular updates on LinkedIn or Twitter about what you are building. "Just finished styling my first responsive nav menu!" or "Fixed a stubborn database query today." This builds your professional brand.' },
    { title: 'Drafting Professional Messages', body: 'When reaching out to recruiters or mentors, write brief, polite messages: state who you are, what you admire about their work, and ask a specific, low-commitment question about the industry.' }
  ],
  19: [
    { title: 'Freelancing vs. Full-Time Jobs', body: 'Freelancing lets you work on short-term projects for multiple clients, offering flexibility and diverse experience. Full-time jobs offer steady income, benefits, and structured team learning.' },
    { title: 'Navigating Upwork and Fiverr', body: 'Freelancing platforms allow you to bid on global projects. Create a detailed profile, start with competitive rates to gain positive reviews, and submit personalized proposals that address client problems directly.' },
    { title: 'Finding Local Clients in Ghana', body: 'Look around your community. Small businesses, local clinics, private schools, and restaurants often need websites or simple digital tools. Offer to build their digital presence at affordable rates.' },
    { title: 'Setting Up Contracts and MoMo Payments', body: 'Always agree on the scope of work and payment terms in writing before coding. Use milestones (e.g., 30% upfront, 40% halfway, 30% on completion) and accept payments easily via Mobile Money (MoMo) or bank transfer.' }
  ],
  20: [
    { title: 'The Marathon of Continuous Learning', body: 'Completing these modules is just the beginning. The tech landscape constantly evolves. Develop a habit of reading documentation, exploring new libraries, and coding a little bit every single week.' },
    { title: 'Becoming an Alumna Mentor', body: 'Help the next cohort of Pool of Grace. Answer peer questions on the community forum, share your career progress, and offer encouragement. Teaching others is the ultimate way to reinforce your own skills.' },
    { title: 'Making Open Source Contributions', body: 'Find beginner-friendly repositories on GitHub with "good first issue" labels. Contributing to documentation or fixing minor bugs in open source projects builds confidence and shows collaboration skills.' },
    { title: 'Your Next Development Specialization', body: 'Choose a specific area to master next: deep dive into React for advanced interfaces, study Node.js/Express for backend systems, or learn Data Science with Python. Focus on one track at a time.' }
  ]
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&#]+)/);
    videoId = match ? match[1] : '';
  } else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    videoId = parts[1] ? parts[1].split(/[?&]/)[0] : '';
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
};

const canEmbed = (url) => {
  return url && (url.includes('youtube.com/watch') || url.includes('youtu.be/'));
};

/* =========================================================
   MODULE VIEW  (Canvas-style tabs)
   ========================================================= */
function ModuleView({ module, go, lang, onQuizPassed, modules, openModule, showToast, isOnline }) {

  const [activeTab, setActiveTab] = useState('notes');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [answers, setAnswers]     = useState({});
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showExternalVideos, setShowExternalVideos] = useState(false);

  // Study Timer (Pomodoro)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            if (!isBreak) {
              setIsBreak(true);
              setTimerSeconds(5 * 60);
              if (showToast) showToast('Focus session complete! Take a 5-minute break.');
            } else {
              setIsBreak(false);
              setTimerSeconds(25 * 60);
              if (showToast) showToast('Break over! Ready for another focus session?');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, isBreak, showToast]);

  // Celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const launchCelebration = () => {
    const colors = ['#f1c40f','#e74c3c','#3498db','#2ecc71','#9b59b6','#e67e22','#1abc9c'];
    const pieces = Array.from({length:40}).map((_,i) => ({
      id:i, left:Math.random()*100, color:colors[i%colors.length],
      delay:Math.random()*1.5, duration:2+Math.random()*2,
      shape:Math.random()>0.5?'50%':'0'
    }));
    setConfettiPieces(pieces);
    setShowCelebration(true);
    setTimeout(()=>setShowCelebration(false), 4000);
  };

  useEffect(() => {
    if ('caches' in window && module) {
      const audioUrl = (module.content && module.content.audioUrl) || `/audio/stage_${module.order}.mp3`;
      const pdfUrl = (module.content && module.content.pdfUrl) || `/pdf/stage_${module.order}.pdf`;
      caches.open('pool-of-grace-media-v1').then((cache) => {
        Promise.all([
          cache.match(new Request(audioUrl)),
          cache.match(new Request(pdfUrl))
        ]).then(([audioMatch, pdfMatch]) => {
          if (audioMatch && pdfMatch) {
            setDownloaded(true);
          } else {
            setDownloaded(false);
          }
        });
      });
    }
  }, [module]);

  const triggerDownload = async () => {
    if (!('caches' in window) || !module) return;
    setDownloading(true);
    try {
      const audioUrl = (module.content && module.content.audioUrl) || `/audio/stage_${module.order}.mp3`;
      const pdfUrl = (module.content && module.content.pdfUrl) || `/pdf/stage_${module.order}.pdf`;
      
      await Promise.all([
        fetch(audioUrl),
        fetch(pdfUrl)
      ]);
      
      setDownloaded(true);
      if (showToast) showToast('Study materials downloaded! Available offline.');
    } catch (err) {
      console.error('Failed to download media:', err);
      if (showToast) showToast('Download failed. Try again when online.', 'error');
    }
    setDownloading(false);
  };
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
      try {
        await completeModuleQuiz(module.id, correct);
        onQuizPassed();
        launchCelebration();
        if (showToast) showToast(`Module complete! You scored ${correct}/${content.quiz.length} — well done!`);
      }
      catch(err) { console.error(err); }
    } else {
      if (showToast) showToast(`Score: ${correct}/${content.quiz.length}. You need at least 3 correct to pass. Try again!`, 'error');
    }
  };


  const saveNote = () => {
    localStorage.setItem(`pog_note_${module.id}`, noteContent);
    setNoteSaved(true);
    setTimeout(()=>setNoteSaved(false),2000);
  };
  const savedNote = localStorage.getItem(`pog_note_${module.id}`) || '';

  const moduleVideoMap = {
    // Module 1: Understanding Your Worth
    1: [
      { title: 'The Power of Vulnerability — Brené Brown (TED)', url: 'https://www.youtube.com/watch?v=iCvmsMzlF7o' },
      { title: 'Self-Worth Isn\'t A Feeling. It\'s A Decision — Laila Miller (TEDx)', url: 'https://www.youtube.com/watch?v=MEEaH_0R3kE' },
      { title: 'How to Reclaim Your Self-Worth — Tess Holliday (TEDx)', url: 'https://www.youtube.com/watch?v=0_uM7z5c2Qo' },
    ],
    // Module 2: Breaking Cultural Barriers
    2: [
      { title: 'We Should All Be Feminists — Chimamanda Ngozi Adichie (TEDx)', url: 'https://www.youtube.com/watch?v=hg3umXU_qWc' },
      { title: 'The Danger of a Single Story — Chimamanda Adichie (TED)', url: 'https://www.youtube.com/watch?v=D9Ihs241zeg' },
      { title: 'Women in Technology in Africa — Inspiring Stories', url: 'https://www.youtube.com/watch?v=WW2eunybne0' },
    ],
    // Module 3: Building Confidence in Tech
    3: [
      { title: 'The Power of Believing That You Can Improve — Carol Dweck (TED)', url: 'https://www.youtube.com/watch?v=_X0mgOOSpLU' },
      { title: 'Your Body Language May Shape Who You Are — Amy Cuddy (TED)', url: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc' },
      { title: 'Self-Efficacy Theory — Albert Bandura Explained', url: 'https://www.youtube.com/watch?v=pxSu0FqSNKY' },
    ],
    // Module 4: Overcoming Fear of Failure
    4: [
      { title: 'The Fringe Benefits of Failure — J.K. Rowling (Harvard)', url: 'https://www.youtube.com/watch?v=wHGqp8lz36c' },
      { title: 'Overcoming Imposter Syndrome — Mike Cannon-Brookes (TED)', url: 'https://www.youtube.com/watch?v=zNBmHXS3A6I' },
      { title: 'Growth Mindset vs Fixed Mindset — Explained Simply', url: 'https://www.youtube.com/watch?v=KUWn_TJTrnU' },
    ],
    // Module 5: Your Vision and Goals
    5: [
      { title: 'How to Set SMART Goals — Brian Tracy', url: 'https://www.youtube.com/watch?v=1-SvuFIQjK8' },
      { title: 'The Psychology of Goal Setting — TED Talk', url: 'https://www.youtube.com/watch?v=V2PP3p4_4R8' },
      { title: 'How to Achieve Your Most Ambitious Goals — Stephen Duneier (TEDx)', url: 'https://www.youtube.com/watch?v=TQMbvJNRpLE' },
    ],
    // Module 6: Community and Support Systems
    6: [
      { title: 'Why Good Leaders Make You Feel Safe — Simon Sinek (TED)', url: 'https://www.youtube.com/watch?v=lmyZMtPVodo' },
      { title: 'The Power of Peer Learning — Education Reimagined', url: 'https://www.youtube.com/watch?v=PfBV2M3bIR4' },
      { title: 'Ghana Tech Ecosystem — Accra and Kumasi Innovation Hubs', url: 'https://www.youtube.com/watch?v=6rZvp_T_07U' },
    ],
    // Module 7: Celebrating Your Progress
    7: [
      { title: 'The Happy Secret to Better Work — Shawn Achor (TED)', url: 'https://www.youtube.com/watch?v=fLJsdqxnZb0' },
      { title: 'Celebrating Small Wins — Why It Matters for Success', url: 'https://www.youtube.com/watch?v=dFdVkYRyKhE' },
      { title: 'The Importance of Self-Reflection — Personal Growth', url: 'https://www.youtube.com/watch?v=vMVx6Y2VdoI' },
    ],
    // Module 8: Introduction to HTML and CSS
    8: [
      { title: 'HTML Tutorial for Beginners — Programming with Mosh (1 hour)', url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU' },
      { title: 'CSS Crash Course for Absolute Beginners — Traversy Media', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI' },
      { title: 'Build Your First Website — HTML & CSS Full Course (freeCodeCamp)', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc' },
    ],
    // Module 9: JavaScript Fundamentals
    9: [
      { title: 'JavaScript Tutorial for Beginners — Programming with Mosh (1 hour)', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk' },
      { title: 'JavaScript in 100 Seconds — Fireship', url: 'https://www.youtube.com/watch?v=DHjqpvDnNGE' },
      { title: 'Learn JavaScript Variables, Data Types and Operators — freeCodeCamp', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
    ],
    // Module 10: Building Your First Website
    10: [
      { title: 'Responsive Web Design Tutorial — Kevin Powell', url: 'https://www.youtube.com/watch?v=srvUrASNj0s' },
      { title: 'DOM Manipulation for Beginners — Web Dev Simplified', url: 'https://www.youtube.com/watch?v=y17RuWkWdn8' },
      { title: 'Build a Responsive Website From Scratch — Traversy Media', url: 'https://www.youtube.com/watch?v=p0bGHP-PXD4' },
    ],
    // Module 11: Introduction to Python
    11: [
      { title: 'Python for Beginners Full Course — freeCodeCamp (4.5 hours)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
      { title: 'Python in 100 Seconds — Fireship', url: 'https://www.youtube.com/watch?v=x7X9w_GIm1s' },
      { title: 'Python Variables, Lists and Dictionaries — Corey Schafer', url: 'https://www.youtube.com/watch?v=k9TUPpGqYTo' },
    ],
    // Module 12: Databases and SQL
    12: [
      { title: 'SQL Tutorial — Full Database Course for Beginners (freeCodeCamp)', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'SQL in 100 Seconds — Fireship', url: 'https://www.youtube.com/watch?v=zsjvFFKOm3c' },
      { title: 'Learn SQL SELECT, INSERT, UPDATE and DELETE — Programming with Mosh', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA' },
    ],
    // Module 13: Web Development Project
    13: [
      { title: 'What is a Full Stack Developer? — Explained Simply', url: 'https://www.youtube.com/watch?v=pkdgVYehiTE' },
      { title: 'REST API Explained in 5 Minutes — IBM Technology', url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk' },
      { title: 'React JS Full Course for Beginners — freeCodeCamp', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
    ],
    // Module 14: Version Control with GitHub
    14: [
      { title: 'Git and GitHub for Beginners — freeCodeCamp (1 hour)', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'Git Explained in 100 Seconds — Fireship', url: 'https://www.youtube.com/watch?v=hwP7WQkmECE' },
      { title: 'How to Create a GitHub Profile README — Step by Step', url: 'https://www.youtube.com/watch?v=ECuqb5Tv9qI' },
    ],
    // Module 15: Ghana Tech Job Market
    15: [
      { title: 'Africa\'s Tech Ecosystem is Booming — CNBC Africa', url: 'https://www.youtube.com/watch?v=y8YH0Qbu5h4' },
      { title: 'How to Get Your First Tech Job — Practical Steps', url: 'https://www.youtube.com/watch?v=Xg9ihH15Fe0' },
      { title: 'Women in Tech Africa — Career Journeys and Advice', url: 'https://www.youtube.com/watch?v=2dxM9oH6KwE' },
    ],
    // Module 16: Building Your CV and Portfolio
    16: [
      { title: 'How to Build a Developer Portfolio — Step by Step', url: 'https://www.youtube.com/watch?v=oC483DTjRXU' },
      { title: 'Write a Great Developer Resume — Tips and Examples', url: 'https://www.youtube.com/watch?v=BYUy1yvjHxE' },
      { title: 'GitHub Portfolio Tips for Junior Developers', url: 'https://www.youtube.com/watch?v=u-RLu_8kwA0' },
    ],
    // Module 17: Interview Preparation
    17: [
      { title: 'How to Prepare for a Technical Interview — Google Career Tips', url: 'https://www.youtube.com/watch?v=Tpp-M5KqyFM' },
      { title: 'The STAR Method — Behavioral Interview Technique Explained', url: 'https://www.youtube.com/watch?v=AEVR3aQIiII' },
      { title: 'Common Coding Interview Mistakes to Avoid', url: 'https://www.youtube.com/watch?v=1t1_a1BZ04o' },
    ],
    // Module 18: Networking and LinkedIn
    18: [
      { title: 'LinkedIn Profile Tips for Software Developers — Danny Thompson', url: 'https://www.youtube.com/watch?v=SG5Sb5WTV_g' },
      { title: 'How to Network as a Developer — Tech Career Advice', url: 'https://www.youtube.com/watch?v=uFg2GBswQ3E' },
      { title: 'DevCongress Ghana — Building Tech Communities in Africa', url: 'https://www.youtube.com/watch?v=6rZvp_T_07U' },
    ],
    // Module 19: Freelancing and Entrepreneurship
    19: [
      { title: 'How to Start Freelancing as a Web Developer — Practical Guide', url: 'https://www.youtube.com/watch?v=IiPNLmHsD7g' },
      { title: 'Upwork Tutorial for Beginners — Get Your First Client', url: 'https://www.youtube.com/watch?v=LcbX4SxzIVE' },
      { title: 'Starting a Tech Business in Africa — MEST Insights', url: 'https://www.youtube.com/watch?v=n5WfGZ9H6P4' },
    ],
    // Module 20: Continuing Your Tech Journey
    20: [
      { title: 'Learning How to Learn — Coursera (Key Insights)', url: 'https://www.youtube.com/watch?v=O96fE1E-rf8' },
      { title: 'Developer Roadmap 2026 — What to Learn Next', url: 'https://www.youtube.com/watch?v=66tfvFeALBQ' },
      { title: 'Contributing to Open Source — Getting Started Guide', url: 'https://www.youtube.com/watch?v=yzeVMecydCE' },
    ],
  };

  const videoLinks = moduleVideoMap[module.id] || moduleVideoMap[1];

  const tabs = [
    { key:'notes',      label:'Notes' },
    { key:'resources',  label:'Resources' },
    { key:'assignment', label:'Assignment' },
    { key:'quiz',       label:'Quiz' },
    { key:'grades',     label:'Grades' },
  ];

  const timerMin = Math.floor(timerSeconds / 60);
  const timerSec = timerSeconds % 60;

  return (
    <div className="animate-fade-in" style={{ maxWidth:'940px',margin:'0 auto',position:'relative' }}>

      {/* Confetti Celebration Overlay */}
      {showCelebration && (
        <div style={{ position:'fixed',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:9999,overflow:'hidden' }}>
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left:`${p.left}%`,
              background:p.color,
              borderRadius:p.shape,
              animationDelay:`${p.delay}s`,
              animationDuration:`${p.duration}s`
            }} />
          ))}
          <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center',animation:'celebration-pop 0.6s ease-out' }}>
            <div style={{ fontSize:'72px',marginBottom:'12px' }}>*</div>
            <div style={{ background:'rgba(255,255,255,0.95)',padding:'18px 36px',borderRadius:'16px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize:'22px',fontWeight:'800',color:'var(--primary)',marginBottom:'4px' }}>Module Complete!</div>
              <div style={{ fontSize:'14px',color:'var(--text-muted)' }}>Amazing work — keep going! *</div>
            </div>
          </div>
        </div>
      )}

      {/* Top nav */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px',flexWrap:'wrap',gap:'8px' }}>
        <button className="btn-outline" onClick={()=>go('modules')} style={{ fontSize:'13px',padding:'8px 16px' }}>Back to Modules</button>
        <div style={{ display:'flex',gap:'8px' }}>
          {prevMod && <button className="btn-outline" style={{ fontSize:'13px',padding:'8px 16px' }} onClick={()=>openModule(prevMod)}>Stage {prevMod.order}</button>}
          {nextMod && <button className="btn-primary" style={{ fontSize:'13px',padding:'8px 16px',background:catColor() }} onClick={()=>openModule(nextMod)}>Stage {nextMod.order}</button>}
        </div>
      </div>

      {/* Study Timer (Pomodoro) */}
      <div style={{ background:'linear-gradient(135deg,#1a3a5c,#2d6a9f)',borderRadius:'12px',padding:'14px 22px',marginBottom:'14px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',color:'#fff' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'12px' }}>
          <div style={{ width:'38px',height:'38px',borderRadius:'50%',background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px' }}>
            <Icons.Timer />
          </div>
          <div>
            <div style={{ fontSize:'13px',fontWeight:'700',marginBottom:'2px' }}>{isBreak ? ' Break Time' : ' Focus Session'}</div>
            <div style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)' }}>{isBreak ? '5-minute rest' : '25-minute Pomodoro'}</div>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'14px' }}>
          <div style={{ fontFamily:'monospace',fontSize:'28px',fontWeight:'800',letterSpacing:'2px',minWidth:'80px',textAlign:'center',color:timerSeconds < 60 ? '#ff6b6b' : '#fff' }}>
            {String(timerMin).padStart(2,'0')}:{String(timerSec).padStart(2,'0')}
          </div>
          <div style={{ display:'flex',gap:'6px' }}>
            <button onClick={()=>setTimerRunning(!timerRunning)} style={{
              background:timerRunning ? 'rgba(255,107,107,0.25)' : 'rgba(46,204,113,0.25)',
              border:`1px solid ${timerRunning ? 'rgba(255,107,107,0.5)' : 'rgba(46,204,113,0.5)'}`,
              color:'#fff',padding:'6px 16px',borderRadius:'20px',cursor:'pointer',fontSize:'12px',fontWeight:'700',fontFamily:'inherit'
            }}>
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={()=>{ setTimerRunning(false); setIsBreak(false); setTimerSeconds(25*60); }} style={{
              background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',
              color:'#fff',padding:'6px 12px',borderRadius:'20px',cursor:'pointer',fontSize:'12px',fontWeight:'600',fontFamily:'inherit'
            }}>
              Reset
            </button>
          </div>
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

        {/* NOTES — Storytelling Format */}
        {activeTab === 'notes' && (
          <div>
            {/* Story-style intro */}
            <div className="story-intro">
              {renderStoryContent(content.intro)}
            </div>
            {content.sections.map((s,i)=>(
              <div key={i} style={{ marginBottom:'24px',paddingBottom:'24px',borderBottom:i<content.sections.length-1?'1px solid #f0f0f0':'none' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}>
                  <div style={{ width:'30px',height:'30px',background:`${catColor()}18`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`2px solid ${catColor()}` }}>
                    <span style={{ color:catColor(),fontWeight:'800',fontSize:'13px' }}>{i+1}</span>
                  </div>
                  <h2 style={{ color:'var(--primary)',fontSize:'clamp(15px,2.5vw,17px)',fontWeight:'700',margin:0 }}>{s.heading}</h2>
                </div>
                <div style={{ paddingLeft:'40px' }} className="story-section-body">
                  {renderStoryContent(s.body)}
                </div>
              </div>
            ))}
            {/* Try It Yourself — Practice Lab Link (for tech modules) */}
            {module.category === 'technical-skills' && (
              <div style={{ background:'linear-gradient(135deg,#f3e8ff,#ede0ff)',border:'2px solid #d4bfff',borderRadius:'12px',padding:'18px 22px',marginTop:'22px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px' }}>
                <div style={{ flex:1,minWidth:'180px' }}>
                  <div style={{ fontSize:'15px',fontWeight:'700',color:'#5a3e8a',marginBottom:'4px' }}> Try It Yourself!</div>
                  <div style={{ fontSize:'13px',color:'#7c5cbf',lineHeight:'1.5' }}>Practice what you learned with Ghana-contextualized coding challenges in the Practice Lab.</div>
                </div>
                <button className="btn-primary" style={{ background:'#7c5cbf',fontSize:'13px',padding:'9px 20px' }} onClick={()=>go('practiceLab')}>Open Practice Lab →</button>
              </div>
            )}

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

        {/* RESOURCES — Illustrated Lessons (Offline-First) */}
        {activeTab === 'resources' && (
          <div>
            {/* Offline study pack control */}
            <div className="premium-card" style={{ padding:'18px 22px', marginBottom:'24px', borderLeft:'5px solid var(--primary)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <h4 style={{ color:'var(--primary)', margin:'0 0 4px', fontSize:'15px', fontWeight:'700' }}>Offline Study Pack</h4>
                <p style={{ color:'var(--text-muted)', fontSize:'12.5px', margin:0 }}>Download this module's audio lecture and PDF study notes to learn without internet.</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={triggerDownload} 
                disabled={downloading || downloaded || !isOnline}
                style={{ padding:'8px 18px', fontSize:'12.5px', background: downloaded ? 'var(--primary)' : 'linear-gradient(135deg, var(--primary-light), var(--primary))', boxShadow: 'none' }}
              >
                {downloaded ? 'Downloaded Done' : downloading ? 'Downloading...' : !isOnline ? 'Online Required' : 'Download for Offline Study'}
              </button>
            </div>

            {/* Offline Alert */}
            {!isOnline && (
              <div className="alert-warning" style={{ marginBottom:'22px' }}>
                <h4 style={{ fontWeight:'700', marginBottom:'6px', fontSize:'14px' }}>Offline Mode Active</h4>
                <p style={{ margin:0, fontSize:'13px', lineHeight:'1.5' }}>
                  All illustrated lessons and audio lectures are available offline. External video links require an internet connection.
                </p>
              </div>
            )}

            {/* Audio Lecture Player Section */}
            <div className="premium-card" style={{ padding:'22px', marginBottom:'28px' }}>
              <h3 className="section-heading" style={{ fontSize:'15px', display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
                <Icons.Video2 /> Audio Lecture Guide
              </h3>
              <p style={{ color:'var(--text-muted)', fontSize:'13px', marginBottom:'16px' }}>
                Listen to Agnes' voice lecture for Stage {module.order} (works offline after first download).
              </p>
              
              <audio 
                controls 
                style={{ width: '100%', outline: 'none' }}
                src={content.audioUrl || `/audio/stage_${module.order}.mp3`}
              >
                Your browser does not support the audio player.
              </audio>
              
              <div style={{ marginTop:'14px', display:'flex', gap:'10px' }}>
                <a 
                  href={content.pdfUrl || `/pdf/stage_${module.order}.pdf`} 
                  download={`Stage_${module.order}_Notes.pdf`} 
                  className="btn-outline" 
                  style={{ padding:'8px 18px', fontSize:'12.5px', display:'inline-flex', alignItems:'center', gap:'6px' }}
                >
                  Download PDF Study Guide
                </a>
              </div>
            </div>

            {/* Illustrated Lesson — Main Content (Offline-Friendly) */}
            <h2 className="section-heading" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              Illustrated Lesson: {module.title}
            </h2>
            <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px' }}>
              A step-by-step visual walkthrough for <strong>Stage {module.order}</strong>. This lesson works fully offline — no internet needed.
            </p>
            
            {(moduleLectureMap[module.id] || moduleLectureMap[1]).map((step, si) => (
              <div key={si} className="illustrated-lesson-card">
                <div className="illustrated-lesson-step">
                  <div className="illustrated-lesson-num" style={{ background: catColor() }}>{si + 1}</div>
                  <div className="illustrated-lesson-content">
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Collapsible External Videos (Online Only) */}
            <div 
              className="external-videos-toggle" 
              onClick={() => setShowExternalVideos && setShowExternalVideos(prev => !prev)}
              style={{ cursor: 'pointer' }}
            >
              <h4>External Video Links (requires internet)</h4>
              <span>{showExternalVideos ? '▲ Hide' : '▼ Show'}</span>
            </div>
            {showExternalVideos && (
              <div style={{ marginTop:'12px', display:'flex',flexDirection:'column',gap:'10px',marginBottom:'30px', opacity: isOnline ? 1 : 0.5 }}>
                
                {/* Inline video player container */}
                {selectedVideo && isOnline && (
                  <div className="premium-card animate-fade-in" style={{ padding:'16px', marginBottom:'14px', position:'relative', border:'2px solid var(--primary-light)', background:'#fff', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ color:'var(--primary)', margin:0, fontWeight:'700', fontSize:'clamp(13px, 3.5vw, 15px)', flex: '1 1 150px', lineHeight: '1.4' }}>
                        Playing: {selectedVideo.title}
                      </h4>
                      <button 
                        onClick={() => setSelectedVideo(null)} 
                        className="btn-outline"
                        style={{ padding:'6px 12px', fontSize:'12px', cursor:'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        X Close Player
                      </button>
                    </div>
                    <div style={{ position:'relative', paddingBottom:'56.25%', height:0, overflow:'hidden', borderRadius:'8px', background:'#000', width: '100%' }}>
                      <iframe 
                        title={selectedVideo.title}
                        src={getYouTubeEmbedUrl(selectedVideo.url)} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}
                      />
                    </div>
                  </div>
                )}

                {videoLinks.map((v,i)=>(
                  <div 
                    key={i} 
                    className="video-link-item" 
                    style={{ cursor: isOnline ? 'pointer' : 'not-allowed' }}
                    onClick={() => {
                      if (isOnline && canEmbed(v.url)) {
                        setSelectedVideo(v);
                      }
                    }}
                  >
                    <div className="video-icon-box">
                      <Icons.Video2 />
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontWeight:'600',fontSize:'14px',color:'var(--primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{v.title}</div>
                      <div style={{ fontSize:'12px',color:'var(--text-muted)',marginTop:'2px' }}>
                        {isOnline ? (canEmbed(v.url) ? 'Click to play inline' : 'External Link') : 'Requires internet'}
                      </div>
                    </div>
                    {isOnline && (
                      <a 
                        href={v.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'4px', color:'var(--text-muted)' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <Icons.ExternalLink />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="alert-info" style={{ marginTop: '24px' }}>
              <h4 style={{ fontWeight:'700',marginBottom:'10px',fontSize:'14px' }}>Additional Reading</h4>
              <ul style={{ color:'var(--text-main)',fontSize:'13px',lineHeight:'2.1',paddingLeft:'18px',margin:0 }}>
                {(module.category === 'self-worth' ? [
                  { text: 'Bandura, A. (1997). Self-efficacy: The exercise of control. W. H. Freeman.', url: 'https://books.google.com.gh/books?id=eJ-PN9g54tcC' },
                  { text: 'Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.', url: 'https://books.google.com.gh/books?id=g-4lDAAAQBAJ' },
                  { text: 'UNICEF Ghana (2022). Girls in STEM Education Report.', url: 'https://www.unicef.org/ghana/reports' },
                  { text: 'Master, A., et al. (2021). Gender stereotypes about interests emerge early. PNAS.', url: 'https://www.pnas.org/doi/10.1073/pnas.2100030118' },
                ] : module.category === 'technical-skills' ? [
                  { text: 'MDN Web Docs — HTML, CSS, JavaScript Reference', url: 'https://developer.mozilla.org' },
                  { text: 'freeCodeCamp.org — Free online coding curriculum', url: 'https://www.freecodecamp.org' },
                  { text: 'W3Schools — Interactive web tutorials', url: 'https://www.w3schools.com' },
                  { text: 'The Odin Project — Full stack web development course', url: 'https://www.theodinproject.com' },
                  { text: 'CS50 by Harvard — Free intro to computer science', url: 'https://cs50.harvard.edu/x/' },
                ] : [
                  { text: 'AmaliTech Ghana — Career Development Resources', url: 'https://amalitech.org/careers' },
                  { text: 'LinkedIn Learning — Professional Development Courses', url: 'https://www.linkedin.com/learning' },
                  { text: 'Women in Tech Africa — Network and Opportunities', url: 'http://www.womenintechafrica.com' },
                  { text: 'MEST Africa — Entrepreneurship and Tech Skills', url: 'https://meltwater.org' },
                  { text: 'DevCongress Ghana — Community Events and Mentorship', url: 'https://devcongress.org' },
                ]).map((ref,i)=>(
                  <li key={i}>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                      {ref.text}
                    </a>
                  </li>
                ))}
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
      <div className="premium-card" style={{ marginBottom:'22px',border:'2px solid var(--secondary)' }}>
        <div style={{ background:'linear-gradient(135deg,var(--secondary),#e8a000)',padding:'14px 22px',borderRadius:'13px 13px 0 0' }}>
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
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'8px',marginBottom:'16px' }}>
              {agnesSlots.map((slot,i)=>(
                <div key={i} style={{ background:'var(--secondary-pale)',padding:'10px 14px',borderRadius:'9px',borderLeft:'4px solid var(--secondary)' }}>
                  <div style={{ fontSize:'12px',fontWeight:'700',color:'#7a5b13' }}>{slot.day}</div>
                  <div style={{ fontSize:'13px',color:'var(--text-main)',fontWeight:'600' }}>{slot.time}</div>
                  <div style={{ fontSize:'11px',color:'var(--text-muted)' }}>Ghana Time (GMT)</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap',position:'relative',zIndex:10 }}>
              <a
                href="mailto:a.berko1@alustudent.com"
                style={{
                  display:'inline-flex',alignItems:'center',gap:'6px',
                  background:'var(--primary)',color:'#fff',
                  padding:'10px 20px',borderRadius:'22px',
                  fontWeight:'700',fontSize:'13px',
                  textDecoration:'none',cursor:'pointer',
                  pointerEvents:'auto',position:'relative',zIndex:10
                }}
              >
                Email Agnes: a.berko1@alustudent.com
              </a>
              <button
                style={{
                  display:'inline-flex',alignItems:'center',gap:'6px',
                  background:'var(--secondary)',color:'#fff',
                  padding:'10px 20px',borderRadius:'22px',
                  fontWeight:'700',fontSize:'13px',
                  border:'none',cursor:'pointer',
                  pointerEvents:'auto',position:'relative',zIndex:10
                }}
                onClick={()=>{
                  setBooking(prev => ({ ...prev, type:'agnes-office', mentorId: mentors.length > 0 ? String(mentors[0].id) : '1' }));
                  setStep(2);
                }}
              >
                Book Agnes Office Hours
              </button>
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
  const [selectedVideo, setSelectedVideo]   = useState(null);

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
        <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'18px' }}>Curated videos to prepare for your tech career. Click a video to watch inline or open in a new tab.</p>
        
        {/* Inline video player container */}
        {selectedVideo && (
          <div className="premium-card animate-fade-in" style={{ padding:'16px', marginBottom:'18px', position:'relative', border:'2px solid var(--primary-light)', background:'#fff' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <h4 style={{ color:'var(--primary)', margin:0, fontWeight:'700', fontSize:'14px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'80%' }}>
                Playing: {selectedVideo.title}
              </h4>
              <button 
                onClick={() => setSelectedVideo(null)} 
                className="btn-outline"
                style={{ padding:'4px 10px', fontSize:'11px', cursor:'pointer' }}
              >
                X Close Player
              </button>
            </div>
            <div style={{ position:'relative', paddingBottom:'56.25%', height:0, overflow:'hidden', borderRadius:'8px', background:'#000' }}>
              <iframe 
                title={selectedVideo.title}
                src={getYouTubeEmbedUrl(selectedVideo.url)} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}
              />
            </div>
          </div>
        )}

        <div style={{ display:'flex',flexDirection:'column',gap:'9px' }}>
          {educationalVideos.map((v,i)=>(
            <div 
              key={i} 
              className="video-link-item" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (canEmbed(v.url)) {
                  setSelectedVideo(v);
                }
              }}
            >
              <div className="video-icon-box"><Icons.Video /></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:'600',fontSize:'14px',color:'var(--primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{v.title}</div>
                <div style={{ fontSize:'12px',color:'var(--text-muted)',marginTop:'2px' }}>
                  {canEmbed(v.url) ? 'Click to play inline' : 'External Link'}
                </div>
              </div>
              <a 
                href={v.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'4px', color:'var(--text-muted)' }}
                onClick={e => e.stopPropagation()}
              >
                <Icons.ExternalLink />
              </a>
            </div>
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

      {/* ============ Ghana Tech Hubs & Pathways ============ */}
      <div style={{ marginTop:'40px' }}>
        <div className="page-header" style={{ marginBottom:'24px' }}>
          <h2 style={{ fontSize:'clamp(18px,3vw,22px)' }}>Ghana Tech Hubs & Career Pathways</h2>
          <p>Connect with Ghana's leading tech organizations for training, workspace, and community</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>

          {/* AmaliTech */}
          <div className="premium-card" style={{ padding:'26px', borderTop:'4px solid #2d7a2d', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'0', right:'0', background:'linear-gradient(135deg, #2d7a2d, #1e5a2c)', color:'#fff', padding:'4px 14px', borderRadius:'0 0 0 12px', fontSize:'11px', fontWeight:'700' }}>TRAINING PROGRAM</div>
            <h3 style={{ color:'var(--primary)', margin:'0 0 8px', fontSize:'17px', fontWeight:'800' }}>AmaliTech Trainee Program</h3>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:'0 0 4px', fontWeight:'600' }}>Takoradi, Kumasi & Accra</p>
            <p style={{ fontSize:'13px', color:'var(--text-main)', lineHeight:'1.6', margin:'12px 0' }}>
              AmaliTech offers a fully-funded 6-month intensive training program in Software Development, Data Analytics, and IT Service Management. After training, top graduates are placed in paid client projects with international companies.
            </p>
            <div style={{ background:'var(--primary-pale)', padding:'14px', borderRadius:'10px', marginBottom:'14px' }}>
              <h4 style={{ color:'var(--primary)', fontSize:'13px', fontWeight:'700', margin:'0 0 8px' }}>How to Apply</h4>
              <ol style={{ margin:'0', paddingLeft:'18px', fontSize:'12.5px', lineHeight:'1.8', color:'var(--text-main)' }}>
                <li>Visit <strong>amalitech.org/careers</strong> and select "Trainee Programs"</li>
                <li>Complete the online application form with your CV and motivation letter</li>
                <li>Pass the aptitude test (basic logic and problem-solving)</li>
                <li>Attend an in-person or virtual interview</li>
              </ol>
            </div>
            <a href="https://amalitech.org/careers" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px', padding:'10px 20px', borderRadius:'18px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
              Apply Now <Icons.ExternalLink />
            </a>
          </div>

          {/* MEST Africa */}
          <div className="premium-card" style={{ padding:'26px', borderTop:'4px solid #e8a838', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'0', right:'0', background:'linear-gradient(135deg, #e8a838, #c98b20)', color:'#fff', padding:'4px 14px', borderRadius:'0 0 0 12px', fontSize:'11px', fontWeight:'700' }}>ENTREPRENEURSHIP</div>
            <h3 style={{ color:'var(--primary)', margin:'0 0 8px', fontSize:'17px', fontWeight:'800' }}>MEST Africa</h3>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:'0 0 4px', fontWeight:'600' }}>East Legon, Accra</p>
            <p style={{ fontSize:'13px', color:'var(--text-main)', lineHeight:'1.6', margin:'12px 0' }}>
              MEST (Meltwater Entrepreneurial School of Technology) offers a fully-funded 12-month program combining software development, business training, and entrepreneurship. Graduates can pitch for seed funding to launch their own startups.
            </p>
            <div style={{ background:'var(--primary-pale)', padding:'14px', borderRadius:'10px', marginBottom:'14px' }}>
              <h4 style={{ color:'var(--primary)', fontSize:'13px', fontWeight:'700', margin:'0 0 8px' }}>How to Apply</h4>
              <ol style={{ margin:'0', paddingLeft:'18px', fontSize:'12.5px', lineHeight:'1.8', color:'var(--text-main)' }}>
                <li>Visit <strong>meltwater.org/mest</strong> and click "Apply Now"</li>
                <li>Submit your application with academic transcripts and personal essay</li>
                <li>Pass the online assessment (reasoning and aptitude)</li>
                <li>Attend the selection bootcamp in Accra</li>
              </ol>
            </div>
            <a href="https://meltwater.org/mest/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px', padding:'10px 20px', borderRadius:'18px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
              Learn More <Icons.ExternalLink />
            </a>
          </div>

          {/* Kumasi Hive */}
          <div className="premium-card" style={{ padding:'26px', borderTop:'4px solid #6c5ce7', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'0', right:'0', background:'linear-gradient(135deg, #6c5ce7, #5a4bd1)', color:'#fff', padding:'4px 14px', borderRadius:'0 0 0 12px', fontSize:'11px', fontWeight:'700' }}>CO-WORKING HUB</div>
            <h3 style={{ color:'var(--primary)', margin:'0 0 8px', fontSize:'17px', fontWeight:'800' }}>Kumasi Hive</h3>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:'0 0 4px', fontWeight:'600' }}>KNUST Campus Area, Kumasi</p>
            <p style={{ fontSize:'13px', color:'var(--text-main)', lineHeight:'1.6', margin:'12px 0' }}>
              Kumasi Hive is the Ashanti Region's premier tech hub. It provides co-working space with reliable internet, hosts regular workshops and hackathons, and connects young developers with mentors and job opportunities in the Kumasi tech scene.
            </p>
            <div style={{ background:'var(--primary-pale)', padding:'14px', borderRadius:'10px', marginBottom:'14px' }}>
              <h4 style={{ color:'var(--primary)', fontSize:'13px', fontWeight:'700', margin:'0 0 8px' }}>How to Connect</h4>
              <ul style={{ margin:'0', paddingLeft:'18px', fontSize:'12.5px', lineHeight:'1.8', color:'var(--text-main)' }}>
                <li>Visit in person at the KNUST campus area for a free tour</li>
                <li>Follow them on Twitter/X <strong>@KumasiHive</strong> for event announcements</li>
                <li>Attend their monthly Tech Meetup (free entry for students)</li>
                <li>Ask about their Women in Tech mentoring circle</li>
              </ul>
            </div>
            <a href="https://kumasihive.com" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px', padding:'10px 20px', borderRadius:'18px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
              Visit Website <Icons.ExternalLink />
            </a>
          </div>

          {/* iSpace */}
          <div className="premium-card" style={{ padding:'26px', borderTop:'4px solid #00b894', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'0', right:'0', background:'linear-gradient(135deg, #00b894, #00a381)', color:'#fff', padding:'4px 14px', borderRadius:'0 0 0 12px', fontSize:'11px', fontWeight:'700' }}>INNOVATION HUB</div>
            <h3 style={{ color:'var(--primary)', margin:'0 0 8px', fontSize:'17px', fontWeight:'800' }}>iSpace Foundation</h3>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:'0 0 4px', fontWeight:'600' }}>Osu, Accra</p>
            <p style={{ fontSize:'13px', color:'var(--text-main)', lineHeight:'1.6', margin:'12px 0' }}>
              iSpace is one of Accra's oldest innovation hubs, fostering startups and tech talent. They run accelerator programs, coding bootcamps, and community events. Their She Leads Africa partnership focuses specifically on empowering women in technology.
            </p>
            <div style={{ background:'var(--primary-pale)', padding:'14px', borderRadius:'10px', marginBottom:'14px' }}>
              <h4 style={{ color:'var(--primary)', fontSize:'13px', fontWeight:'700', margin:'0 0 8px' }}>How to Connect</h4>
              <ul style={{ margin:'0', paddingLeft:'18px', fontSize:'12.5px', lineHeight:'1.8', color:'var(--text-main)' }}>
                <li>Visit at <strong>44 Kofi Annan Street, Osu, Accra</strong></li>
                <li>Join their community on Slack via the website</li>
                <li>Attend their quarterly Demo Day to see startup pitches</li>
                <li>Apply for their startup incubator if you have a tech idea</li>
              </ul>
            </div>
            <a href="https://ispacegh.com" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px', padding:'10px 20px', borderRadius:'18px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
              Visit Website <Icons.ExternalLink />
            </a>
          </div>

          {/* Mobile Web Ghana */}
          <div className="premium-card" style={{ padding:'26px', borderTop:'4px solid #fd79a8', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'0', right:'0', background:'linear-gradient(135deg, #fd79a8, #e84393)', color:'#fff', padding:'4px 14px', borderRadius:'0 0 0 12px', fontSize:'11px', fontWeight:'700' }}>TRAINING & COMMUNITY</div>
            <h3 style={{ color:'var(--primary)', margin:'0 0 8px', fontSize:'17px', fontWeight:'800' }}>Mobile Web Ghana</h3>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:'0 0 4px', fontWeight:'600' }}>Accra (with nationwide outreach)</p>
            <p style={{ fontSize:'13px', color:'var(--text-main)', lineHeight:'1.6', margin:'12px 0' }}>
              Mobile Web Ghana focuses on mobile-first web technologies and digital skills training for young Ghanaians. They run free bootcamps, Google Developer Student Club partnerships, and provide pathways to Google certifications.
            </p>
            <div style={{ background:'var(--primary-pale)', padding:'14px', borderRadius:'10px', marginBottom:'14px' }}>
              <h4 style={{ color:'var(--primary)', fontSize:'13px', fontWeight:'700', margin:'0 0 8px' }}>How to Connect</h4>
              <ul style={{ margin:'0', paddingLeft:'18px', fontSize:'12.5px', lineHeight:'1.8', color:'var(--text-main)' }}>
                <li>Follow <strong>@maboroshi</strong> and <strong>@nicofee</strong> on Twitter/X</li>
                <li>Join their WhatsApp or Telegram community for bootcamp announcements</li>
                <li>Attend their free weekend coding workshops in Accra</li>
                <li>Ask about Google Developer certification sponsorship</li>
              </ul>
            </div>
            <a href="https://mobilewebghana.org" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px', padding:'10px 20px', borderRadius:'18px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
              Visit Website <Icons.ExternalLink />
            </a>
          </div>

          {/* DevCongress Ghana */}
          <div className="premium-card" style={{ padding:'26px', borderTop:'4px solid #0984e3', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'0', right:'0', background:'linear-gradient(135deg, #0984e3, #0652DD)', color:'#fff', padding:'4px 14px', borderRadius:'0 0 0 12px', fontSize:'11px', fontWeight:'700' }}>DEVELOPER COMMUNITY</div>
            <h3 style={{ color:'var(--primary)', margin:'0 0 8px', fontSize:'17px', fontWeight:'800' }}>DevCongress Ghana</h3>
            <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:'0 0 4px', fontWeight:'600' }}>Accra (annual conference + online community)</p>
            <p style={{ fontSize:'13px', color:'var(--text-main)', lineHeight:'1.6', margin:'12px 0' }}>
              DevCongress is Ghana's largest developer community. Their annual conference brings together hundreds of software engineers, designers, and entrepreneurs. Membership gives you access to mentors, job postings, and a strong network of Ghanaian developers.
            </p>
            <div style={{ background:'var(--primary-pale)', padding:'14px', borderRadius:'10px', marginBottom:'14px' }}>
              <h4 style={{ color:'var(--primary)', fontSize:'13px', fontWeight:'700', margin:'0 0 8px' }}>How to Join</h4>
              <ol style={{ margin:'0', paddingLeft:'18px', fontSize:'12.5px', lineHeight:'1.8', color:'var(--text-main)' }}>
                <li>Visit <strong>devcongress.org</strong> and register for a free membership</li>
                <li>Join their Slack channel to connect with 2,000+ Ghanaian developers</li>
                <li>Attend the annual DevCongress Conference (usually held in Accra)</li>
                <li>Participate in their monthly developer meetups and lightning talks</li>
              </ol>
            </div>
            <a href="https://www.devcongress.org" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize:'13px', padding:'10px 20px', borderRadius:'18px', display:'inline-flex', alignItems:'center', gap:'6px' }}>
              Register Now <Icons.ExternalLink />
            </a>
          </div>

        </div>

        {/* Quick Action Steps */}
        <div className="premium-card" style={{ marginTop:'28px', padding:'clamp(20px,4vw,28px)', background:'linear-gradient(135deg, var(--primary-pale), #f0faf0)', borderLeft:'5px solid var(--primary)' }}>
          <h3 style={{ color:'var(--primary)', fontSize:'16px', fontWeight:'800', margin:'0 0 14px' }}>Your Next Steps to a Tech Career in Ghana</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'14px' }}>
            {[
              { step: '1', title: 'Complete Your Modules', desc: 'Finish all 20 Pool of Grace modules to earn your certificate and build your CV.' },
              { step: '2', title: 'Build Your CV', desc: 'Use the CV Builder page to create a professional resume from your achievements.' },
              { step: '3', title: 'Apply to a Training Hub', desc: 'Submit your application to AmaliTech or MEST for structured professional training.' },
              { step: '4', title: 'Visit a Local Hub', desc: 'Walk into Kumasi Hive or iSpace for co-working, workshops, and networking.' },
              { step: '5', title: 'Join the Community', desc: 'Register at DevCongress and Mobile Web Ghana to expand your professional network.' },
              { step: '6', title: 'Apply for Roles', desc: 'Use the Career Board above to apply for internships, jobs, and scholarships.' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'14px', flexShrink:0 }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontWeight:'700', fontSize:'13px', color:'var(--primary)', marginBottom:'3px' }}>{item.title}</div>
                  <div style={{ fontSize:'12.5px', color:'var(--text-muted)', lineHeight:'1.5' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
    { key:'roles',        title:'Roles and Mentors',   desc:'Assign mentor, instructor, or admin roles to platform users.',    btn:'Manage Roles',         icon:'R' },
    { key:'sessions',     title:'Mentorship Sessions', desc:'Monitor all mentorship bookings and session history.',             btn:'Monitor Bookings',     icon:'S' },
    { key:'analytics',    title:'Analytics',           desc:'Detailed engagement, retention, and completion analytics.',        btn:'View Analytics',       icon:'A' },
    { key:'announcements',title:'Announcements',        desc:'Post platform-wide announcements visible to all users.',          btn:'Manage Announcements', icon:'N' },
  ];

  // Read SUS responses from localStorage
  const susResults = JSON.parse(localStorage.getItem('pog_sus_responses') || '[]');
  const avgScore = susResults.length > 0 ? Math.round(susResults.reduce((a,b)=>a+b.score,0)/susResults.length) : null;
  const getGrade = (s) => s>=90?{label:'Excellent',color:'#1e5a2c'}:s>=80?{label:'Good',color:'#2d7a2d'}:s>=70?{label:'OK',color:'#e67e22'}:s>=51?{label:'Poor',color:'#c0392b'}:{label:'Needs Work',color:'#7e2a2a'};

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Pool of Grace platform management console \u2014 Agnes Berko, Founder</p>
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
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px',marginBottom:'36px' }}>
        {panels.map((p,i)=>(
          <div key={i} className="premium-card" style={{ padding:'24px',display:'flex',flexDirection:'column' }}>
            <div style={{ width:'42px',height:'42px',background:'var(--primary-pale)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'800',fontSize:'16px',color:'var(--primary)',marginBottom:'14px' }}>{p.icon}</div>
            <h3 style={{ color:'var(--primary)',marginBottom:'6px',fontSize:'16px',fontWeight:'700' }}>{p.title}</h3>
            <p style={{ color:'var(--text-muted)',fontSize:'13px',lineHeight:'1.6',marginBottom:'18px',flex:1 }}>{p.desc}</p>
            <button className="btn-primary" style={{ width:'100%',fontSize:'13px' }} onClick={()=>openAdminPanel(p.key)}>{p.btn}</button>
          </div>
        ))}
      </div>

      {/* SUS Survey Results */}
      <div className="premium-card" style={{ padding:'clamp(18px,4vw,30px)',borderLeft:'5px solid var(--secondary)' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',marginBottom:'18px' }}>
          <div>
            <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'700',marginBottom:'3px' }}>SUS Survey Results</h3>
            <p style={{ color:'var(--text-muted)',fontSize:'13px' }}>System Usability Scale responses from participants — for supervisor</p>
          </div>
          <div style={{ display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap' }}>
            {susResults.length > 0 && (
              <button
                style={{ background:'var(--secondary)',color:'#fff',border:'none',padding:'9px 18px',borderRadius:'20px',fontWeight:'700',fontSize:'13px',cursor:'pointer' }}
                onClick={()=>{
                  const header = 'No,Name,Cohort,Date,Score,Grade';
                  const rows = susResults.map((r,i)=>{
                    const g = getGrade(r.score).label;
                    return `${i+1},"${r.name}","${r.cohort||''}","${r.date}",${r.score},"${g}"`;
                  });
                  const csv = [header,...rows].join('\n');
                  const blob = new Blob([csv],{type:'text/csv'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href=url; a.download='PoolOfGrace_SUS_Results.csv'; a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export CSV
              </button>
            )}
            {avgScore !== null && (
              <div style={{ textAlign:'center',background:'var(--primary-pale)',padding:'12px 20px',borderRadius:'12px' }}>
                <div style={{ fontSize:'clamp(22px,3vw,28px)',fontWeight:'800',color:'var(--primary)' }}>{avgScore}</div>
                <div style={{ fontSize:'11px',color:'var(--text-muted)',fontWeight:'600' }}>Avg SUS Score</div>
                <div style={{ fontSize:'11px',color:getGrade(avgScore).color,fontWeight:'700' }}>{getGrade(avgScore).label}</div>
              </div>
            )}
          </div>
        </div>

        {susResults.length === 0 ? (
          <div style={{ textAlign:'center',padding:'32px',color:'var(--text-muted)',background:'var(--bg-main)',borderRadius:'10px' }}>
            <p style={{ fontWeight:'700',marginBottom:'6px' }}>No survey responses yet</p>
            <p style={{ fontSize:'13px' }}>Once participants complete the Usability Survey, their responses will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participant</th>
                  <th>Cohort / Location</th>
                  <th>Date</th>
                  <th>SUS Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {susResults.map((r,i)=>{
                  const g = getGrade(r.score);
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight:'700',color:'var(--text-muted)' }}>{i+1}</td>
                      <td style={{ fontWeight:'600' }}>{r.name}</td>
                      <td style={{ color:'var(--text-muted)' }}>{r.cohort || '\u2014'}</td>
                      <td style={{ color:'var(--text-muted)' }}>{r.date}</td>
                      <td>
                        <span style={{ fontWeight:'800',fontSize:'16px',color:g.color }}>{r.score}</span>
                        <span style={{ color:'var(--text-muted)',fontSize:'11px' }}>/100</span>
                      </td>
                      <td>
                        <span className="badge" style={{ background:`${g.color}18`,color:g.color }}>{g.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
              <div style={{ display:'flex',gap:'10px',marginTop:'14px',flexWrap:'wrap' }}>
                <button className="btn-primary" style={{ flex:1 }} onClick={()=>{
                  // Print only the certificate div
                  const el = document.getElementById('cert-preview');
                  if (!el) return;
                  const w = window.open('','_blank','width=900,height=650');
                  w.document.write(`<!DOCTYPE html><html><head><title>Certificate - ${selected.title}</title><style>body{margin:0;padding:32px;font-family:Outfit,sans-serif;background:#fff;}@media print{body{padding:0;}}</style></head><body>${el.outerHTML}<script>window.onload=function(){window.print();window.close();}<\/script></body></html>`);
                  w.document.close();
                }}>
                  Download / Print Certificate
                </button>
                <button className="btn-outline" onClick={()=>{
                  const el = document.getElementById('cert-preview');
                  if (!el) return;
                  const blob = new Blob([`<!DOCTYPE html><html><head><title>Certificate</title><style>body{margin:32px;font-family:Arial,sans-serif;}</style></head><body>${el.outerHTML}</body></html>`], {type:'text/html'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `Certificate-Stage-${selected.order}.html`; a.click();
                  URL.revokeObjectURL(url);
                }}>Save as File</button>
              </div>
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
function RecordingsPage({ lang, user }) {
  void lang;

  const storedRecs = JSON.parse(localStorage.getItem('pog_recordings') || '[]');
  const [recordings, setRecordings] = useState(storedRecs);
  const isAdmin = user && user.role === 'admin';

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', url:'', host:'Agnes Berko', type:'general', date:'', duration:'' });

  const addRecording = () => {
    if (!form.title || !form.url) return;
    const entry = { id: Date.now(), ...form, date: form.date || new Date().toISOString().split('T')[0] };
    const updated = [entry, ...recordings];
    localStorage.setItem('pog_recordings', JSON.stringify(updated));
    setRecordings(updated);
    setForm({ title:'', url:'', host:'Agnes Berko', type:'general', date:'', duration:'' });
    setShowForm(false);
  };

  const deleteRecording = (id) => {
    const updated = recordings.filter(r => r.id !== id);
    localStorage.setItem('pog_recordings', JSON.stringify(updated));
    setRecordings(updated);
  };

  const typeColors = { general:'var(--primary)', module:'#7c5cbf', workshop:'#e67e22', career:'#16a085' };
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? recordings : recordings.filter(r => r.type === filter);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Session Recordings</h2>
        <p>Recorded general meetings, study sessions, and mentorship workshops</p>
      </div>

      {/* Admin: Add recording */}
      {isAdmin && (
        <div className="premium-card" style={{ padding:'22px 26px',marginBottom:'24px',borderLeft:'5px solid var(--secondary)' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom: showForm?'18px':0 }}>
            <h3 style={{ color:'var(--primary)',fontSize:'15px',fontWeight:'700',margin:0 }}>Add a Recording</h3>
            <button className={showForm?'btn-outline':'btn-primary'} style={{ fontSize:'13px',padding:'8px 18px' }} onClick={()=>setShowForm(f=>!f)}>
              {showForm ? 'Cancel' : 'Add Recording'}
            </button>
          </div>
          {showForm && (
            <div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',marginBottom:'12px' }}>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Title *</label>
                  <input className="premium-input" style={{ marginBottom:0 }} placeholder="e.g. General Meeting — Week 1" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Recording Link (YouTube / Drive / Meet) *</label>
                  <input className="premium-input" style={{ marginBottom:0 }} placeholder="https://..." value={form.url} onChange={e=>setForm({...form,url:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Host</label>
                  <input className="premium-input" style={{ marginBottom:0 }} placeholder="Agnes Berko" value={form.host} onChange={e=>setForm({...form,host:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Type</label>
                  <select className="premium-input" style={{ marginBottom:0 }} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option value="general">General Meeting</option>
                    <option value="module">Study Session</option>
                    <option value="workshop">Mentorship Workshop</option>
                    <option value="career">Career Talk</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Date</label>
                  <input className="premium-input" style={{ marginBottom:0 }} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Duration (e.g. 45 min)</label>
                  <input className="premium-input" style={{ marginBottom:0 }} placeholder="45 min" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} />
                </div>
              </div>
              <button className="btn-primary" onClick={addRecording} disabled={!form.title||!form.url}>Add Recording</button>
            </div>
          )}
        </div>
      )}

      {recordings.length === 0 ? (
        <div className="premium-card" style={{ padding:'60px',textAlign:'center' }}>
          <div style={{ width:'70px',height:'70px',background:'var(--primary-pale)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',color:'var(--primary)' }}>
            <Icons.Video2 />
          </div>
          <h3 style={{ color:'var(--primary)',fontWeight:'800',fontSize:'18px',marginBottom:'10px' }}>No recordings yet</h3>
          <p style={{ color:'var(--text-muted)',fontSize:'14px',maxWidth:'420px',margin:'0 auto 20px',lineHeight:'1.7' }}>
            Session recordings will be added here after each Saturday general meeting and study session. Check back after the next meeting!
          </p>
          <div style={{ background:'var(--primary-pale)',padding:'16px 22px',borderRadius:'12px',display:'inline-block',textAlign:'left' }}>
            <p style={{ fontSize:'13px',color:'var(--primary)',fontWeight:'600',margin:'0 0 4px' }}>Next Saturday Meeting</p>
            <p style={{ fontSize:'13px',color:'var(--text-muted)',margin:0 }}>Every Saturday at 4:00 PM Ghana Time (GMT)</p>
            <a href="https://meet.google.com/bii-jzew-udd" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-block',marginTop:'10px',background:'var(--primary)',color:'#fff',padding:'8px 18px',borderRadius:'18px',fontSize:'13px',fontWeight:'700',textDecoration:'none' }}>
              Join Live on Google Meet
            </a>
          </div>
          {!isAdmin && (
            <p style={{ fontSize:'13px',color:'var(--text-muted)',marginTop:'22px' }}>
              To request a recording be uploaded, email{' '}
              <a href="mailto:a.berko1@alustudent.com" style={{ color:'var(--primary)',fontWeight:'700' }}>a.berko1@alustudent.com</a>
            </p>
          )}
        </div>
      ) : (
        <div>
          {/* Filters */}
          <div style={{ display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap' }}>
            {[['all','All'],['general','General Meetings'],['module','Study Sessions'],['workshop','Workshops'],['career','Career Talks']].map(([key,label])=>(
              <button key={key} onClick={()=>setFilter(key)} style={{
                padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',
                border:'2px solid '+(filter===key?'var(--primary-light)':'var(--primary-pale)'),
                background:filter===key?'var(--primary-light)':'#fff',
                color:filter===key?'#fff':'var(--text-muted)',transition:'var(--transition)',fontFamily:'inherit'
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
            {filtered.map(rec=>(
              <div key={rec.id} className="premium-card" style={{ padding:'0',overflow:'hidden',display:'flex',flexWrap:'wrap' }}>
                <div style={{ width:'clamp(80px,18vw,140px)',background:`${typeColors[rec.type]||'var(--primary)'}18`,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px',padding:'20px',borderRight:'1px solid var(--primary-pale)',flexShrink:0 }}>
                  <div style={{ color:typeColors[rec.type]||'var(--primary)' }}><Icons.Video2 /></div>
                  <div style={{ fontSize:'10px',fontWeight:'700',color:typeColors[rec.type]||'var(--primary)',textAlign:'center',textTransform:'uppercase',letterSpacing:'0.5px' }}>{rec.type}</div>
                </div>
                <div style={{ flex:1,padding:'18px 22px',minWidth:'200px' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'10px' }}>
                    <div style={{ flex:1 }}>
                      <h3 style={{ color:'var(--primary)',fontSize:'clamp(14px,2.5vw,16px)',fontWeight:'700',margin:'0 0 6px' }}>{rec.title}</h3>
                      <div style={{ fontSize:'13px',color:'var(--text-muted)',display:'flex',gap:'16px',flexWrap:'wrap' }}>
                        {rec.host && <span>Host: <strong>{rec.host}</strong></span>}
                        {rec.date && <span>{rec.date}</span>}
                        {rec.duration && <span>{rec.duration}</span>}
                      </div>
                    </div>
                    <div style={{ display:'flex',gap:'8px',flexShrink:0,alignItems:'center' }}>
                      <a href={rec.url} target="_blank" rel="noopener noreferrer"
                        style={{ padding:'8px 16px',fontSize:'13px',background:'var(--primary)',color:'#fff',borderRadius:'20px',fontWeight:'700',textDecoration:'none' }}>
                        Watch
                      </a>
                      {isAdmin && (
                        <button onClick={()=>deleteRecording(rec.id)} style={{ background:'none',border:'1px solid #e05252',color:'#e05252',borderRadius:'20px',padding:'8px 14px',cursor:'pointer',fontSize:'13px',fontFamily:'inherit',fontWeight:'600' }}>Remove</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ANNOUNCEMENTS PAGE
   ========================================================= */
function AnnouncementsPage({ lang, user }) {
  void lang;

  const defaultAnnouncements = [
    { id:1, priority:'high',   title:'New Cohort — June 2026 Applications Now Open',          body:'Pool of Grace is accepting new participants for the June 2026 cohort. Eligible women aged 16-30 in Kumasi and Accra can apply now. Share with friends and family who would benefit from this free program.',                                                                                                                              date:'2026-06-17', author:'Agnes Berko (Admin)', pinned:true  },
    { id:2, priority:'normal', title:'Weekly Saturday Meeting — 4:00 PM Ghana Time',           body:'Join our weekly general meeting every Saturday at 4:00 PM Ghana Time (GMT) via Google Meet. Link: https://meet.google.com/bii-jzew-udd — This week we will be discussing Module 3: Building Self-Efficacy.',                                                                                                                               date:'2026-06-14', author:'Agnes Berko',          pinned:true  },
    { id:3, priority:'normal', title:'Office Hours Now Available — Book with Agnes',           body:'Individual office hours with Agnes Berko are now bookable on Tuesdays, Fridays, and Saturdays from 2:00 PM to 3:00 PM Ghana Time. Visit the Mentorship page to book your slot. You can also email a.berko1@alustudent.com.',                                                                                                              date:'2026-06-12', author:'Agnes Berko',          pinned:false },
    { id:4, priority:'normal', title:'Module Recordings Now Available',                        body:'Session recordings for Weeks 1 and 2 are now available in the Recordings section. You can watch or download any session you missed. New recordings are uploaded every Sunday after Saturday meetings.',                                                                                                                                    date:'2026-06-10', author:'Pool of Grace System',  pinned:false },
    { id:5, priority:'low',    title:'Community Forum Guidelines',                             body:'A reminder to keep all forum posts respectful, supportive, and on-topic. Pool of Grace is a safe space for all young women. Any harassment or inappropriate content will be removed. Report issues to admin.',                                                                                                                             date:'2026-06-07', author:'Agnes Berko',          pinned:false },
    { id:6, priority:'low',    title:'ALU Research Ethics Compliance Notice',                  body:'Pool of Grace is operating under ALU Research Ethics Committee approval. All participant data is confidential, stored securely, and will not be shared. Your participation is entirely voluntary and you may withdraw at any time. See the Privacy and Ethics page for full details.',                                                       date:'2026-06-03', author:'Agnes Berko (Researcher)', pinned:false },
  ];

  const storedExtra = JSON.parse(localStorage.getItem('pog_announcements') || '[]');
  const [announcements, setAnnouncements] = useState([...storedExtra, ...defaultAnnouncements]);
  const [active, setActive] = useState(null);
  const isAdmin = user && user.role === 'admin';

  // New announcement form (admin only)
  const [showForm, setShowForm] = useState(false);
  const [newAnn, setNewAnn] = useState({ title:'', body:'', priority:'normal', pinned:false });

  const postAnnouncement = () => {
    if (!newAnn.title || !newAnn.body) return;
    const entry = {
      id: Date.now(), ...newAnn,
      date: new Date().toISOString().split('T')[0],
      author: 'Agnes Berko (Admin)',
    };
    const updated = [entry, ...storedExtra];
    localStorage.setItem('pog_announcements', JSON.stringify(updated));
    setAnnouncements([entry, ...announcements]);
    setNewAnn({ title:'', body:'', priority:'normal', pinned:false });
    setShowForm(false);
    setActive(entry);
  };

  const deleteAnnouncement = (id) => {
    const updatedExtra = storedExtra.filter(a => a.id !== id);
    localStorage.setItem('pog_announcements', JSON.stringify(updatedExtra));
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (active && active.id === id) setActive(null);
  };

  const priorityStyle = {
    high:   { bg:'#fff0f0', border:'#e05252', label:'Important' },
    normal: { bg:'#fff',    border:'var(--primary-pale)', label:'' },
    low:    { bg:'#fafafa', border:'#e0e0e0', label:'' },
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Announcements</h2>
        <p>Important updates, meeting notices, and platform news from Pool of Grace</p>
      </div>

      {/* Admin: Post new announcement */}
      {isAdmin && (
        <div className="premium-card" style={{ padding:'22px 26px',marginBottom:'24px',borderLeft:'5px solid var(--secondary)' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom: showForm ? '18px' : 0 }}>
            <h3 style={{ color:'var(--primary)',fontSize:'15px',fontWeight:'700',margin:0 }}>Post New Announcement</h3>
            <button className={showForm ? 'btn-outline' : 'btn-primary'} style={{ fontSize:'13px',padding:'8px 18px' }} onClick={()=>setShowForm(f=>!f)}>
              {showForm ? 'Cancel' : 'New Announcement'}
            </button>
          </div>
          {showForm && (
            <div>
              <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Title *</label>
              <input className="premium-input" placeholder="Announcement title..." value={newAnn.title} onChange={e=>setNewAnn({...newAnn,title:e.target.value})} />
              <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Message *</label>
              <textarea className="premium-input" style={{ minHeight:'80px',resize:'vertical',marginBottom:'12px' }} placeholder="Announcement details..." value={newAnn.body} onChange={e=>setNewAnn({...newAnn,body:e.target.value})} />
              <div style={{ display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap',marginBottom:'14px' }}>
                <div>
                  <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Priority</label>
                  <select className="premium-input" style={{ marginBottom:0,width:'auto' }} value={newAnn.priority} onChange={e=>setNewAnn({...newAnn,priority:e.target.value})}>
                    <option value="normal">Normal</option>
                    <option value="high">Important (red)</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <label style={{ display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',marginTop:'16px' }}>
                  <input type="checkbox" checked={newAnn.pinned} onChange={e=>setNewAnn({...newAnn,pinned:e.target.checked})} style={{ accentColor:'var(--primary)',width:'16px',height:'16px' }} />
                  <span style={{ fontSize:'13px',fontWeight:'600' }}>Pin to top</span>
                </label>
              </div>
              <button className="btn-primary" onClick={postAnnouncement} disabled={!newAnn.title||!newAnn.body}>Post Announcement</button>
            </div>
          )}
        </div>
      )}

      <div className="two-col-panel" style={{ alignItems:'flex-start' }}>
        {/* List */}
        <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
          {announcements.map(a => {
            const s = priorityStyle[a.priority] || priorityStyle.normal;
            const isCustom = storedExtra.some(e => e.id === a.id);
            return (
              <div key={a.id} onClick={()=>setActive(a)} style={{
                padding:'16px 18px',borderRadius:'12px',cursor:'pointer',transition:'var(--transition)',
                border:'2px solid '+(active?.id===a.id?'var(--primary-light)':s.border),
                background:active?.id===a.id?'var(--primary-pale)':s.bg,
                position:'relative'
              }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px' }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    {a.pinned && <span className="badge badge-amber" style={{ marginBottom:'5px',display:'inline-block' }}>Pinned</span>}
                    {a.priority==='high' && !a.pinned && <span className="badge" style={{ background:'#ffe0e0',color:'#b93a3a',marginBottom:'5px',display:'inline-block' }}>Important</span>}
                    <h4 style={{ color:'var(--primary)',fontSize:'14px',fontWeight:'700',margin:'0 0 4px',lineHeight:'1.4' }}>{a.title}</h4>
                    <p style={{ color:'var(--text-muted)',fontSize:'12px',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{a.body.substring(0,70)}...</p>
                  </div>
                  {isAdmin && isCustom && (
                    <button onClick={e=>{e.stopPropagation();deleteAnnouncement(a.id);}} style={{ background:'none',border:'none',color:'#e05252',cursor:'pointer',fontSize:'16px',padding:'2px 6px',flexShrink:0 }}>X</button>
                  )}
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
      content:`All participants are assigned unique identification codes (e.g., POG001, POG002, etc.). Your name and personal identifiers will never appear in research reports, academic publications, or conference presentations.\n\nOnly the researcher (Agnes Berko) and the academic supervisor (Ndinelao Iitumba, ALU) will have access to identifiable information. All findings are reported in aggregate form.\n\nElectronic data is stored securely on a password-protected Google Drive. Audio recordings are encrypted. Interview transcripts are anonymized by removing all names before analysis. Data will be retained for five (5) years following project completion and then securely destroyed.`,
    },
    {
      title:'5. Data Storage and Retention',
      content:`• Assign ID codes: POG001, POG002, etc. for all participants\n• Store consent forms separately: locked cabinet or password-protected folder\n• Store data securely: password-protected Google Drive\n• Anonymize transcripts: remove all names before analysis\n• Retain data: keep for 5 years after project completion (2031)\n• Destroy data: securely delete and destroy all data after 5 years`,
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
    {
      title:'9. Research Methodology and Data Collection Plan',
      content:`Below is the outline of tasks and actions forming the data collection plan for this capstone study:\n\n• Interviews: Schedule and conduct 15 semi-structured interviews\n• Transcribing: Transcribe interviews (or use AI transcription tool)\n• Analyzing: Use thematic analysis in NVivo (or manually)\n• Beta Testing: Schedule and conduct User Acceptance Testing (UAT) with 20 participants\n• SUS Survey: Administer the System Usability Scale (SUS) survey after UAT\n• Feedback Interviews: Conduct 20–30 minute feedback sessions after UAT`,
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

  // Editable profile fields persisted in localStorage
  const savedProfile = JSON.parse(localStorage.getItem('pog_profile') || '{}');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName:  savedProfile.firstName  || (user ? user.firstName : ''),
    lastName:   savedProfile.lastName   || (user ? user.lastName  : ''),
    bio:        savedProfile.bio        || '',
    location:   savedProfile.location   || '',
    photoUrl:   savedProfile.photoUrl   || '',
  });

  const saveProfile = () => {
    localStorage.setItem('pog_profile', JSON.stringify(form));
    setEditing(false);
  };

  const displayName = `${form.firstName} ${form.lastName}`.trim() || 'Participant';
  const initials = `${(form.firstName||'')[0]}${(form.lastName||'')[0]}`.toUpperCase() || 'PG';

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
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'14px',marginBottom:'22px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'20px',flexWrap:'wrap' }}>
            {/* Avatar */}
            {form.photoUrl ? (
              <img src={form.photoUrl} alt={displayName} style={{ width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',border:'3px solid var(--primary)',flexShrink:0 }}
                onError={e=>{e.target.style.display='none';}} />
            ) : (
              <div style={{ width:'80px',height:'80px',borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--primary-light))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'28px',fontWeight:'800',flexShrink:0 }}>
                {initials}
              </div>
            )}
            <div>
              <h3 style={{ color:'var(--primary)',fontSize:'clamp(18px,3vw,22px)',fontWeight:'800',margin:'0 0 4px' }}>{displayName}</h3>
              <p style={{ color:'var(--text-muted)',fontSize:'14px',margin:'0 0 4px' }}>{user ? user.email : ''}</p>
              {form.location && <p style={{ color:'var(--text-muted)',fontSize:'13px',margin:'0 0 6px' }}>{form.location}</p>}
              {form.bio && <p style={{ color:'var(--text-main)',fontSize:'13px',margin:'0 0 6px',fontStyle:'italic' }}>"{form.bio}"</p>}
              <span className="badge" style={{ background:'var(--primary-pale)',color:'var(--primary)',textTransform:'capitalize' }}>
                {user ? user.role : 'participant'}
              </span>
            </div>
          </div>
          <button className="btn-outline" style={{ fontSize:'13px',padding:'8px 18px' }} onClick={()=>setEditing(e=>!e)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div style={{ background:'var(--bg-main)',padding:'20px',borderRadius:'12px',border:'2px solid var(--primary-pale)',marginBottom:'22px' }}>
            <h4 style={{ color:'var(--primary)',fontWeight:'700',marginBottom:'14px',fontSize:'15px' }}>Edit Your Profile</h4>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',marginBottom:'12px' }}>
              <div>
                <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>First Name</label>
                <input className="premium-input" style={{ marginBottom:0 }} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="First name" />
              </div>
              <div>
                <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Last Name</label>
                <input className="premium-input" style={{ marginBottom:0 }} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Last name" />
              </div>
              <div>
                <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Location (City, Country)</label>
                <input className="premium-input" style={{ marginBottom:0 }} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Kumasi, Ghana" />
              </div>
              <div>
                <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Photo URL (optional)</label>
                <input className="premium-input" style={{ marginBottom:0 }} value={form.photoUrl} onChange={e=>setForm({...form,photoUrl:e.target.value})} placeholder="https://example.com/photo.jpg" />
              </div>
            </div>
            <div style={{ marginBottom:'14px' }}>
              <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Short Bio (1-2 sentences)</label>
              <textarea className="premium-input" style={{ marginBottom:0,minHeight:'72px',resize:'vertical' }} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell us a little about yourself..." />
            </div>
            <button className="btn-primary" style={{ padding:'10px 28px' }} onClick={saveProfile}>Save Profile</button>
          </div>
        )}

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
function SUSPage({ lang, showToast }) {

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
    if (showToast) showToast(`Survey submitted! Your SUS score is ${Math.round(susScore)}/100. Thank you!`);
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

/* =========================================================
   FORGOT PASSWORD PAGE
   ========================================================= */
function ForgotPassword({ go }) {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="premium-card auth-card animate-fade-in">
        <div style={{ textAlign:'center',marginBottom:'26px' }}>
          <h2 style={{ color:'var(--primary)',fontWeight:'800',fontSize:'clamp(20px,4vw,24px)' }}>Reset Password</h2>
          <p style={{ color:'var(--text-muted)',fontSize:'14px',marginTop:'6px' }}>Enter your email and we will send instructions</p>
        </div>

        {sent ? (
          <div>
            <div className="alert-success" style={{ marginBottom:'22px',textAlign:'center' }}>
              <strong>Email Sent!</strong><br/>
              Password reset instructions have been sent to <strong>{email}</strong>.<br/>
              Please check your inbox (including spam).
            </div>
            <div className="alert-info" style={{ marginBottom:'22px',fontSize:'13px' }}>
              <strong>Note:</strong> If you do not receive an email within 5 minutes, please contact Agnes Berko directly at{' '}
              <a href="mailto:a.berko1@alustudent.com" style={{ color:'var(--primary)',fontWeight:'700' }}>a.berko1@alustudent.com</a>.
            </div>
            <button className="btn-primary" style={{ width:'100%' }} onClick={()=>go('login')}>Back to Login</button>
          </div>
        ) : (
          <div>
            <label style={{ fontSize:'13px',fontWeight:'600',display:'block',marginBottom:'5px' }}>Your Email Address</label>
            <input
              className="premium-input"
              placeholder="agnes@example.com"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
            <button className="btn-primary" style={{ width:'100%',marginTop:'6px' }}
              disabled={!email}
              onClick={()=>setSent(true)}>
              Send Reset Instructions
            </button>
            <p style={{ textAlign:'center',marginTop:'18px',color:'var(--text-muted)',fontSize:'14px' }}>
              Remembered it?{' '}
              <span style={{ color:'var(--primary-light)',cursor:'pointer',fontWeight:'700' }} onClick={()=>go('login')}>Back to Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CONSENT FORM PAGE
   ========================================================= */
function ConsentFormPage({ lang }) {
  void lang;
  const [agreed, setAgreed] = useState(false);
  const [name, setName]     = useState('');
  const [signed, setSigned] = useState(false);
  const dateStr = new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});

  const handlePrint = () => {
    window.print();
  };

  if (signed) return (
    <div className="animate-fade-in" style={{ maxWidth:'700px',margin:'0 auto' }}>
      <div className="premium-card" style={{ padding:'clamp(28px,5vw,44px)',textAlign:'center' }}>
        <div style={{ width:'70px',height:'70px',background:'var(--primary)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',color:'#fff',fontSize:'28px',fontWeight:'800' }}>C</div>
        <h2 style={{ color:'var(--primary)',fontSize:'clamp(18px,3vw,22px)',fontWeight:'800',marginBottom:'10px' }}>Consent Recorded</h2>
        <p style={{ color:'var(--text-muted)',fontSize:'14px',marginBottom:'22px',lineHeight:'1.7' }}>
          Thank you, <strong>{name}</strong>. Your informed consent has been recorded for the Pool of Grace research study.
          Agnes Berko will keep this on file. You may withdraw your consent at any time by contacting the researcher.
        </p>
        <button className="btn-outline" onClick={handlePrint} style={{ marginRight:'10px' }}>Print this Page</button>
        <button className="btn-primary" onClick={()=>setSigned(false)}>Back to Form</button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth:'760px',margin:'0 auto' }}>
      <div className="page-header">
        <h2>Participant Informed Consent Form</h2>
        <p>Pool of Grace — ALU Capstone Research Study 2026</p>
      </div>

      <div className="premium-card" style={{ padding:'clamp(22px,4vw,36px)',marginBottom:'24px' }}>
        {/* Study info */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',marginBottom:'24px' }}>
          {[
            ['Study Title',      'Pool of Grace — A Digital Learning Platform for Young Women in Technology'],
            ['Researcher',       'Agnes Adepa Berko, ALU BSc. Software Engineering'],
            ['Supervisor',       'Ndinelao Iitumba, African Leadership University'],
            ['Ethics Reference', 'ALU Research Ethics Committee (REC) — 2026'],
            ['Duration',         'June 2026 — approximately 4 weeks of participation'],
            ['Contact',          'a.berko1@alustudent.com'],
          ].map(([label,val],i)=>(
            <div key={i} style={{ padding:'12px 14px',background:'var(--bg-main)',borderRadius:'9px',border:'1px solid var(--primary-pale)' }}>
              <div style={{ fontSize:'11px',fontWeight:'700',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'3px' }}>{label}</div>
              <div style={{ fontSize:'13px',color:'var(--text-main)',fontWeight:'500' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        {[
          ['Purpose of the Study', 'This study investigates the usability and effectiveness of the Pool of Grace digital learning platform designed to support young women in Ghana in gaining technology skills and career confidence. Your participation involves using the platform, completing learning modules, and providing feedback.'],
          ['What You Will Do', 'You will: (1) Register on the Pool of Grace platform; (2) Complete at least one learning module; (3) Complete the System Usability Scale (SUS) survey; (4) Optionally participate in a mentorship session. Total time commitment: approximately 1-3 hours over 4 weeks.'],
          ['Risks and Benefits', 'There are no known risks to participating in this study beyond normal computer use. Benefits include free access to all 20 learning modules, mentorship from Ghanaian tech professionals, and certificates of completion. Your participation also contributes to research improving access to technology education for young women in Ghana.'],
          ['Confidentiality', 'All data is anonymized. Your name will never appear in research reports. Only the researcher and supervisor will have access to identifiable data. All electronic data is stored on encrypted, password-protected devices. Data will be retained for 5 years and then securely destroyed.'],
          ['Voluntary Participation', 'Your participation is completely voluntary. You may withdraw at any time without penalty or negative consequence. If you wish to withdraw, simply contact Agnes Berko at a.berko1@alustudent.com and all your data will be removed.'],
          ['Questions', 'If you have any questions about this research, please contact Agnes Adepa Berko at a.berko1@alustudent.com or the ALU Research Ethics Committee at ethics@alueducation.com.'],
        ].map(([title,body],i)=>(
          <div key={i} style={{ marginBottom:'18px',paddingBottom:'18px',borderBottom:'1px solid var(--primary-pale)' }}>
            <h4 style={{ color:'var(--primary)',fontWeight:'700',marginBottom:'6px',fontSize:'14px' }}>{i+1}. {title}</h4>
            <p style={{ color:'var(--text-main)',fontSize:'13px',lineHeight:'1.8',margin:0 }}>{body}</p>
          </div>
        ))}

        {/* Signature block */}
        <div style={{ background:'var(--bg-main)',padding:'20px',borderRadius:'12px',border:'2px solid var(--primary-pale)',marginTop:'8px' }}>
          <h4 style={{ color:'var(--primary)',fontWeight:'700',marginBottom:'14px',fontSize:'15px' }}>Declaration of Consent</h4>
          <p style={{ fontSize:'13px',color:'var(--text-main)',lineHeight:'1.7',marginBottom:'16px' }}>
            I confirm that I have read and understood the information above. I understand what I am being asked to do, the possible risks and benefits, and that my participation is voluntary. I agree to take part in this research study.
          </p>

          <label style={{ fontSize:'13px',fontWeight:'700',display:'block',marginBottom:'5px' }}>Full Name *</label>
          <input className="premium-input" style={{ marginBottom:'12px' }} placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} />

          <label style={{ display:'flex',alignItems:'flex-start',gap:'10px',cursor:'pointer',marginBottom:'18px' }}>
            <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ width:'16px',height:'16px',marginTop:'2px',accentColor:'var(--primary)',flexShrink:0 }} />
            <span style={{ fontSize:'13px',color:'var(--text-main)',lineHeight:'1.6' }}>
              I, <strong>{name || '(your name)'}</strong>, voluntarily agree to participate in this research study conducted by Agnes Adepa Berko at the African Leadership University. I understand I may withdraw at any time.
            </span>
          </label>

          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px' }}>
            <p style={{ fontSize:'12px',color:'var(--text-muted)',margin:0 }}>Date: {dateStr}</p>
            <div style={{ display:'flex',gap:'10px' }}>
              <button className="btn-outline" onClick={handlePrint}>Print Form</button>
              <button className="btn-primary" disabled={!agreed||!name} onClick={()=>setSigned(true)}>Submit Consent</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PRACTICE LAB — Interactive Coding Playground
   ========================================================= */
function PracticeLab({ lang, modules, showToast }) {
  void lang;
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [filterCat, setFilterCat] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  // Persistence
  const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };
  const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const [completed, setCompleted] = useState(() => getStorage('pog_practice_completed', []));
  const [xp, setXp] = useState(() => getStorage('pog_practice_xp', 0));
  const [streak, setStreak] = useState(() => getStorage('pog_practice_streak', { count: 0, lastDate: '' }));

  const today = new Date().toISOString().split('T')[0];
  const isStreakActive = streak.lastDate === today || streak.lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const xpForLevel = (lvl) => lvl * 100;
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  const challenges = [
    // HTML/CSS — Easy
    { id:'html1', cat:'HTML/CSS', diff:'Easy', xp:10, title:'Ghana Flag with CSS', desc:'Create the Ghana flag using 3 colored divs (red, gold, green) and a black star in the center.', starter:'<div style="width:300px">\n  <!-- Red stripe -->\n  <div style="height:60px; background:red;"></div>\n  <!-- Gold stripe with star -->\n  <div style="height:60px; background:#FFD700; text-align:center; line-height:60px;">\n    <!-- Add black star here -->\n  </div>\n  <!-- Green stripe -->\n  <div style="height:60px; background:green;"></div>\n</div>', hints:['Use a span with color:black and font-size:40px for the star','The star character is  (&#9733;)','<span style="color:black;font-size:40px"></span>'], type:'html', solution:'star' },
    { id:'html2', cat:'HTML/CSS', diff:'Easy', xp:10, title:'Profile Card', desc:'Create a styled profile card with a name, title, and a green border. Use CSS to make it look professional.', starter:'<div style="border:3px solid green; border-radius:12px; padding:24px; max-width:300px; text-align:center; font-family:sans-serif;">\n  <h2>Your Name</h2>\n  <p style="color:gray;">Junior Developer</p>\n  <p>Kumasi, Ghana</p>\n</div>', hints:['Add a background-color to make it stand out','Add box-shadow for depth: box-shadow:0 4px 12px rgba(0,0,0,0.1)','Add a colored circle as an avatar using border-radius:50%'], type:'html', solution:'name' },
    { id:'html3', cat:'HTML/CSS', diff:'Medium', xp:25, title:'Responsive Navigation Bar', desc:'Build a horizontal navigation bar with 4 links that uses flexbox and changes color on hover.', starter:'<nav style="display:flex; background:#1e5a2c; padding:12px 20px; gap:20px;">\n  <a href="#" style="color:#fff; text-decoration:none;">Home</a>\n  <!-- Add 3 more links -->\n  <!-- Add hover effect hint: use onmouseover -->\n</nav>', hints:['Add links for About, Modules, Contact','Use gap property for spacing between links','For hover: onmouseover="this.style.color=\'#FFD700\'" onmouseout="this.style.color=\'#fff\'"'], type:'html', solution:'modules' },
    { id:'html4', cat:'HTML/CSS', diff:'Medium', xp:25, title:'Product Card Grid', desc:'Create a 2-column grid of product cards for a Ghanaian shea butter shop using CSS Grid.', starter:'<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:500px;">\n  <div style="border:1px solid #ddd; border-radius:10px; padding:16px;">\n    <h3>Shea Butter (Raw)</h3>\n    <p style="color:green; font-weight:bold;">GH₵ 25.00</p>\n  </div>\n  <!-- Add 3 more product cards -->\n</div>', hints:['Copy the first card div and change the product name and price','Try products like: Shea Soap, Body Lotion, Hair Cream','Add a button: <button style="background:green;color:#fff;border:none;padding:8px 16px;border-radius:6px;">Buy Now</button>'], type:'html', solution:'butter' },
    { id:'html5', cat:'HTML/CSS', diff:'Hard', xp:50, title:'Landing Page Hero Section', desc:'Build a complete hero section for a tech school landing page with a gradient background, heading, subtext, and CTA button.', starter:'<div style="background:linear-gradient(135deg, #1e5a2c, #3cb371); color:#fff; padding:60px 30px; text-align:center; border-radius:16px; font-family:sans-serif;">\n  <h1 style="font-size:32px; margin-bottom:12px;">Learn to Code in Ghana</h1>\n  <!-- Add subtitle paragraph -->\n  <!-- Add CTA button -->\n</div>', hints:['Add: <p style="opacity:0.85;font-size:16px;max-width:500px;margin:0 auto 24px">Free coding education for young women in Kumasi, Accra, and Takoradi</p>','Add a white button: <button style="background:#fff;color:#1e5a2c;border:none;padding:14px 32px;border-radius:30px;font-size:16px;font-weight:bold;cursor:pointer">Start Learning Free</button>','Add metrics below: <div style="display:flex;justify-content:center;gap:40px;margin-top:32px"><div><div style="font-size:28px;font-weight:800">500+</div><div style="opacity:0.7;font-size:12px">Students</div></div></div>'], type:'html', solution:'learning' },

    // JavaScript — Easy
    { id:'js1', cat:'JavaScript', diff:'Easy', xp:10, title:'Cedi to Dollar Converter', desc:'Write a function that converts Ghana Cedis (GHS) to US Dollars. Use the rate: 1 USD = 15.5 GHS.', starter:'function cediToDollar(cedis) {\n  // 1 USD = 15.5 GHS\n  // Return the dollar amount rounded to 2 decimal places\n  \n}\n\n// Test it:\nconsole.log(cediToDollar(100));\nconsole.log(cediToDollar(250));', hints:['Divide cedis by the exchange rate: cedis / 15.5','Use Math.round(value * 100) / 100 to round to 2 decimals','return Math.round((cedis / 15.5) * 100) / 100;'], type:'js', solution:'6.45' },
    { id:'js2', cat:'JavaScript', diff:'Easy', xp:10, title:'Greeting Generator', desc:'Write a function that returns a personalized greeting based on the time of day (morning, afternoon, evening).', starter:'function greet(name, hour) {\n  // hour is 0-23\n  // 5-11 = morning, 12-16 = afternoon, 17+ = evening\n  \n}\n\nconsole.log(greet("Ama", 9));\nconsole.log(greet("Kwame", 14));\nconsole.log(greet("Efua", 20));', hints:['Use if/else if/else to check the hour ranges','Morning: hour >= 5 && hour < 12','Return template literal: `Good morning, ${name}!`'], type:'js', solution:'Good morning' },
    { id:'js3', cat:'JavaScript', diff:'Medium', xp:25, title:'Ghana Regions Quiz Scorer', desc:'Write a function that takes an array of quiz answers and scores them against correct answers. Return the score out of 5.', starter:'function scoreQuiz(answers) {\n  const correct = ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Cape Coast"];\n  // Compare each answer to correct array\n  // Return count of matches\n  \n}\n\nconsole.log(scoreQuiz(["Accra", "Kumasi", "Tamale", "Sunyani", "Cape Coast"]));\nconsole.log(scoreQuiz(["Accra", "Accra", "Accra", "Accra", "Accra"]));', hints:['Use a loop or .filter() to count matches','answers.filter((a, i) => a === correct[i]).length','let score = 0; for(let i=0; i<answers.length; i++) { if(answers[i] === correct[i]) score++; } return score;'], type:'js', solution:'4' },
    { id:'js4', cat:'JavaScript', diff:'Medium', xp:25, title:'Mobile Money Transaction Logger', desc:'Create a function that logs mobile money transactions and calculates the balance. Start with GH₵ 500.', starter:'function mobileMoneyLog(transactions) {\n  let balance = 500;\n  // Each transaction: { type: "send" or "receive", amount: number, to/from: string }\n  // Process each and log it\n  // Return final balance\n  \n}\n\nconst txns = [\n  { type: "receive", amount: 200, from: "Ama" },\n  { type: "send", amount: 50, to: "Kwame" },\n  { type: "send", amount: 100, to: "MTN Bill" },\n  { type: "receive", amount: 75, from: "Salary" }\n];\nconsole.log("Final balance: GH₵", mobileMoneyLog(txns));', hints:['Loop through transactions: for(const tx of transactions)','If type is "receive", add to balance; if "send", subtract','Use console.log inside the loop to show each transaction detail'], type:'js', solution:'625' },
    { id:'js5', cat:'JavaScript', diff:'Hard', xp:50, title:'Student Grade Calculator', desc:'Build a grade calculator that takes an array of student objects with names and scores, and returns each student with a letter grade (A: 80+, B: 60-79, C: 40-59, F: below 40).', starter:'function calculateGrades(students) {\n  // For each student, add a "grade" property\n  // A: 80-100, B: 60-79, C: 40-59, F: 0-39\n  // Return the modified array\n  \n}\n\nconst students = [\n  { name: "Abena", score: 92 },\n  { name: "Kwaku", score: 67 },\n  { name: "Yaa", score: 45 },\n  { name: "Kofi", score: 33 }\n];\n\nconst results = calculateGrades(students);\nresults.forEach(s => console.log(`${s.name}: ${s.score} → Grade ${s.grade}`));', hints:['Use .map() to create a new array with the grade added','Use ternary or if/else: score >= 80 ? "A" : score >= 60 ? "B" : ...','return students.map(s => ({...s, grade: s.score >= 80 ? "A" : s.score >= 60 ? "B" : s.score >= 40 ? "C" : "F"}));'], type:'js', solution:'Grade A' },

    // Python (conceptual)
    { id:'py1', cat:'Python', diff:'Easy', xp:10, title:'List Ghana Regions', desc:'Write a Python script that creates a list of all 16 Ghana regions and prints each one with its number.', starter:'# Create a list of Ghana regions\nregions = [\n    "Greater Accra",\n    "Ashanti",\n    # Add 14 more regions...\n]\n\n# Print each region with its number\nfor i, region in enumerate(regions, 1):\n    print(f"{i}. {region}")', hints:['Regions include: Western, Central, Eastern, Volta, Northern, etc.','The new regions: Bono East, Ahafo, Western North, Oti, Savannah, North East','Use enumerate(regions, 1) to start counting from 1'], type:'python', solution:'16 regions' },
    { id:'py2', cat:'Python', diff:'Medium', xp:25, title:'Market Price Calculator', desc:'Write a Python function that calculates the total cost of market items with a 5% NHIL tax.', starter:'# Market price calculator with NHIL tax\ndef calculate_total(items):\n    """\n    items = [(name, price, quantity), ...]\n    Apply 5% NHIL tax to subtotal\n    """\n    subtotal = 0\n    for name, price, qty in items:\n        subtotal += price * qty\n        print(f"  {name}: {qty} x GH₵{price} = GH₵{price*qty}")\n    \n    tax = subtotal * 0.05\n    total = subtotal + tax\n    print(f"  Subtotal: GH₵{subtotal}")\n    print(f"  NHIL (5%): GH₵{tax}")\n    print(f"  Total: GH₵{total}")\n    return total\n\n# Test\nitems = [("Rice (5kg)", 85, 2), ("Cooking Oil", 45, 1), ("Tomatoes", 15, 3)]', hints:['Loop through items and multiply price × quantity for each','Tax = subtotal × 0.05','Total = subtotal + tax'], type:'python', solution:'GH₵' },
    { id:'py3', cat:'Python', diff:'Hard', xp:50, title:'Student Dictionary Manager', desc:'Create a dictionary-based student management system that stores students by ID and supports add, search, and grade average operations.', starter:'# Student management with dictionaries\nstudents = {}\n\ndef add_student(sid, name, grades):\n    students[sid] = {"name": name, "grades": grades}\n\ndef get_average(sid):\n    if sid in students:\n        grades = students[sid]["grades"]\n        return sum(grades) / len(grades)\n    return None\n\ndef top_student():\n    # Find student with highest average\n    # Return their name and average\n    pass\n\n# Test\nadd_student("POG001", "Abena Asante", [85, 92, 78, 95])\nadd_student("POG002", "Kwame Mensah", [70, 65, 80, 75])\nadd_student("POG003", "Ama Darko", [95, 98, 92, 88])\n\nprint(f"Abena avg: {get_average(\'POG001\')}")\nprint(f"Top: {top_student()}")', hints:['For top_student, iterate through students.items()','Use max() with a key function on the averages','best = max(students.items(), key=lambda x: sum(x[1]["grades"])/len(x[1]["grades"]))'], type:'python', solution:'average' },

    // SQL
    { id:'sql1', cat:'SQL', diff:'Easy', xp:10, title:'Query Student Records', desc:'Write a SQL SELECT statement to get all students from the "students" table who scored above 70.', starter:'-- Table: students (id, name, region, score, enrolled_date)\n-- Write a query to find all students with score > 70\n-- Order by score descending\n\nSELECT \n  \nFROM students\nWHERE \nORDER BY ;', hints:['SELECT name, region, score','WHERE score > 70','ORDER BY score DESC'], type:'sql', solution:'SELECT' },
    { id:'sql2', cat:'SQL', diff:'Medium', xp:25, title:'Join Students with Courses', desc:'Write a JOIN query to combine the students table with the enrollments table to show which courses each student is taking.', starter:'-- Tables:\n-- students (id, name, region)\n-- enrollments (id, student_id, course_name, grade)\n\n-- Show each student with their courses and grades\n\nSELECT \n  \nFROM students\n  JOIN enrollments\nWHERE ;', hints:['SELECT s.name, e.course_name, e.grade','JOIN enrollments e ON s.id = e.student_id','Use table aliases: FROM students s JOIN enrollments e ON s.id = e.student_id'], type:'sql', solution:'JOIN' },
    { id:'sql3', cat:'SQL', diff:'Hard', xp:50, title:'Regional Statistics Report', desc:'Write a SQL query using GROUP BY and aggregate functions to show how many students are in each Ghana region and their average score.', starter:'-- Generate a regional education report\n-- Show: region, student_count, avg_score, max_score\n-- Only show regions with more than 5 students\n-- Order by average score descending\n\nSELECT\n  \nFROM students\nGROUP BY \nHAVING \nORDER BY ;', hints:['SELECT region, COUNT(*) as student_count, AVG(score) as avg_score, MAX(score) as max_score','GROUP BY region','HAVING COUNT(*) > 5 and ORDER BY avg_score DESC'], type:'sql', solution:'GROUP BY' },
  ];

  const filtered = challenges.filter(c =>
    (filterCat === 'All' || c.cat === filterCat) &&
    (filterDiff === 'All' || c.diff === filterDiff)
  );

  const completeChallenge = (challengeId, earnedXp) => {
    if (completed.includes(challengeId)) return;
    const newCompleted = [...completed, challengeId];
    const newXp = xp + earnedXp;
    const newStreak = today === streak.lastDate ? streak :
      (streak.lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0])
        ? { count: streak.count + 1, lastDate: today }
        : { count: 1, lastDate: today };

    setCompleted(newCompleted);
    setXp(newXp);
    setStreak(newStreak);
    setStorage('pog_practice_completed', newCompleted);
    setStorage('pog_practice_xp', newXp);
    setStorage('pog_practice_streak', newStreak);
    if (showToast) showToast(`+${earnedXp} XP earned! Challenge complete.`);
  };

  const runCode = (ch) => {
    if (ch.type === 'js') {
      try {
        let logs = [];
        const mockConsole = { log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')) };
        const fn = new Function('console', code);
        fn(mockConsole);
        const out = logs.join('\n');
        setOutput(out);
        if (ch.solution && out.includes(ch.solution)) {
          completeChallenge(ch.id, ch.xp);
        }
      } catch (err) {
        setOutput('Error: ' + err.message);
      }
    } else if (ch.type === 'html') {
      if (ch.solution && code.toLowerCase().includes(ch.solution.toLowerCase())) {
        completeChallenge(ch.id, ch.xp);
      }
    } else {
      if (ch.solution && code.toLowerCase().includes(ch.solution.toLowerCase())) {
        completeChallenge(ch.id, ch.xp);
      }
    }
  };

  const practBadges = [
    { id:'code_starter', name:'Code Starter', icon:'*', need:1, desc:'Complete 1 challenge' },
    { id:'loop_master', name:'Loop Master', icon:'*', need:5, desc:'Complete 5 challenges' },
    { id:'debug_queen', name:'Debug Queen', icon:'*', need:10, desc:'Complete 10 challenges' },
    { id:'full_stack', name:'Full Stack Warrior', icon:'*', need:15, desc:'Complete 15 challenges' },
    { id:'ghana_coder', name:'Ghana Coder', icon:'GH', need:18, desc:'Complete 18 challenges' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Practice Lab</h2>
        <p>Interactive Ghana-contextualized coding challenges. Earn XP, badges, and build your skills.</p>
      </div>

      {/* XP & Streak Bar */}
      <div className="xp-bar" style={{ marginBottom:'22px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'8px' }}>
          <span style={{ color:'#f1c40f' }}><Icons.Star /></span>
          <span style={{ fontWeight:'800',fontSize:'18px' }}>{xp} XP</span>
          <span style={{ fontSize:'12px',opacity:0.7 }}>Level {currentLevel}</span>
        </div>
        <div style={{ flex:1,background:'rgba(255,255,255,0.1)',borderRadius:'8px',height:'8px',margin:'0 16px' }}>
          <div className="xp-fill" style={{ width:`${(xpInLevel/100)*100}%` }}></div>
        </div>
        {isStreakActive && streak.count > 0 && (
          <div className="streak-flame"><Icons.Zap /> {streak.count} Day Streak</div>
        )}
        <div style={{ fontSize:'13px',opacity:0.7 }}>{completed.length}/{challenges.length} done</div>
      </div>

      {/* Practice Badges Preview */}
      <div style={{ display:'flex',gap:'10px',marginBottom:'22px',flexWrap:'wrap' }}>
        {practBadges.map(b => (
          <div key={b.id} style={{ display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',borderRadius:'20px', background:completed.length>=b.need?'var(--primary-pale)':'#f5f5f5', border:`2px solid ${completed.length>=b.need?'var(--primary-light)':'#e0e0e0'}`, opacity:completed.length>=b.need?1:0.5 }}>
            <span style={{ fontSize:'16px' }}>{b.icon}</span>
            <span style={{ fontSize:'12px',fontWeight:'700',color:completed.length>=b.need?'var(--primary)':'#999' }}>{b.name}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:'10px',marginBottom:'22px',flexWrap:'wrap' }}>
        <div>
          <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Category</label>
          <select className="premium-input" style={{ marginBottom:0,padding:'8px 12px',minWidth:'130px' }} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
            {['All','HTML/CSS','JavaScript','Python','SQL'].map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:'12px',fontWeight:'700',display:'block',marginBottom:'4px' }}>Difficulty</label>
          <select className="premium-input" style={{ marginBottom:0,padding:'8px 12px',minWidth:'130px' }} value={filterDiff} onChange={e=>setFilterDiff(e.target.value)}>
            {['All','Easy','Medium','Hard'].map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="two-col-panel" style={{ alignItems:'flex-start' }}>
        {/* Challenge List */}
        <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
          {filtered.map(ch => (
            <div key={ch.id} className={`challenge-card${activeChallenge?.id===ch.id?' active':''}`} onClick={()=>{setActiveChallenge(ch);setCode(ch.starter);setOutput('');setHintsUsed(0);}}>
              <div style={{ padding:'16px 20px' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px' }}>
                  <span className={`badge difficulty-${ch.diff.toLowerCase()}`}>{ch.diff}</span>
                  <div style={{ display:'flex',alignItems:'center',gap:'6px' }}>
                    <span style={{ fontSize:'11px',color:'var(--text-muted)' }}>{ch.cat}</span>
                    {completed.includes(ch.id) && <span className="badge badge-green">Done</span>}
                  </div>
                </div>
                <h4 style={{ color:'var(--primary)',margin:'0 0 4px',fontSize:'14px',fontWeight:'700' }}>{ch.title}</h4>
                <p style={{ color:'var(--text-muted)',fontSize:'12px',margin:0 }}>+{ch.xp} XP</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color:'var(--text-muted)',padding:'20px',textAlign:'center' }}>No challenges match your filters.</p>}
        </div>

        {/* Editor Panel */}
        <div>
          {activeChallenge ? (
            <div className="premium-card" style={{ padding:'24px' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'14px',flexWrap:'wrap',gap:'8px' }}>
                <div>
                  <span className={`badge difficulty-${activeChallenge.diff.toLowerCase()}`} style={{ marginBottom:'6px' }}>{activeChallenge.diff} • {activeChallenge.cat}</span>
                  <h3 style={{ color:'var(--primary)',fontSize:'18px',fontWeight:'800',margin:'6px 0 0' }}>{activeChallenge.title}</h3>
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:'6px',color:'#f1c40f' }}>
                  <Icons.Star /><span style={{ fontWeight:'800',fontSize:'15px' }}>+{activeChallenge.xp} XP</span>
                </div>
              </div>
              <p style={{ color:'var(--text-main)',fontSize:'14px',lineHeight:'1.7',marginBottom:'18px' }}>{activeChallenge.desc}</p>

              {/* Code Editor */}
              <textarea className="code-editor-area" value={code} onChange={e=>setCode(e.target.value)} spellCheck="false" />

              {/* Action buttons */}
              <div style={{ display:'flex',gap:'10px',marginTop:'12px',flexWrap:'wrap' }}>
                <button className="btn-primary" style={{ padding:'10px 22px',fontSize:'13px' }} onClick={()=>runCode(activeChallenge)}>
                  <Icons.Play /> Run Code
                </button>
                <button className="btn-outline" style={{ padding:'10px 18px',fontSize:'13px' }} onClick={()=>{setCode(activeChallenge.starter);setOutput('');}}>
                  <Icons.Reset /> Reset
                </button>
                {hintsUsed < activeChallenge.hints.length && (
                  <button className="btn-outline" style={{ padding:'10px 18px',fontSize:'13px',borderColor:'#fbbf24',color:'#92400e' }} onClick={()=>setHintsUsed(h=>h+1)}>
                    Hint {hintsUsed+1}/{activeChallenge.hints.length}
                  </button>
                )}
                {completed.includes(activeChallenge.id) && <span className="badge badge-green" style={{ padding:'8px 16px' }}>Completed Done</span>}
              </div>

              {/* Hints */}
              {hintsUsed > 0 && (
                <div style={{ marginTop:'14px',display:'flex',flexDirection:'column',gap:'8px' }}>
                  {activeChallenge.hints.slice(0, hintsUsed).map((h,i) => (
                    <div key={i} className="hint-box"><strong>Hint {i+1}:</strong> {h}</div>
                  ))}
                </div>
              )}

              {/* Output / Preview */}
              {activeChallenge.type === 'html' ? (
                <div style={{ marginTop:'18px' }}>
                  <h4 style={{ fontSize:'13px',fontWeight:'700',marginBottom:'8px',color:'var(--text-muted)' }}>Live Preview</h4>
                  <iframe title="preview" className="code-preview-frame" srcDoc={code} sandbox="allow-scripts" style={{ minHeight:'220px' }} />
                </div>
              ) : output && (
                <div style={{ marginTop:'18px' }}>
                  <h4 style={{ fontSize:'13px',fontWeight:'700',marginBottom:'8px',color:'var(--text-muted)' }}>Console Output</h4>
                  <div className="code-output-box">{output || 'No output yet. Click "Run Code".'}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="premium-card" style={{ padding:'48px',textAlign:'center',color:'var(--text-muted)' }}>
              <Icons.Code />
              <h3 style={{ color:'var(--primary)',margin:'16px 0 8px' }}>Select a Challenge</h3>
              <p style={{ fontSize:'14px' }}>Click any challenge from the list to start coding!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ACHIEVEMENTS — Trophy Room & Badge System
   ========================================================= */
function AchievementsPage({ user, modules, lang }) {
  void lang;
  const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };
  const completed = modules ? modules.filter(m => m.completed) : [];
  const practiceCompleted = getStorage('pog_practice_completed', []);
  const practiceXp = getStorage('pog_practice_xp', 0);
  const streak = getStorage('pog_practice_streak', { count: 0 });
  const forumPosts = getStorage('pog_forum_posts_count', 0);

  const selfWorthDone = completed.filter(m => m.category === 'self-worth').length;
  const techDone = completed.filter(m => m.category === 'technical-skills').length;
  const careerDone = completed.filter(m => m.category === 'professional-development').length;

  const allBadges = [
    // Module badges
    { id:'first_module', name:'First Step', icon:'*', color:'#2d7a2d', desc:'Complete your first module', earned: completed.length >= 1, category:'Learning' },
    { id:'halfway', name:'Halfway Hero', icon:'', color:'#e67e22', desc:'Complete 10 modules', earned: completed.length >= 10, category:'Learning' },
    { id:'sw_champion', name:'Self-Worth Champion', icon:'*', color:'#9b59b6', desc:'Complete all 7 self-worth modules', earned: selfWorthDone >= 7, category:'Learning' },
    { id:'tech_pioneer', name:'Tech Pioneer', icon:'*', color:'#3498db', desc:'Complete all 7 tech modules', earned: techDone >= 7, category:'Learning' },
    { id:'career_ready', name:'Career Ready', icon:'*', color:'#e74c3c', desc:'Complete all 6 career modules', earned: careerDone >= 6, category:'Learning' },
    { id:'graduate', name:'Pool of Grace Graduate', icon:'*', color:'#f1c40f', desc:'Complete all 20 modules', earned: completed.length >= 20, category:'Learning' },

    // Practice badges
    { id:'code_starter', name:'Code Starter', icon:'*', color:'#27ae60', desc:'Complete 1 practice challenge', earned: practiceCompleted.length >= 1, category:'Practice' },
    { id:'loop_master', name:'Loop Master', icon:'*', color:'#2980b9', desc:'Complete 5 practice challenges', earned: practiceCompleted.length >= 5, category:'Practice' },
    { id:'debug_queen', name:'Debug Queen', icon:'*', color:'#8e44ad', desc:'Complete 10 practice challenges', earned: practiceCompleted.length >= 10, category:'Practice' },
    { id:'full_stack_warrior', name:'Full Stack Warrior', icon:'*', color:'#c0392b', desc:'Complete 15 practice challenges', earned: practiceCompleted.length >= 15, category:'Practice' },
    { id:'xp_collector', name:'XP Collector', icon:'*', color:'#f39c12', desc:'Earn 500 XP in Practice Lab', earned: practiceXp >= 500, category:'Practice' },

    // Streak badges
    { id:'streak_3', name:'3-Day Streak', icon:'*', color:'#e67e22', desc:'Maintain a 3-day learning streak', earned: streak.count >= 3, category:'Dedication' },
    { id:'streak_7', name:'Week Warrior', icon:'*', color:'#d35400', desc:'Maintain a 7-day learning streak', earned: streak.count >= 7, category:'Dedication' },
    { id:'streak_14', name:'Streak Queen', icon:'*', color:'#c0392b', desc:'Maintain a 14-day learning streak', earned: streak.count >= 14, category:'Dedication' },

    // Community badges
    { id:'first_post', name:'Voice Heard', icon:'*', color:'#1abc9c', desc:'Make your first forum post', earned: forumPosts >= 1, category:'Community' },
    { id:'community_builder', name:'Community Builder', icon:'*', color:'#16a085', desc:'Make 5+ forum posts', earned: forumPosts >= 5, category:'Community' },

    // Special
    { id:'offline_warrior', name:'Offline Warrior', icon:'*', color:'#7f8c8d', desc:'Used the platform in offline mode', earned: getStorage('pog_used_offline', false), category:'Special' },
    { id:'cv_builder', name:'Career Crafter', icon:'*', color:'#34495e', desc:'Used the CV Builder', earned: getStorage('pog_used_cv', false), category:'Special' },
  ];

  const earnedCount = allBadges.filter(b => b.earned).length;
  const categories = ['Learning', 'Practice', 'Dedication', 'Community', 'Special'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Achievements & Badges</h2>
        <p>Your trophy room — collect badges by completing modules, practicing code, and engaging with the community.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom:'28px' }}>
        <div className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:'4px solid #f1c40f' }}>
          <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:'#f1c40f' }}>{earnedCount}</div>
          <div style={{ fontSize:'13px',fontWeight:'700' }}>Badges Earned</div>
          <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>out of {allBadges.length}</div>
        </div>
        <div className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:'4px solid var(--primary-light)' }}>
          <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:'var(--primary)' }}>{practiceXp}</div>
          <div style={{ fontSize:'13px',fontWeight:'700' }}>Total XP</div>
          <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>Practice Lab</div>
        </div>
        <div className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:'4px solid #e67e22' }}>
          <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:'#e67e22' }}>{streak.count}</div>
          <div style={{ fontSize:'13px',fontWeight:'700' }}>Day Streak</div>
          <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>Best streak</div>
        </div>
        <div className="premium-card" style={{ padding:'22px',textAlign:'center',borderTop:'4px solid #9b59b6' }}>
          <div style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:'800',color:'#9b59b6' }}>{completed.length}/20</div>
          <div style={{ fontSize:'13px',fontWeight:'700' }}>Modules Done</div>
          <div style={{ fontSize:'12px',color:'var(--text-muted)' }}>Course progress</div>
        </div>
      </div>

      {/* Progress to next badge */}
      {earnedCount < allBadges.length && (() => {
        const next = allBadges.find(b => !b.earned);
        return next ? (
          <div className="premium-card" style={{ padding:'20px 24px',marginBottom:'28px',borderLeft:'5px solid #f1c40f',display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap' }}>
            <div style={{ width:'48px',height:'48px',borderRadius:'50%',background:`${next.color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:0 }}>{next.icon}</div>
            <div style={{ flex:1,minWidth:'180px' }}>
              <div style={{ fontWeight:'700',fontSize:'14px',color:'var(--primary)' }}>Next Badge: {next.name}</div>
              <div style={{ fontSize:'13px',color:'var(--text-muted)' }}>{next.desc}</div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Badge Categories */}
      {categories.map(cat => {
        const catBadges = allBadges.filter(b => b.category === cat);
        return (
          <div key={cat} style={{ marginBottom:'32px' }}>
            <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'700',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px' }}>
              {cat === 'Learning' ? <Icons.Modules /> : cat === 'Practice' ? <Icons.Code /> : cat === 'Dedication' ? <Icons.Zap /> : cat === 'Community' ? <Icons.Forum /> : <Icons.Star />}
              {cat} Badges
              <span style={{ fontSize:'12px',color:'var(--text-muted)',fontWeight:'400' }}>({catBadges.filter(b=>b.earned).length}/{catBadges.length})</span>
            </h3>
            <div className="badge-grid">
              {catBadges.map(badge => (
                <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon" style={{ background: badge.earned ? `${badge.color}22` : '#eee', color: badge.earned ? badge.color : '#ccc' }}>
                    <span style={{ fontSize:'28px' }}>{badge.icon}</span>
                  </div>
                  <div className="badge-name" style={{ color: badge.earned ? badge.color : '#999' }}>{badge.name}</div>
                  <div className="badge-desc">{badge.desc}</div>
                  {badge.earned && <div style={{ position:'absolute',top:'8px',right:'8px',color:badge.color }}><Icons.Check /></div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   DISCOVER & SHARE — How Ghana Finds Pool of Grace
   ========================================================= */
function DiscoverPage({ lang, go }) {
  void lang;
  const [copied, setCopied] = useState(false);
  const [referralName, setReferralName] = useState('');
  const [referrals, setReferrals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pog_referrals')) || []; } catch { return []; }
  });

  const siteUrl = 'https://poolofgrace.org';
  const whatsappMsg = encodeURIComponent(` *Pool of Grace* — Free Tech Training for Young Women in Ghana!\n\n* Learn HTML, CSS, JavaScript, Python & SQL\n* Earn certificates & build your CV\n* Get mentorship from Ghanaian tech professionals\n* Works offline!\n\n Join free: ${siteUrl}\n\n#PoolOfGrace #WomenInTech #GhanaTech`);

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const addReferral = () => {
    if (!referralName.trim()) return;
    const newList = [...referrals, { name: referralName.trim(), date: new Date().toLocaleDateString() }];
    setReferrals(newList);
    localStorage.setItem('pog_referrals', JSON.stringify(newList));
    setReferralName('');
  };

  const outreachPartners = [
    { name:'Ghana Education Service Schools', desc:'Pool of Grace partners with GES to reach senior high school girls through ICT clubs and career counseling programs across all 16 regions.', color:'#2d7a2d', icon:'', action:'Contact your school ICT teacher to request Pool of Grace access' },
    { name:'Churches & Faith Organizations', desc:'Many young women in Ghana attend church regularly. Pool of Grace shares program flyers through youth groups and Sunday school announcements.', color:'#7c5cbf', icon:'', action:'Ask your church youth leader to announce Pool of Grace during service' },
    { name:'KNUST, UCC & UG Student Groups', desc:'University student organizations like WIT (Women in Tech) clubs help spread Pool of Grace to female students studying computer science and engineering.', color:'#e67e22', icon:'*', action:'Join your university WIT group and share Pool of Grace with members' },
    { name:'Community Libraries & Internet Cafés', desc:'Public libraries in Kumasi, Accra, and Takoradi host Pool of Grace access points where girls can use computers to study offline modules.', color:'#3498db', icon:'', action:'Visit your local community library and ask about Pool of Grace computer access' },
    { name:'MTN/Vodafone WiFi Zones', desc:'Pool of Grace works on low-bandwidth connections. Students can access the platform at MTN WiFi hotspots or Vodafone community internet points.', color:'#f1c40f', icon:'', action:'Find your nearest MTN WiFi zone and register for Pool of Grace there' },
    { name:'Radio & Community Announcements', desc:'Local FM stations in Kumasi (Luv FM, Angel FM) and Accra (Citi FM, Joy FM) broadcast Pool of Grace community announcements in English and Twi.', color:'#e74c3c', icon:'', action:'Listen for Pool of Grace announcements on your local radio station' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Share Pool of Grace</h2>
        <p>Help more young women in Ghana discover free tech education. Every share creates an opportunity.</p>
      </div>

      {/* Share Card */}
      <div className="share-card" style={{ marginBottom:'28px' }}>
        <h3 style={{ fontSize:'20px',fontWeight:'800',marginBottom:'6px' }}>Share Pool of Grace</h3>
        <p style={{ opacity:0.8,fontSize:'14px',marginBottom:'18px' }}>Share this link with any young woman in Ghana who wants to learn technology for free</p>

        {/* QR Code area */}
        <div className="qr-placeholder">
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'11px',color:'#999',marginBottom:'6px',fontWeight:'600' }}>SCAN TO JOIN</div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:'2px',width:'120px',margin:'0 auto' }}>
              {Array.from({length:64}).map((_,i) => (
                <div key={i} style={{ width:'13px',height:'13px',background: [0,1,2,5,6,7,8,15,16,23,24,31,32,39,40,47,48,55,56,57,58,61,62,63].includes(i)?'#000':'#fff',borderRadius:'1px' }}></div>
              ))}
            </div>
            <div style={{ fontSize:'9px',color:'#666',marginTop:'6px' }}>poolofgrace.org</div>
          </div>
        </div>

        <div style={{ display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap' }}>
          <button className="btn-primary" style={{ background:'#fff',color:'var(--primary)' }} onClick={copyLink}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
            <button className="whatsapp-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.547 4.099 1.504 5.832L0 24l6.335-1.652A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.876 0-3.63-.508-5.14-1.392l-.37-.218-3.821.998 1.018-3.714-.24-.38A9.78 9.78 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"/></svg>
              Share on WhatsApp
            </button>
          </a>
        </div>
      </div>

      {/* Bring a Sister */}
      <div className="premium-card" style={{ padding:'clamp(20px,4vw,28px)',marginBottom:'28px',borderLeft:'5px solid #e74c3c' }}>
        <h3 style={{ color:'#e74c3c',fontSize:'17px',fontWeight:'800',marginBottom:'6px',display:'flex',alignItems:'center',gap:'8px' }}>
          <span style={{ fontSize:'22px' }}>*</span> Bring a Sister Program
        </h3>
        <p style={{ color:'var(--text-muted)',fontSize:'14px',lineHeight:'1.7',marginBottom:'18px' }}>
          For every friend you invite to Pool of Grace, you earn the <strong>"Sister Keeper"</strong> badge and help close the gender gap in Ghana's tech industry. Track your referrals below.
        </p>
        <div style={{ display:'flex',gap:'10px',marginBottom:'14px' }}>
          <input className="premium-input" style={{ marginBottom:0,flex:1 }} placeholder="Your friend's name (e.g., Ama Mensah)" value={referralName} onChange={e=>setReferralName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addReferral()} />
          <button className="btn-primary" style={{ padding:'10px 22px',fontSize:'13px' }} onClick={addReferral}>Add Referral</button>
        </div>
        {referrals.length > 0 && (
          <div style={{ display:'flex',flexWrap:'wrap',gap:'8px' }}>
            {referrals.map((r,i) => (
              <span key={i} className="badge badge-green" style={{ padding:'6px 14px',fontSize:'12px' }}>
                {r.name} — {r.date}
              </span>
            ))}
          </div>
        )}
        {referrals.length === 0 && <p style={{ color:'var(--text-muted)',fontSize:'13px' }}>No referrals yet. Invite your first sister!</p>}
      </div>

      {/* How People Access Pool of Grace */}
      <div style={{ marginBottom:'28px' }}>
        <h3 className="section-heading" style={{ marginBottom:'18px' }}>How People in Ghana Access Pool of Grace</h3>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'18px' }}>
          {outreachPartners.map((p,i) => (
            <div key={i} className="partner-card" style={{ borderTop:`4px solid ${p.color}` }}>
              <div style={{ display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px' }}>
                <span style={{ fontSize:'28px' }}>{p.icon}</span>
                <h4 style={{ color:p.color,fontSize:'15px',fontWeight:'700',margin:0 }}>{p.name}</h4>
              </div>
              <p style={{ color:'var(--text-main)',fontSize:'13px',lineHeight:'1.7',marginBottom:'12px' }}>{p.desc}</p>
              <div style={{ background:`${p.color}12`,padding:'10px 14px',borderRadius:'8px',fontSize:'12.5px',color:p.color,fontWeight:'600' }}>
                Action: {p.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radio Script Template */}
      <div className="premium-card" style={{ padding:'clamp(20px,4vw,28px)',marginBottom:'28px' }}>
        <h3 style={{ color:'var(--primary)',fontSize:'16px',fontWeight:'800',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px' }}>
          <span style={{ fontSize:'20px' }}></span> Community Radio Announcement Template
        </h3>
        <div className="code-block" style={{ background:'#f8fdf8',color:'var(--text-main)',border:'2px solid var(--primary-pale)',fontFamily:'Outfit, sans-serif' }}>
          <p style={{ fontWeight:'700',marginBottom:'8px' }}> FOR IMMEDIATE BROADCAST</p>
          <p style={{ lineHeight:'1.8',fontSize:'13px' }}>
            <em>"Attention all young women in [YOUR TOWN]. Are you interested in learning computer programming, web development, and technology skills — completely FREE?</em><br/><br/>
            <em>Pool of Grace is a new digital learning platform designed specifically for young women in Ghana. You will learn HTML, CSS, JavaScript, Python, and SQL. You will receive certificates, mentorship from professional Ghanaian tech women, and career placement support.</em><br/><br/>
            <em>The platform works OFFLINE — so even if your internet is slow, you can still learn.</em><br/><br/>
            <em>Visit poolofgrace.org on any phone or computer to register for FREE. Pool of Grace — empowering young women through technology."</em>
          </p>
        </div>
        <button className="btn-outline" style={{ marginTop:'14px',fontSize:'13px' }} onClick={()=>{window.print();}}>Print This Template</button>
      </div>

      {/* What Makes Us Unique */}
      <div className="premium-card" style={{ padding:'clamp(20px,4vw,28px)',background:'linear-gradient(135deg, var(--primary-pale), #f0faf0)',borderLeft:'5px solid var(--primary)' }}>
        <h3 style={{ color:'var(--primary)',fontSize:'17px',fontWeight:'800',marginBottom:'18px' }}>What Makes Pool of Grace Different</h3>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'14px' }}>
          {[
            { icon:'*', title:'Self-Worth First', desc:'We build your confidence BEFORE teaching code. No other platform does this.' },
            { icon:'GH', title:'Made for Ghana', desc:'All examples use Ghanaian data — Cedis, regions, local businesses. Plus Twi language support.' },
            { icon:'*', title:'100% Free Forever', desc:'SheCodes charges $99+. We charge nothing. Your dreams should not have a price tag.' },
            { icon:'*', title:'Works Offline', desc:'Download modules and study without internet. Perfect for areas with unreliable connectivity.' },
            { icon:'*', title:'Earn Real Badges', desc:'Interactive practice challenges with XP, badges, and certificates to build your portfolio.' },
            { icon:'*', title:'Ghanaian Mentors', desc:'Real mentorship from women working at MTN, Vodafone, Hubtel, and GCB Bank.' },
          ].map((item,i) => (
            <div key={i} style={{ display:'flex',gap:'12px',alignItems:'flex-start' }}>
              <span style={{ fontSize:'24px',flexShrink:0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight:'700',fontSize:'14px',color:'var(--primary)',marginBottom:'3px' }}>{item.title}</div>
                <div style={{ fontSize:'12.5px',color:'var(--text-muted)',lineHeight:'1.5' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CV BUILDER COMPONENT
   ========================================================= */
function CVBuilder({ user, modules, lang }) {
  void lang;
  
  // Fetch bio and location from profile
  const savedProfile = JSON.parse(localStorage.getItem('pog_profile') || '{}');
  const bio = savedProfile.bio || 'Young woman tech professional in training, seeking software engineering opportunities in Ghana.';
  const location = savedProfile.location || 'Accra, Ghana';
  const phone = savedProfile.phone || '';
  const firstName = savedProfile.firstName || (user ? user.firstName : 'Participant');
  const lastName = savedProfile.lastName || (user ? user.lastName : '');
  const email = user ? user.email : '';
  
  const completed = modules ? modules.filter(m => m.completed) : [];
  const selfWorthCompletions = completed.filter(m => m.category === 'self-worth');
  const techCompletions = completed.filter(m => m.category === 'technical-skills');
  
  const getSkillsList = () => {
    const skills = [];
    if (completed.some(m => m.id === 8)) skills.push('HTML5 & CSS3', 'Web Design');
    if (completed.some(m => m.id === 9)) skills.push('JavaScript (ES6+)');
    if (completed.some(m => m.id === 10)) skills.push('DOM Manipulation', 'Responsive UI');
    if (completed.some(m => m.id === 11)) skills.push('Python programming');
    if (completed.some(m => m.id === 12)) skills.push('SQL & Relational Databases');
    if (completed.some(m => m.id === 13)) skills.push('Full-Stack Web Development');
    if (completed.some(m => m.id === 14)) skills.push('Git & GitHub Version Control');
    
    // Add default core soft skills from self worth
    skills.push('Goal Setting', 'Self-Efficacy', 'Problem Solving', 'Team Collaboration');
    return skills;
  };
  
  const skills = getSkillsList();
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header no-print">
        <h2>Professional CV Builder</h2>
        <p>Your dynamic, job-ready resume generated from your learning achievements at Pool of Grace.</p>
        <div style={{ marginTop: '14px' }}>
          <button className="btn-primary" onClick={handlePrint} style={{ padding: '10px 22px', fontSize: '13px' }}>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="premium-card cv-print-container" style={{ padding: '40px', background: '#fff', border: '1px solid #e0e0e0', color: '#333', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Outfit, sans-serif' }}>
        {/* Header Section */}
        <div className="cv-print-header" style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '16px', marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {firstName} {lastName}
          </h1>
          <div style={{ fontSize: '13px', color: '#666', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontStyle: 'italic' }}>
            <span>Email: {email}</span>
            {phone && <span>Phone: {phone}</span>}
            <span>Location: {location}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="cv-section-title" style={{ fontSize: '14px', color: 'var(--primary)', borderBottom: '1px solid #ccc', paddingBottom: '4px', margin: '18px 0 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Professional Summary
          </h3>
          <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.6', textAlign: 'justify' }}>
            {bio}
          </p>
        </div>

        {/* Education & Platform Certification */}
        <div>
          <h3 className="cv-section-title" style={{ fontSize: '14px', color: 'var(--primary)', borderBottom: '1px solid #ccc', paddingBottom: '4px', margin: '18px 0 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Education & Certifications
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
              <span>Pool of Grace Learning Platform (Capacitation Program)</span>
              <span>2026</span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '12px', color: '#666' }}>
              Empowering Young Women through Technical Skills, Mentorship, and Self-Worth (ALU Capstone Cohort, Ghana)
            </div>
            <ul style={{ margin: '6px 0 0 18px', padding: '0', fontSize: '12.5px', lineHeight: '1.5' }}>
              <li>Completed <strong>{completed.length}/20 Modules</strong> spanning Self-Worth Development, Technical Foundations, and Professional Skills.</li>
              {selfWorthCompletions.length > 0 && (
                <li><strong>Self-Worth Foundation:</strong> Mastered cognitive strategies to challenge tech gender stereotypes, set SMART career goals, and build technical self-efficacy.</li>
              )}
              {techCompletions.length > 0 && (
                <li><strong>Technical Track:</strong> Acquired hands-on experience in frontend web technologies, logic scripting, and database querying.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Technical & Soft Skills */}
        <div>
          <h3 className="cv-section-title" style={{ fontSize: '14px', color: 'var(--primary)', borderBottom: '1px solid #ccc', paddingBottom: '4px', margin: '18px 0 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Skills & Competencies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '0', padding: '0' }}>
            {skills.map((skill, index) => (
              <span key={index} style={{ background: '#f4f4f4', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', border: '1px solid #e0e0e0', color: '#444' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Practical Projects */}
        <div>
          <h3 className="cv-section-title" style={{ fontSize: '14px', color: 'var(--primary)', borderBottom: '1px solid #ccc', paddingBottom: '4px', margin: '18px 0 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Projects
          </h3>
          
          {/* Project 1: HTML & CSS Landing Page */}
          {completed.some(m => m.id === 10) ? (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Ghanaian Local Enterprise Product Showcase Page</div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#555', textAlign: 'justify' }}>
                Developed a responsive landing page highlighting a small business in Ghana (e.g. Shea Butter / Kente weaving). Structured with HTML5 semantic elements, styled using dynamic CSS layout schemes, and features an interactive order validation script.
              </p>
            </div>
          ) : null}

          {/* Project 2: Full Stack Directory */}
          {completed.some(m => m.id === 13) ? (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Community Resource Directory Web Application</div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#555', textAlign: 'justify' }}>
                Built a full-stack directory system connecting users to local Ghanaian community services. Engineered using React, styled with clean components, backend powered by Node.js/Express APIs, with a PostgreSQL database layer.
              </p>
            </div>
          ) : null}

          {completed.length === 0 && (
            <p style={{ fontStyle: 'italic', fontSize: '12px', color: '#777', margin: '0' }}>
              Projects will be displayed here as you complete Module 10 (Building Your First Website) and Module 13 (Web Development Project).
            </p>
          )}
        </div>

        {/* Mentorship & Professional Reference */}
        <div>
          <h3 className="cv-section-title" style={{ fontSize: '14px', color: 'var(--primary)', borderBottom: '1px solid #ccc', paddingBottom: '4px', margin: '18px 0 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Mentorship and References
          </h3>
          <div style={{ fontSize: '12.5px', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 4px' }}>
              <strong>Mentored by:</strong> Agnes Adepa Berko (Founder & Lead Instructor) and the Pool of Grace network of Ghanaian tech leaders.
            </p>
            <p style={{ margin: '0' }}>
              <strong>References:</strong> Available upon request. (Verification ID: POG-2026-{user ? user.id : 'USR'})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}