# SMS OTP System - Quick Guide

## ✅ System is Now Active!

SMS OTP verification is now **conditionally enabled** based on your configuration.

---

## How It Works

### Without SMS API Key (Current Default)
- Users login with **phone/email + password**
- **No OTP step** → Instant login
- Works perfectly for testing and development

### With SMS API Key (When Configured)
- Users login with **phone + password**
- System sends **6-digit OTP** via SMS
- User enters OTP to complete login
- Extra security layer added

---

## Configuration Steps

### Step 1: Get SMS API Key

1. Sign up at [BulkSMS BD](https://bulksmsbd.net/)
2. Purchase SMS credits (100 BDT = ~400 SMS)
3. Copy your API key from dashboard

### Step 2: Configure in Admin Panel

1. Login as **admin**
2. Go to **Admin Dashboard**
3. Click **"API Keys"** tab
4. Find **"BulkSMSBD - Account SMS"** section
5. Paste your API key in the input field
6. Click **"Save"**

### Step 3: Test SMS OTP

1. Logout from admin
2. Try logging in with phone number
3. System will now show **"Verify Your Phone"** screen
4. Click **"Send OTP via SMS"**
5. Check your SMS inbox for 6-digit code
6. Enter code and login

---

## SMS OTP Behavior

### Who Needs OTP?
✅ **Students** - When logging in with phone number  
✅ **Teachers** - When logging in with phone number  
✅ **Staff** - When logging in with phone number  

### Who Bypasses OTP?
❌ **Admin** - Always skips OTP (direct login)  
❌ **Email Login** - Any user using email bypasses OTP  
❌ **No SMS API** - If API key not configured, everyone skips OTP

---

## Demo Mode (No SMS Credits)

If SMS API key is configured but SMS sending fails:

1. Click **"Send OTP via SMS"**
2. Open browser console (F12)
3. Look for: **"📱 SMS DEMO MODE - OTP CODE: xxxxxx"**
4. Use that code to verify

This lets you test the OTP flow without spending SMS credits.

---

## Cost Estimation

### BulkSMS BD Pricing
- **1 SMS** = ~0.25 BDT
- **100 BDT** = ~400 SMS
- **1000 BDT** = ~4000 SMS

### Example Monthly Cost
- 50 students login 2x/day = 100 OTPs/day
- 100 OTPs × 30 days = 3000 OTPs/month
- 3000 × 0.25 BDT = **750 BDT/month** (~$7 USD)

---

## Benefits of SMS OTP

### Security
✅ Verifies phone number ownership  
✅ Prevents unauthorized access  
✅ Two-factor authentication (2FA)

### User Experience
✅ Quick verification (5 minutes validity)  
✅ Resend option if SMS delayed  
✅ Clean, professional UI

---

## Troubleshooting

### "SMS service not configured" Error
**Solution:** Add SMS API key in Admin → API Keys

### SMS Not Received
- Check phone number format (+8801XXXXXXXXX)
- Verify SMS credits balance
- Check spam/blocked messages
- Wait 1-2 minutes for delivery

### OTP Always Invalid
- Check browser console for actual code (demo mode)
- Verify OTP hasn't expired (5 min limit)
- Request new OTP code

### Admin Can't Login
- Admin should NEVER see OTP screen
- If you see OTP screen as admin, contact developer
- Use email login as fallback

---

## Current Status Check

### Test Without SMS API
```
1. Logout
2. Login with phone + password
3. Should login immediately (no OTP)
```

### Test With SMS API
```
1. Add API key in Admin → API Keys
2. Logout
3. Login with phone + password
4. Should show "Verify Your Phone" screen
5. OTP will be sent via SMS
```

---

## To Disable SMS OTP

Simply remove the SMS API key from Admin → API Keys:

1. Login as admin
2. Go to API Keys
3. Clear the SMS API Key field
4. Click "Save"
5. SMS OTP is now disabled

All users will login directly without OTP step.

---

## Important Notes

### Email Login
- Email login ALWAYS bypasses OTP
- Only phone login triggers OTP
- This is by design for flexibility

### Security Best Practices
- Keep SMS API key secret
- Regularly check SMS usage
- Monitor for unusual OTP requests
- Set up rate limiting (future feature)

### Data Privacy
- OTP codes expire in 5 minutes
- Codes are not stored permanently
- SMS content is encrypted in transit

---

## API Integration Details

### SMS API Endpoint
```
POST /api/send-sms
{
  "phone": "+8801XXXXXXXXX",
  "message": "Your code is: 123456"
}
```

### BulkSMS BD API
```
GET https://bulksmsbd.net/api/smsapi?
    api_key=YOUR_KEY
    &type=text
    &number=8801XXXXXXXXX
    &senderid=8809617611019
    &message=Your+code+is+123456
```

---

## Support

Need help?
1. Check browser console for errors
2. Verify SMS credits balance
3. Test with demo mode first
4. Contact BulkSMS BD support if SMS fails

---

**The system is now ready! Configure your SMS API key to activate OTP verification.**
