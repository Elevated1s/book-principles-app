// AuthTest.js - Web Authentication Test Component
import React, { useState } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  logout 
} from './authService';

const AuthTest = () => {
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

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Welcome to Book Principles App</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleSignUp} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Sign Up
        </button>
        <button onClick={handleSignIn} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Sign In
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleGoogleSignIn} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Sign In with Google
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleSignOut} style={{ padding: '8px 16px' }}>
          Sign Out
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('error') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${message.includes('error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AuthTest; 