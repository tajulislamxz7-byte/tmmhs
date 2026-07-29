// ================================================
// NAVBAR — Clean SVG icons, auth-aware
// ================================================
import { icon } from '../utils/icons.js';

export function renderNavbar(activePage = 'home', isLoggedIn = false, role = 'guest', user = null) {
  const active = (page) => activePage === page ? 'active' : '';

  return `
  <nav class="navbar" id="navbar">
    <div class="container navbar-inner">

      <!-- Logo -->
      <a class="navbar-logo" onclick="navigate('home')" style="cursor:pointer;text-decoration:none;">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <rect width="34" height="34" rx="10" fill="#2563eb"/>
          <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.92"/>
          <circle cx="17" cy="19" r="4.5" fill="#93c5fd"/>
        </svg>
        <div>
          <div class="logo-name">Tiarkhali M.M</div>
          <div class="logo-tagline">High School & College</div>
        </div>
      </a>

      <!-- Desktop Links -->
      <div class="navbar-links" id="navLinks">
        <span class="nav-link ${active('home')}" onclick="navigate('home')" style="cursor:pointer;">Home</span>
        <span class="nav-link ${active('about')}" onclick="navigate('about')" style="cursor:pointer;">About</span>

        <div class="nav-dropdown">
          <button class="nav-link nav-dropdown-btn">
            People ${icon('chevronDown', 13)}
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-item" onclick="navigate('students')" style="cursor:pointer;">
              ${icon('users', 15)} <span>Students</span>
            </div>
            <div class="dropdown-item" onclick="navigate('teachers')" style="cursor:pointer;">
              ${icon('graduationCap', 15)} <span>Teachers</span>
            </div>
            <div class="dropdown-item" onclick="navigate('staff')" style="cursor:pointer;">
              ${icon('briefcase', 15)} <span>Support Staff</span>
            </div>
            <div class="dropdown-item" onclick="navigate('alumni')" style="cursor:pointer;">
              ${icon('globe', 15)} <span>Alumni</span>
            </div>
          </div>
        </div>

        <div class="nav-dropdown">
          <button class="nav-link nav-dropdown-btn">
            Academic ${icon('chevronDown', 13)}
          </button>
          <div class="dropdown-menu">
            <div class="dropdown-item" onclick="navigate('batches')" style="cursor:pointer;">
              ${icon('bookOpen', 15)} <span>Batches</span>
            </div>
            <div class="dropdown-item" onclick="navigate('results')" style="cursor:pointer;">
              ${icon('fileText', 15)} <span>Results</span>
            </div>
            <div class="dropdown-item" onclick="navigate('attendance')" style="cursor:pointer;">
              ${icon('checkCircle', 15)} <span>Attendance</span>
            </div>
            <div class="dropdown-item" onclick="navigate('assignments')" style="cursor:pointer;">
              ${icon('clipboardList', 15)} <span>Assignments</span>
            </div>
          </div>
        </div>

        <span class="nav-link ${active('notices')}" onclick="navigate('notices')" style="cursor:pointer;">Notices</span>
        <span class="nav-link ${active('events')}" onclick="navigate('events')" style="cursor:pointer;">Events</span>
        <span class="nav-link ${active('gallery')}" onclick="navigate('gallery')" style="cursor:pointer;">Gallery</span>
      </div>

      <!-- Right actions -->
      <div class="navbar-actions">

        <!-- Search -->
        <button class="btn btn-ghost btn-icon" onclick="openSearch()" title="Search  Ctrl+K" style="position:relative;">
          ${icon('search', 18)}
          <span style="position:absolute;bottom:-2px;right:-2px;background:var(--primary);color:white;font-size:9px;font-weight:700;padding:1px 4px;border-radius:4px;line-height:1.4;">K</span>
        </button>

        <!-- Theme toggle -->
        <button class="btn btn-ghost btn-icon" onclick="toggleTheme()" title="Toggle theme" id="themeBtn">
          <span id="iconSun">${icon('sun', 18)}</span>
          <span id="iconMoon" class="hidden">${icon('moon', 18)}</span>
        </button>

        ${isLoggedIn ? `
        <!-- Notifications -->
        <button class="btn btn-ghost btn-icon" onclick="navigate('notifications')" title="Notifications" style="position:relative;">
          ${icon('bell', 18)}
          <span style="position:absolute;top:6px;right:6px;width:8px;height:8px;background:#ef4444;border-radius:50%;border:2px solid var(--bg-primary);"></span>
        </button>

        <!-- User menu -->
        <div id="userMenuWrapper" style="position:relative;">
          <button class="user-avatar-btn" onclick="toggleUserDropdown()">
            <img src="${user.avatar}" alt="${user.name}" class="avatar avatar-sm" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
            <span class="hide-mobile" style="font-size:13px;font-weight:600;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.name}</span>
            ${icon('chevronDown', 13)}
          </button>
          <div class="user-dropdown hidden" id="userDropdown">
            <div class="user-dropdown-header">
              <img src="${user.avatar}" alt="${user.name}" class="avatar avatar-md" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
              <div>
                <div style="font-weight:700;font-size:14px;">${user.name}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${user.email}</div>
                <div style="font-size:11px;color:var(--primary);margin-top:2px;font-weight:600;text-transform:capitalize;">${user.role}</div>
              </div>
            </div>
            <div class="divider"></div>
            ${role === 'student' ? `
            <div class="dropdown-item" onclick="navigate('student-dashboard')" style="cursor:pointer;">${icon('layout', 14)} <span>Dashboard</span></div>
            <div class="dropdown-item" onclick="navigate('student-profile','${user.id}')" style="cursor:pointer;">${icon('user', 14)} <span>My Profile</span></div>
            <div class="dropdown-item" onclick="navigate('results')" style="cursor:pointer;">${icon('fileText', 14)} <span>My Results</span></div>
            ` : role === 'teacher' ? `
            <div class="dropdown-item" onclick="navigate('teacher-dashboard')" style="cursor:pointer;">${icon('layout', 14)} <span>Dashboard</span></div>
            <div class="dropdown-item" onclick="navigate('teacher-profile','${user.id}')" style="cursor:pointer;">${icon('user', 14)} <span>My Profile</span></div>
            ` : ''}
            <div class="dropdown-item" onclick="navigate('messages')" style="cursor:pointer;">${icon('messageSquare', 14)} <span>Messages</span></div>
            <div class="dropdown-item" onclick="navigate('assignments')" style="cursor:pointer;">${icon('clipboardList', 14)} <span>Assignments</span></div>
            ${role === 'admin' ? `<div class="dropdown-item" onclick="navigate('admin')" style="cursor:pointer;">${icon('settings', 14)} <span>Admin Panel</span></div>` : ''}
            <div class="divider"></div>
            <div class="dropdown-item" onclick="signOut()" style="cursor:pointer;color:var(--danger);">${icon('logOut', 14)} <span>Sign Out</span></div>
          </div>
        </div>

        ` : `
        <!-- Guest auth buttons -->
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn btn-secondary btn-sm" onclick="navigate('login')">
            ${icon('logIn', 14)} Sign In
          </button>
          <button class="btn btn-primary btn-sm hide-mobile" onclick="navigate('register')">
            ${icon('plus', 14)} Register
          </button>
        </div>
        `}

        <!-- Hamburger -->
        <button class="btn btn-ghost btn-icon hamburger" onclick="toggleMobileMenu()" id="hamburgerBtn">
          ${icon('menu', 22)}
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu hidden" id="mobileMenu">
      <div class="mobile-menu-inner">
        ${isLoggedIn && user ? `
        <div style="display:flex;align-items:center;gap:12px;padding:16px;background:var(--primary-50);border-radius:12px;margin-bottom:8px;">
          <img src="${user.avatar}" class="avatar avatar-md">
          <div>
            <div style="font-weight:700;">${user.name}</div>
            <div style="font-size:12px;color:var(--text-muted);">${user.email}</div>
          </div>
        </div>` : ''}

        <div class="mobile-nav-link" onclick="navigate('home');toggleMobileMenu()">${icon('home',16)} Home</div>
        <div class="mobile-nav-link" onclick="navigate('about');toggleMobileMenu()">${icon('info',16)} About</div>
        <div class="mobile-nav-link" onclick="navigate('students');toggleMobileMenu()">${icon('users',16)} Students</div>
        <div class="mobile-nav-link" onclick="navigate('teachers');toggleMobileMenu()">${icon('graduationCap',16)} Teachers</div>
        <div class="mobile-nav-link" onclick="navigate('staff');toggleMobileMenu()">${icon('briefcase',16)} Support Staff</div>
        <div class="mobile-nav-link" onclick="navigate('alumni');toggleMobileMenu()">${icon('globe',16)} Alumni</div>
        <div class="mobile-nav-link" onclick="navigate('batches');toggleMobileMenu()">${icon('bookOpen',16)} Batches</div>
        <div class="mobile-nav-link" onclick="navigate('results');toggleMobileMenu()">${icon('fileText',16)} Results</div>
        <div class="mobile-nav-link" onclick="navigate('attendance');toggleMobileMenu()">${icon('checkCircle',16)} Attendance</div>
        <div class="mobile-nav-link" onclick="navigate('notices');toggleMobileMenu()">${icon('bell',16)} Notices</div>
        <div class="mobile-nav-link" onclick="navigate('events');toggleMobileMenu()">${icon('calendar',16)} Events</div>
        <div class="mobile-nav-link" onclick="navigate('gallery');toggleMobileMenu()">${icon('image',16)} Gallery</div>
        <div class="mobile-nav-link" onclick="navigate('admission');toggleMobileMenu()">${icon('clipboardList',16)} Admission</div>

        ${isLoggedIn ? `
        <div class="mobile-nav-link" onclick="navigate('messages');toggleMobileMenu()">${icon('messageSquare',16)} Messages</div>
        ${role==='student'?`<div class="mobile-nav-link" onclick="navigate('student-dashboard');toggleMobileMenu()">${icon('layout',16)} Dashboard</div>`:''}
        ${role==='teacher'?`<div class="mobile-nav-link" onclick="navigate('teacher-dashboard');toggleMobileMenu()">${icon('layout',16)} Dashboard</div>`:''}
        ${role==='admin'?`<div class="mobile-nav-link" onclick="navigate('admin');toggleMobileMenu()">${icon('settings',16)} Admin Panel</div>`:''}
        <div style="padding:12px 0 0;">
          <button class="btn btn-danger w-full" onclick="signOut()">${icon('logOut',14)} Sign Out</button>
        </div>
        ` : `
        <div style="display:flex;gap:10px;padding:12px 0 0;border-top:1px solid var(--border);margin-top:8px;">
          <button class="btn btn-secondary w-full" onclick="navigate('login');toggleMobileMenu()">${icon('logIn',14)} Sign In</button>
          <button class="btn btn-primary w-full" onclick="navigate('register');toggleMobileMenu()">${icon('plus',14)} Register</button>
        </div>
        `}
      </div>
    </div>
  </nav>`;
}
