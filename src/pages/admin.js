// ================================================
// ADMIN DASHBOARD
// ================================================

import { students, teachers, supportStaff, alumni, batches, notices, events, results } from '../data/sampleData.js';
import * as auth from '../utils/auth.js';

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
  attendance:`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
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

export function renderAdminDashboard() {
  const user = auth.getCurrentUser();
  const allUsers = auth.getAllUsers();
  const pendingCount = allUsers.filter(u => u.status === 'pending').length;

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

function renderAdminMain() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 style="font-size:24px;font-weight:800;">Dashboard Overview</h1>
          <div class="text-muted text-sm">Wednesday, July 29, 2026 · Academic Year 2025–26</div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Generating report...','info')">📊 Export Report</button>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid mb-6">
        ${[
          {svg:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,l:'Total Students', v:'2,847', c:'#2563eb', t:'↑ 3.1% from last year', up:true},
          {svg:`<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,                                                                                l:'Teaching Staff', v:'124',   c:'#7c3aed', t:'↑ 2 new this term',    up:true},
          {svg:`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,                                                                   l:'Pass Rate',     v:'100%',  c:'#059669', t:'↑ 0.8% improvement',  up:true},
          {svg:`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,                                                                   l:'Avg Attendance',v:'93.5%', c:'#d97706', t:'↓ 1.2% this month',   up:false},
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

      <!-- Charts Row -->
      <div class="grid" style="grid-template-columns:1.5fr 1fr;gap:20px;margin-bottom:20px;">
        <div class="card">
          <div class="card-header"><div class="font-semibold">GPA Distribution — Half-Yearly 2024</div></div>
          <div class="card-body">
            ${[{b:'GPA 5.00',n:61},{b:'4.50–4.99',n:214},{b:'4.00–4.49',n:388},{b:'3.50–3.99',n:301},{b:'Below 3.5',n:95}].map(row=>{
              const max = 388;
              return `
                <div class="result-bar-item mb-3">
                  <div class="result-bar-label" style="width:100px;">${row.b}</div>
                  <div class="result-bar-track"><div class="result-bar-fill" style="width:${row.n/max*100}%;background:var(--primary);"></div></div>
                  <div class="result-bar-value">${row.n}</div>
                </div>`;
            }).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Quick Stats</div></div>
          <div class="card-body">
            ${[
              {l:'Active Classes',v:'20'},
              {l:'Upcoming Exams',v:'4'},
              {l:'Open Notices',v:'7'},
              {l:'Events This Month',v:'3'},
              {l:'New Registrations',v:'12'},
              {l:'Open Complaints',v:'4'},
            ].map(s=>`
              <div class="flex items-center justify-between mb-3 pb-3 border-b" style="border-color:var(--border);">
                <span class="text-sm text-secondary">${s.l}</span>
                <span class="font-bold" style="color:var(--primary);">${s.v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Top Students Table -->
      <div class="card mb-6">
        <div class="card-header flex items-center justify-between">
          <div class="font-semibold">Top Students — Half-Yearly 2024</div>
          <button class="btn btn-ghost btn-sm" onclick="switchAdminTab('results')">View All Results →</button>
        </div>
        <div class="table-container">
          <table>
            <thead><tr><th>Rank</th><th>Student</th><th>Class</th><th>GPA</th><th>%</th><th>Grade</th></tr></thead>
            <tbody>
              ${[...results].sort((a,b)=>b.gpa-a.gpa).map((r,i)=>`
                <tr>
                  <td style="font-weight:800;color:var(--warning);">${['🥇','🥈','🥉'][i]||'#'+r.position}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <img src="${students.find(s=>s.id===r.studentId)?.avatar||''}" class="avatar avatar-xs">
                      <span class="font-medium">${r.studentName}</span>
                    </div>
                  </td>
                  <td class="text-muted">${r.class} · ${r.section}</td>
                  <td style="font-weight:700;color:var(--primary);">${r.gpa}</td>
                  <td>${r.percentage}%</td>
                  <td><span class="badge badge-success">${r.grade}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header"><div class="font-semibold">Recent Activity</div></div>
        <div class="card-body">
          ${[
            {svg:ICONS.students,  t:'New student registration', d:'Class 9, Section B · 5 min ago',              c:'#2563eb'},
            {svg:ICONS.notices,   t:'Notice published',         d:'SSC Exam Schedule 2025 · 1 hour ago',         c:'#d97706'},
            {svg:ICONS.results,   t:'Results published',        d:'Monthly Test January 2025 — Class 10',        c:'#059669'},
            {svg:ICONS.roles,     t:'Complaint received',       d:'Broken fan in Room 204 · Yesterday',          c:'#dc2626'},
            {svg:ICONS.alumni,    t:'Alumni profile updated',   d:'Dr. Rakib Hasan · Yesterday',                 c:'#7c3aed'},
          ].map(a=>`
            <div class="flex items-center gap-3 mb-4">
              <div style="width:36px;height:36px;border-radius:10px;background:${a.c}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${a.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${a.svg}</svg>
              </div>
              <div>
                <div class="font-medium text-sm">${a.t}</div>
                <div class="text-xs text-muted">${a.d}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAdminStudents() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Students</h1>
        <div class="flex gap-3">
          <button class="btn btn-secondary" onclick="showToast('Export CSV...','info')">📥 Export</button>
          <button class="btn btn-primary" onclick="showToast('Add student form...','info')">+ Add Student</button>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body" style="padding:14px 20px;">
          <div class="flex gap-3 flex-wrap">
            <div class="search-inline" style="flex:1;min-width:200px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="Search students..." class="search-input-inline">
            </div>
            <select class="form-input form-select" style="width:auto;">
              <option>All Classes</option>
              <option>Class 10</option><option>Class 9</option><option>Class 8</option>
            </select>
            <select class="form-input form-select" style="width:auto;">
              <option>All Batches</option>
              ${batches.map(b=>`<option>${b.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>Student</th><th>ID</th><th>Class</th><th>Roll</th><th>GPA</th><th>Attendance</th><th>Actions</th></tr></thead>
            <tbody>
              ${students.map(s=>`
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <img src="${s.avatar}" class="avatar avatar-sm">
                      <div>
                        <div class="font-semibold text-sm">${s.name}</div>
                        <div class="text-xs text-muted">${s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-family:monospace;font-size:12px;">${s.id}</td>
                  <td>${s.class} · ${s.section}</td>
                  <td>${s.roll}</td>
                  <td style="font-weight:700;color:var(--primary);">${s.gpa}</td>
                  <td><span class="badge badge-${s.attendance>=95?'success':s.attendance>=80?'warning':'danger'}">${s.attendance}%</span></td>
                  <td>
                    <div style="display:flex;gap:4px;">
                      <button class="btn btn-ghost btn-icon btn-sm" onclick="navigate('student-profile','${s.id}')" title="View">
                        ${SVG(`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`, 14)}
                      </button>
                      <button class="btn btn-ghost btn-icon btn-sm" onclick="showToast('Edit form opening...','info')" title="Edit">
                        ${SVG(`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`, 14)}
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminTeachers() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Teachers</h1>
        <button class="btn btn-primary" onclick="showToast('Add teacher form...','info')">+ Add Teacher</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>Teacher</th><th>ID</th><th>Subject</th><th>Experience</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${teachers.map(t=>`
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <img src="${t.avatar}" class="avatar avatar-sm">
                      <div>
                        <div class="font-semibold text-sm">${t.name}</div>
                        <div class="text-xs text-muted">${t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-family:monospace;font-size:12px;">${t.id}</td>
                  <td><span class="badge badge-primary">${t.subject}</span></td>
                  <td>${t.experience}</td>
                  <td>${t.joiningDate}</td>
                  <td><span class="badge badge-${t.status==='Working'?'success':'gray'}">${t.status}</span></td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-ghost btn-icon btn-sm" onclick="navigate('teacher-profile','${t.id}')">👁️</button>
                      <button class="btn btn-ghost btn-icon btn-sm" onclick="showToast('Edit teacher form...','info')">✏️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminStaff() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Support Staff</h1>
        <button class="btn btn-primary" onclick="showToast('Add staff form...','info')">+ Add Staff</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>Name</th><th>ID</th><th>Position</th><th>Department</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              ${supportStaff.map(s=>`
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <img src="${s.avatar}" class="avatar avatar-sm">
                      <div class="font-semibold text-sm">${s.name}</div>
                    </div>
                  </td>
                  <td style="font-family:monospace;font-size:12px;">${s.id}</td>
                  <td>${s.position}</td>
                  <td>${s.department}</td>
                  <td>${s.joiningDate}</td>
                  <td><span class="badge badge-success">${s.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminAlumni() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Alumni</h1>
        <button class="btn btn-primary" onclick="showToast('Add alumni form...','info')">+ Add Alumni</button>
      </div>
      <div class="card"><div class="card-body"><div class="text-center text-muted py-8">Alumni management table — click the Alumni page for the directory view.</div></div></div>
    </div>
  `;
}

function renderAdminBatches() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Batches</h1>
        <button class="btn btn-primary" onclick="showToast('Create batch form...','info')">+ Create Batch</button>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
        ${batches.map(b=>`
          <div class="card">
            <div class="card-body">
              <div class="flex items-center justify-between mb-2">
                <div class="font-bold">${b.name}</div>
                <span class="badge badge-primary">${b.totalStudents} students</span>
              </div>
              <div class="text-sm text-muted mb-2">Passing Year: ${b.passingYear}</div>
              <div class="text-sm text-muted mb-3">Teacher: ${b.classTeacher}</div>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm flex-1" onclick="navigate('batch-detail','${b.id}')">View</button>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Edit batch...','info')">✏️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdminNotices() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Manage Notices</h1>
        <button class="btn btn-primary" onclick="showToast('Publish notice dialog...','info')">+ Publish Notice</button>
      </div>
      <div class="card">
        <div class="card-body"><div class="text-center text-muted py-8">Notice management — click Notices page for the full board.</div></div>
      </div>
    </div>
  `;
}

function renderAdminResults() {
  return `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 style="font-size:22px;font-weight:800;">Result Management</h1>
        <button class="btn btn-primary" onclick="showToast('Create exam...','info')">+ Create Examination</button>
      </div>
      <div class="card"><div class="card-body"><div class="text-center text-muted py-8">Results admin — navigate to the Results page for full marks entry.</div><button class="btn btn-primary mx-auto" style="display:block;" onclick="navigate('results')">Go to Results →</button></div></div>
    </div>
  `;
}

function renderAdminSettings() {
  const s = JSON.parse(localStorage.getItem('gfa_settings') || '{}');
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
  const notices = JSON.parse(localStorage.getItem('gfa_notices') || '[]');
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
            <tbody>
              ${notices.map((n,i)=>`
                <tr>
                  <td><div class="font-medium">${n.title}</div></td>
                  <td><span class="badge badge-primary">${n.category}</span></td>
                  <td><span class="badge badge-${n.priority==='urgent'?'danger':n.priority==='high'?'warning':'gray'}">${n.priority}</span></td>
                  <td>${n.date}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="deleteNotice(${i})">Delete</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table></div></div>`
      }
    </div>
  `;
}

function renderAdminEventsManager() {
  const events = JSON.parse(localStorage.getItem('gfa_events') || '[]');
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
            <tbody>
              ${events.map((e,i)=>`
                <tr>
                  <td><div class="font-medium">${e.title}</div></td>
                  <td>${e.date}</td>
                  <td><span class="badge badge-primary">${e.category}</span></td>
                  <td>${e.location}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="deleteEvent(${i})">Delete</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table></div></div>`
      }
    </div>
  `;
}

function renderAdminAssignmentsManager() {
  const assignments = JSON.parse(localStorage.getItem('gfa_assignments') || '[]');
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
            <tbody>
              ${assignments.map((a,i)=>`
                <tr>
                  <td><div class="font-medium">${a.title}</div></td>
                  <td>${a.subject}</td>
                  <td>${a.teacher}</td>
                  <td>${a.dueDate || '—'}</td>
                  <td>${a.class || 'All'}</td>
                  <td><button class="btn btn-danger btn-sm" onclick="deleteAssignment(${i})">Delete</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table></div></div>`
      }
    </div>
  `;
}

function renderAdminUsers() {
  const allUsers = auth.getAllUsers();
  const pending  = allUsers.filter(u => u.status === 'pending');
  const active   = allUsers.filter(u => u.status === 'active');

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
            ${SVG(`<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`, 16, '#92400e')}
            Pending Approvals
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Class</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>
              ${pending.map(u=>`
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <img src="${u.avatar}" class="avatar avatar-sm" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
                      <div>
                        <div class="font-semibold text-sm">${u.name}</div>
                        <div class="text-xs text-muted">${u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:12px;">${u.email}</td>
                  <td style="font-size:12px;">${u.phone||'—'}</td>
                  <td>${u.class||'—'} ${u.section?'· '+u.section:''}</td>
                  <td style="font-size:12px;">${new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button class="btn btn-success btn-sm" onclick="approveUser('${u.id}')">
                        ${SVG(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`, 13, 'white')} Approve
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>` : `
      <div class="card mb-6" style="border-color:var(--success);">
        <div class="card-body" style="padding:16px;text-align:center;color:var(--success);">
          ${SVG(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`, 18, 'var(--success)')}
          All accounts are approved
        </div>
      </div>`}

      <div class="card">
        <div class="card-header"><div class="font-semibold">All Active Users (${active.length})</div></div>
        <div class="table-container">
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Class</th><th>Registered</th><th>Status</th></tr></thead>
            <tbody>
              ${active.map(u=>`
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <img src="${u.avatar}" class="avatar avatar-sm" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
                      <div>
                        <div class="font-semibold text-sm">${u.name}</div>
                        <div class="text-xs text-muted">${u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:12px;">${u.email}</td>
                  <td><span class="badge badge-${u.role==='admin'?'danger':u.role==='teacher'?'purple':'primary'}" style="text-transform:capitalize;">${u.role}</span></td>
                  <td>${u.class||'—'} ${u.section?'· '+u.section:''}</td>
                  <td style="font-size:12px;">${new Date(u.createdAt).toLocaleDateString()}</td>
                  <td><span class="badge badge-success">Active</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.approveUser = function(id) {
  auth.approveUser(id);
  showToast('User approved successfully!', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminUsers();
};

window.switchAdminTab = function(tab, btn) {
  adminTab = tab;
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab(tab);
};

// ── Admin Settings ──
window.saveSettings = function() {
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
  // Remove undefined keys
  Object.keys(s).forEach(k => s[k] === undefined && delete s[k]);
  localStorage.setItem('gfa_settings', JSON.stringify(s));
  showToast('Settings saved successfully!', 'success');
};

// ── Admin Notices ──
window.showAddNoticeModal = function() {
  const form = document.getElementById('addNoticeForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.saveNotice = function() {
  const title   = document.getElementById('n_title')?.value?.trim();
  const content = document.getElementById('n_content')?.value?.trim();
  if (!title || !content) { showToast('Title and content are required.', 'error'); return; }
  const notices = JSON.parse(localStorage.getItem('gfa_notices') || '[]');
  notices.unshift({
    id: 'N' + Date.now(),
    title,
    category: document.getElementById('n_category')?.value || 'General',
    priority: document.getElementById('n_priority')?.value || 'medium',
    content,
    date: new Date().toISOString().split('T')[0],
  });
  localStorage.setItem('gfa_notices', JSON.stringify(notices));
  // Also push a notification
  const notifs = JSON.parse(localStorage.getItem('gfa_notifications') || '[]');
  notifs.unshift({ title: 'New Notice: ' + title, message: content.slice(0,80), read: false, createdAt: new Date().toISOString() });
  localStorage.setItem('gfa_notifications', JSON.stringify(notifs));
  showToast('Notice published!', 'success');
  const content2 = document.getElementById('adminContent');
  if (content2) content2.innerHTML = renderAdminTab('notices');
};

window.deleteNotice = function(idx) {
  const notices = JSON.parse(localStorage.getItem('gfa_notices') || '[]');
  notices.splice(idx, 1);
  localStorage.setItem('gfa_notices', JSON.stringify(notices));
  showToast('Notice deleted.', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('notices');
};

// ── Admin Events ──
window.showAddEventForm = function() {
  const form = document.getElementById('addEventForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.saveEvent = function() {
  const title = document.getElementById('ev_title')?.value?.trim();
  if (!title) { showToast('Event title is required.', 'error'); return; }
  const events = JSON.parse(localStorage.getItem('gfa_events') || '[]');
  events.unshift({
    id: 'EV' + Date.now(),
    title,
    date:     document.getElementById('ev_date')?.value,
    time:     document.getElementById('ev_time')?.value,
    category: document.getElementById('ev_category')?.value || 'Other',
    location: document.getElementById('ev_location')?.value || '',
    description: document.getElementById('ev_desc')?.value || '',
  });
  localStorage.setItem('gfa_events', JSON.stringify(events));
  showToast('Event added!', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('events');
};

window.deleteEvent = function(idx) {
  const events = JSON.parse(localStorage.getItem('gfa_events') || '[]');
  events.splice(idx, 1);
  localStorage.setItem('gfa_events', JSON.stringify(events));
  showToast('Event deleted.', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('events');
};

// ── Admin Assignments ──
window.showAddAssignmentForm = function() {
  const form = document.getElementById('addAssignmentForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.saveAssignment = function() {
  const title = document.getElementById('as_title')?.value?.trim();
  if (!title) { showToast('Assignment title is required.', 'error'); return; }
  const assignments = JSON.parse(localStorage.getItem('gfa_assignments') || '[]');
  assignments.unshift({
    id:      'AS' + Date.now(),
    title,
    subject: document.getElementById('as_subject')?.value || '',
    teacher: document.getElementById('as_teacher')?.value || '',
    dueDate: document.getElementById('as_due')?.value || '',
    class:   document.getElementById('as_class')?.value || '',
    done:    false,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('gfa_assignments', JSON.stringify(assignments));
  showToast('Assignment added!', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('assignments');
};

window.deleteAssignment = function(idx) {
  const assignments = JSON.parse(localStorage.getItem('gfa_assignments') || '[]');
  assignments.splice(idx, 1);
  localStorage.setItem('gfa_assignments', JSON.stringify(assignments));
  showToast('Assignment deleted.', 'success');
  const content = document.getElementById('adminContent');
  if (content) content.innerHTML = renderAdminTab('assignments');
};
