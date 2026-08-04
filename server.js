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

// Configure CORS to allow Netlify domain
app.use(cors({
  origin: '*', // Allow all origins (or specify your Netlify domain)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Disable caching for all API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(express.json());

// ── Health check endpoint ──────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

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

  // Phone is mandatory for all accounts
  if (!data.phone || !String(data.phone).trim()) {
    return res.status(400).json({ ok: false, error: 'Phone number is required. All accounts must have a phone number.' });
  }
  // Check if phone already exists
  const normalizePhone = (p) => String(p).replace(/\s+/g, '').replace(/^\+/, '').replace(/^880/, '').replace(/^0/, '');
  const inputPhoneNorm = normalizePhone(data.phone);
  if (users.some(u => u.phone && normalizePhone(u.phone) === inputPhoneNorm)) {
    return res.status(400).json({ ok: false, error: 'An account with this phone number already exists.' });
  }

  // Check if email already exists
  if (data.email && users.some(u => u.email && u.email.toLowerCase() === data.email.toLowerCase())) {
    return res.status(400).json({ ok: false, error: 'An account with this email already exists.' });
  }

  const role = data.role || 'student';
  
  // Profile picture handling
  const avatar = data.avatar || 'https://i.imgur.com/x9wE0QT.png';

  // ======== ACCOUNT LINKING FOR STUDENTS ========
  // If student provides Student ID, try to link to existing record
  if (role === 'student' && data.studentId && data.studentId.trim()) {
    const existingStudent = users.find(u => 
      u.id === data.studentId.trim() && 
      u.role === 'student'
    );
    
    if (!existingStudent) {
      return res.status(404).json({ ok: false, error: 'Student ID not found in our database. Please contact school administration.' });
    }
    
    // Check if already linked/active
    if (existingStudent.status === 'active' && existingStudent.email && existingStudent.password) {
      return res.status(400).json({ ok: false, error: 'This Student ID is already linked to an account. Please use the login page.' });
    }
    
    // Verify with roll number if provided by BOTH admin and user
    if (data.roll && data.roll.trim() && existingStudent.roll && existingStudent.roll.trim()) {
      if (existingStudent.roll.trim() !== data.roll.trim()) {
        return res.status(400).json({ ok: false, error: 'Roll number does not match our records. Please check and try again.' });
      }
    }
    
    // Verify with birthday if provided by BOTH admin and user
    if (data.birthday && data.birthday.trim() && existingStudent.birthday && existingStudent.birthday.trim()) {
      if (existingStudent.birthday !== data.birthday.trim()) {
        return res.status(400).json({ ok: false, error: 'Date of birth does not match our records. Please check and try again.' });
      }
    }
    
    // Link account: update existing student record with login credentials
    existingStudent.email = data.email.toLowerCase().trim();
    existingStudent.phone = data.phone || existingStudent.phone;
    existingStudent.password = data.password;
    existingStudent.firstName = data.firstName || existingStudent.firstName;
    existingStudent.lastName = data.lastName || existingStudent.lastName;
    existingStudent.name = `${data.firstName || existingStudent.firstName} ${data.lastName || existingStudent.lastName}`.trim();
    existingStudent.avatar = avatar; // Update with uploaded picture or default
    existingStudent.status = 'active'; // Auto-activate linked accounts
    existingStudent.linkedAt = new Date().toISOString();
    
    writeJSON('users.json', users);
    
    const session = {...existingStudent}; 
    delete session.password;
    return res.json({ ok: true, user: session, linked: true });
  }

  // ======== CREATE NEW ACCOUNT ========
  // Only create new account if NO Student ID provided
  const prefixMap = { student:'STU', teacher:'TCH', staff:'STF', principal:'PRI' };
  const prefix = prefixMap[role] || 'STU';
  
  // Generate new ID
  const id = `${prefix}-${new Date().getFullYear()}-${String(users.length + 1).padStart(4, '0')}`;
  
  const name = `${data.firstName} ${data.lastName}`.trim();

  // Strip "Select" placeholder values
  const clean = (v) => (!v || v === 'Select' || v === 'select') ? '' : v;

  // Admin-created accounts (teacher, staff, principal) are auto-activated
  // Student accounts need approval
  const autoActivateRoles = ['teacher', 'staff', 'principal'];
  const initialStatus = autoActivateRoles.includes(role) ? 'active' : 'pending';

  const user = {
    id, name,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email.toLowerCase().trim(),
    phone: data.phone || '',
    password: data.password,
    role,
    avatar,
    status: initialStatus,
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
    roll: data.roll || '', address: '', skills: [], achievements: [], gpa: 'N/A', bio: '',
    birthday: data.birthday || '',
  };

  users.push(user);
  writeJSON('users.json', users);

  const session = {...user}; delete session.password;
  res.json({ ok: true, user: session });
});

// Add student by admin (pre-add without account)
app.post('/api/users/add-student', (req, res) => {
  const users = readJSON('users.json');
  const studentData = req.body;

  // Validate that it's a student record
  if (studentData.role !== 'student') {
    return res.status(400).json({ ok: false, error: 'Only student records can be added via this endpoint.' });
  }

  // Check if student ID already exists
  if (users.some(u => u.id === studentData.id)) {
    return res.status(400).json({ ok: false, error: 'A student with this ID already exists.' });
  }

  // Phone is mandatory
  if (!studentData.phone || !String(studentData.phone).trim()) {
    return res.status(400).json({ ok: false, error: 'Phone number is required for student records.' });
  }

  // Add student to database
  users.push(studentData);
  writeJSON('users.json', users);

  res.json({ ok: true, student: studentData });
});

app.post('/api/users/login', (req, res) => {
  const { phone, email, password } = req.body;
  const users = readJSON('users.json');

  let user = null;

  if (phone && phone.trim()) {
    // Normalize phone: strip spaces, leading +; standardize to 10-digit local number
    const normalizePhone = (p) => {
      p = String(p).replace(/\s+/g, '').replace(/^\+/, '');
      // Remove country code 880 if present
      if (p.startsWith('880')) p = p.slice(3);
      // Remove leading 0 if present
      if (p.startsWith('0')) p = p.slice(1);
      return p; // returns 10-digit local number (e.g., 1727517598)
    };
    const inputNorm = normalizePhone(phone);
    user = users.find(u => {
      if (!u.phone) return false;
      return normalizePhone(u.phone) === inputNorm && u.password === password;
    });
  } else if (email && email.trim()) {
    // Email login
    user = users.find(u =>
      u.email && u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password
    );
  }

  if (!user) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials. Check your phone/email and password.' });
  }

  // Check if SMS API is configured
  const settings = readJSON('settings.json');
  const smsConfigured = !!(settings.smsApiKey && settings.smsApiKey.trim());
  
  // Admin always bypasses OTP
  if (user.role === 'admin') {
    const session = {...user}; 
    delete session.password;
    return res.json({ ok: true, user: session, otpRequired: false });
  }
  
  // Email login bypasses OTP
  if (email && email.trim()) {
    const session = {...user}; 
    delete session.password;
    return res.json({ ok: true, user: session, otpRequired: false });
  }
  
  // Phone login with SMS configured → require OTP
  if (smsConfigured && phone && phone.trim() && user.phone) {
    const session = {...user}; 
    delete session.password;
    const maskedPhone = user.phone.replace(/(\d{3})\d+(\d{3})$/, '$1****$2');
    
    return res.json({
      ok: true,
      otpRequired: true,
      maskedPhone,
      phone: user.phone,
      pendingUser: session,
    });
  }
  
  // No SMS configured → direct login
  const session = {...user}; 
  delete session.password;
  return res.json({ ok: true, user: session, otpRequired: false });
});

// Admin-only: get a user's password (for credential display)
app.get('/api/users/:id/password', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
  res.json({ ok: true, password: user.password || null });
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
  if (idx === -1) {
    return res.status(404).json({ 
      ok: false, 
      error: 'User not found in database. Please sign out and sign in again to sync your account.' 
    });
  }
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

app.put('/api/notices/:idx', (req, res) => {
  const notices = readJSON('notices.json');
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= notices.length) return res.status(404).json({ ok: false, error: 'Not found' });
  notices[idx] = { ...notices[idx], ...req.body };
  writeJSON('notices.json', notices);
  res.json({ ok: true, notice: notices[idx] });
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

app.put('/api/events/:idx', (req, res) => {
  const events = readJSON('events.json');
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= events.length) return res.status(404).json({ ok: false, error: 'Not found' });
  events[idx] = { ...events[idx], ...req.body };
  writeJSON('events.json', events);
  res.json({ ok: true, event: events[idx] });
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

app.put('/api/batches/:idx', (req, res) => {
  const batches = readJSON('batches.json');
  const idx = parseInt(req.params.idx);
  if (batches[idx]) {
    batches[idx] = req.body;
    writeJSON('batches.json', batches);
    res.json({ ok: true, batch: batches[idx] });
  } else {
    res.status(404).json({ ok: false, error: 'Batch not found' });
  }
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

app.put('/api/results/:id', (req, res) => {
  const results = readJSON('results.json');
  const idx = results.findIndex(r => r.id === req.params.id);
  if (idx >= 0) {
    results[idx] = { ...results[idx], ...req.body };
    writeJSON('results.json', results);
    res.json({ ok: true, result: results[idx] });
  } else {
    res.status(404).json({ ok: false, error: 'Result not found' });
  }
});

app.delete('/api/results/:id', (req, res) => {
  const results = readJSON('results.json');
  const filtered = results.filter(r => r.id !== req.params.id);
  if (filtered.length < results.length) {
    writeJSON('results.json', filtered);
    res.json({ ok: true });
  } else {
    res.status(404).json({ ok: false, error: 'Result not found' });
  }
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

// ── NOTIFICATIONS ─────────────────────────────────
app.get('/api/notifications', (_req, res) => res.json(readJSON('notifications.json')));

app.post('/api/notifications', (req, res) => {
  const notifications = readJSON('notifications.json');
  const notification = {
    id: 'NOTIF-' + Date.now(),
    ...req.body,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(notification);
  writeJSON('notifications.json', notifications);
  res.json({ ok: true, notification });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const notifications = readJSON('notifications.json');
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    writeJSON('notifications.json', notifications);
    res.json({ ok: true });
  } else {
    res.status(404).json({ ok: false, error: 'Notification not found' });
  }
});

app.patch('/api/notifications/mark-all-read', (req, res) => {
  const notifications = readJSON('notifications.json');
  notifications.forEach(n => n.read = true);
  writeJSON('notifications.json', notifications);
  res.json({ ok: true });
});

// ── SEND SMS ──────────────────────────────────────
app.post('/api/send-sms', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).json({ ok: false, error: 'phone and message required' });

  const settings = readJSON('settings.json');
  const SMS_API_KEY = process.env.SMS_API_KEY || settings.smsApiKey || '';
  const SMS_PROVIDER = settings.smsProvider || 'sms.net.bd';

  if (!SMS_API_KEY) {
    return res.status(400).json({ ok: false, error: 'SMS API key not configured. Please contact administrator.' });
  }

  try {
    // Normalize phone number
    let normalized = String(phone).replace(/\s+/g, '').replace(/^\+/, '');
    if (normalized.startsWith('0')) normalized = '880' + normalized.slice(1);
    if (!normalized.startsWith('880')) normalized = '880' + normalized;

    // Build URL based on provider
    let url;
    
    if (SMS_PROVIDER === 'bulksmsbd') {
      const senderId = settings.smsSenderId || '8809617611019';
      const SMS_API_URL = settings.smsApiUrl || 'https://bulksmsbd.net/api/smsapi';
      url = `${SMS_API_URL}?api_key=${SMS_API_KEY}&type=text&number=${normalized}&senderid=${senderId}&message=${encodeURIComponent(message)}`;
    } else if (SMS_PROVIDER === 'sms.net.bd') {
      const SMS_API_URL = settings.smsApiUrl || 'https://api.sms.net.bd/sendsms';
      url = `${SMS_API_URL}?api_key=${SMS_API_KEY}&msg=${encodeURIComponent(message)}&to=${normalized}`;
    } else if (SMS_PROVIDER === 'custom') {
      const SMS_API_URL = settings.smsApiUrl || '';
      if (!SMS_API_URL) {
        return res.status(400).json({ ok: false, error: 'Custom API URL not configured' });
      }
      url = SMS_API_URL
        .replace('{api_key}', SMS_API_KEY)
        .replace('{phone}', normalized)
        .replace('{message}', encodeURIComponent(message))
        .replace('{sender_id}', settings.smsSenderId || '');
    } else {
      const SMS_API_URL = settings.smsApiUrl || 'https://api.sms.net.bd/sendsms';
      url = `${SMS_API_URL}?api_key=${SMS_API_KEY}&msg=${encodeURIComponent(message)}&to=${normalized}`;
    }
    
    console.log('📱 Sending SMS to:', normalized);
    console.log('📡 SMS Provider:', SMS_PROVIDER);
    console.log('🔗 SMS URL:', url.replace(SMS_API_KEY, '***KEY***')); // Hide API key in logs
    
    const r = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
    const responseText = await r.text();
    
    console.log('📨 SMS Response Status:', r.status);
    console.log('📨 SMS Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      return res.status(500).json({ ok: false, error: 'SMS gateway returned invalid response' });
    }
    
    // Universal success detection
    const isSuccess = 
      data.msg === 'Request successfully submitted' ||
      data.status === 'success' || 
      data.success === true || 
      data.error === 0 ||
      data.code === 200 || 
      data.response_code === 202 ||
      (data.response_code >= 200 && data.response_code < 300) ||
      data.success_message ||
      (r.ok && !data.error && !data.error_message);
    
    if (isSuccess) {
      res.json({ ok: true, data });
    } else {
      const errorMsg = data.msg || data.message || data.error || data.error_message || data.response_message || 'SMS sending failed';
      res.status(400).json({ ok: false, error: errorMsg });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to connect to SMS gateway: ' + err.message });
  }
});

// ── START ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎓 Tiarkhali M.M High School - API Server running at http://localhost:${PORT}`);
});


// ── GALLERY ───────────────────────────────────────
app.get('/api/gallery', (_req, res) => res.json(readJSON('gallery.json')));

app.post('/api/gallery', (req, res) => {
  const gallery = readJSON('gallery.json');
  const photo = { id: 'PHOTO-' + Date.now(), ...req.body };
  gallery.unshift(photo);
  writeJSON('gallery.json', gallery);
  res.json({ ok: true, photo });
});

app.delete('/api/gallery/:idx', (req, res) => {
  const gallery = readJSON('gallery.json');
  gallery.splice(parseInt(req.params.idx), 1);
  writeJSON('gallery.json', gallery);
  res.json({ ok: true });
});
