// ================================================
// GALLERY PAGE
// ================================================

import { gallery } from '../data/sampleData.js';

export function renderGallery() {
  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Memories</div>
              <h1 class="page-title">Photo Gallery</h1>
              <p class="page-subtitle">Cherished moments from events, functions, and everyday school life</p>
            </div>
            <button class="btn btn-primary" onclick="if(requireAdmin())showToast('Upload feature — use Admin Panel → Gallery','info')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> Upload Photos
            </button>
          </div>
        </div>
      </div>
      <div class="container section-sm">
        <!-- Category Filter -->
        <div class="flex gap-2 mb-6 overflow-x-auto" style="padding-bottom:4px;">
          ${['All','Annual Function','Science Fair','Sports','Farewell','Tour','Reunion'].map(cat=>`
            <button class="search-filter ${cat==='All'?'active':''}" onclick="filterGallery('${cat}',this)">${cat}</button>
          `).join('')}
        </div>

        <!-- Albums Grid -->
        <div class="gallery-grid" id="galleryGrid">
          ${gallery.map(album => renderAlbumCard(album)).join('')}
        </div>
      </div>
    </div>
  `;
}

const GALLERY_ICONS = {
  'Annual Function': `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  'Science Fair':    `<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 8h14l-4-8V3"/>`,
  'Sports':          `<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>`,
  'Farewell':        `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
  'Tour':            `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  'Reunion':         `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
};

function renderAlbumCard(album) {
  const iconPath = GALLERY_ICONS[album.category] || `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`;
  return `
    <div class="gallery-album-card" data-category="${album.category}" onclick="openAlbum('${album.id}')">
      <div class="gallery-album-cover" style="background:${album.coverColor};">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.25;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">${iconPath}</svg>
        </div>
        <div class="gallery-overlay">
          <div class="gallery-label">${album.title}</div>
          <div class="gallery-count">${album.images} Photos</div>
        </div>
      </div>
      <div style="padding:16px 20px;background:var(--bg-primary);">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-sm">${album.title}</div>
            <div class="text-xs text-muted">${album.category} · ${album.date}</div>
          </div>
          <span class="badge badge-gray">${album.images} photos</span>
        </div>
      </div>
    </div>
  `;
}

window.filterGallery = function(cat, btn) {
  document.querySelectorAll('.search-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-album-card').forEach(card => {
    card.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
  });
};

window.openAlbum = function(id) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };

  // Generate 12 placeholder photo tiles
  const photos = Array.from({length: 12}, (_,i) => `
    <div style="aspect-ratio:1;background:linear-gradient(135deg,hsl(${i*30},60%,55%),hsl(${i*30+60},60%,45%));border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="showToast('Opening photo ${i+1}...','info')">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    </div>
  `).join('');

  modal.innerHTML = `
    <div class="modal" style="max-width:900px;">
      <div class="modal-header">
        <div class="font-semibold" style="font-size:18px;">Album Photos</div>
        <button class="btn btn-ghost btn-icon" onclick="document.querySelector('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">${photos}</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};
