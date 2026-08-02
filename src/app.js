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
import { renderLogin, renderRegister, renderForgotPassword, renderResetPassword, renderPrincipalLogin } from './pages/auth.js';
import { renderTeachers, renderTeacherProfile, renderTeacherDashboard } from './pages/teachers.js';
import { renderAlumni, renderAlumniDashboard }         from './pages/alumni.js';
import { renderBatches, renderBatchDetail } from './pages/batches.js';
import { renderResults, renderStudentDashboard } from './pages/results.js';
import { renderNotices }        from './pages/notices.js';
import { renderEvents }         from './pages/events.js';
import { renderGallery }        from './pages/gallery.js';
import { renderMessages, startMessagesPolling, stopMessagesPolling } from './pages/messages.js';
import { renderAbout }          from './pages/about.js';
import { renderAdminDashboard } from './pages/admin.js';
import { renderStaff, renderStaffDashboard }          from './pages/staff.js';
import { renderPrincipalDashboard } from './pages/principal.js';
import { renderAdmission }      from './pages/admission.js';
import { renderComplaintBox }   from './pages/complaints.js';
import { icon } from './utils/icons.js';
import { students } from './data/schoolConfig.js';
import { generateStudentIDCard } from './utils/idCardGenerator.js';
import { handleProfilePictureUpload, getDefaultAvatar } from './utils/imageHandler.js';

// ── App State ──────────────────────────────────────
let currentPage  = 'home';
let currentParam = null;

const AUTH_PAGES       = ['login', 'register', 'forgot-password', 'reset-password', 'principal-login'];
const PROTECTED_PAGES  = ['student-dashboard','teacher-dashboard','messages','notifications','principal-dashboard'];
const ADMIN_PAGES      = ['admin'];
const PRINCIPAL_PAGES  = ['principal-dashboard'];

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

  if (PRINCIPAL_PAGES.includes(page) && user?.role !== 'principal') {
    showToast('Principal access required.', 'error');
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
  } else if (currentPage === 'principal-dashboard') {
    pageRoot.innerHTML = `<div class="container section-sm text-center" style="padding:60px 0;"><div class="text-muted">Loading principal dashboard...</div></div>`;
    pageRoot.style.paddingTop = '0';
    footerRoot.innerHTML = '';
    bindGlobalActions();
    const html = await renderPrincipalDashboard();
    pageRoot.innerHTML = html;
    bindGlobalActions();
  } else {
    pageRoot.innerHTML = `<div class="container section-sm text-center" style="padding:60px 0;"><div class="text-muted">Loading...</div></div>`;
    const html = await getPageContent(user, role);
    pageRoot.innerHTML = html;
    pageRoot.style.paddingTop = AUTH_PAGES.includes(currentPage) ? '0' : 'var(--nav-height)';
    footerRoot.innerHTML = (['messages'].includes(currentPage)) ? '' : await renderFooter();
    bindGlobalActions();
  }

  // Fix theme icon state
  const dark = document.documentElement.dataset.theme === 'dark';
  document.getElementById('iconSun')?.classList.toggle('hidden', dark);
  document.getElementById('iconMoon')?.classList.toggle('hidden', !dark);
}

async function getPageContent(user, role) {
  switch (currentPage) {
    case 'home': {
      const homeContent = await renderHome();
      const homeExtra = await renderHomeExtra();
      return homeContent + homeExtra;
    }
    case 'students':          return await renderStudents();
    case 'student-profile':   return renderStudentProfile(currentParam);
    case 'student-dashboard': return await renderStudentDashboard(user);
    case 'teachers':          return await renderTeachers();
    case 'teacher-profile':   return await renderTeacherProfile(currentParam);
    case 'teacher-dashboard': return renderTeacherDashboard(user);
    case 'alumni':            return await renderAlumni();
    case 'alumni-dashboard':  return renderAlumniDashboard(user);
    case 'staff':             return await renderStaff();
    case 'staff-dashboard':   return await renderStaffDashboard(user);
    case 'batches':           return await renderBatches();
    case 'batch-detail':      return await renderBatchDetail(currentParam);
    case 'results':           return await renderResults(role, user);
    case 'notices':           return await renderNotices();
    case 'events':            return await renderEvents();
    case 'gallery':           return renderGallery();
    case 'messages':          return renderMessages(user);
    case 'about':             return await renderAbout();
    case 'admin':             return await renderAdminDashboard();
    case 'admission':         return renderAdmission();
    case 'complaints':        return renderComplaintBox();
    case 'notifications':     return await renderNotificationsPage();
    case 'login':             return renderLogin();
    case 'principal-login':   return renderPrincipalLogin();
    case 'register':          return renderRegister();
    case 'forgot-password':   return renderForgotPassword();
    case 'reset-password':    return renderResetPassword();
    default: {
      const homeContent = await renderHome();
      const homeExtra = await renderHomeExtra();
      return homeContent + homeExtra;
    }
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
    else if (result.user.role === 'principal') navigate('teacher-profile', result.user.id);
    else if (result.user.role === 'teacher') navigate('teacher-dashboard');
    else if (result.user.role === 'alumni') navigate('alumni-dashboard');
    else if (result.user.role === 'staff') navigate('staff-dashboard');
    else navigate('student-dashboard');
  };

  window.handlePrincipalLogin = async function(e) {
    e.preventDefault();
    const email    = document.getElementById('principalLoginEmail')?.value?.trim();
    const password = document.getElementById('principalLoginPassword')?.value;
    const errBox   = document.getElementById('principalLoginError');
    const errText  = document.getElementById('principalLoginErrorText');
    const btn      = document.querySelector('#principalLoginForm button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Verifying...'; }

    const result = await auth.login(email, password);

    if (btn) { btn.disabled = false; btn.textContent = 'Sign In as Principal'; }

    if (!result.ok) {
      if (errBox && errText) {
        errText.textContent = result.error;
        errBox.style.display = 'flex';
        errBox.style.gap = '8px';
        errBox.style.alignItems = 'center';
      }
      return;
    }

    // Security check: Only allow principal role
    if (result.user.role !== 'principal') {
      if (errBox && errText) {
        errText.textContent = 'Access denied. This portal is only for principal accounts.';
        errBox.style.display = 'flex';
        errBox.style.gap = '8px';
        errBox.style.alignItems = 'center';
      }
      // Logout the non-principal user
      auth.logout();
      return;
    }

    showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
    navigate('teacher-profile', result.user.id);
  };

  window.handleGoogleLogin = function() {
    const CLIENT_ID = '346294500383-gdrfvr4a5rglllsft2prdke7je7i40d5.apps.googleusercontent.com';

    if (typeof google === 'undefined') {
      showToast('Google Sign-In not loaded. Try again.', 'error');
      return;
    }

    // Get selected role from login form (defaults to 'student' if not found)
    const selectedRole = document.querySelector('.role-btn.active')?.textContent?.toLowerCase() || 'student';

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
            // SECURITY: Block teacher, staff, and principal registration via Google
            // Only admin can create these accounts
            if (selectedRole === 'teacher' || selectedRole === 'staff' || selectedRole === 'principal') {
              showToast('Teachers and staff accounts must be created by the school administrator. Please contact the admin office.', 'error');
              return;
            }
            
            // For students, check if they want to link to existing unlinked account
            if (selectedRole === 'student') {
              const studentId = prompt('Do you have a Student ID from the school? If yes, enter it to link your account.\n\nLeave blank to create a new profile:');
              
              if (studentId && studentId.trim()) {
                // Try to find and link to existing unlinked student
                const existingStudent = users.find(u => 
                  u.id === studentId.trim() && 
                  u.role === 'student' && 
                  u.status === 'unlinked'
                );
                
                if (existingStudent) {
                  // Link Google account to existing student
                  existingStudent.email = gUser.email.toLowerCase();
                  existingStudent.firstName = gUser.given_name || gUser.name.split(' ')[0];
                  existingStudent.lastName = gUser.family_name || gUser.name.split(' ').slice(1).join(' ');
                  existingStudent.name = gUser.name;
                  existingStudent.avatar = gUser.picture;
                  existingStudent.status = 'active'; // Auto-activate linked accounts
                  existingStudent.googleAuth = true;
                  existingStudent.linkedAt = new Date().toISOString();
                  
                  localStorage.setItem('gfa_users', JSON.stringify(users));
                  localStorage.setItem('gfa_users_cache', JSON.stringify(users));
                  
                  // Save session
                  const session = { ...existingStudent };
                  delete session.password;
                  localStorage.setItem('gfa_session', JSON.stringify(session));
                  
                  showToast(`Welcome, ${existingStudent.name.split(' ')[0]}! Your account has been linked.`, 'success');
                  navigate('student-dashboard');
                  return;
                } else {
                  showToast('Student ID not found or already linked. Creating new profile instead.', 'warning');
                }
              }
            }
            
            // Auto-register new Google user with selected role
            const rolePrefixes = { student: 'STU', teacher: 'TCH', alumni: 'ALU', staff: 'STF', admin: 'ADM' };
            const prefix = rolePrefixes[selectedRole] || 'STU';
            const id = `${prefix}-${new Date().getFullYear()}-G${String(users.length + 1).padStart(4,'0')}`;
            
            user = {
              id,
              name: gUser.name,
              firstName: gUser.given_name || gUser.name.split(' ')[0],
              lastName: gUser.family_name || gUser.name.split(' ').slice(1).join(' '),
              email: gUser.email.toLowerCase(),
              phone: '',
              password: '',
              role: selectedRole,
              avatar: gUser.picture,
              status: 'active',
              class: '', section: '', batch: '',
              bloodGroup: '', guardian: '',
              subject: '', qualification: '', experience: '',
              position: '', department: '',
              graduationYear: '', profession: '', company: '', university: '',
              createdAt: new Date().toISOString(),
              googleAuth: true,
              roll: '', address: '', skills: [], achievements: [], gpa: 'N/A', bio: '',
            };
            users.push(user);
            localStorage.setItem('gfa_users', JSON.stringify(users));
            localStorage.setItem('gfa_users_cache', JSON.stringify(users));
          }

          // Save session
          const session = { ...user };
          delete session.password;
          localStorage.setItem('gfa_session', JSON.stringify(session));

          showToast(`Welcome, ${user.name.split(' ')[0]}!`, 'success');
          if (user.role === 'admin') navigate('admin');
          else if (user.role === 'principal') navigate('teacher-profile', user.id);
          else if (user.role === 'teacher') navigate('teacher-dashboard');
          else if (user.role === 'alumni') navigate('alumni-dashboard');
          else if (user.role === 'staff') navigate('staff-dashboard');
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

  window.profilePicChange = async function(input) {
    const previewImg = document.getElementById('profilePicPreview');
    if (!previewImg) return;

    const file = input.files?.[0];
    if (!file) return;

    try {
      const base64 = await handleProfilePictureUpload(input, previewImg);
      // Store in hidden field or global variable
      window._uploadedProfilePic = base64;
      showToast('Profile picture uploaded! ✓', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to upload image', 'error');
      input.value = '';
      previewImg.src = getDefaultAvatar();
      window._uploadedProfilePic = null;
    }
  };

  window.selectRegRole = function(role, btn) {
    document.querySelectorAll('#regRoleTabs .role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('regRoleInput').value = role;
    const container = document.getElementById('regRoleFields');
    if (window.__regRoleRender) container.innerHTML = window.__regRoleRender(role);
  };

  window.toggleRegistrationMode = function(mode) {
    // Update hidden input
    const modeInput = document.getElementById('registrationMode');
    if (modeInput) modeInput.value = mode;
    
    // Update button styles
    const linkBtn = document.getElementById('linkModeBtn');
    const newBtn = document.getElementById('newModeBtn');
    
    if (mode === 'link') {
      linkBtn?.classList.remove('btn-secondary');
      linkBtn?.classList.add('btn-primary');
      newBtn?.classList.remove('btn-primary');
      newBtn?.classList.add('btn-secondary');
      
      // Show link fields, hide new fields
      document.querySelectorAll('[data-mode="link"]').forEach(el => el.style.display = '');
      document.querySelectorAll('[data-mode="new"]').forEach(el => el.style.display = 'none');
    } else {
      linkBtn?.classList.remove('btn-primary');
      linkBtn?.classList.add('btn-secondary');
      newBtn?.classList.remove('btn-secondary');
      newBtn?.classList.add('btn-primary');
      
      // Show new fields, hide link fields
      document.querySelectorAll('[data-mode="link"]').forEach(el => el.style.display = 'none');
      document.querySelectorAll('[data-mode="new"]').forEach(el => el.style.display = '');
    }
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
    const emailErrorDiv = document.getElementById('emailError');
    const phoneErrorDiv = document.getElementById('phoneError');
    const passwordErrorDiv = document.getElementById('passwordError');
    const confirmPasswordErrorDiv = document.getElementById('confirmPasswordError');
    const emailInput = document.getElementById('regEmail');
    const phoneInput = document.getElementById('regPhone');
    const passwordInput = document.getElementById('regPwd');
    const confirmPasswordInput = document.getElementById('regConfirmPwd');
    const data    = Object.fromEntries(new FormData(form));

    // Clear previous errors
    errBox.style.display = 'none';
    errBox.textContent = '';
    
    [
      { div: emailErrorDiv, input: emailInput },
      { div: phoneErrorDiv, input: phoneInput },
      { div: passwordErrorDiv, input: passwordInput },
      { div: confirmPasswordErrorDiv, input: confirmPasswordInput }
    ].forEach(({ div, input }) => {
      if (div) {
        div.style.display = 'none';
        div.textContent = '';
      }
      if (input) input.style.borderColor = '';
    });

    // Validate password length
    if (data.password.length < 6) {
      if (passwordErrorDiv) {
        passwordErrorDiv.textContent = 'Password must be at least 6 characters.';
        passwordErrorDiv.style.display = 'block';
        passwordInput.style.borderColor = '#dc2626';
      }
      return;
    }

    // Validate password match
    if (data.password !== data.confirmPassword) {
      if (confirmPasswordErrorDiv) {
        confirmPasswordErrorDiv.textContent = 'Passwords do not match.';
        confirmPasswordErrorDiv.style.display = 'block';
        confirmPasswordInput.style.borderColor = '#dc2626';
      }
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }

    const role = document.getElementById('regRoleInput')?.value || 'student';
    
    // REQUIRED: Profile picture must be uploaded
    const avatar = window._uploadedProfilePic || null;
    
    if (!avatar) {
      if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
      errBox.textContent = 'Profile picture is required. Please upload a clear photo of your face.';
      errBox.style.display = 'block';
      // Scroll to profile picture section
      document.getElementById('regProfilePictureInput')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Please upload your profile picture', 'error');
      return;
    }
    
    const result = await auth.register({ ...data, role, avatar });

    if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }

    if (!result.ok) {
      // Check if it's an email error
      if (result.error && result.error.toLowerCase().includes('email')) {
        if (emailErrorDiv) {
          emailErrorDiv.textContent = result.error;
          emailErrorDiv.style.display = 'block';
          emailInput.style.borderColor = '#dc2626';
        }
      } 
      // Check if it's a phone error
      else if (result.error && result.error.toLowerCase().includes('phone')) {
        if (phoneErrorDiv) {
          phoneErrorDiv.textContent = result.error;
          phoneErrorDiv.style.display = 'block';
          phoneInput.style.borderColor = '#dc2626';
        }
      }
      // Other errors show at top
      else {
        errBox.textContent = result.error;
        errBox.style.display = 'block';
      }
      return;
    }

    // Success message - different for linked vs new accounts
    if (result.linked) {
      showToast('Account successfully linked to ' + result.user.name + '! Your existing profile and results are now accessible.', 'success');
      // Auto-login for linked accounts since they're already verified
      localStorage.setItem('gfa_session', JSON.stringify(result.user));
      if (result.user.role === 'student') navigate('student-dashboard');
      else navigate('home');
    } else {
      showToast('Account created for ' + result.user.name + '! Admin will review and approve your account shortly.', 'success');
      setTimeout(() => navigate('login'), 1800);
    }
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

  // ── Admin: Add Student Modal ──
  window.openAddStudentModal = function() {
    if (!requireAdmin()) return;
    
    const modalHtml = `
      <div class="modal-overlay" id="addStudentOverlay" onclick="closeAddStudentModal()" style="display:flex;">
        <div class="modal-card" onclick="event.stopPropagation()" style="max-width:600px;width:90%;max-height:90vh;overflow-y:auto;">
          <div class="modal-header">
            <h2 style="font-size:20px;font-weight:800;">Add Student to Database</h2>
            <button onclick="closeAddStudentModal()" class="btn-close" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-secondary);">&times;</button>
          </div>
          <div class="modal-body">
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px;color:#1e40af;">
              ${icon('info', 14, '#2563eb')} Students added here will exist in the database without login credentials. They can register later using their Student ID, Roll Number, and Date of Birth.
            </div>
            <form id="addStudentForm" onsubmit="adminAddStudent(event)">
              <div class="form-group">
                <label>Full Name <span style="color:var(--danger);">*</span></label>
                <input type="text" name="name" class="form-input" placeholder="e.g. John Doe" required>
              </div>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label>Roll Number <span style="color:var(--danger);">*</span></label>
                  <input type="text" name="roll" class="form-input" placeholder="e.g. 101" required>
                </div>
                <div class="form-group">
                  <label>Date of Birth <span style="color:var(--danger);">*</span></label>
                  <input type="date" name="birthday" class="form-input" required>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label>Class <span style="color:var(--danger);">*</span></label>
                  <select name="class" class="form-input form-select" required>
                    <option value="">Select</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Section <span style="color:var(--danger);">*</span></label>
                  <select name="section" class="form-input form-select" required>
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Batch <span style="color:var(--danger);">*</span></label>
                  <select name="batch" class="form-input form-select" required>
                    <option value="">Select</option>
                    <option value="B2024">Batch 2024</option>
                    <option value="B2025">Batch 2025</option>
                    <option value="B2026">Batch 2026</option>
                    <option value="B2027">Batch 2027</option>
                    <option value="B2028">Batch 2028</option>
                  </select>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label>Guardian Name</label>
                  <input type="text" name="guardian" class="form-input" placeholder="Father / Mother name">
                </div>
                <div class="form-group">
                  <label>Blood Group</label>
                  <select name="bloodGroup" class="form-input form-select">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Phone (Optional)</label>
                <input type="tel" name="phone" class="form-input" placeholder="Guardian contact number">
              </div>

              <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px;">
                <button type="button" class="btn btn-secondary" onclick="closeAddStudentModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">
                  ${icon('userPlus', 14, 'white')} Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  };

  window.closeAddStudentModal = function() {
    const overlay = document.getElementById('addStudentOverlay');
    if (overlay) overlay.remove();
  };

  window.adminAddStudent = async function(e) {
    e.preventDefault();
    if (!requireAdmin()) return;

    const form = document.getElementById('addStudentForm');
    const data = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type="submit"]');
    
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Adding...';
    }

    try {
      // Get existing users to generate Student ID
      const users = await api.getUsers();
      const studentCount = users.filter(u => u.role === 'student').length;
      const studentId = `STU-${new Date().getFullYear()}-${String(studentCount + 1).padStart(4, '0')}`;

      // Create student record without email/password
      const studentData = {
        id: studentId,
        name: data.name.trim(),
        firstName: data.name.trim().split(' ')[0],
        lastName: data.name.trim().split(' ').slice(1).join(' '),
        roll: data.roll.trim(),
        birthday: data.birthday,
        class: data.class,
        section: data.section,
        batch: data.batch,
        guardian: data.guardian?.trim() || '',
        bloodGroup: data.bloodGroup || '',
        phone: data.phone?.trim() || '',
        email: '', // No email yet
        password: '', // No password yet
        role: 'student',
        status: 'unlinked', // Special status for pre-added students
        avatar: `https://i.imgur.com/x9wE0QT.png`,
        createdAt: new Date().toISOString(),
        address: '',
        skills: [],
        achievements: [],
        gpa: 'N/A',
        bio: '',
      };

      // Save to database using api
      const result = await api.addStudent(studentData);
      
      if (result.ok) {
        showToast(`Student ${data.name} added successfully! Student ID: ${studentId}`, 'success');
        closeAddStudentModal();
        // Refresh the admin students tab
        if (typeof switchAdminTab === 'function') {
          await switchAdminTab('students', null);
        }
      } else {
        showToast(result.error || 'Failed to add student', 'error');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      showToast('Failed to add student. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = icon('userPlus', 14, 'white') + ' Add Student';
      }
    }
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

  window.markNotificationRead = async function(idx) {
    const notifs = JSON.parse(localStorage.getItem('gfa_notifications') || '[]');
    if (notifs[idx]) {
      await api.markNotificationRead(notifs[idx].id);
      // Refresh the page to show updated data
      navigate('notifications');
    }
  };

  window.markAllNotificationsRead = async function() {
    await api.markAllNotificationsRead();
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
  // Store overlay click handler reference
  let mobileMenuClickHandler = null;

  window.toggleMobileMenu = function() {
    console.log('toggleMobileMenu called');
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburgerBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    console.log('Menu element:', menu);
    console.log('Hamburger element:', hamburger);
    
    if (!menu) {
      console.error('Mobile menu element not found');
      return;
    }
    
    const isCurrentlyHidden = menu.classList.contains('hidden');
    console.log('Menu is currently hidden:', isCurrentlyHidden);
    
    if (isCurrentlyHidden) {
      // Hide user dropdown if open
      if (userDropdown) {
        userDropdown.classList.add('hidden');
      }
      
      // Show menu (slide in)
      menu.classList.remove('hidden');
      console.log('Menu opened');
      
      // Add active class to hamburger for animation
      if (hamburger) {
        hamburger.classList.add('active');
      }
      
      // Add click-outside handler after a small delay to prevent immediate closing
      setTimeout(() => {
        mobileMenuClickHandler = (e) => {
          const menuElement = document.getElementById('mobileMenu');
          const hamburgerElement = document.getElementById('hamburgerBtn');
          
          // Close menu if clicking outside (not on menu or hamburger)
          if (menuElement && 
              !menuElement.contains(e.target) && 
              hamburgerElement && 
              !hamburgerElement.contains(e.target)) {
            window.toggleMobileMenu();
          }
        };
        document.addEventListener('click', mobileMenuClickHandler);
      }, 100);
      
    } else {
      // Hide menu (slide out)
      menu.classList.add('hidden');
      console.log('Menu closed');
      
      // Remove active class from hamburger
      if (hamburger) {
        hamburger.classList.remove('active');
      }
      
      // Remove click-outside handler
      if (mobileMenuClickHandler) {
        document.removeEventListener('click', mobileMenuClickHandler);
        mobileMenuClickHandler = null;
      }
    }
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

  window.downloadStudentID = async function(studentId) {
    const allUsers = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
    let s = allUsers.find(u => u.id === studentId && u.role === 'student');
    if (!s) s = students.find(st => st.id === studentId);
    if (!s) { showToast('Student not found', 'error'); return; }
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    modal.innerHTML = `<div style="background:white;border-radius:16px;padding:32px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="text-align:center;margin-bottom:24px;"><div style="width:64px;height:64px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div><h3 style="font-size:20px;font-weight:800;color:#111827;margin-bottom:8px;">Student ID Card</h3><p style="font-size:14px;color:#6b7280;">${s.name} • ${s.id}</p></div><div style="display:flex;gap:12px;"><button id="btnDownloadID" style="flex:1;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;border:none;padding:14px 24px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">Download</button><button id="btnPrintID" style="flex:1;background:white;color:#4f46e5;border:2px solid #4f46e5;padding:14px 24px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;">Print</button></div><button id="btnCancelID" style="width:100%;background:transparent;color:#6b7280;border:none;padding:12px;margin-top:12px;font-size:14px;cursor:pointer;">Cancel</button></div>`;
    document.body.appendChild(modal);

    document.getElementById('btnDownloadID').onclick = async function() {
      this.textContent = 'Generating...'; this.disabled = true;
      const canvas = await generateStudentIDCard(s);
      if (canvas) {
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Student_ID_${s.name.replace(/\s+/g, '_')}.png`;
          a.click();
          URL.revokeObjectURL(url);
          modal.remove();
          showToast('ID card downloaded!', 'success');
        });
      } else { this.textContent = 'Download'; this.disabled = false; }
    };

    document.getElementById('btnPrintID').onclick = async function() {
      this.textContent = 'Generating...'; this.disabled = true;
      const canvas = await generateStudentIDCard(s);
      if (canvas) {
        const win = window.open('', '_blank');
        if (!win) { showToast('Allow popups to print', 'warning'); this.textContent = 'Print'; this.disabled = false; return; }
        win.document.write(`<html><head><title>Print ID</title><style>@media print{body{margin:0;}img{max-width:100%;}}</style></head><body><img src="${canvas.toDataURL()}" style="max-width:100%;"/><script>setTimeout(()=>window.print(),500);</script></body></html>`);
        win.document.close();
        modal.remove();
      } else { this.textContent = 'Print'; this.disabled = false; }
    };

    document.getElementById('btnCancelID').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
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

// ── Custom Confirm Dialog ──────────────────────────
window.confirmDialog = function(message, title = 'Confirm Action') {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;animation:fadeIn 0.2s;';
    
    modal.innerHTML = `
      <div class="modal" style="max-width:440px;animation:slideUp 0.3s;margin:20px;">
        <div class="modal-header" style="border-bottom:1px solid var(--border);padding:20px 24px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:12px;background:var(--warning-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${icon('alertTriangle', 20, 'var(--warning)')}
            </div>
            <div class="font-semibold" style="font-size:16px;">${title}</div>
          </div>
        </div>
        <div class="modal-body" style="padding:24px;">
          <p style="color:var(--text-secondary);line-height:1.6;margin:0;">${message}</p>
        </div>
        <div class="modal-footer" style="border-top:1px solid var(--border);padding:16px 24px;display:flex;gap:12px;justify-content:flex-end;">
          <button class="btn btn-secondary" id="confirmCancel" style="min-width:100px;">Cancel</button>
          <button class="btn btn-danger" id="confirmOk" style="min-width:100px;">Delete</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const okBtn = modal.querySelector('#confirmOk');
    const cancelBtn = modal.querySelector('#confirmCancel');
    
    const cleanup = () => {
      modal.style.animation = 'fadeOut 0.2s';
      setTimeout(() => modal.remove(), 200);
    };
    
    okBtn.onclick = () => {
      cleanup();
      resolve(true);
    };
    
    cancelBtn.onclick = () => {
      cleanup();
      resolve(false);
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        cleanup();
        resolve(false);
      }
    };
    
    // Focus OK button for keyboard accessibility
    setTimeout(() => okBtn.focus(), 100);
  });
};

// ── Inline pages ────────────────────────────────────
async function renderNotificationsPage() {
  // Load notifications from API
  const notifs = await api.getNotifications();

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

  // Sync settings from API server to localStorage on startup
  api.getSettings().then(settings => {
    if (settings) {
      // Settings are already cached in getSettings() — nothing extra needed
    }
  }).catch(() => {});

  render();
})();
