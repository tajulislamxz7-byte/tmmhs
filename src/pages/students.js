// ================================================
// STUDENTS PAGE & PROFILE
// ================================================

import { students as sampleStudents, classes } from '../data/schoolConfig.js';
import { api } from '../utils/api.js';
import { handleProfilePictureUpload, getDefaultAvatar } from '../utils/imageHandler.js';

// Get all students: sampleData + registered users from API/localStorage
async function fetchStudents() {
  const apiUsers = await api.getUsers();
  const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const allResults = JSON.parse(localStorage.getItem('gfa_results') || '[]');
  
  // Show active and unlinked students on public page
  const registeredStudents = users.filter(u => u.role === 'student' && (u.status === 'active' || u.status === 'unlinked')).map(u => {
    // Calculate GPA from latest result
    const studentResults = allResults.filter(r => r.studentId === u.id).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const latestResult = studentResults[0];
    
    let calculatedGPA = 'N/A';
    if (latestResult && latestResult.gpa !== undefined && latestResult.gpa !== null) {
      if (typeof latestResult.gpa === 'number') {
        calculatedGPA = latestResult.gpa.toFixed(2);
      } else {
        calculatedGPA = String(latestResult.gpa);
      }
    } else if (u.gpa && u.gpa !== 'N/A') {
      calculatedGPA = u.gpa;
    }
    
    return {
      id: u.id, name: u.name, roll: u.roll||'—',
      class: u.class||'N/A', section: u.section||'N/A',
      batch: u.batch||'N/A', email: u.email||'',
      phone: u.phone||'—', address: u.address||'—',
      bloodGroup: u.bloodGroup||'—', birthday: u.birthday||'—',
      guardian: u.guardian||'—', skills: u.skills||[],
      bio: u.bio||'', achievements: u.achievements||[],
      avatar: u.avatar||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
      gpa: calculatedGPA, status: u.status,
    };
  });
  // Merge: sampleData first, then registered (skip duplicates)
  const merged = [...sampleStudents];
  registeredStudents.forEach(s => { if (!merged.find(x => x.id === s.id)) merged.push(s); });
  return merged;
}

function getStudents() {
  // Sync fallback using cache
  const cached = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const allResults = JSON.parse(localStorage.getItem('gfa_results') || '[]');
  
  // Show active and unlinked students on public page
  const registeredStudents = cached.filter(u => u.role === 'student' && (u.status === 'active' || u.status === 'unlinked')).map(u => {
    // Calculate GPA from latest result
    const studentResults = allResults.filter(r => r.studentId === u.id).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const latestResult = studentResults[0];
    
    let calculatedGPA = 'N/A';
    if (latestResult && latestResult.gpa !== undefined && latestResult.gpa !== null) {
      if (typeof latestResult.gpa === 'number') {
        calculatedGPA = latestResult.gpa.toFixed(2);
      } else {
        calculatedGPA = String(latestResult.gpa);
      }
    } else if (u.gpa && u.gpa !== 'N/A') {
      calculatedGPA = u.gpa;
    }
    
    return {
      id: u.id, name: u.name, roll: u.roll||'—',
      class: u.class||'N/A', section: u.section||'N/A',
      batch: u.batch||'N/A', email: u.email||'',
      phone: u.phone||'—', address: u.address||'—',
      bloodGroup: u.bloodGroup||'—', birthday: u.birthday||'—',
      guardian: u.guardian||'—', skills: u.skills||[],
      bio: u.bio||'', achievements: u.achievements||[],
      avatar: u.avatar||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
      gpa: calculatedGPA, status: u.status,
    };
  });
  const merged = [...sampleStudents];
  registeredStudents.forEach(s => { if (!merged.find(x => x.id === s.id)) merged.push(s); });
  return merged;
}

export async function renderStudents() {
  const students = await fetchStudents();
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status !== 'inactive').length;
  const avgGpa = totalStudents > 0
    ? (students.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) / totalStudents).toFixed(2)
    : '—';
  return `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag">Directory</div>
              <h1 class="page-title">Students</h1>
              <p class="page-subtitle">Meet the brilliant minds shaping tomorrow at Tiarkhali M.M High School and College</p>
            </div>
            <div class="flex gap-3">
              <button class="btn btn-secondary" onclick="navigate('student-dashboard')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </button>
              <button class="btn btn-primary" onclick="navigate('register')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-sm">
        <!-- Filters & Search -->
        <div class="filters-bar card mb-6">
          <div class="card-body" style="padding:16px 20px;">
            <div class="flex items-center gap-4 flex-wrap">
              <div class="search-inline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" placeholder="Search students..." id="studentSearch" oninput="filterStudents()" class="search-input-inline">
              </div>
              <select class="form-input form-select" id="classFilter" onchange="filterStudents()" style="width:auto;">
                <option value="">All Classes</option>
                ${classes.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
              <select class="form-input form-select" id="sectionFilter" onchange="filterStudents()" style="width:auto;">
                <option value="">All Sections</option>
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
              <div class="flex gap-2 ml-auto">
                <button class="btn btn-secondary btn-icon" onclick="setView('grid')" id="gridViewBtn" title="Grid View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </button>
                <button class="btn btn-ghost btn-icon" onclick="setView('list')" id="listViewBtn" title="List View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="grid-3 gap-4 mb-6">
          ${[
            {l:'Total Students',v:totalStudents,icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',c:'var(--primary)'},
            {l:'Active',v:activeStudents,icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',c:'var(--success)'},
            {l:'Avg GPA',v:avgGpa,icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',c:'var(--warning)'}
          ].map(s=>`
            <div class="card">
              <div class="card-body" style="padding:16px 20px;">
                <div class="flex items-center gap-3">
                  <div style="width:40px;height:40px;border-radius:12px;background:${s.c}15;display:flex;align-items:center;justify-content:center;color:${s.c};">${s.icon}</div>
                  <div><div style="font-size:20px;font-weight:800;color:${s.c};">${s.v}</div><div class="text-xs text-muted">${s.l}</div></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Students Grid -->
        <div class="students-grid" id="studentsGrid">
          ${students.length === 0
            ? `<div class="text-center text-muted" style="padding:60px 0;grid-column:1/-1;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;opacity:0.4;"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                <div class="font-semibold" style="font-size:18px;">No students enrolled yet</div>
                <div class="text-sm mt-2">Add students from the Admin panel</div>
              </div>`
            : students.map(s => renderStudentCard(s)).join('')
          }
        </div>
      </div>
    </div>
  `;
}

function renderStudentCard(s) {
  // Format batch: "B2027" → "2027"
  const batchDisplay = s.batch.startsWith('B') ? s.batch.substring(1) : s.batch;
  
  return `
    <div class="student-card card" data-name="${s.name.toLowerCase()}" data-class="${s.class}" data-section="${s.section}" onclick="navigate('student-profile','${s.id}')">
      <div class="card-body" style="padding:24px;text-align:center;">
        <div class="student-card-avatar" style="position:relative;display:inline-block;margin-bottom:16px;">
          <img src="${s.avatar}" alt="${s.name}" class="avatar avatar-xl mx-auto">
          <div class="student-gpa-badge">${s.gpa}</div>
        </div>
        <div class="font-bold" style="font-size:15px;margin-bottom:4px;">${s.name}</div>
        <div class="text-xs text-muted mb-3">${s.id}</div>
        <div class="flex gap-2 justify-center flex-wrap mb-3">
          <span class="badge badge-primary">${s.class}</span>
          <span class="badge badge-gray">Sec ${s.section}</span>
          <span class="badge badge-purple">${batchDisplay}</span>
        </div>
        <div class="student-card-stats">
          <div><div class="font-semibold text-sm">${s.gpa}</div><div class="text-xs text-muted">GPA</div></div>
          <div><div class="font-semibold text-sm">Roll ${s.roll}</div><div class="text-xs text-muted">Roll</div></div>
        </div>
        <div class="skills-wrap mt-3">
          ${s.skills.slice(0,2).map(sk=>`<span class="badge badge-gray">${sk}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderStudentProfile(studentId) {
  const students = getStudents();
  // Check sampleData/gfa_students first
  let student = students.find(s => s.id === studentId);
  if (!student) {
    // Check registered users (gfa_users or gfa_users_cache)
    const allUsers = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
    const allResults = JSON.parse(localStorage.getItem('gfa_results') || '[]');
    const u = allUsers.find(u => u.id === studentId);
    if (u) {
      // Calculate GPA from latest result
      const studentResults = allResults.filter(r => r.studentId === u.id).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      const latestResult = studentResults[0];
      
      let calculatedGPA = 'N/A';
      if (latestResult && latestResult.gpa !== undefined && latestResult.gpa !== null) {
        if (typeof latestResult.gpa === 'number') {
          calculatedGPA = latestResult.gpa.toFixed(2);
        } else {
          calculatedGPA = String(latestResult.gpa);
        }
      } else if (u.gpa && u.gpa !== 'N/A') {
        calculatedGPA = u.gpa;
      }
      
      student = {
        id: u.id, name: u.name, roll: u.roll || '—',
        class: u.class || 'N/A', section: u.section || 'N/A',
        batch: u.batch || 'N/A', email: u.email,
        phone: u.phone || '—', address: u.address || '—',
        bloodGroup: u.bloodGroup || '—', birthday: u.birthday || '—',
        guardian: u.guardian || '—', skills: u.skills || [],
        bio: u.bio || '', achievements: u.achievements || [],
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        gpa: calculatedGPA,
        status: u.status,
      };
    }
  }
  if (!student) return `<div class="container section-sm"><div class="card"><div class="card-body text-center text-muted" style="padding:60px;">Student not found.</div></div></div>`;
  
  // Format batch: "B2027" → "2027"
  const batchDisplay = student.batch && student.batch.startsWith('B') ? student.batch.substring(1) : student.batch;
  
  return `
    <div class="page-container">
      <div class="profile-hero">
        <div class="container">
          <div class="profile-hero-content">
            <button class="btn btn-secondary btn-sm mb-6" onclick="navigate('students')">← Back to Students</button>
            <div class="profile-main">
              <div class="profile-avatar-section">
                <div class="profile-avatar-wrap">
                  <img src="${student.avatar}" alt="${student.name}" class="profile-avatar-img">
                  <div class="profile-avatar-status"></div>
                </div>
                <div class="profile-qr-code">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GFA%7C${student.id}%7C${encodeURIComponent(student.name)}%7C${student.class}%7C${student.roll}"
                       alt="QR Code" style="width:120px;height:120px;border-radius:8px;border:2px solid var(--border);background:white;"
                       onerror="qrFallback(this)">
                </div>
              </div>
              <div class="profile-info">
                <div class="flex items-center gap-3 flex-wrap mb-2">
                  <h1 style="font-size:32px;font-weight:800;">${student.name}</h1>
                  <span class="badge badge-success">Active Student</span>
                </div>
                <div class="text-muted mb-4">${student.id} · Roll No. ${student.roll}</div>
                <div class="profile-detail-chips">
                  <span class="profile-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> ${student.class}</span>
                  <span class="profile-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> Section ${student.section}</span>
                  <span class="profile-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> ${batchDisplay}</span>
                  <span class="profile-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> ${student.bloodGroup}</span>
                  <span class="profile-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${student.birthday}</span>
                </div>
                <p class="text-secondary mt-4" style="max-width:560px;line-height:1.7;">${student.bio}</p>
                <div class="flex gap-3 mt-6 flex-wrap">
                  <button class="btn btn-primary" onclick="navigate('student-dashboard')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Dashboard
                  </button>
                  ${(() => { try { const me = JSON.parse(localStorage.getItem('gfa_session')||'null'); return me && me.id === student.id ? `<button class="btn btn-secondary" onclick="openEditProfile('${student.id}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Profile</button>` : ''; } catch(e) { return ''; } })()}
                  <button class="btn btn-secondary" onclick="downloadStudentID('${student.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download ID Card
                  </button>
                  <button class="btn btn-secondary" onclick="navigate('messages');setTimeout(()=>startConversationWith('${student.id}','${student.name}','${student.avatar||''}'),300)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Tabs Content -->
      <div class="container section-sm">
        <div class="tabs mb-8" id="profileTabs">
          <button class="tab active" onclick="switchProfileTab('overview',this)">Overview</button>
          <button class="tab" onclick="switchProfileTab('results',this)">Results</button>
          <button class="tab" onclick="switchProfileTab('achievements',this)">Achievements</button>
        </div>

        <div id="profileTabContent">
          ${renderProfileOverviewTab(student)}
        </div>
      </div>
    </div>
  `;
}

function renderProfileOverviewTab(student) {
  // Format batch: "B2027" → "2027"
  const batchDisplay = student.batch && student.batch.startsWith('B') ? student.batch.substring(1) : student.batch;
  
  return `
    <div class="grid" style="grid-template-columns:340px 1fr;gap:24px;" id="overviewTab">
      <!-- Left: Contact Info -->
      <div class="flex flex-col gap-4">
        <div class="card">
          <div class="card-header"><div class="font-semibold">Contact Information</div></div>
          <div class="card-body">
            ${[
              {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>', l:'Email', v:student.email},
              {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>', l:'Phone', v:student.phone},
              {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>', l:'Address', v:student.address},
              {icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>', l:'Guardian', v:student.guardian},
            ].map(r=>`
              <div class="info-row">
                <span class="info-icon" style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:var(--primary-50);color:var(--primary);border-radius:8px;">${r.icon}</span>
                <div><div class="text-xs text-muted">${r.l}</div><div class="font-medium text-sm">${r.v}</div></div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Skills & Interests</div></div>
          <div class="card-body">
            <div class="flex flex-wrap gap-2">
              ${student.skills.map(sk=>`<span class="badge badge-primary">${sk}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Digital Student ID</div></div>
          <div class="card-body text-center" id="studentIdCard">
            <div style="background:linear-gradient(135deg, #4f46e5, #7c3aed);border-radius:20px;padding:24px;color:white;box-shadow:0 8px 24px rgba(79, 70, 229, 0.3);position:relative;overflow:hidden;">
              <!-- Decorative corner pattern -->
              <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
              <div style="position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
              
              <!-- School Name -->
              <div style="font-size:10px;font-weight:800;letter-spacing:0.15em;opacity:0.9;margin-bottom:12px;text-transform:uppercase;">TIARKHALI M.M HIGH SCHOOL</div>
              
              <!-- Student Avatar -->
              <div style="position:relative;display:inline-block;margin-bottom:12px;">
                <img src="${student.avatar}" alt="${student.name}" style="width:72px;height:72px;border-radius:50%;border:4px solid rgba(255,255,255,0.6);background:white;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                <div style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:#22c55e;border-radius:50%;border:3px solid white;"></div>
              </div>
              
              <!-- Student Info -->
              <div style="font-weight:800;font-size:18px;margin-bottom:4px;letter-spacing:0.02em;">${student.name}</div>
              <div style="opacity:0.85;font-size:12px;font-weight:500;background:rgba(255,255,255,0.15);display:inline-block;padding:4px 12px;border-radius:12px;margin-bottom:16px;">${student.id}</div>
              
              <!-- Details Grid -->
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.25);">
                <div>
                  <div style="font-size:10px;opacity:0.7;margin-bottom:4px;font-weight:600;text-transform:uppercase;">Class</div>
                  <div style="font-weight:800;font-size:14px;">${student.class}</div>
                </div>
                <div>
                  <div style="font-size:10px;opacity:0.7;margin-bottom:4px;font-weight:600;text-transform:uppercase;">Section</div>
                  <div style="font-weight:800;font-size:14px;">${student.section}</div>
                </div>
                <div>
                  <div style="font-size:10px;opacity:0.7;margin-bottom:4px;font-weight:600;text-transform:uppercase;">Roll</div>
                  <div style="font-weight:800;font-size:14px;">${student.roll}</div>
                </div>
              </div>
              
              <!-- Validity Badge -->
              <div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:9px;opacity:0.7;display:flex;align-items:center;justify-content:center;gap:4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span style="font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Valid for Academic Year 2024-25</span>
                </div>
              </div>
            </div>
            <button class="btn btn-secondary w-full mt-4" onclick="downloadStudentID('${student.id}')" style="font-weight:600;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download ID Card
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Stats & Achievements -->
      <div class="flex flex-col gap-4">
        <div class="grid-3 gap-4" style="grid-template-columns:repeat(3,1fr);">
          ${(()=>{
            const myResults = JSON.parse(localStorage.getItem('gfa_results')||'[]').filter(r=>r.studentId===student.id).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            const latestResult = myResults[0] || null;
            
            // Calculate GPA properly from latest result
            let currentGPA = '—';
            if (latestResult && latestResult.gpa !== undefined && latestResult.gpa !== null) {
              if (typeof latestResult.gpa === 'number') {
                currentGPA = latestResult.gpa.toFixed(2);
              } else {
                currentGPA = String(latestResult.gpa);
              }
            } else if (student.gpa && student.gpa !== 'N/A') {
              currentGPA = student.gpa;
            }
            
            const rank = myResults.length>0 ? '#'+myResults[0].position : '—';
            return [
              {l:'Current GPA',v:currentGPA,icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',c:'var(--primary)'},
              {l:'Class Rank',v:rank,icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>',c:'var(--warning)'},
            ].map(s=>`
              <div class="card text-center">
                <div class="card-body p-6">
                  <div style="color:${s.c};margin-bottom:8px;display:flex;align-items:center;justify-content:center;">${s.icon}</div>
                  <div style="font-size:28px;font-weight:800;color:${s.c};">${s.v}</div>
                  <div class="text-xs text-muted">${s.l}</div>
                </div>
              </div>
            `).join('');
          })()}
        </div>
        <div class="card">
          <div class="card-header flex items-center justify-between">
            <div class="font-semibold">Achievements & Awards</div>
            <span class="badge badge-primary">${student.achievements.length}</span>
          </div>
          <div class="card-body">
            ${student.achievements.length > 0 ? `
              <div class="flex flex-col gap-3">
                ${student.achievements.map((a, idx) => `
                  <div class="achievement-item" style="display:flex;align-items:start;gap:12px;padding:12px;background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:12px;border-left:4px solid #f59e0b;">
                    <div style="width:40px;height:40px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(245,158,11,0.2);">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5">
                        <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
                        <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                        <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
                      </svg>
                    </div>
                    <div style="flex:1;min-width:0;">
                      <div class="font-semibold" style="font-size:14px;color:#92400e;margin-bottom:2px;">${a}</div>
                      <div style="font-size:11px;color:#b45309;opacity:0.8;">Achievement #${idx + 1}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center text-muted" style="padding:20px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 12px;opacity:0.3;">
                  <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
                  <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
                </svg>
                <div style="font-size:13px;">No achievements recorded yet</div>
              </div>
            `}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Recent Results Summary</div></div>
          <div class="card-body">
            ${(()=>{
              const myResults = JSON.parse(localStorage.getItem('gfa_results')||'[]').filter(r=>r.studentId===student.id);
              const latest = myResults[0];
              if (!latest || !latest.subjects) return `<div class="text-center text-muted" style="padding:20px 0;font-size:13px;">No results published yet</div>`;
              return `<div class="result-bar-chart">${Object.entries(latest.subjects).map(([sub,mark])=>`
                <div class="result-bar-item">
                  <div class="result-bar-label">${sub}</div>
                  <div class="result-bar-track">
                    <div class="result-bar-fill" style="width:${mark}%;background:${mark>=90?'var(--success)':mark>=75?'var(--primary)':'var(--warning)'}"></div>
                  </div>
                  <div class="result-bar-value">${mark}</div>
                </div>`).join('')}</div>`;
            })()}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderProfileTabContent(tab, studentId) {
  const students = getStudents();
  let student = students.find(s => s.id === studentId);
  if (!student) {
    const allUsers = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
    const allResults = JSON.parse(localStorage.getItem('gfa_results') || '[]');
    const u = allUsers.find(u => u.id === studentId);
    if (u) {
      // Calculate GPA from latest result
      const studentResults = allResults.filter(r => r.studentId === u.id).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      const latestResult = studentResults[0];
      
      let calculatedGPA = 'N/A';
      if (latestResult && latestResult.gpa !== undefined && latestResult.gpa !== null) {
        if (typeof latestResult.gpa === 'number') {
          calculatedGPA = latestResult.gpa.toFixed(2);
        } else {
          calculatedGPA = String(latestResult.gpa);
        }
      } else if (u.gpa && u.gpa !== 'N/A') {
        calculatedGPA = u.gpa;
      }
      
      student = { id:u.id, name:u.name, roll:u.roll||'—', class:u.class||'N/A', section:u.section||'N/A', batch:u.batch||'N/A', email:u.email, phone:u.phone||'—', address:u.address||'—', bloodGroup:u.bloodGroup||'—', birthday:u.birthday||'—', guardian:u.guardian||'—', skills:u.skills||[], bio:u.bio||'', achievements:u.achievements||[], avatar:u.avatar||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`, gpa:calculatedGPA };
    }
  }
  if (!student) return '<p class="text-muted">No student data found.</p>';
  
  // Format batch: "B2027" → "2027"
  const batchDisplay = student.batch && student.batch.startsWith('B') ? student.batch.substring(1) : student.batch;

  if (tab === 'overview') return renderProfileOverviewTab(student);

  if (tab === 'results') {
    const allResults = JSON.parse(localStorage.getItem('gfa_results') || '[]');
    const studentResults = allResults.filter(r => r.studentId === student.id);
    return `
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <div class="font-semibold">Exam Results</div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Downloading marksheet PDF...','success')">⬇ Download Marksheet</button>
      </div>
      ${studentResults.length === 0
        ? `<div class="card-body text-center text-muted" style="padding:40px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 12px;opacity:0.5;"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <div>No results published yet</div>
          </div>`
        : `<div class="table-container">
            <table>
              <thead><tr><th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th><th>GPA</th></tr></thead>
              <tbody>
                ${studentResults.flatMap(r =>
                  Object.entries(r.subjects||{}).map(([sub,marks])=>`
                    <tr>
                      <td>${r.exam}</td>
                      <td>${sub}</td>
                      <td style="font-family:monospace;">${marks}/100</td>
                      <td><span class="badge badge-success">${marks>=80?'A+':marks>=70?'A':marks>=60?'A-':marks>=50?'B':marks>=40?'C':marks>=33?'D':'F'}</span></td>
                      <td style="font-weight:700;color:var(--primary);">${marks>=80?'5.00':marks>=70?'4.00':marks>=60?'3.50':marks>=50?'3.00':marks>=40?'2.00':marks>=33?'1.00':'0.00'}</td>
                    </tr>
                  `)
                ).join('')}
              </tbody>
            </table>
          </div>`
      }
    </div>
  `;
  }

  if (tab === 'achievements') return `
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <div class="font-semibold">Achievements & Awards</div>
        <span class="badge badge-success">${student.achievements.length} Total</span>
      </div>
      <div class="card-body">
        ${student.achievements.length > 0 ? `
          <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
            ${student.achievements.map((a, idx) => `
              <div class="achievement-card" style="display:flex;align-items:start;gap:14px;padding:16px;background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:14px;border-left:5px solid #f59e0b;box-shadow:0 2px 8px rgba(245,158,11,0.15);transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(245,158,11,0.25)'" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(245,158,11,0.15)'">
                <div style="width:48px;height:48px;border-radius:12px;background:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(245,158,11,0.2);">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5">
                    <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
                    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                    <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
                  </svg>
                </div>
                <div style="flex:1;min-width:0;">
                  <div class="font-bold" style="font-size:15px;color:#92400e;margin-bottom:4px;line-height:1.4;">${a}</div>
                  <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#b45309;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Verified • Achievement #${idx + 1}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center text-muted" style="padding:40px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;opacity:0.3;">
              <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
              <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
            </svg>
            <div style="font-size:15px;font-weight:600;margin-bottom:8px;">No achievements yet</div>
            <div style="font-size:13px;">Start earning achievements by excelling in academics and extra-curricular activities!</div>
          </div>
        `}
      </div>
    </div>
  `;

  return renderProfileOverviewTab(student);
}

window.openEditProfile = function(studentId) {
  const allUsers = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const u = allUsers.find(x => x.id === studentId);
  if (!u) { showToast('Profile not found', 'error'); return; }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:600px;">
      <div class="modal-header">
        <div class="font-semibold">Edit My Profile</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;display:flex;flex-direction:column;gap:14px;">
        <!-- Profile Picture Section -->
        <div style="text-align:center;padding:20px;background:var(--bg-secondary);border-radius:12px;">
          <img id="userEditAvatar" src="${u.avatar}" class="avatar" style="width:100px;height:100px;margin:0 auto 12px;" onerror="this.src='https://i.imgur.com/x9wE0QT.png'">
          <div><button class="btn btn-secondary btn-sm" onclick="changeMyAvatar('${studentId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Change Photo
          </button></div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input id="ep_first" class="form-input" value="${u.firstName||u.name.split(' ')[0]||''}">
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input id="ep_last" class="form-input" value="${u.lastName||u.name.split(' ').slice(1).join(' ')||''}">
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input id="ep_email" type="email" class="form-input" value="${u.email||''}">
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input id="ep_phone" class="form-input" value="${u.phone||''}">
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Class</label>
            <select id="ep_class" class="form-input form-select">
              <option value="">Select</option>
              <option value="Class 6" ${u.class === 'Class 6' ? 'selected' : ''}>Class 6</option>
              <option value="Class 7" ${u.class === 'Class 7' ? 'selected' : ''}>Class 7</option>
              <option value="Class 8" ${u.class === 'Class 8' ? 'selected' : ''}>Class 8</option>
              <option value="Class 9" ${u.class === 'Class 9' ? 'selected' : ''}>Class 9</option>
              <option value="Class 10" ${u.class === 'Class 10' ? 'selected' : ''}>Class 10</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Section</label>
            <select id="ep_section" class="form-input form-select">
              <option value="">Select</option>
              <option value="A" ${u.section === 'A' ? 'selected' : ''}>A</option>
              <option value="B" ${u.section === 'B' ? 'selected' : ''}>B</option>
              <option value="C" ${u.section === 'C' ? 'selected' : ''}>C</option>
              <option value="D" ${u.section === 'D' ? 'selected' : ''}>D</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Roll</label>
            <input id="ep_roll" class="form-input" value="${u.roll||''}">
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Batch</label>
          <select id="ep_batch" class="form-input form-select">
            <option value="">Select</option>
            <option value="2026" ${u.batch === '2026' ? 'selected' : ''}>Batch 2026</option>
            <option value="2027" ${u.batch === '2027' ? 'selected' : ''}>Batch 2027</option>
            <option value="2028" ${u.batch === '2028' ? 'selected' : ''}>Batch 2028</option>
            <option value="2029" ${u.batch === '2029' ? 'selected' : ''}>Batch 2029</option>
            <option value="2030" ${u.batch === '2030' ? 'selected' : ''}>Batch 2030</option>
          </select>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Blood Group</label>
            <select id="ep_blood" class="form-input form-select">
              ${['—','A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=>`<option ${(u.bloodGroup||'—')===b?'selected':''}>${b}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Birthday</label>
            <input id="ep_birthday" type="date" class="form-input" value="${u.birthday||''}">
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Guardian Name</label>
          <input id="ep_guardian" class="form-input" value="${u.guardian||''}">
        </div>
        
        <div class="form-group">
          <label class="form-label">Address</label>
          <textarea id="ep_address" class="form-input" rows="2">${u.address||''}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea id="ep_bio" class="form-input" rows="3">${u.bio||''}</textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Skills (comma separated)</label>
          <input id="ep_skills" class="form-input" value="${(u.skills||[]).join(', ')}" placeholder="e.g., Mathematics, Science, Sports">
        </div>
        
        <div class="form-group">
          <label class="form-label">Achievements (comma separated)</label>
          <textarea id="ep_achievements" class="form-input" rows="2" placeholder="e.g., First Prize Science Fair, Best Student Award">${(u.achievements||[]).join(', ')}</textarea>
        </div>
        
        <input type="file" id="userEditAvatarInput" accept="image/*" style="display:none;">
        <div class="flex gap-3 justify-end" style="border-top:1px solid var(--border);padding-top:16px;margin-top:8px;">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="saveEditProfile('${studentId}')">Save Changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
};

window.saveEditProfile = async function(studentId) {
  const get = id => document.getElementById(id)?.value?.trim();
  const firstName = get('ep_first');
  const lastName  = get('ep_last');
  const updates = {
    firstName, lastName,
    name: `${firstName} ${lastName}`.trim(),
    email:    get('ep_email'),
    phone:    get('ep_phone'),
    class:    get('ep_class'),
    section:  get('ep_section'),
    batch:    get('ep_batch'),
    roll:     get('ep_roll'),
    address:  get('ep_address'),
    bio:      get('ep_bio'),
    birthday: get('ep_birthday'),
    bloodGroup: get('ep_blood') === '—' ? '' : get('ep_blood'),
    guardian: get('ep_guardian'),
    skills:   get('ep_skills').split(',').map(s=>s.trim()).filter(Boolean),
    achievements: get('ep_achievements').split(',').map(a=>a.trim()).filter(Boolean),
  };
  
  // Include updated avatar if changed
  if (window._userEditNewAvatar) {
    updates.avatar = window._userEditNewAvatar;
    window._userEditNewAvatar = null;
  }

  // Import and use API
  const { api } = await import('../utils/api.js');
  const result = await api.updateUser(studentId, updates);
  
  if (result && result.ok !== false) {
    // Update session if editing own profile
    try {
      const session = JSON.parse(localStorage.getItem('gfa_session') || 'null');
      if (session && session.id === studentId) {
        Object.assign(session, updates);
        localStorage.setItem('gfa_session', JSON.stringify(session));
      }
    } catch(e) {}

    document.querySelector('.modal-overlay')?.remove();
    showToast('Profile updated successfully!', 'success');
    window.location.reload();
  } else {
    showToast(result?.error || 'Failed to update profile', 'error');
  }
};


// ── Change My Avatar (User Profile Edit) ──
window.changeMyAvatar = async function(userId) {
  const input = document.getElementById('userEditAvatarInput');
  if (!input) return;
  
  input.onchange = async function() {
    const previewImg = document.getElementById('userEditAvatar');
    if (!previewImg) return;

    const file = input.files?.[0];
    if (!file) return;

    try {
      const base64 = await handleProfilePictureUpload(input, previewImg);
      
      // Store in global variable
      window._userEditNewAvatar = base64;
      
      showToast('Profile picture updated! Click "Save Changes" to apply.', 'success');
    } catch (error) {
      if (error.message !== 'Crop cancelled') {
        showToast(error.message || 'Failed to upload image', 'error');
      }
      input.value = '';
      window._userEditNewAvatar = null;
    }
  };
  
  input.click();
};
