import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if it hasn't been initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const promoteToAdmin = async (uid) => {
  try {
    console.log(`Promoting user ${uid} to admin...`);
    
    // Set custom claims
    await getAuth().setCustomUserClaims(uid, { admin: true });
    console.log(`Custom claims set for user ${uid}`);
    
    // Update the user document
    const db = getFirestore();
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.update({
      isAdmin: true
    });
    console.log(`User document updated for ${uid}`);
    
    // Verify the claims were set
    const userRecord = await getAuth().getUser(uid);
    console.log(`User ${uid} claims:`, userRecord.customClaims);
    
    console.log(`User ${uid} successfully promoted to admin`);
    return true;
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw error;
  }
};

export const checkAdminStatus = async (uid) => {
  try {
    const userRecord = await getAuth().getUser(uid);
    console.log(`User ${uid} claims:`, userRecord.customClaims);
    return userRecord.customClaims?.admin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw error;
  }
}; 