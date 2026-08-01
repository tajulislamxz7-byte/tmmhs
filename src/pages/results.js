// ================================================
// RESULTS PAGE — Student Marksheet + Admin/Teacher View
// ================================================

import { students as sampleStudents, teachers } from '../data/schoolConfig.js';
import { api } from '../utils/api.js';

function getStudentById(id) {
  // Check API cache first, then sampleData
  const cached = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const u = cached.find(x => x.id === id);
  if (u) return u;
  return sampleStudents.find(s => s.id === id);
}

async function fetchExams() {
  const exams = await api.getExams();
  return exams && exams.length > 0 ? exams : [];
}

async function fetchResults() {
  const results = await api.getResults();
  return results && results.length > 0 ? results : [];
}

function getExams() {
  return JSON.parse(localStorage.getItem('gfa_exams') || '[]');
}

function getResults() {
  return JSON.parse(localStorage.getItem('gfa_results') || '[]');
}

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
    skills:      [],
    achievements:[],
    bio:         'Account pending approval.',
  };
}

const EXAMS = [];  // kept for reference; actual exams are stored in localStorage gfa_exams


function gradeFromPct(pct) {
  if (pct >= 80) return { g:'A+', gp:5.0 };
  if (pct >= 70) return { g:'A',  gp:4.0 };
  if (pct >= 60) return { g:'A-', gp:3.5 };
  if (pct >= 50) return { g:'B',  gp:3.0 };
  if (pct >= 40) return { g:'C',  gp:2.0 };
  if (pct >= 33) return { g:'D',  gp:1.0 };
  return { g:'F', gp:0.0 };
}

export async function renderStudentDashboard(loggedInUser) {
  // Fetch fresh data from API
  await api.getResults(); // Load results into localStorage
  await api.getNotices(); // Load notices into localStorage
  
  const cached = JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const student = (loggedInUser && loggedInUser.id)
    ? (cached.find(s => s.id === loggedInUser.id) || sampleStudents.find(s => s.id === loggedInUser.id) || buildUserProfile(loggedInUser))
    : null;

  if (!student) return `
    <div class="container section-sm">
      <div class="card"><div class="card-body text-center text-muted" style="padding:60px;">
        Please <button class="btn btn-primary btn-sm" onclick="navigate('login')">sign in</button> to view your dashboard.
      </div></div>
    </div>`;

  const myResults = getResults().filter(r => r.studentId === student.id);
  const latest = myResults[0] || null;
  
  // Calculate current GPA from latest result
  const currentGPA = latest ? (latest.gpa || '—') : (student.gpa !== 'N/A' ? student.gpa : '—');

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
              ${(()=>{
                const myResults = getResults().filter(r => r.studentId === student.id);
                const classRank = myResults.length > 0 ? '#'+myResults[0].position : '—';
                return [
                  {svg:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,l:'Current GPA',       v:currentGPA,                                             c:'var(--primary)',  t:'Academic standing',   up:true},
                  {svg:`<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`,                                         l:'Class Rank',        v:classRank,                                          c:'var(--warning)', t:'Based on results',    up:true},
                  {svg:`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,                                       l:'Total Exams',       v:myResults.length,                                   c:'var(--success)',  t:'Published',           up:true},
                ].map(s=>`
                  <div class="kpi-card">
                    <div class="kpi-icon" style="background:${s.c}15;display:flex;align-items:center;justify-content:center;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${s.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s.svg}</svg>
                    </div>
                    <div class="kpi-value" style="color:${s.c};">${s.v}</div>
                    <div class="kpi-label">${s.l}</div>
                    <div class="kpi-trend ${s.up?'up':'down'}">${s.t}</div>
                  </div>
                `).join('');
              })()}
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

            <div class="grid" style="grid-template-columns:1fr;gap:20px;">
              ${renderRecentNoticesWidget()}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMarksheetWidget(r) {
  const entries = Object.entries(r.subjects || {});
  const total = r.total || r.obtainedMarks || entries.reduce((s,[,m])=>s+m,0);
  const outOf = r.outOf || r.totalMarks || entries.length * 100;
  const pct = r.percentage || (total/outOf*100);
  const grade = r.grade || 'N/A';
  const gpa = r.gpa || '0.0';

  return `
    <div class="widget">
      <div class="widget-header">
        <div class="font-semibold">${r.exam} — Result</div>
        <div class="flex gap-2">
          <span class="badge badge-success">Grade ${grade}</span>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Downloading PDF marksheet...','success')">⬇ Download</button>
        </div>
      </div>
      <div class="widget-body">
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;">
          <div>
            ${entries.map(([sub,marks])=>{
              const p = (marks/100)*100;
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
              <div style="font-size:48px;font-weight:900;line-height:1;">${grade}</div>
              <div style="opacity:0.8;font-size:13px;margin-top:4px;">Grade</div>
            </div>
            <div class="grid-3" style="grid-template-columns:repeat(3,1fr);gap:8px;width:100%;">
              <div class="text-center" style="background:var(--bg-secondary);border-radius:10px;padding:10px;">
                <div class="font-bold" style="font-size:18px;">${gpa}</div>
                <div class="text-xs text-muted">GPA</div>
              </div>
              <div class="text-center" style="background:var(--bg-secondary);border-radius:10px;padding:10px;">
                <div class="font-bold" style="font-size:18px;">${pct.toFixed(1)}%</div>
                <div class="text-xs text-muted">Avg</div>
              </div>
              <div class="text-center" style="background:var(--bg-secondary);border-radius:10px;padding:10px;">
                <div class="font-bold" style="font-size:18px;">#${r.position || '—'}</div>
                <div class="text-xs text-muted">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRecentNoticesWidget() {
  const allNotices = JSON.parse(localStorage.getItem('gfa_notices') || '[]');
  const notices = allNotices.slice(0, 3);
  return `
    <div class="widget">
      <div class="widget-header"><div class="font-semibold">Recent Notices</div><button class="btn btn-ghost btn-sm" onclick="navigate('notices')">View all →</button></div>
      <div class="widget-body">
        ${notices.length === 0
          ? `<div class="text-center text-muted" style="padding:20px 0;font-size:13px;">No notices yet</div>`
          : notices.map(n=>`
          <div class="flex items-start gap-3 mb-3 cursor-pointer" onclick="navigate('notices')">
            <div style="flex-shrink:0;margin-top:1px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
            <div>
              <div class="font-medium text-sm">${n.title}</div>
              <div class="flex gap-2 mt-1"><span class="badge badge-gray">${n.category}</span><span class="text-xs text-muted">${n.date}</span></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export async function renderResults(role, loggedInUser) {
  if (role === 'student') return renderStudentDashboard(loggedInUser);

  const exams   = await fetchExams();
  const results = await fetchResults();
  const publishedResults = results; // all saved results

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Academic</div>
              <h1 class="page-title">Result Management</h1>
              <p class="page-subtitle">Manage exams and published results from the Admin panel</p>
            </div>
            <button class="btn btn-primary" onclick="navigate('admin')">Go to Admin Panel →</button>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        ${exams.length === 0 ? `
          <div class="card">
            <div class="card-body text-center" style="padding:60px;">
              <div style="font-size:48px;margin-bottom:12px;">📋</div>
              <div class="font-semibold" style="font-size:18px;">No exams created yet</div>
              <div class="text-muted text-sm mt-2 mb-4">Create exams and publish results from the Admin panel</div>
              <button class="btn btn-primary" onclick="navigate('admin')">Open Admin Panel →</button>
            </div>
          </div>
        ` : `
          <div class="flex flex-col gap-4">
            ${exams.map(e => {
              const examResults = publishedResults.filter(r => r.examId === e.id);
              const passCount = examResults.filter(r => r.pass).length;
              const passRate = examResults.length > 0 ? Math.round(passCount/examResults.length*100) : 0;
              return `
                <div class="card">
                  <div class="card-body" style="padding:20px 24px;">
                    <div class="flex items-start gap-4">
                      <div style="width:48px;height:48px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-3 mb-1 flex-wrap">
                          <div class="font-semibold">${e.name}</div>
                          <span class="badge badge-${e.status==='Published'?'success':e.status==='Draft'?'warning':'primary'}">${e.status}</span>
                        </div>
                        <div class="text-sm text-muted mb-3">${e.scope||''} · ${e.date||''} · Subjects: ${(e.subjects||[]).join(', ')}</div>
                        ${e.status === 'Published' && examResults.length > 0 ? `
                          <div class="flex gap-4 flex-wrap text-sm">
                            <span><strong>${examResults.length}</strong> results</span>
                            <span style="color:var(--success);"><strong>${passCount}</strong> passed</span>
                            <span><strong>${passRate}%</strong> pass rate</span>
                          </div>
                        ` : e.status === 'Draft' ? `<div class="text-sm text-muted">Not yet published to students</div>` : ''}
                      </div>
                    </div>
                    ${e.status === 'Published' && examResults.length > 0 ? `
                      <div class="table-container mt-4" style="max-height:300px;overflow-y:auto;">
                        <table>
                          <thead><tr><th>Student</th>${(e.subjects||[]).map(s=>`<th>${s}</th>`).join('')}<th>Total</th><th>%</th><th>Grade</th><th>GPA</th><th>Rank</th></tr></thead>
                          <tbody>
                            ${[...examResults].sort((a,b)=>a.position-b.position).map(r=>`
                              <tr>
                                <td class="font-medium">${r.studentName}</td>
                                ${(e.subjects||[]).map(s=>`<td style="font-family:monospace;">${r.subjects?.[s]??'—'}</td>`).join('')}
                                <td class="font-bold">${r.total}/${r.outOf}</td>
                                <td>${r.percentage}%</td>
                                <td><span class="badge badge-${r.pass?'success':'danger'}">${r.grade}</span></td>
                                <td class="font-bold" style="color:var(--primary);">${r.gpa}</td>
                                <td class="font-bold">#${r.position}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

