import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  browserPopupRedirectResolver, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Inicjalizacja Firebase z jawną konfiguracją authDomain
const config = {
  ...firebaseConfig,
  authDomain: `${firebaseConfig.projectId}.firebaseapp.com`
};

const app = !getApps().length ? initializeApp(config) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Trwałość sesji - browserLocalPersistence jest stabilne w mobilnych przeglądarkach
setPersistence(auth, browserLocalPersistence).catch(console.error);

/**
 * Logowanie Google - Próbuje Popup, a jeśli zawiedzie (np. w mobile), używa Redirect.
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    // Spróbuj Popup (dobre dla Desktop)
    return await signInWithPopup(auth, provider, browserPopupRedirectResolver);
  } catch (error: any) {
    console.log("Popup blocked or failed, trying redirect...", error.code);
    // Jeśli Popup jest zablokowany lub nieobsługiwany (częste w APK), użyj przekierowania
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/operation-not-supported-in-this-environment') {
      return await signInWithRedirect(auth, provider);
    }
    throw error;
  }
};

/**
 * Sprawdzenie wyniku przekierowania po powrocie do aplikacji.
 */
export const handleRedirectResult = async () => {
  try {
    return await getRedirectResult(auth);
  } catch (error) {
    console.error("Redirect handler error:", error);
    throw error;
  }
};

export { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};
