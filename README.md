# Pool of Grace Learning Platform

**Empowering Young Women Through Integrated Technology Education and Mentorship in Ghana**

> BSc. Software Engineering Capstone Project — African Leadership University (ALU)  
> Researcher: **Agnes Adepa Berko** | Supervisor: Ndinelao Iitumba | June 2026

---

## Overview

Pool of Grace is a comprehensive, free, mobile-first web-based learning platform designed to address the cultural, psychological, economic, and technical barriers preventing young women aged 16–30 in Ghana from pursuing technology education and careers.

The platform integrates:
- **Self-Worth Development** (Modules 1–7)
- **Technology Skills Training** (Modules 8–14)
- **Professional Development & Career Guidance** (Modules 15–20)
- **Mentorship System** with booking, office hours, and weekly Google Meet sessions
- **Community Forum**, Certificates, Recordings, Announcements, and Privacy compliance

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, vanilla CSS, mobile-first responsive design |
| Backend | Node.js + Express.js, RESTful API |
| Database | PostgreSQL (production) / JSON file fallback (development) |
| Auth | JWT (JSON Web Tokens), bcrypt password hashing |
| Hosting | AWS EC2 + RDS + S3 + CloudFront CDN |
| Email | SendGrid transactional email |
| Meetings | Google Meet (weekly sessions: meet.google.com/bii-jzew-udd) |

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Berko-Adepa-Agnes/pool-of-grace.git
cd pool-of-grace
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
JWT_SECRET=your_secret_key_here
# Optional: set DATABASE_URL for PostgreSQL, or leave blank to use JSON fallback
DATABASE_URL=
```

### 5. Seed the database (first run only)

```bash
cd backend
node seed.js
```

---

## Running the Application

### Start the backend server

```bash
cd backend
npm run dev
```

The backend runs on **http://localhost:5000**

### Start the frontend

```bash
cd frontend
npm start
```

The frontend runs on **http://localhost:3000**

---

## Admin Access

Admin credentials are kept private. Contact the platform administrator:

**Email:** a.berko1@alustudent.com

---

## Platform Features

### For Participants (Users)
| Feature | Description |
|---|---|
| Dashboard | Progress tracker, announcements banner, meeting join link |
| 20 Modules | Notes, Resources, Assignments, Quiz, Grades — per module |
| Rich Assignments | Reflection essays, action plans, coding exercises, research reports |
| Certificates | Printable completion certificates per module passed |
| Recordings | Filtered list of session recordings (meetings, workshops, career talks) |
| Mentorship | Book 1-on-1 sessions; Agnes office hours Tue/Fri/Sat 2–3 PM GMT |
| Community Forum | Create and comment on posts with the community |
| Career Board | Ghana-specific tech job listings and career resources |
| Announcements | Platform-wide notices from Agnes and the admin team |
| Grades | Overview of all quiz scores and module performance |
| Calendar | Schedule view of upcoming sessions and deadlines |
| Inbox | Internal messages and notifications |
| History | Chronological record of completed modules |
| Privacy & Ethics | Full ALU REC-compliant data rights and contact info page |
| Twi Language | Toggle between English and Twi (partial localization) |

### For Admins
| Feature | Description |
|---|---|
| Dashboard | 6 stat cards: participants, mentors, sessions, completion, new users, active today |
| Participants | Full table of all users: modules, quiz avg, role, join date, status |
| Leaderboard | Gold/silver/bronze ranked top performers by completions and quiz score |
| Role Management | Assign participant / instructor / mentor / admin roles with dropdown |
| Sessions Monitor | Track all mentorship bookings |
| Analytics | Module completion breakdown with visual progress bars |
| Announcements | Post pinned/important/normal announcements to all users |

---

## Weekly General Meeting

Every **Saturday at 4:00 PM Ghana Time (GMT)**  
Join via Google Meet: [meet.google.com/bii-jzew-udd](https://meet.google.com/bii-jzew-udd)

---

## Founder Office Hours

Agnes Adepa Berko is available for direct 1-on-1 sessions:

| Day | Time |
|---|---|
| Tuesday | 2:00 PM – 3:00 PM Ghana Time |
| Friday | 2:00 PM – 3:00 PM Ghana Time |
| Saturday | 2:00 PM – 3:00 PM Ghana Time |

**Email:** a.berko1@alustudent.com

---

## Project Structure

```
pool-of-grace/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Registration and login
│   │   ├── modules.js       # Module content and quiz
│   │   ├── mentorship.js    # Booking and sessions
│   │   └── forum.js         # Forum posts and comments
│   ├── db_data/             # JSON file fallback storage
│   ├── db.js                # PostgreSQL connection
│   ├── seed.js              # Database seeding script
│   └── server.js            # Express app entry point
└── frontend/
    ├── public/
    │   └── agnes.jpg        # Founder photo
    └── src/
        ├── App.js           # Main React app (all components)
        ├── index.css        # Global styles and design system
        ├── api.js           # API calls to backend
        └── translations.js  # English / Twi localization
```

---

## Ethical Compliance

This project operates under the approval of the **ALU Research Ethics Committee (REC)**. All participant data is:
- Stored securely and password-protected
- Assigned unique identification codes (never named in reports)
- Retained for 5 years post-project, then securely destroyed
- Collected only with informed written consent

Full details: see **Privacy & Ethics** page within the platform.

---

## Capstone Scope

| Phase | Status |
|---|---|
| Literature Review (20+ sources) | Complete |
| User Research Interviews (15 participants) | In progress |
| Full-stack platform development | Complete |
| User Acceptance Testing (20 beta users) | Planned |
| AWS Production Deployment | In progress |
| Pilot Protocol Documentation | In progress |

---

## Contact

**Agnes Adepa Berko**  
BSc. Software Engineering, African Leadership University  
Email: a.berko1@alustudent.com  
Supervisor: Ndinelao Iitumba, ALU

---

*Pool of Grace — Empowering Young Women in Technology, One Stage at a Time.*