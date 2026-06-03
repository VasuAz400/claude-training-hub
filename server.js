const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const CONTENT_FILE = path.join(__dirname, 'data', 'content.json');
const QUIZZES_FILE = path.join(__dirname, 'data', 'quizzes.json');

// Admin configuration via environment variables
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || 'anakushwaha@deloitte.com,vnavinbhaimaradiy@deloitte.com')
  .split(',').map(e => e.trim().toLowerCase());
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// In-memory stores for OTPs and admin sessions
const otpStore = new Map();    // email -> { code, expiresAt }
const adminSessions = new Map(); // token -> { email, expiresAt }

// SMTP transporter (optional — falls back to console if not configured)
let smtpTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('SMTP configured — OTPs will be sent via email.');
} else {
  console.log('SMTP not configured — OTPs will be printed to console only.');
  console.log('Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars to enable email delivery.');
}

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

if (!fs.existsSync(USERS_FILE)) {
  writeJSON(USERS_FILE, []);
}

// Middleware: verify admin session token
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const token = authHeader.slice(7);
  const session = adminSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
  req.adminEmail = session.email;
  next();
}

// --- Admin Auth Routes ---

// Request OTP
app.post('/api/admin/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const normalizedEmail = email.trim().toLowerCase();
  if (!ADMIN_EMAILS.includes(normalizedEmail)) {
    return res.status(403).json({ error: 'This email is not authorized for admin access.' });
  }

  const code = generateOTP();
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS
  });

  // Always print to console
  console.log('');
  console.log('='.repeat(50));
  console.log(`  ADMIN OTP for ${normalizedEmail}`);
  console.log(`  Code: ${code}`);
  console.log(`  Expires in 5 minutes`);
  console.log('='.repeat(50));
  console.log('');

  // Send via email if SMTP is configured
  if (smtpTransporter) {
    try {
      await smtpTransporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: normalizedEmail,
        subject: 'Claude Training Hub — Admin Login OTP',
        text: `Your one-time password for the Claude Training Hub admin dashboard is:\n\n${code}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
            <div style="background:#000;color:#fff;padding:16px 24px;border-radius:6px 6px 0 0;">
              <h2 style="margin:0;font-size:18px;">
                <span style="color:#86BC25;font-weight:800;">D</span> Claude Training Hub
              </h2>
            </div>
            <div style="background:#f2f2f2;padding:32px 24px;border-radius:0 0 6px 6px;">
              <p style="color:#555;margin:0 0 16px;">Your one-time password for admin access:</p>
              <div style="background:#fff;border:2px solid #86BC25;border-radius:6px;text-align:center;padding:20px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#1a1a1a;">${code}</span>
              </div>
              <p style="color:#888;font-size:13px;margin:16px 0 0;">This code expires in 5 minutes.</p>
            </div>
          </div>
        `
      });
      console.log(`OTP email sent to ${normalizedEmail}`);
    } catch (err) {
      console.error('Failed to send OTP email:', err.message);
      console.log('OTP is still available in the console above.');
    }
  }

  res.json({ message: 'OTP sent. Check your email (or the server console).' });
});

// Verify OTP
app.post('/api/admin/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);

  if (!stored) {
    return res.status(401).json({ error: 'No OTP found. Please request a new one.' });
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedEmail);
    return res.status(401).json({ error: 'OTP has expired. Please request a new one.' });
  }
  if (stored.code !== otp.trim()) {
    return res.status(401).json({ error: 'Invalid OTP. Please try again.' });
  }

  otpStore.delete(normalizedEmail);

  const token = generateToken();
  adminSessions.set(token, {
    email: normalizedEmail,
    expiresAt: Date.now() + (4 * 60 * 60 * 1000) // 4 hour session
  });

  res.json({ token, email: normalizedEmail });
});

// Verify admin session (for frontend to check if still logged in)
app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({ authenticated: true, email: req.adminEmail });
});

// Logout admin
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    adminSessions.delete(authHeader.slice(7));
  }
  res.json({ message: 'Logged out.' });
});

// --- Learner Routes (unchanged) ---

app.post('/api/register', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

  const htmlTagPattern = /[<>]/;
  if (htmlTagPattern.test(name) || htmlTagPattern.test(email)) {
    return res.status(400).json({ error: 'Name and email must not contain HTML characters.' });
  }

  const users = readJSON(USERS_FILE);
  const normalizedEmail = email.trim().toLowerCase();
  let user = users.find(u => u.email === normalizedEmail);

  if (user) {
    return res.json(user);
  }

  user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.trim(),
    email: normalizedEmail,
    registeredAt: new Date().toISOString(),
    progress: {
      1: { topicsRead: [], quizAttempts: [], bestScore: null },
      2: { topicsRead: [], quizAttempts: [], bestScore: null },
      3: { topicsRead: [], quizAttempts: [], bestScore: null },
      4: { topicsRead: [], quizAttempts: [], bestScore: null },
      5: { topicsRead: [], quizAttempts: [], bestScore: null }
    }
  };

  users.push(user);
  writeJSON(USERS_FILE, users);
  res.json(user);
});

app.get('/api/user/:id', (req, res) => {
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

app.post('/api/progress/:userId/topic', (req, res) => {
  const { day, topicId } = req.body;
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  if (!user.progress[day].topicsRead.includes(topicId)) {
    user.progress[day].topicsRead.push(topicId);
  }
  writeJSON(USERS_FILE, users);
  res.json(user.progress[day]);
});

app.get('/api/content/:day', (req, res) => {
  const content = readJSON(CONTENT_FILE);
  const day = parseInt(req.params.day);
  const dayContent = content.find(d => d.day === day);
  if (!dayContent) return res.status(404).json({ error: 'Day not found.' });
  res.json(dayContent);
});

app.get('/api/quiz/:day', (req, res) => {
  const quizzes = readJSON(QUIZZES_FILE);
  const day = parseInt(req.params.day);
  const dayQuiz = quizzes.find(q => q.day === day);
  if (!dayQuiz) return res.status(404).json({ error: 'Quiz not found.' });

  const questions = dayQuiz.questions.map(({ correctAnswer, ...rest }) => rest);
  res.json({ day, questions });
});

app.post('/api/quiz/:day/submit', (req, res) => {
  const { userId, answers } = req.body;
  const day = parseInt(req.params.day);

  const quizzes = readJSON(QUIZZES_FILE);
  const dayQuiz = quizzes.find(q => q.day === day);
  if (!dayQuiz) return res.status(404).json({ error: 'Quiz not found.' });

  let correct = 0;
  const results = dayQuiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.correctAnswer;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      selected: answers[i],
      correctAnswer: q.correctAnswer,
      isCorrect
    };
  });

  const score = Math.round((correct / dayQuiz.questions.length) * 100);

  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const attempt = {
    attemptNumber: user.progress[day].quizAttempts.length + 1,
    score,
    correct,
    total: dayQuiz.questions.length,
    timestamp: new Date().toISOString()
  };

  user.progress[day].quizAttempts.push(attempt);
  if (user.progress[day].bestScore === null || score > user.progress[day].bestScore) {
    user.progress[day].bestScore = score;
  }

  writeJSON(USERS_FILE, users);
  res.json({ score, correct, total: dayQuiz.questions.length, results, attempt });
});

// --- Protected Admin Data Routes ---

app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const users = readJSON(USERS_FILE);
  const summary = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    registeredAt: u.registeredAt,
    days: Object.entries(u.progress).map(([day, data]) => ({
      day: parseInt(day),
      topicsRead: data.topicsRead.length,
      attempts: data.quizAttempts.length,
      bestScore: data.bestScore,
      lastAttempt: data.quizAttempts.length > 0
        ? data.quizAttempts[data.quizAttempts.length - 1].timestamp
        : null
    }))
  }));
  res.json(summary);
});

app.get('/api/admin/user/:id', requireAdmin, (req, res) => {
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Claude Training Hub running at http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`Admin email(s): ${ADMIN_EMAILS.join(', ')}`);
});
