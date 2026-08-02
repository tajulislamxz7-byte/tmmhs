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
  // Case-insensitive role filtering for Google Sign-In compatibility
  return users.filter(u => u.role && u.role.toLowerCase().trim() === 'alumni' && u.status === 'active').map(a => ({
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
                  <div class="mt-6 pt-6">
                    <h4 class="text-sm font-bold text-muted mb-3">BIO</h4>
                    <p class="text-secondary">${user.bio}</p>
                  </div>
                ` : ''}

                ${user.skills && user.skills.length > 0 ? `
                  <div class="mt-6 pt-6">
                    <h4 class="text-sm font-bold text-muted mb-3">SKILLS</h4>
                    <div class="flex flex-wrap gap-2">
                      ${user.skills.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${user.achievements && user.achievements.length > 0 ? `
                  <div class="mt-6 pt-6">
                    <h4 class="text-sm font-bold text-muted mb-3">ACHIEVEMENTS</h4>
                    <div class="flex flex-col gap-3">
                      ${user.achievements.map((a, idx) => `
                        <div style="display:flex;align-items:start;gap:12px;padding:12px;background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:12px;border-left:4px solid #f59e0b;">
                          <div style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(245,158,11,0.2);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5">
                              <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
                              <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                              <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
                            </svg>
                          </div>
                          <div style="flex:1;min-width:0;">
                            <div class="font-medium" style="font-size:13px;color:#92400e;line-height:1.4;">${a}</div>
                            <div style="font-size:10px;color:#b45309;opacity:0.8;margin-top:2px;">Achievement #${idx + 1}</div>
                          </div>
                        </div>
                      `).join('')}
                    </div>
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
          
          <!-- Search & Filter in header -->
          <div style="margin-top:32px;">
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1.5px solid rgba(255,255,255,0.2);border-radius:16px;padding:16px 20px;">
              <div class="search-inline" style="background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.3);flex:1;min-width:280px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" placeholder="Search alumni by name, profession, company..." id="alumniSearch" oninput="filterAlumni()" class="search-input-inline" style="color:white;">
              </div>
              <select class="form-input form-select" id="alumniYearFilter" onchange="filterAlumni()" style="width:auto;background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.3);color:white;">
                <option value="" style="color:#1e293b;">All Years</option>
                ${[...new Set(alumni.map(a=>a.graduationYear))].sort((a,b)=>b-a).map(y=>`<option value="${y}" style="color:#1e293b;">${y}</option>`).join('')}
              </select>
              <select class="form-input form-select" id="alumniCountryFilter" onchange="filterAlumni()" style="width:auto;background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.3);color:white;">
                <option value="" style="color:#1e293b;">All Countries</option>
                ${[...new Set(alumni.map(a=>a.country))].map(c=>`<option value="${c}" style="color:#1e293b;">${c}</option>`).join('')}
              </select>
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

window.editAlumniProfile = async function(id) {
  const apiUsers = await api.getUsers();
  const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  const user = users.find(u => u.id === id);
  if (!user) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if(e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:600px;">
      <div class="modal-header">
        <div class="font-semibold">Edit Profile</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <form id="editAlumniForm" class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value="${user.firstName || ''}" required>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value="${user.lastName || ''}" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value="${user.email || ''}" required>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value="${user.phone || ''}">
        </div>
        <div class="form-group">
          <label>Profession</label>
          <input type="text" name="profession" value="${user.profession || ''}" placeholder="e.g., Software Engineer, Doctor">
        </div>
        <div class="form-group">
          <label>Company</label>
          <input type="text" name="company" value="${user.company || ''}" placeholder="e.g., Google, Microsoft">
        </div>
        <div class="form-group">
          <label>University</label>
          <input type="text" name="university" value="${user.university || ''}" placeholder="e.g., BUET, Dhaka University">
        </div>
        <div class="form-group">
          <label>Graduation Year</label>
          <input type="text" name="graduationYear" value="${user.graduationYear || ''}" placeholder="e.g., 2020">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" name="location" value="${user.location || ''}" placeholder="e.g., Dhaka, Bangladesh">
        </div>
        <div class="form-group">
          <label>Blood Group</label>
          <select name="bloodGroup">
            <option value="">Select</option>
            ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => 
              `<option value="${bg}" ${user.bloodGroup === bg ? 'selected' : ''}>${bg}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Address</label>
          <textarea name="address" rows="2" placeholder="Enter address">${user.address || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea name="bio" rows="3" placeholder="Write a short bio...">${user.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Skills (comma-separated)</label>
          <input type="text" name="skills" value="${(user.skills || []).join(', ')}" placeholder="e.g., Python, Machine Learning">
        </div>
        <div class="form-group">
          <label>Achievements (comma-separated)</label>
          <textarea name="achievements" rows="2" placeholder="e.g., Published Papers, Awards">${(user.achievements || []).join(', ')}</textarea>
        </div>
        <div class="flex gap-3 justify-end mt-4">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('editAlumniForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      name: `${form.firstName.value.trim()} ${form.lastName.value.trim()}`,
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      profession: form.profession.value.trim(),
      company: form.company.value.trim(),
      university: form.university.value.trim(),
      graduationYear: form.graduationYear.value.trim(),
      location: form.location.value.trim(),
      bloodGroup: form.bloodGroup.value,
      address: form.address.value.trim(),
      bio: form.bio.value.trim(),
      skills: form.skills.value.split(',').map(s => s.trim()).filter(Boolean),
      achievements: form.achievements.value.split(',').map(a => a.trim()).filter(Boolean),
    };

    const result = await api.updateUser(id, data);
    if (result && result.ok !== false) {
      // Update session if editing own profile
      try {
        const session = JSON.parse(localStorage.getItem('gfa_session') || 'null');
        if (session && session.id === id) {
          Object.assign(session, data);
          localStorage.setItem('gfa_session', JSON.stringify(session));
        }
      } catch(e) {}
      
      showToast('Profile updated successfully!', 'success');
      modal.remove();
      window.location.reload();
    } else {
      showToast(result?.error || 'Failed to update profile', 'error');
    }
  };
};
