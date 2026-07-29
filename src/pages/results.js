// ================================================
// RESULTS PAGE — Student Marksheet + Admin/Teacher View
// ================================================

import { students, results, teachers } from '../data/sampleData.js';

// Build a display profile from localStorage auth user when they aren't in sampleData
function buildUserProfile(user) {
  return {
    id:          user.id,
    name:        user.name,
    avatar:      user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
    class:       user.class  || 'N/A',
    section:     user.section|| 'N/A',
    batch:       user.batch  || 'N/A',
    roll:        'N/A',
    bloodGroup:  user.bloodGroup || 'N/A',
    birthday:    'N/A',
    guardian:    user.guardian   || 'N/A',
    email:       user.email,
    phone:       user.phone  || 'N/A',
    address:     'N/A',
    gpa:         'N/A',
    attendance:  0,
    skills:      [],
    achievements:[],
    bio:         'Account pending approval.',
  };
}

const EXAMS = [
  { id:'E001', name:'Half-Yearly Examination 2024', scope:'Class 9–10, All Sections', status:'Published', subjects:7, date:'2024-12-01' },
  { id:'E002', name:'Monthly Test — January 2025', scope:'Class 6–8, All Sections', status:'Published', subjects:4, date:'2025-01-15' },
  { id:'E003', name:'Pre-Test 2025', scope:'Class 10, Section A & B', status:'Draft', subjects:7, date:'2025-02-01' },
  { id:'E004', name:'SSC Test Examination 2025', scope:'Class 10, All Sections', status:'Scheduled', subjects:8, date:'2025-02-14' },
  { id:'E005', name:'Annual Examination 2024', scope:'Class 6–10, All Sections', status:'Published', subjects:8, date:'2024-11-01' },
];

function gradeFromPct(pct) {
  if (pct >= 80) return { g:'A+', gp:5.0 };
  if (pct >= 70) return { g:'A',  gp:4.0 };
  if (pct >= 60) return { g:'A-', gp:3.5 };
  if (pct >= 50) return { g:'B',  gp:3.0 };
  if (pct >= 40) return { g:'C',  gp:2.0 };
  if (pct >= 33) return { g:'D',  gp:1.0 };
  return { g:'F', gp:0.0 };
}

export function renderStudentDashboard(loggedInUser) {
  const student = (loggedInUser && loggedInUser.id)
    ? (students.find(s => s.id === loggedInUser.id) || buildUserProfile(loggedInUser))
    : null;

  if (!student) return `
    <div class="container section-sm">
      <div class="card"><div class="card-body text-center text-muted" style="padding:60px;">
        Please <button class="btn btn-primary btn-sm" onclick="navigate('login')">sign in</button> to view your dashboard.
      </div></div>
    </div>`;

  const myResults = results.filter(r => r.studentId === student.id);
  const latest = myResults[0] || null;

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">My Dashboard</h1>
          <p class="page-subtitle">Welcome back, ${student.name.split(' ')[0]}</p>
        </div>
      </div>
      <div class="container section-sm">
        <div class="dashboard-grid">
          <!-- Sidebar -->
          <div class="dashboard-sidebar">
            <div class="sidebar-user">
              <img src="${student.avatar}" alt="${student.name}" class="avatar avatar-xl mb-3"
                   onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name)}'">
              <div class="font-bold" style="font-size:15px;">${student.name}</div>
              <div class="text-xs text-muted" style="margin-top:2px;">${student.email || ''}</div>
              <div class="text-xs text-muted" style="margin-top:2px;">${student.id}</div>
              <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;justify-content:center;">
                ${student.class && student.class !== 'N/A' ? `<span class="badge badge-primary">${student.class}</span>` : ''}
                ${student.section && student.section !== 'N/A' ? `<span class="badge badge-gray">Sec ${student.section}</span>` : ''}
              </div>
            </div>
            ${[
              {i:'layout',       l:'Overview',    p:'student-dashboard', ico:true},
              {i:'fileText',     l:'My Results',  p:'results',           ico:true},
              {i:'checkCircle',  l:'Attendance',  p:'attendance',        ico:true},
              {i:'clipboardList',l:'Assignments', p:'assignments',       ico:true},
              {i:'messageSquare',l:'Messages',    p:'messages',          ico:true},
              {i:'bell',         l:'Notices',     p:'notices',           ico:true},
              {i:'calendar',     l:'Events',      p:'events',            ico:true},
              {i:'user',         l:'My Profile',  p:'student-profile',   ico:true},
            ].map(item=>`
              <div class="sidebar-nav-item ${item.p==='student-dashboard'?'active':''}"
                onclick="navigate('${item.p}','${item.p==='student-profile' ? student.id : ''}')">
                <span class="sidebar-nav-icon" style="display:flex;align-items:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${{
                      layout:`<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>`,
                      fileText:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
                      checkCircle:`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
                      clipboardList:`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,
                      messageSquare:`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
                      bell:`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
                      calendar:`<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
                      user:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
                    }[item.i]}
                  </svg>
                </span>
                ${item.l}
              </div>
            `).join('')}
          </div>
          <!-- Main -->
          <div class="flex flex-col gap-6">
            <!-- KPI row -->
            <div class="kpi-grid">
              ${[
                {svg:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,l:'Current GPA',       v:student.gpa !== 'N/A' ? student.gpa : '—',      c:'var(--primary)',  t:'Academic standing',   up:true},
                {svg:`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,                                           l:'Attendance',        v:student.attendance ? student.attendance+'%' : '—', c:'var(--success)', t:'This month',          up:true},
                {svg:`<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`,                                         l:'Class Rank',        v:'#1',                                               c:'var(--warning)', t:'Top of the class',    up:true},
                {svg:`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,l:'Assignments Due',  v:2,                                                  c:'var(--danger)',  t:'Submit soon',         up:false},
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

            ${latest ? renderMarksheetWidget(latest) : `
              <div class="card">
                <div class="card-body" style="padding:32px;text-align:center;">
                  <div style="width:56px;height:56px;background:var(--primary-50);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <div style="font-weight:700;font-size:15px;margin-bottom:6px;">No results yet</div>
                  <div style="color:var(--text-muted);font-size:13px;">Your exam results will appear here once published by your teacher.</div>
                </div>
              </div>
            `}

            <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;">
              ${renderAssignmentsWidget()}
              ${renderRecentNoticesWidget()}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMarksheetWidget(r) {
  const entries = Object.entries(r.subjects);
  const total = entries.reduce((s,[,m])=>s+m,0);
  const outOf = entries.length * 100;
  const pct = (total/outOf*100).toFixed(1);
  const g = gradeFromPct(parseFloat(pct));

  return `
    <div class="widget">
      <div class="widget-header">
        <div class="font-semibold">${r.exam} — Result</div>
        <div class="flex gap-2">
          <span class="badge badge-success">Grade ${g.g}</span>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Downloading PDF marksheet...','success')">⬇ Download</button>
        </div>
      </div>
      <div class="widget-body">
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;">
          <div>
            ${entries.map(([sub,marks])=>{
              const p = marks/100*100;
              const sg = gradeFromPct(p);
              return `
                <div class="result-bar-item" style="margin-bottom:12px;">
                  <div class="result-bar-label">${sub}</div>
                  <div class="result-bar-track"><div class="result-bar-fill" style="width:${p}%;background:${p>=80?'var(--success)':p>=60?'var(--primary)':'var(--warning)'};"></div></div>
                  <div class="result-bar-value">${marks}</div>
                  <span class="badge" style="margin-left:6px;background:${p>=80?'#d1fae5':'var(--primary-50)'};color:${p>=80?'#065f46':'var(--primary)'};">${sg.g}</span>
                </div>`;
            }).join('')}
          </div>
          <div class="flex flex-col gap-3" style="align-items:flex-start;justify-content:center;">
            <div style="text-align:center;background:var(--primary);color:white;border-radius:16px;padding:20px;width:100%;">
              <div style="font-size:48px;font-weight:900;line-height:1;">${g.g}</div>
              <div style="opacity:0.8;font-size:13px;margin-top:4px;">Grade</div>
            </div>
            <div class="grid-3" style="grid-template-columns:repeat(3,1fr);gap:8px;width:100%;">
              <div class="text-center" style="background:var(--bg-secondary);border-radius:10px;padding:10px;">
                <div class="font-bold" style="font-size:18px;">${r.gpa}</div>
                <div class="text-xs text-muted">GPA</div>
              </div>
              <div class="text-center" style="background:var(--bg-secondary);border-radius:10px;padding:10px;">
                <div class="font-bold" style="font-size:18px;">${pct}%</div>
                <div class="text-xs text-muted">Avg</div>
              </div>
              <div class="text-center" style="background:var(--bg-secondary);border-radius:10px;padding:10px;">
                <div class="font-bold" style="font-size:18px;">#${r.position}</div>
                <div class="text-xs text-muted">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAssignmentsWidget() {
  const assignments = [
    {s:'Physics',t:'Momentum Problem Set',due:'Aug 2, 2025',done:false},
    {s:'Bangla',t:'প্রবন্ধ রচনা',due:'Aug 4, 2025',done:false},
    {s:'Mathematics',t:'Trigonometry Sheet 4',due:'Submitted',done:true},
    {s:'ICT',t:'Database Design Project',due:'Aug 8, 2025',done:false},
  ];
  return `
    <div class="widget">
      <div class="widget-header"><div class="font-semibold">Assignments</div><span class="badge badge-danger">${assignments.filter(a=>!a.done).length} due</span></div>
      <div class="widget-body">
        ${assignments.map(a=>`
          <div class="flex items-center gap-3 mb-3">
            <div style="width:20px;height:20px;flex-shrink:0;">${a.done
              ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
              : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>`
            }</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate">${a.t}</div>
              <div class="text-xs text-muted">${a.s} · ${a.due}</div>
            </div>
            ${!a.done?`<span class="badge badge-warning">Pending</span>`:`<span class="badge badge-success">Done</span>`}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderRecentNoticesWidget() {
  const notices = [
    {t:'Half-Yearly Exam Routine',cat:'Exam',date:'2025-01-10'},
    {t:'Sports Day Registration',cat:'Event',date:'2025-01-15'},
    {t:'Scholarship Applications Open',cat:'Scholarship',date:'2025-01-08'},
  ];
  return `
    <div class="widget">
      <div class="widget-header"><div class="font-semibold">Recent Notices</div><button class="btn btn-ghost btn-sm" onclick="navigate('notices')">View all →</button></div>
      <div class="widget-body">
        ${notices.map(n=>`
          <div class="flex items-start gap-3 mb-3 cursor-pointer" onclick="navigate('notices')">
            <div style="flex-shrink:0;margin-top:1px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
            <div>
              <div class="font-medium text-sm">${n.t}</div>
              <div class="flex gap-2 mt-1"><span class="badge badge-gray">${n.cat}</span><span class="text-xs text-muted">${n.date}</span></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderResults(role, loggedInUser) {
  if (role === 'student') return renderStudentDashboard(loggedInUser);

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Academic</div>
              <h1 class="page-title">Result Management</h1>
              <p class="page-subtitle">Create exams, enter marks, auto-calculate GPA and publish results</p>
            </div>
            <button class="btn btn-primary" onclick="showToast('Create exam dialog opening...','info')">
              + Create Examination
            </button>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <!-- Exam List -->
        <div class="flex flex-col gap-3 mb-8">
          ${EXAMS.map(e=>`
            <div class="card" style="cursor:pointer;" onclick="showExamDetail('${e.id}')">
              <div class="card-body" style="padding:20px 24px;">
                <div class="flex items-center gap-4">
                  <div style="width:48px;height:48px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold">${e.name}</div>
                    <div class="text-sm text-muted">${e.scope} · ${e.subjects} subjects · ${e.date}</div>
                  </div>
                  <span class="badge badge-${e.status==='Published'?'success':e.status==='Scheduled'?'primary':'warning'}">${e.status}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Marks Entry Table -->
        <div class="card mb-8">
          <div class="card-header flex items-center justify-between">
            <div class="font-semibold">Marks Entry — Half-Yearly 2024, Class 10-A</div>
            <button class="btn btn-primary btn-sm" onclick="showToast('Results published!','success')">Publish Results</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  ${Object.keys(results[0].subjects).map(s=>`<th>${s}</th>`).join('')}
                  <th>Total</th><th>%</th><th>GPA</th><th>Grade</th><th>Rank</th>
                </tr>
              </thead>
              <tbody>
                ${results.map(r=>{
                  const g = gradeFromPct(r.percentage);
                  return `
                    <tr>
                      <td>
                        <div class="flex items-center gap-2">
                          <img src="${students.find(s=>s.id===r.studentId)?.avatar||''}" class="avatar avatar-xs">
                          <span class="font-medium">${r.studentName}</span>
                        </div>
                      </td>
                      ${Object.values(r.subjects).map(m=>`<td style="font-family:monospace;">${m}</td>`).join('')}
                      <td style="font-weight:700;">${r.total}/${r.outOf}</td>
                      <td>${r.percentage}%</td>
                      <td style="font-weight:700;color:var(--primary);">${r.gpa}</td>
                      <td><span class="badge badge-success">${r.grade}</span></td>
                      <td style="font-weight:700;">
                        ${r.position===1
                          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
                          : r.position===2
                          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
                          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
                        } #${r.position}
                      </td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Analytics -->
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;">
          <div class="card">
            <div class="card-header"><div class="font-semibold">Pass/Fail Statistics</div></div>
            <div class="card-body">
              ${[{l:'Pass',v:results.filter(r=>r.pass).length,total:results.length,c:'var(--success)'},{l:'Fail',v:results.filter(r=>!r.pass).length,total:results.length,c:'var(--danger)'}].map(s=>`
                <div class="flex items-center gap-3 mb-4">
                  <div style="flex:1;">
                    <div class="flex justify-between mb-1"><span class="text-sm font-medium">${s.l}</span><span class="text-sm font-bold">${s.v}</span></div>
                    <div style="height:8px;background:var(--bg-secondary);border-radius:99px;overflow:hidden;">
                      <div style="width:${s.total?Math.round(s.v/s.total*100):0}%;height:100%;background:${s.c};border-radius:99px;"></div>
                    </div>
                  </div>
                </div>
              `).join('')}
              <div class="text-center mt-2">
                <div style="font-size:36px;font-weight:900;color:var(--success);">100%</div>
                <div class="text-xs text-muted">Pass Rate</div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="font-semibold">Top Performers</div></div>
            <div class="card-body">
              ${[...results].sort((a,b)=>b.gpa-a.gpa).slice(0,3).map((r,i)=>`
                <div class="flex items-center gap-3 mb-3">
                  <div style="width:24px;height:24px;flex-shrink:0;">${i===0
                    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
                    : i===1
                    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
                    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`
                  }</div>
                  <img src="${students.find(s=>s.id===r.studentId)?.avatar||''}" class="avatar avatar-sm">
                  <div class="flex-1">
                    <div class="font-semibold text-sm">${r.studentName}</div>
                    <div class="text-xs text-muted">${r.class} · ${r.percentage}%</div>
                  </div>
                  <div style="font-weight:800;color:var(--primary);">${r.gpa}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.showExamDetail = function(id) {
  showToast('Opening exam detail...', 'info');
};
