// ================================================
// BATCHES PAGE
// ================================================

import { batches as sampleBatches, students } from '../data/schoolConfig.js';
import { api } from '../utils/api.js';

// Get batches from API or localStorage fallback
async function fetchBatches() {
  const batches = await api.getBatches();
  return batches && batches.length > 0 ? batches : sampleBatches;
}

// Sync version for immediate use
function getBatches() {
  const stored = JSON.parse(localStorage.getItem('gfa_batches') || 'null');
  return stored && stored.length > 0 ? stored : sampleBatches;
}

export async function renderBatches() {
  const batches = await fetchBatches();
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Cohorts</div>
              <h1 class="page-title">Batches</h1>
              <p class="page-subtitle">Every batch — their story, their achievements, their people</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        ${batches.length === 0
          ? `<div class="card"><div class="card-body text-center text-muted" style="padding:60px;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin:0 auto 16px;display:block;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              No batches created yet.
             </div></div>`
          : `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px;">
              ${batches.map((b, i) => renderBatchCard(b, i)).join('')}
            </div>`
        }
      </div>
    </div>
  `;
}

const BATCH_COLORS = ['#2563eb','#7c3aed','#059669','#d97706','#dc2626'];

function renderBatchCard(b, i) {
  const color = BATCH_COLORS[i % BATCH_COLORS.length];
  return `
    <div class="card" style="cursor:pointer;overflow:hidden;" onclick="navigate('batch-detail','${b.id}')">
      <div style="height:6px;background:${color};"></div>
      <div class="card-body" style="padding:24px;">
        <div class="flex items-center justify-between mb-3">
          <div>
            <div class="font-bold" style="font-size:20px;font-family:var(--font-display);">${b.name}</div>
            <div class="text-xs text-muted">Passing Year: ${b.passingYear}</div>
          </div>
          <div style="width:52px;height:52px;border-radius:16px;background:${color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
        </div>
        <p class="text-sm text-secondary line-clamp-2 mb-4">${b.description}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="badge badge-gray">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${b.classTeacher}
          </span>
          <span class="badge badge-primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            ${b.totalStudents} students
          </span>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          ${b.achievements.slice(0,2).map(a=>`
            <span class="badge badge-success">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${a}
            </span>
          `).join('')}
        </div>
        <div class="flex items-center justify-between" style="padding-top:12px;margin-top:12px;">
          <span class="text-xs text-muted">View batch details</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:${color};"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  `;
}

export async function renderBatchDetail(batchId) {
  const batches = getBatches();
  const batch = batches.find(b => b.id === batchId) || batches[0];
  
  // Fetch fresh data from API first
  const apiUsers = await api.getUsers();
  const allUsers = apiUsers || JSON.parse(localStorage.getItem('gfa_users_cache') || localStorage.getItem('gfa_users') || '[]');
  
  // Filter for students with matching batch (batch is stored as string like "2026", "2027", "2028")
  const registeredStudents = allUsers.filter(u => u.role === 'student' && String(u.batch) === String(batchId)).map(u => {
    return {
      id: u.id,
      name: u.name,
      roll: u.roll || '—',
      class: u.class || 'N/A',
      section: u.section || 'N/A',
      batch: u.batch || 'N/A',
      avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
    };
  });
  
  // Merge with sample students from config (if any)
  const sampleBatchStudents = students.filter(s => String(s.batch) === String(batch.id));
  const batchStudents = [...sampleBatchStudents];
  registeredStudents.forEach(s => { 
    if (!batchStudents.find(x => x.id === s.id)) batchStudents.push(s); 
  });

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <button class="btn btn-secondary btn-sm mb-4" onclick="navigate('batches')" style="background:rgba(255,255,255,0.15);color:white;border-color:rgba(255,255,255,0.3);">← All Batches</button>
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Batch</div>
              <h1 class="page-title">${batch.name}</h1>
              <p class="page-subtitle">${batch.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <div class="grid" style="grid-template-columns:1fr 2fr;gap:24px;">
          <div class="flex flex-col gap-4">
            <div class="card">
              <div class="card-header"><div class="font-semibold">Batch Info</div></div>
              <div class="card-body">
                <div class="info-row">
                  <span class="info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                  <div><div class="text-xs text-muted">Passing Year</div><div class="font-medium">${batch.passingYear}</div></div>
                </div>
                <div class="info-row">
                  <span class="info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                  <div><div class="text-xs text-muted">Class Teacher</div><div class="font-medium">${batch.classTeacher}</div></div>
                </div>
                <div class="info-row">
                  <span class="info-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
                  <div><div class="text-xs text-muted">Total Students</div><div class="font-medium">${batch.totalStudents}</div></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header flex items-center justify-between">
                <div class="font-semibold">Achievements</div>
                <span class="badge badge-success">${batch.achievements.length}</span>
              </div>
              <div class="card-body">
                ${batch.achievements.map((a, idx) => `
                  <div class="achievement-item" style="display:flex;align-items:start;gap:12px;padding:12px;background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:12px;border-left:4px solid #f59e0b;margin-bottom:10px;">
                    <div style="width:36px;height:36px;border-radius:10px;background:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(245,158,11,0.2);">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div style="flex:1;min-width:0;">
                      <div class="font-medium" style="font-size:13px;color:#92400e;line-height:1.4;">${a}</div>
                      <div style="font-size:10px;color:#b45309;opacity:0.8;margin-top:2px;">Batch Achievement • #${idx + 1}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header flex items-center justify-between">
              <div class="font-semibold">Student List</div>
              <span class="badge badge-primary">${batchStudents.length} students</span>
            </div>
            <div class="card-body">
              ${batchStudents.length ? `
                <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">
                  ${batchStudents.map(s=>`
                    <div class="flex items-center gap-3 border border" style="border-radius:12px;padding:12px;cursor:pointer;transition:all 0.2s;" onclick="navigate('student-profile','${s.id}')">
                      <img src="${s.avatar}" alt="${s.name}" class="avatar avatar-md">
                      <div class="min-w-0">
                        <div class="font-semibold text-sm truncate">${s.name}</div>
                        <div class="text-xs text-muted">${s.class} · Section ${s.section} · Roll ${s.roll}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : '<p class="text-muted text-sm">No students found for this batch.</p>'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
