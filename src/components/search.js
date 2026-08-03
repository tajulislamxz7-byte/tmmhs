// ================================================
// GLOBAL SEARCH COMPONENT
// ================================================

import { students, teachers, batches, notices, events, supportStaff } from '../data/schoolConfig.js';

export function renderSearchModal() {
  return `
    <div class="search-overlay hidden" id="searchOverlay" onclick="closeSearch(event)">
      <div class="search-modal" onclick="event.stopPropagation()">
        <div class="search-input-wrap">
          <svg class="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" class="search-input" id="globalSearchInput" placeholder="Search students, teachers, notices..." oninput="handleSearch(this.value)">
          <button class="search-clear hidden" id="searchClear" onclick="clearSearch()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <kbd class="search-esc" onclick="closeSearch()">ESC</kbd>
        </div>
        <div class="search-filters" id="searchFilters">
          <button class="search-filter active" onclick="setSearchFilter('all', this)">All</button>
          <button class="search-filter" onclick="setSearchFilter('students', this)">Students</button>
          <button class="search-filter" onclick="setSearchFilter('teachers', this)">Teachers</button>
          <button class="search-filter" onclick="setSearchFilter('notices', this)">Notices</button>
          <button class="search-filter" onclick="setSearchFilter('events', this)">Events</button>
        </div>
        <div class="search-results" id="searchResults">
          <div class="search-empty">
            <div style="margin-bottom:12px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
            <div class="font-semibold" style="font-size:16px;margin-bottom:6px;">Search anything</div>
            <div class="text-muted text-sm">Find students, teachers, notices, events and more</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSearch() {
  let currentFilter = 'all';

  window.openSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    overlay.classList.remove('hidden');
    overlay.style.animation = 'fadeIn 0.2s ease';
    setTimeout(() => document.getElementById('globalSearchInput')?.focus(), 100);
    document.body.style.overflow = 'hidden';
  };

  window.closeSearch = function(e) {
    if (!e || e.target === document.getElementById('searchOverlay') || e.target.classList.contains('search-esc')) {
      const overlay = document.getElementById('searchOverlay');
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      clearSearch();
    }
  };

  window.clearSearch = function() {
    const input = document.getElementById('globalSearchInput');
    const clear = document.getElementById('searchClear');
    if (input) input.value = '';
    if (clear) clear.classList.add('hidden');
    document.getElementById('searchResults').innerHTML = `
      <div class="search-empty">
        <div style="margin-bottom:12px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
        <div class="font-semibold" style="font-size:16px;margin-bottom:6px;">Search anything</div>
        <div class="text-muted text-sm">Find students, teachers, notices, events and more</div>
      </div>`;
  };

  window.setSearchFilter = function(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.search-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const val = document.getElementById('globalSearchInput')?.value;
    if (val) handleSearch(val);
  };

  window.handleSearch = function(query) {
    const clear = document.getElementById('searchClear');
    if (query.length > 0) clear.classList.remove('hidden');
    else { clear.classList.add('hidden'); window.clearSearch(); return; }
    if (query.length < 2) return;

    const q = query.toLowerCase();
    let results = [];

    // Merge sampleData with API server users (include pending too)
    let serverUsers = [];
    try { serverUsers = JSON.parse(localStorage.getItem('gfa_users_cache') || '[]'); } catch(e) {}
    // Also try localStorage fallback
    const lsUsers = JSON.parse(localStorage.getItem('gfa_users') || '[]');
    const allUsers = serverUsers.length > 0 ? serverUsers : lsUsers;
    const lsStudents = allUsers.filter(u => u.role === 'student');
    const lsTeachers = allUsers.filter(u => u.role === 'teacher');
    const allStudents = [...students, ...lsStudents.filter(u => !students.find(s => s.id === u.id))];
    const allTeachers = [...teachers, ...lsTeachers.filter(u => !teachers.find(t => t.id === u.id))];
    const allNotices  = JSON.parse(localStorage.getItem('gfa_notices') || JSON.stringify(notices));
    const allEvents   = JSON.parse(localStorage.getItem('gfa_events')  || JSON.stringify(events));

    if (currentFilter === 'all' || currentFilter === 'students') {
      const matched = allStudents.filter(s =>
        (s.name||'').toLowerCase().includes(q) || (s.id||'').toLowerCase().includes(q) ||
        (s.roll||'').toString().includes(q) || (s.class||'').toLowerCase().includes(q) ||
        (s.section||'').toLowerCase().includes(q) || (s.batch||'').toLowerCase().includes(q) ||
        (s.email||'').toLowerCase().includes(q)
      ).map(s => ({ ...s, type: 'student' }));
      results = [...results, ...matched];
    }

    if (currentFilter === 'all' || currentFilter === 'teachers') {
      const matched = allTeachers.filter(t =>
        (t.name||'').toLowerCase().includes(q) || (t.subject||'').toLowerCase().includes(q) ||
        (t.id||'').toLowerCase().includes(q) || (t.email||'').toLowerCase().includes(q)
      ).map(t => ({ ...t, type: 'teacher' }));
      results = [...results, ...matched];
    }

    if (currentFilter === 'all' || currentFilter === 'notices') {
      const matched = allNotices.filter(n =>
        (n.title||'').toLowerCase().includes(q) || (n.category||'').toLowerCase().includes(q) ||
        (n.content||'').toLowerCase().includes(q)
      ).map(n => ({ ...n, type: 'notice' }));
      results = [...results, ...matched];
    }

    if (currentFilter === 'all' || currentFilter === 'events') {
      const matched = allEvents.filter(e =>
        (e.title||'').toLowerCase().includes(q) || (e.category||'').toLowerCase().includes(q) ||
        (e.description||'').toLowerCase().includes(q)
      ).map(e => ({ ...e, type: 'event' }));
      results = [...results, ...matched];
    }

    renderSearchResults(results, query);
  };

  function renderSearchResults(results, query) {
    const container = document.getElementById('searchResults');
    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty"><div style="margin-bottom:12px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div><div class="font-semibold" style="font-size:16px;margin-bottom:6px;">No results found</div><div class="text-muted text-sm">Try different keywords or filters</div></div>`;
      return;
    }

    const highlight = (text, q) => {
      const regex = new RegExp(`(${q})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    const html = results.slice(0, 12).map(r => {
      if (r.type === 'student') return `
        <div class="search-result-item" onclick="closeSearch();navigate('student-profile','${r.id}')">
          <img src="${r.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+encodeURIComponent(r.name)}" class="avatar avatar-md" alt="${r.name}" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
          <div class="search-result-info">
            <div class="font-semibold text-sm">${highlight(r.name, query)}</div>
            <div class="text-xs text-muted">${[r.class, r.section?'Sec '+r.section:'', r.batch, r.roll?'Roll '+r.roll:''].filter(Boolean).join(' · ')}</div>
          </div>
          <span class="badge badge-primary">Student</span>
        </div>`;
      if (r.type === 'teacher') return `
        <div class="search-result-item" onclick="closeSearch();navigate('teacher-profile','${r.id}')">
          <img src="${r.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+encodeURIComponent(r.name)}" class="avatar avatar-md" alt="${r.name}" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">
          <div class="search-result-info">
            <div class="font-semibold text-sm">${highlight(r.name, query)}</div>
            <div class="text-xs text-muted">${[r.subject, r.qualification].filter(Boolean).join(' · ')}</div>
          </div>
          <span class="badge badge-purple">Teacher</span>
        </div>`;
      if (r.type === 'notice') return `
        <div class="search-result-item" onclick="closeSearch();navigate('notices')">
          <div class="search-result-icon" style="background:var(--primary-50);color:var(--primary);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></div>
          <div class="search-result-info">
            <div class="font-semibold text-sm">${highlight(r.title, query)}</div>
            <div class="text-xs text-muted">${r.category} · ${r.date}</div>
          </div>
          <span class="badge badge-warning">Notice</span>
        </div>`;
      if (r.type === 'event') return `
        <div class="search-result-item" onclick="closeSearch();navigate('events')">
          <div class="search-result-icon" style="background:#f0fdf4;color:#059669;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div class="search-result-info">
            <div class="font-semibold text-sm">${highlight(r.title, query)}</div>
            <div class="text-xs text-muted">${r.category} · ${r.date} · ${r.location}</div>
          </div>
          <span class="badge badge-success">Event</span>
        </div>`;
      return '';
    }).join('');

    container.innerHTML = `
      <div class="search-results-header">
        <span class="text-sm text-muted">${results.length} result${results.length !== 1 ? 's' : ''} found</span>
      </div>
      ${html}
    `;
  }

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); window.openSearch(); }
    if (e.key === 'Escape') window.closeSearch();
  });
}
