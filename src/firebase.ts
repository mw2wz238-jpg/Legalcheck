import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  initializeAuth, 
  indexedDBLocalPersistence, 
  browserPopupRedirectResolver, 
  signInWithPopup, 
  GoogleAuthProvider,
  getAuth,
  getRedirectResult
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Use config directly to avoid any projection errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Initialize Auth with explicit persistence and resolver for cross-platform stability.
 * Capacitor/WebView environments benefit significantly from indexedDB and explicit resolvers.
 */
export const auth = (() => {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    try {
      // Attempt to get existing auth instance to avoid re-init errors
      return getAuth(app);
    } catch (e) {
      // If not initialized yet, proceed to initializeAuth
    }
  }
  return initializeAuth(app, {
    persistence: [indexedDBLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
})();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Single entry point for Google Authentication.
 * Uses popup flow with an explicit resolver, which is generally more reliable 
 * in Capacitor when configured with standard browser support.
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Ensure we always prompt for account to avoid auto-login issues in some APK environments
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    // Try Popup first - it's often more reliable in modern webviews if allowed
    const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    return result;
  } catch (error) {
    console.error("SignInWithPopup Error:", error);
    // If it's a conflict or environment issue, we can try to fall back or just throw for debugging
    throw error;
  }
};

/**
 * Fallback for handling redirect result if needed (e.g. if we switched to redirect flow)
 */
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
    return result;
  } catch (error) {
    console.error("RedirectResult Error:", error);
    return null;
  }
};
