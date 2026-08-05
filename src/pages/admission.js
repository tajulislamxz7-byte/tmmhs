// ================================================
// ONLINE ADMISSION PAGE
// ================================================

import { classes } from '../data/schoolConfig.js';
import { api } from '../utils/api.js';

export async function renderAdmission() {
  // Load admission settings from API
  const settings = await api.getSettings() || {};
  const admission = settings.admission || {};
  
  // Default values - use nullish coalescing to allow empty strings
  const title = admission.title ?? 'Online Admission';
  const subtitle = admission.subtitle ?? 'Apply for admission to Tiarkhali M.M High School and College — Session 2025–2026';
  const session = admission.session ?? '2025–2026';
  const infoTitle = admission.infoTitle ?? `Admission ${session}`;
  const infoDesc = admission.infoDesc ?? 'Apply online for Classes 6 to 9. Admission to Class 10 is only through internal promotion.';
  const availableClasses = admission.classes ? admission.classes.split(',').map(c => c.trim()) : classes.filter(c=>c.name!=='Class 10').map(c=>c.name);
  
  const dates = admission.dates ?? [
    {event:'Form Submission Opens', date:'August 1, 2025'},
    {event:'Form Submission Closes', date:'August 25, 2025'},
    {event:'Written Test', date:'September 5, 2025'},
    {event:'Results Published', date:'September 15, 2025'},
    {event:'Admission Confirmation', date:'September 20, 2025'},
  ];
  
  const eligibility = admission.eligibility ?? [
    'Class 6: Completed Grade 5 with minimum GPA 4.0',
    "Class 7–9: Previous year's marksheet required",
    'Transfer students: Contact office directly',
    'All students require guardian ID and birth certificate',
  ];
  
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">${title}</h1>
          <p class="page-subtitle">${subtitle}</p>
        </div>
      </div>
      <div class="container section-sm">
        <div class="grid" style="grid-template-columns:1fr 2fr;gap:32px;">
          <!-- Left: Info Panel -->
          <div class="flex flex-col gap-4">
            <div class="card">
              <div class="card-body">
                <div style="margin-bottom:12px;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                <div class="font-bold" style="font-size:18px;margin-bottom:8px;">${infoTitle}</div>
                <p class="text-secondary text-sm line-height-1.7">${infoDesc}</p>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><div class="font-semibold">Important Dates</div></div>
              <div class="card-body">
                ${dates.map(item=>`
                  <div class="flex items-start gap-3 mb-3">
                    <div style="flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                    <div>
                      <div class="font-medium text-sm">${item.event}</div>
                      <div class="text-xs text-muted">${item.date}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="card">
              <div class="card-header"><div class="font-semibold">Eligibility</div></div>
              <div class="card-body">
                ${eligibility.map(r=>`<div class="flex items-start gap-2 mb-2 text-sm text-secondary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>${r}</span></div>`).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="card">
            <div class="card-header"><div class="font-semibold" style="font-size:18px;">Admission Application Form</div></div>
            <div class="card-body">
              <form id="admissionForm" onsubmit="submitAdmission(event)">
                <div class="font-semibold text-sm mb-4" style="color:var(--primary);">Step 1: Applicant Information</div>
                <div class="grid-2 gap-4 mb-4">
                  <div class="form-group">
                    <label class="form-label">First Name *</label>
                    <input type="text" class="form-input" placeholder="Arif" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Last Name *</label>
                    <input type="text" class="form-input" placeholder="Hossain" required>
                  </div>
                </div>
                <div class="grid-2 gap-4 mb-4">
                  <div class="form-group">
                    <label class="form-label">Date of Birth *</label>
                    <input type="date" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Blood Group</label>
                    <select class="form-input form-select">
                      <option value="">Select</option>
                      ${['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=>`<option>${b}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <div class="form-group mb-4">
                  <label class="form-label">Address *</label>
                  <textarea class="form-input form-textarea" rows="2" placeholder="Full address" required></textarea>
                </div>

                <div class="font-semibold text-sm mb-4 mt-6" style="color:var(--primary);">Step 2: Academic Information</div>
                <div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
                  <div class="form-group">
                    <label class="form-label">Applying for Class *</label>
                    <select class="form-input form-select" required>
                      <option value="">Select Class</option>
                      ${availableClasses.map(c=>`<option>${c}</option>`).join('')}
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Section Preference</label>
                    <select class="form-input form-select">
                      <option>A</option><option>B</option><option>C</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Previous GPA</label>
                    <input type="number" step="0.01" min="0" max="5" class="form-input" placeholder="4.50">
                  </div>
                </div>
                <div class="form-group mb-4">
                  <label class="form-label">Previous School</label>
                  <input type="text" class="form-input" placeholder="Name of previous school (if any)">
                </div>

                <div class="font-semibold text-sm mb-4 mt-6" style="color:var(--primary);">Step 3: Guardian Information</div>
                <div class="grid-2 gap-4 mb-4">
                  <div class="form-group">
                    <label class="form-label">Guardian Name *</label>
                    <input type="text" class="form-input" placeholder="Father/Mother name" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Relationship *</label>
                    <select class="form-input form-select" required>
                      <option>Father</option><option>Mother</option><option>Guardian</option>
                    </select>
                  </div>
                </div>
                <div class="grid-2 gap-4 mb-6">
                  <div class="form-group">
                    <label class="form-label">Guardian Phone *</label>
                    <input type="tel" class="form-input" placeholder="+880 17XX-XXXXXX" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Guardian Email *</label>
                    <input type="email" class="form-input" placeholder="guardian@email.com" required>
                  </div>
                </div>

                <label class="flex items-start gap-2 text-sm cursor-pointer mb-6">
                  <input type="checkbox" class="form-checkbox mt-1" required>
                  <span>I confirm all information provided is accurate and I agree to the <a href="#" class="text-primary-color">Terms & Conditions</a>.</span>
                </label>

                <button type="submit" class="btn btn-primary w-full btn-lg">Submit Application</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.submitAdmission = function(e) {
  e.preventDefault();
  const form = document.getElementById('admissionForm');
  form.innerHTML = `
    <div class="text-center" style="padding:48px 0;">
      <div style="font-size:24px;font-weight:800;margin-bottom:8px;display:flex;align-items:center;gap:12px;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Application Submitted!</div>
      <p class="text-secondary">Your application has been received. You will receive a confirmation email within 24 hours. The written test date will be communicated separately.</p>
      <div style="background:var(--primary-50);border-radius:12px;padding:16px;margin-top:24px;">
        <div class="text-xs text-muted">Application Reference</div>
        <div class="font-bold" style="font-size:20px;color:var(--primary);">ADM-2025-${Math.floor(Math.random()*9000+1000)}</div>
      </div>
      <button class="btn btn-primary mt-6" onclick="navigate('home')">Back to Home</button>
    </div>
  `;
};
