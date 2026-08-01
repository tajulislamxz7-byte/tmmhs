// ================================================
// IMAGE HANDLER UTILITY
// Handles profile picture upload and conversion
// ================================================

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

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      reject(new Error('Image size must be less than 2MB'));
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
    
    // Resize and compress
    const resized = await resizeImage(base64);

    // Update preview
    if (previewElement) {
      previewElement.src = resized;
      previewElement.style.display = 'block';
    }

    return resized;
  } catch (error) {
    console.error('Image upload error:', error);
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
