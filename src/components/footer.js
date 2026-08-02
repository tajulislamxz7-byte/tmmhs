// ================================================
// FOOTER COMPONENT
// ================================================

import { api } from '../utils/api.js';

const S = (d, size=18, color='currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export async function renderFooter() {
  // Load settings from API
  const settings = await api.getSettings() || {};
  const schoolName = settings.name || 'Tiarkhali M.M High School';
  const founded = settings.founded || '1985';
  const tagline = settings.tagline || 'Nurturing Excellence, Inspiring Futures';
  const address = settings.address || 'Tiarkhali, Bangladesh';
  
  return `
    <footer class="footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-grid">

            <!-- Brand -->
            <div>
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer;" onclick="navigate('home')">
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="10" fill="#2563eb"/>
                  <path d="M6 24L16 8L26 24H6Z" fill="white" opacity="0.9"/>
                  <circle cx="16" cy="17" r="4" fill="#60a5fa"/>
                </svg>
                <div>
                  <div style="font-size:18px;font-weight:800;color:white;">${schoolName}</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.5);">Est. ${founded}</div>
                </div>
              </div>
              <p style="color:rgba(255,255,255,0.65);font-size:13px;line-height:1.8;max-width:280px;">
                ${tagline} since ${founded}. A premier institution committed to holistic education.
              </p>
              <div style="display:flex;gap:10px;margin-top:16px;">
                <a href="#" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.7);transition:all 0.2s;" onmouseover="this.style.background='#1877f2'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.7);transition:all 0.2s;" onmouseover="this.style.background='#ff0000'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                </a>
                <a href="#" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.7);transition:all 0.2s;" onmouseover="this.style.background='#e1306c'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.7);transition:all 0.2s;" onmouseover="this.style.background='#0077b5'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>

            <!-- Quick Links -->
            <div>
              <h4 class="footer-heading">Quick Links</h4>
              <ul class="footer-links">
                <li><a onclick="navigate('home')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',16,'rgba(255,255,255,0.5)')} Home</a></li>
                <li><a onclick="navigate('about')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',16,'rgba(255,255,255,0.5)')} About Us</a></li>
                <li><a onclick="navigate('students')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',16,'rgba(255,255,255,0.5)')} Students</a></li>
                <li><a onclick="navigate('teachers')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',16,'rgba(255,255,255,0.5)')} Teachers</a></li>
                <li><a onclick="navigate('alumni')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',16,'rgba(255,255,255,0.5)')} Alumni</a></li>
                <li><a onclick="navigate('gallery')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',16,'rgba(255,255,255,0.5)')} Gallery</a></li>
              </ul>
            </div>

            <!-- Academic -->
            <div>
              <h4 class="footer-heading">Academic</h4>
              <ul class="footer-links">
                <li><a onclick="navigate('batches')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',16,'rgba(255,255,255,0.5)')} Batches</a></li>
                <li><a onclick="navigate('results')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>',16,'rgba(255,255,255,0.5)')} Results</a></li>
                <li><a onclick="navigate('notices')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',16,'rgba(255,255,255,0.5)')} Notice Board</a></li>
                <li><a onclick="navigate('events')" style="cursor:pointer;display:flex;align-items:center;gap:10px;">${S('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',16,'rgba(255,255,255,0.5)')} Events</a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="footer-heading">Contact Us</h4>
              <ul style="list-style:none;display:flex;flex-direction:column;gap:12px;">
                <li style="display:flex;align-items:flex-start;gap:10px;color:rgba(255,255,255,0.7);font-size:13px;">
                  ${S('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',16,'#60a5fa')}
                  <span>${address}</span>
                </li>
                <li style="display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.7);font-size:13px;">
                  ${S('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91A16 16 0 0 0 14 15.91l.29-.29a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 18v.92z"/>',16,'#60a5fa')}
                  <span>${settings.phone || '+880 1711-234567'}</span>
                </li>
                <li style="display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.7);font-size:13px;">
                  ${S('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',16,'#60a5fa')}
                  <span>${settings.email || 'info@tiarkhali-mmhs.edu.bd'}</span>
                </li>
                <li style="display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.7);font-size:13px;">
                  ${S('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',16,'#60a5fa')}
                  <span>Mon–Sat: 8:00 AM – 4:00 PM</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <p style="color:rgba(255,255,255,0.4);font-size:13px;">
            © ${new Date().getFullYear()} ${schoolName}. All rights reserved.
          </p>
          <div style="display:flex;gap:20px;font-size:13px;">
            <a href="#" style="color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px;">${S('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',13,'rgba(255,255,255,0.4)')} Privacy</a>
            <a href="#" style="color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px;">${S('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',13,'rgba(255,255,255,0.4)')} Terms</a>
            <a href="#" style="color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:5px;">${S('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',13,'rgba(255,255,255,0.4)')} Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
