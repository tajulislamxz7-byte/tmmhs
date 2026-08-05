// ================================================
// NOTICES PAGE
// ================================================

import { api } from '../utils/api.js';
import { notices as sampleNotices } from '../data/schoolConfig.js';

// Get notices from localStorage (admin-managed) falling back to empty
function getNotices() {
  const stored = JSON.parse(localStorage.getItem('gfa_notices') || 'null');
  return stored !== null ? stored : sampleNotices;
}

// Load notices from server
async function loadNotices() {
  const notices = await api.getNotices();
  return notices && notices.length > 0 ? notices : sampleNotices;
}

const CATEGORIES = ['All', 'General', 'Exam', 'Holiday', 'Event', 'Scholarship', 'Emergency', 'Admission', 'Results'];

export async function renderNotices() {
  const notices = await loadNotices();
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Announcements</div>
              <h1 class="page-title">Notice Board</h1>
              <p class="page-subtitle">Stay updated with the latest school announcements and notices</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <!-- Category Filters -->
        <div class="flex gap-3 mb-6 overflow-x-auto flex-wrap" style="padding-bottom:4px;">
          ${CATEGORIES.map(cat=>`
            <button class="search-filter ${cat==='All'?'active':''}" onclick="filterNotices('${cat}',this)">${cat}</button>
          `).join('')}
        </div>

        <!-- Notice List -->
        <div class="notice-list" id="noticeList">
          ${notices.length === 0
            ? `<div class="text-center text-muted" style="padding:60px 0;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin:0 auto 16px;display:block;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><div class="font-semibold">No notices published yet</div></div>`
            : notices.map(n => renderNoticeItem(n)).join('')
          }
        </div>

        <!-- Empty State (hidden) -->
        <div id="noticeEmpty" class="hidden text-center" style="padding:60px 0;">
          <div style="margin-bottom:12px;display:flex;justify-content:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></div>
          <div class="font-semibold" style="font-size:18px;">No notices found</div>
          <div class="text-muted text-sm">Try a different filter</div>
        </div>
      </div>
    </div>
  `;
}

function renderNoticeItem(n) {
  const badgeClass = {
    Exam:'badge-primary', Holiday:'badge-warning', Event:'badge-success',
    Scholarship:'badge-purple', Emergency:'badge-danger', Admission:'badge-gray',
    Results:'badge-success', General:'badge-gray',
  }[n.category] || 'badge-gray';

  const catIcons = {
    Exam:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    Holiday:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>',
    Event:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>',
    Scholarship:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    Emergency:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
    Admission:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    Results:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>',
  };
  const catSvg = catIcons[n.category] || '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>';

  return `
    <div class="notice-item ${n.priority==='urgent'?'urgent':''}" data-category="${n.category}" onclick="openNotice('${n.id}')">
      <div class="flex items-start gap-4">
        <div style="width:48px;height:48px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">${catSvg}</svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span class="badge ${badgeClass}">${n.category}</span>
            ${n.priority==='urgent'?`<span class="badge badge-danger">Urgent</span>`:''}
          </div>
          <div class="font-semibold" style="font-size:15px;">${n.title}</div>
          <p class="text-secondary text-sm line-clamp-2 mt-1">${n.content}</p>
          <div class="flex items-center gap-4 mt-2 text-xs text-muted">
            <span>${n.date}</span>
            <span>Administration</span>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;margin-top:4px;"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  `;
}

window.filterNotices = function(cat, btn) {
  document.querySelectorAll('.search-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const items = document.querySelectorAll('.notice-item');
  let visible = 0;
  items.forEach(item => {
    const show = cat === 'All' || item.dataset.category === cat;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = document.getElementById('noticeEmpty');
  const list = document.getElementById('noticeList');
  if (empty && list) {
    empty.classList.toggle('hidden', visible > 0);
    list.style.display = visible > 0 ? '' : 'none';
  }
};

window.openNotice = function(id) {
  const notices = JSON.parse(localStorage.getItem('gfa_notices') || '[]');
  const n = notices.find(x => x.id === id);
  if (!n) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  const badgeClass = {Exam:'badge-primary',Holiday:'badge-warning',Event:'badge-success',Scholarship:'badge-purple',Emergency:'badge-danger',Admission:'badge-gray',Results:'badge-success'}[n.category]||'badge-gray';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div>
          <span class="badge ${badgeClass}" style="margin-bottom:8px;">${n.category}</span>
          <div class="font-bold" style="font-size:17px;">${n.title}</div>
        </div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <p style="font-size:14px;line-height:1.8;color:var(--text-secondary);">${n.content}</p>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);display:flex;gap:16px;font-size:12px;color:var(--text-muted);">
          <span>${n.date}</span>
          <span>Administration</span>
          <span style="text-transform:capitalize;font-weight:600;color:${n.priority==='urgent'?'var(--danger)':n.priority==='high'?'var(--warning)':'var(--text-muted)'};">${n.priority} priority</span>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
};
