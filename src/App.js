import React, { useState, useEffect } from 'react';
import AuthTest from './AuthTest';
import MobileAuthTest from './MobileAuthTest';
import BookUpload from './BookUpload';
import EnhancedBookUpload from './EnhancedBookUpload';
import UserLibrary from './UserLibrary';
import UserStats from './UserStats';
import OpenAIConfig from './OpenAIConfig';
import AIStatusIndicator from './AIStatusIndicator';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'upload', 'enhanced-upload', 'library', 'stats', 'config'
  const [authView, setAuthView] = useState('web'); // 'web' or 'mobile'

  // Auto-redirect to library when user signs in
  useEffect(() => {
    if (user && currentView === 'auth') {
      setCurrentView('library');
    }
  }, [user, currentView]);

  const renderAuthView = () => {
    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => setAuthView('web')}
            style={{ 
              marginRight: '10px', 
              padding: '8px 16px',
              backgroundColor: authView === 'web' ? '#007AFF' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Web Style
          </button>
          <button 
            onClick={() => setAuthView('mobile')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: authView === 'mobile' ? '#007AFF' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mobile Style
          </button>
        </div>
        {authView === 'web' ? <AuthTest /> : <MobileAuthTest />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Book Principles App</h1>
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📚 Book Principles App
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#fff', 
          marginBottom: '20px',
          opacity: 0.9
        }}>
          Transform Books into Daily Wisdom ✨
        </p>
        
        {user && (
          <div style={{ marginBottom: '10px', color: '#fff', fontSize: '14px' }}>
            Welcome, {user.email || user.phoneNumber || 'User'}!
            <button 
              onClick={logout}
              style={{
                marginLeft: '15px',
                padding: '4px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
        
        {/* Global AI Status Indicator */}
        {user && (
          <div style={{ marginBottom: '20px' }}>
            <AIStatusIndicator compact={true} showDetails={false} />
          </div>
        )}
        
        {/* Navigation */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          {!user ? (
            <button 
              onClick={() => setCurrentView('auth')}
              className={`nav-button ${currentView === 'auth' ? 'active' : ''}`}
            >
              🚀 Sign In
            </button>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('library')}
                className={`nav-button ${currentView === 'library' ? 'active' : ''}`}
              >
                📚 My Library
              </button>
              <button
                onClick={() => setCurrentView('upload')}
                className={`nav-button ${currentView === 'upload' ? 'active' : ''}`}
              >
                📖 Upload Book
              </button>
              <button
                onClick={() => setCurrentView('enhanced-upload')}
                className={`nav-button ${currentView === 'enhanced-upload' ? 'active' : ''}`}
              >
                🚀 Advanced Upload
              </button>
              <button 
                onClick={() => setCurrentView('stats')}
                className={`nav-button ${currentView === 'stats' ? 'active' : ''}`}
              >
                📊 Statistics
              </button>
              <button 
                onClick={() => setCurrentView('config')}
                className={`nav-button ${currentView === 'config' ? 'active' : ''}`}
              >
                ⚙️ AI Settings
              </button>
            </>
          )}
        </div>
      </header>
      
      <main>
        {!user ? (
          currentView === 'auth' ? (
            <div className="card">
              {renderAuthView()}
            </div>
          ) : (
            <div className="card">
              <div>Please sign in to continue</div>
            </div>
          )
        ) : (
          <div className="card">
            {currentView === 'library' ? <UserLibrary /> :
             currentView === 'stats' ? <UserStats /> :
             currentView === 'config' ? <OpenAIConfig /> :
             currentView === 'enhanced-upload' ? <EnhancedBookUpload /> :
             <BookUpload />}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 