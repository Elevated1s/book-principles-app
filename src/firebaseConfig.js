// firebaseConfig.js
// Replace the below config with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCQdW6k31_3yOSrEinZmRC_zYl3Z0sBjq4',
  authDomain: 'book-principles-app.firebaseapp.com',
  projectId: 'book-principles-app',
  storageBucket: 'book-principles-app.firebasestorage.app',
  messagingSenderId: '301443696603',
  appId: '1:301443696603:web:fd9807e4896fefc8b749fe',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 