// EnhancedDailyContent.js - Enhanced Daily Content with Progress Tracking, Streaks, Notes, and Sharing
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveUserNote, getUserNotes } from './bookService';
import { generateAdditionalDailyContent } from './openaiService';

const EnhancedDailyContent = ({ book, onClose }) => {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(book.currentDay || 1);
  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState({});
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadUserNotes();
    calculateStreak();
    calculateCompletionRate();
  }, [book.id, currentDay]);

  const loadUserNotes = async () => {
    try {
      const notes = await getUserNotes(user.uid, book.id);
      setUserNotes(notes);
      if (notes[currentDay]) {
        setNoteText(notes[currentDay]);
      } else {
        setNoteText('');
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const calculateStreak = () => {
    // Calculate consecutive days completed
    let currentStreak = 0;
    for (let day = 1; day <= currentDay; day++) {
      if (userNotes[day] && userNotes[day].trim()) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const calculateCompletionRate = () => {
    const totalDays = book.totalDays || 1;
    const completedDays = Object.keys(userNotes).filter(day => 
      userNotes[day] && userNotes[day].trim()
    ).length;
    setCompletionRate(Math.round((completedDays / totalDays) * 100));
  };

  const getDailyContent = (day) => {
    if (!book.dailyContent) return null;
    
    if (Array.isArray(book.dailyContent)) {
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

  const handleNextDay = async () => {
    if (currentDay >= book.totalDays) {
      // Generate more content
      setIsLoading(true);
      try {
        const additionalContent = await generateAdditionalDailyContent(book, book.totalDays, 10);
        // Update book with new content (this would need to be implemented in bookService)
        console.log('Additional content generated:', additionalContent);
      } catch (error) {
        console.error('Error generating additional content:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentDay(currentDay + 1);
    }
  };

  const handlePreviousDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleSaveNote = async () => {
    try {
      await saveUserNote(user.uid, book.id, currentDay, noteText);
      setUserNotes(prev => ({ ...prev, [currentDay]: noteText }));
      calculateStreak();
      calculateCompletionRate();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleShareProgress = () => {
    setShowShareModal(true);
  };

  const shareProgress = async (platform) => {
    const progressText = `📚 Reading Progress: "${book.title}" by ${book.author}
📅 Day ${currentDay} of ${book.totalDays}
🔥 Streak: ${streak} days
✅ Completion: ${completionRate}%
💭 Today's lesson: ${getDailyContent(currentDay)?.lesson}`;

    let shareUrl = '';
    let shareText = progressText;

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareText);
        alert('Progress copied to clipboard!');
        setShowShareModal(false);
        return;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareModal(false);
  };

  const dailyContent = getDailyContent(currentDay);

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
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid #eee',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666',
    },
    progressSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '25px',
    },
    progressCard: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      border: '1px solid #e9ecef',
    },
    progressTitle: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px',
    },
    progressValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#007AFF',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '10px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#007AFF',
      transition: 'width 0.3s ease',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    navButton: {
      padding: '10px 20px',
      border: '1px solid #007AFF',
      borderRadius: '6px',
      backgroundColor: 'white',
      color: '#007AFF',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    dayIndicator: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    contentSection: {
      marginBottom: '25px',
    },
    contentCard: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '15px',
      border: '1px solid #e9ecef',
    },
    contentTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
    },
    contentText: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.6',
    },
    notesSection: {
      marginBottom: '25px',
    },
    notesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    notesTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
    },
    toggleButton: {
      padding: '8px 16px',
      border: '1px solid #007AFF',
      borderRadius: '6px',
      backgroundColor: 'white',
      color: '#007AFF',
      cursor: 'pointer',
      fontSize: '14px',
    },
    textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      resize: 'vertical',
      marginBottom: '10px',
    },
    saveButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#007AFF',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
    },
    actionButton: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    primaryButton: {
      backgroundColor: '#007AFF',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
    },
    shareModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    },
    shareContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '400px',
      width: '90%',
    },
    shareTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
    },
    shareButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
    },
    shareButton: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
    },
  };

  if (isLoading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.loading}>Generating more content...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.header}>
            <h2 style={styles.title}>{book.title}</h2>
            <button style={styles.closeButton} onClick={onClose}>×</button>
          </div>

          {/* Progress Section */}
          <div style={styles.progressSection}>
            <div style={styles.progressCard}>
              <div style={styles.progressTitle}>Current Day</div>
              <div style={styles.progressValue}>{currentDay}</div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${(currentDay / book.totalDays) * 100}%`
                  }}
                />
              </div>
            </div>
            <div style={styles.progressCard}>
              <div style={styles.progressTitle}>Streak</div>
              <div style={styles.progressValue}>🔥 {streak}</div>
              <div style={styles.progressTitle}>days</div>
            </div>
            <div style={styles.progressCard}>
              <div style={styles.progressTitle}>Completion</div>
              <div style={styles.progressValue}>{completionRate}%</div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${completionRate}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={styles.navigation}>
            <button 
              style={styles.navButton}
              onClick={handlePreviousDay}
              disabled={currentDay <= 1}
            >
              ← Previous Day
            </button>
            <div style={styles.dayIndicator}>Day {currentDay}</div>
            <button 
              style={styles.navButton}
              onClick={handleNextDay}
              disabled={currentDay >= book.totalDays}
            >
              Next Day →
            </button>
          </div>

          {/* Daily Content */}
          <div style={styles.contentSection}>
            <div style={styles.contentCard}>
              <div style={styles.contentTitle}>📚 Today's Lesson</div>
              <div style={styles.contentText}>{dailyContent?.lesson}</div>
            </div>
            <div style={styles.contentCard}>
              <div style={styles.contentTitle}>💪 Exercise</div>
              <div style={styles.contentText}>{dailyContent?.exercise}</div>
            </div>
            <div style={styles.contentCard}>
              <div style={styles.contentTitle}>✨ Affirmation</div>
              <div style={styles.contentText}>{dailyContent?.affirmation}</div>
            </div>
            <div style={styles.contentCard}>
              <div style={styles.contentTitle}>🤔 Reflection</div>
              <div style={styles.contentText}>{dailyContent?.thought}</div>
            </div>
          </div>

          {/* Notes Section */}
          <div style={styles.notesSection}>
            <div style={styles.notesHeader}>
              <div style={styles.notesTitle}>📝 Personal Notes</div>
              <button 
                style={styles.toggleButton}
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? 'Hide Notes' : 'Show Notes'}
              </button>
            </div>
            {showNotes && (
              <div>
                <textarea
                  style={styles.textarea}
                  placeholder="Add your personal thoughts, insights, or reflections for today..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button style={styles.saveButton} onClick={handleSaveNote}>
                  Save Note
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button 
              style={{ ...styles.actionButton, ...styles.primaryButton }}
              onClick={handleShareProgress}
            >
              📤 Share Progress
            </button>
            <button 
              style={{ ...styles.actionButton, ...styles.secondaryButton }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div style={styles.shareModal}>
          <div style={styles.shareContent}>
            <div style={styles.shareTitle}>Share Your Progress</div>
            <div style={styles.shareButtons}>
              <button 
                style={styles.shareButton}
                onClick={() => shareProgress('twitter')}
              >
                🐦 Twitter
              </button>
              <button 
                style={styles.shareButton}
                onClick={() => shareProgress('facebook')}
              >
                📘 Facebook
              </button>
              <button 
                style={styles.shareButton}
                onClick={() => shareProgress('linkedin')}
              >
                💼 LinkedIn
              </button>
              <button 
                style={styles.shareButton}
                onClick={() => shareProgress('copy')}
              >
                📋 Copy Link
              </button>
            </div>
            <button 
              style={{ ...styles.actionButton, ...styles.secondaryButton, marginTop: '15px', width: '100%' }}
              onClick={() => setShowShareModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedDailyContent; 