// UserLibrary.js - User's Book Library
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserBooks, deleteBook } from './bookService';
import { processBookWithAI } from './aiService';
import EnhancedDailyContent from './EnhancedDailyContent';

const UserLibrary = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDailyContent, setShowDailyContent] = useState(false);

  const loadUserBooks = useCallback(async () => {
    console.log('loadUserBooks called for user:', user?.uid);
    try {
      setLoading(true);
      const userBooks = await getUserBooks(user.uid);
      console.log('Books loaded from database:', userBooks);
      setBooks(userBooks);
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load your books');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserBooks();
    }
  }, [user, loadUserBooks]);

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId));
      } catch (err) {
        setError('Failed to delete book');
        console.error('Error deleting book:', err);
      }
    }
  };

  const handleRetryProcessing = async (book) => {
    try {
      setError('');
      const bookData = {
        title: book.title,
        author: book.author,
        fileUrl: book.fileUrl,
        bookLink: book.bookLink,
        driveLink: book.driveLink,
        uploadMethod: book.uploadMethod
      };
      
      await processBookWithAI(book.id, bookData);
      await loadUserBooks(); // Refresh the library
    } catch (err) {
      setError('Failed to retry processing');
      console.error('Error retrying processing:', err);
    }
  };

  const handleContinueReading = (book) => {
    setSelectedBook(book);
    setShowDailyContent(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'processing':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Ready';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    },
    bookCard: {
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    bookHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px',
    },
    bookTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px',
    },
    bookAuthor: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '10px',
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white',
      textTransform: 'uppercase',
    },
    bookDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '15px',
    },
    detailItem: {
      fontSize: '14px',
      color: '#666',
    },
    detailLabel: {
      fontWeight: '600',
      color: '#333',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#007AFF',
      transition: 'width 0.3s ease',
    },
    progressText: {
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
    },
    summarySection: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
    },
    summaryTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
    },
    summaryText: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.6',
      margin: '0',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    primaryButton: {
      backgroundColor: '#007AFF',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
    },
    dangerButton: {
      backgroundColor: '#f44336',
      color: 'white',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    },
    error: {
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      borderRadius: '8px',
      marginBottom: '20px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your library...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Book Library</h1>
      
      {error && <div style={styles.error}>{error}</div>}
      
      {books.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No books yet</h3>
          <p>Upload your first book to get started!</p>
        </div>
      ) : (
        books.map((book) => (
          <div key={book.id} style={styles.bookCard}>
            <div style={styles.bookHeader}>
              <div>
                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>by {book.author}</p>
              </div>
              <div
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(book.status)
                }}
              >
                {getStatusText(book.status)}
              </div>
            </div>
            
            <div style={styles.bookDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Uploaded:</span> {formatDate(book.createdAt)}
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Method:</span> {book.uploadMethod}
              </div>
              {book.totalDays > 0 && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Total Days:</span> {book.totalDays}
                </div>
              )}
            </div>
            
            {/* Book Summary */}
            {book.summary && book.status === 'completed' && (
              <div style={styles.summarySection}>
                <h4 style={styles.summaryTitle}>Book Summary</h4>
                <p style={styles.summaryText}>{book.summary}</p>
              </div>
            )}
            
            {book.status === 'completed' && book.totalDays > 0 && (
              <div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${(book.currentDay / book.totalDays) * 100}%`
                    }}
                  />
                </div>
                <p style={styles.progressText}>
                  Day {book.currentDay} of {book.totalDays}
                </p>
              </div>
            )}
            
            <div style={styles.actionButtons}>
              {book.status === 'completed' && (
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={() => handleContinueReading(book)}
                >
                  Continue Reading
                </button>
              )}
              {book.status === 'failed' && (
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={() => handleRetryProcessing(book)}
                >
                  Retry Processing
                </button>
              )}
              {book.summary && book.status === 'completed' && (
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => {
                    // Show summary in an alert for now (could be a modal later)
                    alert(`Book Summary:\n\n${book.summary}`);
                  }}
                >
                  View Summary
                </button>
              )}
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => {
                  const details = `Book Details:
                  
Title: ${book.title}
Author: ${book.author}
Status: ${book.status}
Upload Method: ${book.uploadMethod}
Total Days: ${book.totalDays || 'N/A'}
Current Day: ${book.currentDay || 'N/A'}
Uploaded: ${formatDate(book.createdAt)}
Updated: ${formatDate(book.updatedAt)}

${book.summary ? `Summary: ${book.summary}` : 'No summary available'}

${book.keyPrinciples ? `Key Principles: ${book.keyPrinciples.join(', ')}` : 'No principles available'}`;
                  alert(details);
                }}
              >
                View Details
              </button>
              <button
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={() => handleDeleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
      
             {/* Enhanced Daily Content Modal */}
       {showDailyContent && selectedBook && (
         <EnhancedDailyContent
           book={selectedBook}
           onClose={() => {
             setShowDailyContent(false);
             setSelectedBook(null);
             loadUserBooks(); // Refresh to get updated progress
           }}
         />
       )}
    </div>
  );
};

export default UserLibrary; 