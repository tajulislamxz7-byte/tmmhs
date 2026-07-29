// ================================================
// HOME PAGE
// ================================================

import { schoolInfo, stats, notices, events, testimonials, gallery, batches } from '../data/sampleData.js';

export function renderHome() {
  // Read admin-saved settings from localStorage
  const S = JSON.parse(localStorage.getItem('gfa_settings') || '{}');
  const schoolName    = S.name     || schoolInfo.name;
  const schoolTagline = S.tagline  || schoolInfo.tagline;
  const schoolFounded = S.founded  || schoolInfo.founded;
  const principalName = S.principal|| schoolInfo.principalName;
  const principalMsg  = S.message  || schoolInfo.principalMessage;
  const totalStudents = S.totalStudents != null ? S.totalStudents : schoolInfo.totalStudents;
  const totalTeachers = S.totalTeachers != null ? S.totalTeachers : schoolInfo.totalTeachers;
  const passRate      = S.passRate || '100%';
  const yearsExcel    = new Date().getFullYear() - parseInt(schoolFounded || 1985);

  const heroStats = [
    { label: 'Students',         value: totalStudents, svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { label: 'Teachers',         value: totalTeachers, svg: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>' },
    { label: 'Years of Service', value: yearsExcel,    svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
  ];

  return `
    <!-- HERO SECTION -->
    <section class="hero-section" id="heroSection">
      <div class="hero-bg-shapes">
        <div class="hero-shape hero-shape-1"></div>
        <div class="hero-shape hero-shape-2"></div>
        <div class="hero-shape hero-shape-3"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text animate-fadeIn">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              Est. ${schoolFounded} · Tiarkhali, Bangladesh
            </div>
            <h1 class="hero-title font-display">
              ${schoolTagline.split(',')[0]},<br>
              <span class="hero-title-highlight">${schoolTagline.split(',')[1]?.trim() || 'Inspiring Futures'}</span>
            </h1>
            <p class="hero-subtitle">${schoolName} — A premier institution where knowledge meets character, and potential becomes achievement.</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-xl" onclick="navigate('admission')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Apply for Admission
              </button>
              <button class="btn btn-secondary btn-xl" onclick="navigate('about')" style="background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.3);color:white;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Explore School
              </button>
            </div>
            <div class="hero-stats">
              ${stats.slice(0,3).map(s => `
                <div class="hero-stat">
                  <div class="hero-stat-value">${s.value}${typeof s.value === 'number' ? '+' : ''}</div>
                  <div class="hero-stat-label">${s.label}</div>
                </div>
              `).join('<div class="hero-stat-divider"></div>')}
            </div>
          </div>
          <div class="hero-visual animate-fadeIn stagger-3">
            <div class="hero-card-stack">
              <div class="hero-main-image" style="position:relative;z-index:10;padding:20px 0;">
                <div class="school-illustration">
                  <div class="school-building">
                    <div class="building-students" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:480px;margin:0 auto;">
                      <div style="background:rgba(37,99,235,0.1);backdrop-filter:blur(10px);border:1.5px solid rgba(37,99,235,0.2);border-radius:20px;padding:32px 24px;text-align:center;">
                        <div style="width:56px;height:56px;margin:0 auto 16px;background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(37,99,235,0.3);">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                        </div>
                        <div style="font-weight:900;font-size:32px;color:var(--text-primary);line-height:1;margin-bottom:8px;">${totalStudents}+</div>
                        <div style="font-size:13px;color:var(--text-secondary);font-weight:600;">Students</div>
                      </div>
                      <div style="background:rgba(124,58,237,0.1);backdrop-filter:blur(10px);border:1.5px solid rgba(124,58,237,0.2);border-radius:20px;padding:32px 24px;text-align:center;">
                        <div style="width:56px;height:56px;margin:0 auto 16px;background:linear-gradient(135deg,#7c3aed,#a78bfa);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(124,58,237,0.3);">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        </div>
                        <div style="font-weight:900;font-size:32px;color:var(--text-primary);line-height:1;margin-bottom:8px;">${totalTeachers}+</div>
                        <div style="font-size:13px;color:var(--text-secondary);font-weight:600;">Teachers</div>
                      </div>
                      <div style="background:rgba(5,150,105,0.1);backdrop-filter:blur(10px);border:1.5px solid rgba(5,150,105,0.2);border-radius:20px;padding:32px 24px;text-align:center;">
                        <div style="width:56px;height:56px;margin:0 auto 16px;background:linear-gradient(135deg,#059669,#10b981);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(5,150,105,0.3);">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        </div>
                        <div style="font-weight:900;font-size:32px;color:var(--text-primary);line-height:1;margin-bottom:8px;">${passRate}</div>
                        <div style="font-size:13px;color:var(--text-secondary);font-weight:600;">Pass Rate</div>
                      </div>
                    </div>
                    
                    <div style="margin-top:40px;text-align:center;">
                      <div style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:50px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span style="font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;">Established 1985 · 39 Years of Excellence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="hero-scroll-indicator">
        <div class="scroll-arrow"></div>
        <span class="text-xs text-muted">Scroll to explore</span>
      </div>
    </section>

    <!-- ANIMATED STATS BANNER -->
    <section class="stats-banner">
      <div class="container">
        <div class="stats-grid">
          ${stats.map(s => `
            <div class="stat-item">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${s.color}" stroke-width="2">${s.svg}</svg>
              </div>
              <div class="stat-value counter" data-target="${s.value}">${s.value}</div>
              <div class="stat-label">${s.label}</div>
            </div>
          `).join('')}        </div>
      </div>
    </section>
  `;
}

export function renderHomeExtra() {
  const S = JSON.parse(localStorage.getItem('gfa_settings') || '{}');
  const principalName = S.principal || schoolInfo.principalName;
  const principalMsg  = S.message  || schoolInfo.principalMessage;
  const schoolName    = S.name     || schoolInfo.name;

  return `
    <!-- NOTICES & EVENTS -->
    <section class="section bg-secondary">
      <div class="container">
        <div class="grid-2 gap-8" style="gap:32px;">
          <!-- Latest Notices -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <div class="section-tag" style="margin-bottom:8px;">Latest Updates</div>
                <h2 style="font-size:var(--text-2xl);font-weight:800;">Notice Board</h2>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="navigate('notices')">View All →</button>
            </div>
            <div class="flex flex-col gap-3">
              ${notices.slice(0,5).map(n => `
                <div class="notice-card card" onclick="navigate('notices')" style="cursor:pointer;">
                  <div class="card-body" style="padding:16px 20px;">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="badge badge-${n.priority==='urgent'?'danger':n.priority==='high'?'primary':'gray'}">${n.category}</span>
                          ${n.priority==='urgent'?'<span class="badge badge-danger" style="animation:pulse 1.5s infinite;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Urgent</span>':''}
                        </div>
                        <div class="font-semibold text-sm">${n.title}</div>
                        <div class="text-xs text-muted mt-1">${n.date}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted flex-shrink-0 mt-1"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Upcoming Events -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <div class="section-tag" style="margin-bottom:8px;">What's Happening</div>
                <h2 style="font-size:var(--text-2xl);font-weight:800;">Upcoming Events</h2>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="navigate('events')">View All →</button>
            </div>
            <div class="flex flex-col gap-3">
              ${events.slice(0,5).map(e => `
                <div class="card" onclick="navigate('events')" style="cursor:pointer;">
                  <div class="card-body" style="padding:16px 20px;">
                    <div class="flex items-center gap-4">
                      <div class="event-date-badge">
                        <div class="event-month">${new Date(e.date).toLocaleString('default',{month:'short'})}</div>
                        <div class="event-day">${new Date(e.date).getDate()}</div>
                      </div>
                      <div class="flex-1">
                        <div class="font-semibold text-sm">${e.title}</div>
                        <div class="text-xs text-muted flex items-center gap-2 mt-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span>${e.time}</span>
                          <span>•</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span>${e.location}</span>
                        </div>
                      </div>
                      <span class="badge badge-${e.category==='Sports'?'success':e.category==='Academic'?'primary':'purple'}">${e.category}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK NAVIGATION CARDS -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Explore</div>
          <h2 class="section-title">Everything You Need</h2>
          <p class="section-subtitle">Navigate to any part of the platform with one click</p>
        </div>
        <div class="quick-nav-grid">
          ${[
            { svg:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', title:'Students',   desc:'Directory & Profiles',  color:'#2563eb', page:'students' },
            { svg:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>', title:'Teachers',  desc:'Faculty & Experts',     color:'#7c3aed', page:'teachers' },
            { svg:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', title:'Alumni',     desc:'Our Graduates',         color:'#059669', page:'alumni' },
            { svg:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', title:'Batches',    desc:'Class Groups',          color:'#d97706', page:'batches' },
            { svg:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>', title:'Results',    desc:'Exam Results',          color:'#dc2626', page:'results' },
            { svg:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', title:'Attendance', desc:'Daily Records',         color:'#0891b2', page:'attendance' },
            { svg:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', title:'Notices',    desc:'Announcements',         color:'#7c3aed', page:'notices' },
            { svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>', title:'Gallery',   desc:'Photos & Videos',       color:'#059669', page:'gallery' },
          ].map(item => `
            <div class="quick-nav-card" onclick="navigate('${item.page}')">
              <div class="quick-nav-icon" style="background:${item.color}15;color:${item.color};">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.svg}</svg>
              </div>
              <div class="quick-nav-title">${item.title}</div>
              <div class="quick-nav-desc">${item.desc}</div>
              <div class="quick-nav-arrow">→</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- GALLERY PREVIEW -->
    <section class="section bg-secondary">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Memories</div>
          <h2 class="section-title">School Gallery</h2>
          <p class="section-subtitle">Capturing moments that last a lifetime</p>
        </div>
        <div class="gallery-preview-grid">
          ${gallery.map((g,i) => `
            <div class="gallery-preview-item ${i===0?'gallery-featured':''}" onclick="navigate('gallery')" style="background:${g.coverColor};">
              <div class="gallery-overlay">
                <div class="gallery-label">${g.title}</div>
                <div class="gallery-count">${g.images} Photos</div>
              </div>
              <div style="opacity:0.2;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                <svg width="${i===0?'80':'50'}" height="${i===0?'80':'50'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="text-center mt-8">
          <button class="btn btn-primary" onclick="navigate('gallery')">View All Albums →</button>
        </div>
      </div>
    </section>

    <!-- PRINCIPAL'S MESSAGE -->
    <section class="section">
      <div class="container">
        <div class="principal-section">
          <div class="principal-image">
            <div class="principal-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=FatimaRahman" alt="Principal" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
            </div>
            <div class="principal-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Principal
            </div>
          </div>
          <div class="principal-message">
            <div class="section-tag">Message from the Principal</div>
            <h2 class="font-display" style="font-size:var(--text-3xl);font-weight:700;margin-bottom:16px;margin-top:12px;">A Word from Our Leader</h2>
            <blockquote class="principal-quote">"${schoolInfo.principalMessage}"</blockquote>
            <div class="principal-info">
              <div class="font-bold" style="font-size:var(--text-lg);">${schoolInfo.principalName}</div>
              <div class="text-muted text-sm">Principal, Tiarkhali M.M High School and College</div>
              <div class="text-muted text-sm">PhD Physics, BUET · 18+ Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ACHIEVEMENTS -->
    <section class="section" style="background:linear-gradient(135deg,#1e3a5f,#1e293b);">
      <div class="container">
        <div class="section-header" style="color:white;">
          <div class="section-tag" style="background:rgba(255,255,255,0.1);color:white;">Recognition</div>
          <h2 class="section-title" style="color:white;">Our Achievements</h2>
          <p class="section-subtitle" style="color:rgba(255,255,255,0.7);">Excellence recognized nationally and internationally</p>
        </div>
        <div class="achievements-grid">
          ${[
            {svg:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>', text:'National Science Olympiad Champions 2024'},
            {svg:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', text:'100% SSC Pass Rate 2023'},
            {svg:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', text:'UNESCO Excellence Award 2022'},
            {svg:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>', text:'Best School Award – Dhaka 2023'},
            {svg:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', text:'Digital Library of the Year 2023'},
            {svg:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>', text:'Sports Meet Champions 2024'},
          ].map((a,i) => `
            <div class="achievement-card" style="animation-delay:${i*0.1}s;display:flex;align-items:center;gap:12px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" style="flex-shrink:0;">${a.svg}</svg>
              <span>${a.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section bg-secondary">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Voices</div>
          <h2 class="section-title">What People Say</h2>
          <p class="section-subtitle">Hear from our students, alumni, and parents</p>
        </div>
        <div class="testimonials-grid">
          ${testimonials.map(t => `
            <div class="testimonial-card card">
              <div class="card-body">
                <div class="testimonial-stars">★★★★★</div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                  <img src="${t.avatar}" alt="${t.name}" class="avatar avatar-md">
                  <div>
                    <div class="font-semibold text-sm">${t.name}</div>
                    <div class="text-xs text-muted">${t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <div class="section-tag" style="background:rgba(255,255,255,0.15);color:white;">Join Us Today</div>
          <h2 class="cta-title font-display">Ready to Begin Your Journey?</h2>
          <p class="cta-subtitle">Join thousands of students who have shaped their future at Tiarkhali M.M High School and College.</p>
          <div class="flex gap-4 justify-center flex-wrap">
            <button class="btn btn-xl" style="background:white;color:var(--primary);font-weight:700;" onclick="navigate('admission')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Apply for Admission
            </button>
            <button class="btn btn-xl btn-outline" style="border-color:rgba(255,255,255,0.5);color:white;" onclick="navigate('about')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}
