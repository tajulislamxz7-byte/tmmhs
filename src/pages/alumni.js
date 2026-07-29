// ================================================
// ALUMNI PAGE
// ================================================

import { alumni } from '../data/sampleData.js';

const COUNTRY_FLAGS = { USA:'🇺🇸', UK:'🇬🇧', Bangladesh:'🇧🇩', Canada:'🇨🇦', Australia:'🇦🇺', Germany:'🇩🇪', Japan:'🇯🇵' };

export function renderAlumni() {
  const byYear = {};
  alumni.forEach(a => {
    if (!byYear[a.graduationYear]) byYear[a.graduationYear] = [];
    byYear[a.graduationYear].push(a);
  });

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Network</div>
              <h1 class="page-title">Alumni Network</h1>
              <p class="page-subtitle">Our graduates — leaders, innovators, and changemakers around the world</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div style="background:var(--bg-secondary);border-bottom:1px solid var(--border);">
        <div class="container" style="padding-top:24px;padding-bottom:24px;">
          <div class="grid-4 gap-4">
            ${[
              {l:'Total Alumni',v:'8,500+',svg:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',c:'var(--primary)'},
              {l:'Countries',v:'42',svg:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',c:'var(--success)'},
              {l:'Industries',v:'60+',svg:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',c:'var(--warning)'},
              {l:'Graduation Years',v:'38',svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',c:'var(--secondary)'},
            ].map(s=>`
              <div class="card">
                <div class="card-body" style="padding:16px 20px;">
                  <div class="flex items-center gap-3">
                    <div style="width:40px;height:40px;border-radius:12px;background:${s.c}15;display:flex;align-items:center;justify-content:center;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${s.c}" stroke-width="2">${s.svg}</svg>
                    </div>
                    <div><div style="font-size:22px;font-weight:800;color:${s.c};">${s.v}</div><div class="text-xs text-muted">${s.l}</div></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="container section-sm">
        <!-- Search & Filter -->
        <div class="filters-bar card mb-6">
          <div class="card-body" style="padding:16px 20px;">
            <div class="flex items-center gap-4 flex-wrap">
              <div class="search-inline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" placeholder="Search alumni by name, profession, company..." id="alumniSearch" oninput="filterAlumni()" class="search-input-inline">
              </div>
              <select class="form-input form-select" id="alumniYearFilter" onchange="filterAlumni()" style="width:auto;">
                <option value="">All Years</option>
                ${[...new Set(alumni.map(a=>a.graduationYear))].sort((a,b)=>b-a).map(y=>`<option value="${y}">${y}</option>`).join('')}
              </select>
              <select class="form-input form-select" id="alumniCountryFilter" onchange="filterAlumni()" style="width:auto;">
                <option value="">All Countries</option>
                ${[...new Set(alumni.map(a=>a.country))].map(c=>`<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Alumni Grid -->
        <div class="alumni-grid" id="alumniGrid">
          ${alumni.map(a => renderAlumniCard(a)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAlumniCard(a) {
  const flag = COUNTRY_FLAGS[a.country] || '🌍';
  return `
    <div class="card" data-name="${a.name.toLowerCase()}" data-year="${a.graduationYear}" data-country="${a.country}" data-profession="${a.profession.toLowerCase()}" data-company="${a.company.toLowerCase()}">
      <div class="card-body" style="padding:24px;">
        <div class="flex items-start gap-4 mb-4">
          <img src="${a.avatar}" alt="${a.name}" class="avatar avatar-lg" style="flex-shrink:0;">
          <div class="flex-1 min-w-0">
            <div class="font-bold" style="font-size:15px;">${a.name}</div>
            <div class="text-xs text-muted mb-1">${a.id}</div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="badge badge-primary">${a.profession}</span>
              <span class="badge badge-gray">Class of ${a.graduationYear}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span class="text-secondary">${a.company}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            <span class="text-secondary">${a.university}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="text-secondary">${a.currentCity}, ${a.country}</span>
          </div>
        </div>
        <div class="flex gap-2 mt-4 border-t border" style="padding-top:12px;">
          ${a.socialMedia.linkedin ? `<a href="${a.socialMedia.linkedin}" class="btn btn-secondary btn-sm" style="flex:1;" onclick="event.stopPropagation()">LinkedIn</a>` : ''}
          ${a.socialMedia.facebook ? `<a href="${a.socialMedia.facebook}" class="btn btn-secondary btn-sm" style="flex:1;" onclick="event.stopPropagation()">Facebook</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

window.filterAlumni = function() {
  const q = document.getElementById('alumniSearch')?.value?.toLowerCase() || '';
  const year = document.getElementById('alumniYearFilter')?.value || '';
  const country = document.getElementById('alumniCountryFilter')?.value || '';
  document.querySelectorAll('#alumniGrid .card').forEach(card => {
    const name = card.dataset.name || '';
    const prof = card.dataset.profession || '';
    const company = card.dataset.company || '';
    const cardYear = card.dataset.year || '';
    const cardCountry = card.dataset.country || '';
    const matchQ = !q || name.includes(q) || prof.includes(q) || company.includes(q);
    const matchYear = !year || cardYear === year;
    const matchCountry = !country || cardCountry === country;
    card.style.display = (matchQ && matchYear && matchCountry) ? '' : 'none';
  });
};
