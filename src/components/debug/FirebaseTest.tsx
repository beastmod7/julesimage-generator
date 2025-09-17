import { useState } from 'react';
import { useAuth } from '~/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const FirebaseTest = () => {
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const auth = useAuth();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testFirebaseConfig = () => {
    addLog('=== Firebase Configuration Test ===');
    addLog(`Project ID: ${auth.app.options.projectId}`);
    addLog(`API Key: ${auth.app.options.apiKey?.substring(0, 10)}...`);
    addLog(`Auth Domain: ${auth.app.options.authDomain}`);
    addLog(`App ID: ${auth.app.options.appId}`);
    addLog('Firebase config loaded successfully ✅');
  };

  const testRecaptcha = async () => {
    addLog('=== reCAPTCHA Test ===');
    try {
      // Create a simple div for testing
      const testDiv = document.createElement('div');
      testDiv.id = 'test-recaptcha';
      document.body.appendChild(testDiv);

      const recaptchaVerifier = new RecaptchaVerifier(
        'test-recaptcha',
        {
          size: 'invisible',
          callback: () => addLog('reCAPTCHA solved ✅'),
          'expired-callback': () => addLog('reCAPTCHA expired ❌')
        },
        auth
      );

      await recaptchaVerifier.render();
      addLog('reCAPTCHA initialized successfully ✅');

      // Clean up
      recaptchaVerifier.clear();
      document.body.removeChild(testDiv);
    } catch (error: any) {
      addLog(`reCAPTCHA error: ${error.message} ❌`);
    }
  };

  const testPhoneAuth = async () => {
    addLog('=== Phone Auth Test ===');
    try {
      // Create test recaptcha
      const testDiv = document.createElement('div');
      testDiv.id = 'test-phone-recaptcha';
      document.body.appendChild(testDiv);

      const recaptchaVerifier = new RecaptchaVerifier(
        'test-phone-recaptcha',
        { size: 'invisible' },
        auth
      );

      addLog('Attempting to send OTP to test number...');

      const confirmation = await signInWithPhoneNumber(
        auth,
        '+1 555-123-4567', // Test number
        recaptchaVerifier
      );

      addLog('OTP sent successfully! ✅');
      addLog(`Verification ID: ${confirmation.verificationId.substring(0, 20)}...`);

      // Clean up
      recaptchaVerifier.clear();
      document.body.removeChild(testDiv);
    } catch (error: any) {
      addLog(`Phone auth error (${error.code}): ${error.message} ❌`);
    }
  };

  const testRealPhoneAuth = async () => {
    addLog('=== Real Phone Auth Test ===');
    try {
      // Create test recaptcha
      const testDiv = document.createElement('div');
      testDiv.id = 'test-real-phone-recaptcha';
      document.body.appendChild(testDiv);

      const recaptchaVerifier = new RecaptchaVerifier(
        'test-real-phone-recaptcha',
        { size: 'invisible' },
        auth
      );

      // Test with a clearly fake but real-format number
      const testRealNumber = '+1 234 567 8900';
      addLog(`Attempting to send OTP to real number: ${testRealNumber}`);

      const confirmation = await signInWithPhoneNumber(
        auth,
        testRealNumber,
        recaptchaVerifier
      );

      addLog('Real phone OTP sent successfully! ✅');
      addLog(`Verification ID: ${confirmation.verificationId.substring(0, 20)}...`);

      // Clean up
      recaptchaVerifier.clear();
      document.body.removeChild(testDiv);
    } catch (error: any) {
      addLog(`Real phone auth error (${error.code}): ${error.message} ❌`);
      addLog(`Error details: ${JSON.stringify({
        code: error.code,
        message: error.message,
        customData: error.customData
      })} 🔍`);
    }
  };

  const runAllTests = async () => {
    setLogs([]);
    setStatus('Running tests...');

    testFirebaseConfig();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testRecaptcha();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testPhoneAuth();

    setStatus('Tests completed');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Firebase Diagnostics</h2>

      <div className="space-y-2 mb-4">
        <button
          onClick={testFirebaseConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          Test Config
        </button>
        <button
          onClick={testRecaptcha}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        >
          Test reCAPTCHA
        </button>
        <button
          onClick={testPhoneAuth}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2"
        >
          Test Phone Auth
        </button>
        <button
          onClick={testRealPhoneAuth}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
        >
          Test Real Number
        </button>
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Run All Tests
        </button>
      </div>

      {status && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <strong>Status:</strong> {status}
        </div>
      )}

      <div className="bg-black text-green-400 p-4 rounded text-sm font-mono max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div>Click a test button to start diagnostics...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))
        )}
      </div>
    </div>
  );
};