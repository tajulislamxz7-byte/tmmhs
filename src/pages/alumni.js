// ================================================
// ALUMNI PAGE
// ================================================

import { api } from '../utils/api.js';
import { icon } from '../utils/icons.js';

const COUNTRY_FLAGS = { USA:'🇺🇸', UK:'🇬🇧', Bangladesh:'🇧🇩', Canada:'🇨🇦', Australia:'🇦🇺', Germany:'🇩🇪', Japan:'🇯🇵' };

// Get all alumni from API/localStorage
async function fetchAlumni() {
  const apiUsers = await api.getUsers();
  const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  return users.filter(u => u.role === 'alumni' && u.status === 'active').map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone || '—',
    avatar: a.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.name)}`,
    graduationYear: a.graduationYear || '2024',
    profession: a.profession || 'Professional',
    company: a.company || 'Company',
    university: a.university || 'University',
    location: a.location || 'Bangladesh',
    bio: a.bio || 'Proud alumni of Tiarkhali M.M High School.',
    skills: a.skills || [],
    achievements: a.achievements || [],
    address: a.address || '—',
  }));
}

// Alumni Dashboard
export function renderAlumniDashboard(user) {
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Dashboard</div>
              <h1 class="page-title">Alumni Profile</h1>
              <p class="page-subtitle">Welcome back, ${user.name.split(' ')[0]}!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container section-sm">
        <div class="dashboard-grid">
          <!-- Sidebar -->
          <div class="dashboard-sidebar">
            <div class="sidebar-user">
              <img src="${user.avatar}" alt="${user.name}" class="avatar avatar-xl mb-3">
              <div class="font-bold">${user.name}</div>
              <div class="text-xs text-muted mb-2">${user.id}</div>
              <span class="badge badge-primary">Alumni</span>
            </div>
            <nav>
              <div class="sidebar-nav-item active">
                ${icon('user', 18)}
                <span>Profile</span>
              </div>
              <div class="sidebar-nav-item" onclick="navigate('messages')">
                ${icon('messageSquare', 18)}
                <span>Messages</span>
              </div>
              <div class="sidebar-nav-item" onclick="navigate('alumni')">
                ${icon('users', 18)}
                <span>Alumni Network</span>
              </div>
              <div class="sidebar-nav-item" onclick="navigate('events')">
                ${icon('calendar', 18)}
                <span>Events</span>
              </div>
            </nav>
          </div>

          <!-- Main Content -->
          <div>
            <!-- Profile Card -->
            <div class="card mb-6">
              <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3>Profile Information</h3>
                <button class="btn btn-secondary btn-sm" onclick="editAlumniProfile('${user.id}')">
                  ${icon('edit', 14)} Edit Profile
                </button>
              </div>
              <div class="card-body">
                <div class="grid-2 gap-6">
                  <div>
                    <h4 class="text-sm font-bold text-muted mb-3">PERSONAL DETAILS</h4>
                    <div class="flex flex-col gap-3">
                      <div class="info-row">
                        <div class="info-icon">${icon('mail', 18)}</div>
                        <div><div class="text-xs text-muted">Email</div><div class="font-medium">${user.email}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('phone', 18)}</div>
                        <div><div class="text-xs text-muted">Phone</div><div class="font-medium">${user.phone || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('mapPin', 18)}</div>
                        <div><div class="text-xs text-muted">Location</div><div class="font-medium">${user.location || user.address || '—'}</div></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-muted mb-3">PROFESSIONAL DETAILS</h4>
                    <div class="flex flex-col gap-3">
                      <div class="info-row">
                        <div class="info-icon">${icon('briefcase', 18)}</div>
                        <div><div class="text-xs text-muted">Profession</div><div class="font-medium">${user.profession || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('building', 18)}</div>
                        <div><div class="text-xs text-muted">Company</div><div class="font-medium">${user.company || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('award', 18)}</div>
                        <div><div class="text-xs text-muted">University</div><div class="font-medium">${user.university || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('calendar', 18)}</div>
                        <div><div class="text-xs text-muted">Graduation Year</div><div class="font-medium">${user.graduationYear || user.batch || '—'}</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                ${user.bio ? `
                  <div class="mt-6 pt-6" style="border-top:1px solid var(--border);">
                    <h4 class="text-sm font-bold text-muted mb-3">BIO</h4>
                    <p class="text-secondary">${user.bio}</p>
                  </div>
                ` : ''}

                ${user.skills && user.skills.length > 0 ? `
                  <div class="mt-6 pt-6" style="border-top:1px solid var(--border);">
                    <h4 class="text-sm font-bold text-muted mb-3">SKILLS</h4>
                    <div class="flex flex-wrap gap-2">
                      ${user.skills.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${user.achievements && user.achievements.length > 0 ? `
                  <div class="mt-6 pt-6" style="border-top:1px solid var(--border);">
                    <h4 class="text-sm font-bold text-muted mb-3">ACHIEVEMENTS</h4>
                    <ul class="flex flex-col gap-2">
                      ${user.achievements.map(a => `<li class="flex items-start gap-2"><span class="text-primary">•</span><span class="text-secondary">${a}</span></li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Quick Links -->
            <div class="grid-2 gap-4">
              <div class="card" style="cursor:pointer;" onclick="navigate('messages')">
                <div class="card-body" style="padding:20px;">
                  <div class="flex items-center gap-4">
                    <div style="width:48px;height:48px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;">
                      ${icon('messageSquare', 24, 'var(--primary)')}
                    </div>
                    <div>
                      <div class="font-bold">Messages</div>
                      <div class="text-xs text-muted">Connect with alumni</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card" style="cursor:pointer;" onclick="navigate('events')">
                <div class="card-body" style="padding:20px;">
                  <div class="flex items-center gap-4">
                    <div style="width:48px;height:48px;border-radius:12px;background:var(--success-50);display:flex;align-items:center;justify-content:center;">
                      ${icon('calendar', 24, 'var(--success)')}
                    </div>
                    <div>
                      <div class="font-bold">Events</div>
                      <div class="text-xs text-muted">View upcoming events</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function renderAlumni() {
  const alumni = await fetchAlumni();
  const byYear = {};
  alumni.forEach(a => {
    if (!byYear[a.graduationYear]) byYear[a.graduationYear] = [];
    byYear[a.graduationYear].push(a);
  });
  
  const totalAlumni = alumni.length;

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
              {l:'Total Alumni',v:totalAlumni,svg:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',c:'var(--primary)'},
              {l:'Registered',v:alumni.length,svg:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',c:'var(--success)'},
              {l:'Active',v:alumni.length,svg:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',c:'var(--warning)'},
              {l:'Graduation Years',v:Object.keys(byYear).length,svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',c:'var(--secondary)'},
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
            <span class="text-secondary">${a.location}</span>
          </div>
        </div>
        <div class="flex gap-2 mt-4" style="padding-top:12px;">
          ${(a.socialMedia?.linkedin || a.linkedin) ? `<a href="${a.socialMedia?.linkedin || a.linkedin || '#'}" target="_blank" class="btn btn-secondary btn-sm" style="flex:1;" onclick="event.stopPropagation()">LinkedIn</a>` : ''}
          ${(a.socialMedia?.facebook || a.facebook) ? `<a href="${a.socialMedia?.facebook || a.facebook || '#'}" target="_blank" class="btn btn-secondary btn-sm" style="flex:1;" onclick="event.stopPropagation()">Facebook</a>` : ''}
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

window.editAlumniProfile = function(id) {
  showToast('Profile editing feature coming soon!', 'info');
};
