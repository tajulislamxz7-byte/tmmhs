// ================================================
// TIARKHALI M.M HIGH SCHOOL — API SERVER
// Data is persisted in /data/*.json files
// ================================================

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const DATA_DIR = path.join(__dirname, 'data');
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── File helpers ──────────────────────────────────
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  } catch {
    return file.endsWith('settings.json') ? {} : [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf8');
}

// ── USERS ─────────────────────────────────────────
app.get('/api/users', (req, res) => {
  const users = readJSON('users.json');
  // Never send passwords to client
  res.json(users.map(u => { const c = {...u}; delete c.password; return c; }));
});

app.post('/api/users/register', (req, res) => {
  const users = readJSON('users.json');
  const data = req.body;

  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return res.status(400).json({ ok: false, error: 'An account with this email already exists.' });
  }

  const role = data.role || 'student';
  const prefixMap = { student:'STU', teacher:'TCH', alumni:'ALM', staff:'STF' };
  const prefix = prefixMap[role] || 'STU';
  const id = `${prefix}-${new Date().getFullYear()}-${String(users.length + 1).padStart(4, '0')}`;
  const name = `${data.firstName} ${data.lastName}`.trim();
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  // Strip "Select" placeholder values
  const clean = (v) => (!v || v === 'Select' || v === 'select') ? '' : v;

  const user = {
    id, name,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email.toLowerCase().trim(),
    phone: data.phone || '',
    password: data.password,
    role,
    avatar,
    status: 'pending',
    createdAt: new Date().toISOString(),
    class: clean(data.class),
    section: clean(data.section),
    batch: clean(data.batch),
    bloodGroup: clean(data.bloodGroup),
    guardian: data.guardian || '',
    subject: data.subject || '',
    qualification: data.qualification || '',
    graduationYear: data.graduationYear || '',
    profession: data.profession || '',
    company: data.company || '',
    university: data.university || '',
    position: data.position || '',
    department: data.department || '',
    roll: '', address: '', skills: [], achievements: [], gpa: 'N/A', attendance: 0, bio: '',
  };

  users.push(user);
  writeJSON('users.json', users);

  const session = {...user}; delete session.password;
  res.json({ ok: true, user: session });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON('users.json');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
  if (!user) return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
  const session = {...user}; delete session.password;
  res.json({ ok: true, user: session });
});

app.patch('/api/users/:id/approve', (req, res) => {
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ ok: false });
  users[idx].status = 'active';
  writeJSON('users.json', users);
  res.json({ ok: true });
});

app.patch('/api/users/:id', (req, res) => {
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ ok: false });
  Object.assign(users[idx], req.body);
  writeJSON('users.json', users);
  const updated = {...users[idx]}; delete updated.password;
  res.json({ ok: true, user: updated });
});

app.delete('/api/users/:id', (req, res) => {
  const users = readJSON('users.json');
  const filtered = users.filter(u => u.id !== req.params.id);
  writeJSON('users.json', filtered);
  res.json({ ok: true });
});

// ── NOTICES ───────────────────────────────────────
app.get('/api/notices', (_req, res) => res.json(readJSON('notices.json')));

app.post('/api/notices', (req, res) => {
  const notices = readJSON('notices.json');
  const notice = { id: 'N' + Date.now(), ...req.body, date: new Date().toISOString().split('T')[0] };
  notices.unshift(notice);
  writeJSON('notices.json', notices);
  res.json({ ok: true, notice });
});

app.delete('/api/notices/:idx', (req, res) => {
  const notices = readJSON('notices.json');
  notices.splice(parseInt(req.params.idx), 1);
  writeJSON('notices.json', notices);
  res.json({ ok: true });
});

// ── EVENTS ────────────────────────────────────────
app.get('/api/events', (_req, res) => res.json(readJSON('events.json')));

app.post('/api/events', (req, res) => {
  const events = readJSON('events.json');
  const event = { id: 'EV' + Date.now(), ...req.body };
  events.unshift(event);
  writeJSON('events.json', events);
  res.json({ ok: true, event });
});

app.delete('/api/events/:idx', (req, res) => {
  const events = readJSON('events.json');
  events.splice(parseInt(req.params.idx), 1);
  writeJSON('events.json', events);
  res.json({ ok: true });
});

// ── BATCHES ───────────────────────────────────────
app.get('/api/batches', (_req, res) => res.json(readJSON('batches.json')));

app.post('/api/batches', (req, res) => {
  const batches = readJSON('batches.json');
  const batch = { id: 'B' + Date.now(), ...req.body, createdAt: new Date().toISOString() };
  batches.unshift(batch);
  writeJSON('batches.json', batches);
  res.json({ ok: true, batch });
});

app.delete('/api/batches/:idx', (req, res) => {
  const batches = readJSON('batches.json');
  batches.splice(parseInt(req.params.idx), 1);
  writeJSON('batches.json', batches);
  res.json({ ok: true });
});

// ── EXAMS & RESULTS ───────────────────────────────
app.get('/api/exams', (_req, res) => res.json(readJSON('exams.json')));

app.post('/api/exams', (req, res) => {
  const exams = readJSON('exams.json');
  const exam = { id: 'EX' + Date.now(), ...req.body, status: 'Draft', createdAt: new Date().toISOString() };
  exams.push(exam);
  writeJSON('exams.json', exams);
  res.json({ ok: true, exam });
});

app.patch('/api/exams/:idx', (req, res) => {
  const exams = readJSON('exams.json');
  const idx = parseInt(req.params.idx);
  Object.assign(exams[idx], req.body);
  writeJSON('exams.json', exams);
  res.json({ ok: true });
});

app.delete('/api/exams/:idx', (req, res) => {
  const exams = readJSON('exams.json');
  exams.splice(parseInt(req.params.idx), 1);
  writeJSON('exams.json', exams);
  res.json({ ok: true });
});

app.get('/api/results', (_req, res) => res.json(readJSON('results.json')));

app.post('/api/results', (req, res) => {
  const results = readJSON('results.json');
  const entries = req.body; // array of result entries
  entries.forEach(entry => {
    const idx = results.findIndex(r => r.examId === entry.examId && r.studentId === entry.studentId);
    if (idx >= 0) results[idx] = entry; else results.push(entry);
  });
  writeJSON('results.json', results);
  res.json({ ok: true });
});

// ── MESSAGES ──────────────────────────────────────
app.get('/api/conversations', (_req, res) => res.json(readJSON('conversations.json')));

app.post('/api/conversations', (req, res) => {
  const convs = readJSON('conversations.json');
  const existing = convs.find(c =>
    c.participants.length === 2 &&
    c.participants.includes(req.body.fromId) &&
    c.participants.includes(req.body.toId)
  );
  if (existing) return res.json({ ok: true, conversation: existing });
  const conv = {
    id: 'C_' + req.body.fromId + '_' + req.body.toId + '_' + Date.now(),
    participants: [req.body.fromId, req.body.toId],
    lastMsg: '',
    lastTime: new Date().toISOString(),
    unread: {},
  };
  convs.unshift(conv);
  writeJSON('conversations.json', convs);
  res.json({ ok: true, conversation: conv });
});

app.patch('/api/conversations/:id', (req, res) => {
  const convs = readJSON('conversations.json');
  const idx = convs.findIndex(c => c.id === req.params.id);
  if (idx >= 0) { Object.assign(convs[idx], req.body); writeJSON('conversations.json', convs); }
  res.json({ ok: true });
});

app.get('/api/messages/:convId', (req, res) => {
  const all = readJSON('messages.json');
  res.json(all[req.params.convId] || []);
});

app.post('/api/messages/:convId', (req, res) => {
  const all = readJSON('messages.json');
  if (!all[req.params.convId]) all[req.params.convId] = [];
  const msg = { id: 'm_' + Date.now(), ...req.body, time: new Date().toISOString() };
  all[req.params.convId].push(msg);
  writeJSON('messages.json', all);

  // Update conversation last message
  const convs = readJSON('conversations.json');
  const conv = convs.find(c => c.id === req.params.convId);
  if (conv) {
    conv.lastMsg = msg.text;
    conv.lastTime = msg.time;
    conv.participants.forEach(p => {
      if (p !== msg.senderId) {
        if (!conv.unread) conv.unread = {};
        conv.unread[p] = (conv.unread[p] || 0) + 1;
      }
    });
    writeJSON('conversations.json', convs);
  }
  res.json({ ok: true, message: msg });
});

// ── SETTINGS ──────────────────────────────────────
app.get('/api/settings', (_req, res) => res.json(readJSON('settings.json')));

app.post('/api/settings', (req, res) => {
  writeJSON('settings.json', req.body);
  res.json({ ok: true });
});

// ── START ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
});
