// ================================================
// TEACHERS PAGE & PROFILE
// ================================================

import { batches, notices } from '../data/schoolConfig.js';
import { api } from '../utils/api.js';

// Get all teachers from API/localStorage
async function fetchTeachers() {
  const apiUsers = await api.getUsers();
  const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  return users.filter(u => u.role === 'teacher' && u.status === 'active').map(t => ({
    id: t.id,
    name: t.name,
    email: t.email,
    phone: t.phone || '—',
    avatar: t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`,
    subject: t.subject || 'General',
    qualification: t.qualification || 'B.Ed.',
    position: t.position || 'Teacher',
    department: t.department || 'General',
    experience: '5+ years',
    status: 'Working',
    bio: t.bio || 'Dedicated educator committed to student success.',
    skills: t.skills || [],
    achievements: t.achievements || [],
    address: t.address || '—',
  }));
}

export async function renderTeachers() {
  const teachers = await fetchTeachers();
  
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Faculty</div>
              <h1 class="page-title">Our Teachers</h1>
              <p class="page-subtitle">Meet the dedicated educators shaping young minds every day</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <div class="filters-bar card mb-6">
          <div class="card-body" style="padding:16px 20px;">
            <div class="flex items-center gap-4 flex-wrap">
              <div class="search-inline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" placeholder="Search by name or subject..." id="teacherSearch" oninput="filterTeachers()" class="search-input-inline">
              </div>
              <select class="form-input form-select" id="statusFilter" onchange="filterTeachers()" style="width:auto;">
                <option value="">All Status</option>
                <option value="Working">Working</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>
        </div>
        <div class="teachers-grid" id="teachersGrid">
          ${teachers.map(t => renderTeacherCard(t)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderTeacherCard(t) {
  const subjectColor = { Physics:'#2563eb', Mathematics:'#7c3aed', English:'#059669', Chemistry:'#d97706', Biology:'#dc2626', ICT:'#0891b2', Bangla:'#be185d', History:'#6b7280', 'English Literature':'#059669' };
  const color = subjectColor[t.subject] || '#2563eb';
  return `
    <div class="card teacher-card" data-name="${t.name.toLowerCase()}" data-subject="${t.subject.toLowerCase()}" data-status="${t.status}" onclick="navigate('teacher-profile','${t.id}')">
      <div style="height:6px;background:${color};"></div>
      <div class="card-body" style="padding:24px;text-align:center;">
        <img src="${t.avatar}" alt="${t.name}" class="avatar avatar-xl mx-auto mb-4" style="border:3px solid ${color}20;">
        <div class="font-bold" style="font-size:16px;margin-bottom:4px;">${t.name}</div>
        <span class="badge" style="background:${color}15;color:${color};margin-bottom:12px;">${t.subject}</span>
        <div class="flex justify-center gap-2 mb-4 flex-wrap">
          <span class="badge badge-${t.status==='Working'?'success':'gray'}">${t.status}</span>
          <span class="badge badge-gray">${t.experience || '5+ years'}</span>
        </div>
        <p class="text-xs text-muted line-clamp-2">${t.bio}</p>
      </div>
    </div>
  `;
}

export async function renderTeacherProfile(teacherId) {
  const teachers = await fetchTeachers();
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return `<div class="container section-sm"><div class="card"><div class="card-body text-center text-muted">Teacher not found.</div></div></div>`;
  return `
    <div class="page-container">
      <div class="profile-hero">
        <div class="container">
          <button class="btn btn-secondary btn-sm mb-6" onclick="navigate('teachers')">← Back to Teachers</button>
          <div class="profile-main">
            <div class="profile-avatar-section">
              <div class="profile-avatar-wrap">
                <img src="${teacher.avatar}" alt="${teacher.name}" class="profile-avatar-img">
                <div class="profile-avatar-status" style="background:${teacher.status==='Working'?'#34d399':'#94a3b8'};"></div>
              </div>
            </div>
            <div class="profile-info">
              <div class="flex items-center gap-3 flex-wrap mb-2">
                <h1 style="font-size:32px;font-weight:800;color:white;">${teacher.name}</h1>
                <span class="badge badge-${teacher.status==='Working'?'success':'gray'}">${teacher.status}</span>
              </div>
              <div style="color:rgba(255,255,255,0.7);margin-bottom:16px;">${teacher.id}</div>
              <div class="profile-detail-chips">
                <span class="profile-chip"><span>📚</span> ${teacher.subject}</span>
                <span class="profile-chip"><span>🎓</span> ${teacher.qualification}</span>
                <span class="profile-chip"><span>⏱️</span> ${teacher.experience}</span>
                <span class="profile-chip"><span>📅</span> Joined ${teacher.joiningDate}</span>
              </div>
              <p style="color:rgba(255,255,255,0.8);margin-top:16px;max-width:560px;line-height:1.7;">${teacher.bio}</p>
              <div class="flex gap-3 mt-6 flex-wrap">
                <button class="btn btn-primary" onclick="navigate('messages')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:24px;">
          <div class="card">
            <div class="card-header"><div class="font-semibold">Contact Information</div></div>
            <div class="card-body">
              <div class="info-row"><span class="info-icon">📧</span><div><div class="text-xs text-muted">Email</div><div class="font-medium text-sm">${teacher.email}</div></div></div>
              <div class="info-row"><span class="info-icon">📞</span><div><div class="text-xs text-muted">Phone</div><div class="font-medium text-sm">${teacher.phone}</div></div></div>
              <div class="info-row"><span class="info-icon">📅</span><div><div class="text-xs text-muted">Joining Date</div><div class="font-medium text-sm">${teacher.joiningDate}</div></div></div>
              <div class="info-row"><span class="info-icon">🏫</span><div><div class="text-xs text-muted">Role</div><div class="font-medium text-sm">${teacher.role}</div></div></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="font-semibold">Subjects Taught</div></div>
            <div class="card-body">
              <div class="flex flex-wrap gap-2">
                <span class="badge badge-primary">${teacher.subject}</span>
              </div>
              <div class="mt-4">
                <div class="text-xs text-muted mb-2">Qualification</div>
                <div class="font-medium text-sm">${teacher.qualification}</div>
              </div>
              <div class="mt-4">
                <div class="text-xs text-muted mb-2">Experience</div>
                <div class="font-medium text-sm">${teacher.experience}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.filterTeachers = function() {
  const q = document.getElementById('teacherSearch')?.value?.toLowerCase() || '';
  const status = document.getElementById('statusFilter')?.value || '';
  document.querySelectorAll('.teacher-card').forEach(card => {
    const name = card.dataset.name || '';
    const subject = card.dataset.subject || '';
    const cardStatus = card.dataset.status || '';
    const show = (name.includes(q) || subject.includes(q)) && (!status || cardStatus === status);
    card.style.display = show ? '' : 'none';
  });
};

function buildTeacherProfile(user) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
    subject: user.subject || 'N/A',
    qualification: user.qualification || 'N/A',
    experience: user.experience || 'N/A',
    bio: user.bio || 'Teacher',
    email: user.email,
    phone: user.phone || 'N/A',
    joiningDate: user.joiningDate || 'N/A',
    status: 'Working',
    role: user.role || 'Teacher',
  };
}

const TCH_SIDEBAR_ITEMS = [
  {i:'layout',       l:'Overview',         p:'teacher-dashboard'},
  {i:'fileText',     l:'Results',           p:'results'},
  {i:'clipboardList',l:'Assignments',       p:'assignments'},
  {i:'messageSquare',l:'Messages',          p:'messages'},
  {i:'bell',         l:'Notices',           p:'notices'},
  {i:'user',         l:'My Profile',        p:'teacher-profile'},
];

const TCH_SVG_MAP = {
  layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  checkCircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  fileText:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  clipboardList:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  messageSquare:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

export function renderTeacherDashboard(loggedInUser) {
  const teacher = buildTeacherProfile(loggedInUser);

  const myClass = batches.find(b => b.classTeacher === teacher.name) || { name:'No Batch', id:'', totalStudents:0, achievements:[], passingYear:'—' };
  const totalStudents = myClass ? myClass.totalStudents : 0;

  const sidebarNav = TCH_SIDEBAR_ITEMS.map(item => `
    <div class="sidebar-nav-item ${item.p === 'teacher-dashboard' ? 'active' : ''}"
      onclick="navigate('${item.p}','${item.p === 'teacher-profile' ? teacher.id : ''}')">
      <span class="sidebar-nav-icon" style="display:flex;align-items:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TCH_SVG_MAP[item.i]}</svg>
      </span>
      ${item.l}
    </div>
  `).join('');

  const kpiCards = [
    {svg:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', l:'My Students', v:totalStudents, c:'var(--primary)', t:'In your batch', up:true},
    {svg:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', l:'Classes', v:3, c:'var(--accent)', t:'Active classes', up:true},
    {svg:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>', l:'Pending Tasks', v:4, c:'var(--warning)', t:'Requires action', up:false},
  ];

  const kpiHtml = kpiCards.map(s => `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:${s.c}15;display:flex;align-items:center;justify-content:center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${s.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.svg}</svg>
      </div>
      <div class="kpi-value" style="color:${s.c};">${s.v}</div>
      <div class="kpi-label">${s.l}</div>
      <div class="kpi-trend ${s.up ? 'up' : 'down'}">${s.t}</div>
    </div>
  `).join('');

  const noticeItems = notices.slice(0, 3).map(n => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg-secondary);border-radius:8px;">
      <span style="font-size:18px;">${n.category === 'Exam' ? '📝' : n.category === 'Holiday' ? '🎉' : n.category === 'Emergency' ? '🚨' : n.category === 'Scholarship' ? '🎓' : n.category === 'Admission' ? '📋' : n.category === 'Results' ? '📊' : '📢'}</span>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:13px;">${n.title}</div>
        <div style="font-size:11px;color:var(--text-muted);">${n.date}</div>
      </div>
      <span class="badge badge-${n.priority === 'urgent' ? 'danger' : n.priority === 'high' ? 'warning' : 'info'}">${n.priority}</span>
    </div>
  `).join('');

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Teacher Dashboard</h1>
          <p class="page-subtitle">Welcome back, ${teacher.name.split(' ')[0]}</p>
        </div>
      </div>
      <div class="container section-sm">
        <div class="dashboard-grid">
          <div class="dashboard-sidebar">
            <div class="sidebar-user">
              <img src="${teacher.avatar}" alt="${teacher.name}" class="avatar avatar-xl mb-3"
                   onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(teacher.name)}'">
              <div class="font-bold" style="font-size:15px;">${teacher.name}</div>
              <div class="text-xs text-muted" style="margin-top:2px;">${teacher.email || ''}</div>
              <div class="text-xs text-muted" style="margin-top:2px;">${teacher.id}</div>
              <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;justify-content:center;">
                <span class="badge badge-primary">${teacher.subject}</span>
                <span class="badge badge-success">${teacher.status}</span>
              </div>
            </div>
            ${sidebarNav}
          </div>
          <div class="flex flex-col gap-6">
            <div class="kpi-grid">${kpiHtml}</div>
            <div class="card">
              <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <div class="font-semibold">Profile Information</div>
                <button class="btn btn-secondary btn-sm" onclick="editTeacherProfile('${teacher.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Profile
                </button>
              </div>
              <div class="card-body">
                <div class="grid-2 gap-4">
                  <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <div><div class="text-xs text-muted">Subject</div><div class="font-medium text-sm">${teacher.subject}</div></div>
                  </div>
                  <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    <div><div class="text-xs text-muted">Qualification</div><div class="font-medium text-sm">${teacher.qualification}</div></div>
                  </div>
                  <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div><div class="text-xs text-muted">Experience</div><div class="font-medium text-sm">${teacher.experience}</div></div>
                  </div>
                  <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    <div><div class="text-xs text-muted">Status</div><div class="font-medium text-sm">${teacher.status}</div></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;">
              <div class="card">
                <div class="card-header"><div class="font-semibold">Quick Actions</div></div>
                <div class="card-body" style="display:flex;flex-direction:column;gap:10px;">
                  <button class="btn btn-secondary w-full" onclick="navigate('results')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Publish Results
                  </button>
                  <button class="btn btn-secondary w-full" onclick="navigate('messages')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Send Message
                  </button>
                </div>
              </div>
              <div class="card">
                <div class="card-header"><div class="font-semibold">My Class — ${myClass.name}</div></div>
                <div class="card-body" style="display:flex;flex-direction:column;gap:12px;">
                  <div class="info-row"><span style="font-size:20px;">📊</span><div><div class="text-xs text-muted">Total Students</div><div class="font-medium text-sm">${totalStudents}</div></div></div>
                  <div class="info-row"><span style="font-size:20px;">🏆</span><div><div class="text-xs text-muted">Achievements</div><div class="font-medium text-sm">${(myClass.achievements || []).slice(0, 2).join(', ')}</div></div></div>
                  <div class="info-row"><span style="font-size:20px;">📅</span><div><div class="text-xs text-muted">Passing Year</div><div class="font-medium text-sm">${myClass.passingYear}</div></div></div>
                  <button class="btn btn-ghost w-full" onclick="navigate('batch-detail','${myClass.id}')" style="margin-top:4px;">View Batch Details →</button>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><div class="font-semibold">Recent Notices</div></div>
              <div class="card-body"><div style="display:flex;flex-direction:column;gap:8px;">${noticeItems}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


window.editTeacherProfile = async function(id) {
  const apiUsers = await api.getUsers();
  const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const user = users.find(u => u.id === id);
  if (!user) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if(e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:600px;">
      <div class="modal-header">
        <div class="font-semibold">Edit Profile</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <form id="editTeacherForm" class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value="${user.firstName || ''}" required>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value="${user.lastName || ''}" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value="${user.email || ''}" required>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value="${user.phone || ''}">
        </div>
        <div class="form-group">
          <label>Subject</label>
          <input type="text" name="subject" value="${user.subject || ''}" placeholder="e.g., Mathematics, Physics">
        </div>
        <div class="form-group">
          <label>Qualification</label>
          <input type="text" name="qualification" value="${user.qualification || ''}" placeholder="e.g., M.Sc. in Mathematics">
        </div>
        <div class="form-group">
          <label>Position</label>
          <input type="text" name="position" value="${user.position || ''}" placeholder="e.g., Senior Teacher, Assistant Teacher">
        </div>
        <div class="form-group">
          <label>Department</label>
          <select name="department">
            <option value="">Select Department</option>
            <option value="Science" ${user.department === 'Science' ? 'selected' : ''}>Science</option>
            <option value="Arts" ${user.department === 'Arts' ? 'selected' : ''}>Arts</option>
            <option value="Commerce" ${user.department === 'Commerce' ? 'selected' : ''}>Commerce</option>
            <option value="General" ${user.department === 'General' ? 'selected' : ''}>General</option>
          </select>
        </div>
        <div class="form-group">
          <label>Blood Group</label>
          <select name="bloodGroup">
            <option value="">Select</option>
            ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => 
              `<option value="${bg}" ${user.bloodGroup === bg ? 'selected' : ''}>${bg}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Address</label>
          <textarea name="address" rows="2" placeholder="Enter address">${user.address || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea name="bio" rows="3" placeholder="Write a short bio...">${user.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Skills (comma-separated)</label>
          <input type="text" name="skills" value="${(user.skills || []).join(', ')}" placeholder="e.g., Mathematics, Programming">
        </div>
        <div class="form-group">
          <label>Achievements (comma-separated)</label>
          <textarea name="achievements" rows="2" placeholder="e.g., Best Teacher 2024, Published Research">${(user.achievements || []).join(', ')}</textarea>
        </div>
        <div class="flex gap-3 justify-end mt-4">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('editTeacherForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      name: `${form.firstName.value.trim()} ${form.lastName.value.trim()}`,
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      subject: form.subject.value.trim(),
      qualification: form.qualification.value.trim(),
      position: form.position.value.trim(),
      department: form.department.value,
      bloodGroup: form.bloodGroup.value,
      address: form.address.value.trim(),
      bio: form.bio.value.trim(),
      skills: form.skills.value.split(',').map(s => s.trim()).filter(Boolean),
      achievements: form.achievements.value.split(',').map(a => a.trim()).filter(Boolean),
    };

    const result = await api.updateUser(id, data);
    if (result && result.ok !== false) {
      showToast('Profile updated successfully!', 'success');
      modal.remove();
      window.location.reload();
    } else {
      showToast(result?.error || 'Failed to update profile', 'error');
    }
  };
};
