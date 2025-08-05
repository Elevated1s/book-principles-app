// bookService.js - Book Management Service
import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

// Add a book to user's library
export const addBookToLibrary = async (userId, bookData) => {
  console.log('addBookToLibrary called with:', { userId, bookData });
  try {
    // Simplify the data structure to avoid potential issues
    const bookDocData = {
      userId: userId,
      title: bookData.title || 'Untitled Book',
      author: bookData.author || 'Unknown Author',
      fileUrl: bookData.fileUrl || '',
      bookLink: bookData.bookLink || '',
      driveLink: bookData.driveLink || '',
      uploadMethod: bookData.uploadMethod,
      status: 'processing',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      summary: '',
      principles: [],
      dailyContent: {
        lessons: [],
        exercises: [],
        affirmations: [],
        thoughts: []
      },
      currentDay: 1,
      totalDays: 0
    };

    console.log('Attempting to add document with data:', bookDocData);
    
    const bookDoc = await addDoc(collection(db, 'books'), bookDocData);
    console.log('Book document created with ID:', bookDoc.id);
    
    return {
      id: bookDoc.id,
      ...bookData,
      status: 'processing'
    };
  } catch (error) {
    console.error('Error adding book to library:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Get user's book library
export const getUserBooks = async (userId) => {
  console.log('getUserBooks called for userId:', userId);
  try {
    const q = query(
      collection(db, 'books'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Query snapshot size:', querySnapshot.size);
    
    const books = [];
    
    querySnapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      });
    });
    
    console.log('Books found:', books);
    return books;
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};

// Update book status
export const updateBookStatus = async (bookId, status, data = {}) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
      status,
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating book status:', error);
    throw error;
  }
};

// Update book with AI processing results
export const updateBookWithAIResults = async (bookId, aiResults) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    
    // Handle different dailyContent structures
    let totalDays = 0;
    if (aiResults.dailyContent) {
      if (Array.isArray(aiResults.dailyContent)) {
        // If dailyContent is an array of daily content objects
        totalDays = aiResults.dailyContent.length;
      } else if (aiResults.dailyContent.lessons && Array.isArray(aiResults.dailyContent.lessons)) {
        // If dailyContent has a lessons array
        totalDays = aiResults.dailyContent.lessons.length;
      }
    }
    
    await updateDoc(bookRef, {
      status: 'completed',
      summary: aiResults.summary,
      keyPrinciples: aiResults.keyPrinciples || aiResults.principles,
      dailyContent: aiResults.dailyContent,
      totalDays: totalDays,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating book with AI results:', error);
    throw error;
  }
};

// Delete a book from user's library
export const deleteBook = async (bookId) => {
  try {
    await deleteDoc(doc(db, 'books', bookId));
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// Update user's current day for a book
export const updateUserProgress = async (bookId, currentDay) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
      currentDay,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Function to add additional daily content to a book
export const addAdditionalDailyContent = async (bookId, additionalContent) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    
    // Get current book data
    const bookDoc = await getDoc(bookRef);
    if (!bookDoc.exists()) {
      throw new Error('Book not found');
    }
    
    const bookData = bookDoc.data();
    const currentDailyContent = bookData.dailyContent || [];
    
    // Append new content to existing content
    const updatedDailyContent = [...currentDailyContent, ...additionalContent];
    
    // Update the book with additional content
    await updateDoc(bookRef, {
      dailyContent: updatedDailyContent,
      totalDays: updatedDailyContent.length,
      updatedAt: serverTimestamp()
    });
    
    console.log('Additional daily content added successfully');
    return updatedDailyContent;
  } catch (error) {
    console.error('Error adding additional daily content:', error);
    throw error;
  }
};

// Enhanced progress tracking functions
export const updateBookProgress = async (bookId, currentDay) => {
  try {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
      currentDay,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating book progress:', error);
    throw error;
  }
};

// Save user note for a specific day
export const saveUserNote = async (userId, bookId, day, noteText) => {
  try {
    const noteRef = doc(db, 'userNotes', `${userId}_${bookId}_${day}`);
    await updateDoc(noteRef, {
      userId,
      bookId,
      day,
      note: noteText,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    // If document doesn't exist, create it
    try {
      const noteRef = doc(db, 'userNotes', `${userId}_${bookId}_${day}`);
      await updateDoc(noteRef, {
        userId,
        bookId,
        day,
        note: noteText,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (createError) {
      console.error('Error creating user note:', createError);
      throw createError;
    }
  }
};

// Get all user notes for a book
export const getUserNotes = async (userId, bookId) => {
  try {
    const q = query(
      collection(db, 'userNotes'),
      where('userId', '==', userId),
      where('bookId', '==', bookId)
    );
    
    const querySnapshot = await getDocs(q);
    const notes = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notes[data.day] = data.note;
    });
    
    return notes;
  } catch (error) {
    console.error('Error getting user notes:', error);
    return {};
  }
};

// Get user reading statistics
export const getUserStats = async (userId) => {
  try {
    const q = query(
      collection(db, 'books'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(q);
    const stats = {
      totalBooks: querySnapshot.size,
      totalDays: 0,
      completedDays: 0,
      currentStreak: 0,
      longestStreak: 0
    };
    
    querySnapshot.forEach((doc) => {
      const bookData = doc.data();
      stats.totalDays += bookData.totalDays || 0;
      stats.completedDays += bookData.currentDay || 0;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalBooks: 0,
      totalDays: 0,
      completedDays: 0,
      currentStreak: 0,
      longestStreak: 0
    };
  }
}; 