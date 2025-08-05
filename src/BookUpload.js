// BookUpload.js - Book Upload Component
import React, { useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { addBookToLibrary } from './bookService';
import { processBookWithAI, checkOpenAIConfiguration } from './aiService';
import { testFirestoreConnection } from './firestoreTest';

const BookUpload = () => {
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file', 'link', 'drive'
  const [file, setFile] = useState(null);
  const [bookLink, setBookLink] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [openAIStatus, setOpenAIStatus] = useState(null);

  // File upload handlers
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      setMessage('Error: Please upload a PDF, ePub, Word document, or text file.');
      return;
    }

    if (file.size > maxSize) {
      setMessage('Error: File size must be less than 50MB.');
      return;
    }

    setFile(file);
    setMessage(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  // Upload handlers
  const handleFileUpload = async () => {
    console.log('handleFileUpload called');
    console.log('File:', file);
    console.log('User:', user);
    console.log('Book title:', bookTitle);
    
    if (!file && !bookTitle.trim()) {
      setMessage('Error: Please select a file or enter a book title.');
      return;
    }

    if (!bookTitle.trim()) {
      setMessage('Error: Please enter a book title.');
      return;
    }

    if (!user) {
      setMessage('Error: You must be logged in to upload a book.');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading file...');

    try {
      // TEMPORARY WORKAROUND: Skip file upload for testing
      console.log('Using temporary workaround - skipping file upload');
      
      // Add book to user's library without file upload
      const bookData = {
        title: bookTitle,
        author: bookAuthor || 'Unknown Author',
        fileUrl: '', // No file URL for now
        uploadMethod: 'file'
      };
      
      console.log('Adding book to library with data:', bookData);
      const newBook = await addBookToLibrary(user.uid, bookData);
      console.log('Book added to library:', newBook);
      
      setMessage('Book uploaded successfully! Processing with AI...');
      
                 // Start AI processing
           try {
             console.log('Starting AI processing...');
             await processBookWithAI(newBook.id, bookData, file);
             console.log('AI processing completed');
             setMessage('Book processed successfully! Check your library.');
           } catch (error) {
             console.error('AI processing failed:', error);
             setMessage('Book uploaded but processing failed. You can retry from your library.');
           }
      
      setFile(null);
      setBookTitle('');
      setBookAuthor('');
      
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Upload error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkSubmit = async () => {
    if (!bookLink.trim()) {
      setMessage('Error: Please enter a book link.');
      return;
    }

    if (!bookTitle.trim()) {
      setMessage('Error: Please enter a book title.');
      return;
    }

    setIsUploading(true);
    setMessage('Processing book link...');

    try {
      const bookData = {
        title: bookTitle,
        author: bookAuthor || 'Unknown Author',
        bookLink: bookLink,
        uploadMethod: 'link'
      };
      
      const newBook = await addBookToLibrary(user.uid, bookData);
      
      setMessage('Book link submitted successfully! Processing with AI...');
      
      // Start AI processing
      try {
        await processBookWithAI(newBook.id, bookData);
        setMessage('Book processed successfully! Check your library.');
      } catch (error) {
        setMessage('Book uploaded but processing failed. You can retry from your library.');
      }
      
      setBookLink('');
      setBookTitle('');
      setBookAuthor('');
      
    } catch (error) {
      setMessage(`Error processing link: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDriveLinkSubmit = async () => {
    if (!driveLink.trim()) {
      setMessage('Error: Please enter a Google Drive link.');
      return;
    }

    if (!bookTitle.trim()) {
      setMessage('Error: Please enter a book title.');
      return;
    }

    setIsUploading(true);
    setMessage('Processing Google Drive link...');

    try {
      const bookData = {
        title: bookTitle,
        author: bookAuthor || 'Unknown Author',
        driveLink: driveLink,
        uploadMethod: 'drive'
      };
      
      const newBook = await addBookToLibrary(user.uid, bookData);
      
      setMessage('Google Drive link submitted successfully! Processing with AI...');
      
      // Start AI processing
      try {
        await processBookWithAI(newBook.id, bookData);
        setMessage('Book processed successfully! Check your library.');
      } catch (error) {
        setMessage('Book uploaded but processing failed. You can retry from your library.');
      }
      
      setDriveLink('');
      setBookTitle('');
      setBookAuthor('');
      
    } catch (error) {
      setMessage(`Error processing Google Drive link: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestFirestore = async () => {
    console.log('Testing Firestore connection...');
    setMessage('Testing Firestore connection...');
    
    try {
      const result = await testFirestoreConnection();
      if (result.success) {
        setMessage(`Firestore test successful! Document ID: ${result.docId}`);
      } else {
        setMessage(`Firestore test failed: ${result.error.message}`);
      }
    } catch (error) {
      setMessage(`Firestore test error: ${error.message}`);
    }
  };

  // Check OpenAI status on component mount
  React.useEffect(() => {
    const status = checkOpenAIConfiguration();
    setOpenAIStatus(status);
  }, []);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333',
    },
    methodSelector: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px',
      gap: '10px',
    },
    methodButton: {
      padding: '10px 20px',
      border: '2px solid #007AFF',
      backgroundColor: 'transparent',
      color: '#007AFF',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
    },
    activeMethodButton: {
      backgroundColor: '#007AFF',
      color: 'white',
    },
    uploadArea: {
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      backgroundColor: isDragOver ? '#f0f8ff' : '#f9f9f9',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
    },
    dragOver: {
      borderColor: '#007AFF',
      backgroundColor: '#f0f8ff',
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
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#007AFF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '10px',
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    message: {
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
    infoMessage: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #2196f3',
      color: '#1976d2',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Your Book</h1>
      
             {/* Method Selector */}
       <div style={styles.methodSelector}>
         <button
           style={{
             ...styles.methodButton,
             ...(uploadMethod === 'file' ? styles.activeMethodButton : {})
           }}
           onClick={() => setUploadMethod('file')}
         >
           Upload File
         </button>
         <button
           style={{
             ...styles.methodButton,
             ...(uploadMethod === 'link' ? styles.activeMethodButton : {})
           }}
           onClick={() => setUploadMethod('link')}
         >
           Book Link
         </button>
         <button
           style={{
             ...styles.methodButton,
             ...(uploadMethod === 'drive' ? styles.activeMethodButton : {})
           }}
           onClick={() => setUploadMethod('drive')}
         >
           Google Drive
         </button>
       </div>

               {/* Status and Test Buttons */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* OpenAI Status */}
          {openAIStatus && (
            <div style={{
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
              backgroundColor: openAIStatus.configured ? '#e8f5e8' : '#fff3cd',
              border: `1px solid ${openAIStatus.configured ? '#4caf50' : '#ffc107'}`,
              color: openAIStatus.configured ? '#2e7d32' : '#856404'
            }}>
              <strong>AI Status:</strong> {openAIStatus.message}
            </div>
          )}
          
          <button
            style={{
              ...styles.button,
              backgroundColor: '#ff9800',
              width: 'auto',
              padding: '10px 20px'
            }}
            onClick={handleTestFirestore}
          >
            Test Firestore Connection
          </button>
        </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Book Title *"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Author (optional)"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
          <div
            style={{
              ...styles.uploadArea,
              ...(isDragOver ? styles.dragOver : {})
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>Drag and drop your book file here, or</p>
            <input
              type="file"
              accept=".pdf,.epub,.txt,.doc,.docx"
              onChange={handleFileSelect}
              style={{ marginTop: '10px' }}
            />
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              Supported formats: PDF, ePub, Word documents, Text files (max 50MB)
            </p>
          </div>
          
          <button
            style={{
              ...styles.button,
              ...(isUploading || (!file && !bookTitle.trim()) ? styles.disabledButton : {})
            }}
            onClick={handleFileUpload}
            disabled={isUploading || (!file && !bookTitle.trim())}
          >
            {isUploading ? 'Uploading...' : 'Upload Book'}
          </button>
        </div>
      )}

      {/* Book Link */}
      {uploadMethod === 'link' && (
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Book Title *"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Author (optional)"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
          <input
            style={styles.input}
            type="url"
            placeholder="Paste the book URL here..."
            value={bookLink}
            onChange={(e) => setBookLink(e.target.value)}
          />
          <button
            style={{
              ...styles.button,
              ...(isUploading ? styles.disabledButton : {})
            }}
            onClick={handleLinkSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Process Book Link'}
          </button>
        </div>
      )}

      {/* Google Drive Link */}
      {uploadMethod === 'drive' && (
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Book Title *"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Author (optional)"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
          <input
            style={styles.input}
            type="url"
            placeholder="Paste your Google Drive link here..."
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
          />
          <button
            style={{
              ...styles.button,
              ...(isUploading ? styles.disabledButton : {})
            }}
            onClick={handleDriveLinkSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Process Google Drive Link'}
          </button>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('Error') ? styles.errorMessage : 
              message.includes('successfully') ? styles.successMessage : 
              styles.infoMessage)
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BookUpload; 