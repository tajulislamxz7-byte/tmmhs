// ================================================
// AUTH PAGES — Login / Register / Forgot Password
// Uses real localStorage auth store
// ================================================
import { classes, batches } from '../data/schoolConfig.js';
import { icon } from '../utils/icons.js';

export function renderPrincipalLogin() {
  return `
  <div class="auth-page">
    <div class="auth-bg" style="background:linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);">
      <div class="auth-shape auth-shape-1"></div>
      <div class="auth-shape auth-shape-2"></div>
    </div>
    <div class="auth-container">

      <!-- Left brand panel -->
      <div class="auth-left hide-mobile">
        <div class="auth-left-content">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
            <svg width="48" height="48" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="10" fill="white" opacity="0.15"/>
              <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.9"/>
              <circle cx="17" cy="19" r="4.5" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <div>
              <div style="font-size:22px;font-weight:800;color:white;">Tiarkhali M.M High School</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.6);">Principal Portal</div>
            </div>
          </div>
          <h2 style="font-size:30px;font-weight:800;color:white;line-height:1.2;margin-bottom:16px;">
            Principal<br>Management Portal
          </h2>
          <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.9;margin-bottom:32px;">
            Secure access to institutional management,<br>oversight, and administrative tools.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${[
              ['Oversee All Operations', 'eye'],
              ['Manage Staff & Teachers', 'users'],
              ['Review Student Reports', 'fileText'],
              ['Publish School Notices', 'bell'],
            ].map(([label, ico]) => `
              <div style="display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.9);font-size:13px;">
                <span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(255,255,255,0.15);border-radius:8px;flex-shrink:0;">
                  ${icon(ico, 14, 'white')}
                </span>
                ${label}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-right">
        <div class="auth-form-container">
          <button onclick="navigate('home')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:28px;padding:0;">
            ${icon('arrowLeft', 14)} Back to Home
          </button>

          <!-- Principal Badge -->
          <div style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg, #fbbf24, #f59e0b);padding:6px 14px;border-radius:20px;margin-bottom:16px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span style="color:white;font-size:11px;font-weight:700;letter-spacing:0.5px;">PRINCIPAL ACCESS</span>
          </div>

          <h1 style="font-size:26px;font-weight:800;margin-bottom:6px;">Principal Sign In</h1>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;">
            Enter your credentials to access the principal dashboard
          </p>

          <!-- Security Notice -->
          <div style="background:var(--warning-50);border:1px solid var(--warning);border-radius:10px;padding:12px 14px;font-size:12px;color:var(--text-primary);margin-bottom:20px;display:flex;gap:8px;">
            ${icon('shield', 14, 'var(--warning)')}
            <div>
              <strong>Secure Login</strong>
              <div style="margin-top:2px;color:var(--text-muted);">Only authorized principal accounts can access this portal. All login attempts are logged.</div>
            </div>
          </div>

          <!-- Error msg -->
          <div id="principalLoginError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;margin-bottom:16px;">
            ${icon('alertTriangle', 14, '#dc2626')} <span id="principalLoginErrorText"></span>
          </div>

          <form id="principalLoginForm" onsubmit="handlePrincipalLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('mail', 13)} Email Address
              </label>
              <input type="email" id="principalLoginEmail" class="form-input" placeholder="principal@school.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('lock', 13)} Password
              </label>
              <div style="position:relative;">
                <input type="password" id="principalLoginPassword" class="form-input" placeholder="Enter your password" required autocomplete="current-password" style="padding-right:44px;">
                <button type="button" onclick="togglePassword('principalLoginPassword','eyePrincipalBtn')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;" id="eyePrincipalBtn">
                  ${icon('eye', 16)}
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-lg w-full" style="background:linear-gradient(135deg, #1e40af, #7c3aed);border:none;">
              ${icon('logIn', 16, 'white')} Sign In as Principal
            </button>
          </form>

          <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:20px;">
            Need access? Contact the school administrator
          </p>

          <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:12px;">
            <button onclick="navigate('login')" style="color:var(--primary);font-weight:600;background:none;border:none;cursor:pointer;">
              Sign in as Student/Teacher →
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderLogin() {
  return `
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-shape auth-shape-1"></div>
      <div class="auth-shape auth-shape-2"></div>
    </div>
    <div class="auth-container">

      <!-- Left brand panel -->
      <div class="auth-left hide-mobile">
        <div class="auth-left-content">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
            <svg width="48" height="48" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="10" fill="white" opacity="0.15"/>
              <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.9"/>
              <circle cx="17" cy="19" r="4.5" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <div>
              <div style="font-size:22px;font-weight:800;color:white;">Tiarkhali M.M High School</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.6);">Management Platform</div>
            </div>
          </div>
          <h2 style="font-size:30px;font-weight:800;color:white;line-height:1.2;margin-bottom:16px;">
            Welcome back to<br>your school portal
          </h2>
          <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.9;margin-bottom:32px;">
            Sign in to access your dashboard, results,<br>messages and more.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${[
              ['View Results & Marksheets', 'fileText'],
              ['Download Study Materials', 'download'],
              ['Message Your Teachers', 'messageSquare'],
              ['Get Real-time Notifications', 'bell'],
            ].map(([label, ico]) => `
              <div style="display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.9);font-size:13px;">
                <span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(255,255,255,0.15);border-radius:8px;flex-shrink:0;">
                  ${icon(ico, 14, 'white')}
                </span>
                ${label}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-right">
        <div class="auth-form-container">
          <button onclick="navigate('home')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:28px;padding:0;">
            ${icon('arrowLeft', 14)} Back to Home
          </button>

          <h1 style="font-size:26px;font-weight:800;margin-bottom:6px;">Sign In</h1>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;">
            Enter your credentials to access your account
          </p>

          <!-- Role tabs -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:var(--bg-secondary);padding:5px;border-radius:10px;margin-bottom:22px;">
            ${[
              {label:'Student', role:'student', ico:'users'},
              {label:'Teacher', role:'teacher', ico:'graduationCap'},
              {label:'Staff',   role:'staff',   ico:'briefcase'},
            ].map((r,i) => `
              <button
                class="role-btn ${i===0?'active':''}"
                data-role="${r.role}"
                onclick="selectRole(this)"
                style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;font-size:11px;">
                ${icon(r.ico, 16)}
                ${r.label}
              </button>
            `).join('')}
          </div>

          <!-- Error msg -->
          <div id="loginError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;margin-bottom:16px;">
            ${icon('alertTriangle', 14, '#dc2626')} <span id="loginErrorText"></span>
          </div>

          <form id="loginForm" onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('mail', 13)} Email Address
              </label>
              <input type="email" id="loginEmail" class="form-input" placeholder="your@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('lock', 13)} Password
              </label>
              <div style="position:relative;">
                <input type="password" id="loginPassword" class="form-input" placeholder="Enter your password" required autocomplete="current-password" style="padding-right:44px;">
                <button type="button" onclick="togglePassword('loginPassword','eyeLoginBtn')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;" id="eyeLoginBtn">
                  ${icon('eye', 16)}
                </button>
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;">
              <button type="button" onclick="navigate('forgot-password')" style="font-size:13px;color:var(--primary);background:none;border:none;cursor:pointer;font-weight:500;">
                Forgot password?
              </button>
            </div>
            <button type="submit" class="btn btn-primary w-full btn-lg">
              ${icon('logIn', 16, 'white')} Sign In
            </button>
          </form>

          <p style="text-align:center;font-size:13px;color:var(--text-muted);margin-top:20px;">
            Don't have an account?
            <button onclick="navigate('register')" style="color:var(--primary);font-weight:700;background:none;border:none;cursor:pointer;">
              Create account
            </button>
          </p>

          <!-- Clear sessions (dev only) -->
          <div style="margin-top:16px;text-align:center;">
            <button onclick="clearAllSessions()" style="font-size:11px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">
              Having trouble signing in? Clear session data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

const ROLE_CONFIGS = {
  student: {
    label: 'Student', icon: 'users', 
    showToggle: true, // Enable mode toggle for students
    fields: [
      {section:'verification', inputs:[
        {type:'text', name:'studentId', label:'Student ID', required:false, placeholder:'e.g. STU-2026-0001'},
        {type:'text', name:'roll', label:'Roll Number', required:false, placeholder:'Your roll number'},
        {type:'date', name:'birthday', label:'Date of Birth', required:false, placeholder:'YYYY-MM-DD'},
      ]},
      {section:'academic', inputs:[
        {type:'select', name:'class', label:'Class', required:false, opts:['Select',...classes.map(c=>c.name)]},
        {type:'select', name:'section', label:'Section', required:false, opts:['Select','A','B','C','D']},
        {type:'select', name:'batch', label:'Batch', required:false, opts:['Select',...batches.map(b=>b.id+':'+b.name)]},
      ]},
      {section:'grid', inputs:[
        {type:'text', name:'guardian', label:'Guardian Name', required:false, placeholder:'Father / Mother name'},
        {type:'select', name:'bloodGroup', label:'Blood Group', required:false, opts:['Select','A+','A-','B+','B-','AB+','AB-','O+','O-']},
      ]},
    ]
  },
};

function renderRoleFields(roleKey) {
  const cfg = ROLE_CONFIGS[roleKey];
  if (!cfg) return '';
  
  // Add toggle buttons for students
  let html = '';
  if (cfg.showToggle) {
    html += `
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <button type="button" class="btn btn-primary" id="linkModeBtn" onclick="toggleRegistrationMode('link')" style="flex:1;">
          ${icon('link', 14, 'white')} Link Existing Account
        </button>
        <button type="button" class="btn btn-secondary" id="newModeBtn" onclick="toggleRegistrationMode('new')" style="flex:1;">
          ${icon('plus', 14)} Create New Profile
        </button>
      </div>
      <input type="hidden" id="registrationMode" value="link">
    `;
  }
  
  html += cfg.fields.map((f, idx) => {
    const inner = f.inputs.map(inp => {
      if (inp.type === 'select') {
        return `<div class="form-group"><label style="font-size:11px;">${inp.label}</label><select name="${inp.name}" class="form-input form-select" ${inp.required?'required':''} style="font-size:12px;">${inp.opts.map(o=>{
          const [val,lab] = o.includes(':') ? o.split(':') : [o,o];
          return `<option value="${val}">${lab}</option>`;
        }).join('')}</select></div>`;
      }
      return `<div class="form-group"><label style="font-size:11px;">${inp.label}</label><input type="${inp.type}" name="${inp.name}" class="form-input" placeholder="${inp.placeholder||''}" ${inp.required?'required':''} style="font-size:12px;"></div>`;
    }).join('');
    
    // Add data attribute for mode visibility
    const isLinkSection = f.section === 'verification';
    const isNewSection = f.section === 'academic' || f.section === 'grid';
    const modeAttr = isLinkSection ? 'data-mode="link"' : isNewSection ? 'data-mode="new" style="display:none;"' : '';
    
    if (f.section === 'verification') {
      return `<div ${modeAttr}><div style="padding:14px;background:var(--success-50);border-radius:12px;border:1.5px solid var(--success-100);margin-bottom:12px;"><div style="font-size:12px;font-weight:700;color:var(--success);margin-bottom:10px;display:flex;align-items:center;gap:6px;">${icon('checkCircle',13,'var(--success)')} Link to Existing Student Record</div><div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">Enter your Student ID and details to link your account:</div>${inner}</div></div>`;
    }
    if (f.section === 'grid') {
      return `<div ${modeAttr}><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${inner}</div></div>`;
    }
    if (f.section === 'academic') {
      return `<div ${modeAttr}><div style="padding:14px;background:var(--primary-50);border-radius:12px;border:1.5px solid var(--primary-100);"><div style="font-size:12px;font-weight:700;color:var(--primary);margin-bottom:10px;display:flex;align-items:center;gap:6px;">${icon('bookOpen',13,'var(--primary)')} Academic Placement</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">${inner}</div></div></div>`;
    }
    return inner;
  }).join('');
  
  return html;
}

export function renderRegister() {
  const roleTabs = Object.keys(ROLE_CONFIGS).map((k, i) => {
    const r = ROLE_CONFIGS[k];
    return `<button class="role-btn ${i===0?'active':''}" data-role="${k}" onclick="selectRegRole('${k}',this)" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;font-size:11px;">${icon(r.icon,16)}<span>${r.label}</span></button>`;
  }).join('');

  return `
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-shape auth-shape-1"></div>
      <div class="auth-shape auth-shape-2"></div>
    </div>
    <div class="auth-container" style="max-width:980px;">

      <div class="auth-left hide-mobile">
        <div class="auth-left-content">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
            <svg width="48" height="48" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="10" fill="white" opacity="0.15"/>
              <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.9"/>
              <circle cx="17" cy="19" r="4.5" fill="rgba(255,255,255,0.6)"/>
            </svg>
            <div>
              <div style="font-size:20px;font-weight:800;color:white;">Tiarkhali M.M High School</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.6);">Registration</div>
            </div>
          </div>
          <h2 style="font-size:28px;font-weight:800;color:white;margin-bottom:12px;">
            Create your<br>account
          </h2>
          <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.8;margin-bottom:28px;">
            Select your role and fill in the details. Your registration will be reviewed by the admissions office.
          </p>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${[{n:'1',t:'Choose your role',d:'Student'},{n:'2',t:'Fill in your details',d:'Role-specific information'},{n:'3',t:'Upload documents',d:'Birth certificate for verification'},{n:'4',t:'Admin approval',d:'Usually within 1-2 business days'}].map(s=>`
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">${s.n}</div>
                <div>
                  <div style="color:white;font-weight:600;font-size:13px;">${s.t}</div>
                  <div style="color:rgba(255,255,255,0.6);font-size:12px;">${s.d}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="auth-right" style="overflow-y:auto;max-height:100vh;">
        <div class="auth-form-container">
          <button onclick="navigate('login')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:24px;padding:0;">
            ${icon('arrowLeft', 14)} Back to Login
          </button>

          <h1 style="font-size:24px;font-weight:800;margin-bottom:4px;">Create Account</h1>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Choose your role and fill in your details</p>
          
          <!-- Info for teachers/staff -->
          <div style="background:var(--primary-50);border:1px solid var(--primary-100);border-radius:10px;padding:12px;margin-bottom:20px;">
            <div style="font-size:12px;color:var(--primary);display:flex;align-items:center;gap:8px;">
              ${icon('info', 14, 'var(--primary)')}
              <strong>Teachers & Staff:</strong> Your account must be created by the school administrator. Please contact the admin office.
            </div>
          </div>

          <div id="regError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px;font-size:13px;color:#dc2626;margin-bottom:16px;"></div>

          <!-- Role Tabs -->
          <div style="display:grid;grid-template-columns:1fr;gap:6px;background:var(--bg-secondary);padding:5px;border-radius:10px;margin-bottom:20px;" id="regRoleTabs">
            ${roleTabs}
          </div>

          <form id="registerForm" onsubmit="handleRegister(event)" style="display:flex;flex-direction:column;gap:14px;">
            <input type="hidden" name="role" id="regRoleInput" value="student">

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div class="form-group">
                <label class="form-label">${icon('user',12)} First Name *</label>
                <input type="text" name="firstName" class="form-input" placeholder="e.g. Tajul" required>
              </div>
              <div class="form-group">
                <label class="form-label">${icon('user',12)} Last Name *</label>
                <input type="text" name="lastName" class="form-input" placeholder="e.g. Islam" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${icon('mail',12)} Email Address *</label>
              <input type="email" name="email" id="regEmail" class="form-input" placeholder="tajul@email.com" required>
              <div id="emailError" style="display:none;color:#dc2626;font-size:12px;margin-top:4px;"></div>
            </div>

            <div class="form-group">
              <label class="form-label">${icon('phone',12)} Phone Number *</label>
              <input type="tel" name="phone" id="regPhone" class="form-input" placeholder="+880 17XX-XXXXXX" required>
              <div id="phoneError" style="display:none;color:#dc2626;font-size:12px;margin-top:4px;"></div>
            </div>

            <!-- Profile Picture Upload -->
            <div class="form-group">
              <label class="form-label">${icon('user',12)} Profile Picture (Optional)</label>
              <div style="display:flex;align-items:center;gap:16px;">
                <img id="profilePicPreview" src="https://i.imgur.com/x9wE0QT.png" alt="Preview" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--border);background:var(--bg-secondary);" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                <div style="flex:1;">
                  <div style="border:2px dashed var(--border);border-radius:12px;padding:16px;text-align:center;cursor:pointer;background:var(--bg-secondary);" onclick="document.getElementById('profilePicInput').click()">
                    <div style="margin-bottom:4px;display:flex;justify-content:center;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
                    <div style="font-size:13px;font-weight:600;color:var(--text-primary);">Upload your photo</div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">JPG, PNG (max 15MB)</div>
                  </div>
                  <input type="file" id="profilePicInput" accept="image/*" style="display:none;" onchange="profilePicChange(this)">
                </div>
              </div>
            </div>

            <!-- Role-specific fields container -->
            <div id="regRoleFields">${renderRoleFields('student')}</div>

            <!-- Birth certificate upload -->
            <div class="form-group">
              <label class="form-label">${icon('fileText',12)} Birth Certificate / Documents</label>
              <div style="border:2px dashed var(--border);border-radius:12px;padding:20px;text-align:center;cursor:pointer;background:var(--bg-secondary);" onclick="document.getElementById('bcUpload').click()">
                <div style="font-size:28px;margin-bottom:8px;">📄</div>
                <div style="font-size:13px;font-weight:600;">Upload verification document</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">PDF, JPG or PNG (max 5MB)</div>
                <input type="file" id="bcUpload" name="birthCertificate" accept=".pdf,.jpg,.jpeg,.png" style="display:none;" onchange="bcUploadChange(this)">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div class="form-group">
                <label class="form-label">${icon('lock',12)} Password *</label>
                <div style="position:relative;">
                  <input type="password" name="password" id="regPwd" class="form-input" placeholder="Min. 6 characters" required minlength="6" style="padding-right:44px;">
                  <button type="button" onclick="togglePassword('regPwd','eyeRegBtn')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;" id="eyeRegBtn">${icon('eye',16)}</button>
                </div>
                <div id="passwordError" style="display:none;color:#dc2626;font-size:12px;margin-top:4px;"></div>
              </div>
              <div class="form-group">
                <label class="form-label">${icon('lock',12)} Confirm Password *</label>
                <input type="password" name="confirmPassword" id="regConfirmPwd" class="form-input" placeholder="Repeat password" required>
                <div id="confirmPasswordError" style="display:none;color:#dc2626;font-size:12px;margin-top:4px;"></div>
              </div>
            </div>

            <label style="display:flex;align-items:flex-start;gap:10px;font-size:13px;cursor:pointer;margin-top:4px;">
              <input type="checkbox" required style="margin-top:2px;flex-shrink:0;">
              <span style="color:var(--text-secondary);">I agree to the <a href="#" style="color:var(--primary);">Terms of Service</a> and <a href="#" style="color:var(--primary);">Privacy Policy</a></span>
            </label>

            <button type="submit" class="btn btn-primary btn-lg w-full">
              ${icon('plus', 16, 'white')} Create My Account
            </button>
          </form>

          <p style="text-align:center;font-size:13px;color:var(--text-muted);margin-top:16px;">
            Already have an account?
            <button onclick="navigate('login')" style="color:var(--primary);font-weight:700;background:none;border:none;cursor:pointer;">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderResetPassword() {
  return `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);position:relative;overflow:hidden;">
    <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;">
      <div style="position:absolute;width:400px;height:400px;border-radius:50%;filter:blur(80px);opacity:0.3;background:linear-gradient(135deg,var(--primary),var(--secondary));top:-150px;left:-100px;"></div>
      <div style="position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(80px);opacity:0.2;background:var(--accent);bottom:-100px;right:-50px;"></div>
    </div>
    <div class="card" style="max-width:420px;width:calc(100% - 32px);position:relative;z-index:1;animation:slideUp 0.3s ease;">
      <div class="card-body" style="padding:40px;">
        <button onclick="navigate('login')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:24px;padding:0;">
          ${icon('arrowLeft', 14)} Back to login
        </button>

        <div style="width:60px;height:60px;background:var(--primary-50);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
          ${icon('lock', 28, 'var(--primary)')}
        </div>

        <h1 style="font-size:22px;font-weight:800;margin-bottom:8px;">Reset Password</h1>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;">
          Enter the 6-digit code sent to your email and choose a new password.
        </p>

        <div id="rpError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px;font-size:13px;color:#dc2626;margin-bottom:16px;">
          ${icon('alertCircle', 14, '#dc2626')} <span id="rpErrorText">Invalid code.</span>
        </div>

        <form id="rpForm" onsubmit="handleResetPassword(event)" style="display:flex;flex-direction:column;gap:16px;">
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:6px;">
              ${icon('key', 13)} Reset Code
            </label>
            <input type="text" id="rpCode" class="form-input" placeholder="000000" maxlength="6" required autocomplete="one-time-code" style="font-size:24px;letter-spacing:8px;text-align:center;font-weight:700;">
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:6px;">
              ${icon('lock', 13)} New Password
            </label>
            <div style="position:relative;">
              <input type="password" id="rpPassword" class="form-input" placeholder="••••••••" required minlength="6" autocomplete="new-password" style="padding-right:40px;">
              <button type="button" class="btn btn-ghost btn-icon" onclick="togglePassword('rpPassword','rpToggle')" id="rpToggle" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);">
                ${icon('eye', 16)}
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full">
            ${icon('checkCircle', 15, 'white')} Reset Password
          </button>
        </form>
      </div>
    </div>
  </div>`;
}

export function renderForgotPassword() {
  return `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);position:relative;overflow:hidden;">
    <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;">
      <div style="position:absolute;width:400px;height:400px;border-radius:50%;filter:blur(80px);opacity:0.3;background:linear-gradient(135deg,var(--primary),var(--secondary));top:-150px;left:-100px;"></div>
      <div style="position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(80px);opacity:0.2;background:var(--accent);bottom:-100px;right:-50px;"></div>
    </div>
    <div class="card" style="max-width:420px;width:calc(100% - 32px);position:relative;z-index:1;animation:slideUp 0.3s ease;">
      <div class="card-body" style="padding:40px;">
        <button onclick="navigate('login')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:24px;padding:0;">
          ${icon('arrowLeft', 14)} Back to login
        </button>

        <div style="width:60px;height:60px;background:var(--primary-50);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
          ${icon('lock', 28, 'var(--primary)')}
        </div>

        <h1 style="font-size:22px;font-weight:800;margin-bottom:8px;">Forgot Password?</h1>
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;">
          Enter your registered email and we'll send you a password reset link.
        </p>

        <div id="fpSuccess" style="display:none;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;font-size:13px;color:#15803d;margin-bottom:16px;">
          ${icon('checkCircle', 14, '#15803d')} Reset link sent! Check your email inbox.
        </div>

        <form id="fpForm" onsubmit="handleForgotPassword(event)" style="display:flex;flex-direction:column;gap:16px;">
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:6px;">
              ${icon('mail', 13)} Email Address
            </label>
            <input type="email" id="fpEmail" class="form-input" placeholder="your@email.com" required autocomplete="email">
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full">
            ${icon('send', 15, 'white')} Send Reset Link
          </button>
        </form>
      </div>
    </div>
  </div>`;
}
