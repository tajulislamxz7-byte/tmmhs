// ================================================
// API CLIENT — talks to Express server via Vite proxy
// Falls back to localStorage if server is offline
// ================================================

const BASE = '/api';

// ── localStorage fallback helpers ────────────────
const LS = {
  get: (key, def) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def; } catch { return def; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

let _serverOnline = null; // null = unknown, true/false = known

async function req(method, path, body) {
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(3000), // 3s timeout
    });
    _serverOnline = true;
    return await res.json();
  } catch (e) {
    _serverOnline = false;
    console.warn('API offline, using localStorage fallback:', path);
    return null;
  }
}

const get   = (path)       => req('GET',   path);
const post  = (path, body) => req('POST',  path, body);
const patch = (path, body) => req('PATCH', path, body);
const del   = (path)       => req('DELETE', path);

// ── Fallback helpers ──────────────────────────────
function lsRegister(data) {
  const users = LS.get('gfa_users', []);
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  const role = data.role || 'student';
  const prefixMap = { student:'STU', teacher:'TCH', alumni:'ALM', staff:'STF' };
  const id = `${prefixMap[role]||'STU'}-${new Date().getFullYear()}-${String(users.length+1).padStart(4,'0')}`;
  const name = `${data.firstName} ${data.lastName}`.trim();
  const clean = (v) => (!v || v === 'Select' || v === 'select') ? '' : v;
  const user = {
    id, name, firstName: data.firstName, lastName: data.lastName,
    email: data.email.toLowerCase().trim(), phone: data.phone||'',
    password: data.password, role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    status: 'pending', createdAt: new Date().toISOString(),
    class: clean(data.class), section: clean(data.section), batch: clean(data.batch),
    bloodGroup: clean(data.bloodGroup), guardian: data.guardian||'',
    subject: data.subject||'', qualification: data.qualification||'',
    graduationYear: data.graduationYear||'', profession: data.profession||'',
    company: data.company||'', university: data.university||'',
    position: data.position||'', department: data.department||'',
    roll:'', address:'', skills:[], achievements:[], gpa:'N/A', attendance:0, bio:'',
  };
  users.push(user);
  LS.set('gfa_users', users);
  LS.set('gfa_users_cache', users);
  const session = {...user}; delete session.password;
  return { ok: true, user: session };
}

function lsLogin(email, password) {
  const users = LS.get('gfa_users', []);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  const session = {...user}; delete session.password;
  return { ok: true, user: session };
}

// ── Public API ────────────────────────────────────
export const api = {
  // Auth
  async register(data) {
    const result = await post('/users/register', data);
    if (result) return result;
    return lsRegister(data);
  },

  async login(email, password) {
    const result = await post('/users/login', { email, password });
    if (result) return result;
    return lsLogin(email, password);
  },

  async getUsers() {
    const users = await get('/users');
    if (users) {
      localStorage.setItem('gfa_users_cache', JSON.stringify(users));
      return users;
    }
    // Fallback: return localStorage users without passwords
    return LS.get('gfa_users', []).map(u => { const c={...u}; delete c.password; return c; });
  },

  async approveUser(id) {
    const result = await patch(`/users/${id}/approve`);
    if (result) return result;
    // Fallback
    const users = LS.get('gfa_users', []);
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { users[idx].status = 'active'; LS.set('gfa_users', users); LS.set('gfa_users_cache', users); }
    return { ok: true };
  },

  async updateUser(id, data) {
    const result = await patch(`/users/${id}`, data);
    if (result) return result;
    const users = LS.get('gfa_users', []);
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { Object.assign(users[idx], data); LS.set('gfa_users', users); LS.set('gfa_users_cache', users); }
    return { ok: true };
  },

  async deleteUser(id) {
    const result = await del(`/users/${id}`);
    if (result) return result;
    const users = LS.get('gfa_users', []).filter(u => u.id !== id);
    LS.set('gfa_users', users); LS.set('gfa_users_cache', users);
    return { ok: true };
  },

  // Notices
  async getNotices() {
    const r = await get('/notices');
    if (r) { LS.set('gfa_notices', r); return r; }
    return LS.get('gfa_notices', []);
  },
  async addNotice(data) {
    const r = await post('/notices', data);
    if (r) return r;
    const notices = LS.get('gfa_notices', []);
    const notice = { id:'N'+Date.now(), ...data, date: new Date().toISOString().split('T')[0] };
    notices.unshift(notice); LS.set('gfa_notices', notices);
    return { ok: true, notice };
  },
  async deleteNotice(idx) {
    const r = await del(`/notices/${idx}`);
    if (r) return r;
    const notices = LS.get('gfa_notices', []); notices.splice(idx, 1); LS.set('gfa_notices', notices);
    return { ok: true };
  },

  // Events
  async getEvents() {
    const r = await get('/events');
    if (r) { LS.set('gfa_events', r); return r; }
    return LS.get('gfa_events', []);
  },
  async addEvent(data) {
    const r = await post('/events', data);
    if (r) return r;
    const events = LS.get('gfa_events', []);
    const event = { id:'EV'+Date.now(), ...data };
    events.unshift(event); LS.set('gfa_events', events);
    return { ok: true, event };
  },
  async deleteEvent(idx) {
    const r = await del(`/events/${idx}`);
    if (r) return r;
    const events = LS.get('gfa_events', []); events.splice(idx, 1); LS.set('gfa_events', events);
    return { ok: true };
  },

  // Batches
  async getBatches() {
    const r = await get('/batches');
    if (r) { LS.set('gfa_batches', r); return r; }
    return LS.get('gfa_batches', []);
  },
  async addBatch(data) {
    const r = await post('/batches', data);
    if (r) return r;
    const batches = LS.get('gfa_batches', []);
    const batch = { id:'B'+Date.now(), ...data, createdAt: new Date().toISOString() };
    batches.unshift(batch); LS.set('gfa_batches', batches);
    return { ok: true, batch };
  },
  async deleteBatch(idx) {
    const r = await del(`/batches/${idx}`);
    if (r) return r;
    const batches = LS.get('gfa_batches', []); batches.splice(idx, 1); LS.set('gfa_batches', batches);
    return { ok: true };
  },

  // Exams
  async getExams() {
    const r = await get('/exams');
    if (r) { LS.set('gfa_exams', r); return r; }
    return LS.get('gfa_exams', []);
  },
  async addExam(data) {
    const r = await post('/exams', data);
    if (r) return r;
    const exams = LS.get('gfa_exams', []);
    const exam = { id:'EX'+Date.now(), ...data, status:'Draft', createdAt: new Date().toISOString() };
    exams.push(exam); LS.set('gfa_exams', exams);
    return { ok: true, exam };
  },
  async updateExam(idx, data) {
    const r = await patch(`/exams/${idx}`, data);
    if (r) return r;
    const exams = LS.get('gfa_exams', []); Object.assign(exams[idx], data); LS.set('gfa_exams', exams);
    return { ok: true };
  },
  async deleteExam(idx) {
    const r = await del(`/exams/${idx}`);
    if (r) return r;
    const exams = LS.get('gfa_exams', []); exams.splice(idx, 1); LS.set('gfa_exams', exams);
    return { ok: true };
  },

  // Results
  async getResults() {
    const r = await get('/results');
    if (r) { LS.set('gfa_results', r); return r; }
    return LS.get('gfa_results', []);
  },
  async saveResults(entries) {
    const r = await post('/results', entries);
    if (r) return r;
    const results = LS.get('gfa_results', []);
    entries.forEach(entry => {
      const idx = results.findIndex(r => r.examId === entry.examId && r.studentId === entry.studentId);
      if (idx >= 0) results[idx] = entry; else results.push(entry);
    });
    LS.set('gfa_results', results);
    return { ok: true };
  },

  // Messages
  async getConversations()              { return (await get('/conversations')) || LS.get('gfa_conversations', []); },
  async createConversation(fromId, toId){ return (await post('/conversations', { fromId, toId })) || { ok: true }; },
  async updateConversation(id, data)    { return (await patch(`/conversations/${id}`, data)) || { ok: true }; },
  async getMessages(convId)             { return (await get(`/messages/${convId}`)) || LS.get('gfa_msgs_'+convId, []); },
  async sendMessage(convId, data)       { return (await post(`/messages/${convId}`, data)) || { ok: true }; },

  // Settings
  async getSettings() {
    const r = await get('/settings');
    if (r) { LS.set('gfa_settings', r); return r; }
    return LS.get('gfa_settings', {});
  },
  async saveSettings(data) {
    const r = await post('/settings', data);
    LS.set('gfa_settings', data);
    return r || { ok: true };
  },
};
