// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email, password, displayName) => {
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update the Firebase Auth user's profile (optional but good practice)
    await updateProfile(user, { displayName: displayName });

    // 3. Create user document in Firestore
    const userDocRef = doc(db, "users", user.uid); // Document path: users/{uid}
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: serverTimestamp(), // Use server timestamp for consistency
      isAdmin: false, // Default role
      // Add any other default fields you need
    });

    console.log("User registered and data stored in Firestore:", user.uid);
    return userCredential; // Return the original credential

  } catch (error) {
    console.error("Error during registration or storing user data:", error);
    // Re-throw the error so the calling component can handle it (e.g., show a toast)
    throw error; 
  }
};

export const logout = async () => {
  return signOut(auth);
};

export { app, analytics, auth, db };
