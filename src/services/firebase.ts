import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);
const app = firebaseConfigured ? (getApps()[0] ?? initializeApp(config)) : null;
export const firebase = app
  ? { auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) }
  : null;
export const authService = {
  email: async (email: string, password: string) => {
    if (!firebase) throw new Error('Firebase is not configured');
    return signInWithEmailAndPassword(firebase.auth, email, password);
  },
  google: async () => {
    if (!firebase) throw new Error('Firebase is not configured');
    return signInWithPopup(firebase.auth, new GoogleAuthProvider());
  },
};
