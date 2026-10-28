import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Try to load any credentials saved directly in browser localStorage
let storedConfig = null;
try {
  const local = localStorage.getItem('smartwaste_firebase_config');
  if (local) {
    storedConfig = JSON.parse(local);
  }
} catch (e) {
  console.warn("Could not read local Firebase config:", e);
}

// Fallback to environment variables or hardcoded values
export const firebaseConfig = storedConfig || {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Check if valid credentials are present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

// Save credentials from UI and reload app
export function saveFirebaseConfig(newConfig) {
  try {
    localStorage.setItem('smartwaste_firebase_config', JSON.stringify(newConfig));
    window.location.reload();
  } catch (err) {
    console.error("Failed to save Firebase config:", err);
  }
}

// Clear credentials and return to demo mode
export function clearFirebaseConfig() {
  try {
    localStorage.removeItem('smartwaste_firebase_config');
    window.location.reload();
  } catch (err) {
    console.error("Failed to clear Firebase config:", err);
  }
}

// Initialize Firebase
let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 [Firebase] Connected to Cloud Firestore & Auth for project:", firebaseConfig.projectId);
  } catch (err) {
    console.error("🔥 [Firebase] Initialization error:", err);
  }
} else {
  console.info("ℹ️ [Firebase] Running in Demo Mode. Connect your Firebase credentials via the navbar button to go live!");
}

export { app, db, auth };
