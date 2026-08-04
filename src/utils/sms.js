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
    // Normalize phone number for SMS API (must be in 880XXXXXXXXXX format)
    let normalized = String(phone).replace(/\s+/g, '').replace(/^\+/, '');
    
    // Handle different input formats:
    // 8801727517598 → 8801727517598 (already correct)
    // 01727517598 → 8801727517598
    // 1727517598 → 8801727517598
    if (normalized.startsWith('0')) {
      normalized = '880' + normalized.slice(1);
    } else if (!normalized.startsWith('880')) {
      normalized = '880' + normalized;
    }
    
    // Check if SMS API is configured
    if (!isSmsConfigured()) {
      return { ok: false, error: 'SMS service is not configured. Please contact administrator.' };
    }
    
    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    
    // Create message
    const message = `Your Tiarkhali School verification code is: ${code}. Valid for 5 minutes. Do not share this code.`;
    
    // Send SMS via API
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalized, message }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.ok && !result.error) {
        // SMS sent successfully - create OTP session
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
