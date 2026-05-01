import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  browserPopupRedirectResolver, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Inicjalizacja Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Inicjalizacja Auth z obsługą trwałości sesji dla środowisk mobilnych.
 * browserLocalPersistence jest często bardziej niezawodny w WebView niż indexedDB.
 */
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});

/**
 * Główna funkcja logowania przez Google (Redirect Flow).
 * W środowiskach mobilnych (APK/WebView) przekierowanie jest zazwyczaj
 * bardziej stabilne niż okna popup.
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  console.log("Starting Google Sign-In Redirect...");
  try {
    return await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("SignInWithRedirect Error:", error);
    throw error;
  }
};

/**
 * Przechwytywanie wyniku logowania po powrocie z przekierowania.
 */
export const handleRedirectResult = async () => {
  try {
    console.log("Checking for redirect result...");
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Auth result found:", result.user.email);
    } else {
      console.log("No redirect result found.");
    }
    return result;
  } catch (error) {
    console.error("getRedirectResult Error:", error);
    throw error;
  }
};

export { onAuthStateChanged };
