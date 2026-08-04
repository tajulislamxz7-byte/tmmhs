// ================================================
// ADMIN DASHBOARD
// ================================================

import { students, teachers, supportStaff, batches, notices, events, results } from '../data/schoolConfig.js';
import * as auth from '../utils/auth.js';
import { api } from '../utils/api.js';
import { handleProfilePictureUpload, getDefaultAvatar } from '../utils/imageHandler.js';

const SVG = (paths, size=18, color='currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const ICONS = {
  dashboard: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
  students:  `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  teachers:  `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
  staff:     `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  batches:   `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
  results:   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  gallery:   `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,
  notices:   `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  events:    `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  messages:  `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  info:      `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,
  admissions:`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,
  roles:     `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  settings:  `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  home:      `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  users2:    `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>`,
  image:     `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,
  api:       `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
};

// Notification Helper
async function createNotification(type, title, message, link = null) {
  await api.addNotification({
    type,  // 'notice', 'result', 'event'
    title,
    message,
    link,
  });
}

const ADMIN_NAV = [
  {key:'dashboard',   label:'Dashboard',    icon:'dashboard'},
  {key:'students',    label:'Students',     icon:'students'},
  {key:'teachers',    label:'Teachers',     icon:'teachers'},
  {key:'staff',       label:'Staff',        icon:'staff'},
  {key:'batches',     label:'Batches',      icon:'batches'},
  {key:'results',     label:'Results',      icon:'results'},
  {key:'notices',     label:'Notices',      icon:'notices'},
  {key:'events',      label:'Events',       icon:'events'},
  {key:'gallery',     label:'Gallery',      icon:'image'},
  {key:'messages',    label:'Messages',     icon:'messages'},
  {key:'aboutpage',   label:'About Page',   icon:'info'},
  {key:'principal',   label:'Principal',    icon:'users2'},
  {key:'roles',       label:'Users',        icon:'roles'},
  {key:'settings',    label:'Settings',     icon:'settings'},
  {key:'api',         label:'API Keys',     icon:'api'},
];

let adminTab = 'dashboard';

// Admin data cache (populated async before rendering) 
const _cache = {
  users: [],
  notices: [],
  events: [],
  batches: [],
  exams: [],
  results: [],
  settings: {},
  gallery: [],
};

async function _loadCache() {
  const [users, notices, events, batches, exams, results, settings, notifications, gallery, conversations] = await Promise.all([
    api.getUsers(),
    api.getNotices(),
    api.getEvents(),
    api.getBatches(),
    api.getExams(),
    api.getResults(),
    api.getSettings(),
    api.getNotifications(),
    api.getGallery(),
    api.getConversations(),
  ]);
  _cache.users          = users          || [];
  _cache.allUsers       = users          || [];
  _cache.notices        = notices        || [];
  _cache.events         = events         || [];
  _cache.batches        = batches        || [];
  _cache.exams          = exams          || [];
  _cache.results        = results        || [];
  _cache.settings       = settings       || {};
  _cache.notifications  = notifications  || [];
  _cache.gallery        = gallery        || [];
  _cache.conversations  = conversations  || [];
}

export async function renderAdminDashboard() {
  // Reset to dashboard on initial load
  adminTab = 'dashboard';
  await _loadCache();

  const user = auth.getCurrentUser();
  const pendingCount = _cache.users.filter(u => u.status !== 'active' && u.role !== 'admin').length;

  return `
    <div style="min-height:100vh;display:flex;flex-direction:column;">
      <!-- Admin Top Bar -->
      <div style="background:#0f172a;color:white;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);position:sticky;top:0;z-index:50;">
        <div style="display:flex;align-items:center;gap:12px;">
          <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="8" fill="#2563eb"/>
            <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.9"/>
            <circle cx="17" cy="19" r="4.5" fill="#93c5fd"/>
          </svg>
          <span style="font-weight:800;font-size:15px;">Admin Panel</span>
          <span class="badge badge-danger" style="font-size:10px;">Super Admin</span>
          ${pendingCount > 0 ? `<span class="badge badge-warning" style="font-size:10px;">${pendingCount} pending approvals</span>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.8);padding:6px 14px;border-radius:8px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px;" onclick="navigate('home')">
            ${SVG(ICONS.home, 14, 'rgba(255,255,255,0.8)')} Exit to Site
          </button>
          <img src="${user?.avatar || 'https://i.imgur.com/x9wE0QT.png'}"
               alt="${user?.name || 'Admin'}" class="avatar avatar-sm"
               onerror="this.src='https://i.imgur.com/x9wE0QT.png'"
               style="border:2px solid rgba(255,255,255,0.2);">
          <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);">${user?.name || 'Admin'}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:220px 1fr;flex:1;min-height:calc(100vh - 56px);max-height:calc(100vh - 56px);overflow:hidden;">
        <!-- Admin Sidebar -->
        <div style="background:#1e293b;padding:20px 12px;overflow-y:auto;position:sticky;top:56px;height:calc(100vh - 56px);">
          ${ADMIN_NAV.map(item=>`
            <div class="${item.key===adminTab?'admin-nav-item active':'admin-nav-item'}" onclick="switchAdminTab('${item.key}',this)" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;margin-bottom:6px;color:${item.key===adminTab?'white':'rgba(255,255,255,0.65)'};">
              <span style="display:flex;align-items:center;flex-shrink:0;">${SVG(ICONS[item.icon]||ICONS.dashboard, 18, item.key===adminTab?'white':'rgba(255,255,255,0.65)')}</span>
              ${item.label}
            </div>
          `).join('')}
        </div>

        <!-- Admin Content -->
        <div style="padding:40px 28px 28px 28px;background:var(--bg-secondary);overflow-y:auto;height:calc(100vh - 56px);" id="adminContent">
          ${renderAdminTab('dashboard')}
        </div>
      </div>
    </div>
  `;
}

function renderAdminTab(tab) {
  switch(tab) {
    case 'dashboard':    return renderAdminMain();
    case 'students':     return renderAdminStudents();
    case 'teachers':     return renderAdminTeachers();
    case 'staff':        return renderAdminStaff();
    case 'batches':      return renderAdminBatches();
    case 'notices':      return renderAdminNoticesManager();
    case 'events':       return renderAdminEventsManager();
    case 'gallery':      return renderAdminGallery();
    case 'results':      return renderAdminResults();
    case 'messages':     return renderAdminMessages();
    case 'aboutpage':    return renderAdminAboutPage();
    case 'principal':    return renderAdminPrincipal();
    case 'settings':     return renderAdminSettings();
    case 'api':          return renderAdminApiSettings();
    case 'roles':        return renderAdminUsers();
    default:             return renderAdminMain();
  }
}

async function _refreshTab(tab) {
  await _loadCache();
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab(tab || adminTab);
  
  // Update sidebar active state to match current tab
  document.querySelectorAll('.admin-nav-item').forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${tab || adminTab}'`)) {
      el.classList.add('active');
    }
  });
}

function renderAdminMain() {
  const allUsers = _cache.users;
  // Case-insensitive role filtering for Google Sign-In compatibility
  const studentCount = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'student' && u.status === 'active').length;
  const unlinkedCount = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'student' && u.status === 'unlinked').length;
  const teacherCount = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'teacher' && u.status === 'active').length;
  const pendingCount = allUsers.filter(u => u.status !== 'active' && u.status !== 'unlinked' && u.role !== 'admin').length;
  const S = _cache.settings;
  const noticesCount = _cache.notices.length;
  const eventsCount  = _cache.events.length;
  const notificationCount = _cache.notifications.length;
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});


  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 style="font-size:24px;font-weight:800;">Dashboard Overview</h1>
          <div class="text-muted text-sm">${today}    ${S.year||'Academic Year 2025"26'}</div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Report generation coming soon','info')">
          ${SVG('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',14,'white')} Export Report
        </button>
      </div>

      <!-- KPI Grid " live data -->
      <div class="kpi-grid mb-6">
        ${[
          {svg:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`, l:'Active Students',  v:studentCount,         c:'#2563eb', t:unlinkedCount>0?`${unlinkedCount} not linked yet`:(pendingCount>0?`${pendingCount} pending approval`:'All approved'), up:true},
          {svg:`<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,                                                                                l:'Active Teachers',  v:teacherCount,         c:'#7c3aed', t:'Verified accounts',  up:true},
          {svg:`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,                                                              l:'Published Notices',v:noticesCount,          c:'#d97706', t:'On notice board',      up:true},
          {svg:`<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,l:'Events',          v:eventsCount,          c:'#059669', t:'Scheduled',           up:true},
        ].map(s=>`
          <div class="kpi-card">
            <div class="kpi-icon" style="background:${s.c}15;display:flex;align-items:center;justify-content:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${s.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.svg}</svg>
            </div>
            <div class="kpi-value" style="color:${s.c};">${s.v}</div>
            <div class="kpi-label">${s.l}</div>
            <div class="kpi-trend ${s.up?'up':'down'}">${s.t}</div>
          </div>
        `).join('')}
      </div>

      <!-- Quick Stats -->
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
        <div class="card">
          <div class="card-header"><div class="font-semibold">User Overview</div></div>
          <div class="card-body">
            ${[
              {l:'Total Registered Users', v: allUsers.length,                                               c:'var(--primary)'},
              {l:'Active Students',        v: studentCount,                                                   c:'var(--success)'},
              {l:'Active Teachers',        v: teacherCount,                                                   c:'var(--secondary)'},
              {l:'Pending Approval',       v: pendingCount,                                                   c:pendingCount>0?'var(--warning)':'var(--text-muted)'},
            ].map(s=>`
              <div class="flex items-center justify-between mb-3 pb-3 border-b" style="border-color:var(--border);">
                <span class="text-sm text-secondary">${s.l}</span>
                <span class="font-bold" style="color:${s.c};">${s.v}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Content Overview</div></div>
          <div class="card-body">
            ${[
              {l:'Published Notices',  v: noticesCount},
              {l:'Scheduled Events',   v: eventsCount},
              {l:'Notifications Sent', v: notificationCount},
            ].map(s=>`
              <div class="flex items-center justify-between mb-3 pb-3 border-b" style="border-color:var(--border);">
                <span class="text-sm text-secondary">${s.l}</span>
                <span class="font-bold" style="color:var(--primary);">${s.v}</span>
              </div>
            `).join('')}
            <div style="margin-top:8px;">
              <button class="btn btn-secondary w-full btn-sm" onclick="switchAdminTab('settings',null)">Manage School Settings '</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Approvals quick view -->
      ${pendingCount > 0 ? `
      <div class="card" style="border-color:var(--warning);">
        <div class="card-header" style="background:#fffbeb;">
          <div class="flex items-center justify-between">
            <div class="font-semibold" style="color:#92400e;">${SVG('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',16,'#92400e')} ${pendingCount} users awaiting approval</div>
            <button class="btn btn-warning btn-sm" onclick="switchAdminTab('roles',null)">Review Now '</button>
          </div>
        </div>
      </div>` : ''}
    </div>
  `;
}

function _studentRow(s) {
  const approveBtn = s.status==='pending' ? '<button class="btn btn-success btn-sm" onclick="approveUser(\''+s.id+'\')">Approve</button>' : '';
  const statusBadge = s.status==='active'?'success':s.status==='pending'?'warning':s.status==='unlinked'?'gray':'danger';
  const statusText = s.status==='unlinked'?'Not Linked':s.status;
  const emailText = s.email || '<span style="color:var(--text-muted);font-style:italic;">Not set</span>';
  // Eye button to reveal password inline
  const pwdBtn = `<button title="Show password" onclick="revealStudentPassword('${s.id}','pwd_${s.id}')" style="background:none;border:none;cursor:pointer;padding:2px 4px;color:var(--text-muted);">${SVG('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',13)}</button><span id="pwd_${s.id}" style="font-family:monospace;font-size:11px;display:none;color:var(--primary);"></span>`;
  return '<tr>'
    + '<td><div class="flex items-center gap-3"><img src="'+s.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://i.imgur.com/x9wE0QT.png\'"><div><div class="font-semibold text-sm">'+s.name+'</div><div class="text-xs text-muted">'+emailText+'</div></div></div></td>'
    + '<td style="font-family:monospace;font-size:12px;">'+s.id+'</td>'
    + '<td>'+(s.class||'"')+' '+(s.section?'   '+s.section:'')+'</td>'
    + '<td style="font-size:12px;">'+(s.phone||'<span style="color:var(--text-muted);">"</span>')+'</td>'
    + '<td><span class="badge badge-'+statusBadge+'">'+statusText+'</span> '+pwdBtn+'</td>'
    + '<td style="font-size:12px;">'+new Date(s.createdAt).toLocaleDateString()+'</td>'
    + '<td><div style="display:flex;gap:4px;">'+approveBtn+_userActions(s.id,s.name,s.status)+'</div></td>'
    + '</tr>';
}

function renderAdminStudents() {
  const allUsers = _cache.users;
  const studentUsers = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'student');
  return `
    <div>
      <div class="flex items-center justify-between mb-4">
        <h1 style="font-size:22px;font-weight:800;">Manage Students</h1>
        <div class="flex gap-3">
          <button class="btn btn-primary" onclick="openAddStudentModal()">
            ${SVG('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',14,'white')} Add Student
          </button>
          <button class="btn btn-secondary" onclick="showToast('CSV import/export coming soon','info')">
            ${SVG('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',14)} Import/Export
          </button>
        </div>
      </div>
      <!-- Search Bar -->
      <div class="admin-filter-bar">
        <div class="admin-search-wrap">
          <span class="admin-search-icon">
            ${SVG('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',16,'var(--text-muted)')}
          </span>
          <input id="studentSearch" class="form-input admin-search-input" placeholder="Search by name, ID, class..." oninput="filterAdminStudents()">
        </div>
        <span id="studentCount" class="admin-count-badge">${studentUsers.length} students</span>
      </div>
      <div class="card">
        ${studentUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">
              <div style="margin-bottom:12px;display:flex;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>
              <div class="font-semibold" style="font-size:18px;">No students yet</div>
              <div class="text-sm mt-2 mb-4">Start by adding student records to your database</div>
              <button class="btn btn-primary" onclick="openAddStudentModal()">
                ${SVG('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',14,'white')} Add First Student
              </button>
            </div>`
          : `<div class="table-container"><table id="studentsTable">
            <thead><tr><th>Student</th><th>ID</th><th>Class</th><th>Phone</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>${studentUsers.map(s => _studentRow(s)).join('')}</tbody>
          </table></div>`
        }
      </div>
    </div>
  `;
}



function _pendingUserRow(u) {
  const approveIcon = SVG('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', 13, 'white');
  const roleBadge = u.role==='principal'?'warning':u.role==='teacher'?'purple':u.role==='staff'?'gray':'primary';
  return '<tr>'
    + '<td><div style="display:flex;align-items:center;gap:10px;"><img src="'+u.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://i.imgur.com/x9wE0QT.png\'"><div><div class="font-semibold text-sm">'+u.name+'</div><div class="text-xs text-muted">'+u.id+'</div></div></div></td>'
    + '<td><span class="badge badge-'+roleBadge+'" style="text-transform:capitalize;">'+u.role+'</span></td>'
    + '<td style="font-size:12px;">'+u.email+'</td>'
    + '<td style="font-size:12px;">'+(u.phone||'"')+'</td>'
    + '<td>'+(u.class||'"')+' '+(u.section?'   '+u.section:'')+'</td>'
    + '<td style="font-size:12px;">'+new Date(u.createdAt).toLocaleDateString()+'</td>'
    + '<td><span class="badge badge-warning">'+u.status+'</span></td>'
    + '<td><div style="display:flex;gap:6px;"><button class="btn btn-success btn-sm" onclick="approveUser(\''+u.id+'\')">'+approveIcon+' Approve</button>'
    + '<button class="btn btn-danger btn-sm" onclick="adminDeleteUser(\''+u.id+'\',\''+u.name+'\')">Delete</button></div></td>'
    + '</tr>';
}

function _activeUserRow(u) {
  const roleBadge = u.role==='admin'?'danger':u.role==='principal'?'warning':u.role==='teacher'?'purple':'primary';
  return '<tr>'
    + '<td><div style="display:flex;align-items:center;gap:10px;"><img src="'+u.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://i.imgur.com/x9wE0QT.png\'"><div><div class="font-semibold text-sm">'+u.name+'</div><div class="text-xs text-muted">'+u.id+'</div></div></div></td>'
    + '<td style="font-size:12px;">'+u.email+'</td>'
    + '<td><span class="badge badge-'+roleBadge+'" style="text-transform:capitalize;">'+u.role+'</span></td>'
    + '<td>'+(u.class||'"')+' '+(u.section?'   '+u.section:'')+'</td>'
    + '<td style="font-size:12px;">'+new Date(u.createdAt).toLocaleDateString()+'</td>'
    + '<td><span class="badge badge-success">Active</span></td>'
    + '</tr>';
}

function _resultRow(r) {
  return '<tr>'
    + '<td class="font-medium">'+r.studentName+'</td>'
    + '<td class="text-sm text-muted">'+r.exam+'</td>'
    + '<td>'+r.total+'/'+r.outOf+'</td>'
    + '<td>'+r.percentage+'%</td>'
    + '<td><span class="badge badge-success">'+r.grade+'</span></td>'
    + '<td class="font-bold" style="color:var(--primary);">'+r.gpa+'</td>'
    + '<td>'
    + '<button class="btn btn-ghost btn-icon btn-sm" onclick="editResult(\''+r.id+'\')" title="Edit Result">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
    + '</button>'
    + '<button class="btn btn-ghost btn-icon btn-sm" onclick="deleteResult(\''+r.id+'\')" title="Delete Result">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
    + '</button>'
    + '</td>'
    + '</tr>';
}

function _noticeRow(n, i) {
  const priorityBadge = n.priority==='urgent'?'danger':n.priority==='high'?'warning':'gray';
  return '<tr>'
    + '<td><div class="font-medium">'+n.title+'</div></td>'
    + '<td><span class="badge badge-primary">'+n.category+'</span></td>'
    + '<td><span class="badge badge-'+priorityBadge+'">'+n.priority+'</span></td>'
    + '<td>'+n.date+'</td>'
    + '<td><div style="display:flex;gap:6px;">'
    + '<button class="btn btn-secondary btn-sm" onclick="editNotice('+i+')">Edit</button>'
    + '<button class="btn btn-danger btn-sm" onclick="deleteNotice('+i+')">Delete</button>'
    + '</div></td>'
    + '</tr>';
}

function _eventRow(e, i) {
  return '<tr>'
    + '<td><div class="font-medium">'+e.title+'</div></td>'
    + '<td>'+e.date+'</td>'
    + '<td><span class="badge badge-primary">'+e.category+'</span></td>'
    + '<td>'+e.location+'</td>'
    + '<td><div style="display:flex;gap:6px;">'
    + '<button class="btn btn-secondary btn-sm" onclick="editEvent('+i+')">Edit</button>'
    + '<button class="btn btn-danger btn-sm" onclick="deleteEvent('+i+')">Delete</button>'
    + '</div></td>'
    + '</tr>';
}

function _examCard(e, i) {
  const borderColor = e.status==='Published'?'var(--success)':e.status==='Draft'?'var(--warning)':'var(--primary)';
  const badgeClass  = e.status==='Published'?'success':e.status==='Draft'?'warning':'primary';
  const actionBtn   = e.status !== 'Published'
    ? '<button class="btn btn-success btn-sm" onclick="publishExam('+i+')">Publish</button>'
    : '<button class="btn btn-ghost btn-sm" onclick="unpublishExam('+i+')">Unpublish</button>';
  
  // Build scope display
  let scopeDisplay = e.class || (e.scope || 'All Classes');
  if (e.section) scopeDisplay += `, Section ${e.section}`;
  if (e.group) scopeDisplay += ` - ${e.group}`;
  
  const calendarIcon = SVG('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', 12);
  const bookIcon = SVG('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', 12);
  
  return '<div class="card" style="border-left:4px solid '+borderColor+';">'
    + '<div class="card-body" style="padding:16px 20px;">'
    + '<div class="flex items-center gap-4">'
    + '<div style="flex:1;">'
    + '<div class="font-semibold" style="font-size:16px;">'+e.name+'</div>'
    + '<div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap;align-items:center;">'
    + '<span class="badge badge-primary" style="font-size:11px;">'+scopeDisplay+'</span>'
    + '<span class="text-xs text-muted" style="display:flex;align-items:center;gap:4px;">'+calendarIcon+' '+(e.date||'No date')+'</span>'
    + '<span class="text-xs text-muted" style="display:flex;align-items:center;gap:4px;">'+bookIcon+' Subjects: '+((e.subjects||[]).join(', '))+'</span>'
    + '</div>'
    + '</div>'
    + '<span class="badge badge-'+badgeClass+'">'+e.status+'</span>'
    + '<div class="flex gap-2"><button class="btn btn-secondary btn-sm" onclick="openMarksEntry('+i+')">Enter Marks</button>'+actionBtn+'<button class="btn btn-danger btn-sm" onclick="deleteExam('+i+')">Delete</button></div>'
    + '</div></div></div>';
}

function _batchCard(b, i) {
  const achievementsHTML = (b.achievements && b.achievements.length > 0)
    ? '<div class="mb-3"><div class="text-xs font-semibold text-muted mb-2">Achievements:</div>'
      + '<ul style="list-style:disc;padding-left:20px;margin:0;">'
      + b.achievements.map(ach => '<li class="text-xs text-secondary" style="margin-bottom:4px;">'+ach+'</li>').join('')
      + '</ul></div>'
    : '';
  
  return '<div class="card" style="border:none;">'
    + '<div class="card-body">'
    + '<div class="flex items-center justify-between mb-3">'
    + '<div><div class="font-bold" style="font-size:18px;">'+b.name+'</div><div class="text-xs text-muted">Passing Year: '+b.passingYear+'</div></div>'
    + '<span class="badge badge-primary">'+(b.totalStudents||0)+' students</span>'
    + '</div>'
    + '<p class="text-sm text-secondary mb-3">'+(b.description||'')+'</p>'
    + achievementsHTML
    + '<div class="text-xs text-muted mb-4">Class Teacher: '+(b.classTeacher||'"')+'</div>'
    + '<div class="flex gap-2" style="padding-top:12px;border-top:1px solid var(--border);">'
    + '<button class="btn btn-secondary btn-sm" onclick="editBatch('+i+')">Edit</button>'
    + '<button class="btn btn-danger btn-sm" onclick="deleteBatch('+i+')">Delete</button>'
    + '</div></div></div>';
}

function _userActions(id, name, status) {
  // Show edit button for all statuses, but different edit functions
  const editBtn = status === 'unlinked'
    ? '<button class="btn btn-ghost btn-icon btn-sm" onclick="adminEditUnlinkedStudent(\''+id+'\')" title="Edit Basic Info">'+SVG('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',14)+'</button>'
    : '<button class="btn btn-ghost btn-icon btn-sm" onclick="adminEditUser(\''+id+'\')" title="Edit">'+SVG('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',14)+'</button>';
  return editBtn
    + '<button class="btn btn-ghost btn-icon btn-sm" onclick="adminDeleteUser(\''+id+'\',\''+name+'\')" title="Delete" style="color:var(--danger);">'+SVG('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',14,'var(--danger)')+'</button>';
}
function _approveBtn(id, status) {
  return status==='pending' ? '<button class="btn btn-success btn-sm" onclick="approveUser(\''+id+'\')">Approve</button>' : '';
}

function renderAdminTeachers() {
  const allUsers = _cache.users;
  // Case-insensitive role filtering for Google Sign-In compatibility
  const teacherUsers = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'teacher');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Teachers</h1>
        <button class="btn btn-primary" onclick="showAddTeacherForm()">
          ${SVG('<path d="M12 5v14M5 12h14"/>',16,'white')} Add Teacher
        </button>
      </div>
      
      <!-- Add Teacher Form (hidden by default) -->
      <div id="addTeacherForm" style="display:none;margin-bottom:20px;">
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="font-semibold">Create Teacher Account</div>
              <button class="btn btn-ghost btn-sm" onclick="hideAddTeacherForm()">Cancel</button>
            </div>
          </div>
          <div class="card-body">
            <form id="teacherForm" onsubmit="handleAddTeacher(event)" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <!-- Profile Picture Upload -->
              <div style="grid-column:1/-1;">
                <label class="form-label">Profile Picture (Optional)</label>
                <div style="display:flex;align-items:center;gap:16px;">
                  <img id="teacherPicPreview" src="https://i.imgur.com/x9wE0QT.png" alt="Preview" 
                       style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--border);background:var(--bg-secondary);" 
                       onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                  <div style="flex:1;">
                    <div style="border:2px dashed var(--border);border-radius:12px;padding:16px;text-align:center;cursor:pointer;background:var(--bg-secondary);" 
                         onclick="document.getElementById('teacherPicInput').click()">
                      <div style="margin-bottom:4px;display:flex;justify-content:center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
                      <div style="font-size:13px;font-weight:600;color:var(--text-primary);">Upload photo</div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">JPG, PNG (max 15MB)</div>
                    </div>
                    <input type="file" id="teacherPicInput" accept="image/*" style="display:none;" onchange="adminProfilePicChange(this, 'teacherPicPreview', 'teacher')">
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" name="firstName" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name *</label>
                <input type="text" name="lastName" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" name="email" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone *</label>
                <input type="tel" name="phone" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Subject *</label>
                <input type="text" name="subject" class="form-input" placeholder="e.g. Mathematics" required>
              </div>
              <div class="form-group">
                <label class="form-label">Qualification *</label>
                <input type="text" name="qualification" class="form-input" placeholder="e.g. M.Sc. DU" required>
              </div>
              <div class="form-group">
                <label class="form-label">Temporary Password *</label>
                <input type="text" name="password" class="form-input" value="teacher123" required>
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <select name="bloodGroup" class="form-input form-select">
                  <option>Select</option>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
              <div style="grid-column:1/-1;display:flex;gap:12px;justify-content:flex-end;">
                <button type="button" class="btn btn-secondary" onclick="hideAddTeacherForm()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Teacher Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="admin-filter-bar" style="border-bottom:1px solid var(--border);">
          <div class="admin-search-wrap">
            <span class="admin-search-icon">
              ${SVG('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',16,'var(--text-muted)')}
            </span>
            <input id="teacherSearch" class="form-input admin-search-input" placeholder="Search by name, subject..." oninput="filterAdminTeachers()">
          </div>
          <span id="teacherCount" class="admin-count-badge">${teacherUsers.length} teachers</span>
        </div>
        ${teacherUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">No teachers registered yet.</div>`
          : `<div class="table-container"><table id="teachersTable">
            <thead><tr><th>Teacher</th><th>ID</th><th>Subject</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>${teacherUsers.map(t =>
              '<tr>'
              + '<td><div class="flex items-center gap-3"><img src="'+t.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://i.imgur.com/x9wE0QT.png\'"><div><div class="font-semibold text-sm">'+t.name+'</div><div class="text-xs text-muted">'+t.email+'</div></div></div></td>'
              + '<td style="font-family:monospace;font-size:12px;">'+t.id+'</td>'
              + '<td><span class="badge badge-primary">'+(t.subject||'-')+'</span></td>'
              + '<td><span class="badge badge-'+(t.status==='active'?'success':t.status==='pending'?'warning':'gray')+'">'+t.status+'</span></td>'
              + '<td style="font-size:12px;">'+new Date(t.createdAt).toLocaleDateString()+'</td>'
              + '<td><div style="display:flex;gap:4px;">'+_approveBtn(t.id,t.status)+_userActions(t.id,t.name,t.status)+'</div></td>'
              + '</tr>'
            ).join('')}</tbody>
          </table></div>`
        }
      </div>
    </div>
  `;
}

function renderAdminStaff() {
  const allUsers = _cache.users;
  // Case-insensitive role filtering for Google Sign-In compatibility
  const staffUsers = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'staff');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Support Staff</h1>
        <button class="btn btn-primary" onclick="showAddStaffForm()">
          ${SVG('<path d="M12 5v14M5 12h14"/>',16,'white')} Add Staff
        </button>
      </div>
      
      <!-- Add Staff Form (hidden by default) -->
      <div id="addStaffForm" style="display:none;margin-bottom:20px;">
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="font-semibold">Create Staff Account</div>
              <button class="btn btn-ghost btn-sm" onclick="hideAddStaffForm()">Cancel</button>
            </div>
          </div>
          <div class="card-body">
            <form id="staffForm" onsubmit="handleAddStaff(event)" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <!-- Profile Picture Upload -->
              <div style="grid-column:1/-1;">
                <label class="form-label">Profile Picture (Optional)</label>
                <div style="display:flex;align-items:center;gap:16px;">
                  <img id="staffPicPreview" src="https://i.imgur.com/x9wE0QT.png" alt="Preview" 
                       style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--border);background:var(--bg-secondary);" 
                       onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                  <div style="flex:1;">
                    <div style="border:2px dashed var(--border);border-radius:12px;padding:16px;text-align:center;cursor:pointer;background:var(--bg-secondary);" 
                         onclick="document.getElementById('staffPicInput').click()">
                      <div style="margin-bottom:4px;display:flex;justify-content:center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
                      <div style="font-size:13px;font-weight:600;color:var(--text-primary);">Upload photo</div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">JPG, PNG (max 15MB)</div>
                    </div>
                    <input type="file" id="staffPicInput" accept="image/*" style="display:none;" onchange="adminProfilePicChange(this, 'staffPicPreview', 'staff')">
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" name="firstName" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name *</label>
                <input type="text" name="lastName" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" name="email" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone *</label>
                <input type="tel" name="phone" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Position *</label>
                <select name="position" class="form-input form-select" required>
                  <option>Select</option>
                  <option>Office Manager</option><option>Librarian</option><option>Security Guard</option>
                  <option>Lab Assistant</option><option>IT Support</option><option>Peon</option><option>Cleaner</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Department *</label>
                <select name="department" class="form-input form-select" required>
                  <option>Select</option>
                  <option>Administration</option><option>Library</option><option>Security</option>
                  <option>Science Lab</option><option>ICT</option><option>Maintenance</option><option>General</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Temporary Password *</label>
                <input type="text" name="password" class="form-input" value="staff123" required>
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <select name="bloodGroup" class="form-input form-select">
                  <option>Select</option>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
              <div style="grid-column:1/-1;display:flex;gap:12px;justify-content:flex-end;">
                <button type="button" class="btn btn-secondary" onclick="hideAddStaffForm()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Staff Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="admin-filter-bar" style="border-bottom:1px solid var(--border);">
          <div class="admin-search-wrap">
            <span class="admin-search-icon">
              ${SVG('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',16,'var(--text-muted)')}
            </span>
            <input id="staffSearch" class="form-input admin-search-input" placeholder="Search by name, position..." oninput="filterAdminStaff()">
          </div>
          <span id="staffCount" class="admin-count-badge">${staffUsers.length} staff</span>
        </div>
        ${staffUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">No staff registered yet.</div>`
          : `<div class="table-container"><table id="staffTable">
            <thead><tr><th>Name</th><th>ID</th><th>Position</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${staffUsers.map(s =>
              '<tr>'
              + '<td><div class="flex items-center gap-3"><img src="'+s.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://i.imgur.com/x9wE0QT.png\'"><div class="font-semibold text-sm">'+s.name+'</div></div></td>'
              + '<td style="font-family:monospace;font-size:12px;">'+s.id+'</td>'
              + '<td>'+(s.position||'-')+'</td>'
              + '<td>'+(s.department||'-')+'</td>'
              + '<td><span class="badge badge-'+(s.status==='active'?'success':'warning')+'">'+s.status+'</span></td>'
              + '<td><div style="display:flex;gap:4px;">'+_approveBtn(s.id,s.status)+_userActions(s.id,s.name,s.status)+'</div></td>'
              + '</tr>'
            ).join('')}</tbody>
          </table></div>`
        }
      </div>
    </div>
  `;
}
function renderAdminPrincipal() {
  const allUsers = _cache.users;
  // Case-insensitive role filtering for Google Sign-In compatibility
  const currentPrincipal = allUsers.find(u => u.role && u.role.toLowerCase().trim() === 'principal' && u.status === 'active');
  const teachers = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'teacher' && u.status === 'active');
  
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Principal</h1>
      </div>
      
      ${currentPrincipal ? `
        <!-- Current Principal -->
        <div class="card" style="margin-bottom:20px;border-left:4px solid var(--success);">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="font-semibold" style="color:var(--success);">
                ${SVG(ICONS.users2, 16, 'var(--success)')} Current Principal
              </div>
              <span class="badge badge-success">Active</span>
            </div>
          </div>
          <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
              <img src="${currentPrincipal.avatar}" class="avatar avatar-lg" id="principalDisplayAvatar" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
              <div>
                <div style="font-size:18px;font-weight:700;">${currentPrincipal.name}</div>
                <div style="font-size:13px;color:var(--text-muted);">${currentPrincipal.email}</div>
                <div style="font-size:12px;color:var(--text-muted);font-family:monospace;">${currentPrincipal.id}</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px;">
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">PHONE</div>
                <div style="font-size:13px;font-weight:600;">${currentPrincipal.phone || '"'}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">QUALIFICATION</div>
                <div style="font-size:13px;font-weight:600;">${currentPrincipal.qualification || '"'}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">BLOOD GROUP</div>
                <div style="font-size:13px;font-weight:600;">${currentPrincipal.bloodGroup || '"'}</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">CREATED</div>
                <div style="font-size:13px;font-weight:600;">${new Date(currentPrincipal.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            ${currentPrincipal.bio ? `<div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;padding:10px;background:var(--bg-secondary);border-radius:8px;">${currentPrincipal.bio}</div>` : ''}
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="showEditPrincipalForm('${currentPrincipal.id}')">
                ${SVG('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',14,'white')} Edit Principal
              </button>
              <button class="btn btn-warning" onclick="demotePrincipal('${currentPrincipal.id}', '${currentPrincipal.name}')">
                ${SVG('<path d="M7 10l5 5 5-5"/>',14,'white')} Demote to Teacher
              </button>
            </div>
          </div>
        </div>

        <!-- Edit Principal Form (hidden by default) -->
        <div id="editPrincipalForm" style="display:none;margin-bottom:20px;">
          <div class="card" style="border-left:4px solid var(--primary);">
            <div class="card-header">
              <div class="flex items-center justify-between">
                <div class="font-semibold">${SVG('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',16)} Edit Principal Details</div>
                <button class="btn btn-ghost btn-sm" onclick="cancelPrincipalEdit()">Cancel</button>
              </div>
            </div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:16px;">
              <!-- Profile Picture -->
              <div>
                <label class="form-label">Profile Picture</label>
                <div style="display:flex;align-items:center;gap:16px;">
                  <img id="ep_avatarPreview" src="${currentPrincipal.avatar}" 
                       style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--border);"
                       onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                  <div style="flex:1;">
                    <div style="border:2px dashed var(--border);border-radius:12px;padding:14px;text-align:center;cursor:pointer;background:var(--bg-secondary);"
                         onclick="document.getElementById('ep_avatarInput').click()">
                      <div style="margin-bottom:2px;display:flex;justify-content:center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
                      <div style="font-size:13px;font-weight:600;">Change Photo</div>
                      <div style="font-size:11px;color:var(--text-muted);">JPG, PNG (max 15MB)</div>
                    </div>
                    <input type="file" id="ep_avatarInput" accept="image/*" style="display:none;"
                           onchange="previewPrincipalAvatar(this)">
                  </div>
                </div>
              </div>
              <!-- Name -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">First Name *</label>
                  <input class="form-input" id="ep_first" value="${currentPrincipal.firstName || currentPrincipal.name?.split(' ')[0] || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name *</label>
                  <input class="form-input" id="ep_last" value="${currentPrincipal.lastName || currentPrincipal.name?.split(' ').slice(1).join(' ') || ''}">
                </div>
              </div>
              <!-- Contact -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input class="form-input" id="ep_email" type="email" value="${currentPrincipal.email || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input class="form-input" id="ep_phone" type="tel" value="${currentPrincipal.phone || ''}">
                </div>
              </div>
              <!-- Academic -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <!-- Qualification + Blood Group -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">Qualification</label>
                  <input class="form-input" id="ep_qualification" placeholder="e.g. M.Ed, Ph.D" value="${currentPrincipal.qualification || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Blood Group</label>
                  <select class="form-input form-select" id="ep_blood">
                    <option value="">Select</option>
                    ${['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => `<option value="${bg}" ${(currentPrincipal.bloodGroup||'')=== bg ? 'selected' : ''}>${bg}</option>`).join('')}
                  </select>
                </div>
              </div>
              <!-- Joining Date + Experience -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">Joining Date</label>
                  <input class="form-input" id="ep_joiningDate" type="date" value="${currentPrincipal.joiningDate || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Experience</label>
                  <input class="form-input" id="ep_experience" placeholder="e.g. 10+ years" value="${currentPrincipal.experience || ''}">
                </div>
              </div>
              <!-- Bio -->
              <div class="form-group">
                <label class="form-label">Bio / Message</label>
                <textarea class="form-input" id="ep_bio" rows="3" placeholder="Principal's message or bio shown on the website...">${currentPrincipal.bio || ''}</textarea>
              </div>
              <input type="hidden" id="ep_id" value="${currentPrincipal.id}">
              <!-- Actions -->
              <div class="flex gap-3">
                <button class="btn btn-primary" onclick="savePrincipalEdit()">
                  ${SVG('<polyline points="20 6 9 17 4 12"/>',14,'white')} Save Changes
                </button>
                <button class="btn btn-secondary" onclick="cancelPrincipalEdit()">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ` : `
        <!-- No Principal -->
        <div class="card" style="margin-bottom:20px;border-left:4px solid var(--warning);">
          <div class="card-body" style="text-align:center;padding:40px;">
            <div style="margin-bottom:16px;display:flex;justify-content:center;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div style="font-size:18px;font-weight:700;margin-bottom:8px;">No Principal Assigned</div>
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:24px;">
              Create a new principal account or promote an existing teacher to principal role.
            </div>
            <div style="display:flex;gap:12px;justify-content:center;">
              <button class="btn btn-primary" onclick="showCreatePrincipalForm()">
                ${SVG('<path d="M12 5v14M5 12h14"/>',16,'white')} Create Principal Account
              </button>
              ${teachers.length > 0 ? `
                <button class="btn btn-secondary" onclick="showPromoteTeacherForm()">
                  ${SVG('<path d="M7 10l5-5 5 5"/>',16)} Promote Teacher
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `}
      
      <!-- Create Principal Form (hidden) -->
      <div id="createPrincipalForm" style="display:none;margin-bottom:20px;">
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="font-semibold" style="color:var(--text-primary);">Create New Principal Account</div>
              <button class="btn btn-ghost btn-sm" onclick="hideCreatePrincipalForm()">Cancel</button>
            </div>
          </div>
          <div class="card-body">
            <div style="padding:12px;background:var(--primary-50);border-radius:8px;border:1px solid var(--primary-100);margin-bottom:16px;">
              <div style="font-size:12px;color:var(--primary);">
                ${SVG(ICONS.users2,14,'var(--primary)')} <strong>Note:</strong> Only one principal can be active at a time. This account will have elevated permissions.
              </div>
            </div>
            <form id="principalForm" onsubmit="handleCreatePrincipal(event)" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <!-- Profile Picture Upload -->
              <div style="grid-column:1/-1;">
                <label class="form-label">Profile Picture (Optional)</label>
                <div style="display:flex;align-items:center;gap:16px;">
                  <img id="principalPicPreview" src="https://i.imgur.com/x9wE0QT.png" alt="Preview" 
                       style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--border);background:var(--bg-secondary);" 
                       onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                  <div style="flex:1;">
                    <div style="border:2px dashed var(--border);border-radius:12px;padding:16px;text-align:center;cursor:pointer;background:var(--bg-secondary);" 
                         onclick="document.getElementById('principalPicInput').click()">
                      <div style="margin-bottom:4px;display:flex;justify-content:center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
                      <div style="font-size:13px;font-weight:600;color:var(--text-primary);">Upload photo</div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">JPG, PNG (max 15MB)</div>
                    </div>
                    <input type="file" id="principalPicInput" accept="image/*" style="display:none;" onchange="adminProfilePicChange(this, 'principalPicPreview', 'principal')">
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">First Name *</label>
                <input type="text" name="firstName" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name *</label>
                <input type="text" name="lastName" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" name="email" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone *</label>
                <input type="tel" name="phone" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Temporary Password *</label>
                <input type="text" name="password" class="form-input" value="principal123" required>
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <select name="bloodGroup" class="form-input form-select">
                  <option>Select</option>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
              <div style="grid-column:1/-1;display:flex;gap:12px;justify-content:flex-end;">
                <button type="button" class="btn btn-secondary" onclick="hideCreatePrincipalForm()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Principal Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Promote Teacher Form (hidden) -->
      <div id="promoteTeacherForm" style="display:none;margin-bottom:20px;">
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="font-semibold" style="color:var(--text-primary);">Promote Teacher to Principal</div>
              <button class="btn btn-ghost btn-sm" onclick="hidePromoteTeacherForm()">Cancel</button>
            </div>
          </div>
          <div class="card-body">
            <div style="padding:12px;background:var(--warning-50);border-radius:8px;border:1px solid var(--warning);margin-bottom:16px;">
              <div style="font-size:12px;color:var(--text-primary);">
                ${SVG('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',14,'var(--warning)')}
                <strong>Warning:</strong> Promoting a teacher will change their role to principal. This action is logged.
              </div>
            </div>
            <form id="promoteForm" onsubmit="handlePromoteTeacher(event)">
              <div class="form-group">
                <label class="form-label">Select Teacher to Promote *</label>
                <select name="teacherId" class="form-input form-select" required onchange="showTeacherPreview(this.value)">
                  <option value="">-- Select a teacher --</option>
                  ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject || 'No subject'})</option>`).join('')}
                </select>
              </div>
              <div id="teacherPreview"></div>
              <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px;">
                <button type="button" class="btn btn-secondary" onclick="hidePromoteTeacherForm()">Cancel</button>
                <button type="submit" class="btn btn-warning">Promote to Principal</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Activity Log -->
      <div class="card">
        <div class="card-header"><div class="font-semibold">Principal Account Activity Log</div></div>
        <div class="card-body">
          <div class="text-muted text-sm">Activity logging - Coming soon</div>
        </div>
      </div>
    </div>
  `;
}
function renderAdminBatches() {
  const batches = _cache.batches;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Batches</h1>
        <button class="btn btn-primary" onclick="showNewBatchForm()">+ Create Batch</button>
      </div>

      <div class="card mb-6" id="addBatchForm" style="display:none;">
        <div class="card-header"><div class="font-semibold" id="batchFormTitle">New Batch</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Batch Name *</label>
              <input class="form-input" id="b_name" placeholder="e.g. Batch 2025"></div>
            <div class="form-group"><label class="form-label">Passing Year *</label>
              <input class="form-input" id="b_year" type="number" placeholder="e.g. 2025"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Class Teacher</label>
              <input class="form-input" id="b_teacher" placeholder="Teacher name"></div>
            <div class="form-group"><label class="form-label">Total Students</label>
              <input class="form-input" id="b_students" type="number" placeholder="0"></div>
          </div>
          <div class="form-group"><label class="form-label">Description</label>
            <textarea class="form-input" id="b_desc" rows="2" placeholder="Batch description..."></textarea></div>
          
          <!-- Achievements Section -->
          <div class="form-group">
            <label class="form-label">Achievements</label>
            <div id="b_achievements_list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;"></div>
            <div style="display:flex;gap:8px;">
              <input class="form-input" id="b_achievement_input" placeholder="Add an achievement..." style="flex:1;">
              <button type="button" class="btn btn-secondary" onclick="addBatchAchievement()">+ Add</button>
            </div>
          </div>
          
          <input type="hidden" id="b_editIndex" value="">
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveBatch()">Save Batch</button>
            <button class="btn btn-secondary" onclick="cancelBatchForm()">Cancel</button>
          </div>
        </div>
      </div>

      ${batches.length === 0
        ? `<div class="card"><div class="card-body text-center text-muted" style="padding:60px;">No batches created yet. Click "+ Create Batch" to add one.</div></div>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
            ${batches.map((b,i) => _batchCard(b,i)).join('')}
          </div>`
      }
    </div>
  `;
}

function renderAdminResults() {
  const allUsers = _cache.users;
  // Include both active and unlinked students in results management
  // Case-insensitive role filtering for Google Sign-In compatibility
  const studentUsers = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'student' && (u.status === 'active' || u.status === 'unlinked'));
  const exams = _cache.exams;
  const results = _cache.results;

  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Result Management</h1>
        <button class="btn btn-primary" onclick="document.getElementById('addExamForm').style.display=document.getElementById('addExamForm').style.display==='none'?'block':'none'">
          + Create Examination
        </button>
      </div>

      <!-- Create Exam Form -->
      <div class="card mb-6" id="addExamForm" style="display:none;">
        <div class="card-header"><div class="font-semibold">New Examination</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Exam Name *</label>
              <input class="form-input" id="ex_name" placeholder="e.g. Half-Yearly Examination 2025"></div>
            <div class="form-group"><label class="form-label">Date *</label>
              <input class="form-input" id="ex_date" type="date"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group">
              <label class="form-label">Class *</label>
              <select class="form-select form-input" id="ex_class" onchange="toggleExamGroupField()">
                <option value="">Select Class</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Section (Optional)</label>
              <select class="form-select form-input" id="ex_section">
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group" id="ex_group_field" style="display:none;">
              <label class="form-label">Group (Class 9/10) *</label>
              <select class="form-select form-input" id="ex_group" onchange="updateSubjectList()">
                <option value="">Select Group</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
          </div>
          
          <!-- Subject Selection -->
          <div class="form-group">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <label class="form-label" style="margin-bottom:0;">Subjects *</label>
              <button type="button" class="btn btn-sm" onclick="addCustomSubject()" 
                      style="padding:6px 12px;font-size:12px;background:var(--primary);color:white;border:none;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Subject
              </button>
            </div>
            <div id="subject_selector" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;padding:16px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;max-height:320px;overflow-y:auto;">
              <div class="text-muted text-sm">Select class and group first</div>
            </div>
            <input type="hidden" id="ex_subjects">
          </div>
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveExam()">Create Exam</button>
            <button class="btn btn-secondary" onclick="document.getElementById('addExamForm').style.display='none'">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Exams List -->
      ${exams.length === 0
        ? `<div class="card mb-6"><div class="card-body text-center text-muted" style="padding:40px;">
            No exams created yet. Click "+ Create Examination" to add one.
          </div></div>`
        : `<div class="flex flex-col gap-3 mb-6">${exams.map((e,i) => _examCard(e,i)).join('')}</div>`
      }

      <!-- Marks Entry Panel -->
      <div id="marksEntryPanel" style="display:none;">
        <div class="card">
          <div class="card-header flex items-center justify-between">
            <div class="font-semibold" id="marksEntryTitle">Enter Marks</div>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm" onclick="saveMarks()">Save Marks</button>
              <button class="btn btn-ghost btn-sm" onclick="document.getElementById('marksEntryPanel').style.display='none'">Close</button>
            </div>
          </div>
          <div class="card-body" id="marksEntryBody">
            ${studentUsers.length === 0
              ? `<div class="text-center text-muted" style="padding:40px;">No active students found. Add students first.</div>`
              : `<div class="table-container"><table id="marksTable">
                  <thead id="marksTableHead"></thead>
                  <tbody id="marksTableBody"></tbody>
                </table></div>`
            }
          </div>
        </div>
      </div>

      <!-- Published Results Summary -->
      ${results.length > 0 ? `
        <div class="card mt-6">
          <div class="card-header"><div class="font-semibold">Published Results Summary</div></div>
          <div class="table-container"><table>
            <thead><tr><th>Student</th><th>Exam</th><th>Total</th><th>%</th><th>Grade</th><th>GPA</th><th>Actions</th></tr></thead>
            <tbody>${results.slice(-20).reverse().map(r => _resultRow(r)).join('')}</tbody>
          </table></div>
        </div>` : ''}
    </div>
  `;
}

function gradeFromPct(pct) {
  if (pct >= 80) return { g:'A+', gp:5.0 };
  if (pct >= 70) return { g:'A',  gp:4.0 };
  if (pct >= 60) return { g:'A-', gp:3.5 };
  if (pct >= 50) return { g:'B',  gp:3.0 };
  if (pct >= 40) return { g:'C',  gp:2.0 };
  if (pct >= 33) return { g:'D',  gp:1.0 };
  return { g:'F', gp:0.0 };
}

window.saveExam = async function() {
  const name     = document.getElementById('ex_name').value.trim();
  const date     = document.getElementById('ex_date').value;
  const classVal = document.getElementById('ex_class').value;
  const section  = document.getElementById('ex_section').value;
  const group    = document.getElementById('ex_group').value;
  const subjects = document.getElementById('ex_subjects').value.split(',').map(s=>s.trim()).filter(Boolean);
  
  if (!name) { showToast('Exam name is required','error'); return; }
  if (!classVal) { showToast('Please select a class','error'); return; }
  if (subjects.length === 0) { showToast('Please add at least one subject','error'); return; }
  
  // Build scope string
  let scope = classVal;
  if (section) scope += `, Section ${section}`;
  if (group) scope += ` - ${group}`;
  
  await api.addExam({ name, date, scope, class: classVal, section, group, subjects });
  showToast('Exam created!','success');
  
  // Clear form
  document.getElementById('ex_name').value = '';
  document.getElementById('ex_date').value = '';
  document.getElementById('ex_class').value = '';
  document.getElementById('ex_section').value = '';
  document.getElementById('ex_group').value = '';
  document.getElementById('ex_subjects').value = '';
  document.getElementById('addExamForm').style.display = 'none';
  document.getElementById('ex_group_field').style.display = 'none';
  
  await _refreshTab('results');
};

// Subject lists by group/class
const SUBJECT_LISTS = {
  'Science': [
    'Bangla', 'Bangla 2nd', 'English', 'English 2nd', 'Mathematics',
    'Bangladesh and Global Studies', 'Religion and Moral Education',
    'Information and Communication Technology (ICT)', 'Physical Education',
    'Physics', 'Chemistry', 'Biology', 'Higher Mathematics'
  ],
  'Arts': [
    'Bangla', 'Bangla 2nd', 'English', 'English 2nd', 'Mathematics',
    'Bangladesh and Global Studies', 'Religion and Moral Education',
    'Information and Communication Technology (ICT)', 'Physical Education',
    'History', 'Civics', 'Geography', 'Economics'
  ],
  'Commerce': [
    'Bangla', 'Bangla 2nd', 'English', 'English 2nd', 'Mathematics',
    'Bangladesh and Global Studies', 'Religion and Moral Education',
    'Information and Communication Technology (ICT)', 'Physical Education',
    'Accounting', 'Business Studies', 'Economics', 'Finance and Banking'
  ],
  'General': [
    'Bangla', 'Bangla 2nd', 'English', 'English 2nd', 'Mathematics', 'Science',
    'Bangladesh and Global Studies', 'Religion and Moral Education',
    'Information and Communication Technology (ICT)', 'Physical Education',
    'Agriculture', 'Home Economics'
  ]
};

window.updateSubjectList = function() {
  const classVal = document.getElementById('ex_class').value;
  const groupVal = document.getElementById('ex_group').value;
  const selector = document.getElementById('subject_selector');
  
  let subjects = [];
  
  // Determine which subject list to use
  if (classVal === 'Class 9' || classVal === 'Class 10') {
    if (groupVal === 'Science') subjects = SUBJECT_LISTS['Science'];
    else if (groupVal === 'Arts') subjects = SUBJECT_LISTS['Arts'];
    else if (groupVal === 'Commerce') subjects = SUBJECT_LISTS['Commerce'];
    else {
      selector.innerHTML = '<div class="text-muted text-sm">Please select a group first</div>';
      return;
    }
  } else if (classVal) {
    subjects = SUBJECT_LISTS['General'];
  } else {
    selector.innerHTML = '<div class="text-muted text-sm">Please select a class first</div>';
    return;
  }
  
  // Generate checkboxes
  selector.innerHTML = subjects.map(subject => `
    <label style="display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg-primary);border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.2s;" 
           class="subject-checkbox-label">
      <input type="checkbox" class="subject-checkbox" value="${subject}" 
             onchange="collectSelectedSubjects()"
             style="width:16px;height:16px;cursor:pointer;accent-color:var(--primary);">
      <span style="font-size:13px;user-select:none;color:var(--text-primary);">${subject}</span>
    </label>
  `).join('');
  
  // Auto-select common core subjects
  const coreSubjects = ['Bangla', 'Bangla 2nd', 'English', 'English 2nd', 'Mathematics'];
  setTimeout(() => {
    document.querySelectorAll('.subject-checkbox').forEach(cb => {
      if (coreSubjects.includes(cb.value)) {
        cb.checked = true;
      }
    });
    collectSelectedSubjects();
  }, 0);
};

window.collectSelectedSubjects = function() {
  const selected = Array.from(document.querySelectorAll('.subject-checkbox:checked'))
    .map(cb => cb.value);
  document.getElementById('ex_subjects').value = selected.join(',');
};

window.addCustomSubject = async function() {
  const subjectName = await inputDialog(
    'Subject Name',
    'Add Custom Subject',
    'e.g. Agricultural Science',
    ''
  );
  
  if (!subjectName) return;
  
  const trimmedName = subjectName.trim();
  const selector = document.getElementById('subject_selector');
  
  // Check if subject already exists
  const existingCheckboxes = Array.from(document.querySelectorAll('.subject-checkbox'));
  if (existingCheckboxes.some(cb => cb.value === trimmedName)) {
    showToast('Subject already exists', 'warning');
    return;
  }
  
  // Create new checkbox for custom subject
  const newCheckbox = document.createElement('label');
  newCheckbox.style.cssText = 'display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg-primary);border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.2s;';
  newCheckbox.className = 'subject-checkbox-label';
  newCheckbox.innerHTML = `
    <input type="checkbox" class="subject-checkbox" value="${trimmedName}" 
           onchange="collectSelectedSubjects()" checked
           style="width:16px;height:16px;cursor:pointer;accent-color:var(--primary);">
    <span style="font-size:13px;user-select:none;color:var(--text-primary);">${trimmedName}</span>
    <button type="button" onclick="removeCustomSubject(this)" 
            style="margin-left:auto;padding:2px 6px;background:transparent;color:var(--text-muted);border:none;border-radius:4px;cursor:pointer;font-size:16px;line-height:1;transition:all 0.2s;"
            onmouseover="this.style.color='var(--danger)';this.style.background='var(--danger-50)'" 
            onmouseout="this.style.color='var(--text-muted)';this.style.background='transparent'"
            title="Remove subject">×</button>
  `;
  
  // Add to selector
  selector.appendChild(newCheckbox);
  
  // Update selected subjects
  collectSelectedSubjects();
  showToast('Custom subject added', 'success');
};

window.removeCustomSubject = function(btn) {
  btn.closest('.subject-checkbox-label').remove();
  collectSelectedSubjects();
};

window.toggleExamGroupField = function() {
  const classVal = document.getElementById('ex_class').value;
  const groupField = document.getElementById('ex_group_field');
  
  // Show group field only for Class 9 and Class 10
  if (classVal === 'Class 9' || classVal === 'Class 10') {
    groupField.style.display = '';
    // Don't update subjects yet, wait for group selection
    const groupVal = document.getElementById('ex_group').value;
    if (groupVal) {
      updateSubjectList();
    } else {
      document.getElementById('subject_selector').innerHTML = '<div class="text-muted text-sm">Please select a group first</div>';
    }
  } else {
    groupField.style.display = 'none';
    document.getElementById('ex_group').value = '';
    // Update subject list for general classes
    if (classVal) {
      updateSubjectList();
    }
  }
};

window.deleteExam = async function(i) {
  const confirmed = await confirmDialog('Delete this exam and all its results? This action cannot be undone.', 'Delete Exam');
  if (!confirmed) return;
  
  await api.deleteExam(i);
  showToast('Exam deleted','info');
  await _refreshTab('results');
};

window.publishExam = async function(i) {
  const exams = _cache.exams;
  const exam = exams[i];
  await api.updateExam(i, { status: 'Published' });
  
  // Create notification
  if (exam) {
    await createNotification('result', 'New Results Published', `${exam.name} results are now available`, 'results');
  }
  
  showToast('Results published! Students can now view them.','success');
  await _refreshTab('results');
};

window.unpublishExam = async function(i) {
  await api.updateExam(i, { status: 'Draft' });
  showToast('Results unpublished','info');
  await _refreshTab('results');
};

window.editResult = async function(resultId) {
  const results = _cache.results;
  const result = results.find(r => r.id === resultId);
  if (!result) { showToast('Result not found', 'error'); return; }
  
  const exams = _cache.exams;
  const exam = exams.find(e => e.id === result.examId);
  if (!exam) { showToast('Exam not found', 'error'); return; }
  
  const subjects = exam.subjects || [];
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:600px;">
      <div class="modal-header">
        <div class="font-semibold">Edit Result " ${result.studentName}</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <div class="form-group mb-4">
          <label class="form-label">Exam</label>
          <input class="form-input" value="${result.exam}" readonly style="background:var(--bg-secondary);">
        </div>
        <div class="form-group mb-4">
          <label class="form-label">Student</label>
          <input class="form-input" value="${result.studentName}" readonly style="background:var(--bg-secondary);">
        </div>
        <div class="mb-4">
          <label class="form-label mb-3">Subject Marks</label>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${subjects.map(sub => `
              <div style="display:grid;grid-template-columns:1fr 120px;gap:12px;align-items:center;">
                <label class="text-sm font-medium">${sub}</label>
                <input type="number" min="0" max="100" class="form-input edit-subject-mark" data-subject="${sub}" value="${result.subjects[sub] || ''}" placeholder="0-100" style="text-align:center;">
              </div>
            `).join('')}
          </div>
        </div>
        <div class="flex gap-3 justify-end" style="border-top:1px solid var(--border);padding-top:16px;margin-top:16px;">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="saveEditResult('${resultId}')">Save Changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
};

window.saveEditResult = async function(resultId) {
  const results = _cache.results;
  const result = results.find(r => r.id === resultId);
  if (!result) { showToast('Result not found', 'error'); return; }
  
  const exams = _cache.exams;
  const exam = exams.find(e => e.id === result.examId);
  if (!exam) { showToast('Exam not found', 'error'); return; }
  
  const subjects = {};
  const inputs = document.querySelectorAll('.edit-subject-mark');
  let total = 0;
  inputs.forEach(inp => {
    const subName = inp.dataset.subject;
    const mark = parseInt(inp.value) || 0;
    subjects[subName] = mark;
    total += mark;
  });
  
  const outOf = (exam.subjects || []).length * 100;
  const percentage = outOf > 0 ? ((total / outOf) * 100).toFixed(1) : 0;
  const pct = parseFloat(percentage);
  
  let grade = 'F', gpa = 0;
  if (pct >= 80) { grade = 'A+'; gpa = 5.0; }
  else if (pct >= 70) { grade = 'A'; gpa = 4.0; }
  else if (pct >= 60) { grade = 'A-'; gpa = 3.5; }
  else if (pct >= 50) { grade = 'B'; gpa = 3.0; }
  else if (pct >= 40) { grade = 'C'; gpa = 2.0; }
  else if (pct >= 33) { grade = 'D'; gpa = 1.0; }
  
  const updatedResult = {
    ...result,
    subjects,
    total,
    outOf,
    percentage: parseFloat(percentage),
    gpa,
    grade,
    pass: pct >= 33
  };
  
  const response = await api.updateResult(resultId, updatedResult);
  
  if (response && response.ok !== false) {
    document.querySelector('.modal-overlay')?.remove();
    showToast('Result updated successfully!', 'success');
    await _refreshTab('results');
  } else {
    showToast(response?.error || 'Failed to update result', 'error');
  }
};

window.deleteResult = async function(resultId) {
  const results = _cache.results;
  const result = results.find(r => r.id === resultId);
  if (!result) { showToast('Result not found', 'error'); return; }
  
  const confirmed = await confirmDialog(`Delete result for ${result.studentName} in ${result.exam}? This action cannot be undone.`, 'Delete Result');
  if (!confirmed) return;
  
  const response = await api.deleteResult(resultId);
  
  if (response && response.ok !== false) {
    showToast('Result deleted successfully', 'info');
    await _refreshTab('results');
  } else {
    showToast(response?.error || 'Failed to delete result', 'error');
  }
};

window.openMarksEntry = function(examIndex) {
  const exams = _cache.exams;
  const exam = exams[examIndex];
  if (!exam) return;
  
  const allUsers = _cache.users;
  // Include both active and unlinked students for marks entry
  // Case-insensitive role filtering for Google Sign-In compatibility
  let studentUsers = allUsers.filter(u => u.role && u.role.toLowerCase().trim() === 'student' && (u.status === 'active' || u.status === 'unlinked'));
  
  // Filter students by exam's class, section, and group
  if (exam.class) {
    studentUsers = studentUsers.filter(st => st.class === exam.class);
  }
  if (exam.section) {
    studentUsers = studentUsers.filter(st => st.section === exam.section);
  }
  if (exam.group) {
    studentUsers = studentUsers.filter(st => st.group === exam.group);
  }
  
  const savedResults = _cache.results;

  const panel = document.getElementById('marksEntryPanel');
  const title = document.getElementById('marksEntryTitle');
  const thead = document.getElementById('marksTableHead');
  const tbody = document.getElementById('marksTableBody');
  if (!panel || !thead || !tbody) return;

  panel.style.display = 'block';
  panel.dataset.examIndex = examIndex;
  
  // Show class/section/group info in title
  let scopeInfo = exam.class || exam.scope;
  if (exam.section) scopeInfo += `, Section ${exam.section}`;
  if (exam.group) scopeInfo += ` - ${exam.group}`;
  
  title.innerHTML = `Enter Marks — ${exam.name} <span class="badge badge-primary" style="font-size:11px;margin-left:8px;">${scopeInfo}</span> <span class="badge badge-gray" style="font-size:11px;">${studentUsers.length} students</span>`;

  if (studentUsers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="20" style="text-align:center;padding:40px;color:var(--text-muted);">No students found for <strong>${scopeInfo}</strong>. Please check the class/section/group or add students first.</td></tr>';
    thead.innerHTML = '';
    return;
  }

  const subjects = exam.subjects || [];
  thead.innerHTML = '<tr><th>Student</th>'+subjects.map(s=>'<th>'+s+'<br><small style="font-weight:400;font-size:10px;">(/100)</small></th>').join('')+'<th>Total</th><th>%</th><th>Grade</th></tr>';

  tbody.innerHTML = studentUsers.map(st => {
    const existing = savedResults.find(r => r.studentId === st.id && r.examId === exam.id);
    const subjectInputs = subjects.map(sub => {
      const val = existing?.subjects?.[sub] ?? '';
      return '<td><input type="number" min="0" max="100" value="'+val+'" class="form-input marks-input" style="width:70px;padding:4px 8px;text-align:center;" data-subject="'+sub+'" oninput="recalcRow(this)"></td>';
    }).join('');
    return '<tr data-student-id="'+st.id+'" data-student-name="'+st.name+'">'
      + '<td><div class="flex items-center gap-2"><img src="'+(st.avatar||'')+'" class="avatar avatar-xs" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed='+encodeURIComponent(st.name)+'\'"><span class="font-medium text-sm">'+st.name+'</span></div></td>'
      + subjectInputs
      + '<td class="total-cell font-bold">—</td>'
      + '<td class="pct-cell">—</td>'
      + '<td class="grade-cell">—</td>'
      + '</tr>';
  }).join('');

  // Recalc existing rows
  tbody.querySelectorAll('tr').forEach(row => {
    const first = row.querySelector('.marks-input');
    if (first) recalcRowEl(row, subjects);
  });

  panel.scrollIntoView({behavior:'smooth'});
};

function recalcRowEl(row, subjects) {
  const inputs = row.querySelectorAll('.marks-input');
  let total = 0; let filled = 0;
  inputs.forEach(inp => { if (inp.value !== '') { total += parseInt(inp.value)||0; filled++; } });
  const outOf = subjects.length * 100;
  if (filled === 0) { row.querySelector('.total-cell').textContent='"'; row.querySelector('.pct-cell').textContent='"'; row.querySelector('.grade-cell').textContent='"'; return; }
  const pct = (total / outOf * 100).toFixed(1);
  const g = (pct>=80?'A+':pct>=70?'A':pct>=60?'A-':pct>=50?'B':pct>=40?'C':pct>=33?'D':'F');
  row.querySelector('.total-cell').textContent = total+'/'+outOf;
  row.querySelector('.pct-cell').textContent = pct+'%';
  row.querySelector('.grade-cell').innerHTML = `<span class="badge badge-${pct>=60?'success':'danger'}">${g}</span>`;
}

window.recalcRow = function(input) {
  const row = input.closest('tr');
  const exams = _cache.exams;
  const panel = document.getElementById('marksEntryPanel');
  const exam = exams[panel?.dataset?.examIndex];
  if (!exam) return;
  recalcRowEl(row, exam.subjects || []);
};

window.saveMarks = async function() {
  const panel = document.getElementById('marksEntryPanel');
  const examIndex = parseInt(panel?.dataset?.examIndex);
  const exams = _cache.exams;
  const exam = exams[examIndex];
  if (!exam) return;
  const subjects = exam.subjects || [];
  const results = _cache.results;
  const tbody = document.getElementById('marksTableBody');
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const studentId   = row.dataset.studentId;
    const studentName = row.dataset.studentName;
    const subjectMarks = {};
    row.querySelectorAll('.marks-input').forEach(inp => {
      if (inp.value !== '') subjectMarks[inp.dataset.subject] = parseInt(inp.value)||0;
    });
    if (Object.keys(subjectMarks).length === 0) return;
    const total  = Object.values(subjectMarks).reduce((a,b)=>a+b,0);
    const outOf  = subjects.length * 100;
    const pct    = parseFloat((total/outOf*100).toFixed(1));
    const gp     = pct>=80?5.0:pct>=70?4.0:pct>=60?3.5:pct>=50?3.0:pct>=40?2.0:pct>=33?1.0:0.0;
    const grade  = pct>=80?'A+':pct>=70?'A':pct>=60?'A-':pct>=50?'B':pct>=40?'C':pct>=33?'D':'F';
    const entry = {
      id: `${exam.id}_${studentId}`,
      examId: exam.id, exam: exam.name,
      studentId, studentName,
      subjects: subjectMarks,
      total, outOf, percentage: pct,
      gpa: gp, grade, pass: pct >= 33,
      position: 1, publishedAt: new Date().toISOString(),
    };
    const existing = results.findIndex(r => r.examId === exam.id && r.studentId === studentId);
    if (existing >= 0) results[existing] = entry; else results.push(entry);
  });

  // Rank students within this exam
  const examResults = results.filter(r => r.examId === exam.id).sort((a,b)=>b.gpa-a.gpa);
  examResults.forEach((r,i) => { r.position = i+1; });
  localStorage.setItem('gfa_results', JSON.stringify(results));
  await api.saveResults(results.filter(r => r.examId === exam.id));
  showToast('Marks saved! Use "Publish" to make results visible to students.','success');
};

// 
// MESSAGES
// 
function renderAdminMessages() {
  const conversations = _cache.conversations || [];
  const users = _cache.allUsers || [];

  return `
    <div>
      <div style="margin-bottom:var(--space-8);">
        <h2 style="font-size:var(--text-2xl);font-weight:700;margin-bottom:4px;">Messages</h2>
        <p style="color:var(--text-secondary);font-size:var(--text-sm);">View and manage all conversations</p>
      </div>

      <!-- Stats -->
      <div class="grid-3 gap-4 mb-6">
        <div class="card">
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:44px;height:44px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;">
                ${SVG(ICONS.messages, 22, 'var(--primary)')}
              </div>
              <div>
                <div style="font-size:var(--text-2xl);font-weight:900;color:var(--text-primary);">${conversations.length}</div>
                <div style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Total Conversations</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:44px;height:44px;border-radius:12px;background:#eff6ff;display:flex;align-items:center;justify-content:center;">
                ${SVG(ICONS.users2, 22, '#2563eb')}
              </div>
              <div>
                <div style="font-size:var(--text-2xl);font-weight:900;color:var(--text-primary);">${users.filter(u => u.role === 'student').length}</div>
                <div style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Students</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:44px;height:44px;border-radius:12px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;">
                ${SVG(ICONS.teachers, 22, '#059669')}
              </div>
              <div>
                <div style="font-size:var(--text-2xl);font-weight:900;color:var(--text-primary);">${users.filter(u => u.role === 'teacher').length}</div>
                <div style="font-size:var(--text-xs);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Teachers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversations List -->
      <div class="card">
        <div class="card-header">
          <div class="font-semibold">All Conversations</div>
        </div>
        <div class="card-body" style="padding:0;">
          ${conversations.length === 0 ? `
            <div style="text-align:center;padding:var(--space-12);color:var(--text-muted);">
              <div style="margin-bottom:var(--space-4);display:flex;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
              <div style="font-weight:600;margin-bottom:var(--space-2);">No conversations yet</div>
              <div style="font-size:var(--text-sm);">Messages between users will appear here</div>
            </div>
          ` : `
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Participants</th>
                    <th>Last Message</th>
                    <th>Messages</th>
                    <th>Last Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${conversations.map(conv => {
                    const participant1 = users.find(u => u.id === conv.user1) || {};
                    const participant2 = users.find(u => u.id === conv.user2) || {};
                    const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
                    
                    return `
                      <tr>
                        <td>
                          <div style="display:flex;flex-direction:column;gap:4px;">
                            <div style="font-weight:600;font-size:13px;">${participant1.name || 'Unknown'} " ${participant2.name || 'Unknown'}</div>
                            <div style="font-size:11px;color:var(--text-muted);">${participant1.role || ''} & ${participant2.role || ''}</div>
                          </div>
                        </td>
                        <td>
                          <div style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;">
                            ${lastMsg ? lastMsg.text : 'No messages'}
                          </div>
                        </td>
                        <td><span class="badge badge-primary">${conv.messages ? conv.messages.length : 0}</span></td>
                        <td style="font-size:12px;color:var(--text-secondary);">
                          ${lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString() : '-'}
                        </td>
                        <td>
                          <button class="btn btn-sm btn-secondary" onclick="viewConversation('${conv.id}')">View</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

window.viewConversation = function(convId) {
  window.navigate('messages');
  showToast('Opening conversation...', 'info');
};

// 
// ABOUT PAGE EDITOR
// 
function renderAdminAboutPage() {
  const s = _cache.settings;
  const aboutPage = s.aboutPage || {};
  const faqs = aboutPage.faqs || [];

  return `
    <div>
      <div style="margin-bottom:var(--space-8);">
        <h2 style="font-size:var(--text-2xl);font-weight:700;margin-bottom:4px;">About Page Content</h2>
        <p style="color:var(--text-secondary);font-size:var(--text-sm);">Edit all sections displayed on the About page</p>
      </div>

      <!-- Mission, Vision, Values, History -->
      <div class="card" style="margin-bottom:var(--space-6);">
        <div class="card-header"><div class="font-semibold">Core Sections</div></div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Our History</label>
            <textarea id="aboutHistory" class="form-input form-textarea" rows="4" placeholder="School history text...">${aboutPage.history || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Mission Statement</label>
            <textarea id="aboutMission" class="form-input form-textarea" rows="3" placeholder="Mission statement...">${aboutPage.mission || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Vision Statement</label>
            <textarea id="aboutVision" class="form-input form-textarea" rows="3" placeholder="Vision statement...">${aboutPage.vision || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Core Values</label>
            <textarea id="aboutValues" class="form-input form-textarea" rows="3" placeholder="Core values...">${aboutPage.coreValues || ''}</textarea>
          </div>
          <button class="btn btn-primary" onclick="saveAboutSections()">Save Core Sections</button>
        </div>
      </div>

      <!-- FAQs -->
      <div class="card">
        <div class="card-header">
          <div class="font-semibold">Frequently Asked Questions</div>
        </div>
        <div class="card-body">
          <div id="faqsContainer" style="display:flex;flex-direction:column;gap:var(--space-4);margin-bottom:var(--space-4);">
            ${faqs.map((faq, i) => `
              <div class="card" style="background:var(--bg-secondary);">
                <div class="card-body" style="padding:var(--space-4);">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);">
                    <div class="font-semibold text-sm">FAQ ${i + 1}</div>
                    <button class="btn btn-sm" style="background:var(--danger);color:white;" onclick="deleteFAQ(${i})">Delete</button>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Question</label>
                    <input type="text" id="faqQ${i}" class="form-input" value="${faq.question || ''}" placeholder="Enter question...">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Answer</label>
                    <textarea id="faqA${i}" class="form-input form-textarea" rows="3" placeholder="Enter answer...">${faq.answer || ''}</textarea>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary" onclick="addFAQ()">+ Add FAQ</button>
          <button class="btn btn-primary" onclick="saveFAQs()">Save All FAQs</button>
        </div>
      </div>
    </div>
  `;
}

window.saveAboutSections = async function() {
  const history = document.getElementById('aboutHistory').value;
  const mission = document.getElementById('aboutMission').value;
  const vision = document.getElementById('aboutVision').value;
  const coreValues = document.getElementById('aboutValues').value;

  const settings = await api.getSettings();
  settings.aboutPage = settings.aboutPage || {};
  settings.aboutPage.history = history;
  settings.aboutPage.mission = mission;
  settings.aboutPage.vision = vision;
  settings.aboutPage.coreValues = coreValues;

  const res = await api.saveSettings(settings);
  if (res) {
    _cache.settings = settings;
    showToast('About sections saved successfully!', 'success');
  }
};

window.saveFAQs = async function() {
  const settings = await api.getSettings();
  settings.aboutPage = settings.aboutPage || {};
  const existingFAQs = settings.aboutPage.faqs || [];
  
  const faqs = [];
  for (let i = 0; i < existingFAQs.length; i++) {
    const qEl = document.getElementById(`faqQ${i}`);
    const aEl = document.getElementById(`faqA${i}`);
    if (qEl && aEl) {
      faqs.push({
        question: qEl.value,
        answer: aEl.value
      });
    }
  }

  settings.aboutPage.faqs = faqs;
  const res = await api.saveSettings(settings);
  if (res) {
    _cache.settings = settings;
    showToast('FAQs saved successfully!', 'success');
    switchAdminTab('aboutpage');
  }
};

window.addFAQ = async function() {
  const settings = await api.getSettings();
  settings.aboutPage = settings.aboutPage || {};
  settings.aboutPage.faqs = settings.aboutPage.faqs || [];
  settings.aboutPage.faqs.push({ question: '', answer: '' });
  
  const res = await api.saveSettings(settings);
  if (res) {
    _cache.settings = settings;
    switchAdminTab('aboutpage');
    showToast('New FAQ added!', 'success');
  }
};

window.deleteFAQ = async function(index) {
  if (!confirm('Delete this FAQ?')) return;
  
  const settings = await api.getSettings();
  settings.aboutPage = settings.aboutPage || {};
  settings.aboutPage.faqs = settings.aboutPage.faqs || [];
  settings.aboutPage.faqs.splice(index, 1);
  
  const res = await api.saveSettings(settings);
  if (res) {
    _cache.settings = settings;
    switchAdminTab('aboutpage');
    showToast('FAQ deleted!', 'success');
  }
};


function renderAdminSettings() {
  const s = _cache.settings;
  const photoPreviewHtml = s.schoolPhoto
    ? `<div style="position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--border);margin-bottom:8px;">
         <img id="schoolPhotoPreview" src="${s.schoolPhoto}" alt="School Photo" style="width:100%;height:180px;object-fit:cover;display:block;">
         <div style="position:absolute;top:8px;right:8px;">
           <button class="btn btn-danger btn-sm" onclick="removeSchoolPhoto()">Remove</button>
         </div>
       </div>`
    : `<img id="schoolPhotoPreview" src="" alt="" style="display:none;width:100%;height:180px;object-fit:cover;border-radius:12px;border:1px solid var(--border);margin-bottom:8px;">`;

  return `
    <div>
      <h1 style="font-size:22px;font-weight:800;margin-bottom:24px;">School Settings</h1>

      <!-- Row 0: Logo & Branding (NEW) -->
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="font-semibold">Logo & Branding (Navbar)</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:200px 1fr;gap:24px;">
            <!-- Logo Preview -->
            <div>
              <div style="margin-bottom:8px;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;">Logo Preview</div>
              <div style="border:2px dashed var(--border);border-radius:12px;padding:16px;background:var(--bg-secondary);text-align:center;">
                ${s.schoolLogoUrl ? `
                  <img src="${s.schoolLogoUrl}" alt="School Logo" id="logoPreview" style="width:80px;height:80px;border-radius:10px;object-fit:cover;margin:0 auto;display:block;">
                ` : `
                  <div id="logoPreview" style="width:80px;height:80px;border-radius:10px;background:var(--primary);margin:0 auto;display:flex;align-items:center;justify-content:center;">
                    <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
                      <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.92"/>
                      <circle cx="17" cy="19" r="4.5" fill="#93c5fd"/>
                    </svg>
                  </div>
                `}
                <div style="margin-top:12px;font-size:10px;color:var(--text-muted);">Recommended: 512x512px</div>
              </div>
            </div>

            <!-- Branding Fields -->
            <div style="display:flex;flex-direction:column;gap:14px;">
              <div class="form-group">
                <label class="form-label">Logo URL (Direct Image Link)</label>
                <input class="form-input" id="s_logo_url" value="${s.schoolLogoUrl || ''}" placeholder="https://example.com/logo.png" 
                       onchange="updateLogoPreview(this.value)">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Upload your logo to an image host (like Imgur) and paste the direct link here</div>
              </div>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">School Short Name (Navbar)</label>
                  <input class="form-input" id="s_short_name" value="${s.schoolShortName || 'Tiarkhali M.M'}" placeholder="Tiarkhali M.M">
                  <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Main name in navbar</div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Tagline (Navbar)</label>
                  <input class="form-input" id="s_navbar_tagline" value="${s.schoolTagline || 'High School & College'}" placeholder="High School & College">
                  <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Subtitle in navbar</div>
                </div>
              </div>

              <button class="btn btn-primary" onclick="saveBranding()">Save Logo & Branding</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 1: School Info + School Photo side by side -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">

        <div class="card">
          <div class="card-header"><div class="font-semibold">School Information</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
            <div class="form-group"><label class="form-label">School Name</label>
              <input class="form-input" id="s_name" value="${s.name || 'Tiarkhali M.M High School and College'}"></div>
            <div class="form-group"><label class="form-label">Tagline</label>
              <input class="form-input" id="s_tagline" value="${s.tagline || 'Nurturing Excellence, Inspiring Futures'}"></div>
            <div class="form-group"><label class="form-label">Address</label>
              <input class="form-input" id="s_address" value="${s.address || 'Tiarkhali, Bangladesh'}"></div>
            <div class="form-group"><label class="form-label">Phone</label>
              <input class="form-input" id="s_phone" value="${s.phone || '+880 1711-234567'}"></div>
            <div class="form-group"><label class="form-label">Email</label>
              <input class="form-input" id="s_email" value="${s.email || 'info@tiarkhali-mmhs.edu.bd'}"></div>
            <div class="form-group"><label class="form-label">Website</label>
              <input class="form-input" id="s_website" value="${s.website || 'www.tiarkhali-mmhs.edu.bd'}"></div>
            <div class="form-group"><label class="form-label">Founded Year</label>
              <input class="form-input" id="s_founded" value="${s.founded || '1985'}"></div>
            <button class="btn btn-primary" onclick="saveSettings()">Save School Info</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- School Photo -->
          <div class="card">
            <div class="card-header"><div class="font-semibold">School Photo (Hero Section)</div></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
              ${photoPreviewHtml}
              <div style="border:2px dashed var(--border);border-radius:12px;padding:20px;text-align:center;cursor:pointer;background:var(--bg-secondary);"
                   onclick="document.getElementById('schoolPhotoInput').click()">
                <div style="margin-bottom:6px;display:flex;justify-content:center;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${s.schoolPhoto ? 'Replace Photo' : 'Upload School Photo'}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">JPG, PNG " shown in the hero section</div>
              </div>
              <input type="file" id="schoolPhotoInput" accept="image/*" style="display:none;" onchange="previewSchoolPhoto(this)">
              <button class="btn btn-primary" onclick="saveSchoolPhoto()" id="saveSchoolPhotoBtn" style="display:none;">Save Photo</button>
            </div>
          </div>

        <div class="card">
          <div class="card-header"><div class="font-semibold">Academic Year</div></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
              <div class="form-group"><label class="form-label">Current Academic Year</label>
                <input class="form-input" id="s_year" value="${s.year || '2025"2026'}"></div>
              <div class="form-group"><label class="form-label">Current Term</label>
                <select class="form-input form-select" id="s_term">
                  <option ${s.term==='First'?'selected':''}>First</option>
                  <option ${(!s.term||s.term==='Second')?'selected':''}>Second</option>
                  <option ${s.term==='Final'?'selected':''}>Final</option>
                </select></div>
              <button class="btn btn-primary" onclick="saveSettings()">Update</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2: Hero Stats + Facilities + Achievements in 3 columns -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:20px;">
        <div class="card">
          <div class="card-header"><div class="font-semibold">Hero Stats</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            <div class="form-group"><label class="form-label">Total Students</label>
              <input class="form-input" id="s_students" type="number" value="${s.totalStudents || 0}"></div>
            <div class="form-group"><label class="form-label">Total Teachers</label>
              <input class="form-input" id="s_teachers" type="number" value="${s.totalTeachers || 0}"></div>
            <div class="form-group"><label class="form-label">Pass Rate</label>
              <input class="form-input" id="s_passrate" value="${s.passRate || '-'}"></div>
            <button class="btn btn-primary" onclick="saveSettings()">Update Stats</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Facilities</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            <div class="form-group"><label class="form-label">School Facilities (comma-separated)</label>
              <textarea class="form-input" id="s_facilities" rows="5" style="resize:vertical;">${(s.facilities || []).join(', ')}</textarea></div>
            <button class="btn btn-primary" onclick="saveSettings()">Update Facilities</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Achievements</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            <div class="form-group"><label class="form-label">School Achievements (comma-separated)</label>
              <textarea class="form-input" id="s_achievements" rows="5" style="resize:vertical;">${(s.achievements || []).join(', ')}</textarea></div>
            <button class="btn btn-primary" onclick="saveSettings()">Update Achievements</button>
          </div>
        </div>
      </div>

      <!-- Row 3: Batches Config + Classes Config -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
        <div class="card">
          <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;">
            <div class="font-semibold">Batches / Passing Years</div>
            <button class="btn btn-primary btn-sm" onclick="addBatchConfig()">+ Add Batch</button>
          </div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:10px;" id="batchConfigList">
            ${(s.batchConfig || [{id:'B2026',name:'Batch 2026',year:'2026',class:'Class 10'},{id:'B2027',name:'Batch 2027',year:'2027',class:'Class 9'},{id:'B2028',name:'Batch 2028',year:'2028',class:'Class 8'}]).map((b,i) => `
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end;" data-batch-idx="${i}">
                <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Batch Name</label>
                  <input class="form-input bc_name" style="height:32px;font-size:12px;" value="${b.name || ''}"></div>
                <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Class</label>
                  <input class="form-input bc_class" style="height:32px;font-size:12px;" value="${b.class || ''}"></div>
                <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Passing Year</label>
                  <input class="form-input bc_year" style="height:32px;font-size:12px;" value="${b.year || ''}"></div>
                <button onclick="removeBatchConfig(this)" style="height:32px;padding:0 10px;background:var(--danger);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">X</button>
              </div>
            `).join('')}
          </div>
          <div style="padding:12px 16px 16px;">
            <button class="btn btn-primary btn-sm w-full" onclick="saveBatchConfig()">Save Batches</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;">
            <div class="font-semibold">Classes & Subjects</div>
            <button class="btn btn-primary btn-sm" onclick="addClassConfig()">+ Add Class</button>
          </div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:10px;" id="classConfigList">
            ${(s.classConfig || [{name:'Class 6',sections:'A,B,C',subjects:'Bangla,English,Mathematics,Science,Social Studies,Religion'},{name:'Class 7',sections:'A,B,C',subjects:'Bangla,English,Mathematics,Science,Social Studies,Religion,ICT'},{name:'Class 8',sections:'A,B,C',subjects:'Bangla,English,Mathematics,Science,Social Studies,Religion,ICT'},{name:'Class 9',sections:'A,B,C,D',subjects:'Bangla,English,Physics,Chemistry,Biology,Mathematics,ICT,Religion'},{name:'Class 10',sections:'A,B,C,D',subjects:'Bangla,English,Physics,Chemistry,Biology,Mathematics,ICT,Religion'}]).map((c,i) => `
              <div style="border:1px solid var(--border);border-radius:8px;padding:10px;" data-class-idx="${i}">
                <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end;margin-bottom:6px;">
                  <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Class Name</label>
                    <input class="form-input cc_name" style="height:32px;font-size:12px;" value="${c.name || ''}"></div>
                  <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Sections (comma)</label>
                    <input class="form-input cc_sections" style="height:32px;font-size:12px;" value="${c.sections || ''}"></div>
                  <button onclick="removeClassConfig(this)" style="height:32px;padding:0 10px;background:var(--danger);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">X</button>
                </div>
                <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Subjects (comma-separated)</label>
                  <input class="form-input cc_subjects" style="height:32px;font-size:12px;" value="${c.subjects || ''}"></div>
              </div>
            `).join('')}
          </div>
          <div style="padding:12px 16px 16px;">
            <button class="btn btn-primary btn-sm w-full" onclick="saveClassConfig()">Save Classes</button>
          </div>
        </div>
      </div>
        </div>
      </div>
  
      <!-- Leadership Cards Management -->
      <div style="margin-top:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Leadership & Profile Cards</h2>
        <p style="color:var(--text-muted);margin-bottom:20px;">Manage the profile cards displayed on the home page: Principal's Message, President's Message, and Company Profile</p>
        
        <div style="display:flex;flex-direction:column;gap:20px;">
          ${(s.leadershipCards && Array.isArray(s.leadershipCards) && s.leadershipCards.length > 0) ? s.leadershipCards.map((card, index) => `
            <div class="card">
              <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;">
                <div class="font-semibold">Card ${index + 1}: ${card.role ? card.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Unknown'}</div>
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                  <input type="checkbox" ${card.enabled !== false ? 'checked' : ''} onchange="toggleLeadershipCard(${index}, this.checked)" style="width:18px;height:18px;cursor:pointer;">
                  <span style="font-size:13px;color:var(--text-secondary);">Enabled</span>
                </label>
              </div>
              <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <div class="form-group">
                    <label class="form-label">Role ID</label>
                    <input class="form-input" id="lc_${index}_role" value="${card.role || ''}" readonly style="background:var(--bg-secondary);cursor:not-allowed;">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Section Title (e.g., "MESSAGE FROM THE PRINCIPAL")</label>
                    <input class="form-input" id="lc_${index}_title" value="${card.title || ''}">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Heading (e.g., "A Word from Our Leader")</label>
                    <input class="form-input" id="lc_${index}_heading" value="${card.heading || ''}">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Person Name</label>
                    <input class="form-input" id="lc_${index}_name" value="${card.name || ''}" placeholder="Enter name">
                  </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <div class="form-group">
                    <label class="form-label">Designation</label>
                    <input class="form-input" id="lc_${index}_designation" value="${card.designation || ''}" placeholder="Enter designation">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Qualification</label>
                    <input class="form-input" id="lc_${index}_qualification" value="${card.qualification || ''}" placeholder="Enter qualification">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Message</label>
                    <textarea class="form-input" id="lc_${index}_message" rows="4" style="resize:vertical;" placeholder="Enter message">${card.message || ''}</textarea>
                  </div>
                </div>
                <div style="grid-column:1/-1;">
                  <button class="btn btn-primary" onclick="saveLeadershipCard(${index})">Save Card ${index + 1}</button>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="card">
              <div class="card-body text-center text-muted" style="padding:40px;">
                <p>No leadership cards configured yet.</p>
                <p style="margin-top:12px;font-size:14px;">Leadership cards will be initialized automatically on first save.</p>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function _apiBanner(id, warning, details) {
  const bg       = warning ? '#fef3c7' : '#eff6ff';
  const border   = warning ? '#fbbf24' : '#bfdbfe';
  const color    = warning ? '#92400e' : '#1e40af';
  const darkClr  = warning ? '#78350f' : '#1e3a8a';
  const warnIcon = warning ? SVG('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',13,color) : SVG('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',13,color);
  return '<div style="background:'+bg+';border:1px solid '+border+';border-radius:8px;padding:10px 12px;">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">'
    + '<div style="display:flex;align-items:center;gap:7px;font-size:12px;color:'+color+';font-weight:600;">'
    + warnIcon + (warning || 'About this API')
    + '</div>'
    + '<button onclick="toggleApiInfo(\''+id+'\')" id="btn_'+id+'"'
    + ' style="flex-shrink:0;background:none;border:1px solid '+border+';border-radius:6px;padding:3px 9px;font-size:11px;color:'+color+';cursor:pointer;font-weight:600;display:flex;align-items:center;gap:4px;white-space:nowrap;">'
    + SVG('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',11,color)
    + ' Read more</button>'
    + '</div>'
    + '<div id="'+id+'" style="display:none;margin-top:10px;font-size:12px;color:'+darkClr+';line-height:1.8;border-top:1px solid '+border+';padding-top:10px;">'
    + details
    + '</div></div>';
}

function renderAdminApiSettings() {
  const s = _cache.settings;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 style="font-size:22px;font-weight:800;">API Keys</h1>
          <p style="color:var(--text-muted);font-size:13px;margin-top:4px;">Configure third-party integrations. Keys are stored in settings and apply instantly.</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">

        <!-- Universal SMS Gateway -->
        <div class="card">
          <div class="card-header"><div class="font-semibold" style="display:flex;align-items:center;gap:8px;">
            ${SVG('<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 013.62 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.59 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>',16,'var(--primary)')}
            SMS Gateway - OTP Login
            <span class="badge badge-${s.smsApiKey ? 'success' : 'warning'}" style="font-size:10px;">${s.smsApiKey ? 'Active' : 'Not Configured'}</span>
          </div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            ${_apiBanner('info_sms', s.smsApiKey ? 'SMS OTP is enabled. Users will receive verification codes via SMS.' : 'Configure your SMS provider to enable OTP verification.',
              '<strong>What it does:</strong> Sends 6-digit OTP codes via SMS for phone login verification.<br><br>'
              + '<strong>Supported Providers:</strong><br>'
              + '• SMS.net.bd - <code>https://api.sms.net.bd/sendsms</code><br>'
              + '• BulkSMSBD - <code>https://bulksmsbd.net/api/smsapi</code><br>'
              + '• Any custom SMS API with configurable URL<br><br>'
              + '<strong>Who bypasses OTP:</strong> Admin accounts and email logins'
            )}
            
            <div class="form-group">
              <label class="form-label">SMS Provider</label>
              <select class="form-input form-select" id="api_smsProvider" onchange="toggleSmsFields(this.value)">
                <option value="sms.net.bd" ${(s.smsProvider || 'sms.net.bd') === 'sms.net.bd' ? 'selected' : ''}>SMS.net.bd</option>
                <option value="bulksmsbd" ${s.smsProvider === 'bulksmsbd' ? 'selected' : ''}>BulkSMSBD</option>
                <option value="custom" ${s.smsProvider === 'custom' ? 'selected' : ''}>Custom API</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">API Key</label>
              <div style="position:relative;">
                <input class="form-input" id="api_smsKey" type="password" style="font-family:monospace;font-size:12px;padding-right:40px;"
                  value="${s.smsApiKey || ''}" placeholder="Paste your SMS API key">
                <button type="button" onclick="togglePassword('api_smsKey','eye_sms1')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);" id="eye_sms1">${SVG('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',14)}</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">API Endpoint URL <small style="color:var(--text-muted);">(Auto-filled based on provider, editable)</small></label>
              <input class="form-input" id="api_smsUrl" type="text" style="font-family:monospace;font-size:11px;"
                value="${s.smsApiUrl || 'https://api.sms.net.bd/sendsms'}"
                placeholder="https://api.sms.net.bd/sendsms">
            </div>

            <div id="smsCustomUrlHelp" style="display:${s.smsProvider === 'custom' ? 'block' : 'none'};">
              <div style="background:var(--primary-50);border:1px solid var(--primary-200);border-radius:8px;padding:12px;font-size:12px;color:var(--text);">
                <strong>Custom API Placeholders:</strong><br>
                Use these in your URL: <code>{api_key}</code>, <code>{phone}</code>, <code>{message}</code>, <code>{sender_id}</code><br>
                Example: <code>https://api.example.com/send?key={api_key}&to={phone}&text={message}</code>
              </div>
            </div>

            <div id="smsSenderField" style="display:${s.smsProvider === 'bulksmsbd' || s.smsProvider === 'custom' ? 'block' : 'none'};">
              <div class="form-group">
                <label class="form-label">Sender ID <small style="color:var(--text-muted);">(Optional - for BulkSMSBD)</small></label>
                <input class="form-input" id="api_smsSender" type="text" style="font-family:monospace;font-size:12px;"
                  value="${s.smsSenderId || '8809617611019'}" placeholder="8809617611019">
              </div>
            </div>

            <div style="display:flex;gap:8px;">
              <button class="btn btn-primary btn-sm" onclick="saveApiSettings('sms')">Save SMS Config</button>
              <button class="btn btn-secondary btn-sm" onclick="testSmsApi()">Send Test SMS</button>
            </div>
          </div>
        </div>

        <!-- Server URL -->
        <div class="card">
          <div class="card-header"><div class="font-semibold" style="display:flex;align-items:center;gap:8px;">
            ${SVG('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',16,'#6366f1')}
            Server / API Base URL
          </div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            ${_apiBanner('info_server', 'Changing this affects ALL data in production',
              '<strong>What it does:</strong> Every API call - login, student data, notices, results - goes to this URL. Changing it redirects all traffic to a new backend server.<br><br>'
              + '<strong>When to use:</strong><br>'
              + '&bull; You redeployed to a new Render.com / Railway / VPS<br>'
              + '&bull; Your Render service URL changed<br><br>'
              + '<strong>Before switching:</strong><br>'
              + '&bull; Make sure the new server is running and has your data<br>'
              + '&bull; Use "Send Test SMS" to verify after saving<br><br>'
              + '<strong>Note:</strong> Localhost always uses /api regardless of this setting.'
            )}
            <div class="form-group"><label class="form-label">Production API URL</label>
              <input class="form-input" id="api_baseUrl" type="text" style="font-family:monospace;font-size:12px;"
                value="${s.apiBaseUrl || 'https://school-project-qi8m.onrender.com/api'}"></div>
            <button class="btn btn-primary btn-sm" onclick="saveApiSettings('server')">Save Server URL</button>
          </div>
        </div>

        <!-- EmailJS -->
        <div class="card">
          <div class="card-header"><div class="font-semibold" style="display:flex;align-items:center;gap:8px;">
            ${SVG('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',16,'#059669')}
            EmailJS - Password Reset
            <span class="badge badge-success" style="font-size:10px;">Active</span>
          </div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
            ${_apiBanner('info_emailjs', '',
              '<strong>What it does:</strong> Sends a 6-digit password reset code to a user\'s email. The user enters the code to set a new password.<br><br>'
              + '<strong>Free tier:</strong> 200 emails/month - more than enough for a school.<br><br>'
              + '<strong>Where to get IDs:</strong> <a href="https://dashboard.emailjs.com" target="_blank" style="color:var(--primary);">dashboard.emailjs.com</a> - Email Services (Service ID) and Email Templates (Template ID).<br><br>'
              + '<strong>After saving:</strong> Takes effect on the next password reset request - no restart needed.'
            )}
            <div class="form-group"><label class="form-label">Service ID</label>
              <input class="form-input" id="api_ejsService" type="text" style="font-family:monospace;font-size:12px;"
                value="${s.emailjsServiceId || 'service_au1x8wm'}"></div>
            <div class="form-group"><label class="form-label">Template ID</label>
              <input class="form-input" id="api_ejsTemplate" type="text" style="font-family:monospace;font-size:12px;"
                value="${s.emailjsTemplateId || 'template_t9utqmv'}"></div>
            <button class="btn btn-primary btn-sm" onclick="saveApiSettings('emailjs')">Save EmailJS Config</button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderAdminNoticesManager() {
  const notices = _cache.notices;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Notices</h1>
        <button class="btn btn-primary" onclick="showAddNoticeModal()">+ Publish Notice</button>
      </div>

      <div class="card mb-6" id="addNoticeForm" style="display:none;">
        <div class="card-header">
          <div class="font-semibold" id="noticeFormTitle">New Notice</div>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
          <div class="form-group"><label class="form-label">Title *</label>
            <input class="form-input" id="n_title" placeholder="Notice title"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Category</label>
              <select class="form-input form-select" id="n_category">
                <option>General</option><option>Exam</option><option>Holiday</option>
                <option>Scholarship</option><option>Emergency</option><option>Admission</option><option>Results</option><option>Event</option>
              </select></div>
            <div class="form-group"><label class="form-label">Priority</label>
              <select class="form-input form-select" id="n_priority">
                <option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select></div>
          </div>
          <div class="form-group"><label class="form-label">Content *</label>
            <textarea class="form-input" id="n_content" rows="4" placeholder="Notice content..."></textarea></div>
          <input type="hidden" id="n_editIndex" value="">
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveNotice()" id="saveNoticeBtn">Publish Notice</button>
            <button class="btn btn-secondary" onclick="cancelNoticeForm()">Cancel</button>
          </div>
        </div>
      </div>

      ${notices.length === 0
        ? `<div class="card"><div class="card-body text-center text-muted" style="padding:40px;">No notices published yet.</div></div>`
        : `<div class="card"><div class="table-container"><table>
            <thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>${notices.map((n,i) => _noticeRow(n,i)).join('')}</tbody>
          </table></div></div>`
      }
    </div>
  `;
}

function renderAdminEventsManager() {
  const events = _cache.events;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Events</h1>
        <button class="btn btn-primary" onclick="showAddEventForm()">+ Add Event</button>
      </div>

      <!-- Add/Edit Event Form -->
      <div class="card mb-6" id="addEventForm" style="display:none;">
        <div class="card-header">
          <div class="font-semibold" id="eventFormTitle">New Event</div>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
          <div class="form-group"><label class="form-label">Title *</label>
            <input class="form-input" id="ev_title" placeholder="Event title"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Date *</label>
              <input class="form-input" id="ev_date" type="date"></div>
            <div class="form-group"><label class="form-label">Time</label>
              <input class="form-input" id="ev_time" type="time"></div>
            <div class="form-group"><label class="form-label">Category</label>
              <select class="form-input form-select" id="ev_category">
                <option>Academic</option><option>Sports</option><option>Cultural</option>
                <option>Tour</option><option>Farewell</option><option>Reunion</option><option>Other</option>
              </select></div>
          </div>
          <div class="form-group"><label class="form-label">Location</label>
            <input class="form-input" id="ev_location" placeholder="e.g. School Auditorium"></div>
          <div class="form-group"><label class="form-label">Description</label>
            <textarea class="form-input" id="ev_desc" rows="3" placeholder="Event description..."></textarea></div>
          <input type="hidden" id="ev_editIndex" value="">
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveEvent()" id="saveEventBtn">Save Event</button>
            <button class="btn btn-secondary" onclick="cancelEventForm()">Cancel</button>
          </div>
        </div>
      </div>

      ${events.length === 0
        ? `<div class="card"><div class="card-body text-center text-muted" style="padding:40px;">No events added yet.</div></div>`
        : `<div class="card"><div class="table-container"><table>
            <thead><tr><th>Title</th><th>Date</th><th>Category</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>${events.map((e,i) => _eventRow(e,i)).join('')}</tbody>
          </table></div></div>`
      }
    </div>
  `;
}

function renderAdminGallery() {
  const photos = _cache.gallery || [];
  const categories = ['All', 'Annual Function', 'Science Fair', 'Sports', 'Farewell', 'Tour', 'Reunion', 'General'];
  
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Photo Gallery</h1>
        <button class="btn btn-primary" onclick="openUploadPhotoModal()">
          ${SVG('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',14,'white')} Upload Photos
        </button>
      </div>
      
      <!-- Category Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div style="display:flex;gap:8px;flex-wrap:wrap;" id="galleryCategories">
            ${categories.map((cat, idx) => `
              <button class="btn ${idx === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm" 
                      onclick="filterGalleryByCategory('${cat}', this)">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      ${photos.length === 0
        ? `<div class="card">
            <div class="card-body text-center text-muted" style="padding:60px;">
              <div style="margin-bottom:12px;display:flex;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
              <div class="font-semibold" style="font-size:18px;">No photos yet</div>
              <div class="text-sm mt-2 mb-4">Upload photos to showcase school events and activities</div>
              <button class="btn btn-primary" onclick="openUploadPhotoModal()">
                ${SVG('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',14,'white')} Upload First Photo
              </button>
            </div>
          </div>`
        : `<div class="gallery-grid" id="galleryPhotosGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">
            ${photos.map((photo, idx) => `
              <div class="gallery-photo-card" data-category="${photo.category || 'All'}" style="background:var(--card-bg);border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm);transition:transform 0.2s,box-shadow 0.2s;">
                <div style="aspect-ratio:4/3;overflow:hidden;position:relative;background:#f3f4f6;">
                  <img src="${photo.url}" alt="${photo.title}" 
                       style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s;"
                       onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'"
                       onload="this.style.opacity=1"
                       onclick="viewGalleryPhoto(${idx})">
                  <div style="position:absolute;top:8px;right:8px;display:flex;gap:4px;">
                    <button class="btn btn-ghost btn-icon btn-sm" 
                            onclick="event.stopPropagation();deleteGalleryPhoto(${idx},'${photo.title}')"
                            style="background:rgba(0,0,0,0.6);color:white;border:none;"
                            title="Delete">
                      ${SVG('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',16,'white')}
                    </button>
                  </div>
                </div>
                <div style="padding:12px;">
                  <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${photo.title}</div>
                  ${photo.description ? `<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${photo.description}</div>` : ''}
                  <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--text-muted);">
                    <span class="badge badge-primary" style="font-size:10px;">${photo.category || 'General'}</span>
                    <span>${new Date(photo.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`
      }
    </div>
  `;
}

function renderAdminUsers() {
  const allUsers = _cache.users;
  // Pending = not yet active (catches 'pending', and any legacy broken statuses)
  const pending  = allUsers.filter(u => u.status !== 'active' && u.role !== 'admin');
  const active   = allUsers.filter(u => u.status === 'active' && u.role !== 'admin');
  const admins   = allUsers.filter(u => u.role === 'admin');

  return `
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h1 style="font-size:22px;font-weight:800;">Registered Users</h1>
        <span class="badge badge-warning">${pending.length} pending approval</span>
      </div>

      ${pending.length > 0 ? `
      <div class="card mb-6" style="border-color:var(--warning);">
        <div class="card-header" style="background:#fffbeb;">
          <div class="font-semibold" style="color:#92400e;">
            ${SVG('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', 16, '#92400e')}
            Pending Approvals (${pending.length})
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Email</th><th>Phone</th><th>Class</th><th>Registered</th><th>Current Status</th><th>Actions</th></tr></thead>
            <tbody>${pending.map(u => _pendingUserRow(u)).join('')}</tbody>
          </table>
        </div>
      </div>` : `
      <div class="card mb-6" style="border-color:var(--success);">
        <div class="card-body" style="padding:16px;text-align:center;color:var(--success);">
          ${SVG('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', 18, 'var(--success)')}
          All accounts are approved
        </div>
      </div>`}

      <div class="card mb-4">
        <div class="card-header"><div class="font-semibold">Active Users (${active.length})</div></div>
        <div class="table-container">
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Class</th><th>Registered</th><th>Status</th></tr></thead>
            <tbody>${active.map(u => _activeUserRow(u)).join('')}</tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="font-semibold">Administrators (${admins.length})</div></div>
        <div class="table-container">
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Class</th><th>Registered</th><th>Status</th></tr></thead>
            <tbody>${admins.map(u => _activeUserRow(u)).join('')}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.approveUser = async function(id) {
  await auth.approveUser(id);
  showToast('User approved successfully!', 'success');
  await _refreshTab('roles');
};

window.switchAdminTab = async function(tab, btn) {
  adminTab = tab;
  
  // Remove active class from all nav items
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  
  // Add active class to the clicked button OR find and activate the matching nav item
  if (btn) {
    btn.classList.add('active');
  } else {
    // Find the nav item that matches the tab and activate it
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(el => {
      if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${tab}'`)) {
        el.classList.add('active');
      }
    });
  }
  
  await _refreshTab(tab);
};

// ── Batch Config ──
window.addBatchConfig = function() {
  const list = document.getElementById('batchConfigList');
  if (!list) return;
  const idx = list.children.length;
  const row = document.createElement('div');
  row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end;';
  row.dataset.batchIdx = idx;
  row.innerHTML = `
    <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Batch Name</label>
      <input class="form-input bc_name" style="height:32px;font-size:12px;" placeholder="Batch 2029"></div>
    <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Class</label>
      <input class="form-input bc_class" style="height:32px;font-size:12px;" placeholder="Class 7"></div>
    <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Passing Year</label>
      <input class="form-input bc_year" style="height:32px;font-size:12px;" placeholder="2029"></div>
    <button onclick="removeBatchConfig(this)" style="height:32px;padding:0 10px;background:var(--danger);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">X</button>`;
  list.appendChild(row);
};

window.removeBatchConfig = function(btn) {
  btn.closest('[data-batch-idx]')?.remove();
};

window.saveBatchConfig = async function() {
  const rows = document.querySelectorAll('#batchConfigList [data-batch-idx]');
  const batchConfig = Array.from(rows).map((row, i) => ({
    id: 'B' + (row.querySelector('.bc_year')?.value?.trim() || (2026 + i)),
    name: row.querySelector('.bc_name')?.value?.trim() || '',
    class: row.querySelector('.bc_class')?.value?.trim() || '',
    year: row.querySelector('.bc_year')?.value?.trim() || '',
  })).filter(b => b.name);
  const settings = await api.getSettings() || {};
  settings.batchConfig = batchConfig;
  await api.saveSettings(settings);
  _cache.settings = settings;
  showToast('Batches saved! Reload the page to apply to dropdowns.', 'success');
};

// ── Class Config ──
window.addClassConfig = function() {
  const list = document.getElementById('classConfigList');
  if (!list) return;
  const idx = list.children.length;
  const div = document.createElement('div');
  div.style.cssText = 'border:1px solid var(--border);border-radius:8px;padding:10px;';
  div.dataset.classIdx = idx;
  div.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end;margin-bottom:6px;">
      <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Class Name</label>
        <input class="form-input cc_name" style="height:32px;font-size:12px;" placeholder="Class 11"></div>
      <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Sections (comma)</label>
        <input class="form-input cc_sections" style="height:32px;font-size:12px;" placeholder="A,B"></div>
      <button onclick="removeClassConfig(this)" style="height:32px;padding:0 10px;background:var(--danger);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">X</button>
    </div>
    <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Subjects (comma-separated)</label>
      <input class="form-input cc_subjects" style="height:32px;font-size:12px;" placeholder="Bangla,English,Mathematics"></div>`;
  list.appendChild(div);
};

window.removeClassConfig = function(btn) {
  btn.closest('[data-class-idx]')?.remove();
};

window.saveClassConfig = async function() {
  const rows = document.querySelectorAll('#classConfigList [data-class-idx]');
  const classConfig = Array.from(rows).map(row => ({
    name:     row.querySelector('.cc_name')?.value?.trim() || '',
    sections: row.querySelector('.cc_sections')?.value?.trim() || '',
    subjects: row.querySelector('.cc_subjects')?.value?.trim() || '',
  })).filter(c => c.name);
  const settings = await api.getSettings() || {};
  settings.classConfig = classConfig;
  await api.saveSettings(settings);
  _cache.settings = settings;
  showToast('Classes saved! Reload the page to apply to dropdowns.', 'success');
};

window.saveSmsSettings = async function() {
  const key = document.getElementById('s_smsApiKey')?.value?.trim();
  const settings = await api.getSettings() || {};
  settings.smsApiKey = key;
  await api.saveSettings(settings);
  _cache.settings = settings;
  showToast(key ? 'SMS API key saved! SMS will now be sent automatically.' : 'SMS key cleared.', 'success');
  await _refreshTab('settings');
};

window.toggleApiInfo = function(id) {
  const el  = document.getElementById(id);
  const btn = document.getElementById('btn_' + id);
  if (!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.innerHTML = btn.innerHTML.replace(isOpen ? 'Close' : 'Read more', isOpen ? 'Read more' : 'Close');
};

window.toggleServerUrlInfo = window.toggleApiInfo; // backward compat

window.saveApiSettings = async function(type) {
  const settings = await api.getSettings() || {};
  if (type === 'sms') {
    settings.smsProvider = document.getElementById('api_smsProvider')?.value?.trim();
    settings.smsApiKey = document.getElementById('api_smsKey')?.value?.trim();
    settings.smsApiUrl = document.getElementById('api_smsUrl')?.value?.trim();
    settings.smsSenderId = document.getElementById('api_smsSender')?.value?.trim();
    
    // Set default URLs based on provider
    if (settings.smsProvider === 'sms.net.bd' && !settings.smsApiUrl) {
      settings.smsApiUrl = 'https://portal.sms.net.bd/api/v1/send';
    } else if (settings.smsProvider === 'bulksmsbd' && !settings.smsApiUrl) {
      settings.smsApiUrl = 'https://bulksmsbd.net/api/smsapi';
    }
    
    showToast('SMS config saved! Changes apply on next login.', 'success');
  } else if (type === 'server') {
    settings.apiBaseUrl = document.getElementById('api_baseUrl')?.value?.trim();
    showToast('Server URL saved!', 'success');
  } else if (type === 'emailjs') {
    settings.emailjsServiceId  = document.getElementById('api_ejsService')?.value?.trim();
    settings.emailjsTemplateId = document.getElementById('api_ejsTemplate')?.value?.trim();
    showToast('EmailJS config saved!', 'success');
  }
  await api.saveSettings(settings);
  _cache.settings = settings;
  await _refreshTab('api');
};

window.toggleSmsFields = function(provider) {
  const senderField = document.getElementById('smsSenderField');
  const customUrlHelp = document.getElementById('smsCustomUrlHelp');
  const urlInput = document.getElementById('api_smsUrl');
  
  if (provider === 'custom') {
    senderField.style.display = 'block';
    customUrlHelp.style.display = 'block';
    // Don't change URL for custom - let admin define it
  } else if (provider === 'bulksmsbd') {
    senderField.style.display = 'block';
    customUrlHelp.style.display = 'none';
    urlInput.value = 'https://bulksmsbd.net/api/smsapi';
  } else { // sms.net.bd
    senderField.style.display = 'none';
    customUrlHelp.style.display = 'none';
    urlInput.value = 'https://api.sms.net.bd/sendsms';
  }
};

window.testSmsApi = async function() {
  const phone = prompt('Enter a phone number to send a test SMS (e.g. 01XXXXXXXXX):');
  if (!phone) return;
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const base  = isDev ? '/api' : 'https://school-project-qi8m.onrender.com/api';
  showToast('Sending test SMS...', 'info');
  try {
    const res = await fetch(`${base}/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message: 'Tiarkhali M.M School: Test SMS from admin panel. System is working correctly.' }),
    });
    const data = await res.json();
    if (data.demo) {
      showToast('Demo mode " no API key set. Check server console for message.', 'warning');
    } else if (data.ok) {
      showToast('Test SMS sent successfully!', 'success');
    } else {
      showToast('SMS failed: ' + (data.error || 'Unknown error'), 'error');
    }
  } catch (err) {
    showToast('Could not reach server.', 'error');
  }
};

// "" Admin Settings ""
window.saveSettings = async function() {
  const facilitiesText = document.getElementById('s_facilities')?.value || '';
  const achievementsText = document.getElementById('s_achievements')?.value || '';
  
  const existing = await api.getSettings() || {};
  const s = {
    ...existing,
    name:           document.getElementById('s_name')?.value,
    tagline:        document.getElementById('s_tagline')?.value,
    address:        document.getElementById('s_address')?.value,
    phone:          document.getElementById('s_phone')?.value,
    email:          document.getElementById('s_email')?.value,
    website:        document.getElementById('s_website')?.value,
    founded:        document.getElementById('s_founded')?.value,
    year:           document.getElementById('s_year')?.value,
    term:           document.getElementById('s_term')?.value,
    totalStudents:  parseInt(document.getElementById('s_students')?.value) || 0,
    totalTeachers:  parseInt(document.getElementById('s_teachers')?.value) || 0,
    passRate:       document.getElementById('s_passrate')?.value,
    facilities:     facilitiesText.split(',').map(f => f.trim()).filter(f => f),
    achievements:   achievementsText.split(',').map(a => a.trim()).filter(a => a),
  };
  Object.keys(s).forEach(k => s[k] === undefined && delete s[k]);
  await api.saveSettings(s);
  _cache.settings = s;
  showToast('Settings saved successfully!', 'success');
  await _refreshTab('settings');
};

// "" Branding & Logo ""
window.saveBranding = async function() {
  const existing = await api.getSettings() || {};
  const s = {
    ...existing,
    schoolLogoUrl:   document.getElementById('s_logo_url')?.value?.trim() || '',
    schoolShortName: document.getElementById('s_short_name')?.value?.trim() || 'Tiarkhali M.M',
    schoolTagline:   document.getElementById('s_navbar_tagline')?.value?.trim() || 'High School & College',
  };
  
  await api.saveSettings(s);
  _cache.settings = s;
  window._schoolSettings = s; // Update cached settings for navbar
  showToast('Logo & branding saved! Refresh page to see changes in navbar.', 'success');
  await _refreshTab('settings');
  
  // Force navbar refresh
  setTimeout(() => {
    if (typeof render === 'function') render();
  }, 500);
};

window.updateLogoPreview = function(url) {
  const preview = document.getElementById('logoPreview');
  if (!preview) return;
  
  if (!url || !url.trim()) {
    // Show default SVG logo
    preview.innerHTML = `
      <div style="width:80px;height:80px;border-radius:10px;background:var(--primary);margin:0 auto;display:flex;align-items:center;justify-content:center;">
        <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
          <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.92"/>
          <circle cx="17" cy="19" r="4.5" fill="#93c5fd"/>
        </svg>
      </div>
    `;
  } else {
    // Show image
    preview.innerHTML = `<img src="${url}" alt="Logo Preview" style="width:80px;height:80px;border-radius:10px;object-fit:cover;margin:0 auto;display:block;" onerror="this.src='';this.style.display='none';this.parentElement.innerHTML='<div style=\\'color:var(--danger);font-size:11px;\\'>Invalid URL</div>';">`;
  }
};

// "" School Photo ""
window.previewSchoolPhoto = function(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    window._newSchoolPhoto = e.target.result;
    const preview = document.getElementById('schoolPhotoPreview');
    if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
    const btn = document.getElementById('saveSchoolPhotoBtn');
    if (btn) btn.style.display = 'block';
  };
  reader.readAsDataURL(file);
};

window.saveSchoolPhoto = async function() {
  if (!window._newSchoolPhoto) return;
  const settings = await api.getSettings() || {};
  settings.schoolPhoto = window._newSchoolPhoto;
  await api.saveSettings(settings);
  _cache.settings = settings;
  window._newSchoolPhoto = null;
  showToast('School photo saved!', 'success');
  await _refreshTab('settings');
};

window.removeSchoolPhoto = async function() {
  const confirmed = await confirmDialog('Remove the school photo from the home page?', 'Remove Photo');
  if (!confirmed) return;
  const settings = await api.getSettings() || {};
  delete settings.schoolPhoto;
  await api.saveSettings(settings);
  _cache.settings = settings;
  showToast('School photo removed.', 'success');
  await _refreshTab('settings');
};

// "" Leadership Cards Management ""
window.saveLeadershipCard = async function(index) {
  try {
    const settings = _cache.settings;
    
    // Initialize leadershipCards if it doesn't exist
    if (!settings.leadershipCards || !Array.isArray(settings.leadershipCards)) {
      showToast('Leadership cards not initialized', 'error');
      return;
    }
    
    if (!settings.leadershipCards[index]) {
      showToast('Leadership card not found', 'error');
      return;
    }
    
    const card = settings.leadershipCards[index];
    
    // Update all card data
    card.title = document.getElementById(`lc_${index}_title`)?.value || card.title;
    card.heading = document.getElementById(`lc_${index}_heading`)?.value || card.heading;
    card.name = document.getElementById(`lc_${index}_name`)?.value || '';
    card.designation = document.getElementById(`lc_${index}_designation`)?.value || '';
    card.qualification = document.getElementById(`lc_${index}_qualification`)?.value || '';
    card.message = document.getElementById(`lc_${index}_message`)?.value || '';
    
    // Save to backend
    await api.saveSettings(settings);
    showToast(`Card ${index + 1} saved successfully!`, 'success');
    await _refreshTab('settings');
  } catch (error) {
    showToast('Failed to save leadership card', 'error');
  }
};

window.toggleLeadershipCard = async function(index, enabled) {
  try {
    const settings = _cache.settings;
    
    // Initialize leadershipCards if it doesn't exist
    if (!settings.leadershipCards || !Array.isArray(settings.leadershipCards)) {
      showToast('Leadership cards not initialized', 'error');
      return;
    }
    
    if (!settings.leadershipCards[index]) {
      showToast('Leadership card not found', 'error');
      return;
    }
    
    settings.leadershipCards[index].enabled = enabled;
    await api.saveSettings(settings);
    showToast(`Card ${index + 1} ${enabled ? 'enabled' : 'disabled'}`, 'success');
    // Don't refresh to avoid losing form state
  } catch (error) {
    showToast('Failed to toggle leadership card', 'error');
  }
};

// "" Admin Notices ""
window.showAddNoticeModal = function() {
  const form = document.getElementById('addNoticeForm');
  if (!form) return;
  // Reset to "add" mode
  document.getElementById('n_title').value = '';
  document.getElementById('n_content').value = '';
  document.getElementById('n_category').value = 'General';
  document.getElementById('n_priority').value = 'medium';
  document.getElementById('n_editIndex').value = '';
  document.getElementById('noticeFormTitle').textContent = 'New Notice';
  document.getElementById('saveNoticeBtn').textContent = 'Publish Notice';
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.editNotice = function(idx) {
  const notice = _cache.notices[idx];
  if (!notice) return;
  const form = document.getElementById('addNoticeForm');
  if (!form) return;
  document.getElementById('n_title').value = notice.title || '';
  document.getElementById('n_content').value = notice.content || '';
  document.getElementById('n_category').value = notice.category || 'General';
  document.getElementById('n_priority').value = notice.priority || 'medium';
  document.getElementById('n_editIndex').value = idx;
  document.getElementById('noticeFormTitle').textContent = 'Edit Notice';
  document.getElementById('saveNoticeBtn').textContent = 'Update Notice';
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelNoticeForm = function() {
  const form = document.getElementById('addNoticeForm');
  if (form) form.style.display = 'none';
};

window.saveNotice = async function() {
  const title   = document.getElementById('n_title')?.value?.trim();
  const content = document.getElementById('n_content')?.value?.trim();
  if (!title || !content) { showToast('Title and content are required.', 'error'); return; }
  const editIndex = document.getElementById('n_editIndex')?.value;
  const data = {
    title,
    category: document.getElementById('n_category')?.value || 'General',
    priority: document.getElementById('n_priority')?.value || 'medium',
    content,
  };

  if (editIndex !== '') {
    await api.updateNotice(parseInt(editIndex), data);
    showToast('Notice updated!', 'success');
  } else {
    await api.addNotice(data);
    await createNotification('notice', 'New Notice Published', title, 'notices');
    showToast('Notice published!', 'success');
  }

  await _refreshTab('notices');
};

window.deleteNotice = async function(idx) {
  const confirmed = await confirmDialog('Are you sure you want to delete this notice? This action cannot be undone.', 'Delete Notice');
  if (!confirmed) return;
  
  await api.deleteNotice(idx);
  showToast('Notice deleted.', 'success');
  await _refreshTab('notices');
};

// "" Admin Events ""
window.showAddEventForm = function() {
  const form = document.getElementById('addEventForm');
  if (!form) return;
  // Reset to "add" mode
  document.getElementById('ev_title').value = '';
  document.getElementById('ev_date').value = '';
  document.getElementById('ev_time').value = '';
  document.getElementById('ev_category').value = 'Academic';
  document.getElementById('ev_location').value = '';
  document.getElementById('ev_desc').value = '';
  document.getElementById('ev_editIndex').value = '';
  document.getElementById('eventFormTitle').textContent = 'New Event';
  document.getElementById('saveEventBtn').textContent = 'Save Event';
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.editEvent = function(idx) {
  const event = _cache.events[idx];
  if (!event) return;
  const form = document.getElementById('addEventForm');
  if (!form) return;
  document.getElementById('ev_title').value = event.title || '';
  document.getElementById('ev_date').value = event.date || '';
  document.getElementById('ev_time').value = event.time || '';
  document.getElementById('ev_category').value = event.category || 'Academic';
  document.getElementById('ev_location').value = event.location || '';
  document.getElementById('ev_desc').value = event.description || '';
  document.getElementById('ev_editIndex').value = idx;
  document.getElementById('eventFormTitle').textContent = 'Edit Event';
  document.getElementById('saveEventBtn').textContent = 'Update Event';
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
};

window.cancelEventForm = function() {
  const form = document.getElementById('addEventForm');
  if (form) form.style.display = 'none';
};

window.saveEvent = async function() {
  const title = document.getElementById('ev_title')?.value?.trim();
  if (!title) { showToast('Event title is required.', 'error'); return; }
  const editIndex = document.getElementById('ev_editIndex')?.value;
  const data = {
    title,
    date:        document.getElementById('ev_date')?.value,
    time:        document.getElementById('ev_time')?.value,
    category:    document.getElementById('ev_category')?.value || 'Other',
    location:    document.getElementById('ev_location')?.value || '',
    description: document.getElementById('ev_desc')?.value || '',
  };

  if (editIndex !== '') {
    await api.updateEvent(parseInt(editIndex), data);
    showToast('Event updated!', 'success');
  } else {
    await api.addEvent(data);
    await createNotification('event', 'New Event Scheduled', `${title} - ${data.date}`, 'events');
    showToast('Event added!', 'success');
  }

  await _refreshTab('events');
};

window.deleteEvent = async function(idx) {
  const confirmed = await confirmDialog('Are you sure you want to delete this event? This action cannot be undone.', 'Delete Event');
  if (!confirmed) return;
  
  await api.deleteEvent(idx);
  showToast('Event deleted.', 'success');
  await _refreshTab('events');
};

// "" Reveal student password inline ""
window.revealStudentPassword = async function(userId, spanId) {
  const span = document.getElementById(spanId);
  if (!span) return;
  if (span.style.display !== 'none') { span.style.display = 'none'; return; }
  // Fetch password from server (admin only endpoint)
  try {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const base  = isDev ? '/api' : 'https://school-project-qi8m.onrender.com/api';
    const res = await fetch(`${base}/users/${userId}/password`);
    const data = await res.json();
    if (data.password) {
      span.textContent = data.password;
      span.style.display = 'inline';
    } else {
      showToast('No password set for this account.', 'warning');
    }
  } catch {
    showToast('Could not retrieve password.', 'error');
  }
};

// "" Admin User Edit/Delete ""
window.adminEditUser = function(id) {
  const u = _cache.users.find(x => x.id === id);
  if (!u) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:520px;">
      <div class="modal-header" style="padding:14px 20px;">
        <div class="font-semibold" style="font-size:14px;">Edit User " ${u.name}</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:12px;padding:16px 20px;">

        <!-- Avatar + identity row -->
        <div style="display:flex;align-items:center;gap:14px;padding:12px;background:var(--bg-secondary);border-radius:10px;">
          <div style="position:relative;flex-shrink:0;">
            <img id="editUserAvatar" src="${u.avatar}" class="avatar" style="width:60px;height:60px;" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
          </div>
          <div style="flex:1;min-width:0;">
            <div class="font-semibold" style="font-size:14px;">${u.name}</div>
            <div class="text-xs text-muted">${u.id}    ${u.role}</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="changeUserAvatar('${id}')" style="flex-shrink:0;font-size:11px;padding:5px 10px;">
            ${SVG('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',13)} Photo
          </button>
        </div>

        <!-- Name row -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">First Name</label>
            <input id="eu_first" class="form-input" style="height:34px;font-size:13px;" value="${u.firstName||''}"></div>
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Last Name</label>
            <input id="eu_last" class="form-input" style="height:34px;font-size:13px;" value="${u.lastName||''}"></div>
        </div>

        <!-- Email + Phone row -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Email</label>
            <input id="eu_email" class="form-input" style="height:34px;font-size:13px;" value="${u.email}" type="email"></div>
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Phone</label>
            <input id="eu_phone" class="form-input" style="height:34px;font-size:13px;" value="${u.phone||''}"></div>
        </div>

        ${u.role === 'student' ? `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Class</label>
            <input id="eu_class" class="form-input" style="height:34px;font-size:13px;" value="${u.class||''}"></div>
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Section</label>
            <input id="eu_section" class="form-input" style="height:34px;font-size:13px;" value="${u.section||''}"></div>
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Roll</label>
            <input id="eu_roll" class="form-input" style="height:34px;font-size:13px;" value="${u.roll||''}"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Guardian</label>
            <input id="eu_guardian" class="form-input" style="height:34px;font-size:13px;" value="${u.guardian||''}"></div>
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Blood Group</label>
            <input id="eu_blood" class="form-input" style="height:34px;font-size:13px;" value="${u.bloodGroup||''}"></div>
        </div>` : ''}

        ${u.role === 'teacher' || u.role === 'principal' ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Subject</label>
            <input id="eu_subject" class="form-input" style="height:34px;font-size:13px;" value="${u.subject||''}"></div>
          <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Qualification</label>
            <input id="eu_qualification" class="form-input" style="height:34px;font-size:13px;" value="${u.qualification||''}"></div>
        </div>` : ''}

        <div class="form-group" style="margin:0;"><label class="form-label" style="font-size:11px;">Status</label>
          <select id="eu_status" class="form-input form-select" style="height:34px;font-size:13px;">
            <option value="active" ${u.status==='active'?'selected':''}>Active</option>
            <option value="pending" ${u.status==='pending'?'selected':''}>Pending</option>
            <option value="inactive" ${u.status==='inactive'?'selected':''}>Inactive</option>
          </select></div>

        <input type="file" id="editUserAvatarInput" accept="image/*" style="display:none;">
        <div class="flex gap-2 justify-end" style="padding-top:4px;">
          <button class="btn btn-secondary btn-sm" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="adminSaveUser('${id}')">Save Changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
};

window.adminEditUnlinkedStudent = function(id) {
  const u = _cache.users.find(x => x.id === id);
  if (!u || u.role !== 'student') return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="font-semibold">Edit Unlinked Student " ${u.name}</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">
        <div style="padding:12px;background:var(--warning-50);border-radius:8px;border:1px solid var(--warning);margin-bottom:8px;">
          <div style="font-size:13px;color:var(--text);display:flex;align-items:start;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div><strong>Note:</strong> This student hasn't linked their account yet. Only edit basic pre-registration info.</div>
          </div>
        </div>
        <div class="flex items-center gap-3 mb-2">
          <img src="${u.avatar}" class="avatar avatar-lg" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
          <div><div class="font-bold">${u.name}</div><div class="text-xs text-muted">${u.id}  Not Linked</div></div>
        </div>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input id="eus_name" class="form-input" value="${u.name||''}" placeholder="Full name">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Roll Number</label>
            <input id="eus_roll" class="form-input" value="${u.roll||''}" placeholder="Roll number">
          </div>
          <div class="form-group">
            <label class="form-label">Date of Birth</label>
            <input id="eus_birthday" type="date" class="form-input" value="${u.birthday||''}">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Class</label>
            <select id="eus_class" class="form-input form-select">
              <option value="">Select</option>
              <option value="Class 6" ${u.class==='Class 6'?'selected':''}>Class 6</option>
              <option value="Class 7" ${u.class==='Class 7'?'selected':''}>Class 7</option>
              <option value="Class 8" ${u.class==='Class 8'?'selected':''}>Class 8</option>
              <option value="Class 9" ${u.class==='Class 9'?'selected':''}>Class 9</option>
              <option value="Class 10" ${u.class==='Class 10'?'selected':''}>Class 10</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Section</label>
            <select id="eus_section" class="form-input form-select">
              <option value="">Select</option>
              <option value="A" ${u.section==='A'?'selected':''}>A</option>
              <option value="B" ${u.section==='B'?'selected':''}>B</option>
              <option value="C" ${u.section==='C'?'selected':''}>C</option>
              <option value="D" ${u.section==='D'?'selected':''}>D</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Batch</label>
            <select id="eus_batch" class="form-input form-select">
              <option value="">Select</option>
              <option value="B2024" ${u.batch==='B2024'?'selected':''}>2024</option>
              <option value="B2025" ${u.batch==='B2025'?'selected':''}>2025</option>
              <option value="B2026" ${u.batch==='B2026'?'selected':''}>2026</option>
              <option value="B2027" ${u.batch==='B2027'?'selected':''}>2027</option>
              <option value="B2028" ${u.batch==='B2028'?'selected':''}>2028</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Guardian Name</label>
            <input id="eus_guardian" class="form-input" value="${u.guardian||''}" placeholder="Guardian name">
          </div>
          <div class="form-group">
            <label class="form-label">Blood Group</label>
            <select id="eus_blood" class="form-input form-select">
              <option value="">Select</option>
              ${['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg=>`<option ${(u.bloodGroup||'')===bg?'selected':''}>${bg}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input id="eus_phone" class="form-input" value="${u.phone||''}" placeholder="Phone number">
        </div>
        <div class="flex gap-3 justify-end" style="border-top:1px solid var(--border);padding-top:12px;margin-top:8px;">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="adminSaveUnlinkedStudent('${id}')">Save Changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
};

window.adminSaveUnlinkedStudent = async function(id) {
  const get = (elId) => document.getElementById(elId)?.value?.trim();
  const updates = {
    name: get('eus_name'),
    roll: get('eus_roll'),
    birthday: get('eus_birthday'),
    class: get('eus_class'),
    section: get('eus_section'),
    batch: get('eus_batch'),
    guardian: get('eus_guardian'),
    bloodGroup: get('eus_blood'),
    phone: get('eus_phone'),
  };
  
  // Parse name into firstName and lastName
  if (updates.name) {
    const nameParts = updates.name.split(' ');
    updates.firstName = nameParts[0];
    updates.lastName = nameParts.slice(1).join(' ');
  }
  
  // Remove empty values
  Object.keys(updates).forEach(k => !updates[k] && delete updates[k]);
  
  await api.updateUser(id, updates);
  document.querySelector('.modal-overlay')?.remove();
  showToast('Unlinked student info updated successfully!', 'success');
  await _refreshTab(adminTab);
};

window.adminSaveUser = async function(id) {
  const get = (elId) => document.getElementById(elId)?.value?.trim();
  const updates = {
    firstName: get('eu_first'),
    lastName:  get('eu_last'),
    email:     get('eu_email'),
    phone:     get('eu_phone'),
    status:    get('eu_status'),
    class:     get('eu_class'),
    section:   get('eu_section'),
    roll:      get('eu_roll'),
    guardian:  get('eu_guardian'),
    bloodGroup:get('eu_blood'),
    subject:   get('eu_subject'),
    qualification: get('eu_qualification'),
  };
  
  // Include updated avatar if changed
  if (window._editUserNewAvatar) {
    updates.avatar = window._editUserNewAvatar;
    window._editUserNewAvatar = null;
  }
  
  // Rebuild name
  const u = _cache.users.find(x => x.id === id);
  if (u) {
    updates.name = `${updates.firstName||u.firstName} ${updates.lastName||u.lastName}`.trim();
  }
  Object.keys(updates).forEach(k => !updates[k] && delete updates[k]);
  await api.updateUser(id, updates);

  // Update session if editing current user
  const session = auth.getCurrentUser();
  if (session && session.id === id) {
    const newSession = { ...session, ...updates };
    localStorage.setItem('gfa_session', JSON.stringify(newSession));
  }

  document.querySelector('.modal-overlay')?.remove();
  showToast('User updated successfully!', 'success');
  await _refreshTab(adminTab);
};

window.adminDeleteUser = async function(id, name) {
  const confirmed = await confirmDialog(`Delete user "${name}"? This action cannot be undone and will permanently remove all associated data.`, 'Delete User');
  if (!confirmed) return;
  
  await api.deleteUser(id);

  // Log out if deleting current session
  const session = auth.getCurrentUser();
  if (session && session.id === id) auth.logout();

  showToast(`${name} has been deleted.`, 'success');
  await _refreshTab(adminTab);
};

// "" Add Teacher/Staff Functions ""

// Send account credentials via SMS after admin creates an account
async function _sendAccountSms(phone, name, password, role) {
  try {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const base = isDev ? '/api' : 'https://school-project-qi8m.onrender.com/api';
    const msg = `Tiarkhali M.M School: Account created for ${name} (${role}). Phone: ${phone}. Password: ${password}. Login at ${window.location.origin}`;
    await fetch(`${base}/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message: msg }),
    });
  } catch (err) {
    console.warn('[SMS] Could not send account info:', err.message);
  }
}

window.showAddTeacherForm = function() {
  document.getElementById('addTeacherForm').style.display = 'block';
  document.getElementById('teacherForm').reset();
};

window.hideAddTeacherForm = function() {
  document.getElementById('addTeacherForm').style.display = 'none';
};

window.handleAddTeacher = async function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Phone is mandatory
  if (!data.phone || !data.phone.trim()) {
    showToast('Phone number is required to create a teacher account.', 'error');
    return;
  }

  const teacherData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || '',          // email is optional
    phone: data.phone,
    password: data.password,
    role: 'teacher',
    subject: data.subject,
    qualification: data.qualification,
    bloodGroup: data.bloodGroup === 'Select' ? '' : data.bloodGroup,
    avatar: window._adminUploadedPics?.teacher || null,
  };

  const result = await api.register(teacherData);

  if (!result.ok) {
    showToast(result.error || 'Failed to create teacher account', 'error');
    return;
  }

  if (window._adminUploadedPics) window._adminUploadedPics.teacher = null;

  // Send account info via SMS
  await _sendAccountSms(data.phone, `${data.firstName} ${data.lastName}`, data.password, 'Teacher');

  showToast(`Teacher account created! Login: ${data.phone} | Pass: ${data.password}`, 'success');
  hideAddTeacherForm();
  await _refreshTab('teachers');
};

window.showAddStaffForm = function() {
  document.getElementById('addStaffForm').style.display = 'block';
  document.getElementById('staffForm').reset();
};

window.hideAddStaffForm = function() {
  document.getElementById('addStaffForm').style.display = 'none';
};

window.handleAddStaff = async function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Phone is mandatory
  if (!data.phone || !data.phone.trim()) {
    showToast('Phone number is required to create a staff account.', 'error');
    return;
  }

  const staffData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || '',
    phone: data.phone,
    password: data.password,
    role: 'staff',
    position: data.position === 'Select' ? '' : data.position,
    department: data.department === 'Select' ? '' : data.department,
    bloodGroup: data.bloodGroup === 'Select' ? '' : data.bloodGroup,
    avatar: window._adminUploadedPics?.staff || null,
  };

  const result = await api.register(staffData);

  if (!result.ok) {
    showToast(result.error || 'Failed to create staff account', 'error');
    return;
  }

  if (window._adminUploadedPics) window._adminUploadedPics.staff = null;

  await _sendAccountSms(data.phone, `${data.firstName} ${data.lastName}`, data.password, 'Staff');

  showToast(`Staff account created! Login: ${data.phone} | Pass: ${data.password}`, 'success');
  hideAddStaffForm();
  await _refreshTab('staff');
};

// "" Manage Principal Functions ""
window.showEditPrincipalForm = function(id) {
  const form = document.getElementById('editPrincipalForm');
  if (form) {
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }
};

window.cancelPrincipalEdit = function() {
  const form = document.getElementById('editPrincipalForm');
  if (form) form.style.display = 'none';
  window._principalNewAvatar = null;
};

window.previewPrincipalAvatar = function(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    const preview = document.getElementById('ep_avatarPreview');
    if (preview) preview.src = src;
    window._principalNewAvatar = src;
  };
  reader.readAsDataURL(file);
};

window.savePrincipalEdit = async function() {
  const id        = document.getElementById('ep_id')?.value;
  const firstName = document.getElementById('ep_first')?.value?.trim();
  const lastName  = document.getElementById('ep_last')?.value?.trim();
  const email     = document.getElementById('ep_email')?.value?.trim();

  if (!firstName || !lastName) { showToast('First and last name are required.', 'error'); return; }
  if (!email)                  { showToast('Email is required.', 'error'); return; }

  const updates = {
    firstName,
    lastName,
    name:          `${firstName} ${lastName}`.trim(),
    email,
    phone:         document.getElementById('ep_phone')?.value?.trim() || '',
    qualification: document.getElementById('ep_qualification')?.value?.trim() || '',
    bloodGroup:    document.getElementById('ep_blood')?.value || '',
    joiningDate:   document.getElementById('ep_joiningDate')?.value || '',
    experience:    document.getElementById('ep_experience')?.value?.trim() || '',
    bio:           document.getElementById('ep_bio')?.value?.trim() || '',
  };

  if (window._principalNewAvatar) {
    updates.avatar = window._principalNewAvatar;
    window._principalNewAvatar = null;
  }

  // Remove empty fields so we don't overwrite with blanks
  Object.keys(updates).forEach(k => { if (updates[k] === '') delete updates[k]; });

  await api.updateUser(id, updates);

  // Update session if admin is editing their own account (unlikely but safe)
  const session = auth.getCurrentUser();
  if (session && session.id === id) {
    localStorage.setItem('gfa_session', JSON.stringify({ ...session, ...updates }));
  }

  showToast('Principal details updated!', 'success');
  await _refreshTab('principal');
};

window.showCreatePrincipalForm = function() {
  document.getElementById('createPrincipalForm').style.display = 'block';
  document.getElementById('principalForm').reset();
};

window.hideCreatePrincipalForm = function() {
  document.getElementById('createPrincipalForm').style.display = 'none';
};

window.handleCreatePrincipal = async function(e) {
  e.preventDefault();

  // Check if principal already exists
  const existingPrincipal = _cache.users.find(u => u.role === 'principal' && u.status === 'active');
  if (existingPrincipal) {
    showToast('A principal already exists. Please demote them first.', 'error');
    return;
  }

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Phone is mandatory
  if (!data.phone || !data.phone.trim()) {
    showToast('Phone number is required to create a principal account.', 'error');
    return;
  }

  const principalData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || '',
    phone: data.phone,
    password: data.password,
    role: 'principal',
    bloodGroup: data.bloodGroup === 'Select' ? '' : data.bloodGroup,
    avatar: window._adminUploadedPics?.principal || null,
  };

  const result = await api.register(principalData);

  if (!result.ok) {
    showToast(result.error || 'Failed to create principal account', 'error');
    return;
  }

  if (window._adminUploadedPics) window._adminUploadedPics.principal = null;

  await _sendAccountSms(data.phone, `${data.firstName} ${data.lastName}`, data.password, 'Principal');

  showToast(`Principal account created! Login: ${data.phone} | Pass: ${data.password}`, 'success');
  hideCreatePrincipalForm();
  await _refreshTab('principal');
};

window.showPromoteTeacherForm = function() {
  document.getElementById('promoteTeacherForm').style.display = 'block';
  document.getElementById('teacherPreview').innerHTML = '';
};

window.hidePromoteTeacherForm = function() {
  document.getElementById('promoteTeacherForm').style.display = 'none';
};

window.showTeacherPreview = function(teacherId) {
  if (!teacherId) {
    document.getElementById('teacherPreview').innerHTML = '';
    return;
  }
  
  const teacher = _cache.users.find(u => u.id === teacherId);
  if (!teacher) return;
  
  document.getElementById('teacherPreview').innerHTML = `
    <div style="padding:16px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;">
      <div class="flex items-center gap-3">
        <img src="${teacher.avatar}" class="avatar avatar-md" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
        <div>
          <div style="font-weight:700;">${teacher.name}</div>
          <div style="font-size:12px;color:var(--text-muted);">${teacher.email}</div>
          <div style="font-size:11px;color:var(--text-muted);">Subject: ${teacher.subject || 'N/A'}    Qualification: ${teacher.qualification || 'N/A'}</div>
        </div>
      </div>
    </div>
  `;
};

window.handlePromoteTeacher = async function(e) {
  e.preventDefault();
  
  // Check if principal already exists
  const existingPrincipal = _cache.users.find(u => u.role === 'principal' && u.status === 'active');
  if (existingPrincipal) {
    showToast('A principal already exists. Please demote them first.', 'error');
    return;
  }
  
  const formData = new FormData(e.target);
  const teacherId = formData.get('teacherId');
  
  if (!teacherId) {
    showToast('Please select a teacher', 'error');
    return;
  }
  
  const teacher = _cache.users.find(u => u.id === teacherId);
  if (!teacher) {
    showToast('Teacher not found', 'error');
    return;
  }
  
  const confirmed = await confirmDialog(
    `Promote ${teacher.name} to Principal? This will change their role and grant them elevated permissions.`,
    'Promote to Principal'
  );
  
  if (!confirmed) return;
  
  // Update user role and ensure they are active
  await api.updateUser(teacherId, { role: 'principal', status: 'active' });
  
  showToast(`${teacher.name} has been promoted to Principal!`, 'success');
  hidePromoteTeacherForm();
  await _refreshTab('principal');
};

window.demotePrincipal = async function(principalId, principalName) {
  const confirmed = await confirmDialog(
    `Demote ${principalName} back to Teacher role? They will lose principal permissions.`,
    'Demote Principal'
  );
  
  if (!confirmed) return;
  
  // Update user role back to teacher
  await api.updateUser(principalId, { role: 'teacher' });
  
  showToast(`${principalName} has been demoted to Teacher`, 'success');
  await _refreshTab('principal');
};

// "" Batch Management ""
let _batchAchievements = [];

window.addBatchAchievement = function() {
  const input = document.getElementById('b_achievement_input');
  const text = input.value.trim();
  if (!text) return;
  
  _batchAchievements.push(text);
  input.value = '';
  renderBatchAchievements();
};

window.removeBatchAchievement = function(idx) {
  _batchAchievements.splice(idx, 1);
  renderBatchAchievements();
};

function renderBatchAchievements() {
  const container = document.getElementById('b_achievements_list');
  if (!container) return;
  
  if (_batchAchievements.length === 0) {
    container.innerHTML = '<div class="text-sm text-muted" style="padding:8px;background:var(--bg-secondary);border-radius:6px;">No achievements added yet</div>';
    return;
  }
  
  container.innerHTML = _batchAchievements.map((ach, i) => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg-secondary);border-radius:6px;border:1px solid var(--border);">
      <span style="flex:1;font-size:13px;">${ach}</span>
      <button type="button" class="btn btn-ghost btn-icon btn-sm" onclick="removeBatchAchievement(${i})" style="color:var(--danger);">
        ${SVG('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',14,'var(--danger)')}
      </button>
    </div>
  `).join('');
}

window.showNewBatchForm = function() {
  // Clear form
  document.getElementById('b_name').value = '';
  document.getElementById('b_year').value = '';
  document.getElementById('b_teacher').value = '';
  document.getElementById('b_students').value = '';
  document.getElementById('b_desc').value = '';
  document.getElementById('b_editIndex').value = '';
  document.getElementById('b_achievement_input').value = '';
  
  // Clear achievements
  _batchAchievements = [];
  renderBatchAchievements();
  
  // Update title
  const titleEl = document.getElementById('batchFormTitle');
  if (titleEl) titleEl.textContent = 'New Batch';
  
  // Show form
  document.getElementById('addBatchForm').style.display = 'block';
  document.getElementById('addBatchForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.cancelBatchForm = function() {
  // Clear form
  document.getElementById('b_name').value = '';
  document.getElementById('b_year').value = '';
  document.getElementById('b_teacher').value = '';
  document.getElementById('b_students').value = '';
  document.getElementById('b_desc').value = '';
  document.getElementById('b_editIndex').value = '';
  document.getElementById('b_achievement_input').value = '';
  
  // Clear achievements
  _batchAchievements = [];
  
  // Hide form
  document.getElementById('addBatchForm').style.display = 'none';
};

window.saveBatch = async function() {
  const name = document.getElementById('b_name')?.value?.trim();
  const year = document.getElementById('b_year')?.value?.trim();
  const editingIndex = document.getElementById('b_editIndex')?.value;
  
  if (!name || !year) { showToast('Batch name and year are required.', 'error'); return; }
  
  const batchData = {
    name,
    passingYear: parseInt(year),
    classTeacher: document.getElementById('b_teacher')?.value?.trim() || '',
    totalStudents: parseInt(document.getElementById('b_students')?.value) || 0,
    description: document.getElementById('b_desc')?.value?.trim() || '',
    achievements: [..._batchAchievements],
  };
  
  if (editingIndex !== undefined && editingIndex !== '') {
    // Update existing batch
    const idx = parseInt(editingIndex);
    const batches = _cache.batches;
    batches[idx] = {
      ...batches[idx],
      ...batchData,
    };
    await api.updateBatch(idx, batches[idx]);
    showToast('Batch updated!', 'success');
  } else {
    // Create new batch
    await api.addBatch(batchData);
    showToast('Batch created!', 'success');
  }
  
  await _refreshTab('batches');
};

window.editBatch = function(idx) {
  const batch = _cache.batches[idx];
  if (!batch) return;
  
  // Populate form
  document.getElementById('b_name').value = batch.name || '';
  document.getElementById('b_year').value = batch.passingYear || '';
  document.getElementById('b_teacher').value = batch.classTeacher || '';
  document.getElementById('b_students').value = batch.totalStudents || 0;
  document.getElementById('b_desc').value = batch.description || '';
  document.getElementById('b_achievement_input').value = '';
  
  // Load achievements
  _batchAchievements = batch.achievements ? [...batch.achievements] : [];
  renderBatchAchievements();
  
  // Store editing index
  document.getElementById('b_editIndex').value = idx;
  
  // Update title
  const titleEl = document.getElementById('batchFormTitle');
  if (titleEl) titleEl.textContent = 'Edit Batch';
  
  // Show form
  document.getElementById('addBatchForm').style.display = 'block';
  
  // Scroll to form
  document.getElementById('addBatchForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.deleteBatch = async function(idx) {
  const batches = _cache.batches;
  const b = batches[idx];
  
  const confirmed = await confirmDialog(`Delete batch "${b?.name}"? This action cannot be undone.`, 'Delete Batch');
  if (!confirmed) return;
  
  await api.deleteBatch(idx);
  showToast('Batch deleted.', 'success');
  await _refreshTab('batches');
};



// "" Profile Picture Handler for Admin Forms ""
window.adminProfilePicChange = async function(input, previewId, role) {
  const previewImg = document.getElementById(previewId);
  if (!previewImg) return;

  const file = input.files?.[0];
  if (!file) return;

  try {
    const base64 = await handleProfilePictureUpload(input, previewImg);
    
    // Store in global object by role
    if (!window._adminUploadedPics) window._adminUploadedPics = {};
    window._adminUploadedPics[role] = base64;
    
    showToast('Profile picture uploaded! "', 'success');
  } catch (error) {
    showToast(error.message || 'Failed to upload image', 'error');
    input.value = '';
    previewImg.src = getDefaultAvatar();
    
    if (window._adminUploadedPics) window._adminUploadedPics[role] = null;
  }
};


// "" Change User Avatar (Admin Edit) ""
window.changeUserAvatar = async function(userId) {
  const input = document.getElementById('editUserAvatarInput');
  if (!input) return;
  
  input.onchange = async function() {
    const previewImg = document.getElementById('editUserAvatar');
    if (!previewImg) return;

    const file = input.files?.[0];
    if (!file) return;

    try {
      const base64 = await handleProfilePictureUpload(input, previewImg);
      
      // Store in global variable
      window._editUserNewAvatar = base64;
      
      showToast('Profile picture updated! Click "Save Changes" to apply.', 'success');
    } catch (error) {
      if (error.message !== 'Crop cancelled') {
        showToast(error.message || 'Failed to upload image', 'error');
      }
      input.value = '';
      window._editUserNewAvatar = null;
    }
  };
  
  input.click();
};


// 
// GALLERY MANAGEMENT FUNCTIONS
// 

window.openUploadPhotoModal = function() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="font-semibold">Upload Photos</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="max-height:600px;overflow-y:auto;">
        <form id="uploadPhotoForm" onsubmit="handleUploadPhoto(event)">
          <div class="form-group">
            <label class="form-label">Photo(s) *</label>
            <input type="file" id="photoFiles" class="form-input" accept="image/*" multiple required 
                   onchange="previewPhotos(this)">
            <div class="text-xs text-muted mt-1">You can select multiple photos at once</div>
          </div>
          
          <div id="photoPreviewContainer" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;margin-bottom:16px;"></div>
          
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" id="photoTitle" class="form-input" placeholder="e.g., Annual Function 2026" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="photoDescription" class="form-input" rows="3" placeholder="Brief description of the event or photos"></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select id="photoCategory" class="form-input" required>
              <option value="">Select category</option>
              <option value="Annual Function">Annual Function</option>
              <option value="Science Fair">Science Fair</option>
              <option value="Sports">Sports</option>
              <option value="Farewell">Farewell</option>
              <option value="Tour">Tour</option>
              <option value="Reunion">Reunion</option>
              <option value="General">General</option>
            </select>
          </div>
          
          <div class="flex gap-3 mt-4">
            <button type="submit" class="btn btn-primary">
              ${SVG('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',14,'white')} Upload
            </button>
            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.previewPhotos = function(input) {
  const container = document.getElementById('photoPreviewContainer');
  container.innerHTML = '';
  
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const div = document.createElement('div');
        div.style.cssText = 'position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;background:#f3f4f6;';
        div.innerHTML = `
          <img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">
          <div style="position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,0.6);color:white;padding:2px 6px;border-radius:4px;font-size:10px;">${idx + 1}</div>
        `;
        container.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  }
};

window.handleUploadPhoto = async function(e) {
  e.preventDefault();
  
  const files = document.getElementById('photoFiles').files;
  const title = document.getElementById('photoTitle').value.trim();
  const description = document.getElementById('photoDescription').value.trim();
  const category = document.getElementById('photoCategory').value;
  
  if (!files || files.length === 0) {
    showToast('Please select at least one photo', 'error');
    return;
  }
  
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = `Uploading ${files.length} photo(s)...`;
  
  try {
    // Convert files to base64
    const photoPromises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    
    const photoDataUrls = await Promise.all(photoPromises);
    
    // Upload each photo
    for (let i = 0; i < photoDataUrls.length; i++) {
      await api.addGalleryPhoto({
        url: photoDataUrls[i],
        title: files.length > 1 ? `${title} - Photo ${i + 1}` : title,
        description: description,
        category: category,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin'
      });
    }
    
    showToast(`${files.length} photo(s) uploaded successfully!`, 'success');
    document.querySelector('.modal-overlay').remove();
    await _refreshTab('gallery');
  } catch (error) {
    showToast('Failed to upload photos', 'error');
    btn.disabled = false;
    btn.innerHTML = `${SVG('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',14,'white')} Upload`;
  }
};

window.filterGalleryByCategory = function(category, btn) {
  // Update active button
  document.querySelectorAll('#galleryCategories button').forEach(b => {
    b.className = 'btn btn-secondary btn-sm';
  });
  btn.className = 'btn btn-primary btn-sm';
  
  // Filter photos
  const photos = document.querySelectorAll('.gallery-photo-card');
  photos.forEach(photo => {
    if (category === 'All' || photo.dataset.category === category) {
      photo.style.display = 'block';
    } else {
      photo.style.display = 'none';
    }
  });
};

window.viewGalleryPhoto = function(index) {
  const photo = _cache.gallery[index];
  if (!photo) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:900px;">
      <div class="modal-header">
        <div>
          <div class="font-semibold">${photo.title}</div>
          <div class="text-xs text-muted">${photo.category || 'General'}  ${new Date(photo.uploadedAt).toLocaleDateString()}</div>
        </div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="padding:0;">
        <img src="${photo.url}" style="width:100%;height:auto;display:block;background:#000;" alt="${photo.title}">
        ${photo.description ? `<div style="padding:20px;"><p style="color:var(--text-muted);">${photo.description}</p></div>` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" onclick="deleteGalleryPhoto(${index},'${photo.title}');this.closest('.modal-overlay').remove();">
          ${SVG('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',14,'white')} Delete Photo
        </button>
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.deleteGalleryPhoto = async function(index, title) {
  const confirmed = await confirmDialog(`Are you sure you want to delete "${title}"? This action cannot be undone.`, 'Delete Photo');
  if (!confirmed) return;
  
  await api.deleteGalleryPhoto(index);
  showToast('Photo deleted successfully', 'success');
  await _refreshTab('gallery');
};


// ================================================
// ADMIN FILTER FUNCTIONS
// ================================================

// Filter students in admin panel
window.filterAdminStudents = function() {
  const searchQuery = document.getElementById('studentSearch')?.value?.toLowerCase() || '';
  const classFilter = document.getElementById('studentClassFilter')?.value || '';
  const sectionFilter = document.getElementById('studentSectionFilter')?.value || '';
  const statusFilter = document.getElementById('studentStatusFilter')?.value || '';

  const table = document.getElementById('studentsTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 5) return;

    const name = cells[0]?.textContent?.toLowerCase() || '';
    const id = cells[1]?.textContent?.toLowerCase() || '';
    const classText = cells[2]?.textContent || '';
    const statusText = cells[4]?.textContent?.toLowerCase() || '';

    const matchesSearch = !searchQuery || name.includes(searchQuery) || id.includes(searchQuery) || classText.toLowerCase().includes(searchQuery);
    const matchesClass = !classFilter || classText.includes(classFilter);
    const matchesSection = !sectionFilter || classText.includes('Sec ' + sectionFilter);
    const matchesStatus = !statusFilter || statusText.includes(statusFilter);

    const shouldShow = matchesSearch && matchesClass && matchesSection && matchesStatus;
    row.style.display = shouldShow ? '' : 'none';
    if (shouldShow) visibleCount++;
  });

  const countEl = document.getElementById('studentCount');
  if (countEl) countEl.textContent = `${visibleCount} students`;
};

// Filter teachers in admin panel
window.filterAdminTeachers = function() {
  const searchQuery = document.getElementById('teacherSearch')?.value?.toLowerCase() || '';
  const statusFilter = document.getElementById('teacherStatusFilter')?.value || '';

  const table = document.getElementById('teachersTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 5) return;

    const name = cells[0]?.textContent?.toLowerCase() || '';
    const subject = cells[2]?.textContent?.toLowerCase() || '';
    const statusText = cells[4]?.textContent?.toLowerCase() || '';

    const matchesSearch = !searchQuery || name.includes(searchQuery) || subject.includes(searchQuery);
    const matchesStatus = !statusFilter || statusText.includes(statusFilter);

    const shouldShow = matchesSearch && matchesStatus;
    row.style.display = shouldShow ? '' : 'none';
    if (shouldShow) visibleCount++;
  });

  const countEl = document.getElementById('teacherCount');
  if (countEl) countEl.textContent = `${visibleCount} teachers`;
};

// Filter staff in admin panel
window.filterAdminStaff = function() {
  const searchQuery = document.getElementById('staffSearch')?.value?.toLowerCase() || '';
  const deptFilter = document.getElementById('staffDeptFilter')?.value || '';

  const table = document.getElementById('staffTable');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 4) return;

    const name = cells[0]?.textContent?.toLowerCase() || '';
    const position = cells[1]?.textContent?.toLowerCase() || '';
    const department = cells[2]?.textContent || '';

    const matchesSearch = !searchQuery || name.includes(searchQuery) || position.includes(searchQuery);
    const matchesDept = !deptFilter || department === deptFilter;

    const shouldShow = matchesSearch && matchesDept;
    row.style.display = shouldShow ? '' : 'none';
    if (shouldShow) visibleCount++;
  });

  const countEl = document.getElementById('staffCount');
  if (countEl) countEl.textContent = `${visibleCount} staff members`;
};
