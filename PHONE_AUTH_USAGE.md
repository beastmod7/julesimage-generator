# 📱 Phone Authentication Usage Guide

## 🚀 Quick Start

Your phone authentication is now fully implemented! Here's how to use it:

### 🔧 **Testing Setup Required**

Before testing, you need to configure Firebase Console:

1. **Enable Phone Authentication**
   - Go to [Firebase Console](https://console.firebase.google.com/project/auth-tester-a82a7/authentication/providers)
   - Click on **Phone** provider
   - Toggle **Enable**
   - Click **Save**

2. **Add Test Phone Numbers** (Recommended for development)
   - In the same Phone provider section
   - Scroll to **"Phone numbers for testing"**
   - Add test numbers:
     ```
     +1 555-123-4567  →  123456
     +91 98765 43210  →  654321
     ```

3. **Verify Authorized Domains**
   - Go to **Authentication → Settings → Authorized domains**
   - Ensure `localhost` is in the list
   - Add `127.0.0.1` if needed

### 📱 **Using Phone Authentication**

#### **Sign In with Phone Number**

1. **Navigate to Landing Page**
   - Visit http://localhost:5173/
   - You'll see two sign-in options:
     - "Sign in with Google" (existing)
     - "Sign in with Phone" (new)

2. **Click "Sign in with Phone"**
   - Modal opens with phone number entry
   - Enter phone number in international format: `+1234567890`
   - Click **"Send Code"**

3. **Enter Verification Code**
   - SMS sent to your phone (or use test number)
   - Enter 6-digit OTP code
   - Click **"Verify Code"**

4. **Authentication Complete**
   - Automatically redirected to Dashboard
   - User signed in with phone number

#### **Link Phone to Existing Account**

1. **Sign in with Google first**
   - Use the Google sign-in button
   - Complete Google OAuth flow

2. **Go to Profile Page**
   - Navigate to `/profile`
   - Scroll to **"Account Actions"** section

3. **Click "Link Phone Number"**
   - Modal opens (same as sign-in)
   - Enter phone number and verify OTP
   - Phone number linked to Google account

4. **Verification**
   - Profile page now shows linked phone number
   - User can sign in with either Google or Phone

### 🧪 **Testing with Test Numbers**

For development, use Firebase test numbers to avoid SMS charges:

```
Phone: +1 555-123-4567
OTP: 123456

Phone: +91 98765 43210
OTP: 654321
```

**Benefits:**
- ❌ No real SMS sent
- ❌ No charges incurred
- ✅ Instant verification
- ✅ Consistent OTP codes

### 🛡️ **Security Features**

- **reCAPTCHA v2**: Built-in bot protection
- **Phone Validation**: E.164 format validation
- **Error Handling**: User-friendly error messages
- **Rate Limiting**: Resend OTP countdown (60 seconds)
- **Cleanup**: Proper reCAPTCHA cleanup on modal close

### 🔧 **Troubleshooting**

#### **"Firebase: Error (auth/unauthorized-domain)"**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

#### **"Invalid phone number format"**
- Use international format: `+[country code][number]`
- Examples: `+1234567890`, `+919876543210`

#### **"reCAPTCHA not working"**
- Check browser console for errors
- Ensure popup blockers are disabled
- Verify internet connection

#### **"OTP not received"** (Real numbers)
- Check phone number format
- Verify carrier supports SMS
- Check Firebase Console for quota limits
- Try with test numbers first

### 📊 **Firebase Console Monitoring**

Monitor phone auth usage:

1. **Authentication → Users**
   - View users signed in with phone
   - See linked authentication methods

2. **Authentication → Usage**
   - Monitor SMS quota usage
   - Track authentication attempts

### 🚀 **Production Checklist**

Before deploying to production:

- [ ] Remove test phone numbers from Firebase Console
- [ ] Update authorized domains for production
- [ ] Enable Firebase billing (Blaze plan) for SMS
- [ ] Implement proper error logging
- [ ] Set up monitoring and alerts
- [ ] Test with real phone numbers
- [ ] Configure App Check for additional security

### 💡 **User Experience Tips**

- **Clear Instructions**: Users need to enter international format
- **Visual Feedback**: Loading states and error messages are implemented
- **Accessibility**: ARIA labels and keyboard navigation supported
- **Mobile Friendly**: Responsive design works on all devices

---

## 🎯 **Ready to Test!**

Your phone authentication is production-ready! Start testing with the test numbers, then move to real phone numbers when ready for production deployment.

**Need help?** Refer to the comprehensive [Firebase Phone Auth Setup Guide](./FIREBASE_PHONE_AUTH_SETUP.md) for detailed configuration instructions.