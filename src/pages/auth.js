// ================================================
// AUTH PAGES — Login / Register / Forgot Password
// Uses real localStorage auth store
// ================================================
import { classes, batches } from '../data/sampleData.js';
import { icon } from '../utils/icons.js';

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
            Sign in to access your dashboard, results,<br>attendance, messages and more.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${[
              ['View Results & Marksheets', 'fileText'],
              ['Track Daily Attendance', 'checkCircle'],
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
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;background:var(--bg-secondary);padding:5px;border-radius:10px;margin-bottom:22px;">
            ${[
              {label:'Student', role:'student', ico:'users'},
              {label:'Teacher', role:'teacher', ico:'graduationCap'},
              {label:'Admin',   role:'admin',   ico:'settings'},
              {label:'Alumni',  role:'alumni',  ico:'globe'},
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

          <!-- Google -->
          <button class="google-btn" onclick="handleGoogleLogin()" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div class="auth-divider"><span>or sign in with email</span></div>

          <!-- Error msg -->
          <div id="loginError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;margin-bottom:16px;">
            ${icon('alertTriangle', 14, '#dc2626')} <span id="loginErrorText"></span>
          </div>

          <form id="loginForm" onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('mail', 13)} Email Address
              </label>
              <input type="email" id="loginEmail" class="form-input" placeholder="your@email.com" value="demo@greenfield.edu" required autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('lock', 13)} Password
              </label>
              <div style="position:relative;">
                <input type="password" id="loginPassword" class="form-input" placeholder="Enter your password" value="demo123" required autocomplete="current-password" style="padding-right:44px;">
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

          <!-- Admin credentials hint -->
          <div style="margin-top:20px;padding:14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:12px;font-size:12px;color:var(--text-muted);">
            <div style="font-weight:700;margin-bottom:6px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;">
              ${icon('info', 13)} Admin access
            </div>
            <div>Email: <code style="background:var(--bg-tertiary);padding:1px 5px;border-radius:4px;">admin@tiarkhali-mmhs.edu.bd</code></div>
            <div style="margin-top:4px;">Password: <code style="background:var(--bg-tertiary);padding:1px 5px;border-radius:4px;">admin123</code></div>
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">
              <button onclick="clearAllSessions()" style="font-size:11px;color:var(--danger);background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px;">
                ${icon('logOut', 12, 'var(--danger)')} Clear all sessions &amp; start fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

const ROLE_CONFIGS = {
  student: {
    label: 'Student', icon: 'users', fields: [
      {section:'academic', inputs:[
        {type:'select', name:'class', label:'Class', required:true, opts:['Select',...classes.map(c=>c.name)]},
        {type:'select', name:'section', label:'Section', required:true, opts:['Select','A','B','C','D']},
        {type:'select', name:'batch', label:'Batch', required:true, opts:['Select',...batches.map(b=>b.id+':'+b.name)]},
      ]},
      {section:'grid', inputs:[
        {type:'text', name:'guardian', label:'Guardian Name *', required:true, placeholder:'Father / Mother name'},
        {type:'select', name:'bloodGroup', label:'Blood Group', required:false, opts:['Select','A+','A-','B+','B-','AB+','AB-','O+','O-']},
      ]},
    ]
  },
  teacher: {
    label: 'Teacher', icon: 'graduationCap', fields: [
      {section:'grid', inputs:[
        {type:'text', name:'subject', label:'Subject *', required:true, placeholder:'e.g. Mathematics'},
        {type:'text', name:'qualification', label:'Qualification *', required:true, placeholder:'e.g. MSc, DU'},
      ]},
      {section:'grid', inputs:[
        {type:'number', name:'experience', label:'Experience (years) *', required:true, placeholder:'e.g. 5'},
      ]},
    ]
  },
  alumni: {
    label: 'Alumni', icon: 'globe', fields: [
      {section:'grid', inputs:[
        {type:'number', name:'graduationYear', label:'Graduation Year *', required:true, placeholder:'e.g. 2024'},
        {type:'text', name:'university', label:'University *', required:true, placeholder:'e.g. DU'},
      ]},
      {section:'grid', inputs:[
        {type:'text', name:'profession', label:'Profession *', required:true, placeholder:'e.g. Engineer'},
        {type:'text', name:'company', label:'Company', required:false, placeholder:'e.g. Google'},
      ]},
    ]
  },
  staff: {
    label: 'Support Staff', icon: 'briefcase', fields: [
      {section:'grid', inputs:[
        {type:'select', name:'position', label:'Position *', required:true, opts:['Select','Office Assistant','Librarian','Security Guard','Peon','Cleaner','Lab Assistant','IT Support']},
        {type:'select', name:'department', label:'Department *', required:true, opts:['Select','Administration','Library','Security','General','Maintenance','Science Lab','ICT']},
      ]},
    ]
  },
};

function renderRoleFields(roleKey) {
  const cfg = ROLE_CONFIGS[roleKey];
  if (!cfg) return '';
  return cfg.fields.map(f => {
    const inner = f.inputs.map(inp => {
      if (inp.type === 'select') {
        return `<div class="form-group"><label style="font-size:11px;">${inp.label}</label><select name="${inp.name}" class="form-input form-select" ${inp.required?'required':''} style="font-size:12px;">${inp.opts.map(o=>{
          const [val,lab] = o.includes(':') ? o.split(':') : [o,o];
          return `<option value="${val}">${lab}</option>`;
        }).join('')}</select></div>`;
      }
      return `<div class="form-group"><label style="font-size:11px;">${inp.label}</label><input type="${inp.type}" name="${inp.name}" class="form-input" placeholder="${inp.placeholder||''}" ${inp.required?'required':''} style="font-size:12px;"></div>`;
    }).join('');
    if (f.section === 'grid') return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${inner}</div>`;
    if (f.section === 'academic') return `<div style="padding:14px;background:var(--primary-50);border-radius:12px;border:1.5px solid var(--primary-100);"><div style="font-size:12px;font-weight:700;color:var(--primary);margin-bottom:10px;display:flex;align-items:center;gap:6px;">${icon('bookOpen',13,'var(--primary)')} Academic Placement</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">${inner}</div></div>`;
    return inner;
  }).join('');
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
            ${[{n:'1',t:'Choose your role',d:'Student, Teacher, Alumni, or Staff'},{n:'2',t:'Fill in your details',d:'Role-specific information'},{n:'3',t:'Upload documents',d:'Birth certificate for verification'},{n:'4',t:'Admin approval',d:'Usually within 1-2 business days'}].map(s=>`
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
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;">Choose your role and fill in your details</p>

          <div id="regError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px;font-size:13px;color:#dc2626;margin-bottom:16px;"></div>

          <!-- Role Tabs -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;background:var(--bg-secondary);padding:5px;border-radius:10px;margin-bottom:20px;" id="regRoleTabs">
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
              <input type="email" name="email" class="form-input" placeholder="tajul@email.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">${icon('phone',12)} Phone Number *</label>
              <input type="tel" name="phone" class="form-input" placeholder="+880 17XX-XXXXXX" required>
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
              </div>
              <div class="form-group">
                <label class="form-label">${icon('lock',12)} Confirm Password *</label>
                <input type="password" name="confirmPassword" class="form-input" placeholder="Repeat password" required>
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
