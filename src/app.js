// ================================================
// TIARKHALI M.M HIGH SCHOOL — MAIN APP ROUTER
// ================================================

import * as auth from './utils/auth.js';
import { api } from './utils/api.js';
import { renderNavbar }         from './components/navbar.js';
import { renderFooter }         from './components/footer.js';
import { renderSearchModal, initSearch } from './components/search.js';
import { renderHome, renderHomeExtra }   from './pages/home.js';
import { renderStudents, renderStudentProfile } from './pages/students.js';
import { renderLogin, renderRegister, renderForgotPassword, renderResetPassword } from './pages/auth.js';
import { renderTeachers, renderTeacherProfile, renderTeacherDashboard } from './pages/teachers.js';
import { renderAlumni }         from './pages/alumni.js';
import { renderBatches, renderBatchDetail } from './pages/batches.js';
import { renderResults, renderStudentDashboard } from './pages/results.js';
import { renderAttendance }     from './pages/attendance.js';
import { renderNotices }        from './pages/notices.js';
import { renderEvents }         from './pages/events.js';
import { renderGallery }        from './pages/gallery.js';
import { renderMessages, startMessagesPolling, stopMessagesPolling } from './pages/messages.js';
import { renderAbout }          from './pages/about.js';
import { renderAdminDashboard } from './pages/admin.js';
import { renderStaff }          from './pages/staff.js';
import { renderAdmission }      from './pages/admission.js';
import { renderComplaintBox }   from './pages/complaints.js';
import { icon } from './utils/icons.js';
import { students } from './data/sampleData.js';

// ── App State ──────────────────────────────────────
let currentPage  = 'home';
let currentParam = null;

const AUTH_PAGES       = ['login', 'register', 'forgot-password', 'reset-password'];
const PROTECTED_PAGES  = ['student-dashboard','teacher-dashboard','messages','assignments','notifications'];
const ADMIN_PAGES      = ['admin'];

// ── Router ─────────────────────────────────────────
window.navigate = function(page, param = null) {
  const user = auth.getCurrentUser();

  // Stop messages polling when leaving messages page
  if (currentPage === 'messages' && page !== 'messages') {
    stopMessagesPolling();
  }

  if (PROTECTED_PAGES.includes(page) && !user) {
    showToast('Please sign in to access this page.', 'warning');
    currentPage  = 'login';
    currentParam = null;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (ADMIN_PAGES.includes(page) && user?.role !== 'admin') {
    showToast('Admin access required.', 'error');
    return;
  }

  currentPage  = page;
  currentParam = param;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Start messages polling when entering messages page
  if (page === 'messages') {
    setTimeout(startMessagesPolling, 100);
  }
};

// ── Render cycle ───────────────────────────────────
async function render() {
  const user       = auth.getCurrentUser();
  const loggedIn   = !!user;
  const role       = user?.role || 'guest';

  const navRoot    = document.getElementById('navbar-root');
  const pageRoot   = document.getElementById('page-root');
  const footerRoot = document.getElementById('footer-root');
  const searchRoot = document.getElementById('search-root');

  // Navbar
  if (AUTH_PAGES.includes(currentPage)) {
    navRoot.innerHTML  = '';
    navRoot.style.display = 'none';
  } else {
    navRoot.innerHTML  = renderNavbar(currentPage, loggedIn, role, user);
    navRoot.style.display = '';
  }

  // Search
  searchRoot.innerHTML = renderSearchModal();
  initSearch();

  // Page — may be async (admin)
  if (currentPage === 'admin') {
    pageRoot.innerHTML = `<div class="container section-sm text-center" style="padding:60px 0;"><div class="text-muted">Loading admin panel...</div></div>`;
    pageRoot.style.paddingTop = '0';
    footerRoot.innerHTML = '';
    bindGlobalActions();
    const html = await renderAdminDashboard();
    pageRoot.innerHTML = html;
    bindGlobalActions();
  } else {
    pageRoot.innerHTML      = getPageContent(user, role);
    pageRoot.style.paddingTop = AUTH_PAGES.includes(currentPage) ? '0' : 'var(--nav-height)';
    footerRoot.innerHTML = (['messages'].includes(currentPage)) ? '' : renderFooter();
    bindGlobalActions();
  }

  // Fix theme icon state
  const dark = document.documentElement.dataset.theme === 'dark';
  document.getElementById('iconSun')?.classList.toggle('hidden', dark);
  document.getElementById('iconMoon')?.classList.toggle('hidden', !dark);
}

function getPageContent(user, role) {
  switch (currentPage) {
    case 'home':              return renderHome() + renderHomeExtra();
    case 'students':          return renderStudents();
    case 'student-profile':   return renderStudentProfile(currentParam);
    case 'student-dashboard': return renderStudentDashboard(user);
    case 'teachers':          return renderTeachers();
    case 'teacher-profile':   return renderTeacherProfile(currentParam);
    case 'teacher-dashboard': return renderTeacherDashboard(user);
    case 'alumni':            return renderAlumni();
    case 'batches':           return renderBatches();
    case 'batch-detail':      return renderBatchDetail(currentParam);
    case 'results':           return renderResults(role, user);
    case 'attendance':        return renderAttendance();
    case 'notices':           return renderNotices();
    case 'events':            return renderEvents();
    case 'gallery':           return renderGallery();
    case 'messages':          return renderMessages(user);
    case 'about':             return renderAbout();
    case 'admin':             return renderAdminDashboard();
    case 'staff':             return renderStaff();
    case 'admission':         return renderAdmission();
    case 'complaints':        return renderComplaintBox();
    case 'assignments':       return renderAssignmentsPage();
    case 'notifications':     return renderNotificationsPage();
    case 'login':             return renderLogin();
    case 'register':          return renderRegister();
    case 'forgot-password':   return renderForgotPassword();
    case 'reset-password':    return renderResetPassword();
    default:                  return renderHome() + renderHomeExtra();
  }
}

// ── Global Actions ─────────────────────────────────
function bindGlobalActions() {

  // ── Auth ──
  window.handleLogin = async function(e) {
    e.preventDefault();
    const email    = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;
    const errBox   = document.getElementById('loginError');
    const errText  = document.getElementById('loginErrorText');
    const btn      = document.querySelector('#loginForm button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }

    const result = await auth.login(email, password);

    if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }

    if (!result.ok) {
      if (errBox && errText) {
        errText.textContent = result.error;
        errBox.style.display = 'flex';
        errBox.style.gap = '8px';
        errBox.style.alignItems = 'center';
      }
      return;
    }

    showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
    if (result.user.role === 'admin') navigate('admin');
    else if (result.user.role === 'teacher') navigate('teacher-dashboard');
    else navigate('student-dashboard');
  };

  window.handleGoogleLogin = function() {
    const CLIENT_ID = '346294500383-gdrfvr4a5rglllsft2prdke7je7i40d5.apps.googleusercontent.com';

    if (typeof google === 'undefined') {
      showToast('Google Sign-In not loaded. Try again.', 'error');
      return;
    }

    google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'email profile openid',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          showToast('Google Sign-In failed: ' + tokenResponse.error, 'error');
          return;
        }
        // Fetch user info from Google
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
          });
          const gUser = await res.json();

          // Check if user exists in our system
          const users = JSON.parse(localStorage.getItem('gfa_users') || '[]');
          let user = users.find(u => u.email.toLowerCase() === gUser.email.toLowerCase());

          if (!user) {
            // Auto-register new Google user as student
            const id = `STU-${new Date().getFullYear()}-G${String(users.length + 1).padStart(4,'0')}`;
            user = {
              id,
              name: gUser.name,
              firstName: gUser.given_name || gUser.name.split(' ')[0],
              lastName: gUser.family_name || gUser.name.split(' ').slice(1).join(' '),
              email: gUser.email.toLowerCase(),
              phone: '',
              password: '',
              role: 'student',
              avatar: gUser.picture,
              status: 'active',
              class: '', section: '', batch: '',
              bloodGroup: '', guardian: '',
              createdAt: new Date().toISOString(),
              googleAuth: true,
            };
            users.push(user);
            localStorage.setItem('gfa_users', JSON.stringify(users));
          }

          // Save session
          const session = { ...user };
          delete session.password;
          localStorage.setItem('gfa_session', JSON.stringify(session));

          showToast(`Welcome, ${user.name.split(' ')[0]}!`, 'success');
          if (user.role === 'admin') navigate('admin');
          else if (user.role === 'teacher') navigate('teacher-dashboard');
          else navigate('student-dashboard');

        } catch (err) {
          showToast('Could not fetch Google profile. Try again.', 'error');
        }
      },
    }).requestAccessToken();
  };

  window.bcUploadChange = function(input) {
    const name = input.files?.[0]?.name;
    const existing = input.parentElement.querySelector('.file-name');
    if (existing) existing.remove();
    if (name) {
      const el = document.createElement('div');
      el.className = 'file-name';
      el.style.cssText = 'font-size:12px;color:var(--primary);margin-top:8px;font-weight:600;';
      el.textContent = '✓ ' + name;
      input.insertAdjacentElement('afterend', el);
    }
  };

  window.selectRegRole = function(role, btn) {
    document.querySelectorAll('#regRoleTabs .role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('regRoleInput').value = role;
    const container = document.getElementById('regRoleFields');
    if (window.__regRoleRender) container.innerHTML = window.__regRoleRender(role);
  };

  window.__regRoleRender = function(role) {
    const ROLE_CONFIGS = {
      student: { fields: [
        {section:'academic', inputs:[
          {type:'select', name:'class', label:'Class', opts:['Select','Class 6','Class 7','Class 8','Class 9','Class 10']},
          {type:'select', name:'section', label:'Section', opts:['Select','A','B','C','D']},
          {type:'select', name:'batch', label:'Batch', opts:['Select','B2024:Batch 2024','B2023:Batch 2023','B2022:Batch 2022','B2021:Batch 2021','B2020:Batch 2020']},
        ]},
        {section:'grid', inputs:[
          {type:'text', name:'guardian', label:'Guardian Name', placeholder:'Father / Mother name'},
          {type:'select', name:'bloodGroup', label:'Blood Group', opts:['Select','A+','A-','B+','B-','AB+','AB-','O+','O-']},
        ]},
      ]},
      teacher: { fields: [
        {section:'grid', inputs:[
          {type:'text', name:'subject', label:'Subject', placeholder:'e.g. Mathematics'},
          {type:'text', name:'qualification', label:'Qualification', placeholder:'e.g. MSc, DU'},
        ]},
        {section:'single', inputs:[
          {type:'number', name:'experience', label:'Experience (years)', placeholder:'e.g. 5'},
        ]},
      ]},
      alumni: { fields: [
        {section:'grid', inputs:[
          {type:'number', name:'graduationYear', label:'Graduation Year', placeholder:'e.g. 2024'},
          {type:'text', name:'university', label:'University', placeholder:'e.g. DU'},
        ]},
        {section:'grid', inputs:[
          {type:'text', name:'profession', label:'Profession', placeholder:'e.g. Engineer'},
          {type:'text', name:'company', label:'Company', placeholder:'e.g. Google'},
        ]},
      ]},
      staff: { fields: [
        {section:'grid', inputs:[
          {type:'select', name:'position', label:'Position', opts:['Select','Office Assistant','Librarian','Security Guard','Peon','Cleaner','Lab Assistant','IT Support']},
          {type:'select', name:'department', label:'Department', opts:['Select','Administration','Library','Security','General','Maintenance','Science Lab','ICT']},
        ]},
      ]},
    };
    const cfg = ROLE_CONFIGS[role];
    if (!cfg) return '';
    return cfg.fields.map(f => {
      const inner = f.inputs.map(inp => {
        if (inp.type === 'select') {
          return `<div class="form-group"><label style="font-size:11px;">${inp.label}</label><select name="${inp.name}" class="form-input form-select" style="font-size:12px;">${inp.opts.map(o => { const [v,l] = o.includes(':') ? o.split(':') : [o,o]; return '<option value="' + v + '">' + l + '</option>'; }).join('')}</select></div>`;
        }
        return '<div class="form-group"><label style="font-size:11px;">' + inp.label + '</label><input type="' + inp.type + '" name="' + inp.name + '" class="form-input" placeholder="' + (inp.placeholder||'') + '" style="font-size:12px;"></div>';
      }).join('');
      if (f.section === 'grid') return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' + inner + '</div>';
      if (f.section === 'academic') return '<div style="padding:14px;background:var(--primary-50);border-radius:12px;border:1.5px solid var(--primary-100);"><div style="font-size:12px;font-weight:700;color:var(--primary);margin-bottom:10px;display:flex;align-items:center;gap:6px;">' + icon('bookOpen',13,'var(--primary)') + ' Academic Placement</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">' + inner + '</div></div>';
      return inner;
    }).join('');
  };

  window.handleRegister = async function(e) {
    e.preventDefault();
    const form    = document.getElementById('registerForm');
    const errBox  = document.getElementById('regError');
    const data    = Object.fromEntries(new FormData(form));

    if (data.password !== data.confirmPassword) {
      errBox.textContent = 'Passwords do not match.';
      errBox.style.display = 'block';
      return;
    }
    if (data.password.length < 6) {
      errBox.textContent = 'Password must be at least 6 characters.';
      errBox.style.display = 'block';
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }

    const role = document.getElementById('regRoleInput')?.value || 'student';
    const result = await auth.register({ ...data, role });

    if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }

    if (!result.ok) {
      errBox.textContent = result.error;
      errBox.style.display = 'block';
      return;
    }

    showToast('Account created for ' + result.user.name + '! Admin will review and approve your account shortly.', 'success');
    setTimeout(() => navigate('login'), 1800);
  };

  window.handleForgotPassword = async function(e) {
    e.preventDefault();
    const email = document.getElementById('fpEmail')?.value?.trim();
    const btn   = e.target.querySelector('button[type="submit"]');
    const successBox = document.getElementById('fpSuccess');

    // Check if email exists
    const users = await auth.getAllUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const userName = user ? user.name : email;

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const resetData = { code, email, expires: Date.now() + 15 * 60 * 1000 };
    localStorage.setItem('gfa_reset', JSON.stringify(resetData));

    // Send email via EmailJS
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    try {
      await emailjs.send('service_au1x8wm', 'template_t9utqmv', {
        to_email:    email,
        to_name:     userName,
        reset_code:  code,
        school_name: 'Tiarkhali M.M High School and College',
        expire_time: '15 minutes',
        message:     `Your password reset code is: ${code}. This code expires in 15 minutes.`,
        reply_to:    email,
        from_name:   'Tiarkhali M.M High School',
      });

      if (successBox) {
        successBox.style.display = 'flex';
        successBox.style.gap = '8px';
        successBox.style.alignItems = 'center';
        successBox.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>
            <div style="font-weight:600;">Reset code sent to ${email}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">Check your Gmail inbox. Code expires in 15 minutes.</div>
            <button class="btn btn-sm btn-primary" style="margin-top:8px;font-size:12px;" onclick="navigate('reset-password')">Enter Code →</button>
          </div>`;
      }
      document.getElementById('fpForm')?.reset();
      showToast('Reset code sent to your Gmail!', 'success');

    } catch (err) {
      showToast('Failed to send email. Please try again.', 'error');
      console.error('EmailJS error:', err);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Reset Link'; }
    }
  };

  window.handleResetPassword = async function(e) {
    e.preventDefault();
    const code = document.getElementById('rpCode')?.value?.trim();
    const pwd = document.getElementById('rpPassword')?.value;
    const errBox = document.getElementById('rpError');
    const errText = document.getElementById('rpErrorText');

    try {
      const stored = JSON.parse(localStorage.getItem('gfa_reset'));
      if (!stored || Date.now() > stored.expires) {
        errText.textContent = 'Reset code expired. Request a new one.';
        errBox.style.display = 'flex'; return;
      }
      if (stored.code !== code) {
        errText.textContent = 'Invalid reset code.';
        errBox.style.display = 'flex'; return;
      }
      const users = await auth.getAllUsers();
      const user = users.find(u => u.email.toLowerCase() === stored.email.toLowerCase());
      if (!user) {
        errText.textContent = 'No account found with that email.';
        errBox.style.display = 'flex'; return;
      }
      await api.updateUser(user.id, { password: pwd });
      localStorage.removeItem('gfa_reset');
      showToast('Password reset successful! Please login.', 'success');
      setTimeout(() => navigate('login'), 1500);
    } catch {
      errText.textContent = 'Something went wrong. Try again.';
      errBox.style.display = 'flex';
    }
  };

  window.selectRole = function(btn) {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  window.togglePassword = function(inputId, btnId) {
    const inp = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!inp) return;
    const showing = inp.type === 'text';
    inp.type = showing ? 'password' : 'text';
    if (btn) btn.innerHTML = icon(showing ? 'eye' : 'eyeOff', 16);
  };

  window.signOut = function() {
    auth.logout();
    showToast('Signed out successfully.', 'success');
    navigate('home');
  };

  // ── Admin-only guard ──
  window.requireAdmin = function(action) {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
      showToast('Admin access required to perform this action.', 'error');
      return false;
    }
    return true;
  };

  window.markNotificationRead = function(idx) {
    const notifs = JSON.parse(localStorage.getItem('gfa_notifications') || '[]');
    if (notifs[idx]) { notifs[idx].read = true; localStorage.setItem('gfa_notifications', JSON.stringify(notifs)); }
    const el = document.querySelectorAll('.card[onclick*="markNotificationRead"]')[idx];
    if (el) { el.style.borderLeft = ''; el.querySelector('div[style*="background:var(--primary);border-radius:50%"]')?.remove(); }
  };

  window.markAllNotificationsRead = function() {
    const notifs = JSON.parse(localStorage.getItem('gfa_notifications') || '[]');
    notifs.forEach(n => n.read = true);
    localStorage.setItem('gfa_notifications', JSON.stringify(notifs));
    showToast('All marked as read', 'success');
    navigate('notifications');
  };

  // Clear all stored data and start completely fresh
  window.clearAllSessions = function() {
    localStorage.removeItem('gfa_session');
    localStorage.removeItem('gfa_users');
    showToast('All sessions cleared. Please register or use demo credentials.', 'info');
    setTimeout(() => { location.reload(); }, 1200);
  };

  // ── Nav ──
  window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    const open = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', open);
    menu.classList.toggle('open', !open);
  };

  window.toggleTheme = function() {
    const html = document.documentElement;
    const dark = html.dataset.theme === 'dark';
    html.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('theme', html.dataset.theme);
    document.getElementById('iconSun')?.classList.toggle('hidden', !dark);
    document.getElementById('iconMoon')?.classList.toggle('hidden', dark);
  };

  window.toggleUserDropdown = function() {
    document.getElementById('userDropdown')?.classList.toggle('hidden');
  };

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#userMenuWrapper')) {
      document.getElementById('userDropdown')?.classList.add('hidden');
    }
  }, { once: true });

  // ── Filters ──
  window.filterStudents = function() {
    const q   = document.getElementById('studentSearch')?.value?.toLowerCase() || '';
    const cls = document.getElementById('classFilter')?.value || '';
    const sec = document.getElementById('sectionFilter')?.value || '';
    document.querySelectorAll('.student-card').forEach(card => {
      const show = (!q || (card.dataset.name||'').includes(q))
        && (!cls || card.dataset.class === cls)
        && (!sec || card.dataset.section === sec);
      card.style.display = show ? '' : 'none';
    });
  };

  window.setView = function(view) {
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;
    grid.style.gridTemplateColumns = view === 'list' ? '1fr' : 'repeat(auto-fill,minmax(260px,1fr))';
  };

  window.qrFallback = function(img) {
    img.onerror = null;
    img.style.display = 'none';
    const div = document.createElement('div');
    div.style.cssText = 'text-align:center;';
    div.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" style="margin:0 auto;display:block;"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
    const label = document.createElement('div');
    label.style.cssText = 'font-size:11px;text-align:center;color:#9ca3af;margin-top:4px;';
    label.textContent = 'QR Code ID';
    img.parentElement.append(div, label);
    showToast('QR service unavailable — using placeholder', 'info');
  };

  window.downloadStudentID = function(studentId) {
    const s = students.find(st => st.id === studentId);
    if (!s) { showToast('Student not found', 'error'); return; }
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Student ID - ${s.name}</title>
      <style>
        @page { margin:0; size:85.6mm 54mm; }
        * { margin:0; padding:0; box-sizing:border-box; font-family:Arial,sans-serif; }
        body { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f0f0f0; }
        .id-card { width:340px; background:linear-gradient(135deg,#2563eb,#1e40af); border-radius:12px; padding:3px; }
        .id-inner { background:white; border-radius:10px; padding:16px; }
        .id-header { display:flex; align-items:center; gap:12px; border-bottom:2px solid #e5e7eb; padding-bottom:10px; }
        .id-header img { width:64px; height:64px; border-radius:8px; object-fit:cover; }
        .id-header h2 { font-size:16px; color:#111827; }
        .id-header .id-num { font-size:11px; color:#6b7280; margin-top:2px; }
        .id-body { padding-top:10px; display:flex; gap:12px; }
        .id-body table { width:100%; font-size:11px; }
        .id-body td { padding:2px 0; color:#374151; }
        .id-body td:first-child { color:#9ca3af; width:65px; }
        .id-qr { width:72px; height:72px; flex-shrink:0; border-radius:6px; border:1px solid #e5e7eb; padding:4px; background:white; }
        .id-qr img { width:100%; height:100%; }
        .id-footer { font-size:9px; color:#9ca3af; text-align:center; margin-top:8px; border-top:1px solid #e5e7eb; padding-top:6px; }
      </style></head><body>
      <div class="id-card"><div class="id-inner">
        <div class="id-header">
          <img src="${s.avatar}" onerror="this.style.display='none'">
          <div>
            <h2>${s.name}</h2>
            <div class="id-num">${s.id} · Roll ${s.roll}</div>
          </div>
        </div>
        <div class="id-body">
          <table>
            <tr><td>Class</td><td>${s.class}</td></tr>
            <tr><td>Section</td><td>${s.section}</td></tr>
            <tr><td>Batch</td><td>${s.batch || '—'}</td></tr>
            <tr><td>Blood</td><td>${s.bloodGroup}</td></tr>
            <tr><td>Guardian</td><td>${s.guardian}</td></tr>
          </table>
          <div class="id-qr">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GFA%7C${s.id}%7C${encodeURIComponent(s.name)}" alt="QR">
          </div>
        </div>
        <div class="id-footer">Tiarkhali M.M High School · Student Identity Card</div>
      </div></div>
      window.onload=function(){window.print();window.close()};<\/script>
    `);
    win.document.close();
    showToast('ID card opened for print', 'success');
  };

  // ── Stat counters ──
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let cur = 0;
    const step = Math.ceil(target / 50);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur.toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 25);
  });

  // Profile tabs
  window.switchProfileTab = function(tab, btn) {
    document.querySelectorAll('#profileTabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const content = document.getElementById('profileTabContent');
    if (!content) return;
    import('./pages/students.js').then(m => {
      content.innerHTML = m.renderProfileTabContent(tab, currentParam);
    });
  };
}

// ── Toast ───────────────────────────────────────────
window.showToast = function(msg, type = 'info') {
  const icons = { success: icon('checkCircle',16,'white'), error: icon('xCircle',16,'white'), warning: icon('alertTriangle',16,'white'), info: icon('info',16,'white') };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = 'display:flex;align-items:center;gap:10px;';
  toast.innerHTML = `${icons[type]||''}<span style="flex:1;">${msg}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:16px;padding:0;line-height:1;">${icon('close',14,'rgba(255,255,255,0.8)')}</button>`;
  container.appendChild(toast);
  setTimeout(() => toast?.remove(), 4500);
};

// ── Inline pages ────────────────────────────────────
function renderAssignmentsPage() {
  // Load assignments from localStorage (admin can add, students see their own)
  const user = auth.getCurrentUser();
  const allAssignments = JSON.parse(localStorage.getItem('gfa_assignments') || '[]');
  const items = allAssignments.filter(a =>
    !a.class || !user?.class || a.class === user.class
  );

  if (items.length === 0) {
    return `
      <div class="page-container">
        <div class="page-header">
          <div class="container">
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('clipboardList',28,'white')} Assignments</h1>
            <p class="page-subtitle">Your assignments from teachers</p>
          </div>
        </div>
        <div class="container section-sm">
          <div class="card"><div class="card-body text-center text-muted" style="padding:60px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin:0 auto 16px;display:block;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
            No assignments yet. Check back later.
          </div></div>
        </div>
      </div>`;
  }

  const pending = items.filter(i => !i.done);
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('clipboardList',28,'white')} Assignments</h1>
          <p class="page-subtitle">${pending.length} pending · ${items.filter(i=>i.done).length} submitted</p>
        </div>
      </div>
      <div class="container section-sm">
        <div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap;">
          ${[{l:'Total',v:items.length,c:'var(--primary)'},{l:'Pending',v:pending.length,c:'var(--warning)'},{l:'Submitted',v:items.filter(i=>i.done).length,c:'var(--success)'}].map(s=>`
            <div class="card" style="padding:16px 24px;min-width:100px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:${s.c};">${s.v}</div>
              <div style="font-size:12px;color:var(--text-muted);">${s.l}</div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${items.map(a => `
            <div class="card">
              <div class="card-body" style="padding:18px 22px;">
                <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                  <div style="width:44px;height:44px;border-radius:12px;background:${a.done?'#d1fae5':'#fef3c7'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${icon(a.done?'checkCircle':'clipboardList', 20, a.done?'#059669':'#d97706')}
                  </div>
                  <div style="flex:1;min-width:160px;">
                    <div style="font-weight:600;font-size:14px;">${a.title}</div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:3px;">${a.subject} &nbsp;·&nbsp; ${a.teacher}</div>
                  </div>
                  <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:13px;font-weight:600;color:${a.done?'var(--success)':'var(--warning)'};">${a.dueDate || 'No due date'}</div>
                    <span class="badge badge-${a.done?'success':'warning'}" style="margin-top:4px;">${a.done?'Submitted':'Pending'}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

function renderNotificationsPage() {
  // Load notifications from localStorage
  const notifs = JSON.parse(localStorage.getItem('gfa_notifications') || '[]');

  if (notifs.length === 0) {
    return `
      <div class="page-container">
        <div class="page-header">
          <div class="container">
            <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('bell',28,'white')} Notifications</h1>
            <p class="page-subtitle">No notifications yet</p>
          </div>
        </div>
        <div class="container section-sm">
          <div class="card"><div class="card-body text-center text-muted" style="padding:60px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin:0 auto 16px;display:block;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            You have no notifications.
          </div></div>
        </div>
      </div>`;
  }

  const unread = notifs.filter(n => !n.read);
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 class="page-title" style="display:flex;align-items:center;gap:10px;">${icon('bell',28,'white')} Notifications</h1>
              <p class="page-subtitle">${unread.length} unread</p>
            </div>
            <button class="btn btn-secondary" style="background:rgba(255,255,255,0.15);color:white;border-color:rgba(255,255,255,0.3);" onclick="markAllNotificationsRead()">
              ${icon('checkCircle',14,'white')} Mark all read
            </button>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${notifs.map((n,i)=>`
            <div class="card" style="${!n.read?'border-left:4px solid var(--primary);':''};cursor:pointer;" onclick="markNotificationRead(${i})">
              <div class="card-body" style="padding:14px 18px;">
                <div style="display:flex;align-items:center;gap:14px;">
                  <div style="width:44px;height:44px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${icon('bell', 20, 'var(--primary)')}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:13px;${!n.read?'color:var(--primary)':''}">${n.title}</div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${n.message}</div>
                  </div>
                  <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:11px;color:var(--text-muted);">${new Date(n.createdAt).toLocaleDateString()}</div>
                    ${!n.read?'<div style="width:8px;height:8px;background:var(--primary);border-radius:50%;margin:4px 0 0 auto;"></div>':''}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}

// ── Init ────────────────────────────────────────────
(function init() {
  // Restore saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  // Sync users from API server to localStorage cache on startup
  api.getUsers().then(users => {
    if (users && users.length > 0) {
      // Users are already cached in getUsers() — nothing extra needed
    }
  }).catch(() => {});

  render();
})();
