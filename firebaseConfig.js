// firebaseConfig.js
// Replace the below config with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAnXhgeg9S5f9JsDQhba46L9A8O6uzig9s',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'book-principles-app.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'book-principles-app',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'book-principles-app.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '301443696603',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:301443696603:web:fd9807e4896fefc8b749fe',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 