import { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  ConfirmationResult
} from 'firebase/auth';
import { useAuth } from '~/lib/firebase';
import { useAuthState } from '~/components/contexts/UserContext';
import {
  XMarkIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

type Props = {
  mode: 'signin' | 'link';
  onClose: () => void;
  onSuccess: () => void;
};

type Phase = 'enterPhone' | 'verifyCode' | 'success';

export const PhoneAuthModal = ({ mode, onClose, onSuccess }: Props) => {
  const auth = useAuth();
  const { state } = useAuthState();
  const [phase, setPhase] = useState<Phase>('enterPhone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(0);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Initialize reCAPTCHA when DOM is ready
  useEffect(() => {
    const initRecaptcha = () => {
      // Wait for DOM element to be available
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.warn('reCAPTCHA container not ready yet');
        return;
      }

      try {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            'recaptcha-container',
            {
              size: 'invisible',
              callback: () => {
                console.log('reCAPTCHA solved');
              },
              'expired-callback': () => {
                console.log('reCAPTCHA expired');
                setError('reCAPTCHA expired. Please try again.');
              }
            },
            auth
          );

          // Pre-render to reduce delay
          recaptchaVerifierRef.current.render().then((widgetId) => {
            console.log('reCAPTCHA rendered with widget ID:', widgetId);
          }).catch((error) => {
            console.warn('reCAPTCHA render error (this is normal during initialization):', error.code);
            // This error is expected during initial setup and doesn't affect functionality
          });
        }
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
        // Don't show error to user as this might be timing-related
        console.log('Will retry reCAPTCHA initialization when sending OTP');
      }
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initRecaptcha, 100);

    return () => {
      clearTimeout(timer);
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, [auth]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // Add country code if not present
    if (cleaned.length > 0 && !value.startsWith('+')) {
      if (cleaned.startsWith('1') && cleaned.length === 11) {
        return `+${cleaned}`;
      } else if (cleaned.startsWith('91') && cleaned.length === 12) {
        return `+${cleaned}`;
      } else if (cleaned.length === 10) {
        return `+1${cleaned}`; // Default to US
      } else if (cleaned.length === 10 && value.includes('91')) {
        return `+91${cleaned}`;
      }
      return `+${cleaned}`;
    }

    return value;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const sendOTP = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!validatePhoneNumber(formattedPhone)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setError('');

    // Debug Firebase auth state
    console.log('Firebase auth instance:', auth);
    console.log('Firebase app config:', auth.app.options);
    console.log('Attempting to send OTP to:', formattedPhone);

    try {
      // Initialize reCAPTCHA if not already done
      if (!recaptchaVerifierRef.current) {
        console.log('Initializing reCAPTCHA for OTP send...');
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setError('reCAPTCHA expired. Please try again.');
            }
          },
          auth
        );
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(confirmation);
      setPhase('verifyCode');
      setCountdown(60); // 60 seconds countdown
      console.log('OTP sent successfully');
    } catch (error: any) {
      console.error('Send OTP error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData,
        stack: error.stack
      });

      // Handle specific error cases
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please use international format with country code.');
      } else if (error.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for phone authentication.');
      } else if (error.code === 'auth/billing-not-enabled') {
        setError('Billing not enabled. Real phone numbers require Firebase Blaze plan. Try test number: +1 555-123-4567');
      } else if (error.code === 'auth/invalid-app-credential') {
        setError('Firebase configuration error. Please check your project settings and API keys.');
      } else if (error.code === 'auth/project-not-found') {
        setError('Firebase project not found. Please verify your project ID.');
      } else {
        setError(`Authentication error (${error.code}): ${error.message || 'Failed to send OTP. Please try again.'}`);
      }

      // Reset reCAPTCHA
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (clearError) {
          console.error('Error clearing reCAPTCHA:', clearError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!confirmationResult) {
      setError('No confirmation result found. Please request a new code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        // Sign in with phone number
        const result = await confirmationResult.confirm(otpCode);
        console.log('Phone sign-in successful:', result.user);
        setPhase('success');
      } else if (mode === 'link') {
        // Link phone number to existing account
        if (state.state !== 'SIGNED_IN') {
          throw new Error('No user signed in to link phone number');
        }

        const credential = PhoneAuthProvider.credential(
          confirmationResult.verificationId,
          otpCode
        );

        await linkWithCredential(state.currentUser, credential);
        console.log('Phone number linked successfully');
        setPhase('success');
      }

      // Auto-close after success
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Verify OTP error:', error);

      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code. Please check and try again.');
      } else if (error.code === 'auth/credential-already-in-use') {
        setError('This phone number is already linked to another account.');
      } else if (error.code === 'auth/provider-already-linked') {
        setError('Phone number authentication is already linked to this account.');
      } else {
        setError(error.message || 'Failed to verify code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;

    setOtpCode('');
    setPhase('enterPhone');
    await sendOTP();
  };

  const handleClose = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (error) {
        console.error('Error clearing reCAPTCHA on close:', error);
      }
    }
    onClose();
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                      <PhoneIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                        {mode === 'link' ? 'Link Phone Number' : 'Phone Authentication'}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        {phase === 'enterPhone' && 'Enter your phone number to receive a verification code'}
                        {phase === 'verifyCode' && 'Enter the verification code sent to your phone'}
                        {phase === 'success' && 'Authentication successful!'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {/* Phone Number Entry */}
                {phase === 'enterPhone' && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include country code (e.g., +1 for US, +91 for India)
                    </p>
                    <p className="mt-1 text-xs text-blue-600">
                      💡 Test number: +1 555-123-4567 (uses code: 123456)
                    </p>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={sendOTP}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Sending...' : 'Send Code'}
                      </button>
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Verification */}
                {phase === 'verifyCode' && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-wider"
                      maxLength={6}
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the 6-digit code sent to {phoneNumber}
                    </p>

                    <div className="mt-4">
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500 text-center">
                          Resend code in {countdown} seconds
                        </p>
                      ) : (
                        <button
                          onClick={resendOTP}
                          className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Didn't receive the code? Resend
                        </button>
                      )}
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={verifyOTP}
                        disabled={loading || otpCode.length !== 6}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Verifying...' : 'Verify Code'}
                      </button>
                      <button
                        onClick={() => setPhase('enterPhone')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {/* Success */}
                {phase === 'success' && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                      <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {mode === 'link' ? 'Phone Number Linked!' : 'Authentication Successful!'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {mode === 'link'
                        ? 'Your phone number has been successfully linked to your account.'
                        : 'You have been successfully signed in with your phone number.'
                      }
                    </p>
                  </div>
                )}

                {/* reCAPTCHA Container */}
                <div id="recaptcha-container" className="mt-4"></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};