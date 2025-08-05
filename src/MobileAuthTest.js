// MobileAuthTest.js - Mobile-style Authentication Test Component
import React, { useState } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  logout 
} from './authService';

const MobileAuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      const result = await signUpWithEmail(email, password);
      setMessage(`Sign up successful! User ID: ${result.user.uid}`);
    } catch (error) {
      setMessage(`Sign up error: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmail(email, password);
      setMessage(`Sign in successful! User ID: ${result.user.uid}`);
    } catch (error) {
      setMessage(`Sign in error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      setMessage(`Google sign in successful! User ID: ${result.user.uid}`);
    } catch (error) {
      setMessage(`Google sign in error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setMessage('Sign out successful!');
    } catch (error) {
      setMessage(`Sign out error: ${error.message}`);
    }
  };

  const mobileStyles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '15px',
      marginBottom: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px',
    },
    button: {
      padding: '15px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'center',
    },
    signUpButton: {
      backgroundColor: '#007AFF',
      color: '#fff',
    },
    signInButton: {
      backgroundColor: '#34C759',
      color: '#fff',
    },
    googleButton: {
      backgroundColor: '#4285F4',
      color: '#fff',
    },
    signOutButton: {
      backgroundColor: '#FF3B30',
      color: '#fff',
    },
    messageContainer: {
      padding: '15px',
      borderRadius: '8px',
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    successMessage: {
      backgroundColor: '#e8f5e8',
      border: '1px solid #4caf50',
      color: '#2e7d32',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      border: '1px solid #f44336',
      color: '#d32f2f',
    },
  };

  return (
    <div style={mobileStyles.container}>
      <h1 style={mobileStyles.title}>Mobile Auth Test</h1>
      
      <input
        style={mobileStyles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        style={mobileStyles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div style={mobileStyles.buttonContainer}>
        <button 
          style={{...mobileStyles.button, ...mobileStyles.signUpButton}}
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        
        <button 
          style={{...mobileStyles.button, ...mobileStyles.signInButton}}
          onClick={handleSignIn}
        >
          Sign In
        </button>
        
        <button 
          style={{...mobileStyles.button, ...mobileStyles.googleButton}}
          onClick={handleGoogleSignIn}
        >
          Sign In with Google
        </button>
        
        <button 
          style={{...mobileStyles.button, ...mobileStyles.signOutButton}}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      {message && (
        <div style={{
          ...mobileStyles.messageContainer,
          ...(message.includes('error') ? mobileStyles.errorMessage : mobileStyles.successMessage)
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default MobileAuthTest; 