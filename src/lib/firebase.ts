import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;

const useEmulator = () => import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

export const setupFirebase = () => {
  if (firebaseApp) {
    return firebaseApp; // Already initialized
  }

  try {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_FIREBASE_APPID,
    };

    // Validate required config
    if (!config.apiKey || !config.projectId || !config.authDomain) {
      throw new Error('Missing required Firebase configuration. Please check your .env.local file.');
    }

    console.log('Initializing Firebase with project:', config.projectId);
    firebaseApp = initializeApp(config);

    return firebaseApp;
  } catch (error) {
    console.error('Firebase setup error:', error);
    throw error;
  }
};

export const useAuth = () => {
  if (!firebaseApp) {
    setupFirebase();
  }

  if (!auth) {
    auth = getAuth(firebaseApp);

    // Only connect to emulator if explicitly enabled and not already connected
    if (useEmulator() && !auth._delegate?.emulatorConfig) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        console.log('Connected to Firebase Auth emulator');
      } catch (error) {
        console.warn('Failed to connect to Auth emulator:', error);
      }
    }
  }

  return auth;
};

export const useFirestore = () => {
  if (!firestore) {
    firestore = getFirestore();
    if (useEmulator()) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
  }
  return firestore;
};

export const useStorage = () => {
  if (!storage) {
    storage = getStorage();
    if (useEmulator()) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  }
  return storage;
};
