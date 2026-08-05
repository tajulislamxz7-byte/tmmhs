// ================================================
// ACADEMIC PAGES — Modern Professional Design
// ================================================
import { icon } from '../utils/icons.js';
import { api } from '../utils/api.js';

// ── Academic Calendar ─────────────────────────────
export async function renderAcademicCalendar() {
  // Load events from API settings
  const settings = await api.getSettings();
  const events = settings?.academic?.academicCalendar || [];

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;overflow-x:hidden;">
      <div class="container" style="max-width:1200px;overflow-x:hidden;">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:50px;animation:fadeInUp 0.6s ease;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('calendar', 36, 'white')}
          </div>
          <h1 style="font-size:clamp(28px, 5vw, 42px);font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Academic Calendar 2026</h1>
          <p style="font-size:16px;color:var(--text-muted);max-width:600px;margin:0 auto;">Important dates and events for the academic year</p>
        </div>

        <!-- Events Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;width:100%;">
          ${events.length === 0 ? `
            <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
              <div style="margin-bottom:20px;">
                ${icon('calendar', 64, 'var(--text-muted)')}
              </div>
              <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Events Configured</h3>
              <p style="font-size:14px;margin-bottom:24px;">Academic calendar events can be added from the admin panel.</p>
            </div>
          ` : events.map((event, idx) => `
            <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:20px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.1);transition:all 0.3s ease;animation:fadeInUp 0.6s ease ${idx * 0.1}s backwards;cursor:pointer;box-sizing:border-box;" 
                 onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.15)';this.style.borderColor='var(--primary)'" 
                 onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)';this.style.borderColor='var(--border-color)'">
              
              <div style="display:flex;align-items:start;gap:16px;margin-bottom:16px;">
                <div style="background:${event.type === 'holiday' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'};width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 16px ${event.type === 'holiday' ? 'rgba(245,87,108,0.3)' : 'var(--primary-shadow)'};">
                  ${icon('calendar', 26, 'white')}
                </div>
                <div style="flex:1;">
                  <h3 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:8px;line-height:1.3;">${event.title}</h3>
                  <p style="font-size:14px;color:var(--text-muted);margin-bottom:12px;line-height:1.6;">${event.desc}</p>
                  <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);">
                    ${icon('clock', 14)}
                    <span>${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <span style="display:inline-block;margin-top:12px;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.5px;background:${event.type === 'holiday' ? 'rgba(245,87,108,0.1)' : 'rgba(79,172,254,0.1)'};color:${event.type === 'holiday' ? '#f5576c' : '#4facfe'};">${event.type === 'holiday' ? 'HOLIDAY' : 'ACADEMIC'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `;
}

// ── Holiday Calendar ──────────────────────────────
export async function renderHolidayCalendar() {
  // Load holidays from API settings
  const settings = await api.getSettings();
  const holidays = settings?.academic?.holidayCalendar || [];

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;overflow-x:hidden;">
      <div class="container" style="max-width:1000px;overflow-x:hidden;">
        <div style="text-align:center;margin-bottom:50px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('calendar', 36, 'white')}
          </div>
          <h1 style="font-size:clamp(28px, 5vw, 42px);font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Holiday Calendar 2026</h1>
          <p style="font-size:16px;color:var(--text-muted);">Public holidays and school breaks throughout the year</p>
        </div>

        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);width:100%;box-sizing:border-box;">
          ${holidays.length === 0 ? `
            <div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
              <div style="margin-bottom:20px;">
                ${icon('calendar', 64, 'var(--text-muted)')}
              </div>
              <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Holidays Configured</h3>
              <p style="font-size:14px;margin-bottom:24px;">Holiday calendar can be added from the admin panel.</p>
            </div>
          ` : holidays.map((h, idx) => `
            <div style="padding:24px 28px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;cursor:pointer;animation:fadeInUp 0.5s ease ${idx * 0.05}s backwards;box-sizing:border-box;" 
                 onmouseover="this.style.background='var(--bg-primary)';this.style.transform='translateX(8px)'" 
                 onmouseout="this.style.background='var(--bg-secondary)';this.style.transform='translateX(0)'">
              <div style="display:flex;align-items:center;gap:24px;">
                <div style="background:linear-gradient(135deg, ${h.color} 0%, ${h.color}dd 100%);width:64px;height:64px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;flex-shrink:0;box-shadow:0 8px 20px ${h.color}40;">
                  <div style="font-size:11px;font-weight:600;opacity:0.9;">${new Date(h.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                  <div style="font-size:22px;font-weight:900;">${new Date(h.date).getDate()}</div>
                </div>
                <div style="flex:1;">
                  <h3 style="font-size:17px;font-weight:800;color:var(--text-primary);margin-bottom:6px;">${h.title}</h3>
                  <p style="font-size:13px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
                    ${icon('info', 14)}
                    ${h.desc} • ${new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                </div>
                ${icon('chevronRight', 20, 'var(--text-muted)')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Class Routine ─────────────────────────────────
export async function renderClassRoutine() {
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  
  // Load routines from API settings
  const settings = await api.getSettings();
  const routines = settings?.academic?.classRoutines || {};
  
  // Define the function globally BEFORE rendering HTML
  window.routinesData = routines;
  window.showClassRoutine = function(className, btnIndex) {
    console.log('showClassRoutine called:', className, btnIndex);
    
    // Update subtitle
    document.getElementById('routineSubtitle').textContent = className + ' • Daily Schedule';
    
    // Update button styles
    for (let i = 0; i < 5; i++) {
      const btn = document.getElementById('classBtn' + i);
      if (i === btnIndex) {
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--primary)';
        btn.style.boxShadow = '0 4px 12px var(--primary-shadow)';
      } else {
        btn.style.background = 'var(--bg-secondary)';
        btn.style.color = 'var(--text-primary)';
        btn.style.borderColor = 'var(--border-color)';
        btn.style.boxShadow = 'none';
      }
    }
    
    // Update routine content
    const routine = window.routinesData[className] || [];
    const container = document.getElementById('routineContainer');
    
    if (routine.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
          <div style="margin-bottom:20px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Routine for ${className}</h3>
          <p style="font-size:14px;margin-bottom:24px;">Class routine can be added from the admin panel.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = routine.map((period, idx) => `
      <div style="padding:20px 24px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;${period.isBreak ? 'background:linear-gradient(90deg, rgba(254, 225, 64, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);' : ''}animation:fadeInUp 0.5s ease ${idx * 0.05}s backwards;box-sizing:border-box;" 
           ${!period.isBreak ? 'onmouseover="this.style.background=\'var(--bg-primary)\'" onmouseout="this.style.background=\'var(--bg-secondary)\'"' : ''}>
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <div style="background:${period.isBreak ? 'linear-gradient(135deg, #fee140 0%, #ffa500 100%)' : 'linear-gradient(135deg, ' + period.color + ' 0%, ' + period.color + 'dd 100%)'};min-width:85px;padding:10px;border-radius:12px;text-align:center;color:white;box-shadow:0 6px 16px ${period.color}40;flex-shrink:0;">
            <div style="font-size:14px;font-weight:800;">${period.time}</div>
          </div>
          <div style="flex:1;min-width:200px;">
            <h3 style="font-size:16px;font-weight:800;color:var(--text-primary);margin-bottom:${period.isBreak ? '0' : '6px'};display:flex;align-items:center;gap:8px;">
              ${period.isBreak ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zm5-7L6 3m4-2 1 2m4-2-1 2"/></svg>' : ''} ${period.subject}
            </h3>
            ${!period.isBreak ? '<div style="display:flex;align-items:center;gap:12px;font-size:13px;color:var(--text-muted);flex-wrap:wrap;"><span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ' + period.teacher + '</span><span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Room ' + period.room + '</span></div>' : ''}
          </div>
        </div>
      </div>
    `).join('');
  };

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;overflow-x:hidden;">
      <div class="container" style="max-width:900px;overflow-x:hidden;">
        <div style="text-align:center;margin-bottom:40px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('clock', 36, 'white')}
          </div>
          <h1 style="font-size:clamp(28px, 5vw, 42px);font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Class Routine</h1>
          <p id="routineSubtitle" style="font-size:16px;color:var(--text-muted);">Class 6 • Daily Schedule</p>
        </div>

        <!-- Class Selection Buttons -->
        <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:40px;">
          ${classes.map((cls, idx) => `
            <button 
              id="classBtn${idx}" 
              onclick="showClassRoutine('${cls}', ${idx})"
              style="padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;border:2px solid var(--border-color);background:${cls === 'Class 6' ? 'var(--primary)' : 'var(--bg-secondary)'};color:${cls === 'Class 6' ? 'white' : 'var(--text-primary)'};cursor:pointer;transition:all 0.3s ease;box-shadow:${cls === 'Class 6' ? '0 4px 12px var(--primary-shadow)' : 'none'};"
            >
              ${cls}
            </button>
          `).join('')}
        </div>

        <div id="routineContainer" style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);width:100%;box-sizing:border-box;">
          ${!routines['Class 6'] || routines['Class 6'].length === 0 ? `
            <div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
              <div style="margin-bottom:20px;">
                ${icon('clock', 64, 'var(--text-muted)')}
              </div>
              <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Class Routine Configured</h3>
              <p style="font-size:14px;margin-bottom:24px;">Class routines can be added from the admin panel.</p>
            </div>
          ` : routines['Class 6'].map((period, idx) => `
            <div style="padding:20px 24px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;${period.isBreak ? 'background:linear-gradient(90deg, rgba(254, 225, 64, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);' : ''}animation:fadeInUp 0.5s ease ${idx * 0.05}s backwards;box-sizing:border-box;" 
                 ${!period.isBreak ? `onmouseover="this.style.background='var(--bg-primary)'" onmouseout="this.style.background='var(--bg-secondary)'"` : ''}>
              <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                <div style="background:${period.isBreak ? 'linear-gradient(135deg, #fee140 0%, #ffa500 100%)' : `linear-gradient(135deg, ${period.color} 0%, ${period.color}dd 100%)`};min-width:85px;padding:10px;border-radius:12px;text-align:center;color:white;box-shadow:0 6px 16px ${period.color}40;flex-shrink:0;">
                  <div style="font-size:14px;font-weight:800;">${period.time}</div>
                </div>
                <div style="flex:1;min-width:200px;">
                  <h3 style="font-size:16px;font-weight:800;color:var(--text-primary);margin-bottom:${period.isBreak ? '0' : '6px'};display:flex;align-items:center;gap:8px;">
                    ${period.isBreak ? icon('coffee', 18) : ''} ${period.subject}
                  </h3>
                  ${!period.isBreak ? `
                    <div style="display:flex;align-items:center;gap:12px;font-size:13px;color:var(--text-muted);flex-wrap:wrap;">
                      <span style="display:flex;align-items:center;gap:6px;">${icon('user', 14)} ${period.teacher}</span>
                      <span style="display:flex;align-items:center;gap:6px;">${icon('mapPin', 14)} Room ${period.room}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `;
}

// ── Syllabus ──────────────────────────────────────
export async function renderSyllabus() {
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  
  // Load syllabus from API settings
  const settings = await api.getSettings();
  const syllabusData = settings?.academic?.syllabus || {};
  
  // Define the function globally BEFORE rendering HTML
  window.syllabusDataStore = syllabusData;
  window.showSyllabus = function(className, btnIndex) {
    console.log('showSyllabus called:', className, btnIndex);
    
    // Update subtitle
    document.getElementById('syllabusSubtitle').textContent = 'Course curriculum and study materials for ' + className;
    
    // Update button styles
    for (let i = 0; i < 5; i++) {
      const btn = document.getElementById('syllabusClassBtn' + i);
      if (i === btnIndex) {
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--primary)';
        btn.style.boxShadow = '0 4px 12px var(--primary-shadow)';
      } else {
        btn.style.background = 'var(--bg-secondary)';
        btn.style.color = 'var(--text-primary)';
        btn.style.borderColor = 'var(--border-color)';
        btn.style.boxShadow = 'none';
      }
    }
    
    // Update syllabus content
    const subjects = window.syllabusDataStore[className] || [];
    const container = document.getElementById('syllabusContainer');
    const classNum = className.replace('Class ', '');
    
    if (subjects.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
          <div style="margin-bottom:20px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Syllabus for ${className}</h3>
          <p style="font-size:14px;margin-bottom:24px;">Syllabus can be added from the admin panel.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = subjects.map((subject, idx) => {
      const iconSVG = {
        'bookOpen': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
        'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        'droplet': '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
        'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
        'monitor': '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
        'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
      };
      
      return `
        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:20px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);animation:fadeInUp 0.6s ease ${idx * 0.1}s backwards;cursor:pointer;box-sizing:border-box;" 
             onmouseover="this.style.transform='translateY(-12px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.12)';this.style.borderColor='var(--primary)'" 
             onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)';this.style.borderColor='var(--border-color)'">
          
          <div style="width:60px;height:60px;background:linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 8px 20px ${subject.color}40;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              ${iconSVG[subject.icon] || ''}
            </svg>
          </div>
          
          <h3 style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:8px;">${subject.name}</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">${className}</p>
          
          <div style="display:flex;gap:16px;margin-bottom:20px;">
            <div style="flex:1;background:var(--bg-primary);padding:12px;border-radius:12px;text-align:center;">
              <div style="font-size:20px;font-weight:900;color:${subject.color};">${subject.chapters}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Chapters</div>
            </div>
            <div style="flex:1;background:var(--bg-primary);padding:12px;border-radius:12px;text-align:center;">
              <div style="font-size:20px;font-weight:900;color:${subject.color};">${subject.topics}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Topics</div>
            </div>
          </div>
          
          <button class="btn w-full" style="background:linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%);border:none;color:white;padding:12px;border-radius:12px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="alert('Download ${subject.file}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF
          </button>
        </div>
      `;
    }).join('');
  };

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;overflow-x:hidden;">
      <div class="container" style="overflow-x:hidden;">
        <div style="text-align:center;margin-bottom:40px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('fileText', 36, 'white')}
          </div>
          <h1 style="font-size:clamp(28px, 5vw, 42px);font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Syllabus</h1>
          <p id="syllabusSubtitle" style="font-size:16px;color:var(--text-muted);">Course curriculum and study materials for Class 6</p>
        </div>

        <!-- Class Selection Buttons -->
        <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:40px;">
          ${classes.map((cls, idx) => `
            <button 
              id="syllabusClassBtn${idx}" 
              onclick="showSyllabus('${cls}', ${idx})"
              style="padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;border:2px solid var(--border-color);background:${cls === 'Class 6' ? 'var(--primary)' : 'var(--bg-secondary)'};color:${cls === 'Class 6' ? 'white' : 'var(--text-primary)'};cursor:pointer;transition:all 0.3s ease;box-shadow:${cls === 'Class 6' ? '0 4px 12px var(--primary-shadow)' : 'none'};"
            >
              ${cls}
            </button>
          `).join('')}
        </div>

        <div id="syllabusContainer" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;max-width:1200px;margin:0 auto;width:100%;">
          ${!syllabusData['Class 6'] || syllabusData['Class 6'].length === 0 ? `
            <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
              <div style="margin-bottom:20px;">
                ${icon('fileText', 64, 'var(--text-muted)')}
              </div>
              <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Syllabus Configured</h3>
              <p style="font-size:14px;margin-bottom:24px;">Syllabus information can be added from the admin panel.</p>
            </div>
          ` : syllabusData['Class 6'].map((subject, idx) => `
            <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:20px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);animation:fadeInUp 0.6s ease ${idx * 0.1}s backwards;cursor:pointer;box-sizing:border-box;" 
                 onmouseover="this.style.transform='translateY(-12px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.12)';this.style.borderColor='var(--primary)'" 
                 onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)';this.style.borderColor='var(--border-color)'">
              
              <div style="width:60px;height:60px;background:linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 8px 20px ${subject.color}40;">
                ${icon(subject.icon, 28, 'white')}
              </div>
              
              <h3 style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:8px;">${subject.name}</h3>
              <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">Class 10</p>
              
              <div style="display:flex;gap:16px;margin-bottom:20px;">
                <div style="flex:1;background:var(--bg-primary);padding:12px;border-radius:12px;text-align:center;">
                  <div style="font-size:20px;font-weight:900;color:${subject.color};">${subject.chapters}</div>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Chapters</div>
                </div>
                <div style="flex:1;background:var(--bg-primary);padding:12px;border-radius:12px;text-align:center;">
                  <div style="font-size:20px;font-weight:900;color:${subject.color};">${subject.topics}</div>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Topics</div>
                </div>
              </div>
              
              <button class="btn w-full" style="background:linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%);border:none;color:white;padding:12px;border-radius:12px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="alert('Download ${subject.file}')">
                ${icon('download', 16)} Download PDF
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Exam Routine ──────────────────────────────────
export async function renderExamRoutine() {
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  
  // Load exam schedules from API settings
  const settings = await api.getSettings();
  const examSchedules = settings?.academic?.examRoutines || {};
  
  // Define the function globally BEFORE rendering HTML
  window.examSchedulesData = examSchedules;
  window.showExamRoutine = function(className, btnIndex) {
    console.log('showExamRoutine called:', className, btnIndex);
    
    // Update subtitle
    document.getElementById('examSubtitle').textContent = 'Annual Examination 2026 • ' + className;
    
    // Update button styles
    for (let i = 0; i < 5; i++) {
      const btn = document.getElementById('examClassBtn' + i);
      if (i === btnIndex) {
        btn.style.background = 'var(--primary)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--primary)';
        btn.style.boxShadow = '0 4px 12px var(--primary-shadow)';
      } else {
        btn.style.background = 'var(--bg-secondary)';
        btn.style.color = 'var(--text-primary)';
        btn.style.borderColor = 'var(--border-color)';
        btn.style.boxShadow = 'none';
      }
    }
    
    // Update exam schedule content
    const exams = window.examSchedulesData[className] || [];
    const container = document.getElementById('examContainer');
    
    if (exams.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
          <div style="margin-bottom:20px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Exam Routine for ${className}</h3>
          <p style="font-size:14px;margin-bottom:24px;">Exam routine can be added from the admin panel.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = exams.map((exam, idx) => {
      const examDate = new Date(exam.date);
      return `
        <div style="padding:20px 24px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;animation:fadeInUp 0.5s ease ${idx * 0.08}s backwards;box-sizing:border-box;" 
             onmouseover="this.style.background='var(--bg-primary)'" 
             onmouseout="this.style.background='var(--bg-secondary)'">
          <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
            <div style="background:linear-gradient(135deg, ${exam.color} 0%, ${exam.color}dd 100%);min-width:95px;padding:14px;border-radius:16px;text-align:center;color:white;box-shadow:0 8px 20px ${exam.color}40;flex-shrink:0;">
              <div style="font-size:12px;font-weight:600;opacity:0.9;margin-bottom:4px;">${examDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
              <div style="font-size:26px;font-weight:900;">${examDate.getDate()}</div>
              <div style="font-size:11px;opacity:0.8;margin-top:4px;">${examDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            </div>
            
            <div style="flex:1;min-width:200px;">
              <h3 style="font-size:17px;font-weight:800;color:var(--text-primary);margin-bottom:10px;">${exam.subject}</h3>
              <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--text-muted);">
                <span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${exam.time}</span>
                <span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${exam.duration}</span>
                <span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Room ${exam.room}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;overflow-x:hidden;">
      <div class="container" style="max-width:1100px;overflow-x:hidden;">
        <div style="text-align:center;margin-bottom:40px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('clipboard', 36, 'white')}
          </div>
          <h1 style="font-size:clamp(28px, 5vw, 42px);font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Exam Routine</h1>
          <p id="examSubtitle" style="font-size:16px;color:var(--text-muted);">Annual Examination 2026 • Class 6</p>
        </div>

        <!-- Class Selection Buttons -->
        <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:40px;">
          ${classes.map((cls, idx) => `
            <button 
              id="examClassBtn${idx}" 
              onclick="showExamRoutine('${cls}', ${idx})"
              style="padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;border:2px solid var(--border-color);background:${cls === 'Class 6' ? 'var(--primary)' : 'var(--bg-secondary)'};color:${cls === 'Class 6' ? 'white' : 'var(--text-primary)'};cursor:pointer;transition:all 0.3s ease;box-shadow:${cls === 'Class 6' ? '0 4px 12px var(--primary-shadow)' : 'none'};"
            >
              ${cls}
            </button>
          `).join('')}
        </div>

        <!-- Exam Schedule -->
        <div id="examContainer" style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);margin-bottom:30px;width:100%;box-sizing:border-box;">
          ${!examSchedules['Class 6'] || examSchedules['Class 6'].length === 0 ? `
            <div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
              <div style="margin-bottom:20px;">
                ${icon('clipboard', 64, 'var(--text-muted)')}
              </div>
              <h3 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Exam Routine Configured</h3>
              <p style="font-size:14px;margin-bottom:24px;">Exam routines can be added from the admin panel.</p>
            </div>
          ` : examSchedules['Class 6'].map((exam, idx) => `
            <div style="padding:20px 24px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;animation:fadeInUp 0.5s ease ${idx * 0.08}s backwards;box-sizing:border-box;" 
                 onmouseover="this.style.background='var(--bg-primary)'" 
                 onmouseout="this.style.background='var(--bg-secondary)'">
              <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
                <div style="background:linear-gradient(135deg, ${exam.color} 0%, ${exam.color}dd 100%);min-width:95px;padding:14px;border-radius:16px;text-align:center;color:white;box-shadow:0 8px 20px ${exam.color}40;flex-shrink:0;">
                  <div style="font-size:12px;font-weight:600;opacity:0.9;margin-bottom:4px;">${new Date(exam.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                  <div style="font-size:26px;font-weight:900;">${new Date(exam.date).getDate()}</div>
                  <div style="font-size:11px;opacity:0.8;margin-top:4px;">${new Date(exam.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                </div>
                
                <div style="flex:1;min-width:200px;">
                  <h3 style="font-size:17px;font-weight:800;color:var(--text-primary);margin-bottom:10px;">${exam.subject}</h3>
                  <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--text-muted);">
                    <span style="display:flex;align-items:center;gap:6px;">${icon('clock', 14)} ${exam.time}</span>
                    <span style="display:flex;align-items:center;gap:6px;">${icon('calendar', 14)} ${exam.duration}</span>
                    <span style="display:flex;align-items:center;gap:6px;">${icon('mapPin', 14)} Room ${exam.room}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Important Instructions -->
        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-left:4px solid var(--warning);border-radius:20px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.08);width:100%;box-sizing:border-box;">
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <div style="width:48px;height:48px;background:linear-gradient(135deg, #fee140 0%, #ffa500 100%);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${icon('alertCircle', 24, 'white')}
            </div>
            <div style="flex:1;min-width:250px;">
              <h3 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:12px;">Important Instructions</h3>
              <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--text-muted);line-height:1.9;">
                <li style="display:flex;align-items:start;gap:8px;margin-bottom:8px;">
                  <span style="color:var(--warning);font-size:18px;">•</span>
                  <span>Students must bring their <strong style="color:var(--text-primary);">admit cards</strong> and present them at the exam hall entrance</span>
                </li>
                <li style="display:flex;align-items:start;gap:8px;margin-bottom:8px;">
                  <span style="color:var(--warning);font-size:18px;">•</span>
                  <span>Arrive <strong style="color:var(--text-primary);">30 minutes before</strong> the scheduled exam time for registration</span>
                </li>
                <li style="display:flex;align-items:start;gap:8px;margin-bottom:8px;">
                  <span style="color:var(--warning);font-size:18px;">•</span>
                  <span><strong style="color:var(--text-primary);">No electronic devices</strong> (phones, smartwatches, calculators) are allowed in the exam hall</span>
                </li>
                <li style="display:flex;align-items:start;gap:8px;">
                  <span style="color:var(--warning);font-size:18px;">•</span>
                  <span>Bring necessary <strong style="color:var(--text-primary);">stationery items</strong> (pens, pencils, erasers, rulers) in a transparent pouch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
