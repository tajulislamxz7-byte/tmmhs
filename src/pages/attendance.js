// ================================================
// ATTENDANCE PAGE
// ================================================

import { students } from '../data/sampleData.js';

export function renderAttendance() {
  const monthDays  = 31;
  const startDay   = 2; // July 2025 starts on Tuesday
  const presentDays = [1,2,3,6,7,8,9,10,13,14,15,16,17,20,21,22,23,24,27,28];
  const absentDays  = [4,11,18];
  const holidayDays = [5,12,19,26];

  const days = [];
  for (let i = 0; i < startDay; i++) days.push({ empty: true });
  for (let d = 1; d <= monthDays; d++) {
    days.push({
      d,
      isPresent: presentDays.includes(d),
      isAbsent:  absentDays.includes(d),
      isHoliday: holidayDays.includes(d),
      isFuture:  d > 29,
    });
  }

  const presented = presentDays.length;
  const absent    = absentDays.length;
  const pct       = ((presented / (presented + absent)) * 100).toFixed(1);

  const S = (d, size=22, color='currentColor') =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">${d}</svg>`;

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Attendance</h1>
          <p class="page-subtitle">Daily attendance records and monthly statistics</p>
        </div>
      </div>
      <div class="container section-sm">

        <!-- KPI Stats -->
        <div class="kpi-grid mb-8">
          ${[
            { svg:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', l:'Present Days',  v:presented,          c:'var(--success)' },
            { svg:'<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>', l:'Absent Days', v:absent, c:'var(--danger)' },
            { svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', l:'Holidays', v:holidayDays.length, c:'var(--warning)' },
            { svg:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>', l:'Attendance %', v:pct+'%', c:'var(--primary)' },
          ].map(s => `
            <div class="kpi-card">
              <div class="kpi-icon" style="background:${s.c}15;display:flex;align-items:center;justify-content:center;">
                ${S(s.svg, 22, s.c)}
              </div>
              <div class="kpi-value" style="color:${s.c};">${s.v}</div>
              <div class="kpi-label">${s.l}</div>
            </div>
          `).join('')}
        </div>

        <div class="grid" style="grid-template-columns:1.4fr 1fr;gap:24px;">
          <!-- Calendar -->
          <div class="card">
            <div class="card-header flex items-center justify-between">
              <div class="font-semibold">July 2025</div>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-icon btn-sm">${S('<polyline points="15 18 9 12 15 6"/>', 16)}</button>
                <button class="btn btn-ghost btn-icon btn-sm">${S('<polyline points="9 18 15 12 9 6"/>', 16)}</button>
              </div>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:8px;">
                ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d =>
                  `<div style="text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);padding:4px 0;">${d}</div>`
                ).join('')}
              </div>
              <div class="attendance-calendar">
                ${days.map(day => {
                  if (day.empty) return `<div></div>`;
                  const cls = day.isPresent ? 'att-present'
                    : day.isAbsent  ? 'att-absent'
                    : day.isHoliday ? 'att-holiday'
                    : 'att-future';
                  const label = day.isPresent ? 'Present' : day.isAbsent ? 'Absent' : day.isHoliday ? 'Holiday' : 'Future';
                  return `<div class="attendance-day ${cls}" title="${label}">${day.d}</div>`;
                }).join('')}
              </div>
              <div class="flex gap-4 mt-5 flex-wrap">
                <div class="flex items-center gap-2 text-xs"><div style="width:14px;height:14px;border-radius:4px;background:#d1fae5;"></div> Present</div>
                <div class="flex items-center gap-2 text-xs"><div style="width:14px;height:14px;border-radius:4px;background:#fee2e2;"></div> Absent</div>
                <div class="flex items-center gap-2 text-xs"><div style="width:14px;height:14px;border-radius:4px;background:#fef3c7;"></div> Holiday</div>
              </div>
            </div>
          </div>

          <!-- Trend & Leave -->
          <div class="flex flex-col gap-4">
            <div class="card">
              <div class="card-header"><div class="font-semibold">Monthly Trend</div></div>
              <div class="card-body">
                ${[{m:'Feb',p:94},{m:'Mar',p:92},{m:'Apr',p:95},{m:'May',p:90},{m:'Jun',p:93},{m:'Jul',p:parseFloat(pct)}].map(m => `
                  <div class="result-bar-item" style="margin-bottom:10px;">
                    <div class="result-bar-label" style="width:36px;">${m.m}</div>
                    <div class="result-bar-track">
                      <div class="result-bar-fill" style="width:${m.p}%;background:${m.p>=95?'var(--success)':m.p>=85?'var(--primary)':'var(--warning)'};"></div>
                    </div>
                    <div class="result-bar-value">${m.p}%</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="card">
              <div class="card-header"><div class="font-semibold">Leave Applications</div></div>
              <div class="card-body">
                <button class="btn btn-secondary w-full btn-sm" onclick="showToast('Leave application feature coming soon','info')">
                  + Apply for Leave
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Take Attendance Table -->
        <div class="card mt-6">
          <div class="card-header flex items-center justify-between">
            <div class="font-semibold">Take Attendance — Today</div>
            <div class="flex gap-3">
              <button class="btn btn-secondary btn-sm" onclick="markAll()">Mark All Present</button>
              <button class="btn btn-primary btn-sm" onclick="showToast('Attendance saved!','success')">Save Attendance</button>
            </div>
          </div>
          ${students.length === 0
            ? `<div class="card-body text-center text-muted" style="padding:40px;">
                No students enrolled yet. Add students from the Admin panel.
               </div>`
            : `<div class="table-container">
                <table>
                  <thead><tr><th>Roll</th><th>Student</th><th>Status</th><th>Note</th></tr></thead>
                  <tbody id="attendanceTableBody">
                    ${students.map(s => `
                      <tr>
                        <td style="font-family:monospace;">${s.roll}</td>
                        <td>
                          <div class="flex items-center gap-3">
                            <img src="${s.avatar}" alt="${s.name}" class="avatar avatar-xs">
                            <span class="font-medium">${s.name}</span>
                          </div>
                        </td>
                        <td>
                          <div class="flex gap-2">
                            <button class="btn btn-success btn-sm att-btn" data-id="${s.id}" data-status="present" onclick="setAtt('${s.id}','present',this)">Present</button>
                            <button class="btn btn-secondary btn-sm att-btn" data-id="${s.id}" data-status="absent" onclick="setAtt('${s.id}','absent',this)">Absent</button>
                            <button class="btn btn-secondary btn-sm att-btn" data-id="${s.id}" data-status="late" onclick="setAtt('${s.id}','late',this)">Late</button>
                          </div>
                        </td>
                        <td><input class="form-input" style="padding:6px 10px;font-size:12px;" placeholder="Optional note"></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>`
          }
        </div>

      </div>
    </div>
  `;
}

window.setAtt = function(id, status, btn) {
  btn.closest('tr').querySelectorAll('.att-btn').forEach(b => {
    b.className = 'btn btn-secondary btn-sm att-btn';
  });
  btn.className = `btn btn-${status === 'present' ? 'success' : status === 'absent' ? 'danger' : 'warning'} btn-sm att-btn`;
};

window.markAll = function() {
  document.querySelectorAll('.att-btn[data-status="present"]').forEach(btn => {
    window.setAtt(btn.dataset.id, 'present', btn);
  });
  showToast('All marked as present', 'success');
};
