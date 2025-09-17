# 📱 Complete Firebase Phone Authentication Setup Guide

**Firebase Phone Auth with v2 reCAPTCHA & OTP - Production Ready**

This guide provides detailed step-by-step instructions for setting up Firebase Phone Authentication with v2 reCAPTCHA in React/Vite applications.

---

## 📋 Table of Contents

1. [Firebase Console Setup](#firebase-console-setup)
2. [v2 reCAPTCHA Configuration](#v2-recaptcha-configuration)
3. [Project Configuration](#project-configuration)
4. [Implementation Guide](#implementation-guide)
5. [Testing & Development](#testing--development)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Firebase Console Setup

### Step 1: Create Firebase Project

1. **Navigate to Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click **"Add project"** or **"Create a project"**

2. **Project Configuration**
   - Enter project name: `auth-tester-a82a7` (or your preferred name)
   - **Enable Google Analytics** (recommended for production)
   - Select or create Analytics account
   - Click **"Create project"**

3. **Wait for Project Creation**
   - Firebase will set up your project (takes 1-2 minutes)
   - Click **"Continue"** when ready

### Step 2: Add Web App to Project

1. **Register Web App**
   - In project overview, click the **Web icon** `</>`
   - **App nickname**: `AuthTest Web App`
   - **☑️ Check "Also set up Firebase Hosting"** (optional)
   - Click **"Register app"**

2. **Copy Firebase Configuration**
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.firebasestorage.app",
     messagingSenderId: "your-messaging-sender-id",
     appId: "1:your-messaging-sender-id:web:your-app-id",
     measurementId: "G-your-measurement-id"
   };
   ```
   - **Save this configuration** - you'll need it for your `.env` file

### Step 3: Enable Authentication

1. **Navigate to Authentication**
   - In Firebase Console sidebar: **Authentication**
   - Click **"Get started"** if first time

2. **Configure Sign-in Methods**
   - Go to **"Sign-in method"** tab
   - Enable **Google** provider (if not already enabled)
   - Enable **Phone** provider:
     - Click **"Phone"**
     - Toggle **"Enable"**
     - Click **"Save"**

### Step 4: Configure Phone Authentication

1. **Phone Provider Settings**
   - In **Authentication → Sign-in method → Phone**
   - **Verification settings**:
     - ☑️ Enable phone sign-in
     - ☑️ Enable phone number linking

2. **Add Test Phone Numbers** (Development)
   - Scroll down to **"Phone numbers for testing"**
   - Click **"Add phone number"**
   - Add test numbers:
     ```
     Phone: +1 555-123-4567
     Code: 123456

     Phone: +91 98765 43210
     Code: 654321
     ```
   - These won't send real SMS and use fixed OTP codes

### Step 5: Configure Authorized Domains

1. **Navigate to Authorized Domains**
   - **Authentication → Settings → Authorized domains**

2. **Add Development Domains**
   - `localhost` (already present)
   - `127.0.0.1` (if needed)
   - Your local development URL: `localhost:5173`

3. **Add Production Domains** (when ready)
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `app.yourdomain.com`

### Step 6: Enable Required APIs

1. **Navigate to Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select your Firebase project

2. **Enable Required APIs**
   - **APIs & Services → Library**
   - Search and enable:
     - ✅ **Identity Toolkit API** (Firebase Auth - Required)
     - ✅ **Cloud Identity API** (User management - Required)

3. **Verify API Status**
   - **APIs & Services → Enabled APIs**
   - Confirm both APIs are enabled

**Note**: reCAPTCHA Enterprise API is only needed for Enterprise App Check, not for standard phone auth.

---

## 🛡️ reCAPTCHA Configuration

### Understanding Firebase's Built-in reCAPTCHA

Firebase Phone Auth includes **built-in reCAPTCHA v2** protection automatically:
- ✅ **Invisible reCAPTCHA** by default
- ✅ **Visible reCAPTCHA** when suspicious activity detected
- ✅ **No additional reCAPTCHA registration required**
- ✅ **Zero configuration needed**

**Important**: You do NOT need to register your own reCAPTCHA v2 site keys. Firebase handles this internally.

### Optional: App Check with reCAPTCHA v3 (Production Security)

For **additional security layers** beyond the built-in protection:

1. **Register reCAPTCHA v3 Site** (only for App Check)
   - Go to [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Click **"+"** to create new site
   - **Label**: `AuthTest App Check v3`
   - **reCAPTCHA type**: v3 (not v2)
   - **Domains**: `localhost`, `yourdomain.com`
   - Accept terms and **Submit**

2. **Configure Firebase App Check** (Production only)
   - **Firebase Console → App Check**
   - **Register app** with reCAPTCHA v3 provider
   - Use your v3 site key from step 1

**Note**: App Check is optional and provides additional bot protection beyond Firebase's built-in security.

---

## ⚙️ Project Configuration

### Environment Variables

Create `.env.local` in your project root:

```bash
# Firebase Configuration
VITE_FIREBASE_APIKEY=your-api-key-here
VITE_FIREBASE_AUTHDOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECTID=your-project-id
VITE_FIREBASE_STORAGEBUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGINGSENDERID=your-messaging-sender-id
VITE_FIREBASE_APPID=1:your-messaging-sender-id:web:your-app-id
VITE_FIREBASE_MEASUREMENTID=G-your-measurement-id

# Optional: reCAPTCHA v3 (for App Check)
VITE_RECAPTCHA_V3_SITE_KEY=your-recaptcha-v3-site-key

# Development flags
VITE_USE_FIREBASE_EMULATOR=false
VITE_PHONE_AUTH_DEBUG=true
```

### Firebase Configuration

Update `src/lib/firebase.ts`:

```typescript
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';

let firebaseApp: FirebaseApp;

export const setupFirebase = () => {
  try {
    firebaseApp = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_FIREBASE_APPID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
    });
  } catch (error) {
    console.error('Firebase setup error:', error);
  }
};

let auth: Auth;

export const useAuth = () => {
  if (!auth) {
    auth = getAuth(firebaseApp);

    // Development settings
    if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }

    // Development: Disable app verification for testing
    if (import.meta.env.VITE_PHONE_AUTH_DEBUG === 'true') {
      (auth as any).settings.appVerificationDisabledForTesting = true;
    }
  }

  return auth;
};
```

---

## 🚀 Implementation Guide

### Phone Authentication Flow

1. **User enters phone number** → Validate format
2. **Send OTP** → Firebase sends SMS with code
3. **User enters OTP code** → Verify with Firebase
4. **Authentication complete** → User signed in

### Key Firebase Methods

```typescript
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  linkWithCredential
} from 'firebase/auth';

// 1. Setup reCAPTCHA (Firebase handles v2 automatically)
const recaptchaVerifier = new RecaptchaVerifier(
  'recaptcha-container',
  { size: 'invisible' },
  auth
);

// 2. Send OTP (validates E.164 format: +1234567890)
const confirmationResult = await signInWithPhoneNumber(
  auth,
  phoneNumber, // Must be E.164 format
  recaptchaVerifier
);

// 3. Sign in new user
const result = await confirmationResult.confirm(otpCode);

// 4. OR Link to existing user (if already signed in)
if (auth.currentUser) {
  const credential = PhoneAuthProvider.credential(
    confirmationResult.verificationId,
    otpCode
  );
  await linkWithCredential(auth.currentUser, credential);
}
```

### Client-Side Validation & Rate Limiting

```typescript
// E.164 phone validation
const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Rate limiting for send OTP button
const [countdown, setCountdown] = useState(0);
const sendOTP = async () => {
  if (countdown > 0) return; // Prevent spam

  // Send OTP logic...
  setCountdown(60); // 60 second cooldown
};
```

---

## 🧪 Testing & Development

### Using Test Phone Numbers

1. **Firebase Console Setup**
   - **Authentication → Sign-in method → Phone**
   - Add test numbers in **"Phone numbers for testing"**
   - Example: `+1 555-123-4567` with code `123456`

2. **Testing Benefits**
   - ❌ No real SMS sent
   - ❌ No charges incurred
   - ✅ Fixed OTP codes
   - ✅ Instant verification

### Development Settings

```typescript
// Enable for testing only - REMOVE in production
auth.settings.appVerificationDisabledForTesting = true;
```

### Debug Mode

```typescript
// Enable debug logging
if (import.meta.env.VITE_PHONE_AUTH_DEBUG === 'true') {
  console.log('Phone auth debug mode enabled');
}
```

---

## 🌐 Production Deployment

### Pre-Production Checklist

- [ ] Remove `appVerificationDisabledForTesting`
- [ ] Remove test phone numbers
- [ ] Update authorized domains
- [ ] Enable App Check (recommended)
- [ ] Set up proper error handling
- [ ] Implement rate limiting
- [ ] Configure SMS quotas

### Firebase Billing & Blaze Plan Requirements

**⚠️ IMPORTANT: Real SMS Requires Blaze Plan**

To send SMS to real phone numbers, you MUST upgrade to Firebase's **Blaze (pay-as-you-go) plan**:

1. **Enable Billing** (Required for production SMS)
   - Firebase Console → ⚙️ Settings → **Usage and billing**
   - Click **"Modify plan"**
   - Select **"Blaze (Pay as you go)"**
   - Add a payment method (credit card required)
   - Set budget alerts (recommended: $10/month)

2. **Error Without Billing**: `auth/billing-not-enabled`
   - This error occurs when trying to send real SMS on Spark (free) plan
   - Test phone numbers still work on free plan
   - Real phone numbers require Blaze plan activation

**Phone Authentication Costs:**
- **Free Tier**: 10 verifications/day (test numbers only)
- **Paid Plans**: $0.05 per verification
- **India SMS**: ₹0.35-₹0.50 per SMS (varies by carrier)
- **US SMS**: ~$0.01 per SMS
- **Monitor costs**: Google Cloud Console → Billing

**Budget Protection:**
- Set up billing alerts in Google Cloud Console
- Monitor usage in Firebase Console → Usage tab
- Consider implementing client-side rate limiting

### Security Best Practices

1. **App Check** (Production)
   ```typescript
   import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

   initializeAppCheck(app, {
     provider: new ReCaptchaV3Provider('your-recaptcha-v3-site-key'),
     isTokenAutoRefreshEnabled: true
   });
   ```

2. **Rate Limiting**
   - Implement client-side rate limiting
   - Monitor Firebase Console for abuse
   - Use Cloud Functions for server-side validation

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add your domain to **Authentication → Settings → Authorized domains**

#### 2. "Firebase: Error (auth/billing-not-enabled)"
**Solution**:
- Upgrade to Blaze (pay-as-you-go) plan in Firebase Console
- Go to Settings → Usage and billing → Modify plan
- Add payment method and enable billing
- **Alternative**: Continue using test phone numbers for development

#### 3. "Firebase: Error (auth/quota-exceeded)"
**Solution**:
- Check Firebase Console usage
- Upgrade to Blaze plan if needed
- Implement rate limiting

#### 4. "Firebase: Error (auth/credential-already-in-use)"
**Solution**:
```typescript
try {
  await linkWithCredential(auth.currentUser, credential);
} catch (error) {
  if (error.code === 'auth/credential-already-in-use') {
    // Handle account merge or sign in with existing account
    const result = await signInWithCredential(auth, error.credential);
  }
}
```

#### 5. reCAPTCHA not showing
**Solution**:
- Ensure `<div id="recaptcha-container"></div>` exists
- Check browser console for errors
- Verify domain is authorized

#### 6. OTP not received (Production)
**Solution**:
- Verify phone number format (E.164: +1234567890)
- Check carrier restrictions
- Ensure sufficient Firebase quota
- Test with different carriers

### Debug Tools

1. **Firebase Console → Authentication → Users**
   - Monitor sign-in attempts
   - View user authentication methods

2. **Google Cloud Console → APIs & Services → Quotas**
   - Monitor SMS quota usage
   - Set up quota alerts

3. **Browser Developer Tools**
   - Check console for Firebase errors
   - Monitor network requests to Firebase

### Error Codes Reference

| Error Code | Description | Solution |
|------------|-------------|----------|
| `auth/billing-not-enabled` | Blaze plan required for real SMS | Upgrade to Blaze plan or use test numbers |
| `auth/invalid-phone-number` | Invalid phone format | Use E.164 format |
| `auth/missing-phone-number` | No phone provided | Validate input |
| `auth/quota-exceeded` | SMS quota exceeded | Upgrade plan or wait |
| `auth/unauthorized-domain` | Domain not authorized | Add to authorized domains |
| `auth/credential-already-in-use` | Phone linked elsewhere | Handle account merge |

---

## 📚 Additional Resources

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [reCAPTCHA v2 Documentation](https://developers.google.com/recaptcha/docs/display)
- [Firebase App Check Guide](https://firebase.google.com/docs/app-check)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

## 🎯 Next Steps

1. ✅ Complete Firebase Console setup
2. ✅ Implement phone auth UI components
3. ✅ Test with development phone numbers
4. ✅ Deploy to staging with real SMS
5. ✅ Enable App Check for production
6. ✅ Monitor usage and costs

---

**Need help?** Check the troubleshooting section or refer to the implementation examples in the codebase.