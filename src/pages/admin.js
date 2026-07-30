// ================================================
// ADMIN DASHBOARD
// ================================================

import { students, teachers, supportStaff, alumni, batches, notices, events, results } from '../data/sampleData.js';
import * as auth from '../utils/auth.js';
import { api } from '../utils/api.js';

const SVG = (paths, size=18, color='currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const ICONS = {
  dashboard: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
  students:  `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  teachers:  `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
  staff:     `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  alumni:    `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  batches:   `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
  results:   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  gallery:   `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,
  notices:   `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  events:    `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  messages:  `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  admissions:`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,
  roles:     `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  settings:  `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  home:      `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  users2:    `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>`,
};

const ADMIN_NAV = [
  {key:'dashboard',   label:'Dashboard',    icon:'dashboard'},
  {key:'students',    label:'Students',     icon:'students'},
  {key:'teachers',    label:'Teachers',     icon:'teachers'},
  {key:'staff',       label:'Staff',        icon:'staff'},
  {key:'alumni',      label:'Alumni',       icon:'alumni'},
  {key:'batches',     label:'Batches',      icon:'batches'},
  {key:'results',     label:'Results',      icon:'results'},
  {key:'notices',     label:'Notices',      icon:'notices'},
  {key:'events',      label:'Events',       icon:'events'},
  {key:'assignments', label:'Assignments',  icon:'admissions'},
  {key:'messages',    label:'Messages',     icon:'messages'},
  {key:'roles',       label:'Users',        icon:'roles'},
  {key:'settings',    label:'Settings',     icon:'settings'},
];

let adminTab = 'dashboard';

// ── Admin data cache (populated async before rendering) ──
const _cache = {
  users: [],
  notices: [],
  events: [],
  batches: [],
  exams: [],
  results: [],
  settings: {},
};

async function _loadCache() {
  const [users, notices, events, batches, exams, results, settings] = await Promise.all([
    api.getUsers(),
    api.getNotices(),
    api.getEvents(),
    api.getBatches(),
    api.getExams(),
    api.getResults(),
    api.getSettings(),
  ]);
  _cache.users    = users    || [];
  _cache.notices  = notices  || [];
  _cache.events   = events   || [];
  _cache.batches  = batches  || [];
  _cache.exams    = exams    || [];
  _cache.results  = results  || [];
  _cache.settings = settings || {};
}

export async function renderAdminDashboard() {
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
          <img src="${user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}"
               alt="${user?.name || 'Admin'}" class="avatar avatar-sm"
               onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'"
               style="border:2px solid rgba(255,255,255,0.2);">
          <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);">${user?.name || 'Admin'}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:220px 1fr;flex:1;min-height:calc(100vh - 56px);">
        <!-- Admin Sidebar -->
        <div style="background:#1e293b;padding:12px 8px;overflow-y:auto;">
          ${ADMIN_NAV.map(item=>`
            <div class="${item.key===adminTab?'admin-nav-item active':'admin-nav-item'}" onclick="switchAdminTab('${item.key}',this)" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;margin-bottom:2px;color:${item.key===adminTab?'white':'rgba(255,255,255,0.65)'};">
              <span style="display:flex;align-items:center;flex-shrink:0;">${SVG(ICONS[item.icon]||ICONS.dashboard, 16, item.key===adminTab?'white':'rgba(255,255,255,0.65)')}</span>
              ${item.label}
            </div>
          `).join('')}
        </div>

        <!-- Admin Content -->
        <div style="padding:28px;background:var(--bg-secondary);overflow-y:auto;" id="adminContent">
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
    case 'alumni':       return renderAdminAlumni();
    case 'batches':      return renderAdminBatches();
    case 'notices':      return renderAdminNoticesManager();
    case 'events':       return renderAdminEventsManager();
    case 'assignments':  return renderAdminAssignmentsManager();
    case 'results':      return renderAdminResults();
    case 'settings':     return renderAdminSettings();
    case 'roles':        return renderAdminUsers();
    default:             return renderAdminMain();
  }
}

async function _refreshTab(tab) {
  await _loadCache();
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab(tab || adminTab);
}

function renderAdminMain() {
  const allUsers = _cache.users;
  const studentCount = allUsers.filter(u => u.role === 'student' && u.status === 'active').length;
  const teacherCount = allUsers.filter(u => u.role === 'teacher' && u.status === 'active').length;
  const pendingCount = allUsers.filter(u => u.status !== 'active' && u.role !== 'admin').length;
  const S = _cache.settings;
  const noticesCount = _cache.notices.length;
  const eventsCount  = _cache.events.length;
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});


  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 style="font-size:24px;font-weight:800;">Dashboard Overview</h1>
          <div class="text-muted text-sm">${today} · ${S.year||'Academic Year 2025–26'}</div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Report generation coming soon','info')">
          ${SVG('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',14,'white')} Export Report
        </button>
      </div>

      <!-- KPI Grid — live data -->
      <div class="kpi-grid mb-6">
        ${[
          {svg:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`, l:'Active Students',  v:studentCount,         c:'#2563eb', t:pendingCount>0?`${pendingCount} pending approval`:'All approved', up:true},
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
              {l:'Alumni',                 v: allUsers.filter(u=>u.role==='alumni').length,                   c:'var(--accent)'},
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
              {l:'Assignments',        v: JSON.parse(localStorage.getItem('gfa_assignments')||'[]').length},
              {l:'Notifications Sent', v: JSON.parse(localStorage.getItem('gfa_notifications')||'[]').length},
            ].map(s=>`
              <div class="flex items-center justify-between mb-3 pb-3 border-b" style="border-color:var(--border);">
                <span class="text-sm text-secondary">${s.l}</span>
                <span class="font-bold" style="color:var(--primary);">${s.v}</span>
              </div>
            `).join('')}
            <div style="margin-top:8px;">
              <button class="btn btn-secondary w-full btn-sm" onclick="switchAdminTab('settings',null)">Manage School Settings →</button>
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
            <button class="btn btn-warning btn-sm" onclick="switchAdminTab('roles',null)">Review Now →</button>
          </div>
        </div>
      </div>` : ''}
    </div>
  `;
}

function _studentRow(s) {
  const approveBtn = s.status==='pending' ? '<button class="btn btn-success btn-sm" onclick="approveUser(\''+s.id+'\')">Approve</button>' : '';
  const statusBadge = s.status==='active'?'success':s.status==='pending'?'warning':'danger';
  return '<tr>'
    + '<td><div class="flex items-center gap-3"><img src="'+s.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed=default\'"><div><div class="font-semibold text-sm">'+s.name+'</div><div class="text-xs text-muted">'+s.email+'</div></div></div></td>'
    + '<td style="font-family:monospace;font-size:12px;">'+s.id+'</td>'
    + '<td>'+(s.class||'—')+' '+(s.section?'· '+s.section:'')+'</td>'
    + '<td><span class="badge badge-'+statusBadge+'">'+s.status+'</span></td>'
    + '<td style="font-size:12px;">'+new Date(s.createdAt).toLocaleDateString()+'</td>'
    + '<td><div style="display:flex;gap:4px;">'+approveBtn+_userActions(s.id,s.name)+'</div></td>'
    + '</tr>';
}

function renderAdminStudents() {
  const allUsers = _cache.users;
  const studentUsers = allUsers.filter(u => u.role === 'student');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Students</h1>
        <div class="flex gap-3">
          <button class="btn btn-secondary" onclick="showToast('CSV export coming soon','info')">
            ${SVG('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',14)} Export
          </button>
        </div>
      </div>
      <div class="card">
        ${studentUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">No students registered yet.</div>`
          : `<div class="table-container"><table>
            <thead><tr><th>Student</th><th>ID</th><th>Class</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>${studentUsers.map(s => _studentRow(s)).join('')}</tbody>
          </table></div>`
        }
      </div>
    </div>
  `;
}

function _alumniRow(a) {
  const statusBadge = a.status==='active'?'success':a.status==='pending'?'warning':'danger';
  return '<tr>'
    + '<td><div class="flex items-center gap-3"><img src="'+a.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed=default\'"><div><div class="font-semibold text-sm">'+a.name+'</div><div class="text-xs text-muted">'+a.email+'</div></div></div></td>'
    + '<td style="font-family:monospace;font-size:12px;">'+a.id+'</td>'
    + '<td>'+(a.graduationYear||'—')+'</td>'
    + '<td>'+(a.profession||'—')+'</td>'
    + '<td><span class="badge badge-'+statusBadge+'">'+a.status+'</span></td>'
    + '<td><div style="display:flex;gap:4px;">'+_approveBtn(a.id,a.status)+_userActions(a.id,a.name)+'</div></td>'
    + '</tr>';
}



function _pendingUserRow(u) {
  const approveIcon = SVG('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', 13, 'white');
  const roleBadge = u.role==='teacher'?'purple':u.role==='alumni'?'success':u.role==='staff'?'gray':'primary';
  return '<tr>'
    + '<td><div style="display:flex;align-items:center;gap:10px;"><img src="'+u.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed=default\'"><div><div class="font-semibold text-sm">'+u.name+'</div><div class="text-xs text-muted">'+u.id+'</div></div></div></td>'
    + '<td><span class="badge badge-'+roleBadge+'" style="text-transform:capitalize;">'+u.role+'</span></td>'
    + '<td style="font-size:12px;">'+u.email+'</td>'
    + '<td style="font-size:12px;">'+(u.phone||'—')+'</td>'
    + '<td>'+(u.class||'—')+' '+(u.section?'· '+u.section:'')+'</td>'
    + '<td style="font-size:12px;">'+new Date(u.createdAt).toLocaleDateString()+'</td>'
    + '<td><span class="badge badge-warning">'+u.status+'</span></td>'
    + '<td><div style="display:flex;gap:6px;"><button class="btn btn-success btn-sm" onclick="approveUser(\''+u.id+'\')">'+approveIcon+' Approve</button>'
    + '<button class="btn btn-danger btn-sm" onclick="adminDeleteUser(\''+u.id+'\',\''+u.name+'\')">Delete</button></div></td>'
    + '</tr>';
}

function _activeUserRow(u) {
  const roleBadge = u.role==='admin'?'danger':u.role==='teacher'?'purple':'primary';
  return '<tr>'
    + '<td><div style="display:flex;align-items:center;gap:10px;"><img src="'+u.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed=default\'"><div><div class="font-semibold text-sm">'+u.name+'</div><div class="text-xs text-muted">'+u.id+'</div></div></div></td>'
    + '<td style="font-size:12px;">'+u.email+'</td>'
    + '<td><span class="badge badge-'+roleBadge+'" style="text-transform:capitalize;">'+u.role+'</span></td>'
    + '<td>'+(u.class||'—')+' '+(u.section?'· '+u.section:'')+'</td>'
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
    + '</tr>';
}

function _noticeRow(n, i) {
  const priorityBadge = n.priority==='urgent'?'danger':n.priority==='high'?'warning':'gray';
  return '<tr>'
    + '<td><div class="font-medium">'+n.title+'</div></td>'
    + '<td><span class="badge badge-primary">'+n.category+'</span></td>'
    + '<td><span class="badge badge-'+priorityBadge+'">'+n.priority+'</span></td>'
    + '<td>'+n.date+'</td>'
    + '<td><button class="btn btn-danger btn-sm" onclick="deleteNotice('+i+')">Delete</button></td>'
    + '</tr>';
}

function _eventRow(e, i) {
  return '<tr>'
    + '<td><div class="font-medium">'+e.title+'</div></td>'
    + '<td>'+e.date+'</td>'
    + '<td><span class="badge badge-primary">'+e.category+'</span></td>'
    + '<td>'+e.location+'</td>'
    + '<td><button class="btn btn-danger btn-sm" onclick="deleteEvent('+i+')">Delete</button></td>'
    + '</tr>';
}

function _assignmentRow(a, i) {
  return '<tr>'
    + '<td><div class="font-medium">'+a.title+'</div></td>'
    + '<td>'+a.subject+'</td>'
    + '<td>'+a.teacher+'</td>'
    + '<td>'+(a.dueDate||'—')+'</td>'
    + '<td>'+(a.class||'All')+'</td>'
    + '<td><button class="btn btn-danger btn-sm" onclick="deleteAssignment('+i+')">Delete</button></td>'
    + '</tr>';
}

function _examCard(e, i) {
  const borderColor = e.status==='Published'?'var(--success)':e.status==='Draft'?'var(--warning)':'var(--primary)';
  const badgeClass  = e.status==='Published'?'success':e.status==='Draft'?'warning':'primary';
  const actionBtn   = e.status !== 'Published'
    ? '<button class="btn btn-success btn-sm" onclick="publishExam('+i+')">Publish</button>'
    : '<button class="btn btn-ghost btn-sm" onclick="unpublishExam('+i+')">Unpublish</button>';
  return '<div class="card" style="border-left:4px solid '+borderColor+';">'
    + '<div class="card-body" style="padding:16px 20px;">'
    + '<div class="flex items-center gap-4">'
    + '<div style="flex:1;"><div class="font-semibold">'+e.name+'</div><div class="text-xs text-muted">'+(e.scope||'')+' · '+(e.date||'')+' · Subjects: '+((e.subjects||[]).join(', '))+'</div></div>'
    + '<span class="badge badge-'+badgeClass+'">'+e.status+'</span>'
    + '<div class="flex gap-2"><button class="btn btn-secondary btn-sm" onclick="openMarksEntry('+i+')">Enter Marks</button>'+actionBtn+'<button class="btn btn-danger btn-sm" onclick="deleteExam('+i+')">Delete</button></div>'
    + '</div></div></div>';
}

function _batchCard(b, i) {
  return '<div class="card">'
    + '<div class="card-body">'
    + '<div class="flex items-center justify-between mb-3">'
    + '<div><div class="font-bold" style="font-size:18px;">'+b.name+'</div><div class="text-xs text-muted">Passing Year: '+b.passingYear+'</div></div>'
    + '<span class="badge badge-primary">'+(b.totalStudents||0)+' students</span>'
    + '</div>'
    + '<p class="text-sm text-secondary mb-3">'+(b.description||'')+'</p>'
    + '<div class="text-xs text-muted mb-4">Class Teacher: '+(b.classTeacher||'—')+'</div>'
    + '<div class="flex gap-2 border-t border" style="padding-top:12px;">'
    + '<button class="btn btn-danger btn-sm" onclick="deleteBatch('+i+')">Delete</button>'
    + '</div></div></div>';
}

function _userActions(id, name) {
  return '<button class="btn btn-ghost btn-icon btn-sm" onclick="adminEditUser(\''+id+'\')" title="Edit">'+SVG('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',14)+'</button>'
    + '<button class="btn btn-ghost btn-icon btn-sm" onclick="adminDeleteUser(\''+id+'\',\''+name+'\')" title="Delete" style="color:var(--danger);">'+SVG('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',14,'var(--danger)')+'</button>';
}
function _approveBtn(id, status) {
  return status==='pending' ? '<button class="btn btn-success btn-sm" onclick="approveUser(\''+id+'\')">Approve</button>' : '';
}

function renderAdminTeachers() {
  const allUsers = _cache.users;
  const teacherUsers = allUsers.filter(u => u.role === 'teacher');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Teachers</h1>
      </div>
      <div class="card">
        ${teacherUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">No teachers registered yet.</div>`
          : `<div class="table-container"><table>
            <thead><tr><th>Teacher</th><th>ID</th><th>Subject</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>${teacherUsers.map(t =>
              '<tr>'
              + '<td><div class="flex items-center gap-3"><img src="'+t.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed=default\'"><div><div class="font-semibold text-sm">'+t.name+'</div><div class="text-xs text-muted">'+t.email+'</div></div></div></td>'
              + '<td style="font-family:monospace;font-size:12px;">'+t.id+'</td>'
              + '<td><span class="badge badge-primary">'+(t.subject||'—')+'</span></td>'
              + '<td><span class="badge badge-'+(t.status==='active'?'success':t.status==='pending'?'warning':'gray')+'">'+t.status+'</span></td>'
              + '<td style="font-size:12px;">'+new Date(t.createdAt).toLocaleDateString()+'</td>'
              + '<td><div style="display:flex;gap:4px;">'+_approveBtn(t.id,t.status)+_userActions(t.id,t.name)+'</div></td>'
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
  const staffUsers = allUsers.filter(u => u.role === 'staff');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Support Staff</h1>
      </div>
      <div class="card">
        ${staffUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">No staff registered yet.</div>`
          : `<div class="table-container"><table>
            <thead><tr><th>Name</th><th>ID</th><th>Position</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${staffUsers.map(s =>
              '<tr>'
              + '<td><div class="flex items-center gap-3"><img src="'+s.avatar+'" class="avatar avatar-sm" onerror="this.src=\'https://api.dicebear.com/7.x/avataaars/svg?seed=default\'"><div class="font-semibold text-sm">'+s.name+'</div></div></td>'
              + '<td style="font-family:monospace;font-size:12px;">'+s.id+'</td>'
              + '<td>'+(s.position||'—')+'</td>'
              + '<td>'+(s.department||'—')+'</td>'
              + '<td><span class="badge badge-'+(s.status==='active'?'success':'warning')+'">'+s.status+'</span></td>'
              + '<td><div style="display:flex;gap:4px;">'+_approveBtn(s.id,s.status)+_userActions(s.id,s.name)+'</div></td>'
              + '</tr>'
            ).join('')}</tbody>
          </table></div>`
        }
      </div>
    </div>
  `;
}
function renderAdminAlumni() {
  const allUsers = _cache.users;
  const alumniUsers = allUsers.filter(u => u.role === 'alumni');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Alumni</h1>
      </div>
      <div class="card">
        ${alumniUsers.length === 0
          ? `<div class="card-body text-center text-muted" style="padding:60px;">No alumni registered yet.</div>`
          : `<div class="table-container"><table>
            <thead><tr><th>Name</th><th>ID</th><th>Graduation Year</th><th>Profession</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${alumniUsers.map(a => _alumniRow(a)).join('')}</tbody>
          </table></div>`
        }
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
        <button class="btn btn-primary" onclick="document.getElementById('addBatchForm').style.display=document.getElementById('addBatchForm').style.display==='none'?'block':'none'">+ Create Batch</button>
      </div>

      <!-- Create Batch Form -->
      <div class="card mb-6" id="addBatchForm" style="display:none;">
        <div class="card-header"><div class="font-semibold">New Batch</div></div>
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
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveBatch()">Create Batch</button>
            <button class="btn btn-secondary" onclick="document.getElementById('addBatchForm').style.display='none'">Cancel</button>
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
  const studentUsers = allUsers.filter(u => u.role === 'student' && u.status === 'active');
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
            <div class="form-group"><label class="form-label">Class/Scope</label>
              <input class="form-input" id="ex_scope" placeholder="e.g. Class 9–10, All Sections"></div>
            <div class="form-group"><label class="form-label">Subjects (comma separated)</label>
              <input class="form-input" id="ex_subjects" placeholder="e.g. Bangla,English,Math,Science"></div>
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
            <thead><tr><th>Student</th><th>Exam</th><th>Total</th><th>%</th><th>Grade</th><th>GPA</th></tr></thead>
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
  const scope    = document.getElementById('ex_scope').value.trim();
  const subjects = document.getElementById('ex_subjects').value.split(',').map(s=>s.trim()).filter(Boolean);
  if (!name) { showToast('Exam name is required','error'); return; }
  await api.addExam({ name, date, scope, subjects });
  showToast('Exam created!','success');
  await _refreshTab('results');
};

window.deleteExam = async function(i) {
  if (!confirm('Delete this exam and all its results?')) return;
  await api.deleteExam(i);
  showToast('Exam deleted','info');
  await _refreshTab('results');
};

window.publishExam = async function(i) {
  await api.updateExam(i, { status: 'Published' });
  showToast('Results published! Students can now view them.','success');
  await _refreshTab('results');
};

window.unpublishExam = async function(i) {
  await api.updateExam(i, { status: 'Draft' });
  showToast('Results unpublished','info');
  await _refreshTab('results');
};

window.openMarksEntry = function(examIndex) {
  const exams = _cache.exams;
  const exam = exams[examIndex];
  if (!exam) return;
  const allUsers = _cache.users;
  const studentUsers = allUsers.filter(u => u.role === 'student' && u.status === 'active');
  const savedResults = _cache.results;

  const panel = document.getElementById('marksEntryPanel');
  const title = document.getElementById('marksEntryTitle');
  const thead = document.getElementById('marksTableHead');
  const tbody = document.getElementById('marksTableBody');
  if (!panel || !thead || !tbody) return;

  panel.style.display = 'block';
  panel.dataset.examIndex = examIndex;
  title.textContent = `Enter Marks — ${exam.name}`;

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
  if (filled === 0) { row.querySelector('.total-cell').textContent='—'; row.querySelector('.pct-cell').textContent='—'; row.querySelector('.grade-cell').textContent='—'; return; }
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


function renderAdminSettings() {
  const s = _cache.settings;
  return `
    <div>
      <h1 style="font-size:22px;font-weight:800;margin-bottom:24px;">Website Settings</h1>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">

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
            <div class="form-group"><label class="form-label">Principal Name</label>
              <input class="form-input" id="s_principal" value="${s.principal || ''}"></div>
            <div class="form-group"><label class="form-label">Principal's Message</label>
              <textarea class="form-input" id="s_message" rows="4" style="resize:vertical;">${s.message || ''}</textarea></div>
            <button class="btn btn-primary" onclick="saveSettings()">Save School Info</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="card">
            <div class="card-header"><div class="font-semibold">Academic Year</div></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
              <div class="form-group"><label class="form-label">Current Academic Year</label>
                <input class="form-input" id="s_year" value="${s.year || '2025–2026'}"></div>
              <div class="form-group"><label class="form-label">Current Term</label>
                <select class="form-input form-select" id="s_term">
                  <option ${s.term==='First'?'selected':''}>First Term</option>
                  <option ${(!s.term||s.term==='Second')?'selected':''}>Second Term</option>
                  <option ${s.term==='Final'?'selected':''}>Final Term</option>
                </select></div>
              <button class="btn btn-primary" onclick="saveSettings()">Update</button>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><div class="font-semibold">Hero Stats</div></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
              <div class="form-group"><label class="form-label">Total Students</label>
                <input class="form-input" id="s_students" type="number" value="${s.totalStudents || 0}"></div>
              <div class="form-group"><label class="form-label">Total Teachers</label>
                <input class="form-input" id="s_teachers" type="number" value="${s.totalTeachers || 0}"></div>
              <div class="form-group"><label class="form-label">Total Alumni</label>
                <input class="form-input" id="s_alumni" type="number" value="${s.totalAlumni || 0}"></div>
              <div class="form-group"><label class="form-label">Pass Rate</label>
                <input class="form-input" id="s_passrate" value="${s.passRate || '—'}"></div>
              <button class="btn btn-primary" onclick="saveSettings()">Update Stats</button>
            </div>
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

      <!-- Add Notice Form -->
      <div class="card mb-6" id="addNoticeForm" style="display:none;">
        <div class="card-header"><div class="font-semibold">New Notice</div></div>
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
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveNotice()">Publish Notice</button>
            <button class="btn btn-secondary" onclick="document.getElementById('addNoticeForm').style.display='none'">Cancel</button>
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

      <div class="card mb-6" id="addEventForm" style="display:none;">
        <div class="card-header"><div class="font-semibold">New Event</div></div>
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
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveEvent()">Save Event</button>
            <button class="btn btn-secondary" onclick="document.getElementById('addEventForm').style.display='none'">Cancel</button>
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

function renderAdminAssignmentsManager() {
  const assignments = (JSON.parse(localStorage.getItem('gfa_assignments')||'[]'));
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Assignments</h1>
        <button class="btn btn-primary" onclick="showAddAssignmentForm()">+ Add Assignment</button>
      </div>

      <div class="card mb-6" id="addAssignmentForm" style="display:none;">
        <div class="card-header"><div class="font-semibold">New Assignment</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px;">
          <div class="form-group"><label class="form-label">Title *</label>
            <input class="form-input" id="as_title" placeholder="Assignment title"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Subject *</label>
              <input class="form-input" id="as_subject" placeholder="e.g. Mathematics"></div>
            <div class="form-group"><label class="form-label">Teacher</label>
              <input class="form-input" id="as_teacher" placeholder="Teacher name"></div>
            <div class="form-group"><label class="form-label">Due Date</label>
              <input class="form-input" id="as_due" type="date"></div>
          </div>
          <div class="form-group"><label class="form-label">Class (optional)</label>
            <select class="form-input form-select" id="as_class">
              <option value="">All Classes</option>
              <option>Class 6</option><option>Class 7</option><option>Class 8</option>
              <option>Class 9</option><option>Class 10</option>
            </select></div>
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="saveAssignment()">Save Assignment</button>
            <button class="btn btn-secondary" onclick="document.getElementById('addAssignmentForm').style.display='none'">Cancel</button>
          </div>
        </div>
      </div>

      ${assignments.length === 0
        ? `<div class="card"><div class="card-body text-center text-muted" style="padding:40px;">No assignments added yet.</div></div>`
        : `<div class="card"><div class="table-container"><table>
            <thead><tr><th>Title</th><th>Subject</th><th>Teacher</th><th>Due Date</th><th>Class</th><th>Actions</th></tr></thead>
            <tbody>${assignments.map((a,i) => _assignmentRow(a,i)).join('')}</tbody>
          </table></div></div>`
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
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
  await _refreshTab(tab);
};

// ── Admin Settings ──
window.saveSettings = async function() {
  const s = {
    name:          document.getElementById('s_name')?.value,
    tagline:       document.getElementById('s_tagline')?.value,
    address:       document.getElementById('s_address')?.value,
    phone:         document.getElementById('s_phone')?.value,
    email:         document.getElementById('s_email')?.value,
    website:       document.getElementById('s_website')?.value,
    founded:       document.getElementById('s_founded')?.value,
    principal:     document.getElementById('s_principal')?.value,
    message:       document.getElementById('s_message')?.value,
    year:          document.getElementById('s_year')?.value,
    term:          document.getElementById('s_term')?.value,
    totalStudents: document.getElementById('s_students')?.value,
    totalTeachers: document.getElementById('s_teachers')?.value,
    totalAlumni:   document.getElementById('s_alumni')?.value,
    passRate:      document.getElementById('s_passrate')?.value,
  };
  Object.keys(s).forEach(k => s[k] === undefined && delete s[k]);
  await api.saveSettings(s);
  showToast('Settings saved successfully!', 'success');
};

// ── Admin Notices ──
window.showAddNoticeModal = function() {
  const form = document.getElementById('addNoticeForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.saveNotice = async function() {
  const title   = document.getElementById('n_title')?.value?.trim();
  const content = document.getElementById('n_content')?.value?.trim();
  if (!title || !content) { showToast('Title and content are required.', 'error'); return; }
  await api.addNotice({
    title,
    category: document.getElementById('n_category')?.value || 'General',
    priority: document.getElementById('n_priority')?.value || 'medium',
    content,
  });
  showToast('Notice published!', 'success');
  await _refreshTab('notices');
};

window.deleteNotice = async function(idx) {
  await api.deleteNotice(idx);
  showToast('Notice deleted.', 'success');
  await _refreshTab('notices');
};

// ── Admin Events ──
window.showAddEventForm = function() {
  const form = document.getElementById('addEventForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.saveEvent = async function() {
  const title = document.getElementById('ev_title')?.value?.trim();
  if (!title) { showToast('Event title is required.', 'error'); return; }
  await api.addEvent({
    title,
    date:     document.getElementById('ev_date')?.value,
    time:     document.getElementById('ev_time')?.value,
    category: document.getElementById('ev_category')?.value || 'Other',
    location: document.getElementById('ev_location')?.value || '',
    description: document.getElementById('ev_desc')?.value || '',
  });
  showToast('Event added!', 'success');
  await _refreshTab('events');
};

window.deleteEvent = async function(idx) {
  await api.deleteEvent(idx);
  showToast('Event deleted.', 'success');
  await _refreshTab('events');
};

// ── Admin Assignments (still localStorage — no server endpoint yet) ──
window.showAddAssignmentForm = function() {
  const form = document.getElementById('addAssignmentForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.saveAssignment = function() {
  const title = document.getElementById('as_title')?.value?.trim();
  if (!title) { showToast('Assignment title is required.', 'error'); return; }
  const assignments = JSON.parse(localStorage.getItem('gfa_assignments')||'[]');
  assignments.unshift({
    id: 'AS' + Date.now(), title,
    subject: document.getElementById('as_subject')?.value || '',
    teacher: document.getElementById('as_teacher')?.value || '',
    dueDate: document.getElementById('as_due')?.value || '',
    class:   document.getElementById('as_class')?.value || '',
    done: false, createdAt: new Date().toISOString(),
  });
  localStorage.setItem('gfa_assignments', JSON.stringify(assignments));
  showToast('Assignment added!', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('assignments');
};

window.deleteAssignment = function(idx) {
  const assignments = JSON.parse(localStorage.getItem('gfa_assignments')||'[]');
  assignments.splice(idx, 1);
  localStorage.setItem('gfa_assignments', JSON.stringify(assignments));
  showToast('Assignment deleted.', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('assignments');
};

// ── Admin User Edit/Delete ──
window.adminEditUser = function(id) {
  const u = _cache.users.find(x => x.id === id);
  if (!u) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="font-semibold">Edit User — ${u.name}</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:14px;">
        <div class="flex items-center gap-3 mb-2">
          <img src="${u.avatar}" class="avatar avatar-lg" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
          <div><div class="font-bold">${u.name}</div><div class="text-xs text-muted">${u.id}</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">First Name</label>
            <input id="eu_first" class="form-input" value="${u.firstName||''}"></div>
          <div class="form-group"><label class="form-label">Last Name</label>
            <input id="eu_last" class="form-input" value="${u.lastName||''}"></div>
        </div>
        <div class="form-group"><label class="form-label">Email</label>
          <input id="eu_email" class="form-input" value="${u.email}" type="email"></div>
        <div class="form-group"><label class="form-label">Phone</label>
          <input id="eu_phone" class="form-input" value="${u.phone||''}"></div>
        ${u.role === 'student' ? `
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Class</label>
              <input id="eu_class" class="form-input" value="${u.class||''}"></div>
            <div class="form-group"><label class="form-label">Section</label>
              <input id="eu_section" class="form-input" value="${u.section||''}"></div>
            <div class="form-group"><label class="form-label">Roll</label>
              <input id="eu_roll" class="form-input" value="${u.roll||''}"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Guardian</label>
              <input id="eu_guardian" class="form-input" value="${u.guardian||''}"></div>
            <div class="form-group"><label class="form-label">Blood Group</label>
              <input id="eu_blood" class="form-input" value="${u.bloodGroup||''}"></div>
          </div>` : ''}
        ${u.role === 'teacher' ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group"><label class="form-label">Subject</label>
              <input id="eu_subject" class="form-input" value="${u.subject||''}"></div>
            <div class="form-group"><label class="form-label">Qualification</label>
              <input id="eu_qualification" class="form-input" value="${u.qualification||''}"></div>
          </div>` : ''}
        <div class="form-group"><label class="form-label">Status</label>
          <select id="eu_status" class="form-input form-select">
            <option value="active" ${u.status==='active'?'selected':''}>Active</option>
            <option value="pending" ${u.status==='pending'?'selected':''}>Pending</option>
            <option value="inactive" ${u.status==='inactive'?'selected':''}>Inactive</option>
          </select></div>
        <div class="flex gap-3 justify-end">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="adminSaveUser('${id}')">Save Changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
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
  if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  await api.deleteUser(id);

  // Log out if deleting current session
  const session = auth.getCurrentUser();
  if (session && session.id === id) auth.logout();

  showToast(`${name} has been deleted.`, 'success');
  await _refreshTab(adminTab);
};

// ── Batch Management ──
window.saveBatch = async function() {
  const name = document.getElementById('b_name')?.value?.trim();
  const year = document.getElementById('b_year')?.value?.trim();
  if (!name || !year) { showToast('Batch name and year are required.', 'error'); return; }
  await api.addBatch({
    name, passingYear: parseInt(year),
    classTeacher: document.getElementById('b_teacher')?.value?.trim() || '',
    totalStudents: parseInt(document.getElementById('b_students')?.value) || 0,
    description: document.getElementById('b_desc')?.value?.trim() || '',
    achievements: [],
  });
  showToast('Batch created!', 'success');
  await _refreshTab('batches');
};

window.deleteBatch = async function(idx) {
  const batches = _cache.batches;
  const b = batches[idx];
  if (!confirm(`Delete batch "${b?.name}"?`)) return;
  await api.deleteBatch(idx);
  showToast('Batch deleted.', 'success');
  await _refreshTab('batches');
};

