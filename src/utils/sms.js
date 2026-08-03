// ================================================
// SMS OTP VERIFICATION — Real SMS Only
// OTP is only generated after SMS sends successfully
// ================================================

let _otpSession = null;

/**
 * Check if SMS API is configured
 */
export function isSmsConfigured() {
  try {
    const settings = JSON.parse(localStorage.getItem('gfa_settings') || '{}');
    return !!(settings.smsApiKey && settings.smsApiKey.trim());
  } catch {
    return false;
  }
}

/**
 * Send OTP via SMS
 */
export async function sendOtp(phone) {
  try {
    let normalized = String(phone).replace(/\s+/g, '');
    if (!normalized.startsWith('+')) {
      if (normalized.startsWith('0')) normalized = '+880' + normalized.slice(1);
      else if (normalized.startsWith('880')) normalized = '+' + normalized;
      else normalized = '+880' + normalized;
    }
    
    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    
    // Check if running on localhost
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDev) {
      // ========== LOCALHOST MODE ==========
      // Show OTP in console immediately (no SMS needed)
      console.log('%c═══════════════════════════════════════', 'color: #10b981; font-weight: bold');
      console.log('%c🔐 DEVELOPMENT MODE - OTP CODE', 'color: #10b981; font-weight: bold; font-size: 14px');
      console.log('%c═══════════════════════════════════════', 'color: #10b981; font-weight: bold');
      console.log('%cPhone:', 'color: #6b7280; font-weight: bold', normalized);
      console.log('%cOTP Code:', 'color: #f59e0b; font-weight: bold; font-size: 20px', code);
      console.log('%cExpires:', 'color: #6b7280; font-weight: bold', '5 minutes');
      console.log('%c═══════════════════════════════════════', 'color: #10b981; font-weight: bold');
      console.log('%c⚠️  Console OTP (localhost only)', 'color: #ef4444; font-size: 11px');
      console.log('%c═══════════════════════════════════════', 'color: #10b981; font-weight: bold');
      
      // Create OTP session immediately (no SMS API needed)
      _otpSession = {
        phone: normalized,
        code,
        expires: Date.now() + 5 * 60 * 1000,
      };
      
      return { ok: true };
      
    } else {
      // ========== PRODUCTION MODE ==========
      // Check if SMS API is configured
      if (!isSmsConfigured()) {
        return { ok: false, error: 'SMS service is not configured. Please contact administrator.' };
      }
      
      // Send SMS via API
      const message = `Your Tiarkhali School verification code is: ${code}. Valid for 5 minutes. Do not share this code.`;
      
      try {
        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: normalized, message }),
        });
        
        const result = await response.json();
        
        if (response.ok && result.ok && !result.error) {
          // SMS sent successfully
          _otpSession = {
            phone: normalized,
            code,
            expires: Date.now() + 5 * 60 * 1000,
          };
          return { ok: true };
        } else {
          return { 
            ok: false, 
            error: result.error || 'Failed to send SMS. Please check your SMS API configuration.' 
          };
        }
      } catch (smsError) {
        return { 
          ok: false, 
          error: 'Failed to connect to SMS service. Please try again or contact administrator.' 
        };
      }
    }
    
  } catch (err) {
    return { ok: false, error: 'Failed to send OTP. Please try again.' };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOtp(code) {
  try {
    if (!_otpSession) {
      return { ok: false, error: 'OTP session expired. Please request a new code.' };
    }
    
    // Check expiry
    if (Date.now() > _otpSession.expires) {
      _otpSession = null;
      return { ok: false, error: 'OTP has expired. Please request a new code.' };
    }
    
    // Verify code
    if (code.trim() !== _otpSession.code) {
      return { ok: false, error: 'Incorrect OTP. Please check and try again.' };
    }
    
    // Success - clear session
    _otpSession = null;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: 'Verification failed. Please try again.' };
  }
}
