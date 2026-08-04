// ================================================
// ACADEMIC PAGES — Modern Professional Design
// ================================================
import { icon } from '../utils/icons.js';

// ── Academic Calendar ─────────────────────────────
export function renderAcademicCalendar() {
  const events = [
    { date: '2026-01-05', title: 'First Day of School', type: 'academic', desc: 'Classes begin for all grades' },
    { date: '2026-02-21', title: 'International Mother Language Day', type: 'holiday', desc: 'National holiday celebrating Bangla language' },
    { date: '2026-03-17', title: 'Birthday of Bangabandhu', type: 'holiday', desc: 'National holiday honoring the Father of the Nation' },
    { date: '2026-03-26', title: 'Independence Day', type: 'holiday', desc: 'Celebrating Bangladesh independence' },
    { date: '2026-04-14', title: 'Pohela Boishakh', type: 'holiday', desc: 'Bengali New Year celebration' },
    { date: '2026-05-01', title: 'May Day', type: 'holiday', desc: 'International Workers Day' },
    { date: '2026-08-15', title: 'National Mourning Day', type: 'holiday', desc: 'Remembering martyrs of August 15' },
    { date: '2026-12-16', title: 'Victory Day', type: 'holiday', desc: 'Celebrating victory in Liberation War' },
  ];

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
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;max-width:1200px;margin:0 auto;">
          ${events.map((event, idx) => `
            <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:20px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.1);transition:all 0.3s ease;animation:fadeInUp 0.6s ease ${idx * 0.1}s backwards;cursor:pointer;" 
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
export function renderHolidayCalendar() {
  const holidays = [
    { date: '2026-02-21', title: 'International Mother Language Day', desc: 'Martyrs Day', color: '#f093fb' },
    { date: '2026-03-17', title: 'Birthday of Bangabandhu Sheikh Mujibur Rahman', desc: 'National Day', color: '#fa709a' },
    { date: '2026-03-26', title: 'Independence Day', desc: 'National Holiday', color: '#fee140' },
    { date: '2026-04-14', title: 'Pohela Boishakh', desc: 'Bengali New Year', color: '#30cfd0' },
    { date: '2026-05-01', title: 'May Day', desc: 'International Workers Day', color: '#a8edea' },
    { date: '2026-08-15', title: 'National Mourning Day', desc: 'Remembrance Day', color: '#fed6e3' },
    { date: '2026-12-16', title: 'Victory Day', desc: 'National Holiday', color: '#c471f5' },
    { date: '2026-12-25', title: 'Christmas Day', desc: 'Optional Holiday', color: '#fa709a' },
  ];

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;">
      <div class="container" style="max-width:1000px;">
        <div style="text-align:center;margin-bottom:50px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('calendar', 36, 'white')}
          </div>
          <h1 style="font-size:42px;font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Holiday Calendar 2026</h1>
          <p style="font-size:16px;color:var(--text-muted);">Public holidays and school breaks throughout the year</p>
        </div>

        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          ${holidays.map((h, idx) => `
            <div style="padding:28px 32px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;cursor:pointer;animation:fadeInUp 0.5s ease ${idx * 0.05}s backwards;" 
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
export function renderClassRoutine() {
  const routine = [
    { time: '8:00-8:45', subject: 'English', teacher: 'Mr. Rahman', room: '201', color: '#667eea' },
    { time: '8:45-9:30', subject: 'Mathematics', teacher: 'Mrs. Ahmed', room: '305', color: '#f093fb' },
    { time: '9:30-10:15', subject: 'Physics', teacher: 'Mr. Khan', room: '401', color: '#4facfe' },
    { time: '10:15-10:30', subject: 'Break', teacher: '', room: '', color: '#fee140', isBreak: true },
    { time: '10:30-11:15', subject: 'Chemistry', teacher: 'Dr. Islam', room: '402', color: '#30cfd0' },
    { time: '11:15-12:00', subject: 'Biology', teacher: 'Ms. Haque', room: '403', color: '#a8edea' },
    { time: '12:00-12:45', subject: 'ICT', teacher: 'Mr. Karim', room: '501', color: '#fa709a' },
  ];

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;">
      <div class="container" style="max-width:900px;">
        <div style="text-align:center;margin-bottom:50px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('clock', 36, 'white')}
          </div>
          <h1 style="font-size:42px;font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Class Routine</h1>
          <p style="font-size:16px;color:var(--text-muted);">Class 10 - Section A • Daily Schedule</p>
        </div>

        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          ${routine.map((period, idx) => `
            <div style="padding:24px 28px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;${period.isBreak ? 'background:linear-gradient(90deg, rgba(254, 225, 64, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);' : ''}animation:fadeInUp 0.5s ease ${idx * 0.05}s backwards;" 
                 ${!period.isBreak ? `onmouseover="this.style.background='var(--bg-primary)'" onmouseout="this.style.background='var(--bg-secondary)'"` : ''}>
              <div style="display:flex;align-items:center;gap:20px;">
                <div style="background:${period.isBreak ? 'linear-gradient(135deg, #fee140 0%, #ffa500 100%)' : `linear-gradient(135deg, ${period.color} 0%, ${period.color}dd 100%)`};min-width:90px;padding:12px;border-radius:12px;text-align:center;color:white;box-shadow:0 6px 16px ${period.color}40;">
                  <div style="font-size:15px;font-weight:800;">${period.time}</div>
                </div>
                <div style="flex:1;">
                  <h3 style="font-size:17px;font-weight:800;color:var(--text-primary);margin-bottom:${period.isBreak ? '0' : '6px'};display:flex;align-items:center;gap:8px;">
                    ${period.isBreak ? icon('coffee', 18) : ''} ${period.subject}
                  </h3>
                  ${!period.isBreak ? `
                    <div style="display:flex;align-items:center;gap:16px;font-size:13px;color:var(--text-muted);">
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
  `;
}

// ── Syllabus ──────────────────────────────────────
export function renderSyllabus() {
  const subjects = [
    { name: 'English', class: 'Class 10', topics: 15, chapters: 12, file: 'english-syllabus.pdf', color: '#667eea', icon: 'bookOpen' },
    { name: 'Mathematics', class: 'Class 10', topics: 20, chapters: 16, file: 'math-syllabus.pdf', color: '#f093fb', icon: 'activity' },
    { name: 'Physics', class: 'Class 10', topics: 18, chapters: 14, file: 'physics-syllabus.pdf', color: '#4facfe', icon: 'zap' },
    { name: 'Chemistry', class: 'Class 10', topics: 16, chapters: 13, file: 'chemistry-syllabus.pdf', color: '#30cfd0', icon: 'droplet' },
    { name: 'Biology', class: 'Class 10', topics: 19, chapters: 15, file: 'biology-syllabus.pdf', color: '#a8edea', icon: 'heart' },
    { name: 'ICT', class: 'Class 10', topics: 12, chapters: 10, file: 'ict-syllabus.pdf', color: '#fa709a', icon: 'monitor' },
  ];

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;">
      <div class="container">
        <div style="text-align:center;margin-bottom:50px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('fileText', 36, 'white')}
          </div>
          <h1 style="font-size:42px;font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Syllabus</h1>
          <p style="font-size:16px;color:var(--text-muted);">Course curriculum and study materials for Class 10</p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;max-width:1200px;margin:0 auto;">
          ${subjects.map((subject, idx) => `
            <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:20px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.08);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);animation:fadeInUp 0.6s ease ${idx * 0.1}s backwards;cursor:pointer;" 
                 onmouseover="this.style.transform='translateY(-12px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.12)';this.style.borderColor='var(--primary)'" 
                 onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)';this.style.borderColor='var(--border-color)'">
              
              <div style="width:60px;height:60px;background:linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 8px 20px ${subject.color}40;">
                ${icon(subject.icon, 28, 'white')}
              </div>
              
              <h3 style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:8px;">${subject.name}</h3>
              <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">${subject.class}</p>
              
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
export function renderExamRoutine() {
  const exams = [
    { date: '2026-08-10', time: '10:00 AM', subject: 'English', duration: '3 hours', room: '201', color: '#667eea' },
    { date: '2026-08-12', time: '10:00 AM', subject: 'Mathematics', duration: '3 hours', room: '305', color: '#f093fb' },
    { date: '2026-08-14', time: '10:00 AM', subject: 'Physics', duration: '3 hours', room: '401', color: '#4facfe' },
    { date: '2026-08-16', time: '10:00 AM', subject: 'Chemistry', duration: '3 hours', room: '402', color: '#30cfd0' },
    { date: '2026-08-18', time: '10:00 AM', subject: 'Biology', duration: '3 hours', room: '403', color: '#a8edea' },
    { date: '2026-08-20', time: '10:00 AM', subject: 'ICT', duration: '2 hours', room: '501', color: '#fa709a' },
  ];

  return `
    <div style="min-height:100vh;background:var(--bg-primary);padding:80px 20px 80px;">
      <div class="container" style="max-width:1100px;">
        <div style="text-align:center;margin-bottom:50px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:70px;height:70px;background:var(--primary);border-radius:20px;margin-bottom:20px;box-shadow:0 8px 24px var(--primary-shadow);">
            ${icon('clipboard', 36, 'white')}
          </div>
          <h1 style="font-size:42px;font-weight:900;color:var(--text-primary);margin-bottom:12px;letter-spacing:-1px;">Exam Routine</h1>
          <p style="font-size:16px;color:var(--text-muted);">Annual Examination 2026 • Class 10</p>
        </div>

        <!-- Exam Schedule -->
        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);margin-bottom:30px;">
          ${exams.map((exam, idx) => `
            <div style="padding:24px 28px;border-bottom:1px solid var(--border-color);transition:all 0.3s ease;animation:fadeInUp 0.5s ease ${idx * 0.08}s backwards;" 
                 onmouseover="this.style.background='var(--bg-primary)'" 
                 onmouseout="this.style.background='var(--bg-secondary)'">
              <div style="display:flex;align-items:center;gap:24px;">
                <div style="background:linear-gradient(135deg, ${exam.color} 0%, ${exam.color}dd 100%);min-width:100px;padding:16px;border-radius:16px;text-align:center;color:white;box-shadow:0 8px 20px ${exam.color}40;">
                  <div style="font-size:13px;font-weight:600;opacity:0.9;margin-bottom:4px;">${new Date(exam.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                  <div style="font-size:28px;font-weight:900;">${new Date(exam.date).getDate()}</div>
                  <div style="font-size:11px;opacity:0.8;margin-top:4px;">${new Date(exam.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                </div>
                
                <div style="flex:1;">
                  <h3 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:10px;">${exam.subject}</h3>
                  <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:13px;color:var(--text-muted);">
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
        <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-left:4px solid var(--warning);border-radius:20px;padding:32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          <div style="display:flex;gap:16px;">
            <div style="width:48px;height:48px;background:linear-gradient(135deg, #fee140 0%, #ffa500 100%);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${icon('alertCircle', 24, 'white')}
            </div>
            <div>
              <h3 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:12px;">Important Instructions</h3>
              <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--text-muted);line-height:2;">
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
