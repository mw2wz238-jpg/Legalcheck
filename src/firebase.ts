import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Konfiguracja rozszerzona o poprawną domenę autoryzacji
const extendedConfig = {
  ...firebaseConfig,
  authDomain: "gen-lang-client-0297750093.firebaseapp.com"
};

// Inicjalizacja Singleton
const app = !getApps().length ? initializeApp(extendedConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

// --- DODAJEMY LOGIKĘ LOGOWANIA ---

const googleProvider = new GoogleAuthProvider();

/**
 * Ta funkcja musi być podpięta pod onClick Twojego przycisku "Zaloguj przez Google"
 */
export const signInWithGoogle = async () => {
  try {
    // Redirect jest bezpieczniejszy dla plików APK niż Popup
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Błąd inicjalizacji logowania:", error);
  }
};

/**
 * Kluczowe dla APK: Obsługa powrotu z przeglądarki do aplikacji
 */
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      console.log("Zalogowano pomyślnie:", result.user);
    }
  })
  .catch((error) => {
    console.error("Błąd po powrocie z autoryzacji:", error);
  });
