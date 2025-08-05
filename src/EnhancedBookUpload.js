// EnhancedBookUpload.js - Advanced Book Upload with Multiple Options
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { addBookToLibrary } from './bookService';
import { processBookWithAI } from './aiService';
import { extractTextFromFile } from './openaiService';
import { 
  extractContentFromUrl, 
  lookupBookByIsbn, 
  validateDriveLink, 
  validateIsbn,
  validateFileType,
  validateFileSize,
  getFileSizeMB
} from './uploadService';

const EnhancedBookUpload = () => {
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file', 'drive', 'url', 'isbn'
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [isbn, setIsbn] = useState('');

  const handleFileUpload = async () => {
    if (!user) {
      setMessage('Error: Please sign in first.');
      return;
    }

    if (!file && !bookTitle.trim()) {
      setMessage('Error: Please select a file or enter a book title.');
      return;
    }

    if (file) {
      if (!validateFileType(file)) {
        setMessage('Error: Invalid file type. Please upload PDF, TXT, DOC, DOCX, or EPUB files.');
        return;
      }

      if (!validateFileSize(file)) {
        setMessage(`Error: File too large. Maximum size is 50MB. Current file: ${getFileSizeMB(file)}MB`);
        return;
      }
    }

    setIsUploading(true);
    setMessage('Uploading book...');

    try {
      let fileContent = null;
      if (file) {
        fileContent = await extractTextFromFile(file);
      }

      const bookData = {
        title: bookTitle || file?.name?.replace(/\.[^/.]+$/, '') || 'Untitled Book',
        author: bookAuthor || 'Unknown Author',
        fileUrl: file ? URL.createObjectURL(file) : '',
        uploadMethod: 'file_upload',
        fileContent: fileContent
      };

      const book = await addBookToLibrary(user.uid, bookData);
      await processBookWithAI(book.id, bookData);
      
      setMessage('Book uploaded successfully! Check your library.');
      setBookTitle('');
      setBookAuthor('');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDriveUpload = async () => {
    if (!user) {
      setMessage('Error: Please sign in first.');
      return;
    }

    if (!driveLink.trim() || !bookTitle.trim()) {
      setMessage('Error: Please enter both Google Drive link and book title.');
      return;
    }

    if (!validateDriveLink(driveLink)) {
      setMessage('Error: Invalid Google Drive link format.');
      return;
    }

    setIsUploading(true);
    setMessage('Processing Google Drive book...');

    try {
      const bookData = {
        title: bookTitle,
        author: bookAuthor || 'Unknown Author',
        driveLink: driveLink,
        uploadMethod: 'google_drive'
      };

      const book = await addBookToLibrary(user.uid, bookData);
      await processBookWithAI(book.id, bookData);
      
      setMessage('Google Drive book processed successfully! Check your library.');
      setBookTitle('');
      setBookAuthor('');
      setDriveLink('');
    } catch (error) {
      console.error('Drive upload error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!user) {
      setMessage('Error: Please sign in first.');
      return;
    }

    if (!bookUrl.trim() || !bookTitle.trim()) {
      setMessage('Error: Please enter both URL and book title.');
      return;
    }

    setIsUploading(true);
    setMessage('Processing URL book...');

    try {
      // Try to extract content from URL
      const urlContent = await extractContentFromUrl(bookUrl);
      
      const bookData = {
        title: bookTitle,
        author: bookAuthor || urlContent.author || 'Unknown Author',
        bookLink: bookUrl,
        uploadMethod: 'url_import',
        fileContent: urlContent.content
      };

      const book = await addBookToLibrary(user.uid, bookData);
      await processBookWithAI(book.id, bookData);
      
      setMessage('URL book processed successfully! Check your library.');
      setBookTitle('');
      setBookAuthor('');
      setBookUrl('');
    } catch (error) {
      console.error('URL upload error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleIsbnUpload = async () => {
    if (!user) {
      setMessage('Error: Please sign in first.');
      return;
    }

    if (!isbn.trim()) {
      setMessage('Error: Please enter an ISBN.');
      return;
    }

    if (!validateIsbn(isbn)) {
      setMessage('Error: Invalid ISBN format. Please enter a valid 10 or 13 digit ISBN.');
      return;
    }

    setIsUploading(true);
    setMessage('Looking up book by ISBN...');

    try {
      // Lookup book by ISBN
      const isbnResult = await lookupBookByIsbn(isbn);
      
      const bookData = {
        title: bookTitle || isbnResult.book.title,
        author: bookAuthor || isbnResult.book.author,
        isbn: isbn,
        uploadMethod: 'isbn_lookup',
        description: isbnResult.book.description
      };

      const book = await addBookToLibrary(user.uid, bookData);
      await processBookWithAI(book.id, bookData);
      
      setMessage('ISBN book processed successfully! Check your library.');
      setBookTitle('');
      setBookAuthor('');
      setIsbn('');
    } catch (error) {
      console.error('ISBN upload error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch (uploadMethod) {
      case 'file':
        handleFileUpload();
        break;
      case 'drive':
        handleDriveUpload();
        break;
      case 'url':
        handleUrlUpload();
        break;
      case 'isbn':
        handleIsbnUpload();
        break;
      default:
        setMessage('Error: Please select an upload method.');
    }
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
    methodSelector: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    methodButton: {
      padding: '12px 24px',
      border: '2px solid #007AFF',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#007AFF',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    activeMethodButton: {
      backgroundColor: '#007AFF',
      color: 'white',
    },
    form: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    fileInput: {
      width: '100%',
      padding: '12px',
      border: '2px dashed #007AFF',
      borderRadius: '6px',
      backgroundColor: '#f8f9fa',
      cursor: 'pointer',
      textAlign: 'center',
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#007AFF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    message: {
      marginTop: '20px',
      padding: '15px',
      borderRadius: '6px',
      textAlign: 'center',
      fontWeight: '600',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    infoBox: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #bbdefb',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
    },
    infoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1976d2',
      marginBottom: '8px',
    },
    infoText: {
      fontSize: '14px',
      color: '#424242',
      lineHeight: '1.5',
    },
  };

  const renderUploadForm = () => {
    switch (uploadMethod) {
      case 'file':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Book File</label>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx,.epub"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.fileInput}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Supported formats: PDF, TXT, DOC, DOCX, EPUB
              </p>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>📁 File Upload</div>
              <div style={styles.infoText}>
                Upload your book file directly. The AI will analyze the content and create personalized daily lessons.
              </div>
            </div>
          </>
        );

      case 'drive':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Google Drive Link</label>
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>☁️ Google Drive</div>
              <div style={styles.infoText}>
                Share your book from Google Drive. Make sure the file is set to "Anyone with the link can view".
              </div>
            </div>
          </>
        );

      case 'url':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Book URL</label>
              <input
                type="url"
                placeholder="https://example.com/book-content"
                value={bookUrl}
                onChange={(e) => setBookUrl(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>🌐 URL Import</div>
              <div style={styles.infoText}>
                Import book content from a public URL. The AI will analyze the content and create daily lessons.
              </div>
            </div>
          </>
        );

      case 'isbn':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>ISBN Number</label>
              <input
                type="text"
                placeholder="978-0-123456-47-2"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>📚 ISBN Lookup</div>
              <div style={styles.infoText}>
                Enter the ISBN to automatically fetch book details and create AI-generated daily content.
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Your Book</h1>
      
      <div style={styles.methodSelector}>
        <button
          style={{
            ...styles.methodButton,
            ...(uploadMethod === 'file' ? styles.activeMethodButton : {})
          }}
          onClick={() => setUploadMethod('file')}
        >
          📁 File Upload
        </button>
        <button
          style={{
            ...styles.methodButton,
            ...(uploadMethod === 'drive' ? styles.activeMethodButton : {})
          }}
          onClick={() => setUploadMethod('drive')}
        >
          ☁️ Google Drive
        </button>
        <button
          style={{
            ...styles.methodButton,
            ...(uploadMethod === 'url' ? styles.activeMethodButton : {})
          }}
          onClick={() => setUploadMethod('url')}
        >
          🌐 URL Import
        </button>
        <button
          style={{
            ...styles.methodButton,
            ...(uploadMethod === 'isbn' ? styles.activeMethodButton : {})
          }}
          onClick={() => setUploadMethod('isbn')}
        >
          📚 ISBN Scanner
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Book Title *</label>
          <input
            type="text"
            placeholder="Enter book title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Author</label>
          <input
            type="text"
            placeholder="Enter author name"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            style={styles.input}
          />
        </div>

        {renderUploadForm()}

        <button
          type="submit"
          style={{
            ...styles.submitButton,
            ...(isUploading ? styles.disabledButton : {})
          }}
          disabled={isUploading}
        >
          {isUploading ? 'Processing...' : 'Upload Book'}
        </button>
      </form>

      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('Error') ? styles.errorMessage : styles.successMessage)
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EnhancedBookUpload; 