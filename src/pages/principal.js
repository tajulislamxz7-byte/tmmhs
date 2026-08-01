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
          <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.8);padding:6px 14px;border-radius:8px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px;" onclick="navigate('home')">
            ${SVG(ICONS.home, 14, 'rgba(255,255,255,0.8)')} Exit to Site
          </button>
          <img src="${user?.avatar || 'https://i.imgur.com/x9wE0QT.png'}"
               alt="${user?.name || 'Principal'}" class="avatar avatar-sm"
               onerror="this.src='https://i.imgur.com/x9wE0QT.png'"
               style="border:2px solid rgba(255,255,255,0.2);">
          <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);">${user?.name || 'Principal'}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:220px 1fr;flex:1;min-height:calc(100vh - 56px);">
        <!-- Sidebar -->
        <div style="background:var(--bg-secondary);border-right:1px solid var(--border);padding:20px 12px;">
          ${renderPrincipalSidebar()}
        </div>

        <!-- Main Content -->
        <div style="padding:24px;background:var(--bg-primary);overflow-y:auto;">
          <div id="principalContent">
            ${renderPrincipalTab(principalTab)}
          </div>
        </div>
      </div>
    </div>
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
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Students (${students.length})</h2><div class="card"><div class="card-body"><div class="text-muted">Student management view - Coming soon</div></div></div></div>`;
}

function renderPrincipalTeachers() {
  const teachers = _cache.users.filter(u => u.role === 'teacher');
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Teachers (${teachers.length})</h2><div class="card"><div class="card-body"><div class="text-muted">Teacher management view - Coming soon</div></div></div></div>`;
}

function renderPrincipalStaff() {
  const staff = _cache.users.filter(u => u.role === 'staff');
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Support Staff (${staff.length})</h2><div class="card"><div class="card-body"><div class="text-muted">Staff management view - Coming soon</div></div></div></div>`;
}

function renderPrincipalNotices() {
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Notices Management</h2><div class="card"><div class="card-body"><div class="text-muted">Notices management - Coming soon</div></div></div></div>`;
}

function renderPrincipalEvents() {
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Events Management</h2><div class="card"><div class="card-body"><div class="text-muted">Events management - Coming soon</div></div></div></div>`;
}

function renderPrincipalResults() {
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Results Overview</h2><div class="card"><div class="card-body"><div class="text-muted">Results overview - Coming soon</div></div></div></div>`;
}

function renderPrincipalAnalytics() {
  return `<div><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Analytics & Reports</h2><div class="card"><div class="card-body"><div class="text-muted">Analytics dashboard - Coming soon</div></div></div></div>`;
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
