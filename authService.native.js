// authService.native.js
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Email/Password Sign Up
export const signUpWithEmail = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Sign In (Expo Auth Session)
export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1068207091917-oqglkqgb11j7brmb2elt4ttmu7s0rqbd.apps.googleusercontent.com', // Web Client ID from Google Cloud Console
    iosClientId: 'YOUR_IOS_CLIENT_ID', // iOS Client ID from Google Cloud Console (optional for now)
    androidClientId: '1068207091917-h2ac35sd33j5hebsoibsj6gc5v7tvj5r.apps.googleusercontent.com', // Android Client ID from Google Cloud Console
    webClientId: '1068207091917-oqglkqgb11j7brmb2elt4ttmu7s0rqbd.apps.googleusercontent.com', // Web Client ID (same as expoClientId)
  });

  const signInWithGoogle = async () => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      return signInWithCredential(auth, credential);
    }
  };

  return { request, response, promptAsync, signInWithGoogle };
};

// Phone Sign In (no reCAPTCHA needed on mobile)
export const signInWithPhone = async (phoneNumber, appVerifier = undefined) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// Sign Out
export const logout = async () => {
  return signOut(auth);
}; 