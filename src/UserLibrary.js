// UserLibrary.js - User's Book Library
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserBooks } from './bookService';
import { getUserData } from './authService';
import AIStatusIndicator from './AIStatusIndicator';
import EnhancedBookUpload from './EnhancedBookUpload';
import EnhancedDailyContent from './EnhancedDailyContent';
import './UserLibrary.css';

const UserLibrary = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserBooks(user.uid);
      loadUserData(user.uid);
    }
  }, [user]);

  const loadUserBooks = async (userId) => {
    console.log('loadUserBooks called for user:', userId);
    try {
      const userBooks = await getUserBooks(userId);
      console.log('Books loaded from database:', userBooks);
      setBooks(userBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId) => {
    try {
      const data = await getUserData(userId);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const calculateLearningProgress = (book) => {
    if (!book.principles || book.principles.length === 0) return 0;
    
    const totalPrinciples = book.principles.length;
    const completedPrinciples = book.principles.filter(p => p.learned).length;
    return Math.round((completedPrinciples / totalPrinciples) * 100);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="user-library">
      <AIStatusIndicator />
      
      <div className="library-header">
        <h2>📚 Your Book Library</h2>
        {userData && (
          <p className="welcome-message">
            Welcome back, <strong>{userData.name}</strong>! 📖
          </p>
        )}
      </div>

      <EnhancedBookUpload onBookAdded={loadUserBooks} />

      {books.length === 0 ? (
        <div className="empty-library">
          <h3>No books yet!</h3>
          <p>Upload your first book to get started on your learning journey.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card" onClick={() => setSelectedBook(book)}>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-date">Added: {new Date(book.uploadDate).toLocaleDateString()}</p>
                
                <div className="progress-container">
                  <span className="progress-label">🎯 Learning Progress</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${calculateLearningProgress(book)}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{calculateLearningProgress(book)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <EnhancedDailyContent 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
};

export default UserLibrary; 