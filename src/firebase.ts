import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

/**
 * Firebase initialization configured for production and APK environments.
 * The authDomain is explicitly derived from the projectId to ensure
 * authorized domains are correctly targeted during the handshake.
 */
const extendedConfig = {
  ...firebaseConfig,
  authDomain: `${firebaseConfig.projectId}.firebaseapp.com`
};

// Singleton pattern for app initialization to prevent multi-instance errors
const app = !getApps().length ? initializeApp(extendedConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

/**
 * Single entry point for Google Authentication.
 * Handles the popup flow and provider configuration.
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Ensure we always prompt for account to avoid auto-login issues in some APK environments
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
};
