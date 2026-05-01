import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  initializeAuth, 
  indexedDBLocalPersistence, 
  browserPopupRedirectResolver, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Inicjalizacja Firebase z jawną konfiguracją authDomain, aby uniknąć problemów z redirect-origin
const config = {
  ...firebaseConfig,
  authDomain: `${firebaseConfig.projectId}.firebaseapp.com`
};

const app = !getApps().length ? initializeApp(config) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Inicjalizacja Auth zoptymalizowana pod Capacitor (Android/APK).
 * indexedDBLocalPersistence zapewnia trwałość sesji w webview,
 * a browserPopupRedirectResolver pomaga w komunikacji z oknem logowania.
 */
export const auth = (() => {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    try {
      const a = getAuth(app);
      if (a) return a;
    } catch (e) {
      // Auth nie zainicjalizowane jeszcze
    }
  }
  return initializeAuth(app, {
    persistence: [indexedDBLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
})();

/**
 * Funkcja logowania przez Google przy użyciu Popup Flow.
 * Jest to najbardziej stabilna metoda w Capacitorze bez dedykowanych pluginów natywnych,
 * ponieważ nie wymaga obsługi głębokich linków (deep linking) ani powrotu do localhost.
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Zawsze pytaj o wybór konta
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    // Jawnie podajemy resolver dla środowisk hybrydowych
    const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    return result;
  } catch (error) {
    console.error("SignInWithPopup Error:", error);
    throw error;
  }
};

export { onAuthStateChanged };
