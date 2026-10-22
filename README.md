# ⚡ ABHINAV.DEV — Futuristic Cybernetic Portfolio & Curriculum Matrix

A state-of-the-art, high-tech, futuristic portfolio website and academic progression showcase developed for **Abhinav Kumar** (B.Tech Computer Science Engineering in AI/ML with Microsoft track progression).

Built with **Vanilla HTML5, Futuristic Cyberpunk CSS3 (Neon Crimson & Amber Theme), Modern JavaScript**, and a high-performance **Native Node.js Backend with SQLite Database Storage (`portfolio.db`)**.

---

## 📸 Reference Images Implementation Breakdown

Every single section and detail requested from your 5 reference images has been implemented with precision:

| Reference Image | Section Implemented | Features & Visual Fidelity |
|---|---|---|
| **Image 1 & 2** | **Academic Curriculum & Specialization Roadmap** | • Exact Header: *"Academic Curriculum & Specialization Roadmap"*<br>• Subtitle: *"Comprehensive 8-Semester B.Tech Computer Science Engineering (AI/ML) course progression with Microsoft."*<br>• Capsule Badge: **`170 TOTAL CREDITS • 8 SEMESTERS`**<br>• All 8 Semesters (Semester 01 to 08) with exact credits (24, 25, 23, 23, 24, 22, 16, 13 = 170 Total), timeframes, course lists with **glowing neon red dots**, interactive view switch (Horizontal Timeline vs Grid Matrix), and click-to-inspect course modal. |
| **Image 3** | **Navigation Bar** | • Sleek frosted glass HUD navbar with uppercase tracking: `ROADMAP`, `SKILLS`, `AZURE`, `PROJECTS`, `TERMINAL`, `CONTACT`<br>• Sound Effects Toggle (Synthesizer audio clicks & beeps via Web Audio API)<br>• Live SQLite DB Inbox Inspector<br>• Responsive mobile drawer. |
| **Image 4** | **Metrics & Stats Strip** | • Exact 4-column metric strip with thin vertical border dividers and background amber/crimson ambient glow:<br>  - **`04`** `YEARS TRACK`<br>  - **`06`** `CERTIFICATIONS`<br>  - **`170`** `CREDITS`<br>  - **`08`** `SEMESTERS`<br>• Real-time count-up animation on scroll. |
| **Image 5** | **02 — Technical Expertise** | • Section tag: **`02 — TECHNICAL EXPERTISE`** with neon accent line<br>• **Card 1: `01 // CORE` (`01/03`)**: Programming Foundations (Python 94%, C & C++ 90%, TypeScript 92% with neon red-to-orange gradient progress bars and chips: Python 3.x, C, C++, Java, TypeScript, OOP)<br>• **Card 2: `02 // SYSTEMS` (`02/03`)**: Full-Stack Development (React & Next.js 96%, Node.js / Go / FastAPI 91%, SQL & Modern ORMs 90% with chips: React, Next.js, Node.js, Go, SQL, PostgreSQL)<br>• **Card 3: `03 // INTELLIGENCE` (`03/03`)**: AI, Cloud & Problem Solving (Machine Learning 89%, AWS & Cloud DevOps 91%, Competitive Programming 240+ LC/CF with chips: Machine Learning, Azure Cloud, AWS, LeetCode, GenAI, PyTorch)<br>• Card footers with category tags and counters. |
| **Aesthetic Elements** | **Japanese Cyber Foliage & Neon Embers** | • Subtle Japanese bonsai and maple foliage silhouettes matching the bottom corners of the reference images.<br>• Ambient drifting neon ember particle canvas reacting smoothly to mouse movement.<br>• Ambient neon radial glow spots (Crimson `#ff2a4b`, Amber `#ff6b35`). |

---

## 🛠️ Complete Full-Stack Architecture

### 1. Frontend (`public/`)
- `index.html`: Fully semantic HTML5 with SEO meta tags, OpenGraph data, and accessible structure.
- `css/style.css`: Hand-crafted Vanilla CSS with CSS custom properties (variables), glassmorphic backdrops (`backdrop-filter: blur(20px)`), neon text/box glows, custom cyber scrollbar, and responsive breakpoints.
- `js/app.js`: High-speed vanilla JS managing:
  - **Ambient Particle Canvas**: Lightweight, high-fps floating embers.
  - **Web Audio API Synthesizer**: Generates sci-fi clicks, beeps, and transmission audio feedback without any external audio asset dependencies.
  - **Typewriter HUD**: Dynamic cycling titles in the Hero section.
  - **Interactive 3D Hologram Avatar**: Mouse-tracking tilt effect.
  - **Interactive Terminal**: Emulated command line connected to backend `/api/terminal`.
  - **Real-Time Contact Form**: Asynchronously posts to `/api/contact` and validates input.
  - **Live DB Inbox Viewer**: Modal to inspect inquiries stored in SQLite with purge/delete capability.

### 2. Backend (`server.js`)
- **Native Node.js Server (v24+)**: Zero external npm dependencies required! Starts in milliseconds.
- **Native SQLite Database Engine (`portfolio.db`)**: Uses Node.js's built-in `node:sqlite` (`DatabaseSync`) with automatic table creation and queries.
- **Robust REST API Endpoints**:
  - `GET /api/health` — Server uptime & database health status.
  - `GET /api/portfolio` — Complete structured dataset.
  - `GET /api/roadmap` — Full 8-semester curriculum data with credits.
  - `GET /api/technical-expertise` — Skill bars and categories.
  - `GET /api/stats` — Stats metrics.
  - `GET /api/certifications` — Microsoft Azure & Cloud credentials.
  - `GET /api/projects` — Projects with category filters.
  - `POST /api/contact` — Validates and stores incoming contact transmissions into SQLite.
  - `GET /api/contact` — Retrieves stored messages for the admin viewer.
  - `DELETE /api/contact/:id` — Deletes or manages inquiry records.
  - `POST /api/terminal` — Processes CLI directives (`help`, `roadmap`, `skills`, `projects`, `stats`, `whoami`, `matrix`).
  - `POST /api/feedback` — Records neural reaction resonance.
- **Security & Caching**: Input validation, payload size limiting, CORS headers, MIME type handling, and static asset caching.

---

## 🚀 How to Run Locally

### Start Server
Open your terminal in `d:\Abhinav` and run:

```bash
node server.js
```

### Access in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Directory Structure

```
d:\Abhinav\
├── data\
│   └── portfolioData.json      # Structured data for curriculum, skills, certs, projects
├── public\
│   ├── assets\
│   │   ├── avatar.jpg          # Holographic cyber engineer avatar
│   │   └── cyber_foliage.jpg   # Japanese bonsai & maple foliage silhouette
│   ├── css\
│   │   └── style.css           # Futuristic neon stylesheet & animations
│   ├── js\
│   │   └── app.js              # Canvas, audio synth, terminal, and AJAX logic
│   └── index.html              # Main application entry point
├── portfolio.db                # SQLite database for contact submissions & logs
├── package.json                # Project manifest
├── README.md                   # Complete documentation
└── server.js                   # Node.js + SQLite REST API backend server
```
