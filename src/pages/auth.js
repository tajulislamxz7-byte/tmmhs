// ================================================
// AUTH PAGES — Login / Forgot Password
// Phone-based authentication — accounts created by admin only
// ================================================
import { classes, batches } from '../data/schoolConfig.js';
import { icon } from '../utils/icons.js';

// ── Principal Login ───────────────────────────────
export function renderPrincipalLogin() {
  return `
  <div class="auth-page">
    <div class="auth-bg" style="background:linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);">
      <div class="auth-shape auth-shape-1"></div>
      <div class="auth-shape auth-shape-2"></div>
    </div>
    <div class="auth-container">
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
      <div class="auth-right">
        <div class="auth-form-container">
          <button onclick="navigate('home')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:28px;padding:0;">
            ${icon('arrowLeft', 14)} Back to Home
          </button>
          <div style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#fbbf24,#f59e0b);padding:6px 14px;border-radius:20px;margin-bottom:16px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <span style="color:white;font-size:11px;font-weight:700;letter-spacing:0.5px;">PRINCIPAL ACCESS</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;margin-bottom:6px;">Principal Sign In</h1>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:24px;">Enter your credentials to access the principal dashboard</p>
          <div style="background:var(--warning-50);border:1px solid var(--warning);border-radius:10px;padding:12px 14px;font-size:12px;color:var(--text-primary);margin-bottom:20px;display:flex;gap:8px;">
            ${icon('shield', 14, 'var(--warning)')}
            <div><strong>Secure Login</strong><div style="margin-top:2px;color:var(--text-muted);">Only authorized principal accounts can access this portal.</div></div>
          </div>
          <div id="principalLoginError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;margin-bottom:16px;">
            ${icon('alertTriangle', 14, '#dc2626')} <span id="principalLoginErrorText"></span>
          </div>
          <form id="principalLoginForm" onsubmit="handlePrincipalLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">${icon('mail', 13)} Email Address</label>
              <input type="email" id="principalLoginEmail" class="form-input" placeholder="principal@school.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">${icon('lock', 13)} Password</label>
              <div style="position:relative;">
                <input type="password" id="principalLoginPassword" class="form-input" placeholder="Enter your password" required autocomplete="current-password" style="padding-right:44px;">
                <button type="button" onclick="togglePassword('principalLoginPassword','eyePrincipalBtn')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;" id="eyePrincipalBtn">
                  ${icon('eye', 16)}
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-lg w-full" style="background:linear-gradient(135deg,#1e40af,#7c3aed);border:none;">
              ${icon('logIn', 16, 'white')} Sign In as Principal
            </button>
          </form>
          <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:20px;">Need access? Contact the school administrator</p>
          <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:12px;">
            <button onclick="navigate('login')" style="color:var(--primary);font-weight:600;background:none;border:none;cursor:pointer;">Sign in as Student/Teacher →</button>
          </p>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Main Login (Phone-based) ──────────────────────
export function renderLogin() {
  return `
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-shape auth-shape-1"></div>
      <div class="auth-shape auth-shape-2"></div>
    </div>
    <div class="auth-container">
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
            Your account was created by the school admin.<br>Login with your phone number and temporary password.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${[
              ['View Results & Marksheets', 'fileText'],
              ['Message Your Teachers', 'messageSquare'],
              ['Get Real-time Notifications', 'bell'],
              ['Access Your Dashboard', 'layout'],
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

      <div class="auth-right">
        <div class="auth-form-container">
          <button onclick="navigate('home')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:28px;padding:0;">
            ${icon('arrowLeft', 14)} Back to Home
          </button>

          <h1 style="font-size:26px;font-weight:800;margin-bottom:6px;">Login</h1>
          <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px;">
            Use your phone number and temporary password sent via SMS by the school admin.
          </p>

          <!-- Phone / Email toggle -->
          <div style="display:flex;gap:4px;background:var(--bg-secondary);padding:4px;border-radius:10px;margin-bottom:16px;">
            <button id="tabPhone" onclick="switchLoginMethod('phone')"
              style="flex:1;padding:9px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:var(--primary);color:white;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;">
              ${icon('phone', 14, 'white')} Phone
            </button>
            <button id="tabEmail" onclick="switchLoginMethod('email')"
              style="flex:1;padding:9px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:var(--text-muted);transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;">
              ${icon('mail', 14)} Email
            </button>
          </div>
          <div id="emailLoginNote" style="display:none;background:var(--bg-secondary);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--text-muted);margin-bottom:12px;display:flex;align-items:center;gap:6px;">
            ${icon('info', 12)} Email login is available only after you add an email from your profile settings.
          </div>

          <!-- Error -->
          <div id="loginError" style="display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;margin-bottom:16px;align-items:center;gap:8px;">
            ${icon('alertTriangle', 14, '#dc2626')} <span id="loginErrorText"></span>
          </div>

          <form id="loginForm" onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
            <!-- Phone field (default visible) -->
            <div id="phoneLoginField" class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('phone', 13)} Phone Number
              </label>
              <input type="tel" id="loginPhone" class="form-input"
                placeholder="01XXXXXXXXX" autocomplete="tel" inputmode="numeric">
            </div>
            <!-- Email field (hidden until user switches) -->
            <div id="emailLoginField" class="form-group" style="display:none;">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('mail', 13)} Email Address
              </label>
              <input type="email" id="loginEmail" class="form-input"
                placeholder="your@email.com" autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:6px;">
                ${icon('lock', 13)} Password
              </label>
              <div style="position:relative;">
                <input type="password" id="loginPassword" class="form-input"
                  placeholder="Enter your password" required autocomplete="current-password" style="padding-right:44px;">
                <button type="button" onclick="togglePassword('loginPassword','eyeLoginBtn')"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;" id="eyeLoginBtn">
                  ${icon('eye', 16)}
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-primary w-full btn-lg">
              ${icon('logIn', 16, 'white')} Login
            </button>
          </form>

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

// ── Register (kept for admin-created accounts flow) ──
export function renderRegister() {
  return `
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-shape auth-shape-1"></div>
      <div class="auth-shape auth-shape-2"></div>
    </div>
    <div class="auth-container">
      <div class="auth-right" style="width:100%;max-width:520px;margin:0 auto;">
        <div class="auth-form-container">
          <button onclick="navigate('login')" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;background:none;border:none;cursor:pointer;margin-bottom:24px;padding:0;">
            ${icon('arrowLeft', 14)} Back to Login
          </button>
          <div style="background:var(--primary-50);border:1px solid var(--primary-100);border-radius:12px;padding:20px;text-align:center;">
            <div style="width:52px;height:52px;background:var(--primary);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
              ${icon('users', 24, 'white')}
            </div>
            <h2 style="font-size:18px;font-weight:800;margin-bottom:8px;">Accounts are created by Admin</h2>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:16px;">
              All student, teacher, and staff accounts are created by the school administrator.<br>
              You will receive your login credentials (phone + password) via SMS.
            </p>
            <button class="btn btn-primary" onclick="navigate('login')">
              ${icon('logIn', 14, 'white')} Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Reset Password ────────────────────────────────
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
            <label class="form-label" style="display:flex;align-items:center;gap:6px;">${icon('key', 13)} Reset Code</label>
            <input type="text" id="rpCode" class="form-input" placeholder="000000" maxlength="6" required autocomplete="one-time-code" style="font-size:24px;letter-spacing:8px;text-align:center;font-weight:700;">
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:6px;">${icon('lock', 13)} New Password</label>
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

// ── Forgot Password ───────────────────────────────
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
            <label class="form-label" style="display:flex;align-items:center;gap:6px;">${icon('mail', 13)} Email Address</label>
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
