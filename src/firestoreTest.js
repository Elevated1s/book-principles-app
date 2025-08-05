// firestoreTest.js - Test Firestore connection
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  console.log('Testing Firestore connection...');
  
  try {
    // Try to add a simple test document
    const testData = {
      test: true,
      timestamp: serverTimestamp(),
      message: 'Firestore connection test'
    };
    
    console.log('Adding test document with data:', testData);
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('Test document added successfully with ID:', docRef.id);
    
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error('Firestore test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    return { success: false, error };
  }
}; 