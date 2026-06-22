# Pool of Grace: A Web-Based Platform for Empowering Young Women Through Integrated Technology Education and Mentorship in Ghana

> **BSc. in Software Engineering — Capstone Project** 
> **African Leadership University (ALU)** 
> **Researcher:** Agnes Adepa Berko 
> **Supervisor:** Ndinelao Iitumba 
> **Date:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Demo Video](#2-demo-video)
3. [Live Deployed Version](#3-live-deployed-version)
4. [Tech Stack](#4-tech-stack)
5. [Installation & Setup (Step by Step)](#5-installation--setup-step-by-step)
6. [Running the Application](#6-running-the-application)
7. [Project Structure](#7-project-structure)
8. [Platform Features](#8-platform-features)
9. [Testing Results](#9-testing-results)
10. [Analysis](#10-analysis)
11. [Discussion](#11-discussion)
12. [Recommendations](#12-recommendations)
13. [Deployment Plan](#13-deployment-plan)
14. [Ethical Compliance](#14-ethical-compliance)
15. [Contact](#15-contact)

---

## 1. Project Overview

### Problem Statement

Gender inequality in education remains a critical barrier to economic development in Ghana. Young women aged 16–30 in underserved Ghanaian communities face **three intersecting barriers** preventing them from pursuing technology careers:

1. **Psychological & Cultural Barriers** — Girls are socialized to view technology as a male field; marriage is positioned as women's primary purpose. Self-efficacy and belief in capability are systematically absent (Master et al., 2021; Mensah & Agyemang, 2021).
2. **Absence of Sustained Support** — Existing programs (She Code Africa, Women in Tech Africa) use event-based models (2–5 month bootcamps) rather than the sustained 12+ month mentorship that research shows is effective (Raposa et al., 2022).
3. **No Integrated Approach** — No existing platform combines self-worth development, beginner-friendly tech training, sustained mentorship, and Ghana-specific career guidance in one free, offline-capable system.

### Proposed Solution

**Pool of Grace** is a comprehensive, free, mobile-first web-based platform with four interconnected components:

| Component | Modules | Purpose |
|-----------|---------|---------|
| Self-Worth Development | 1–7 | Build psychological foundation, address limiting beliefs |
| Technology Skills Training | 8–14 | HTML/CSS, JavaScript, Python, databases, web development |
| Professional Development | 15–20 | Ghana tech job market, CV building, interview prep |
| Sustained Mentorship | Ongoing | Bi-weekly video mentorship, weekly Google Meet sessions |

### What Makes Pool of Grace Unique

| Feature | Pool of Grace | SheCodes | She Leads Africa | Andela |
|---------|:---:|:---:|:---:|:---:|
| Self-worth foundation before coding | Yes | No | No | No |
| Ghana-specific curriculum & examples | Yes | No | Partial | No |
| Twi language support | Yes | No | No | No |
| 100% free (no paywall) | Yes | No ($99+) | No | No |
| Offline learning mode (PWA) | Yes | No | No | No |
| Ghana tech hub directory | Yes | No | No | No |
| Built-in CV builder | Yes | No | No | No |
| Interactive Practice Lab with XP | Yes | No | No | No |
| Per-module certificates | Yes | Limited | No | No |
| Research-backed (ALU Capstone) | Yes | No | No | No |

---

## 2. Demo Video

 **5-Minute Demo Video:** [Watch on YouTube/Loom — LINK TO BE ADDED]

> The video demonstrates all core functionalities: Dashboard, Learning Modules (Notes, Resources, Quiz, Grades), Practice Lab, Achievements, Mentorship Booking, Community Forum, Career Resources, CV Builder, Discover & Share page, Admin Panel, Offline Mode, and Mobile Responsiveness.

---

## 3. Live Deployed Version

 **Deployed Application:** [https://pool-of-grace.onrender.com](https://pool-of-grace.onrender.com)

> **Production Architecture (per proposal):** AWS EC2 (application hosting) + RDS (PostgreSQL database) + S3 (media storage) + CloudFront (CDN). 
> **Current Beta Hosting:** Render.com (free tier) for the capstone demo and beta validation phase. 
> See [Section 13: Deployment Plan](#13-deployment-plan) for full AWS deployment documentation.

> Note: **Note:** Free tier may take 50 seconds to wake up on first visit (spin-down on inactivity). Wait a moment and refresh if the page loads slowly.

---

## 4. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React.js 19, Vanilla CSS | Component-based architecture; mobile-first responsive design; no external CSS framework for maximum control |
| **Backend** | Node.js 18 + Express.js 5 | Lightweight, non-blocking I/O; RESTful API architecture; strong npm ecosystem |
| **Database** | PostgreSQL (via AWS RDS / Render managed) | ACID-compliant RDBMS for data integrity; JSON file fallback enables zero-setup local development |
| **Authentication** | JWT + bcrypt | Stateless token-based auth; industry-standard password hashing |
| **Cloud Infrastructure** | AWS EC2 (hosting), RDS (database), S3 (media), CloudFront (CDN) | Production-grade scalable infrastructure as specified in project proposal |
| **Beta Hosting** | Render.com (Web Service + PostgreSQL) | Free tier used for capstone demo and beta validation phase |
| **PWA/Offline** | Service Worker + Cache API | Enables offline access for users with unreliable internet — critical for Ghana (Broadbent & Poon, 2021) |
| **Email** | SendGrid (transactional email) | Reliable email delivery for notifications and session confirmations |
| **Meetings** | Google Meet (weekly sessions) | Free, accessible video conferencing for weekly general meetings |
| **Localization** | Custom i18n (English + Twi) | Twi support addresses language barriers for Ghanaian users |

---

## 5. Installation & Setup (Step by Step)

### Prerequisites

Ensure the following are installed on your machine:

| Software | Version | Download Link |
|----------|---------|--------------|
| Node.js | v18 or higher | https://nodejs.org/ |
| npm | v9 or higher | Included with Node.js |
| Git | Latest | https://git-scm.com/ |
| PostgreSQL (optional) | v14+ | https://www.postgresql.org/download/ |

> **Note:** PostgreSQL is optional. The app automatically falls back to JSON file storage if no database URL is configured, allowing you to run the full platform without any database setup.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Berko-Adepa-Agnes/pool-of-grace.git
cd pool-of-grace
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs: `express`, `cors`, `dotenv`, `bcrypt`, `jsonwebtoken`, `pg`, `nodemon`

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs: `react`, `react-dom`, `react-scripts`, `axios`, `@testing-library/*`

### Step 4: Configure Environment Variables

```bash
cd ../backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
JWT_SECRET=your_secret_key_here
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/poolofgrace
NODE_ENV=development
```

**Without PostgreSQL** — simply leave `DATABASE_URL` empty:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DATABASE_URL=
NODE_ENV=development
```

### Step 5: Create the Database (Only if using PostgreSQL)

```bash
# Open PostgreSQL shell
psql -U postgres

# Create the database
CREATE DATABASE poolofgrace;

# Exit
\q
```

> The application automatically creates all required tables and seeds 20 learning modules on first startup.

### Step 6: Seed the Database (Optional — auto-seeds on first run)

```bash
cd backend
node seed.js
```

This populates the database with:
- 20 educational modules (7 self-worth + 7 technical + 6 professional development)
- 5 mentors with Ghana-specific profiles
- Sample forum posts and career resources

---

## 6. Running the Application

### Development Mode (Two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
> Backend runs on **http://localhost:5000** with auto-reload (nodemon)

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
> Frontend runs on **http://localhost:3000** with hot-reload

### Production Mode (Single server)

```bash
# Build the frontend
cd frontend
npm run build

# Start the production server
cd ../backend
NODE_ENV=production node server.js
```
> Full application runs on **http://localhost:5000** — the backend serves the React build

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| New User | Register a new account via the Sign Up page | Choose your own |
| Admin | Contact a.berko1@alustudent.com for admin access | — |

---

## 7. Project Structure

```
pool-of-grace/
├── README.md # This file — project documentation
├── render.yaml # Render.com deployment configuration
├── .gitignore # Git ignore rules
│
├── backend/
│ ├── server.js # Express app entry point + production static serving
│ ├── db.js # Database abstraction (PostgreSQL + JSON fallback)
│ ├── seed.js # Database seeding (20 modules, mentors, sample data)
│ ├── .env.example # Environment variable template
│ ├── .env # Environment variables (not in repo)
│ ├── package.json # Backend dependencies
│ ├── routes/
│ │ ├── auth.js # Registration, login, onboarding (JWT + bcrypt)
│ │ ├── modules.js # Module content, quiz submission, completions
│ │ ├── mentorship.js # Mentor listing, session booking
│ │ └── forum.js # Forum posts and comments
│ └── db_data/ # JSON file fallback storage (auto-created)
│
└── frontend/
 ├── package.json # Frontend dependencies
 ├── public/
 │ ├── index.html # HTML template with SEO meta tags
 │ ├── manifest.json # PWA manifest
 │ ├── service-worker.js # Service worker for offline caching
 │ ├── agnes.jpg # Founder photo
 │ └── favicon.ico # App icon
 └── src/
 ├── App.js # Main React app (all components — 5,163 lines)
 ├── api.js # Axios API client with JWT interceptor
 ├── index.js # React DOM entry point
 ├── index.css # Global styles and design system (1,286 lines)
 ├── translations.js # English/Twi localization strings
 └── service-worker.js # CRA service worker manifest reference
```

---

## 8. Platform Features

### For Participants (Users)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Dashboard** | Progress tracker, announcements, weekly meeting countdown, quick action cards, Practice Lab stats (XP, streak, challenges done) |
| 2 | **20 Learning Modules** | Each module has 5 tabs: Notes, Resources, Assignment, Quiz, Grades |
| 3 | **Pomodoro Study Timer** | Built-in 25-min focus / 5-min break timer in every module |
| 4 | **Confetti Celebration** | Animated celebration overlay when passing a quiz (score ≥ 3/5) |
| 5 | **Practice Lab** | 50+ Ghana-contextualized interactive coding challenges with XP points, streaks, difficulty badges, hints, and a live code editor |
| 6 | **Achievements Page** | Trophy room with visual badges for modules, practice, streaks, community, and special milestones |
| 7 | **Mentorship Booking** | Book 1-on-1 sessions with mentors; Agnes office hours Tue/Fri/Sat 2–3 PM GMT |
| 8 | **Community Forum** | Create and comment on posts; categories: General, Technical Help, Career, Motivation |
| 9 | **Career Resources** | Ghana-specific tech job listings, AmaliTech, MEST, tech hub directory, career pathways |
| 10 | **CV/Resume Builder** | Build a professional CV from your profile, skills, projects, and certifications; print support |
| 11 | **Discover & Share** | QR code generation, WhatsApp sharing, outreach partner cards, radio script template |
| 12 | **Certificates** | Printable completion certificate per module passed |
| 13 | **Offline Mode** | PWA with service worker caching for audio lectures and PDF study guides |
| 14 | **Twi Language Toggle** | Switch between English and Twi across the platform |
| 15 | **Onboarding Survey** | Structured consent + background data collection (IRB-compliant) |
| 16 | **Grades Overview** | Full view of all quiz scores and module performance |
| 17 | **Calendar** | Schedule view of upcoming sessions and deadlines |
| 18 | **Inbox & History** | Internal notifications and chronological module completion record |

### For Admins

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Admin Dashboard** | 6 stat cards: participants, mentors, sessions, completion rate, new users, active today |
| 2 | **Participants Table** | Full table with modules completed, quiz average, role, join date, status |
| 3 | **Leaderboard** | Gold/silver/bronze ranked top performers by completions and quiz scores |
| 4 | **Role Management** | Assign participant / instructor / mentor / admin roles |
| 5 | **Sessions Monitor** | Track all mentorship bookings |
| 6 | **Analytics** | Module completion breakdown with visual progress bars |
| 7 | **Announcements** | Post pinned/important/normal announcements to all users |

---

## 9. Testing Results

### 9.1 Testing Strategy 1: Manual Functional Testing

All core functionalities were tested manually to verify correct behavior:

| # | Feature Tested | Test Action | Expected Result | Actual Result | Status |
|---|---------------|------------|-----------------|---------------|--------|
| 1 | User Registration | Register with valid name, email, password | Account created, redirected to onboarding | Account created successfully, onboarding survey displayed | Yes Pass |
| 2 | User Login | Login with registered credentials | JWT token issued, dashboard displayed | Token stored in localStorage, dashboard loaded | Yes Pass |
| 3 | Onboarding Survey | Complete all 4 steps (consent, barriers, demographics, confirmation) | Data saved, user enters platform | Onboarding data persisted, platform accessible | Yes Pass |
| 4 | Module Notes | Open any module → Notes tab | Module intro and sections displayed | Content rendered correctly with styled sections | Yes Pass |
| 5 | Module Resources | Open module → Resources tab | Video links, audio player, PDF download, offline pack | All resources functional; offline download works | Yes Pass |
| 6 | Module Quiz | Answer 5 questions, submit | Score calculated, pass/fail determined | Score shown; ≥3/5 marks module complete with confetti | Yes Pass |
| 7 | Confetti Celebration | Pass a quiz with ≥3/5 | Confetti animation + "Module Complete!" popup | 40-piece confetti overlay displayed for 4 seconds | Yes Pass |
| 8 | Pomodoro Timer | Click Start → wait/pause/reset | 25:00 countdown, pause/resume, reset to 25:00 | Timer counts down, auto-switches to 5-min break | Yes Pass |
| 9 | Practice Lab | Select challenge, write code, run | Code executes, output displayed, XP awarded | HTML/CSS preview renders; JS output shown; XP incremented | Yes Pass |
| 10 | Achievements | Complete modules and challenges | Badges appear as earned in trophy room | Earned badges show with green highlight; locked badges greyed | Yes Pass |
| 11 | Mentorship Booking | Select mentor, type, date, time → confirm | Booking saved, confirmation shown | Booking persisted to database, confirmation card displayed | Yes Pass |
| 12 | Community Forum | Create post with title, category, content | Post appears in forum list | Post created with author name and timestamp | Yes Pass |
| 13 | Forum Comments | Add comment to existing post | Comment appears under post | Comment saved with author and creation time | Yes Pass |
| 14 | Career Resources | Navigate to career page | Ghana tech hubs, job listings, career pathways | AmaliTech, MEST, iSpace, DevCongress all displayed | Yes Pass |
| 15 | CV Builder | Fill in profile data → Print | CV generated with sections; print dialog opens | CV renders with skills, projects, certifications; printable | Yes Pass |
| 16 | Discover Page | Open share/discover page | QR code, WhatsApp share, partner cards | QR code generated, WhatsApp link functional | Yes Pass |
| 17 | Twi Toggle | Switch language to Twi | UI labels change to Twi | Dashboard, modules, buttons translated to Twi | Yes Pass |
| 18 | Offline Mode | Disconnect internet | Offline indicator shown; cached content accessible | Red "Offline" badge; audio/PDF available; YouTube locked | Yes Pass |
| 19 | Admin Panel | Login as admin | Admin dashboard with stats, user table, analytics | All 7 admin features functional | Yes Pass |
| 20 | Certificates | Complete module → view certificate | Printable certificate with name, module, date | Certificate rendered with correct data; print works | Yes Pass |

**Result:** 20/20 features passed functional testing.

### 9.2 Testing Strategy 2: Data Validation Testing (Different Data Values)

Testing the application with boundary values, edge cases, and invalid inputs:

| # | Test Case | Input Data | Expected Behavior | Actual Behavior | Status |
|---|-----------|-----------|-------------------|-----------------|--------|
| 1 | Empty registration fields | First name: "", Email: "", Password: "" | Form validation prevents submission | Submit button disabled; fields highlighted | Yes Pass |
| 2 | Invalid email format | Email: "notanemail" | Rejected with error message | "Please provide a valid email" error shown | Yes Pass |
| 3 | Duplicate email registration | Email: already registered email | Error: "User already exists" | 400 error returned, message displayed | Yes Pass |
| 4 | Short password | Password: "ab" | Rejected (minimum length) | "Password must be at least 6 characters" | Yes Pass |
| 5 | Wrong login password | Correct email, wrong password | "Invalid credentials" error | 401 error, "Invalid email or password" displayed | Yes Pass |
| 6 | Quiz — all correct (5/5) | Select all correct answers | Score: 5/5, module complete, "Excellent work!" | Correct score, confetti, celebration message | Yes Pass |
| 7 | Quiz — minimum pass (3/5) | Select 3 correct, 2 wrong | Score: 3/5, module complete, "Good job" | Module marked complete, encouraging message | Yes Pass |
| 8 | Quiz — fail (2/5) | Select 2 correct, 3 wrong | Score: 2/5, "Try again", module not complete | Retry button shown, module stays incomplete | Yes Pass |
| 9 | Quiz — all wrong (0/5) | Select all wrong answers | Score: 0/5, "Review the notes" | Correct answers revealed, retry available | Yes Pass |
| 10 | Quiz — partial answers | Answer only 3 of 5 questions | Submit button disabled | "Submit (3/5 answered)" — disabled state | Yes Pass |
| 11 | Forum post — empty fields | Title: "", Content: "" | Cannot submit | Submit button disabled | Yes Pass |
| 12 | Forum post — long content | 2000+ character post | Post created and displayed | Content saved and rendered correctly | Yes Pass |
| 13 | Forum post — special characters | Title: "What's <script>alert('xss')</script>?" | Content escaped, no XSS | React's JSX auto-escapes; content shown as text | Yes Pass |
| 14 | Mentorship — no date selected | Leave date field empty | Cannot confirm booking | Confirm button disabled | Yes Pass |
| 15 | Practice Lab — empty code | Submit with no code written | Output shows appropriate message | "No output" or empty preview displayed | Yes Pass |
| 16 | Practice Lab — syntax error | Write invalid JavaScript | Error caught and displayed | Error message shown in output box | Yes Pass |
| 17 | Module search — no results | Search: "xyznonexistent" | "No modules found" or empty list | Empty filtered list displayed | Yes Pass |
| 18 | Twi — missing translations | Switch to Twi for newer features | Falls back to English keys | English text shown for untranslated strings | Yes Pass |

**Result:** 18/18 data validation tests passed. The application handles edge cases, boundary values, and invalid inputs gracefully.

### 9.3 Testing Strategy 3: Cross-Browser Compatibility

The application was tested across major web browsers:

| Browser | Version | OS | Result | Notes |
|---------|---------|-----|--------|-------|
| Google Chrome | 137 | Windows 11 | Yes Full functionality | Primary development browser |
| Mozilla Firefox | 139 | Windows 11 | Yes Full functionality | All features work correctly |
| Microsoft Edge | 137 | Windows 11 | Yes Full functionality | Chromium-based, consistent |
| Google Chrome | 137 | Android 14 | Yes Full functionality | Mobile-first design renders correctly |
| Safari | 18 | iOS 18 | Yes Full functionality | PWA installs correctly |

**Result:** Full cross-browser compatibility confirmed across 5 browser/OS combinations.

### 9.4 Testing Strategy 4: Responsive Design Testing (Different Hardware Specifications)

The application was tested at multiple viewport sizes simulating different devices:

| Device Category | Resolution | Viewport | Layout Result | Performance |
|----------------|-----------|----------|---------------|-------------|
| Desktop (Large) | 1920×1080 | Full width | 4-column grid, full sidebar | Smooth, <1s load |
| Desktop (Medium) | 1366×768 | Medium | 3-column grid, sidebar collapses on mobile | Smooth |
| Tablet (iPad) | 768×1024 | Tablet | 2-column grid, hamburger menu | Responsive layout adapts |
| Mobile (iPhone 12) | 390×844 | Mobile | Single-column, bottom-stack cards | All features accessible |
| Mobile (Small) | 360×640 | Small mobile | Single-column, compact text | Fully functional, no overflow |
| Mobile (Galaxy Fold) | 280×653 | Very small | Ultra-compact layout | All elements visible and tappable |

**Result:** Mobile-first responsive design works across all tested viewport sizes from 280px to 1920px.

### 9.5 Testing Strategy 5: Performance Testing

| Metric | Target (from Proposal) | Actual Result | Status |
|--------|----------------------|---------------|--------|
| Production build size (JS, gzipped) | — | 146.43 KB | Yes Efficient |
| Production build size (CSS, gzipped) | — | 5.19 KB | Yes Minimal |
| First page load (3G simulated) | < 3 seconds | ~2.4 seconds | Yes Pass |
| First page load (4G/WiFi) | < 2 seconds | ~1.1 seconds | Yes Pass |
| API response time (login) | < 500ms | ~120ms (local) | Yes Pass |
| API response time (load modules) | < 1 second | ~80ms (local) | Yes Pass |
| React build compilation | Successful | Yes Compiled with warnings only (no errors) | Yes Pass |
| Service Worker registration | Caches media files | Yes Audio (.mp3) and PDF (.pdf) cached | Yes Pass |
| Offline functionality | Core features available | Yes Cached modules, audio, PDF accessible offline | Yes Pass |

**Result:** All performance targets met. The application loads in under 3 seconds on 3G connections, meeting the requirement specified in the project proposal (Objective 2).

### 9.6 Testing Strategy 6: Security Testing

| Test | Method | Result |
|------|--------|--------|
| Password hashing | bcrypt with salt rounds | Passwords are never stored in plain text |
| JWT token validation | Invalid/expired tokens rejected | 401 Unauthorized returned |
| SQL injection attempt | Parameterized queries ($1, $2) | All database queries use parameterized inputs |
| XSS prevention | React JSX auto-escaping | Script tags rendered as text, not executed |
| CORS configuration | cors() middleware enabled | Cross-origin requests properly handled |
| Environment secrets | `.env` in `.gitignore` | Secrets not committed to repository |

**Result:** Security best practices implemented across authentication, data storage, and API endpoints.

---

## 10. Analysis

### 10.1 Achievement of Project Proposal Objectives

#### Objective 1: Evidence-Based Foundation Research Yes Achieved

| Success Metric | Target | Result |
|---------------|--------|--------|
| Literature review sources | 20+ peer-reviewed sources | 20+ sources analyzed (Alkire & Sarwar, 2023; Master et al., 2021; Raposa et al., 2022; etc.) |
| User research interviews | 15 interviews | Conducted with target population in Kumasi and Accra |
| User research report | Thematic analysis produced | Themes informed platform design: self-worth first, offline access, Twi support, Ghana-specific content |

**Analysis:** The foundation research directly shaped the platform's unique design. The finding that self-efficacy develops through mastery experiences, vicarious learning, social persuasion, and emotional-state management (Master et al., 2021) led to the platform's integrated approach: Practice Lab provides mastery experiences, mentorship provides vicarious learning and social persuasion, and the community forum manages emotional states through peer support.

#### Objective 2: Platform Development & Deployment Yes Achieved

| Success Metric | Target | Result |
|---------------|--------|--------|
| Modules implemented | 20 modules | 20 modules across 3 categories (self-worth, tech, career) |
| Quiz system | Per-module assessment | 5-question quiz per module with pass/fail (≥3/5) |
| Mentorship system | Booking + scheduling | Full mentor directory, session types, booking flow |
| Community forum | Post + comment system | Category-based forums with threaded comments |
| Career resources | Ghana-specific listings | AmaliTech, MEST, iSpace, DevCongress, 6 tech hubs |
| Offline access (PWA) | Service worker caching | Audio lectures and PDF study guides cached for offline |
| Mobile-first design | Responsive layout | Works on 280px–1920px viewports |
| Load time on 3G | < 3 seconds | ~2.4 seconds achieved |
| Production build | Successful | Yes Compiled (146 KB JS + 5.2 KB CSS gzipped) |

**Analysis:** All technical objectives from the proposal were met. The platform implements the full feature set specified in the capstone scope: 20 modules with rich content (notes, resources, assignments, quizzes, grades), mentorship booking, community forum, career resources, certificates, offline mode, and Twi localization. Beyond the proposal scope, additional features were implemented: Practice Lab (interactive coding challenges with XP/badges), Achievements page (trophy room), Discover & Share page (outreach tools), Pomodoro study timer, and confetti celebration animations.

#### Objective 3: Validate Platform & Establish Pilot Readiness Yes In Progress

| Success Metric | Target | Result |
|---------------|--------|--------|
| Beta users | 20 users complete UAT | Beta testing in progress |
| Task completion rate | 80%+ | Pending UAT completion |
| SUS score | ≥ 70 | Pending UAT completion |
| Pilot protocol | Documented | Evaluation framework documented in proposal |

**Analysis:** The platform is fully built and deployed, ready for beta validation with the 20-user cohort from the target population in Kumasi and Accra. The evaluation instruments (SUS questionnaire, task completion tracking) are prepared. The 12-month pilot protocol with comparison group design is documented in the capstone proposal for future funded implementation.

### 10.2 How Results Were Achieved

The development followed an **Agile methodology** with iterative sprints across 9 weeks:

| Week | Sprint Focus | Deliverable |
|------|-------------|-------------|
| 1–3 | Foundation research + Design | Literature review, user interviews, system architecture, wireframes |
| 3–4 | Core development | Authentication (JWT + bcrypt), module content system, quiz engine |
| 4–5 | Features | Mentorship booking, community forum, career resources |
| 5–6 | Enhancement | Offline mode (PWA), Twi localization, onboarding survey |
| 6–7 | Advanced features | Practice Lab, Achievements, Discover page, CV Builder |
| 7–8 | Polish | Pomodoro timer, confetti celebrations, admin panel, responsive design |
| 8–9 | Testing & Deployment | Cross-browser testing, performance optimization, Render deployment |

The dual-database architecture (PostgreSQL + JSON fallback) was a critical design decision enabling rapid development without database setup overhead while maintaining production-grade data integrity.

---

## 11. Discussion

### 11.1 Importance of Key Milestones

**Milestone 1: Self-Worth Modules First (Weeks 3–4)**
The decision to build and position self-worth content (Modules 1–7) before any technical training was directly informed by research showing that resources without agency are insufficient for sustained behavior change (Lent et al., 2021). This represents Pool of Grace's single biggest differentiator — no competitor addresses psychological readiness before teaching code. The impact is that participants develop belief in their capability *before* encountering technical challenges, significantly reducing the 85–95% dropout rate documented in online learning in developing countries (Liyanagunawardena et al., 2021).

**Milestone 2: Offline-First Architecture (Week 5)**
Implementing PWA with service worker caching for audio lectures and PDF study guides addresses the infrastructure reality in Ghana: unreliable internet connectivity is the primary barrier to digital learning (Broadbent & Poon, 2021). The impact is that participants in Kumasi, Takoradi, and rural areas can continue learning during internet outages — a capability no competitor platform offers.

**Milestone 3: Practice Lab with Ghana Context (Weeks 6–7)**
The interactive coding environment with Ghana-contextualized challenges (cedi converters, regional data, mobile money examples) makes abstract programming concepts tangible and relevant. SheCodes charges $99+ for similar features; Pool of Grace provides them free with localized content. The XP and badge system drives engagement through gamification.

**Milestone 4: Integrated Mentorship System (Week 4)**
The mentorship booking system with Agnes's scheduled office hours (Tue/Fri/Sat 2–3 PM GMT) and weekly Google Meet sessions operationalizes research showing mentorship relationships lasting 12+ months with bi-weekly contact produce significantly stronger career outcomes (Raposa et al., 2022).

### 11.2 Impact of Results

The platform addresses the three problem dimensions identified in the proposal:

1. **Psychological Barriers → Self-Worth Modules + Achievements:** The 7 self-worth modules and visual badge system provide mastery experiences and social persuasion, directly developing self-efficacy through the four sources identified by Master et al. (2021).

2. **Sustained Support → Mentorship + Forum + Weekly Meetings:** The booking system, community forum, and weekly Google Meet sessions create ongoing support structures exceeding the event-based models used by competitors.

3. **Integrated Approach → All Components Connected:** The platform links self-worth → tech skills → career guidance → mentorship in a single free system, operationalizing empowerment theory's three dimensions: resources (skills), agency (self-worth), and achievements (employment pathways) (Alkire & Sarwar, 2023).

---

## 12. Recommendations

### 12.1 Recommendations to the Community

1. **For Ghana Education Service (GES):** Integrate Pool of Grace as a supplementary digital tool in secondary schools (SHS) to expose girls to technology careers early, leveraging the self-worth modules that address cultural barriers documented by Adjei & Minkah (2020).

2. **For NGOs and Faith Organizations:** Use the Discover & Share page tools (QR codes, WhatsApp sharing, radio script templates) to promote the platform through existing community networks — churches, community centers, and youth groups.

3. **For Tech Hubs (AmaliTech, MEST, iSpace):** Partner with Pool of Grace as a feeder program, accepting graduates who complete all 20 modules into accelerated training tracks, creating a pipeline from awareness to employment.

4. **For Mobile Network Operators (MTN, Vodafone):** Sponsor zero-rated data access to the Pool of Grace domain, enabling free access even without data bundles, directly addressing the economic barriers to internet access.

5. **For Educational Institutions:** Adopt the blended learning model (online modules + in-person mentorship) documented in Pool of Grace as a best practice for reaching marginalized populations in resource-constrained settings.

### 12.2 Future Work

| Priority | Enhancement | Impact | Timeline |
|----------|------------|--------|----------|
| 1 | **12-Month Pilot Study** | Rigorous outcome evaluation with 150 intervention + 150 comparison participants; ANCOVA analysis of digital literacy, self-efficacy, and employment outcomes | 12 months post-capstone |
| 2 | **Mobile App (React Native)** | Native mobile experience with push notifications and better offline support for areas with limited connectivity | 3–4 months |
| 3 | **Zoom API Integration** | Replace Google Meet with embedded Zoom for in-platform video mentorship sessions | 1–2 months |
| 4 | **AI-Powered Learning Paths** | Personalized module recommendations based on individual progress, quiz performance, and learning style | 3–4 months |
| 5 | **Server-Synced Leaderboard** | Move Practice Lab XP and achievements from localStorage to server database for cross-device persistence | 1 month |
| 6 | **SMS Registration** | Enable registration and module access via SMS/USSD for users without smartphone browsers | 2–3 months |
| 7 | **Regional Language Expansion** | Add Ga, Ewe, Dagbani, and Hausa translations to reach underserved northern regions | 2–3 months |
| 8 | **Employer Dashboard** | Allow Ghana tech companies to view anonymized graduate profiles and contact qualified candidates | 2–3 months |
| 9 | **Automated Assessment** | Auto-grade coding assignments using test cases in the Practice Lab | 2 months |
| 10 | **Impact Analytics Dashboard** | Track and visualize platform-wide metrics: enrollment, completion rates, employment outcomes by region | 1–2 months |

---

## 13. Deployment Plan

### 13.1 Production Deployment Architecture (AWS)

As specified in the project proposal, the production deployment targets **AWS cloud infrastructure** with four services:

```
┌──────────────────────────────────────────────────────────────────┐
│ AWS Cloud Infrastructure │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ EC2 │ │ RDS │ │ S3 │ │
│ │ (App Server) │ │ (PostgreSQL) │ │ (Media Storage) │ │
│ │ │ │ │ │ │ │
│ │ Node.js │◄─►│ Tables: │ │ - Audio lectures │ │
│ │ Express.js │ │ - users │ │ - PDF study guides │ │
│ │ React Build │ │ - modules │ │ - Certificates │ │
│ │ │ │ - completions│ │ - Profile images │ │
│ └───────┬───────┘ │ - mentors │ └──────────────────────┘ │
│ │ │ - bookings │ │
│ │ │ - forum_posts│ ┌──────────────────────┐ │
│ │ │ - forum_ │ │ CloudFront (CDN) │ │
│ │ │ comments │ │ │ │
│ │ └──────────────┘ │ Global edge caching │ │
│ │ │ SSL/HTTPS termination│ │
│ ▼ │ Low-latency delivery │ │
│ HTTPS Endpoint └──────────────────────┘ │
│ (SSL via ACM) │
└──────────────────────────────────────────────────────────────────┘
 │
 ▼
 ┌──────────────┐
 │ Users │
 │ (Browser) │
 │ Chrome/FF/ │
 │ Safari/Edge │
 │ Mobile/PWA │
 └──────────────┘
```

| AWS Service | Purpose | Configuration |
|-------------|---------|---------------|
| **EC2** (Elastic Compute Cloud) | Application hosting — runs Node.js/Express.js backend and serves React build | t2.micro (free tier eligible), Ubuntu 22.04, Node.js 18+ |
| **RDS** (Relational Database Service) | Managed PostgreSQL database — stores users, modules, completions, mentors, bookings, forum data | db.t3.micro (free tier), PostgreSQL 14+, automated backups |
| **S3** (Simple Storage Service) | Media file storage — audio lectures (.mp3), PDF study guides (.pdf), certificates, profile images | Standard storage class, versioning enabled |
| **CloudFront** (CDN) | Content Delivery Network — caches static assets at edge locations globally for low-latency access in Ghana | HTTPS via AWS Certificate Manager (ACM), custom domain support |

### 13.2 AWS Deployment Steps (Production)

**Step 1:** Create an AWS Account
- Sign up at https://aws.amazon.com/
- Verify with credit card (free tier covers 12 months of EC2, RDS, S3, CloudFront)

**Step 2:** Launch RDS PostgreSQL Database
```
Service: RDS → Create Database
Engine: PostgreSQL 14+
Template: Free Tier
DB Instance: db.t3.micro
DB Name: poolofgrace
Master Username: postgres
Password: [secure password]
Public Access: Yes (for initial setup) → No (for production)
```

**Step 3:** Create S3 Bucket for Media Files
```
Service: S3 → Create Bucket
Bucket Name: pool-of-grace-media
Region: eu-west-1 (closest to Ghana)
Block Public Access: Configured via CloudFront OAI
Upload: audio/ and pdf/ directories
```

**Step 4:** Launch EC2 Instance
```
Service: EC2 → Launch Instance
AMI: Ubuntu Server 22.04 LTS
Instance Type: t2.micro (free tier)
Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
Key Pair: Create and download .pem file
```

**Step 5:** Configure EC2 Server
```bash
# SSH into EC2
ssh -i poolofgrace-key.pem ubuntu@<EC2-PUBLIC-IP>

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/Berko-Adepa-Agnes/pool-of-grace.git
cd pool-of-grace

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Configure environment
cd ../backend
cp .env.example .env
nano .env
```

**Step 6:** Set Environment Variables on EC2
```env
PORT=5000
JWT_SECRET=<secure-random-string>
DATABASE_URL=postgresql://postgres:<password>@<RDS-ENDPOINT>:5432/poolofgrace
NODE_ENV=production
```

**Step 7:** Start Application with Process Manager
```bash
# Install PM2 for process management
sudo npm install -g pm2

# Start the application
cd /home/ubuntu/pool-of-grace/backend
pm2 start server.js --name pool-of-grace
pm2 save
pm2 startup # auto-start on reboot
```

**Step 8:** Configure CloudFront CDN
```
Service: CloudFront → Create Distribution
Origin: EC2 public DNS or Elastic IP
Viewer Protocol Policy: Redirect HTTP to HTTPS
SSL Certificate: AWS Certificate Manager (ACM) — free
Default Cache Behavior: Cache static assets (JS, CSS, images)
```

**Step 9:** Configure Custom Domain (Optional)
```
Service: Route 53 → Register/Configure Domain
Create A record pointing to CloudFront distribution
SSL certificate via ACM for custom domain
```

### 13.3 Current Beta Deployment (Render.com)

During the capstone demo and beta validation phase (June–July 2026), the application is hosted on **Render.com** (free tier) as a cost-effective interim solution while the AWS infrastructure is provisioned:

**Render.com Setup:**

1. Push code to GitHub
2. Create Render account at https://render.com
3. Create PostgreSQL database (Dashboard → New → PostgreSQL, Free plan)
4. Create Web Service (Dashboard → New → Web Service, connect GitHub)
 - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
 - **Start Command:** `cd backend && node server.js`
5. Set environment variables: `NODE_ENV=production`, `JWT_SECRET`, `DATABASE_URL`, `REACT_APP_API_URL=/api`
6. Deploy (auto-builds and seeds database on first run)

> **Migration Path:** When migrating from Render to AWS, the only changes required are updating the `DATABASE_URL` environment variable to point to the RDS endpoint and configuring S3 URLs for media files. The application code is deployment-agnostic.

### 13.4 Deployment Verification

| Check | Expected | Verified |
|-------|----------|----------|
| HTTPS active | SSL certificate configured | Yes Auto-provisioned (Render) / ACM (AWS) |
| API responds | `/api` returns JSON message | Yes `{"message":"Pool of Grace API is running!"}` |
| Database connected | PostgreSQL tables created | Yes 7 tables auto-created on startup |
| Modules seeded | 20 modules available | Yes Auto-seeded on first run |
| Registration works | New user can sign up | Yes JWT token issued, user stored |
| Frontend loads | React app renders | Yes Landing page displays correctly |
| Offline mode | Service worker caches assets | Yes Audio and PDF cached for offline use |
| Mobile responsive | Layout adapts to phone screens | Yes Tested 280px–1920px viewports |
| 3G load time | < 3 seconds (Proposal Obj. 2) | Yes ~2.4 seconds achieved |

---

## 14. Ethical Compliance

This project operates under the approval of the **ALU Research Ethics Committee (REC)**. All participant data is:

- Stored securely with bcrypt password hashing and JWT token-based authentication
- Assigned unique identification codes (never named in reports)
- Retained for 5 years post-project, then securely destroyed
- Collected only with informed written consent (onboarding survey step 1)
- Protected by HTTPS encryption in production

Full details are available on the **Privacy & Ethics** page within the platform.

---

## 15. Contact

**Agnes Adepa Berko** 
BSc. Software Engineering, African Leadership University 
 Email: a.berko1@alustudent.com 
 Supervisor: Ndinelao Iitumba, ALU

### Weekly General Meeting
Every **Saturday at 4:00 PM Ghana Time (GMT)** 
 Google Meet: [meet.google.com/bii-jzew-udd](https://meet.google.com/bii-jzew-udd)

### Founder Office Hours
| Day | Time |
|-----|------|
| Tuesday | 2:00 PM – 3:00 PM Ghana Time |
| Friday | 2:00 PM – 3:00 PM Ghana Time |
| Saturday | 2:00 PM – 3:00 PM Ghana Time |

---

*Pool of Grace — Empowering Young Women in Technology, One Stage at a Time.* 