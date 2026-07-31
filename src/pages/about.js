// ================================================
// ABOUT / SCHOOL INFO PAGE
// ================================================

import { schoolInfo } from '../data/schoolConfig.js';

const FAQS = [
  { q:'What is the admission process for Class 6?', a:'Applications open in August each year, followed by a written test and interview. Results are published within two weeks of the test date.' },
  { q:'Does the school offer scholarships?', a:'Yes — merit scholarships are available for Classes 6 through 10. Need-based scholarships are also reviewed case by case by the admissions committee.' },
  { q:'What are the school hours?', a:'Classes run Sunday to Thursday, 8:00 AM to 2:30 PM, with extended hours for Class 9–10 during exam terms.' },
  { q:'How can I contact my child\'s class teacher?', a:'Guardians can message teachers directly through the Messages tab once their student profile is linked to a guardian account.' },
  { q:'Is there a dress code?', a:'Yes. Students wear the official school uniform Monday through Thursday. Friday is free-dress day within school guidelines.' },
  { q:'How are exam results shared?', a:'Results are published on the student portal and as printed marksheets distributed through class teachers. PDF marksheets can be downloaded anytime.' },
];

export function renderAbout() {
  const S = JSON.parse(localStorage.getItem('gfa_settings') || '{}');
  const name     = S.name      || schoolInfo.name;
  const tagline  = S.tagline   || schoolInfo.tagline;
  const founded  = S.founded   || schoolInfo.founded;
  const address  = S.address   || schoolInfo.address;
  const phone    = S.phone     || schoolInfo.phone;
  const email    = S.email     || schoolInfo.email;
  const principal= S.principal || schoolInfo.principalName;
  const message  = S.message   || schoolInfo.principalMessage;
  const achievements = S.achievements && S.achievements.length > 0 ? S.achievements : [];

  return `
    <div class="page-container">
      <!-- About Hero -->
      <div class="about-hero">
        <div class="container">
          <div class="section-tag" style="background:rgba(255,255,255,0.15);color:white;margin-bottom:16px;">Est. ${founded}</div>
          <h1 style="font-size:var(--text-5xl);font-weight:900;color:white;font-family:var(--font-display);margin-bottom:16px;">About ${name}</h1>
          <p style="font-size:var(--text-xl);color:rgba(255,255,255,0.8);max-width:600px;margin:0 auto;line-height:1.7;">${tagline}</p>
        </div>
      </div>

      <div class="container section-sm">
        <!-- Mission / Vision / History -->
        <div class="grid-2 gap-6 mb-12">
          ${[
            {svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>', title:'Our History',  text:message},
            {svg:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',                                   title:'Mission',      text:'To give every student a rigorous, well-rounded education that prepares them for university and for life — regardless of background.'},
            {svg:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',           title:'Vision',       text:'To be recognized as one of Bangladesh\'s leading centers of academic excellence and civic character by 2030.'},
            {svg:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',                  title:'Core Values',  text:'Integrity, Curiosity, Excellence, Community, and Respect — these five values guide every interaction within our school walls.'},
          ].map(item=>`
            <div class="card">
              <div class="card-body" style="padding:28px;">
                <div style="width:48px;height:48px;border-radius:14px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">${item.svg}</svg>
                </div>
                <div class="font-bold" style="font-size:18px;margin-bottom:8px;">${item.title}</div>
                <p class="text-secondary" style="line-height:1.7;font-size:14px;">${item.text}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Principal's Message -->
        <div class="principal-section mb-12">
          <div class="principal-image">
            <div class="principal-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(principal)}" alt="${principal}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
            </div>
            <div class="principal-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Principal
            </div>
          </div>
          <div class="principal-message">
            <div class="section-tag">Message from the Principal</div>
            <h2 class="font-display" style="font-size:var(--text-3xl);font-weight:700;margin:12px 0 16px;">${principal}</h2>
            <blockquote class="principal-quote">"${message}"</blockquote>
            <div class="principal-info">
              <div class="font-bold" style="font-size:var(--text-lg);">${principal}</div>
              <div class="text-muted text-sm">Principal, ${name}</div>
            </div>
          </div>
        </div>

        <!-- Facilities -->
        <div class="mb-12">
          <div class="section-header" style="text-align:left;max-width:none;margin-bottom:var(--space-6);">
            <div class="section-tag" style="margin-bottom:8px;">Campus</div>
            <h2 class="section-title" style="font-size:var(--text-3xl);">Our Facilities</h2>
          </div>
          <div class="grid-3 gap-4">
            ${schoolInfo.facilities.map(f=>`
              <div class="card" style="cursor:default;">
                <div class="card-body" style="padding:20px;display:flex;align-items:center;gap:14px;">
              <div style="width:44px;height:44px;border-radius:12px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                  <div class="font-medium text-sm">${f}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Achievements (only show if achievements exist) -->
        ${achievements.length > 0 ? `
        <div class="mb-12" style="background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:var(--radius-2xl);padding:var(--space-10);">
          <div class="section-header" style="text-align:left;max-width:none;margin-bottom:var(--space-6);">
            <div class="section-tag" style="background:rgba(255,255,255,0.15);color:white;margin-bottom:8px;">Recognition</div>
            <h2 style="font-size:var(--text-3xl);font-weight:800;color:white;">Our Achievements</h2>
          </div>
          <div class="achievements-grid">
            ${achievements.map((achievement, i) => `
              <div class="achievement-card" style="animation-delay:${i*0.1}s;display:flex;align-items:center;gap:10px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2" style="flex-shrink:0;">
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                ${achievement}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- FAQ -->
        <div class="mb-12">
          <div class="section-header" style="text-align:left;max-width:none;margin-bottom:var(--space-6);">
            <div class="section-tag" style="margin-bottom:8px;">Common Questions</div>
            <h2 class="section-title" style="font-size:var(--text-3xl);">FAQ</h2>
          </div>
          <div id="faqList">
            ${FAQS.map((f,i)=>`
              <div style="border:1.5px solid var(--border);border-radius:var(--radius-xl);overflow:hidden;margin-bottom:10px;background:var(--bg-primary);">
                <button onclick="toggleFAQ(${i})" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 20px;text-align:left;font-size:var(--text-sm);font-weight:600;color:var(--text-primary);background:none;border:none;cursor:pointer;">
                  <span style="display:flex;align-items:center;gap:10px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${f.q}</span>
                  <svg id="faq-arrow-${i}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;transition:transform 0.2s;"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div id="faq-body-${i}" style="display:none;padding:0 20px 18px;font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;">${f.a}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Contact -->
        <div class="card">
          <div class="card-header"><div class="font-semibold">Contact Us</div></div>
          <div class="card-body">
            <div class="grid-3 gap-4">
              <div class="flex items-center gap-3">
                <div style="width:36px;height:36px;border-radius:10px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div><div class="text-xs text-muted">Address</div><div class="font-medium text-sm">${address}</div></div>
              </div>
              <div class="flex items-center gap-3">
                <div style="width:36px;height:36px;border-radius:10px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.29-.29a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18v.92z"/></svg>
                </div>
                <div><div class="text-xs text-muted">Phone</div><div class="font-medium text-sm">${phone}</div></div>
              </div>
              <div class="flex items-center gap-3">
                <div style="width:36px;height:36px;border-radius:10px;background:var(--primary-50);display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div><div class="text-xs text-muted">Email</div><div class="font-medium text-sm">${email}</div></div>
              </div>
            </div>
            <div class="mt-6 border-t border" style="padding-top:16px;">
              <div class="font-semibold text-sm mb-3">Send us a Message</div>
              <div class="grid-2 gap-4" style="gap:12px;">
                <input class="form-input" placeholder="Your name">
                <input class="form-input" type="email" placeholder="Your email">
              </div>
              <textarea class="form-input form-textarea" style="margin-top:12px;" placeholder="Your message..."></textarea>
              <button class="btn btn-primary mt-4" onclick="showToast('Message sent! We\'ll respond within 24 hours.','success')">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.toggleFAQ = function(i) {
  const body = document.getElementById(`faq-body-${i}`);
  const arrow = document.getElementById(`faq-arrow-${i}`);
  if (!body || !arrow) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
};
