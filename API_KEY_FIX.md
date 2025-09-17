# 🔑 API Key Configuration Fix

## Problem
`auth/invalid-app-credential` error when using phone authentication.

## Root Cause
Your Firebase API key has restrictions that prevent Firebase phone authentication from working.

## Solution Steps

### 1. Google Cloud Console → API Key Settings

1. **Navigate to**: [Google Cloud Console](https://console.cloud.google.com)
2. **Select Project**: `your-project-id`
3. **Go to**: APIs & Services → Credentials
4. **Find Your API Key**: Look for your browser API key
5. **Click to Edit**

### 2. Configure API Restrictions

**Quick Fix (Recommended for Development):**
```
API restrictions: Don't restrict key
```

**Production Fix (More Secure):**
```
API restrictions: Restrict key
Selected APIs:
✅ Identity Toolkit API
✅ Firebase Management API
✅ Google Identity and Access Management (IAM) API
```

### 3. Configure Application Restrictions

**For Development:**
```
Application restrictions: HTTP referrers (web sites)
Website restrictions:
- http://localhost:*
- https://localhost:*
- http://127.0.0.1:*
- https://127.0.0.1:*
```

**For Production:**
```
Add your actual domain:
- https://yourdomain.com/*
- https://www.yourdomain.com/*
```

### 4. Enable Required APIs

Go to **APIs & Services → Library** and enable:

1. **Identity Toolkit API**
   - Search: "Identity Toolkit API"
   - Click → Enable

2. **Firebase Management API**
   - Search: "Firebase Management API"
   - Click → Enable

3. **Google Identity and Access Management (IAM) API**
   - Search: "Google Identity and Access Management"
   - Click → Enable

### 5. Save and Test

1. **Click Save** in API key settings
2. **Wait 2-3 minutes** for changes to propagate
3. **Test phone authentication** again

## Expected Result

After fixing API key restrictions:
- ✅ Phone authentication should work
- ✅ Test number `+1 555-123-4567` should send OTP
- ✅ No more `auth/invalid-app-credential` errors

## Verification

Use the Firebase diagnostic tool on your homepage to verify:
- Firebase config loads correctly
- reCAPTCHA initializes successfully
- Phone auth sends OTP without errors

---

**Note**: Changes to API key restrictions can take 2-3 minutes to take effect. If you continue to see the error immediately after making changes, wait a few minutes and try again.