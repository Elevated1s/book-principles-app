// uploadService.js - Enhanced Upload Services

// Extract content from URL
export const extractContentFromUrl = async (url) => {
  try {
    // Note: In a real implementation, you'd need a backend service to handle CORS
    // For now, we'll return a placeholder message
    console.log('Attempting to extract content from:', url);
    
    // This would require a backend proxy to avoid CORS issues
    // For now, we'll simulate the extraction
    return {
      success: true,
      content: `Content extracted from ${url}. This is a placeholder - in production, this would contain the actual book content.`,
      title: 'Extracted Book Content',
      author: 'Unknown Author'
    };
  } catch (error) {
    console.error('Error extracting content from URL:', error);
    throw new Error('Failed to extract content from URL');
  }
};

// Lookup book by ISBN
export const lookupBookByIsbn = async (isbn) => {
  try {
    console.log('Looking up book with ISBN:', isbn);
    
    // In production, you'd use a real ISBN API like Google Books API
    // For now, we'll simulate the lookup
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
    
    if (cleanIsbn.length < 10) {
      throw new Error('Invalid ISBN format');
    }
    
    // Simulate API response
    return {
      success: true,
      book: {
        title: `Book (ISBN: ${isbn})`,
        author: 'Unknown Author',
        isbn: cleanIsbn,
        description: `Book found with ISBN ${isbn}. This is a placeholder - in production, this would contain real book metadata.`
      }
    };
  } catch (error) {
    console.error('Error looking up ISBN:', error);
    throw new Error('Failed to lookup book by ISBN');
  }
};

// Validate Google Drive link
export const validateDriveLink = (driveLink) => {
  const drivePattern = /^https:\/\/drive\.google\.com\/(file\/d\/|open\?id=)/;
  return drivePattern.test(driveLink);
};

// Extract file ID from Google Drive link
export const extractDriveFileId = (driveLink) => {
  const fileIdMatch = driveLink.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  const openIdMatch = driveLink.match(/id=([a-zA-Z0-9-_]+)/);
  
  if (fileIdMatch) {
    return fileIdMatch[1];
  } else if (openIdMatch) {
    return openIdMatch[1];
  }
  
  return null;
};

// Get direct download link for Google Drive file
export const getDriveDownloadLink = (fileId) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// Validate ISBN format
export const validateIsbn = (isbn) => {
  const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
  
  if (cleanIsbn.length !== 10 && cleanIsbn.length !== 13) {
    return false;
  }
  
  // Basic validation - in production you'd add checksum validation
  return true;
};

// Format ISBN for display
export const formatIsbn = (isbn) => {
  const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
  
  if (cleanIsbn.length === 10) {
    return `${cleanIsbn.slice(0, 1)}-${cleanIsbn.slice(1, 4)}-${cleanIsbn.slice(4, 9)}-${cleanIsbn.slice(9)}`;
  } else if (cleanIsbn.length === 13) {
    return `${cleanIsbn.slice(0, 3)}-${cleanIsbn.slice(3, 4)}-${cleanIsbn.slice(4, 8)}-${cleanIsbn.slice(8, 12)}-${cleanIsbn.slice(12)}`;
  }
  
  return isbn;
};

// Get file extension from filename
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Validate file type
export const validateFileType = (file) => {
  const allowedTypes = ['pdf', 'txt', 'doc', 'docx', 'epub'];
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
};

// Get file size in MB
export const getFileSizeMB = (file) => {
  return (file.size / (1024 * 1024)).toFixed(2);
};

// Validate file size (max 50MB)
export const validateFileSize = (file, maxSizeMB = 50) => {
  const fileSizeMB = file.size / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
}; 