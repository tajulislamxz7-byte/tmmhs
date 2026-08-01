// ================================================
// PRINCIPAL DASHBOARD
// Custom dashboard for principal role
// ================================================

import { api } from '../utils/api.js';
import * as auth from '../utils/auth.js';
import { icon } from '../utils/icons.js';

const SVG = (paths, size=18, color='currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const ICONS = {
  dashboard: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
  students:  `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  teachers:  `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
  staff:     `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  notices:   `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
  events:    `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  results:   `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  analytics: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  home:      `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
};

let _cache = {};
let principalTab = 'overview';

async function _loadCache() {
  const [users, notices, events, results, settings] = await Promise.all([
    api.getUsers(),
    api.getNotices(),
    api.getEvents(),
    api.getResults(),
    api.getSettings(),
  ]);
  _cache.users    = users    || [];
  _cache.notices  = notices  || [];
  _cache.events   = events   || [];
  _cache.results  = results  || [];
  _cache.settings = settings || {};
}

export async function renderPrincipalDashboard() {
  await _loadCache();

  const user = auth.getCurrentUser();
  const studentCount = _cache.users.filter(u => u.role === 'student' && u.status === 'active').length;
  const teacherCount = _cache.users.filter(u => u.role === 'teacher' && u.status === 'active').length;
  const staffCount   = _cache.users.filter(u => u.role === 'staff' && u.status === 'active').length;

  return `
    <div style="min-height:100vh;display:flex;flex-direction:column;">
      <!-- Principal Top Bar -->
      <div style="background:#1e40af;color:white;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);position:sticky;top:0;z-index:50;">
        <div style="display:flex;align-items:center;gap:12px;">
          <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="8" fill="white" opacity="0.15"/>
            <path d="M7 26L17 9L27 26H7Z" fill="white" opacity="0.9"/>
            <circle cx="17" cy="19" r="4.5" fill="#93c5fd"/>
          </svg>
          <span style="font-weight:800;font-size:15px;">Principal Dashboard</span>
          <span class="badge badge-warning" style="font-size:10px;">Principal</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <!-- Mobile Menu Toggle -->
          <button onclick="togglePrincipalSidebar()" style="display:none;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:white;padding:8px;border-radius:8px;cursor:pointer;" id="principalMenuBtn">
            ${SVG('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>', 16, 'white')}
          </button>
          <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.8);padding:6px 14px;border-radius:8px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px;" onclick="navigate('home')">
            ${SVG(ICONS.home, 14, 'rgba(255,255,255,0.8)')} <span class="hide-mobile">Exit to Site</span>
          </button>
          <img src="${user?.avatar || 'https://i.imgur.com/x9wE0QT.png'}"
               alt="${user?.name || 'Principal'}" class="avatar avatar-sm hide-mobile"
               onerror="this.src='https://i.imgur.com/x9wE0QT.png'"
               style="border:2px solid rgba(255,255,255,0.2);">
          <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);" class="hide-mobile">${user?.name || 'Principal'}</span>
        </div>
      </div>

      <div style="display:flex;flex:1;min-height:calc(100vh - 56px);position:relative;">
        <!-- Sidebar with mobile overlay -->
        <div id="principalSidebar" style="background:var(--bg-secondary);border-right:1px solid var(--border);padding:20px 12px;width:220px;overflow-y:auto;transition:transform 0.3s;">
          ${renderPrincipalSidebar()}
        </div>
        
        <!-- Mobile Overlay -->
        <div id="principalSidebarOverlay" onclick="togglePrincipalSidebar()" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:40;"></div>

        <!-- Main Content -->
        <div style="flex:1;padding:24px;background:var(--bg-primary);overflow-y:auto;overflow-x:hidden;">
          <div id="principalContent">
            ${renderPrincipalTab(principalTab)}
          </div>
        </div>
      </div>
    </div>
    
    <style>
      @media (max-width: 768px) {
        #principalMenuBtn { display:flex !important; }
        .hide-mobile { display:none !important; }
        
        #principalSidebar {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          z-index: 50;
          transform: translateX(-100%);
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }
        
        #principalSidebar.open {
          transform: translateX(0);
        }
        
        #principalSidebarOverlay.show {
          display: block !important;
        }
        
        /* Make tables responsive */
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .table-container table {
          min-width: 600px;
        }
        
        /* Stack analytics cards */
        .kpi-grid {
          grid-template-columns: 1fr !important;
        }
      }
    </style>
  `;
}

function renderPrincipalSidebar() {
  const tabs = [
    {id:'overview',   label:'Overview',   ico:ICONS.dashboard},
    {id:'students',   label:'Students',   ico:ICONS.students},
    {id:'teachers',   label:'Teachers',   ico:ICONS.teachers},
    {id:'staff',      label:'Staff',      ico:ICONS.staff},
    {id:'notices',    label:'Notices',    ico:ICONS.notices},
    {id:'events',     label:'Events',     ico:ICONS.events},
    {id:'results',    label:'Results',    ico:ICONS.results},
    {id:'analytics',  label:'Analytics',  ico:ICONS.analytics},
  ];

  return tabs.map(t => `
    <button 
      class="sidebar-item ${t.id===principalTab?'active':''}"
      onclick="switchPrincipalTab('${t.id}')"
      style="width:100%;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;border:none;background:${t.id===principalTab?'var(--primary)':'transparent'};color:${t.id===principalTab?'white':'var(--text-secondary)'};font-size:13px;font-weight:600;cursor:pointer;margin-bottom:4px;transition:all 0.2s;">
      ${SVG(t.ico, 16, t.id===principalTab?'white':'var(--text-secondary)')}
      ${t.label}
    </button>
  `).join('');
}

function renderPrincipalTab(tab) {
  switch (tab) {
    case 'overview':   return renderPrincipalOverview();
    case 'students':   return renderPrincipalStudents();
    case 'teachers':   return renderPrincipalTeachers();
    case 'staff':      return renderPrincipalStaff();
    case 'notices':    return renderPrincipalNotices();
    case 'events':     return renderPrincipalEvents();
    case 'results':    return renderPrincipalResults();
    case 'analytics':  return renderPrincipalAnalytics();
    default:           return renderPrincipalOverview();
  }
}

function renderPrincipalOverview() {
  const allUsers = _cache.users;
  const studentCount = allUsers.filter(u => u.role === 'student' && u.status === 'active').length;
  const teacherCount = allUsers.filter(u => u.role === 'teacher' && u.status === 'active').length;
  const staffCount   = allUsers.filter(u => u.role === 'staff' && u.status === 'active').length;
  const noticesCount = _cache.notices.length;
  const eventsCount  = _cache.events.length;
  const S = _cache.settings;
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 style="font-size:24px;font-weight:800;">Principal Dashboard</h1>
          <div class="text-muted text-sm">${today} · ${S.year||'Academic Year 2025–26'}</div>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid mb-6">
        ${[
          {svg:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>`, l:'Active Students',  v:studentCount, c:'#2563eb', t:'Enrolled this year', up:true},
          {svg:`<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`, l:'Active Teachers',  v:teacherCount, c:'#7c3aed', t:'Teaching staff', up:true},
          {svg:`<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`, l:'Support Staff',   v:staffCount,   c:'#059669', t:'Active members', up:true},
          {svg:`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>`, l:'Published Notices',v:noticesCount, c:'#d97706', t:'On notice board', up:true},
        ].map(s=>`
          <div class="kpi-card">
            <div class="kpi-icon" style="background:${s.c}15;display:flex;align-items:center;justify-content:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${s.c}" stroke-width="2">${s.svg}</svg>
            </div>
            <div class="kpi-value" style="color:${s.c};">${s.v}</div>
            <div class="kpi-label">${s.l}</div>
            <div class="kpi-trend ${s.up?'up':'down'}">${s.t}</div>
          </div>
        `).join('')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div class="card">
          <div class="card-header"><div class="font-semibold">Recent Notices</div></div>
          <div class="card-body">
            ${_cache.notices.slice(0, 5).map(n => `
              <div style="padding:12px 0;border-bottom:1px solid var(--border);">
                <div style="font-size:13px;font-weight:600;">${n.title}</div>
                <div style="font-size:11px;color:var(--text-muted);">${n.date}</div>
              </div>
            `).join('') || '<div class="text-muted text-sm">No notices yet</div>'}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="font-semibold">Upcoming Events</div></div>
          <div class="card-body">
            ${_cache.events.slice(0, 5).map(e => `
              <div style="padding:12px 0;border-bottom:1px solid var(--border);">
                <div style="font-size:13px;font-weight:600;">${e.title}</div>
                <div style="font-size:11px;color:var(--text-muted);">${e.date} · ${e.location||'TBA'}</div>
              </div>
            `).join('') || '<div class="text-muted text-sm">No events scheduled</div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalStudents() {
  const students = _cache.users.filter(u => u.role === 'student');
  const activeStudents = students.filter(s => s.status === 'active');
  const pendingStudents = students.filter(s => s.status === 'pending');
  
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 style="font-size:20px;font-weight:800;">Students Management</h2>
        <div class="flex gap-2">
          <span class="badge badge-success">${activeStudents.length} Active</span>
          <span class="badge badge-warning">${pendingStudents.length} Pending</span>
        </div>
      </div>
      
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Class</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${students.length === 0 ? '<tr><td colspan="6" class="text-center text-muted" style="padding:40px;">No students found</td></tr>' : 
                students.map(s => `
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <img src="${s.avatar}" class="avatar avatar-sm" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                        <div>
                          <div class="font-semibold text-sm">${s.name}</div>
                          <div class="text-xs text-muted">${s.bloodGroup || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-family:monospace;font-size:12px;">${s.id}</td>
                    <td>${s.class || '—'} ${s.section ? '· ' + s.section : ''}</td>
                    <td style="font-size:12px;">${s.email || '—'}</td>
                    <td style="font-size:12px;">${s.phone || '—'}</td>
                    <td><span class="badge badge-${s.status === 'active' ? 'success' : 'warning'}">${s.status}</span></td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalTeachers() {
  const teachers = _cache.users.filter(u => u.role === 'teacher');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 style="font-size:20px;font-weight:800;">Teachers Management</h2>
        <span class="badge badge-primary">${teachers.length} Teachers</span>
      </div>
      
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Teacher</th>
                <th>ID</th>
                <th>Subject</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${teachers.length === 0 ? '<tr><td colspan="7" class="text-center text-muted" style="padding:40px;">No teachers found</td></tr>' : 
                teachers.map(t => `
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <img src="${t.avatar}" class="avatar avatar-sm" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                        <div>
                          <div class="font-semibold text-sm">${t.name}</div>
                          <div class="text-xs text-muted">${t.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-family:monospace;font-size:12px;">${t.id}</td>
                    <td>${t.subject || '—'}</td>
                    <td style="font-size:12px;">${t.qualification || '—'}</td>
                    <td>${t.experience ? t.experience + ' years' : '—'}</td>
                    <td style="font-size:12px;">${t.email}</td>
                    <td><span class="badge badge-${t.status === 'active' ? 'success' : 'warning'}">${t.status}</span></td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalStaff() {
  const staff = _cache.users.filter(u => u.role === 'staff');
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 style="font-size:20px;font-weight:800;">Support Staff Management</h2>
        <span class="badge badge-gray">${staff.length} Staff Members</span>
      </div>
      
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>ID</th>
                <th>Position</th>
                <th>Department</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${staff.length === 0 ? '<tr><td colspan="7" class="text-center text-muted" style="padding:40px;">No staff members found</td></tr>' : 
                staff.map(s => `
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <img src="${s.avatar}" class="avatar avatar-sm" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
                        <div>
                          <div class="font-semibold text-sm">${s.name}</div>
                          <div class="text-xs text-muted">${s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-family:monospace;font-size:12px;">${s.id}</td>
                    <td>${s.position || '—'}</td>
                    <td>${s.department || '—'}</td>
                    <td style="font-size:12px;">${s.email}</td>
                    <td style="font-size:12px;">${s.phone || '—'}</td>
                    <td><span class="badge badge-${s.status === 'active' ? 'success' : 'warning'}">${s.status}</span></td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalNotices() {
  const notices = _cache.notices;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 style="font-size:20px;font-weight:800;">Published Notices</h2>
        <span class="badge badge-warning">${notices.length} Total</span>
      </div>
      
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Published Date</th>
                <th>Content Preview</th>
              </tr>
            </thead>
            <tbody>
              ${notices.length === 0 ? '<tr><td colspan="5" class="text-center text-muted" style="padding:40px;">No notices published yet</td></tr>' : 
                notices.map(n => `
                  <tr>
                    <td>
                      <div class="font-semibold text-sm">${n.title}</div>
                    </td>
                    <td><span class="badge badge-primary">${n.category || 'General'}</span></td>
                    <td><span class="badge badge-${n.priority === 'high' ? 'danger' : n.priority === 'medium' ? 'warning' : 'gray'}">${n.priority || 'normal'}</span></td>
                    <td style="font-size:12px;">${n.date}</td>
                    <td style="font-size:12px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n.content}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalEvents() {
  const events = _cache.events;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 style="font-size:20px;font-weight:800;">School Events</h2>
        <span class="badge badge-primary">${events.length} Events</span>
      </div>
      
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${events.length === 0 ? '<tr><td colspan="5" class="text-center text-muted" style="padding:40px;">No events scheduled</td></tr>' : 
                events.map(e => `
                  <tr>
                    <td>
                      <div class="font-semibold text-sm">${e.title}</div>
                    </td>
                    <td style="font-size:12px;">${e.date}</td>
                    <td style="font-size:12px;">${e.time || 'TBA'}</td>
                    <td style="font-size:12px;">${e.location || 'TBA'}</td>
                    <td style="font-size:12px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.description || '—'}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalResults() {
  const results = _cache.results;
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 style="font-size:20px;font-weight:800;">Student Results Overview</h2>
        <span class="badge badge-success">${results.length} Results</span>
      </div>
      
      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              ${results.length === 0 ? '<tr><td colspan="7" class="text-center text-muted" style="padding:40px;">No results published yet</td></tr>' : 
                results.map(r => `
                  <tr>
                    <td>
                      <div class="font-semibold text-sm">${r.studentName}</div>
                    </td>
                    <td style="font-family:monospace;font-size:12px;">${r.studentId}</td>
                    <td style="font-size:12px;">${r.exam}</td>
                    <td>${r.total}/${r.outOf}</td>
                    <td><span class="badge badge-${r.percentage >= 80 ? 'success' : r.percentage >= 60 ? 'warning' : 'danger'}">${r.percentage}%</span></td>
                    <td><span class="badge badge-success">${r.grade}</span></td>
                    <td style="font-weight:700;color:var(--primary);">${r.gpa}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPrincipalAnalytics() {
  const allUsers = _cache.users;
  const students = allUsers.filter(u => u.role === 'student');
  const teachers = allUsers.filter(u => u.role === 'teacher');
  const staff = allUsers.filter(u => u.role === 'staff');
  const results = _cache.results;
  
  // Calculate class distribution
  const classCounts = {};
  students.forEach(s => {
    if (s.class) {
      classCounts[s.class] = (classCounts[s.class] || 0) + 1;
    }
  });
  
  // Calculate average performance
  const avgPercentage = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2)
    : 0;
  
  const passRate = results.length > 0
    ? ((results.filter(r => r.percentage >= 40).length / results.length) * 100).toFixed(1)
    : 0;
  
  return `
    <div>
      <h2 style="font-size:20px;font-weight:800;margin-bottom:20px;">Analytics & Insights</h2>
      
      <!-- Quick Stats Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
        <div class="card" style="padding:20px;">
          <div style="color:var(--text-muted);font-size:12px;margin-bottom:4px;">Total Students</div>
          <div style="font-size:32px;font-weight:800;color:#2563eb;">${students.length}</div>
          <div style="font-size:11px;color:var(--success);margin-top:4px;">↑ ${students.filter(s => s.status === 'active').length} Active</div>
        </div>
        <div class="card" style="padding:20px;">
          <div style="color:var(--text-muted);font-size:12px;margin-bottom:4px;">Teaching Staff</div>
          <div style="font-size:32px;font-weight:800;color:#7c3aed;">${teachers.length}</div>
          <div style="font-size:11px;color:var(--success);margin-top:4px;">↑ ${teachers.filter(t => t.status === 'active').length} Active</div>
        </div>
        <div class="card" style="padding:20px;">
          <div style="color:var(--text-muted);font-size:12px;margin-bottom:4px;">Support Staff</div>
          <div style="font-size:32px;font-weight:800;color:#059669;">${staff.length}</div>
          <div style="font-size:11px;color:var(--success);margin-top:4px;">↑ ${staff.filter(s => s.status === 'active').length} Active</div>
        </div>
        <div class="card" style="padding:20px;">
          <div style="color:var(--text-muted);font-size:12px;margin-bottom:4px;">Pass Rate</div>
          <div style="font-size:32px;font-weight:800;color:#d97706;">${passRate}%</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">From ${results.length} results</div>
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <!-- Class Distribution -->
        <div class="card">
          <div class="card-header"><div class="font-semibold">Student Distribution by Class</div></div>
          <div class="card-body">
            ${Object.keys(classCounts).length === 0 
              ? '<div class="text-muted text-sm">No class data available</div>'
              : Object.entries(classCounts).map(([cls, count]) => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">
                  <span style="font-weight:600;">${cls}</span>
                  <span class="badge badge-primary">${count} students</span>
                </div>
              `).join('')}
          </div>
        </div>
        
        <!-- Performance Insights -->
        <div class="card">
          <div class="card-header"><div class="font-semibold">Performance Insights</div></div>
          <div class="card-body">
            <div style="padding:12px 0;border-bottom:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Average Percentage</div>
              <div style="font-size:24px;font-weight:700;color:var(--primary);">${avgPercentage}%</div>
            </div>
            <div style="padding:12px 0;border-bottom:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Total Results Published</div>
              <div style="font-size:24px;font-weight:700;">${results.length}</div>
            </div>
            <div style="padding:12px 0;">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Students Above 80%</div>
              <div style="font-size:24px;font-weight:700;color:var(--success);">${results.filter(r => r.percentage >= 80).length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global functions
if (typeof window !== 'undefined') {
  window.switchPrincipalTab = async function(tab) {
    principalTab = tab;
    await _loadCache();
    const content = document.getElementById('principalContent');
    if (content) content.innerHTML = renderPrincipalTab(tab);
  };
}
