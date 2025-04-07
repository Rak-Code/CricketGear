// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbf1iMPEJOc4ozG8eM_-E1uHjG3e5FMeo",
  authDomain: "cricketgear-3cd94.firebaseapp.com",
  projectId: "cricketgear-3cd94",
  storageBucket: "cricketgear-3cd94.firebasestorage.app",
  messagingSenderId: "231000242671",
  appId: "1:231000242671:web:e455fe3a234e3c08a19e1a",
  measurementId: "G-69VEH9K2X0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Auth functions
export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

export { app, analytics, auth };
