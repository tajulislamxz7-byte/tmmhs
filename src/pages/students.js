// ================================================
// STUDENTS PAGE & PROFILE
// ================================================

import { students, classes } from '../data/sampleData.js';

export function renderStudents() {
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
        <div class="grid-4 gap-4 mb-6">
          ${[{l:'Total Students',v:students.length,i:'👨‍🎓',c:'var(--primary)'},{l:'Active',v:students.length,i:'✅',c:'var(--success)'},{l:'Avg GPA',v:'4.84',i:'📊',c:'var(--warning)'},{l:'Avg Attendance',v:'95.3%',i:'📅',c:'var(--accent)'}].map(s=>`
            <div class="card">
              <div class="card-body" style="padding:16px 20px;">
                <div class="flex items-center gap-3">
                  <div style="width:40px;height:40px;border-radius:12px;background:${s.c}15;display:flex;align-items:center;justify-content:center;font-size:20px;">${s.i}</div>
                  <div><div style="font-size:20px;font-weight:800;color:${s.c};">${s.v}</div><div class="text-xs text-muted">${s.l}</div></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Students Grid -->
        <div class="students-grid" id="studentsGrid">
          ${students.map(s => renderStudentCard(s)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderStudentCard(s) {
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
          <span class="badge badge-purple">${s.batch}</span>
        </div>
        <div class="student-card-stats">
          <div><div class="font-semibold text-sm">${s.gpa}</div><div class="text-xs text-muted">GPA</div></div>
          <div><div class="font-semibold text-sm">${s.attendance}%</div><div class="text-xs text-muted">Attendance</div></div>
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
  // First check sampleData students, then check localStorage users
  let student = students.find(s => s.id === studentId);
  if (!student) {
    const allUsers = JSON.parse(localStorage.getItem('gfa_users') || '[]');
    const u = allUsers.find(u => u.id === studentId);
    if (u) {
      student = {
        id: u.id, name: u.name, roll: u.roll || '—',
        class: u.class || 'N/A', section: u.section || 'N/A',
        batch: u.batch || 'N/A', email: u.email,
        phone: u.phone || '—', address: u.address || '—',
        bloodGroup: u.bloodGroup || '—', birthday: u.birthday || '—',
        guardian: u.guardian || '—', skills: u.skills || [],
        bio: u.bio || '', achievements: u.achievements || [],
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        gpa: u.gpa || 'N/A', attendance: u.attendance || 0,
      };
    }
  }
  if (!student) return `<div class="container section-sm"><div class="card"><div class="card-body text-center text-muted" style="padding:60px;">Student not found.</div></div></div>`;
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
                  <span class="profile-chip"><span>🏫</span> ${student.class}</span>
                  <span class="profile-chip"><span>📍</span> Section ${student.section}</span>
                  <span class="profile-chip"><span>📚</span> ${student.batch}</span>
                  <span class="profile-chip"><span>🩸</span> ${student.bloodGroup}</span>
                  <span class="profile-chip"><span>🎂</span> ${student.birthday}</span>
                </div>
                <p class="text-secondary mt-4" style="max-width:560px;line-height:1.7;">${student.bio}</p>
                <div class="flex gap-3 mt-6 flex-wrap">
                  <button class="btn btn-primary" onclick="navigate('student-dashboard')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Dashboard
                  </button>
                  <button class="btn btn-secondary" onclick="downloadStudentID('${student.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download ID Card
                  </button>
                  <button class="btn btn-secondary" onclick="navigate('messages')">
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
          <button class="tab" onclick="switchProfileTab('attendance',this)">Attendance</button>
          <button class="tab" onclick="switchProfileTab('assignments',this)">Assignments</button>
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
  return `
    <div class="grid" style="grid-template-columns:340px 1fr;gap:24px;" id="overviewTab">
      <!-- Left: Contact Info -->
      <div class="flex flex-col gap-4">
        <div class="card">
          <div class="card-header"><div class="font-semibold">Contact Information</div></div>
          <div class="card-body">
            ${[
              {i:'📧', l:'Email', v:student.email},
              {i:'📞', l:'Phone', v:student.phone},
              {i:'📍', l:'Address', v:student.address},
              {i:'👨‍👧', l:'Guardian', v:student.guardian},
            ].map(r=>`
              <div class="info-row">
                <span class="info-icon">${r.i}</span>
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
            <div style="background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:16px;padding:20px;color:white;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;opacity:0.8;margin-bottom:8px;">TIARKHALI M.M HIGH SCHOOL</div>
              <img src="${student.avatar}" alt="${student.name}" style="width:64px;height:64px;border-radius:50%;border:3px solid rgba(255,255,255,0.5);margin:0 auto 8px;">
              <div style="font-weight:700;font-size:16px;">${student.name}</div>
              <div style="opacity:0.8;font-size:12px;">${student.id}</div>
              <div style="display:flex;justify-content:space-around;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.2);">
                <div><div style="font-size:11px;opacity:0.7;">Class</div><div style="font-weight:600;font-size:12px;">${student.class}</div></div>
                <div><div style="font-size:11px;opacity:0.7;">Section</div><div style="font-weight:600;font-size:12px;">${student.section}</div></div>
                <div><div style="font-size:11px;opacity:0.7;">Roll</div><div style="font-weight:600;font-size:12px;">${student.roll}</div></div>
              </div>
              <div style="margin-top:12px;font-size:10px;opacity:0.6;">Valid for Academic Year 2024-25</div>
            </div>
            <button class="btn btn-secondary w-full mt-3 btn-sm" onclick="downloadStudentID('${student.id}')">Download ID Card</button>
          </div>
        </div>
      </div>

      <!-- Right: Stats & Achievements -->
      <div class="flex flex-col gap-4">
        <div class="grid-3 gap-4" style="grid-template-columns:repeat(3,1fr);">
          ${[
            {l:'Current GPA',v:student.gpa,i:'📊',c:'var(--primary)'},
            {l:'Attendance',v:student.attendance+'%',i:'✅',c:'var(--success)'},
            {l:'Class Rank',v:'#1',i:'🏆',c:'var(--warning)'},
          ].map(s=>`
            <div class="card text-center">
              <div class="card-body p-6">
                <div style="font-size:24px;margin-bottom:8px;">${s.i}</div>
                <div style="font-size:28px;font-weight:800;color:${s.c};">${s.v}</div>
                <div class="text-xs text-muted">${s.l}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="card">
          <div class="card-header flex items-center justify-between">
            <div class="font-semibold">Achievements</div>
            <span class="badge badge-primary">${student.achievements.length}</span>
          </div>
          <div class="card-body">
            ${student.achievements.map(a=>`
              <div class="flex items-center gap-3 mb-3">
                <div style="width:36px;height:36px;border-radius:10px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🏆</div>
                <div class="font-medium text-sm">${a}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="font-semibold">Recent Results Summary</div></div>
          <div class="card-body">
            <div class="result-bar-chart">
              ${Object.entries({Physics:93,Chemistry:88,Mathematics:97,English:89,Bangla:84}).map(([sub,mark])=>`
                <div class="result-bar-item">
                  <div class="result-bar-label">${sub}</div>
                  <div class="result-bar-track">
                    <div class="result-bar-fill" style="width:${mark}%;background:${mark>=90?'var(--success)':mark>=75?'var(--primary)':'var(--warning)'}"></div>
                  </div>
                  <div class="result-bar-value">${mark}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderProfileTabContent(tab, studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return '<p class="text-muted">No student data found.</p>';

  if (tab === 'overview') return renderProfileOverviewTab(student);

  if (tab === 'results') return `
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <div class="font-semibold">Exam Results</div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Downloading marksheet PDF...','success')">⬇ Download Marksheet</button>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th><th>GPA</th></tr></thead>
          <tbody>
            ${Object.entries({Physics:93,Chemistry:88,Mathematics:97,English:89,Bangla:84,ICT:95}).map(([sub,marks])=>`
              <tr>
                <td>Half-Yearly 2024</td>
                <td>${sub}</td>
                <td style="font-family:monospace;">${marks}/100</td>
                <td><span class="badge badge-success">${marks>=80?'A+':marks>=70?'A':marks>=60?'A-':'B'}</span></td>
                <td style="font-weight:700;color:var(--primary);">${marks>=80?'5.00':marks>=70?'4.00':marks>=60?'3.50':'3.00'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (tab === 'attendance') return `
    <div class="card">
      <div class="card-header"><div class="font-semibold">Attendance Summary</div></div>
      <div class="card-body">
        <div class="grid-3 gap-4 text-center mb-6">
          <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;"><div style="font-size:28px;font-weight:900;color:var(--success);">20</div><div class="text-xs text-muted">Present</div></div>
          <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;"><div style="font-size:28px;font-weight:900;color:var(--danger);">3</div><div class="text-xs text-muted">Absent</div></div>
          <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;"><div style="font-size:28px;font-weight:900;color:var(--primary);">${student.attendance}%</div><div class="text-xs text-muted">Rate</div></div>
        </div>
        <button class="btn btn-secondary" onclick="navigate('attendance')">View Full Attendance →</button>
      </div>
    </div>
  `;

  if (tab === 'assignments') return `
    <div class="card">
      <div class="card-header"><div class="font-semibold">Assignments</div></div>
      <div class="card-body">
        <button class="btn btn-secondary" onclick="navigate('assignments')">View All Assignments →</button>
      </div>
    </div>
  `;

  if (tab === 'achievements') return `
    <div class="card">
      <div class="card-header"><div class="font-semibold">Achievements & Awards</div></div>
      <div class="card-body">
        ${student.achievements.map(a=>`
          <div class="flex items-center gap-3 mb-4">
            <div style="width:44px;height:44px;border-radius:12px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🏆</div>
            <div>
              <div class="font-semibold">${a}</div>
              <div class="text-xs text-muted">Verified Achievement</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return renderProfileOverviewTab(student);
}
