// authService.js - Firebase Authentication Service

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// Store user data in Firebase instead of Google Sheets
const storeUserInFirebase = async (userData) => {
  try {
    const { name, email, uid, signupMethod, timestamp } = userData;
    
    // Create user document in Firestore
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      name: name || 'N/A',
      email: email || 'N/A',
      uid: uid,
      signupMethod: signupMethod || 'email',
      timestamp: timestamp || new Date().toISOString(),
      status: 'Active',
      createdAt: new Date(),
      lastLogin: new Date()
    });
    
    console.log('User data stored in Firebase successfully');
    return { success: true, message: 'User data stored successfully' };
  } catch (error) {
    console.error('Error storing user in Firebase:', error);
    return { success: false, message: `Failed to store user data: ${error.message}` };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, name) => {
  try {
    console.log('About to call storeUserInFirebase for email signup');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user data in Firebase
    const result = await storeUserInFirebase({
      name,
      email,
      uid: user.uid,
      signupMethod: 'email',
      timestamp: new Date().toISOString()
    });
    
    console.log('Firebase storage result:', result);
    return { user, userData: result };
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login time
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
    } catch (updateError) {
      console.log('Could not update last login time:', updateError);
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if this is a new user
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // New user - store their data with Google display name
      console.log('New Google user, storing data in Firebase');
      const googleName = user.displayName || 'Google User';
      const result = await storeUserInFirebase({
        name: googleName,
        email: user.email,
        uid: user.uid,
        signupMethod: 'google',
        timestamp: new Date().toISOString()
      });
      console.log('Google user Firebase storage result:', result);
    } else {
      // Existing user - update last login and ensure they have a name
      try {
        const userData = userDoc.data();
        const updates = { lastLogin: new Date() };
        
        // If user doesn't have a name, try to get it from Google
        if (!userData.name || userData.name === 'N/A') {
          const googleName = user.displayName || 'Google User';
          updates.name = googleName;
          console.log('Updated missing name for existing Google user:', googleName);
        }
        
        await setDoc(userRef, updates, { merge: true });
      } catch (updateError) {
        console.log('Could not update user data:', updateError);
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Phone number sign in with name collection
export const signInWithPhone = async (phoneNumber, name = null) => {
  try {
    // Note: This is a placeholder for phone authentication
    // You would need to implement the actual phone auth logic here
    // For now, we'll just store the phone number and name if provided
    
    if (!name) {
      throw new Error('Name is required for phone sign-in');
    }
    
    // This would normally create a phone auth user
    // For now, we'll just return success
    console.log('Phone sign-in requested for:', phoneNumber, 'with name:', name);
    
    // In a real implementation, you would:
    // 1. Verify the phone number
    // 2. Create/authenticate the user
    // 3. Store their data in Firebase
    
    return { success: true, message: 'Phone authentication not yet implemented' };
  } catch (error) {
    console.error('Error with phone sign-in:', error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user data from Firebase
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Update user name (useful for users who signed up without names)
export const updateUserName = async (uid, newName) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { 
      name: newName,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('User name updated successfully');
    return { success: true, message: 'Name updated successfully' };
  } catch (error) {
    console.error('Error updating user name:', error);
    return { success: false, message: `Failed to update name: ${error.message}` };
  }
};

// Ensure user has a name, prompt if missing
export const ensureUserName = async (uid, fallbackName = null) => {
  try {
    const userData = await getUserData(uid);
    
    if (userData && userData.name && userData.name !== 'N/A') {
      return userData.name; // User already has a name
    }
    
    // User doesn't have a name, try to get one from fallback
    if (fallbackName) {
      await updateUserName(uid, fallbackName);
      return fallbackName;
    }
    
    return null; // No name available
  } catch (error) {
    console.error('Error ensuring user name:', error);
    return null;
  }
}; 