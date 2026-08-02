// ================================================
// GALLERY PAGE - Modern Category-Based Gallery
// ================================================

import { api } from '../utils/api.js';

let allPhotos = [];
let currentCategoryPhotos = [];
let currentPhotoIndex = 0;

export async function renderGallery() {
  // Fetch photos from backend
  allPhotos = await api.getGallery() || [];
  
  // Group photos by category
  const categories = ['Annual Function', 'Science Fair', 'Sports', 'Farewell', 'Tour', 'Reunion', 'General'];
  const categoryData = categories.map(cat => {
    const photos = allPhotos.filter(p => p.category === cat);
    return {
      name: cat,
      count: photos.length,
      thumbnail: photos[0]?.url || 'https://picsum.photos/400/300?random=999',
      gradient: getCategoryGradient(cat),
      icon: getCategoryIcon(cat)
    };
  }).filter(cat => cat.count > 0);

  const totalPhotos = allPhotos.length;
  const totalCategories = categoryData.length;

  return `
    <div class="page-container">
      <div class="page-header">
        <div class="container" style="padding:0 16px;">
          <div class="page-header-content">
            <div>
              <div class="section-tag" style="background:rgba(255,255,255,0.2);color:white;">Memories</div>
              <h1 class="page-title">Photo Gallery</h1>
              <p class="page-subtitle">${totalCategories} categories • ${totalPhotos} cherished moments</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="container section-sm" style="padding:0 16px;">
        ${totalPhotos === 0 
          ? renderEmptyState()
          : `
        <!-- Stats Bar -->
        <div style="display:flex;gap:16px;margin-bottom:32px;flex-wrap:wrap;justify-content:center;">
          <div class="stat-card">
            <div class="stat-value">${totalCategories}</div>
            <div class="stat-label">Categories</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalPhotos}</div>
            <div class="stat-label">Photos</div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="gallery-categories-grid">
          ${categoryData.map(cat => renderCategoryCard(cat)).join('')}
        </div>
        
        <!-- View All Button -->
        <div style="text-align:center;margin-top:40px;">
          <button class="btn btn-primary btn-lg" onclick="openCategoryModal('All')" style="min-width:200px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            View All Photos
          </button>
        </div>
        `}
      </div>
    </div>
    
    <style>
      .stat-card {
        background: var(--bg-primary);
        padding: 20px 32px;
        border-radius: 16px;
        box-shadow: var(--shadow-sm);
        text-align: center;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
      @media (max-width: 480px) {
        .stat-card {
          padding: 16px 24px;
        }
      }
      .stat-value {
        font-size: 32px;
        font-weight: 800;
        color: var(--primary);
        margin-bottom: 4px;
      }
      .stat-label {
        font-size: 13px;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      
      .gallery-categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 20px;
      }
      
      @media (max-width: 768px) {
        .gallery-categories-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
      }
      
      @media (max-width: 600px) {
        .gallery-categories-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
      }
      
      @media (max-width: 400px) {
        .gallery-categories-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
      }
      
      .category-card {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        background: var(--bg-primary);
        box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
      }
      
      .category-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1);
      }
      
      .category-card-image {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .category-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        opacity: 0;
      }
      
      .category-card-image img.loaded {
        opacity: 1;
      }
      
      .category-card:hover .category-card-image img {
        transform: scale(1.1);
      }
      
      .category-card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
        transition: background 0.3s;
      }
      
      .category-card:hover .category-card-overlay {
        background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
      }
      
      .category-card-icon {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      
      .category-card-title {
        color: white;
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 4px;
        text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .category-card-count {
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        font-weight: 500;
      }
      
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Modal Styles */
      .gallery-modal {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.92);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        animation: modalFadeIn 0.3s ease;
        overflow: hidden;
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .gallery-modal-header {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(20px);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
      }
      
      .gallery-modal-title {
        color: white;
        font-size: 24px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .gallery-modal-count {
        color: rgba(255,255,255,0.7);
        font-size: 14px;
        font-weight: 500;
      }
      
      .gallery-modal-close {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .gallery-modal-close:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      
      .gallery-modal-body {
        flex: 1;
        overflow-y: auto;
        padding: 32px 24px;
      }
      
      .gallery-modal-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      @media (max-width: 768px) {
        .gallery-modal-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .gallery-modal-body {
          padding: 20px 12px;
        }
      }
      
      .gallery-modal-photo {
        position: relative;
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        background: rgba(255,255,255,0.05);
        transition: transform 0.3s;
      }
      
      .gallery-modal-photo:hover {
        transform: scale(0.95);
      }
      
      .gallery-modal-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      .gallery-modal-photo img.loaded {
        opacity: 1;
      }
      
      /* Lightbox */
      .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.95);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: modalFadeIn 0.2s ease;
      }
      
      .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      
      .lightbox-image {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      }
      
      .lightbox-nav {
        display: flex;
        gap: 16px;
        align-items: center;
      }
      
      .lightbox-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-size: 24px;
      }
      
      .lightbox-btn:hover {
        background: rgba(255,255,255,0.25);
        transform: scale(1.1);
      }
      
      .lightbox-info {
        color: white;
        text-align: center;
        max-width: 600px;
      }
      
      .lightbox-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .lightbox-description {
        font-size: 14px;
        color: rgba(255,255,255,0.7);
      }
    </style>
  `;
}

function renderEmptyState() {
  return `
    <div class="card">
      <div class="card-body text-center text-muted" style="padding:80px 20px;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 24px;opacity:0.3;">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <div class="font-semibold" style="font-size:24px;margin-bottom:12px;">No Photos Yet</div>
        <div style="font-size:16px;color:var(--text-muted);">Photos will appear here once uploaded by admin</div>
      </div>
    </div>
  `;
}

function renderCategoryCard(cat) {
  return `
    <div class="category-card" onclick="openCategoryModal('${cat.name}')" role="button" tabindex="0" aria-label="View ${cat.name} photos">
      <div class="category-card-image" style="background:${cat.gradient};">
        <img src="${cat.thumbnail}" alt="${cat.name}" loading="lazy" onload="this.classList.add('loaded')">
        <div class="category-card-overlay">
          <div class="category-card-icon">${cat.icon}</div>
          <div class="category-card-title">${cat.name}</div>
          <div class="category-card-count">${cat.count} Photo${cat.count !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>
  `;
}

function getCategoryGradient(category) {
  const gradients = {
    'Annual Function': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'Science Fair': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'Sports': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'Farewell': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'Tour': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'Reunion': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'General': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  };
  return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

function getCategoryIcon(category) {
  const icons = {
    'Annual Function': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    'Science Fair': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 8h14l-4-8V3"/></svg>',
    'Sports': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    'Farewell': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    'Tour': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    'Reunion': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'General': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  };
  return icons[category] || icons['General'];
}

window.openCategoryModal = async function(categoryName) {
  currentCategoryPhotos = categoryName === 'All' 
    ? allPhotos 
    : allPhotos.filter(p => p.category === categoryName);
  
  if (currentCategoryPhotos.length === 0) {
    showToast('No photos in this category', 'info');
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'gallery-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', `${categoryName} photos`);
  
  modal.innerHTML = `
    <div class="gallery-modal-header">
      <div>
        <div class="gallery-modal-title">
          ${categoryName}
          <span class="gallery-modal-count">${currentCategoryPhotos.length} photo${currentCategoryPhotos.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <button class="gallery-modal-close" onclick="closeGalleryModal()" aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="gallery-modal-body">
      <div class="gallery-modal-grid">
        ${currentCategoryPhotos.map((photo, idx) => `
          <div class="gallery-modal-photo" onclick="openLightbox(${idx})" role="button" tabindex="0" aria-label="View ${photo.title}">
            <img src="${photo.url}" alt="${photo.title}" loading="lazy" onload="this.classList.add('loaded')">
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Keyboard support
  modal.addEventListener('keydown', handleModalKeydown);
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGalleryModal();
  });
};

window.closeGalleryModal = function() {
  const modal = document.querySelector('.gallery-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
};

window.openLightbox = function(index) {
  currentPhotoIndex = index;
  showLightboxPhoto();
};

function showLightboxPhoto() {
  const photo = currentCategoryPhotos[currentPhotoIndex];
  if (!photo) return;
  
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${photo.url}" alt="${photo.title}" class="lightbox-image">
      <div class="lightbox-nav">
        <button class="lightbox-btn" onclick="navigateLightbox(-1)" aria-label="Previous photo" ${currentPhotoIndex === 0 ? 'disabled' : ''}>‹</button>
        <span style="color:white;font-size:14px;min-width:80px;text-align:center;">${currentPhotoIndex + 1} / ${currentCategoryPhotos.length}</span>
        <button class="lightbox-btn" onclick="navigateLightbox(1)" aria-label="Next photo" ${currentPhotoIndex === currentCategoryPhotos.length - 1 ? 'disabled' : ''}>›</button>
      </div>
      <div class="lightbox-info">
        <div class="lightbox-title">${photo.title}</div>
        ${photo.description ? `<div class="lightbox-description">${photo.description}</div>` : ''}
      </div>
      <button class="lightbox-btn" onclick="closeLightbox()" aria-label="Close lightbox" style="position:absolute;top:20px;right:20px;">✕</button>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  // Keyboard support
  lightbox.addEventListener('keydown', handleLightboxKeydown);
  
  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

window.closeLightbox = function() {
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) lightbox.remove();
};

window.navigateLightbox = function(direction) {
  closeLightbox();
  currentPhotoIndex += direction;
  if (currentPhotoIndex < 0) currentPhotoIndex = 0;
  if (currentPhotoIndex >= currentCategoryPhotos.length) currentPhotoIndex = currentCategoryPhotos.length - 1;
  showLightboxPhoto();
};

function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeGalleryModal();
  }
}

function handleLightboxKeydown(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    if (currentPhotoIndex > 0) navigateLightbox(-1);
  } else if (e.key === 'ArrowRight') {
    if (currentPhotoIndex < currentCategoryPhotos.length - 1) navigateLightbox(1);
  }
}

const GALLERY_ICONS = {
  'Annual Function': `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  'Science Fair':    `<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 8h14l-4-8V3"/>`,
  'Sports':          `<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>`,
  'Farewell':        `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
  'Tour':            `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  'Reunion':         `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
};

window.filterGalleryPhotos = function(cat, btn) {
  // Update active button
  document.querySelectorAll('.btn').forEach(b => {
    if (b.onclick && b.onclick.toString().includes('filterGalleryPhotos')) {
      b.className = 'btn btn-secondary btn-sm';
    }
  });
  btn.className = 'btn btn-primary btn-sm';
  
  // Filter photos
  const photos = document.querySelectorAll('.gallery-photo-item');
  photos.forEach(photo => {
    if (cat === 'All' || photo.dataset.category === cat) {
      photo.style.display = 'block';
    } else {
      photo.style.display = 'none';
    }
  });
};

window.viewGalleryPhotoPublic = async function(index) {
  const photos = await api.getGallery();
  const photo = photos[index];
  
  if (!photo) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = `
    <div class="modal" style="max-width:900px;">
      <div class="modal-header">
        <div>
          <div class="font-semibold">${photo.title}</div>
          <div class="text-xs text-muted">${photo.category} • ${new Date(photo.uploadedAt).toLocaleDateString()}</div>
        </div>
        <button class="btn btn-ghost btn-icon" onclick="this.closest('.modal-overlay').remove()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="padding:0;">
        <img src="${photo.url}" style="width:100%;height:auto;display:block;background:#000;" alt="${photo.title}">
        ${photo.description ? `<div style="padding:20px;"><p style="color:var(--text-muted);">${photo.description}</p></div>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};
