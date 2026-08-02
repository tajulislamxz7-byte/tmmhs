// ================================================
// IMAGE HANDLER UTILITY
// Handles profile picture upload and conversion
// ================================================

import { verifyFaceInImage } from './faceVerification.js';

/**
 * Convert image file to base64 string
 * @param {File} file - Image file from input
 * @returns {Promise<string>} - Base64 encoded image
 */
export function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload an image file'));
      return;
    }

    // Validate file size (max 15MB)
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      reject(new Error('Image size must be less than 15MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Resize and compress image before upload
 * @param {string} base64 - Base64 image string
 * @param {number} maxWidth - Maximum width (default 400px)
 * @param {number} maxHeight - Maximum height (default 400px)
 * @returns {Promise<string>} - Resized base64 image
 */
export function resizeImage(base64, maxWidth = 400, maxHeight = 400) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression (0.8 quality)
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64;
  });
}

/**
 * Open image cropper modal
 * @param {string} base64Image - Base64 image to crop
 * @param {HTMLElement} previewElement - Element to show preview
 * @returns {Promise<string>} - Cropped base64 image
 */
export function openImageCropper(base64Image, previewElement) {
  return new Promise((resolve, reject) => {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
      padding: 16px;
    `;

    // Create modal content
    const content = document.createElement('div');
    content.style.cssText = `
      background: var(--bg-primary);
      border-radius: 16px;
      padding: 20px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    // Create crop container
    const cropContainer = document.createElement('div');
    cropContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 400px;
      max-height: 50vh;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;
      touch-action: none;
    `;

    // Create draggable image
    const img = document.createElement('img');
    img.src = base64Image;
    img.style.cssText = `
      position: absolute;
      cursor: move;
      user-select: none;
      max-width: none;
      -webkit-user-drag: none;
    `;

    // Variables for dragging and zooming
    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX, startY;
    let initialDistance = 0;

    img.onload = () => {
      // Center image initially
      const containerWidth = cropContainer.offsetWidth;
      const containerHeight = cropContainer.offsetHeight;
      
      // Scale image to fit container while maintaining aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const containerAspect = containerWidth / containerHeight;
      
      if (imgAspect > containerAspect) {
        scale = containerHeight / img.naturalHeight;
      } else {
        scale = containerWidth / img.naturalWidth;
      }
      
      // Center the image
      posX = (containerWidth - img.naturalWidth * scale) / 2;
      posY = (containerHeight - img.naturalHeight * scale) / 2;
      
      updateImageTransform();
    };

    function updateImageTransform() {
      img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
      img.style.transformOrigin = '0 0';
    }

    // Get touch/mouse position
    function getPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    // Get distance between two touches (for pinch zoom)
    function getDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Mouse/touch drag handlers - START
    function handleStart(e) {
      if (e.touches && e.touches.length === 2) {
        // Pinch zoom start
        initialDistance = getDistance(e.touches);
        return;
      }
      
      isDragging = true;
      const pos = getPos(e);
      startX = pos.x - posX;
      startY = pos.y - posY;
      e.preventDefault();
    }

    function handleMove(e) {
      if (e.touches && e.touches.length === 2) {
        // Pinch zoom
        e.preventDefault();
        const distance = getDistance(e.touches);
        const delta = distance / initialDistance;
        const newScale = scale * delta;
        
        if (newScale >= 0.5 && newScale <= 3) {
          scale = newScale;
          initialDistance = distance;
          updateImageTransform();
        }
        return;
      }
      
      if (!isDragging) return;
      e.preventDefault();
      const pos = getPos(e);
      posX = pos.x - startX;
      posY = pos.y - startY;
      updateImageTransform();
    }

    function handleEnd() {
      isDragging = false;
      initialDistance = 0;
    }

    // Mouse events
    cropContainer.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch events
    cropContainer.addEventListener('touchstart', handleStart, { passive: false });
    cropContainer.addEventListener('touchmove', handleMove, { passive: false });
    cropContainer.addEventListener('touchend', handleEnd);

    // Zoom with mouse wheel (PC only)
    cropContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = scale * delta;
      
      // Limit zoom
      if (newScale >= 0.5 && newScale <= 3) {
        scale = newScale;
        updateImageTransform();
      }
    }, { passive: false });

    cropContainer.appendChild(img);

    // Create zoom controls
    const controls = document.createElement('div');
    controls.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
      margin-bottom: 16px;
    `;

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '−';
    zoomOutBtn.className = 'btn btn-secondary';
    zoomOutBtn.style.cssText = 'width: 44px; height: 44px; padding: 0; font-size: 28px; flex-shrink: 0;';
    zoomOutBtn.onclick = () => {
      if (scale > 0.5) {
        scale *= 0.9;
        updateImageTransform();
      }
    };

    const zoomLabel = document.createElement('span');
    zoomLabel.textContent = 'Adjust & Position';
    zoomLabel.style.cssText = 'font-size: 13px; color: var(--text-secondary); font-weight: 600;';

    const zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.className = 'btn btn-secondary';
    zoomInBtn.style.cssText = 'width: 44px; height: 44px; padding: 0; font-size: 28px; flex-shrink: 0;';
    zoomInBtn.onclick = () => {
      if (scale < 3) {
        scale *= 1.1;
        updateImageTransform();
      }
    };

    controls.appendChild(zoomOutBtn);
    controls.appendChild(zoomLabel);
    controls.appendChild(zoomInBtn);

    // Create action buttons
    const actions = document.createElement('div');
    actions.style.cssText = 'display: flex; gap: 12px;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.style.cssText = 'flex: 1; padding: 12px; font-size: 15px;';
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
      reject(new Error('Crop cancelled'));
    };

    const cropBtn = document.createElement('button');
    cropBtn.textContent = '✓ Use This Photo';
    cropBtn.className = 'btn btn-primary';
    cropBtn.style.cssText = 'flex: 1; padding: 12px; font-size: 15px;';
    cropBtn.onclick = async () => {
      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const size = 400; // Square output
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Draw the cropped portion
      const sourceX = -posX / scale;
      const sourceY = -posY / scale;
      const sourceSize = cropContainer.offsetWidth / scale;

      ctx.drawImage(
        img,
        sourceX, sourceY, sourceSize, sourceSize,
        0, 0, size, size
      );

      // Convert to base64
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
      
      // Update preview
      if (previewElement) {
        previewElement.src = croppedBase64;
      }

      document.body.removeChild(modal);
      resolve(croppedBase64);
    };

    actions.appendChild(cancelBtn);
    actions.appendChild(cropBtn);

    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: 1.5;
    `;
    
    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
      instructions.innerHTML = '👆 Drag to move • 🤏 Pinch to zoom • Use buttons below';
    } else {
      instructions.innerHTML = '🖱️ Drag to move • 🔍 Scroll to zoom • Use buttons below';
    }

    // Assemble modal
    content.appendChild(cropContainer);
    content.appendChild(instructions);
    content.appendChild(controls);
    content.appendChild(actions);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Prevent body scroll on mobile
    document.body.style.overflow = 'hidden';
    
    // Cleanup function
    const cleanup = () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };
    
    // Add cleanup to buttons
    const originalCancelClick = cancelBtn.onclick;
    const originalCropClick = cropBtn.onclick;
    
    cancelBtn.onclick = () => {
      cleanup();
      originalCancelClick();
    };
    
    cropBtn.onclick = async () => {
      cleanup();
      await originalCropClick();
    };
  });
}

/**
 * Handle profile picture upload with preview
 * @param {HTMLInputElement} input - File input element
 * @param {HTMLElement} previewElement - Element to show preview
 * @returns {Promise<string|null>} - Base64 image or null
 */
export async function handleProfilePictureUpload(input, previewElement) {
  const file = input.files?.[0];
  if (!file) return null;

  try {
    // Convert to base64
    const base64 = await convertImageToBase64(file);
    
    // Verify image contains a real human face using AI detection
    console.log('🔍 Verifying face in image...');
    const verification = await verifyFaceInImage(base64);
    
    if (!verification.valid) {
      throw new Error(verification.reason || 'Image verification failed');
    }
    
    console.log('✅ Face verification passed');
    
    // Open cropper
    const croppedImage = await openImageCropper(base64, previewElement);

    return croppedImage;
  } catch (error) {
    console.error('❌ Image upload error:', error);
    throw error;
  }
}

/**
 * Get default avatar URL
 * @returns {string} - Default avatar URL
 */
export function getDefaultAvatar() {
  return 'https://i.imgur.com/x9wE0QT.png';
}

/**
 * Check if avatar is custom or default
 * @param {string} avatarUrl - Avatar URL to check
 * @returns {boolean} - True if custom, false if default
 */
export function isCustomAvatar(avatarUrl) {
  if (!avatarUrl) return false;
  return avatarUrl.startsWith('data:image/') || 
         (!avatarUrl.includes('imgur.com') && !avatarUrl.includes('dicebear.com'));
}
