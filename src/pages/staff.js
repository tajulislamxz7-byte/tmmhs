// ================================================
// SUPPORT STAFF PAGE
// ================================================

import { supportStaff } from '../data/sampleData.js';

export function renderStaff() {
  const departments = [...new Set(supportStaff.map(s => s.department))];

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Team</div>
              <h1 class="page-title">Support Staff</h1>
              <p class="page-subtitle">The dedicated team that keeps Tiarkhali M.M High School and College running smoothly every day</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <!-- Filter by Department -->
        <div class="flex gap-2 mb-6 overflow-x-auto" style="padding-bottom:4px;">
          <button class="search-filter active" onclick="filterStaff('All',this)">All</button>
          ${departments.map(d=>`<button class="search-filter" onclick="filterStaff('${d}',this)">${d}</button>`).join('')}
        </div>

        <!-- Staff Grid -->
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;" id="staffGrid">
          ${supportStaff.map(s => renderStaffCard(s)).join('')}
        </div>
      </div>
    </div>
  `;
}

const DEPT_ICONS = {
  Administration: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  Library:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  Security:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  General:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  Maintenance:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  'Science Lab':  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 8h14l-4-8V3"/></svg>`,
  ICT:            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
};

function renderStaffCard(s) {
  const icon = DEPT_ICONS[s.department] || `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
  return `
    <div class="card" data-department="${s.department}" style="cursor:pointer;" onclick="viewStaffProfile('${s.id}')">
      <div class="card-body" style="padding:24px;text-align:center;">
        <div style="position:relative;display:inline-block;margin-bottom:16px;">
          <img src="${s.avatar}" alt="${s.name}" class="avatar avatar-xl mx-auto">
          <div style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;background:var(--bg-primary);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow);">${icon}</div>
        </div>
        <div class="font-bold" style="font-size:15px;margin-bottom:4px;">${s.name}</div>
        <div class="text-xs text-muted mb-3">${s.id}</div>
        <div class="flex gap-2 justify-center flex-wrap mb-3">
          <span class="badge badge-primary">${s.position}</span>
          <span class="badge badge-${s.status==='Active'?'success':'gray'}">${s.status}</span>
        </div>
        <div class="flex justify-around text-xs text-muted border-t border" style="padding-top:12px;margin-top:4px;">
          <span class="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> ${s.department}</span>
          <span class="flex items-center gap-1"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${s.joiningDate}</span>
        </div>
      </div>
    </div>
  `;
}

window.filterStaff = function(dept, btn) {
  document.querySelectorAll('.search-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#staffGrid .card').forEach(card => {
    card.style.display = (dept === 'All' || card.dataset.department === dept) ? '' : 'none';
  });
};

window.viewStaffProfile = function(id) {
  const member = supportStaff.find(s => s.id === id);
  if (!member) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if(e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="font-semibold">Staff Profile</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="text-center mb-5">
          <img src="${member.avatar}" alt="${member.name}" class="avatar avatar-xl mx-auto mb-3">
          <div class="font-bold" style="font-size:20px;">${member.name}</div>
          <div class="text-muted text-sm">${member.id}</div>
        </div>
        <div class="grid-2 gap-3">
          ${[['Position',member.position],['Department',member.department],['Joining Date',member.joiningDate],['Status',member.status],['Phone',member.phone]].map(([l,v])=>`
            <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;">
              <div class="text-xs text-muted">${l}</div>
              <div class="font-medium text-sm">${v}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};
