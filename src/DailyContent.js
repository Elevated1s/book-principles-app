// DailyContent.js - Daily Content Display Component
import React, { useState } from 'react';
import { updateUserProgress, addAdditionalDailyContent } from './bookService';
import { generateAdditionalDailyContent } from './openaiService';

const DailyContent = ({ book, onClose }) => {
  const [currentDay, setCurrentDay] = useState(book.currentDay || 1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const totalDays = book.totalDays || book.dailyContent?.lessons?.length || 0;

  const handleNextDay = async () => {
    setIsUpdating(true);
    try {
      const nextDay = currentDay + 1;
      
      // Check if we need to generate more content
      if (nextDay > totalDays) {
        setIsGeneratingContent(true);
        try {
          // Generate 10 more days of content
          const additionalContent = await generateAdditionalDailyContent(book, totalDays, 10);
          await addAdditionalDailyContent(book.id, additionalContent);
          
                     // Update the book object with new content
           book.dailyContent = [...book.dailyContent, ...additionalContent];
           book.totalDays = book.dailyContent.length;
        } catch (error) {
          console.error('Error generating additional content:', error);
        } finally {
          setIsGeneratingContent(false);
        }
      }
      
      await updateUserProgress(book.id, nextDay);
      setCurrentDay(nextDay);
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreviousDay = async () => {
    if (currentDay > 1) {
      setIsUpdating(true);
      try {
        await updateUserProgress(book.id, currentDay - 1);
        setCurrentDay(currentDay - 1);
      } catch (error) {
        console.error('Error updating progress:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const getDailyContent = (day) => {
    if (!book.dailyContent) return null;
    
    // Handle different dailyContent structures
    if (Array.isArray(book.dailyContent)) {
      // If dailyContent is an array of daily content objects
      const dayContent = book.dailyContent[day - 1];
      if (dayContent) {
        return {
          lesson: dayContent.lesson || dayContent.title || 'No lesson available',
          exercise: dayContent.exercise || dayContent.content || 'No exercise available',
          affirmation: dayContent.affirmation || 'Focus on applying today\'s lesson',
          thought: dayContent.thought || 'Reflect on how this applies to your life'
        };
      }
    } else if (book.dailyContent.lessons && Array.isArray(book.dailyContent.lessons)) {
      // If dailyContent has a lessons array structure
      return {
        lesson: book.dailyContent.lessons[day - 1] || 'No lesson available',
        exercise: book.dailyContent.exercises[day - 1] || 'No exercise available',
        affirmation: book.dailyContent.affirmations[day - 1] || 'No affirmation available',
        thought: book.dailyContent.thoughts[day - 1] || 'No thought available'
      };
    }
    
    return {
      lesson: 'No lesson available',
      exercise: 'No exercise available',
      affirmation: 'No affirmation available',
      thought: 'No thought available'
    };
  };

  const content = getDailyContent(currentDay);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #eee',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '15px',
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
    contentSection: {
      marginBottom: '25px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
    },
    sectionContent: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#444',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #eee',
    },
    navButton: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    prevButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
    },
    nextButton: {
      backgroundColor: '#007AFF',
      color: 'white',
    },
    disabledButton: {
      backgroundColor: '#ccc',
      color: '#999',
      cursor: 'not-allowed',
    },
    icon: {
      marginRight: '8px',
      fontSize: '20px',
    },
  };

  if (!content) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeButton} onClick={onClose}>×</button>
          <div style={styles.header}>
            <h2 style={styles.title}>No Content Available</h2>
            <p>This book hasn't been processed yet or doesn't have daily content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        
        <div style={styles.header}>
          <h2 style={styles.title}>{book.title}</h2>
          <p style={styles.subtitle}>by {book.author}</p>
          
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(currentDay / totalDays) * 100}%`
              }}
            />
          </div>
          <p style={styles.progressText}>
            Day {currentDay} of {totalDays}
            {isGeneratingContent && (
              <span style={{ color: '#007AFF', fontWeight: 'bold' }}>
                {' '}(Generating more content...)
              </span>
            )}
          </p>
        </div>

        <div style={styles.contentSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.icon}>📚</span>
            Today's Lesson
          </h3>
          <p style={styles.sectionContent}>{content.lesson}</p>
        </div>

        <div style={styles.contentSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.icon}>💪</span>
            Today's Exercise
          </h3>
          <p style={styles.sectionContent}>{content.exercise}</p>
        </div>

        <div style={styles.contentSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.icon}>✨</span>
            Today's Affirmation
          </h3>
          <p style={styles.sectionContent}>{content.affirmation}</p>
        </div>

        <div style={styles.contentSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.icon}>💭</span>
            Thought for Today
          </h3>
          <p style={styles.sectionContent}>{content.thought}</p>
        </div>

        <div style={styles.navigation}>
          <button
            style={{
              ...styles.navButton,
              ...styles.prevButton,
              ...(currentDay <= 1 ? styles.disabledButton : {})
            }}
            onClick={handlePreviousDay}
            disabled={currentDay <= 1 || isUpdating}
          >
            ← Previous Day
          </button>
          
          <button
            style={{
              ...styles.navButton,
              ...styles.nextButton,
              ...(isUpdating ? styles.disabledButton : {})
            }}
            onClick={handleNextDay}
            disabled={isUpdating}
          >
            {isGeneratingContent ? 'Generating Content...' : 'Next Day →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyContent; 