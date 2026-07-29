// ================================================
// COMPLAINT BOX / SUGGESTION BOX
// ================================================

const COMPLAINTS = [
  { id:'CPL-001', subject:'Broken fan in Room 204', category:'Facility', status:'In Progress', date:'2025-01-25', submittedBy:'Anonymous' },
  { id:'CPL-002', subject:'Suggestion: Later library closing time', category:'Suggestion', status:'Under Review', date:'2025-01-20', submittedBy:'Anonymous' },
  { id:'CPL-003', subject:'Cafeteria menu — more vegetarian options please', category:'Suggestion', status:'Resolved', date:'2025-01-10', submittedBy:'Anonymous' },
  { id:'CPL-004', subject:'Water fountain on 3rd floor not working', category:'Facility', status:'Resolved', date:'2025-01-05', submittedBy:'Anonymous' },
];

export function renderComplaintBox() {
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Complaint & Suggestion Box</h1>
          <p class="page-subtitle">Submit anonymously — we read everything and act on valid feedback</p>
        </div>
      </div>
      <div class="container section-sm">
        <div class="grid" style="grid-template-columns:2fr 1fr;gap:24px;">
          <!-- Left: Submit Form + History -->
          <div class="flex flex-col gap-6">
            <div class="card">
              <div class="card-header"><div class="font-semibold" style="font-size:16px;">Submit a Complaint or Suggestion</div></div>
              <div class="card-body">
                <form id="complaintForm" onsubmit="submitComplaint(event)">
                  <div class="form-group mb-4">
                    <label class="form-label">Type</label>
                    <div class="flex gap-3">
                      ${['Complaint','Suggestion','Feedback','Other'].map((t,i)=>`
                        <label class="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="radio" name="complaintType" value="${t}" ${i===0?'checked':''}> ${t}
                        </label>
                      `).join('')}
                    </div>
                  </div>
                  <div class="form-group mb-4">
                    <label class="form-label">Category</label>
                    <select class="form-input form-select" required>
                      <option value="">Select category</option>
                      ${['Facility','Teacher/Staff','Safety','Curriculum','Canteen','Library','Hostel','Other'].map(c=>`<option>${c}</option>`).join('')}
                    </select>
                  </div>
                  <div class="form-group mb-4">
                    <label class="form-label">Subject *</label>
                    <input type="text" class="form-input" placeholder="Brief description of your complaint or suggestion" required>
                  </div>
                  <div class="form-group mb-4">
                    <label class="form-label">Details</label>
                    <textarea class="form-input form-textarea" rows="4" placeholder="Describe your complaint or suggestion in detail. The more specific you are, the better we can address it."></textarea>
                  </div>
                  <div class="form-group mb-6">
                    <label class="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" class="form-checkbox" checked>
                      Submit anonymously (your identity will not be revealed)
                    </label>
                  </div>
                  <button type="submit" class="btn btn-primary w-full">Submit</button>
                </form>
              </div>
            </div>

            <div class="card">
              <div class="card-header"><div class="font-semibold">Your Submissions</div></div>
              <div class="card-body">
                ${COMPLAINTS.map(c=>`
                  <div class="complaint-item" style="margin-bottom:12px;">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <div class="font-medium text-sm">${c.subject}</div>
                        <div class="text-xs text-muted">${c.date} · ${c.category}</div>
                      </div>
                      <span class="badge badge-${c.status==='Resolved'?'success':c.status==='In Progress'?'primary':'warning'}">${c.status}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Stats + Guidelines -->
          <div class="flex flex-col gap-4">
            <div class="card">
              <div class="card-header"><div class="font-semibold">Response Statistics</div></div>
              <div class="card-body">
                ${[
                  {l:'Total Submitted',v:'48',c:'var(--primary)'},
                  {l:'Resolved',v:'38',c:'var(--success)'},
                  {l:'In Progress',v:'7',c:'var(--warning)'},
                  {l:'Under Review',v:'3',c:'var(--secondary)'},
                ].map(s=>`
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-secondary">${s.l}</span>
                    <span class="font-bold" style="color:${s.c};">${s.v}</span>
                  </div>
                `).join('')}
                <div style="height:4px;background:var(--bg-secondary);border-radius:99px;overflow:hidden;margin-top:8px;">
                  <div style="width:79%;height:100%;background:var(--success);border-radius:99px;"></div>
                </div>
                <div class="text-xs text-muted mt-2">79% resolution rate</div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><div class="font-semibold">Guidelines</div></div>
              <div class="card-body">
                ${[
                  'All complaints are treated confidentially',
                  'Anonymous submissions are accepted',
                  'Urgent safety issues are addressed within 24 hours',
                  'General complaints are reviewed within 7 days',
                  'Constructive suggestions are forwarded to relevant departments',
                ].map(g=>`<div class="flex items-start gap-2 mb-3 text-sm text-secondary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${g}</span></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.submitComplaint = function(e) {
  e.preventDefault();
  showToast('Your complaint has been submitted anonymously. Reference: CPL-' + Math.floor(Math.random()*9000+1000), 'success');
  e.target.reset();
};
