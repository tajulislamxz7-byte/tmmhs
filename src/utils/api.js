// ================================================
// API CLIENT — talks to Express server via Vite proxy
// Falls back to localStorage if server is offline
// ================================================

// Detect environment and set API base URL
// Production URL can be overridden from Admin → Settings → API Configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
function _getBase() {
  if (isDevelopment) return '/api';
  try {
    const s = JSON.parse(localStorage.getItem('gfa_settings') || '{}');
    // Your Render.com backend URL - already deployed!
    return s.apiBaseUrl || 'https://school-project-qi8m.onrender.com/api';
  } catch {
    return 'https://school-project-qi8m.onrender.com/api';
  }
}

// ── localStorage fallback helpers ────────────────
const LS = {
  get: (key, def) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def; } catch { return def; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

let _serverOnline = null; // null = unknown, true/false = known
let _hasShownOfflineWarning = false;

async function req(method, path, body) {
  try {
    const res = await fetch(_getBase() + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30000), // 30s timeout for Render.com cold starts
    });
    
    // Server is online
    if (_serverOnline === false) {
      console.log('[API] Server reconnected ✓');
      _serverOnline = true;
      _hasShownOfflineWarning = false;
    } else if (_serverOnline === null) {
      _serverOnline = true;
      console.log('[API] Server connected ✓');
    }
    
    // Always parse JSON response, even for error status codes
    const json = await res.json();
    
    // If response is not ok (4xx, 5xx), return the error JSON
    if (!res.ok) {
      return json; // Server error responses still contain { ok: false, error: "..." }
    }
    
    return json;
  } catch (e) {
    // Server is offline
    if (_serverOnline !== false && !_hasShownOfflineWarning) {
      console.warn('[API] Server offline, using localStorage fallback');
      console.warn('[API] Make sure server is running: npm run server');
      _hasShownOfflineWarning = true;
    }
    _serverOnline = false;
    // API offline, using localStorage fallback
    return null;
  }
}

const get   = (path)       => req('GET',   path);
const post  = (path, body) => req('POST',  path, body);
const put   = (path, body) => req('PUT',   path, body);
const patch = (path, body) => req('PATCH', path, body);
const del   = (path)       => req('DELETE', path);

// ── Fallback helpers ──────────────────────────────
function lsRegister(data) {
  const users = LS.get('gfa_users', []);
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  
  const role = data.role || 'student';
  
  // ======== ACCOUNT LINKING FOR STUDENTS ========
  // If student provides Student ID, try to link to existing record
  if (role === 'student' && data.studentId && data.studentId.trim()) {
    const existingStudent = users.find(u => 
      u.id === data.studentId.trim() && 
      u.role === 'student'
    );
    
    if (!existingStudent) {
      return { ok: false, error: 'Student ID not found in our database. Please contact school administration.' };
    }
    
    // Check if already linked/active
    if (existingStudent.status === 'active' && existingStudent.email && existingStudent.password) {
      return { ok: false, error: 'This Student ID is already linked to an account. Please use the login page.' };
    }
    
    // Verify with roll number if provided by BOTH admin and user
    if (data.roll && data.roll.trim() && existingStudent.roll && existingStudent.roll.trim()) {
      if (existingStudent.roll.trim() !== data.roll.trim()) {
        return { ok: false, error: 'Roll number does not match our records. Please check and try again.' };
      }
    }
    
    // Verify with birthday if provided by BOTH admin and user
    if (data.birthday && data.birthday.trim() && existingStudent.birthday && existingStudent.birthday.trim()) {
      if (existingStudent.birthday !== data.birthday.trim()) {
        return { ok: false, error: 'Date of birth does not match our records. Please check and try again.' };
      }
    }
    
    // Link account: update existing student record with login credentials
    existingStudent.email = data.email.toLowerCase().trim();
    existingStudent.phone = data.phone || existingStudent.phone;
    existingStudent.password = data.password;
    existingStudent.firstName = data.firstName || existingStudent.firstName;
    existingStudent.lastName = data.lastName || existingStudent.lastName;
    existingStudent.name = `${data.firstName || existingStudent.firstName} ${data.lastName || existingStudent.lastName}`.trim();
    existingStudent.status = 'active'; // Auto-activate linked accounts
    existingStudent.linkedAt = new Date().toISOString();
    
    LS.set('gfa_users', users);
    LS.set('gfa_users_cache', users);
    
    const session = {...existingStudent}; 
    delete session.password;
    return { ok: true, user: session, linked: true };
  }
  
  // ======== CREATE NEW ACCOUNT ========
  // Only create new account if NO Student ID provided
  const prefixMap = { student:'STU', teacher:'TCH', staff:'STF' };
  const id = `${prefixMap[role]||'STU'}-${new Date().getFullYear()}-${String(users.length+1).padStart(4,'0')}`;
  const name = `${data.firstName} ${data.lastName}`.trim();
  const clean = (v) => (!v || v === 'Select' || v === 'select') ? '' : v;
  const user = {
    id, name, firstName: data.firstName, lastName: data.lastName,
    email: data.email.toLowerCase().trim(), phone: data.phone||'',
    password: data.password, role,
    avatar: `https://i.imgur.com/x9wE0QT.png`,
    status: 'pending', createdAt: new Date().toISOString(),
    class: clean(data.class), section: clean(data.section), batch: clean(data.batch),
    bloodGroup: clean(data.bloodGroup), guardian: data.guardian||'',
    subject: data.subject||'', qualification: data.qualification||'',
    graduationYear: data.graduationYear||'', profession: data.profession||'',
    company: data.company||'', university: data.university||'',
    position: data.position||'', department: data.department||'',
    roll: data.roll||'', address:'', skills:[], achievements:[], gpa:'N/A', bio:'',
    birthday: data.birthday||'',
  };
  users.push(user);
  LS.set('gfa_users', users);
  LS.set('gfa_users_cache', users);
  const session = {...user}; delete session.password;
  return { ok: true, user: session };
}

// Phone/email login — conditional OTP based on SMS configuration
function lsLoginByPhoneOrEmail(phone, email, password) {
  const users = LS.get('gfa_users', []);
  const norm = (p) => String(p||'').replace(/\s+/g,'').replace(/^\+/,'').replace(/^880/,'').replace(/^0/,'');
  let user = null;
  if (phone) {
    const n = norm(phone);
    user = users.find(u => u.phone && norm(u.phone) === n && u.password === password);
  } else if (email) {
    user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
  }
  if (!user) return { ok: false, error: 'Invalid credentials. Check your phone/email and password.' };
  
  // Check if SMS is configured
  const settings = LS.get('gfa_settings', {});
  const smsConfigured = !!(settings.smsApiKey && settings.smsApiKey.trim());
  
  // Admin bypasses OTP
  if (user.role === 'admin') {
    const session = {...user}; 
    delete session.password;
    return { ok: true, user: session, otpRequired: false };
  }
  
  // Email login bypasses OTP
  if (email && email.trim()) {
    const session = {...user}; 
    delete session.password;
    return { ok: true, user: session, otpRequired: false };
  }
  
  // Phone login with SMS configured → require OTP
  if (smsConfigured && phone && phone.trim() && user.phone) {
    const session = {...user}; 
    delete session.password;
    const maskedPhone = user.phone.replace(/(\d{3})\d+(\d{3})$/, '$1****$2');
    
    return {
      ok: true,
      otpRequired: true,
      maskedPhone,
      phone: user.phone,
      pendingUser: session,
    };
  }
  
  // No SMS configured → direct login
  const session = {...user}; 
  delete session.password;
  return { ok: true, user: session, otpRequired: false };
}

function lsLogin(email, password) {
  const users = LS.get('gfa_users', []);
  const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  const session = {...user}; delete session.password;
  return { ok: true, user: session };
}

// ── Public API ────────────────────────────────────
export const api = {
  // Auth
  async loginWithPhoneOrEmail(phone, email, password) {
    const result = await post('/users/login', { phone, email, password });
    if (result) return result;
    return lsLoginByPhoneOrEmail(phone, email, password);
  },

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
    if (result) {
      // If backend returns 404 or error, provide helpful message
      if (result.ok === false) {
        return { 
          ok: false, 
          error: 'Your profile is not synced with the server. Please sign out and sign in again to fix this.' 
        };
      }
      return result;
    }
    // Fallback to localStorage
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

  async addStudent(studentData) {
    const result = await post('/users/add-student', studentData);
    if (result) return result;
    // Fallback: add to localStorage
    const users = LS.get('gfa_users', []);
    users.push(studentData);
    LS.set('gfa_users', users);
    LS.set('gfa_users_cache', users);
    return { ok: true, student: studentData };
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
  async updateNotice(idx, data) {
    const r = await put(`/notices/${idx}`, data);
    if (r) return r;
    const notices = LS.get('gfa_notices', []);
    if (notices[idx]) { notices[idx] = { ...notices[idx], ...data }; LS.set('gfa_notices', notices); }
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
  async updateEvent(idx, data) {
    const r = await put(`/events/${idx}`, data);
    if (r) return r;
    const events = LS.get('gfa_events', []);
    if (events[idx]) { events[idx] = { ...events[idx], ...data }; LS.set('gfa_events', events); }
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
  async updateBatch(idx, data) {
    const r = await put(`/batches/${idx}`, data);
    if (r) return r;
    const batches = LS.get('gfa_batches', []);
    if (batches[idx]) {
      batches[idx] = data;
      LS.set('gfa_batches', batches);
    }
    return { ok: true };
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
  async updateResult(resultId, updates) {
    const r = await put(`/results/${resultId}`, updates);
    if (r) {
      const results = LS.get('gfa_results', []);
      const idx = results.findIndex(res => res.id === resultId);
      if (idx >= 0) {
        results[idx] = { ...results[idx], ...updates };
        LS.set('gfa_results', results);
      }
      return r;
    }
    const results = LS.get('gfa_results', []);
    const idx = results.findIndex(res => res.id === resultId);
    if (idx >= 0) {
      results[idx] = { ...results[idx], ...updates };
      LS.set('gfa_results', results);
      return { ok: true };
    }
    return { ok: false, error: 'Result not found' };
  },
  async deleteResult(resultId) {
    const r = await del(`/results/${resultId}`);
    if (r) {
      const results = LS.get('gfa_results', []);
      const filtered = results.filter(res => res.id !== resultId);
      LS.set('gfa_results', filtered);
      return r;
    }
    const results = LS.get('gfa_results', []);
    const filtered = results.filter(res => res.id !== resultId);
    LS.set('gfa_results', filtered);
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
    if (r) { 
      LS.set('gfa_settings', r); 
      return r; 
    }
    return LS.get('gfa_settings', {});
  },
  async saveSettings(data) {
    const r = await post('/settings', data);
    // Always update localStorage with the new data
    LS.set('gfa_settings', data);
    // Immediately refresh from server to ensure sync
    if (r?.ok) {
      const fresh = await get('/settings');
      if (fresh) {
        LS.set('gfa_settings', fresh);
      }
    }
    return r || { ok: true };
  },

  // Notifications
  async getNotifications() {
    const r = await get('/notifications');
    if (r) { 
      LS.set('gfa_notifications', r); 
      return r; 
    }
    return LS.get('gfa_notifications', []);
  },
  async addNotification(data) {
    const r = await post('/notifications', data);
    if (r) return r;
    // Fallback to localStorage
    const notifs = LS.get('gfa_notifications', []);
    const notification = {
      id: 'NOTIF-' + Date.now(),
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(notification);
    LS.set('gfa_notifications', notifs);
    return { ok: true, notification };
  },
  async markNotificationRead(id) {
    const r = await patch(`/notifications/${id}/read`);
    if (r) return r;
    // Fallback to localStorage
    const notifs = LS.get('gfa_notifications', []);
    const notif = notifs.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      LS.set('gfa_notifications', notifs);
    }
    return { ok: true };
  },
  async markAllNotificationsRead() {
    const r = await patch('/notifications/mark-all-read');
    if (r) return r;
    // Fallback to localStorage
    const notifs = LS.get('gfa_notifications', []);
    notifs.forEach(n => n.read = true);
    LS.set('gfa_notifications', notifs);
    return { ok: true };
  },

  // Gallery
  async getGallery() {
    const r = await get('/gallery');
    if (r) { 
      LS.set('gfa_gallery', r); 
      return r; 
    }
    return LS.get('gfa_gallery', []);
  },
  async addGalleryPhoto(data) {
    const r = await post('/gallery', data);
    if (r) return r;
    // Fallback to localStorage
    const gallery = LS.get('gfa_gallery', []);
    const photo = {
      id: 'PHOTO-' + Date.now(),
      ...data,
    };
    gallery.unshift(photo);
    LS.set('gfa_gallery', gallery);
    return { ok: true, photo };
  },
  async deleteGalleryPhoto(idx) {
    const r = await del(`/gallery/${idx}`);
    if (r) return r;
    // Fallback to localStorage
    const gallery = LS.get('gfa_gallery', []);
    gallery.splice(idx, 1);
    LS.set('gfa_gallery', gallery);
    return { ok: true };
  },
};
