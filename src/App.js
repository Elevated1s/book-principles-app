import React, { useState } from 'react';
import AuthTest from './AuthTest';
import MobileAuthTest from './MobileAuthTest';
import BookUpload from './BookUpload';
import EnhancedBookUpload from './EnhancedBookUpload';
import UserLibrary from './UserLibrary';
import UserStats from './UserStats';
import OpenAIConfig from './OpenAIConfig';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('upload'); // 'auth', 'upload', 'enhanced-upload', 'library', 'stats', 'config'
  const [authView, setAuthView] = useState('web'); // 'web' or 'mobile'

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
        <h1>Book Principles App</h1>
        <p>Extract Key Principles from Books</p>
        
        {user && (
          <div style={{ marginBottom: '10px', color: '#fff', fontSize: '14px' }}>
            Welcome, {user.email || user.phoneNumber || 'User'}!
          </div>
        )}
        
        {/* Navigation */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {!user ? (
            <button 
              onClick={() => setCurrentView('auth')}
              style={{ 
                padding: '10px 20px',
                backgroundColor: currentView === 'auth' ? '#007AFF' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Sign In
            </button>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('library')}
                style={{ 
                  padding: '10px 20px',
                  backgroundColor: currentView === 'library' ? '#007AFF' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                My Library
              </button>
                            <button
                onClick={() => setCurrentView('upload')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentView === 'upload' ? '#007AFF' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Upload Book
              </button>
              <button
                onClick={() => setCurrentView('enhanced-upload')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentView === 'enhanced-upload' ? '#007AFF' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Advanced Upload
              </button>
              <button 
                onClick={() => setCurrentView('stats')}
                style={{ 
                  padding: '10px 20px',
                  backgroundColor: currentView === 'stats' ? '#007AFF' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                📊 Statistics
              </button>
              <button 
                onClick={() => setCurrentView('config')}
                style={{ 
                  padding: '10px 20px',
                  backgroundColor: currentView === 'config' ? '#007AFF' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                AI Settings
              </button>
            </>
          )}
        </div>
      </header>
      
      <main>
        {!user ? (
          currentView === 'auth' ? renderAuthView() : <div>Please sign in to continue</div>
        ) : (
          currentView === 'library' ? <UserLibrary /> :
          currentView === 'stats' ? <UserStats /> :
          currentView === 'config' ? <OpenAIConfig /> :
          currentView === 'enhanced-upload' ? <EnhancedBookUpload /> :
          <BookUpload />
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