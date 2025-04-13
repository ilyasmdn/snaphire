// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCX4k3lHYb9K5EuAVANwlXNu3VdoY453XQ",
  authDomain: "snaphire-a.firebaseapp.com",
  projectId: "snaphire-a",
  storageBucket: "snaphire-a.firebasestorage.app",
  messagingSenderId: "822070583851",
  appId: "1:822070583851:web:854b2a593e9bdd2bf5806e",
  measurementId: "G-YC133Z98YH",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with custom settings
const auth = getAuth(app);
auth.useDeviceLanguage(); // Set language to user's device language
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { auth };
export const db = getFirestore(app);
