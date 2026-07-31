// ================================================
// SUPPORT STAFF PAGE
// ================================================

import { api } from '../utils/api.js';
import { icon } from '../utils/icons.js';

// Get all staff from API/localStorage
async function fetchStaff() {
  const apiUsers = await api.getUsers();
  const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  return users.filter(u => u.role === 'staff' && u.status === 'active').map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone || '—',
    avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`,
    position: s.position || 'Staff Member',
    department: s.department || 'General',
    bio: s.bio || 'Dedicated staff member supporting school operations.',
    skills: s.skills || [],
    achievements: s.achievements || [],
    address: s.address || '—',
  }));
}

// Staff Dashboard
export async function renderStaffDashboard(user) {
  // Fetch fresh user data from API to ensure we have latest info
  try {
    const apiUsers = await api.getUsers();
    const users = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
    const freshUser = users.find(u => u.id === user.id);
    if (freshUser) {
      // Update session with fresh data
      localStorage.setItem('gfa_session', JSON.stringify(freshUser));
      user = freshUser;
    }
  } catch(e) {
    console.warn('Could not fetch fresh user data:', e);
  }

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Dashboard</div>
              <h1 class="page-title">Staff Profile</h1>
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
              <span class="badge badge-secondary">Staff</span>
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
              <div class="sidebar-nav-item" onclick="navigate('staff')">
                ${icon('users', 18)}
                <span>Staff Team</span>
              </div>
              <div class="sidebar-nav-item" onclick="navigate('events')">
                ${icon('calendar', 18)}
                <span>Events</span>
              </div>
              <div class="sidebar-nav-item" onclick="navigate('notices')">
                ${icon('bell', 18)}
                <span>Notices</span>
              </div>
            </nav>
          </div>

          <!-- Main Content -->
          <div>
            <!-- Profile Card -->
            <div class="card mb-6">
              <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
                <h3>Profile Information</h3>
                <button class="btn btn-secondary btn-sm" onclick="editStaffProfile('${user.id}')">
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
                        <div><div class="text-xs text-muted">Address</div><div class="font-medium">${user.address || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('droplet', 18)}</div>
                        <div><div class="text-xs text-muted">Blood Group</div><div class="font-medium">${user.bloodGroup || '—'}</div></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-muted mb-3">WORK DETAILS</h4>
                    <div class="flex flex-col gap-3">
                      <div class="info-row">
                        <div class="info-icon">${icon('briefcase', 18)}</div>
                        <div><div class="text-xs text-muted">Position</div><div class="font-medium">${user.position || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('building', 18)}</div>
                        <div><div class="text-xs text-muted">Department</div><div class="font-medium">${user.department || '—'}</div></div>
                      </div>
                      <div class="info-row">
                        <div class="info-icon">${icon('calendar', 18)}</div>
                        <div><div class="text-xs text-muted">Status</div><div class="font-medium">${user.status || 'Active'}</div></div>
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
                      ${user.skills.map(s => `<span class="badge badge-secondary">${s}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${user.achievements && user.achievements.length > 0 ? `
                  <div class="mt-6 pt-6">
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
                      <div class="text-xs text-muted">Connect with team</div>
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
                      <div class="text-xs text-muted">View school events</div>
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

window.editStaffProfile = async function(id) {
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
      <form id="editStaffForm" class="modal-body" style="max-height:70vh;overflow-y:auto;">
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
          <label>Position</label>
          <input type="text" name="position" value="${user.position || ''}" placeholder="e.g., Office Manager, Librarian">
        </div>
        <div class="form-group">
          <label>Department</label>
          <select name="department">
            <option value="">Select Department</option>
            <option value="Administration" ${user.department === 'Administration' ? 'selected' : ''}>Administration</option>
            <option value="Library" ${user.department === 'Library' ? 'selected' : ''}>Library</option>
            <option value="Maintenance" ${user.department === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
            <option value="Security" ${user.department === 'Security' ? 'selected' : ''}>Security</option>
            <option value="ICT" ${user.department === 'ICT' ? 'selected' : ''}>ICT</option>
            <option value="Science Lab" ${user.department === 'Science Lab' ? 'selected' : ''}>Science Lab</option>
            <option value="General" ${user.department === 'General' ? 'selected' : ''}>General</option>
          </select>
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
          <input type="text" name="skills" value="${(user.skills || []).join(', ')}" placeholder="e.g., Office Management, Administration">
        </div>
        <div class="form-group">
          <label>Achievements (comma-separated)</label>
          <textarea name="achievements" rows="2" placeholder="e.g., Best Employee 2024, 10 Years Service">${(user.achievements || []).join(', ')}</textarea>
        </div>
        <div class="flex gap-3 justify-end mt-4">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('editStaffForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      name: `${form.firstName.value.trim()} ${form.lastName.value.trim()}`,
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      position: form.position.value.trim(),
      department: form.department.value,
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
      // Reload the page to show updated data
      window.location.reload();
    } else {
      showToast(result?.error || 'Failed to update profile', 'error');
    }
  };
};

export async function renderStaff() {
  const supportStaff = await fetchStaff();
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
          <span class="badge badge-secondary">${s.department}</span>
        </div>
        <p class="text-xs text-muted line-clamp-2">${s.bio}</p>
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

window.viewStaffProfile = async function(id) {
  const staff = await fetchStaff();
  const member = staff.find(s => s.id === id);
  if (!member) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if(e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="modal" style="max-width:500px;">
      <div class="modal-header">
        <div class="font-semibold">Staff Profile</div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="${member.avatar}" alt="${member.name}" class="avatar avatar-xl" style="margin:0 auto 12px;">
          <div class="font-bold" style="font-size:18px;margin-bottom:4px;">${member.name}</div>
          <div class="text-xs text-muted mb-3">${member.id}</div>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <span class="badge badge-primary">${member.position}</span>
            <span class="badge badge-secondary">${member.department}</span>
          </div>
        </div>
        
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div class="text-xs text-muted">Position</div>
              <div class="font-medium text-sm">${member.position}</div>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div>
              <div class="text-xs text-muted">Department</div>
              <div class="font-medium text-sm">${member.department}</div>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <div class="text-xs text-muted">Phone</div>
              <div class="font-medium text-sm">${member.phone}</div>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
              </svg>
            </div>
            <div>
              <div class="text-xs text-muted">Email</div>
              <div class="font-medium text-sm" style="word-break:break-all;">${member.email}</div>
            </div>
          </div>
        </div>
        
        ${member.bio ? `
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
            <div class="text-xs font-bold text-muted mb-2">BIO</div>
            <p class="text-sm text-secondary" style="line-height:1.6;">${member.bio}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};
