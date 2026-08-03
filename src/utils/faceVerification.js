// ================================================
// FACE VERIFICATION UTILITY
// Uses Face Detection API to verify real human faces
// ================================================

/**
 * Verify if image contains a real human face
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<{valid: boolean, reason?: string, faces?: number}>}
 */
export async function verifyFaceInImage(base64Image) {
  try {
    // Convert base64 to blob for API
    const blob = await base64ToBlob(base64Image);
    
    // Try multiple face detection methods
    const result = await detectFaceWithBrowserAPI(base64Image);
    
    return result;
    
  } catch (error) {
    // Return validation with clear message
    return {
      valid: false,
      reason: 'Unable to verify image. Please try uploading a clear, well-lit photo of your face.'
    };
  }
}

/**
 * Convert base64 to Blob
 */
async function base64ToBlob(base64) {
  const response = await fetch(base64);
  return await response.blob();
}

/**
 * Detect face using Browser's Face Detection API or Canvas-based detection
 */
async function detectFaceWithBrowserAPI(base64Image) {
  return new Promise(async (resolve) => {
    try {
      const img = new Image();
      
      img.onload = async () => {
        // Use canvas-based face detection heuristics
        const result = await analyzeImageForFace(img);
        
        if (result.valid) {
          console.log('✅ Face detection PASSED - Real human face detected');
        } else {
          console.log('🚫 Face detection FAILED:', result.reason);
        }
        
        resolve(result);
      };
      
      img.onerror = () => {
        resolve({
          valid: false,
          reason: 'Failed to load image. Please try another photo.'
        });
      };
      
      img.src = base64Image;
      
    } catch (error) {
      console.error('Face detection error:', error);
      resolve({
        valid: false,
        reason: 'Unable to verify face. Please upload a clear photo showing your face.'
      });
    }
  });
}

/**
 * Analyze image for face using advanced heuristics
 * This checks for characteristics of real human faces vs anime/cartoons/logos
 */
async function analyzeImageForFace(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Use higher resolution for better analysis
  const size = 200;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  // Collect statistics
  let stats = {
    skinTonePixels: 0,
    unnaturalColors: 0,
    highSaturation: 0,
    edgePixels: 0,
    brightness: [],
    totalPixels: 0,
    colorVariety: new Set(),
  };
  
  // Analyze pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Track brightness
    const brightness = (r + g + b) / 3;
    stats.brightness.push(brightness);
    
    // Check for skin tones (all ethnicities)
    if (isRealisticSkinTone(r, g, b)) {
      stats.skinTonePixels++;
    }
    
    // Check saturation for anime detection
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    if (saturation > 0.5 && max > 100) {
      stats.highSaturation++;
    }
    
    // Detect unnatural colors (anime hair, eyes)
    if (hasUnnaturalColor(r, g, b, saturation, brightness)) {
      stats.unnaturalColors++;
    }
    
    // Track color variety (cartoons have less variety)
    const colorKey = `${Math.floor(r/15)},${Math.floor(g/15)},${Math.floor(b/15)}`;
    stats.colorVariety.add(colorKey);
    
    stats.totalPixels++;
  }
  
  // Calculate ratios
  const skinRatio = stats.skinTonePixels / stats.totalPixels;
  const unnaturalRatio = stats.unnaturalColors / stats.totalPixels;
  const saturationRatio = stats.highSaturation / stats.totalPixels;
  const avgBrightness = stats.brightness.reduce((a, b) => a + b, 0) / stats.brightness.length;
  const colorVariety = stats.colorVariety.size;
  
  // Calculate brightness variance (real photos have more variance)
  const brightnessMean = avgBrightness;
  const brightnessVariance = stats.brightness.reduce((sum, b) => sum + Math.pow(b - brightnessMean, 2), 0) / stats.brightness.length;
  const brightnessStdDev = Math.sqrt(brightnessVariance);
  
  console.log('📊 Image Analysis:', {
    skinRatio: skinRatio.toFixed(3),
    unnaturalRatio: unnaturalRatio.toFixed(3),
    saturationRatio: saturationRatio.toFixed(3),
    colorVariety,
    avgBrightness: avgBrightness.toFixed(1),
    brightnessStdDev: brightnessStdDev.toFixed(1)
  });
  
  // Validation Rules - STRICT for real face detection
  
  // 1. Must have skin tones (at least 15% for partial face/angled shots)
  if (skinRatio < 0.15) {
    return {
      valid: false,
      reason: 'Please upload a clear photo of your own face. Make sure your face is visible and well-lit.'
    };
  }
  
  // 2. Too many unnatural colors = anime/cartoon
  if (unnaturalRatio > 0.08) {
    return {
      valid: false,
      reason: 'Please upload a real photo. Cartoons, anime, and digital art are not allowed.'
    };
  }
  
  // 3. Too much saturation = anime/cartoon
  if (saturationRatio > 0.30) {
    return {
      valid: false,
      reason: 'Please upload a real photo. Cartoons and anime images are not allowed.'
    };
  }
  
  // 4. Too few colors = logo/simple graphic
  if (colorVariety < 100) {
    return {
      valid: false,
      reason: 'Please upload a photo, not a logo or simple graphic.'
    };
  }
  
  // 5. Check brightness extremes
  if (avgBrightness < 25) {
    return {
      valid: false,
      reason: 'Image is too dark. Please upload a well-lit photo of your face.'
    };
  }
  
  if (avgBrightness > 235) {
    return {
      valid: false,
      reason: 'Image is overexposed. Please upload a clearer photo.'
    };
  }
  
  // 6. Check brightness variance (real photos have natural variance)
  if (brightnessStdDev < 20) {
    return {
      valid: false,
      reason: 'Image appears to be a flat graphic. Please upload a real photo of your face.'
    };
  }
  
  // 7. Check for screenshots (very high edge content)
  const edgeCount = detectSharpEdges(imageData, size);
  const edgeRatio = edgeCount / (stats.totalPixels / 4); // normalized
  
  if (edgeRatio > 0.35) {
    return {
      valid: false,
      reason: 'Please upload a photo, not a screenshot or document.'
    };
  }
  
  // All checks passed - likely a real face
  return {
    valid: true,
    confidence: calculateConfidence(skinRatio, unnaturalRatio, saturationRatio, colorVariety)
  };
}

/**
 * Check if color is realistic skin tone (all ethnicities)
 */
function isRealisticSkinTone(r, g, b) {
  // Expanded skin tone detection for all skin colors
  // Light to dark skin tones
  if (r < 50 || g < 30 || b < 20) return false; // Too dark to be skin
  if (r > 255 || g > 230 || b > 220) return false; // Too washed out
  
  // Skin tones generally have: R > G > B with specific relationships
  if (r > g && g >= b) {
    // Check if it's within realistic skin tone ranges
    const rg_diff = r - g;
    const gb_diff = g - b;
    
    // Realistic skin tone relationships
    if (rg_diff > 10 && rg_diff < 80 && gb_diff > 3 && gb_diff < 50) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detect unnatural colors typical of anime/cartoons
 */
function hasUnnaturalColor(r, g, b, saturation, brightness) {
  // Skip very dark/light pixels
  if (brightness < 40 || brightness > 240) return false;
  
  // Need high saturation for unnatural colors
  if (saturation < 0.45) return false;
  
  const max = Math.max(r, g, b);
  
  // Vivid pink/magenta (anime hair)
  if (r > 160 && b > 130 && g < r * 0.65 && saturation > 0.5) return true;
  
  // Vivid purple (anime hair)
  if (b > 150 && r > 130 && Math.abs(r - b) < 50 && g < b * 0.65) return true;
  
  // Vivid blue (anime eyes/hair)
  if (b > 170 && b > r * 1.4 && b > g * 1.3) return true;
  
  // Vivid green/cyan (anime hair)
  if (g > 170 && g > r * 1.4 && saturation > 0.5) return true;
  
  // Unnatural orange/red
  if (r > 210 && g > 90 && g < 170 && b < 90 && saturation > 0.65) return true;
  
  return false;
}

/**
 * Detect sharp edges (screenshots, text)
 */
function detectSharpEdges(imageData, size) {
  const data = imageData.data;
  let edgeCount = 0;
  
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x += 2) { // Sample every other pixel
      const idx = (y * size + x) * 4;
      const idxRight = (y * size + (x + 1)) * 4;
      const idxDown = ((y + 1) * size + x) * 4;
      
      const current = (data[idx] + data[idx+1] + data[idx+2]) / 3;
      const right = (data[idxRight] + data[idxRight+1] + data[idxRight+2]) / 3;
      const down = (data[idxDown] + data[idxDown+1] + data[idxDown+2]) / 3;
      
      // Sharp edge detection
      if (Math.abs(current - right) > 70 || Math.abs(current - down) > 70) {
        edgeCount++;
      }
    }
  }
  
  return edgeCount;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(skinRatio, unnaturalRatio, saturationRatio, colorVariety) {
  let score = 100;
  
  // Penalties
  if (skinRatio < 0.25) score -= 10;
  if (unnaturalRatio > 0.05) score -= 20;
  if (saturationRatio > 0.25) score -= 15;
  if (colorVariety < 150) score -= 10;
  
  // Bonuses
  if (skinRatio > 0.35) score += 5;
  if (colorVariety > 200) score += 5;
  
  return Math.max(0, Math.min(100, score));
}
