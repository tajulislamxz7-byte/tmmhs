// ================================================
// EVENTS PAGE
// ================================================

import { events as sampleEvents } from '../data/schoolConfig.js';

function getEvents() {
  const stored = JSON.parse(localStorage.getItem('gfa_events') || 'null');
  return stored !== null ? stored : sampleEvents;
}

export function renderEvents() {
  const events = getEvents();
  const upcoming = [...events].sort((a,b) => new Date(a.date) - new Date(b.date));

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Calendar</div>
              <h1 class="page-title">Events</h1>
              <p class="page-subtitle">Upcoming school events, activities, and important dates</p>
            </div>
            <button class="btn btn-primary" onclick="showToast('Add event dialog...','info')">+ Add Event</button>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <!-- Category Filters -->
        <div class="filters-scroll-container" style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 calc(-1 * var(--space-4));padding:0 var(--space-4) 4px var(--space-4);">
          <div class="flex gap-2 mb-6" style="min-width:max-content;">
            ${['All','Academic','Sports','Tour','Farewell','Reunion','Prize Giving'].map(cat=>`
              <button class="search-filter ${cat==='All'?'active':''}" onclick="filterEvents('${cat}',this)">${cat}</button>
            `).join('')}
          </div>
        </div>

        <!-- Events Grid -->
        <div class="events-grid" id="eventsGrid">
          ${upcoming.length === 0
            ? `<div class="text-center text-muted" style="padding:60px 0;grid-column:1/-1;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin:0 auto 16px;display:block;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div class="font-semibold">No events scheduled yet</div>
               </div>`
            : upcoming.map(e => renderEventCard(e)).join('')
          }
        </div>
      </div>
    </div>
  `;
}

const CAT_COLORS = {
  Academic: '#2563eb', Sports: '#059669', Tour: '#d97706',
  Farewell: '#7c3aed', Reunion: '#dc2626', 'Prize Giving': '#0891b2', Other: '#64748b',
};

const CAT_SVG = {
  Academic:     '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  Sports:       '<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>',
  Tour:         '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  Farewell:     '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  Reunion:      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
  'Prize Giving':'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
};

function renderEventCard(ev) {
  const color = CAT_COLORS[ev.category] || '#2563eb';
  const svg   = CAT_SVG[ev.category] || '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>';
  const date  = new Date(ev.date);
  return `
    <div class="card event-card" data-category="${ev.category}" style="cursor:pointer;" onclick="openEvent('${ev.id}')">
      <div class="event-card-header" style="background:linear-gradient(135deg,${color},${color}cc);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">${svg}</svg>
          </div>
          <span class="badge" style="background:rgba(255,255,255,0.2);color:white;">${ev.category}</span>
        </div>
        <div style="margin-top:16px;">
          <div style="color:rgba(255,255,255,0.8);font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">${date.toLocaleString('default',{month:'long'})} ${date.getFullYear()}</div>
          <div style="color:white;font-size:32px;font-weight:900;line-height:1;">${date.getDate()}</div>
        </div>
      </div>
      <div class="card-body">
        <div class="font-bold" style="font-size:16px;margin-bottom:8px;">${ev.title}</div>
        <p class="text-secondary text-sm line-clamp-2" style="margin-bottom:12px;">${ev.description}</p>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted);">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${ev.time || 'TBA'}
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted);">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${ev.location || 'School Campus'}
          </div>
        </div>
        <button class="btn btn-primary w-full btn-sm" onclick="(function(e){e.stopPropagation();showToast('Registered for event!','success');})(event)">
          Register / RSVP
        </button>
      </div>
    </div>
  `;
}

window.filterEvents = function(cat, btn) {
  document.querySelectorAll('.search-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.event-card').forEach(card => {
    card.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
  });
};

window.openEvent = function(id) {
  showToast('Opening event detail...', 'info');
};
