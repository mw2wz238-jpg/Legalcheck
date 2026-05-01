import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  browserPopupRedirectResolver, 
  signInWithPopup, 
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

// Trwałość sesji - browserLocalPersistence jest stabilne w Capacitor
setPersistence(auth, browserLocalPersistence).catch(console.error);

/**
 * Logowanie Google przez Popup.
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    return await signInWithPopup(auth, provider, browserPopupRedirectResolver);
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
};

export { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};
