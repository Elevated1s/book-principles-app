// AuthTest.js - Web Authentication Test Component
import React, { useState } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  logout 
} from './authService';
import './AuthTest.css';

const AuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password, name);
      console.log('Sign up successful:', result);
      setSuccess(`Account created successfully! Welcome, ${result.userData?.success ? name : 'User'}!`);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      setSuccess('Signed in successfully!');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signInWithGoogle();
      setSuccess('Google sign in successful!');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setSuccess('Sign out successful!');
    } catch (error) {
      setError(`Sign out error: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '450px', 
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid #f0f0f0'
    }}>
      <div className="auth-container">
        <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        
        {isSignUp && (
          <form onSubmit={handleSignUp} className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <div style={{ marginBottom: '20px' }}>
              <button 
                type="submit" 
                className="auth-button primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              <button 
                type="button"
                onClick={() => setIsSignUp(false)}
                className="auth-toggle"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {!isSignUp && (
          <form onSubmit={handleSignIn} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <div style={{ marginBottom: '20px' }}>
              <button 
                type="submit" 
                className="auth-button primary"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <button 
                type="button"
                onClick={() => setIsSignUp(true)}
                className="auth-toggle"
              >
                Need an account? Sign Up
              </button>
            </div>
          </form>
        )}

        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="auth-button google"
            disabled={loading}
          >
            {loading ? 'Signing In...' : '🔐 Sign in with Google'}
          </button>
        </div>

        <p className="disclaimer">
          By signing in you agree to receive promotional emails/sms from digital elevations co.
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
    </div>
  );
};

export default AuthTest; 