// ================================================
// AUTH STORE — localStorage-based user management
// ================================================

const USERS_KEY   = 'gfa_users';
const SESSION_KEY = 'gfa_session';

// ── Seed default accounts ─────────────────────────
function seedDefaults() {
  const existing = getAll();
  // Only seed the admin account — no demo students
  const hasAdmin = existing.some(u => u.email === 'admin@tiarkhali-mmhs.edu.bd');

  if (!hasAdmin) {
    existing.push({
      id: 'ADM-0001',
      firstName: 'Admin', lastName: 'User',
      name: 'Admin',
      email: 'admin@tiarkhali-mmhs.edu.bd',
      phone: '',
      password: 'admin123',
      role: 'admin',
      class: '', section: '', batch: '',
      bloodGroup: '', guardian: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminTMMH',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    save(existing);
  }
}

// ── Storage helpers ───────────────────────────────
function getAll() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function save(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Public API ────────────────────────────────────
export function register(data) {
  const users = getAll();

  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  const role = data.role || 'student';
  const prefixMap = { student:'STU', teacher:'TCH', alumni:'ALM', staff:'STF' };
  const prefix = prefixMap[role] || 'STU';
  const id = `${prefix}-${new Date().getFullYear()}-${String(users.length + 1).padStart(4, '0')}`;
  const name = `${data.firstName} ${data.lastName}`.trim();
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  const base = {
    id, name,
    firstName: data.firstName,
    lastName:  data.lastName,
    email:     data.email.toLowerCase().trim(),
    phone:     data.phone || '',
    password:  data.password,
    role,
    avatar,
    status:   'pending',
    createdAt: new Date().toISOString(),
    birthCertificate: data.birthCertificate || '',
  };

  if (role === 'student') {
    Object.assign(base, {
      class: data.class || '', section: data.section || '', batch: data.batch || '',
      bloodGroup: data.bloodGroup || '', guardian: data.guardian || '',
      roll: '', address: '', skills: [], achievements: [], gpa: 'N/A', attendance: 0, bio: '',
    });
  } else if (role === 'teacher') {
    Object.assign(base, {
      subject: data.subject || '', qualification: data.qualification || '',
      experience: data.experience || '', joiningDate: new Date().toISOString().split('T')[0],
      status: 'Working',
    });
  } else if (role === 'alumni') {
    Object.assign(base, {
      graduationYear: data.graduationYear || '', university: data.university || '',
      profession: data.profession || '', company: data.company || '',
      currentCity: '', country: '', socialMedia: { linkedin:'', facebook:'' },
      achievements: [],
    });
  } else if (role === 'staff') {
    Object.assign(base, {
      position: data.position || '', department: data.department || '',
      joiningDate: new Date().toISOString().split('T')[0], status: 'Active',
    });
  }

  users.push(base);
  save(users);
  return { ok: true, user: base };
}

export function login(email, password) {
  const users = getAll();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim()
      && u.password === password
  );
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  // Don't block pending — just log them in (admin can restrict later)
  // if (user.status === 'pending') return { ok: false, error: '...' };

  // Save session (without password)
  const session = { ...user };
  delete session.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, user: session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export function getAllUsers() {
  return getAll().map(u => { const c = {...u}; delete c.password; return c; });
}

export function approveUser(id) {
  const users = getAll();
  const idx = users.findIndex(u => u.id === id);
  if (idx > -1) { users[idx].status = 'active'; save(users); return true; }
  return false;
}

export function updateCurrentUser(updates) {
  const session = getCurrentUser();
  if (!session) return false;
  const users = getAll();
  const idx = users.findIndex(u => u.id === session.id);
  if (idx === -1) return false;
  Object.assign(users[idx], updates);
  save(users);
  // Update session too
  const newSession = { ...users[idx] };
  delete newSession.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return true;
}

// ── Migrate old demo data ─────────────────────────
function migrateOldData() {
  const existing = getAll();
  // Remove old demo/greenfield accounts
  const cleaned = existing.filter(u =>
    !u.email.includes('greenfield.edu') &&
    !u.email.includes('student.greenfield') &&
    u.name !== 'Demo Student' &&
    u.name !== 'Super Admin'
  );
  if (cleaned.length !== existing.length) {
    save(cleaned);
    // Clear session if it was a demo account
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (session && (session.email?.includes('greenfield.edu') || session.name === 'Demo Student')) {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch(e) {}
  }
}

// Init on import
migrateOldData();
seedDefaults();
