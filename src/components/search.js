// ================================================
// GLOBAL SEARCH COMPONENT - MERIDIAN DESIGN
// ================================================

import { students, teachers, notices, events } from '../data/schoolConfig.js';

export function renderSearchInNavbar() {
  return `
    <div class="search-root" id="searchRoot">
      <form class="search-shell" id="searchShell" role="search" aria-label="Site search">
        <button type="button" class="search-toggle-icon" id="searchToggle" aria-label="Open search" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <div class="search-input-wrap">
          <input
            type="text"
            id="globalSearchInput"
            role="combobox"
            aria-expanded="false"
            aria-controls="resultsPanel"
            aria-autocomplete="list"
            aria-label="Search anything"
            autocomplete="off"
            spellcheck="false"
            placeholder="Search students, teachers, notices...">
          <button type="button" class="icon-btn clear-btn" id="searchClear" aria-label="Clear search" tabindex="-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/>
            </svg>
          </button>
          <kbd class="esc-hint">esc</kbd>
        </div>
      </form>
      <div class="panel" id="resultsPanel"></div>
    </div>
  `;
}

export function initSearch() {
  const searchRoot = document.getElementById('searchRoot');
  const shell = document.getElementById('searchShell');
  const toggleBtn = document.getElementById('searchToggle');
  const input = document.getElementById('globalSearchInput');
  const clearBtn = document.getElementById('searchClear');
  const resultsPanel = document.getElementById('resultsPanel');

  // If search elements don't exist, return early
  if (!searchRoot || !shell || !toggleBtn || !input || !clearBtn || !resultsPanel) {
    return;
  }

  let state = {
    expanded: false,
    resultsOpen: false,
    loadingTimer: null
  };

  // Helper functions
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'": '&#39;'
    })[c]);
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) + '<mark>' + 
           escapeHtml(text.slice(idx, idx + q.length)) + '</mark>' + 
           escapeHtml(text.slice(idx + q.length));
  }

  // Expand/Collapse
  function expandSearch() {
    if (state.expanded) return;
    state.expanded = true;
    shell.classList.add('expanded');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Search open');
    setTimeout(() => input.focus(), 260);
  }

  function collapseSearch() {
    if (!state.expanded) return;
    state.expanded = false;
    shell.classList.remove('expanded');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open search');
    input.blur();
    closeResults();
  }

  window.openSearch = function() {
    expandSearch();
  };

  window.closeSearch = function() {
    collapseSearch();
    input.value = '';
    clearBtn.classList.remove('show');
    closeResults();
  };

  // Results
  function openResults() {
    state.resultsOpen = true;
    resultsPanel.classList.add('show');
  }


  function closeResults() {
    state.resultsOpen = false;
    resultsPanel.classList.remove('show');
    if (state.loadingTimer) {
      clearTimeout(state.loadingTimer);
      state.loadingTimer = null;
    }
  }

  // Perform search
  function performSearch(query) {
    query = query.trim();
    if (!query) return;

    // Show loading
    resultsPanel.innerHTML = `
      <div class="state-loading">
        <div class="loading-dots"><span></span><span></span><span></span></div>
        <p>Searching for "${escapeHtml(query)}"...</p>
      </div>`;
    openResults();

    // Delay for effect
    if (state.loadingTimer) clearTimeout(state.loadingTimer);
    state.loadingTimer = setTimeout(() => renderResults(query), 400);
  }

  function renderResults(query) {
    const q = query.toLowerCase();
    let results = [];

    // Get all data sources
    let serverUsers = [];
    try { serverUsers = JSON.parse(localStorage.getItem('gfa_users_cache') || '[]'); } catch(e) {}
    const lsUsers = JSON.parse(localStorage.getItem('gfa_users') || '[]');
    const allUsers = serverUsers.length > 0 ? serverUsers : lsUsers;
    const lsStudents = allUsers.filter(u => u.role === 'student');
    const lsTeachers = allUsers.filter(u => u.role === 'teacher');
    const allStudents = [...students, ...lsStudents.filter(u => !students.find(s => s.id === u.id))];
    const allTeachers = [...teachers, ...lsTeachers.filter(u => !teachers.find(t => t.id === u.id))];
    const allNotices = JSON.parse(localStorage.getItem('gfa_notices') || JSON.stringify(notices));
    const allEvents = JSON.parse(localStorage.getItem('gfa_events') || JSON.stringify(events));

    // Search students
    const matchedStudents = allStudents.filter(s =>
      (s.name||'').toLowerCase().includes(q) || (s.id||'').toLowerCase().includes(q) ||
      (s.roll||'').toString().includes(q) || (s.class||'').toLowerCase().includes(q) ||
      (s.section||'').toLowerCase().includes(q) || (s.batch||'').toLowerCase().includes(q) ||
      (s.email||'').toLowerCase().includes(q)
    ).map(s => ({
      title: s.name,
      subtitle: [s.class, s.section ? 'Sec ' + s.section : '', s.batch, s.roll ? 'Roll ' + s.roll : ''].filter(Boolean).join(' · '),
      category: 'Student',
      accent: 'var(--primary)',
      type: 'student',
      id: s.id,
      avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`
    }));


    // Search teachers
    const matchedTeachers = allTeachers.filter(t =>
      (t.name||'').toLowerCase().includes(q) || (t.subject||'').toLowerCase().includes(q) ||
      (t.id||'').toLowerCase().includes(q) || (t.email||'').toLowerCase().includes(q)
    ).map(t => ({
      title: t.name,
      subtitle: [t.subject, t.qualification].filter(Boolean).join(' · '),
      category: 'Teacher',
      accent: 'var(--secondary)',
      type: 'teacher',
      id: t.id,
      avatar: t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`
    }));

    // Search notices
    const matchedNotices = allNotices.filter(n =>
      (n.title||'').toLowerCase().includes(q) || (n.category||'').toLowerCase().includes(q) ||
      (n.content||'').toLowerCase().includes(q)
    ).map(n => ({
      title: n.title,
      subtitle: n.category + ' · ' + n.date,
      category: 'Notice',
      accent: '#f59e0b',
      type: 'notice'
    }));

    // Search events
    const matchedEvents = allEvents.filter(e =>
      (e.title||'').toLowerCase().includes(q) || (e.category||'').toLowerCase().includes(q) ||
      (e.description||'').toLowerCase().includes(q)
    ).map(e => ({
      title: e.title,
      subtitle: e.category + ' · ' + e.date + ' · ' + e.location,
      category: 'Event',
      accent: '#059669',
      type: 'event'
    }));

    results = [...matchedStudents, ...matchedTeachers, ...matchedNotices, ...matchedEvents];

    // Render results
    const header = `
      <div class="results-header">
        <span>${results.length ? `<b>${results.length}</b> result${results.length === 1 ? '' : 's'} for "${escapeHtml(query)}"` : 'Results'}</span>
        <button type="button" class="panel-close" id="resultsCloseBtn" aria-label="Close results">&times;</button>
      </div>`;


    if (results.length === 0) {
      resultsPanel.innerHTML = header + `
        <div class="state-empty">
          <span class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="7.6"/><line x1="21.5" y1="21.5" x2="16.4" y2="16.4"/><line x1="7.6" y1="11" x2="14.4" y2="11"/>
            </svg>
          </span>
          <h4>No results found</h4>
          <p>We couldn't find anything for "${escapeHtml(query)}". Try different keywords or check your spelling.</p>
        </div>`;
    } else {
      const cards = results.map((item, i) => {
        const iconSvg = item.type === 'student' || item.type === 'teacher'
          ? `<img src="${item.avatar}" class="avatar avatar-md" alt="${item.title}" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=default'">`
          : `<span class="result-icon" style="--accent:${item.accent}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                ${item.type === 'notice' ? '<path d="M6.2 10.3a5.8 5.8 0 0 1 11.6 0c0 3.9 1.4 5.3 1.4 5.3H4.8s1.4-1.4 1.4-5.3z"/><path d="M9.6 17.8a2.4 2.4 0 0 0 4.8 0"/>' : '<rect x="3.4" y="5" width="17.2" height="15" rx="2.2"/><path d="M3.4 9.6h17.2"/><path d="M8 3v4M16 3v4"/>'}
              </svg>
            </span>`;
        
        const clickAction = item.type === 'student' ? `closeSearch();navigate('student-profile','${item.id}')` :
                           item.type === 'teacher' ? `closeSearch();navigate('teacher-profile','${item.id}')` :
                           item.type === 'notice' ? `closeSearch();navigate('notices')` :
                           `closeSearch();navigate('events')`;
        
        return `
          <article class="result-card" tabindex="0" style="animation-delay:${i*45}ms" onclick="${clickAction}">
            ${iconSvg}
            <span class="result-body">
              <span class="result-top">
                <h4 class="result-title">${highlight(item.title, query)}</h4>
                <span class="result-badge" style="--accent:${item.accent}">${escapeHtml(item.category)}</span>
              </span>
              <p class="result-desc">${escapeHtml(item.subtitle)}</p>
            </span>
            <span class="result-arrow">&rarr;</span>
          </article>`;
      }).join('');
      
      resultsPanel.innerHTML = header + `<div class="results-list">${cards}</div>`;
      
      // Animate cards
      setTimeout(() => {
        document.querySelectorAll('.result-card').forEach(el => el.classList.add('stagger-in'));
      }, 10);
    }

    // Close button
    const closeBtn = document.getElementById('resultsCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeResults);
  }


  // Event handlers
  toggleBtn.addEventListener('click', () => {
    if (!state.expanded) expandSearch();
    else input.focus();
  });

  shell.addEventListener('click', () => {
    if (!state.expanded) expandSearch();
  });

  shell.addEventListener('submit', e => e.preventDefault());

  input.addEventListener('input', () => {
    const q = input.value;
    clearBtn.classList.toggle('show', q.length > 0);

    shell.classList.remove('typing-glow');
    void shell.offsetWidth;
    shell.classList.add('typing-glow');

    if (q.trim().length > 0) {
      performSearch(q.trim());
    } else {
      closeResults();
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.value.trim().length > 0) {
        performSearch(input.value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (state.resultsOpen) closeResults();
      else collapseSearch();
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('show');
    closeResults();
    input.focus();
  });

  // Global events
  document.addEventListener('click', e => {
    if (!searchRoot.contains(e.target) && !e.target.closest('.search-root')) {
      closeResults();
      if (input.value.trim() === '') collapseSearch();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input) {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        window.openSearch();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      window.openSearch();
    }
    if (e.key === 'Escape') {
      if (state.resultsOpen) closeResults();
      else if (state.expanded) collapseSearch();
    }
  });
}
