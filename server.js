/**
 * ABHINAV.DEV — Futuristic Portfolio Backend Server
 * Built with native Node.js (v24+) HTTP & node:sqlite
 * Zero external dependencies required.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'portfolioData.json');
const DB_FILE = path.join(__dirname, 'portfolio.db');

// Load static portfolio data dynamically
function getPortfolioData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('[ERROR] Failed to load portfolioData.json:', err.message);
    return {};
  }
}
let portfolioData = getPortfolioData();


// Initialize SQLite database using native node:sqlite
let db = null;
let useJsonFallback = false;
const FALLBACK_MESSAGES_FILE = path.join(__dirname, 'data', 'messages_fallback.json');

try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(DB_FILE);
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'unread'
    );
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reaction TEXT,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS command_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      command TEXT NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[DATABASE] SQLite database initialized successfully at portfolio.db');
} catch (err) {
  console.warn('[DATABASE] node:sqlite initialization notice:', err.message);
  console.log('[DATABASE] Falling back to JSON storage mode.');
  useJsonFallback = true;
  if (!fs.existsSync(FALLBACK_MESSAGES_FILE)) {
    fs.writeFileSync(FALLBACK_MESSAGES_FILE, JSON.stringify([]));
  }
}

// Database helper functions
function saveContact({ name, email, category, subject, message }) {
  if (db && !useJsonFallback) {
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, category, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, category || 'General', subject || 'Inquiry', message);
    return { id: result.lastInsertRowid, name, email, category, subject, message, created_at: new Date().toISOString() };
  } else {
    let list = [];
    try {
      list = JSON.parse(fs.readFileSync(FALLBACK_MESSAGES_FILE, 'utf8'));
    } catch (e) {
      list = [];
    }
    const newEntry = {
      id: Date.now(),
      name,
      email,
      category: category || 'General',
      subject: subject || 'Inquiry',
      message,
      created_at: new Date().toISOString(),
      status: 'unread'
    };
    list.unshift(newEntry);
    fs.writeFileSync(FALLBACK_MESSAGES_FILE, JSON.stringify(list, null, 2));
    return newEntry;
  }
}

function getContacts() {
  if (db && !useJsonFallback) {
    const stmt = db.prepare('SELECT * FROM contacts ORDER BY id DESC');
    return stmt.all();
  } else {
    try {
      return JSON.parse(fs.readFileSync(FALLBACK_MESSAGES_FILE, 'utf8'));
    } catch (e) {
      return [];
    }
  }
}

function deleteContact(id) {
  if (db && !useJsonFallback) {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    stmt.run(id);
    return true;
  } else {
    try {
      let list = JSON.parse(fs.readFileSync(FALLBACK_MESSAGES_FILE, 'utf8'));
      list = list.filter(item => String(item.id) !== String(id));
      fs.writeFileSync(FALLBACK_MESSAGES_FILE, JSON.stringify(list, null, 2));
      return true;
    } catch (e) {
      return false;
    }
  }
}

function saveFeedback({ reaction, comment }) {
  if (db && !useJsonFallback) {
    const stmt = db.prepare('INSERT INTO feedback (reaction, comment) VALUES (?, ?)');
    stmt.run(reaction || 'sparkles', comment || '');
  }
  return { success: true };
}

function logCommand(cmd) {
  if (db && !useJsonFallback) {
    try {
      const stmt = db.prepare('INSERT INTO command_logs (command) VALUES (?)');
      stmt.run(cmd);
    } catch (e) {}
  }
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Helper: send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper: read POST request body as JSON
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // ==================== API ROUTES ====================
  if (pathname.startsWith('/api/')) {
    try {
      // 1. Health check
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, {
          status: 'ONLINE',
          system: 'CYBER-PORTFOLIO-CORE',
          version: '2.4.0',
          uptime: process.uptime(),
          dbEngine: useJsonFallback ? 'JSON-VIRTUAL-STORE' : 'SQLITE-NATIVE',
          timestamp: new Date().toISOString()
        });
      }

      // 2. Full Portfolio Data
      if (pathname === '/api/portfolio' && method === 'GET') {
        return sendJSON(res, 200, getPortfolioData());
      }

      // 3. Profile
      if (pathname === '/api/profile' && method === 'GET') {
        const data = getPortfolioData();
        return sendJSON(res, 200, data.profile || {});
      }

      // 4. Stats (04 Years, 06 Certs, 170 Credits, 08 Semesters)
      if (pathname === '/api/stats' && method === 'GET') {
        return sendJSON(res, 200, portfolioData.stats || []);
      }

      // 5. Technical Expertise (02 — Technical Expertise)
      if (pathname === '/api/technical-expertise' && method === 'GET') {
        return sendJSON(res, 200, portfolioData.technicalExpertise || []);
      }

      // 6. Roadmap (Academic Curriculum & Specialization Roadmap)
      if (pathname === '/api/roadmap' && method === 'GET') {
        return sendJSON(res, 200, portfolioData.roadmap || {});
      }

      // 7. Certifications (Azure & Cloud credentials)
      if (pathname === '/api/certifications' && method === 'GET') {
        const data = getPortfolioData();
        return sendJSON(res, 200, data.certifications || []);
      }

      // 7.5 Education Credentials
      if (pathname === '/api/education' && method === 'GET') {
        const data = getPortfolioData();
        return sendJSON(res, 200, data.education || []);
      }

      // 8. Projects
      if (pathname === '/api/projects' && method === 'GET') {
        const category = parsedUrl.query.category;
        let projects = portfolioData.projects || [];
        if (category && category !== 'All') {
          projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        return sendJSON(res, 200, projects);
      }

      // 9. Contact Form Submission (POST /api/contact)
      if (pathname === '/api/contact' && method === 'POST') {
        const body = await parseRequestBody(req);
        const { name, email, category, subject, message } = body;

        if (!name || !email || !message) {
          return sendJSON(res, 400, {
            success: false,
            error: 'Missing required fields: Name, Email and Message are mandatory.'
          });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return sendJSON(res, 400, {
            success: false,
            error: 'Please provide a valid email address.'
          });
        }

        const saved = saveContact({ name, email, category, subject, message });
        return sendJSON(res, 201, {
          success: true,
          message: 'Transmission received. Message stored in secure neural core.',
          data: saved
        });
      }

      // 10. Contact Inquiries (GET /api/contact) - Admin / View messages
      if (pathname === '/api/contact' && method === 'GET') {
        const contacts = getContacts();
        return sendJSON(res, 200, {
          total: contacts.length,
          messages: contacts
        });
      }

      // 11. Delete Contact Inquiries (DELETE /api/contact/:id)
      if (pathname.startsWith('/api/contact/') && method === 'DELETE') {
        const id = pathname.split('/').pop();
        deleteContact(id);
        return sendJSON(res, 200, { success: true, message: `Message ${id} purged.` });
      }

      // 12. Quick Reaction / Feedback (POST /api/feedback)
      if (pathname === '/api/feedback' && method === 'POST') {
        const body = await parseRequestBody(req);
        saveFeedback(body);
        return sendJSON(res, 200, { success: true, message: 'Neural resonance recorded!' });
      }

      // 13. Terminal Command Execution (POST /api/terminal)
      if (pathname === '/api/terminal' && method === 'POST') {
        const body = await parseRequestBody(req);
        const rawCmd = (body.command || '').trim();
        const cmd = rawCmd.toLowerCase();
        logCommand(rawCmd);

        let responseText = '';
        let status = 'SUCCESS';

        switch (cmd) {
          case 'help':
            responseText = [
              'AVAILABLE CYBERNETIC COMMANDS:',
              '  education       - View University & Schooling academic credentials',
              '  roadmap         - Display full 8-semester Microsoft progression',
              '  skills          - Inspect Technical Expertise breakdown',
              '  stats           - Output core metrics & credit summary',
              '  certifications  - List Azure & DevOps cloud credentials',
              '  projects        - Query top production engineering deployments',
              '  whoami          - Query candidate profile & credentials',
              '  contact         - Output secure transmission coordinates',
              '  matrix          - Trigger visual neural rain anomaly',
              '  system          - Display host core status & uptime',
              '  clear           - Wipe the terminal buffer'
            ].join('\n');
            break;

          case 'education':
          case 'edu':
            const eduData = getPortfolioData().education || [];
            responseText = eduData.map(e => 
              `=== [${e.badge}] ===\n` +
              `  INSTITUTION   : ${e.institution}\n` +
              `  DEGREE/STREAM : ${e.degree}\n` +
              `  SPECIALIZATION: ${e.specialization}\n` +
              `  TIMELINE      : ${e.timeline}\n` +
              `  LOCATION      : ${e.location}\n` +
              `  STATUS        : ${e.status}\n` +
              `  HIGHLIGHTS    :\n` +
              e.highlights.map(h => `    • ${h}`).join('\n')
            ).join('\n\n');
            break;

          case 'whoami':
            const prof = getPortfolioData().profile || {};
            responseText = `IDENTITY   : ${prof.name}\nDESIGNATION: ${prof.title}\nUNIVERSITY : ${prof.institution} (Graduating 2030)\nSCHOOLING  : ${prof.school}\nSPECIALTY  : ${prof.degree}\nALLIANCE   : ${prof.partnership}\nSTATUS     : ${prof.status}`;
            break;

          case 'stats':
            responseText = portfolioData.stats.map(s => `[${s.value}] ${s.label.padEnd(16)} -> ${s.desc}`).join('\n');
            break;

          case 'skills':
            responseText = portfolioData.technicalExpertise.map(t => 
              `=== ${t.category} // ${t.title} ===\n` +
              t.skills.map(s => `  * ${s.name.padEnd(20)} [${s.level}%] -> ${s.tag}`).join('\n')
            ).join('\n\n');
            break;

          case 'roadmap':
            responseText = `ACADEMIC CURRICULUM: ${portfolioData.roadmap.header.title}\n${portfolioData.roadmap.header.badge}\n\n` +
              portfolioData.roadmap.semesters.map(s => 
                `[${s.number}] ${s.title.padEnd(24)} (${s.credits}) [${s.period}]\n` +
                s.courses.map(c => `   - ${c}`).join('\n')
              ).join('\n\n');
            break;

          case 'certifications':
            responseText = portfolioData.certifications.map(c => 
              `[${c.code}] ${c.title}\n   Issuer: ${c.issuer} | Badge: ${c.badge} | Status: ${c.status}`
            ).join('\n\n');
            break;

          case 'projects':
            portfolioData = getPortfolioData();
            if (portfolioData.projects && portfolioData.projects.length > 0) {
              responseText = portfolioData.projects.map(p => 
                `>> ${p.title} [${p.category}]\n   Summary: ${p.summary}\n   Stack: ${p.technologies.join(', ')}\n   Metrics: ${p.metrics}`
              ).join('\n\n');
            } else {
              responseText = `[STATUS: ACTIVE ENGINEERING & DEVELOPMENT]
I am currently architecting and testing production systems, AI pipelines, and cloud microservices.
No dummy or mock projects are listed here.

Follow real-time code commits, work-in-progress branches, and repositories directly on GitHub:
👉 https://github.com/Abhinavkumar-3676`;
            }
            break;

          case 'contact':
            portfolioData = getPortfolioData();
            responseText = `COMM CHANNEL ACTIVE:
Name: ${portfolioData.profile.name}
Email: ${portfolioData.profile.links.email}
Phone: ${portfolioData.profile.links.phoneDisplay || portfolioData.profile.links.phone}
GitHub: ${portfolioData.profile.links.github}
LinkedIn: ${portfolioData.profile.links.linkedin}
Or transmit directly via the Contact Portal below.`;
            break;

          case 'system':
            responseText = `CORE: ONLINE\nUPTIME: ${Math.floor(process.uptime())}s\nDATABASE: ${useJsonFallback ? 'JSON-VIRTUAL' : 'SQLITE-3-SYNC'}\nNODE: ${process.version}\nMEMORY: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
            break;

          case 'matrix':
            responseText = 'MATRIX_ANOMALY_ACTIVATED';
            break;

          default:
            if (cmd.startsWith('sudo')) {
              responseText = 'ACCESS GRANTED. Root privileges granted to user Abhinav.';
            } else if (cmd === '') {
              responseText = '';
            } else {
              responseText = `Command not recognized: '${rawCmd}'. Type 'help' for available system directives.`;
              status = 'WARN';
            }
            break;
        }

        return sendJSON(res, 200, {
          command: rawCmd,
          status,
          output: responseText
        });
      }

      // Unmatched API route
      return sendJSON(res, 404, { error: 'Endpoint not found in neural registry' });
    } catch (err) {
      console.error('[API ERROR]', err);
      return sendJSON(res, 500, { error: 'Internal Core Error', detail: err.message });
    }
  }

  // ==================== STATIC FILE SERVING ====================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security check to ensure requested file is inside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If requested file doesn't exist, serve index.html for single-page routing
      const fallbackIndex = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(fallbackIndex)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return fs.createReadStream(fallbackIndex).pipe(res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache static assets (images, css, js) for 1 hour
    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'X-Content-Type-Options': 'nosniff'
    };

    if (['.jpg', '.png', '.svg', '.woff2'].includes(ext)) {
      headers['Cache-Control'] = 'public, max-age=3600';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

// Start listener
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ABHINAV FUTURISTIC PORTFOLIO SYSTEM ONLINE`);
  console.log(`📡 Local Interface: http://localhost:${PORT}`);
  console.log(`⚡ API Registry:     http://localhost:${PORT}/api/health`);
  console.log(`💾 Storage Engine:   ${useJsonFallback ? 'JSON Fallback' : 'Native SQLite'}`);
  console.log(`====================================================`);
});
