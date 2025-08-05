// UserStats.js - User Statistics Dashboard
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserStats } from './bookService';

const UserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const userStats = await getUserStats(user.uid);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (stats.totalDays === 0) return 0;
    return Math.round((stats.completedDays / stats.totalDays) * 100);
  };

  const getAchievementLevel = () => {
    const completionRate = getCompletionRate();
    if (completionRate >= 90) return { level: 'Master', emoji: '👑', color: '#FFD700' };
    if (completionRate >= 75) return { level: 'Advanced', emoji: '⭐', color: '#FF6B6B' };
    if (completionRate >= 50) return { level: 'Intermediate', emoji: '🌟', color: '#4ECDC4' };
    if (completionRate >= 25) return { level: 'Beginner', emoji: '🌱', color: '#45B7D1' };
    return { level: 'Novice', emoji: '🌿', color: '#96CEB4' };
  };

  const achievement = getAchievementLevel();

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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '1px solid #e9ecef',
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#007AFF',
      marginBottom: '8px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    achievementSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      marginBottom: '30px',
      border: '1px solid #e9ecef',
    },
    achievementTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px',
    },
    achievementLevel: {
      fontSize: '48px',
      marginBottom: '10px',
    },
    achievementText: {
      fontSize: '18px',
      fontWeight: '600',
      color: achievement.color,
      marginBottom: '10px',
    },
    progressSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
      border: '1px solid #e9ecef',
    },
    progressTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    progressBar: {
      width: '100%',
      height: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#007AFF',
      transition: 'width 0.3s ease',
      borderRadius: '10px',
    },
    progressText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
    },
    insightsSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e9ecef',
    },
    insightsTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center',
    },
    insightItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      marginBottom: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
    },
    insightIcon: {
      fontSize: '24px',
      marginRight: '15px',
    },
    insightText: {
      fontSize: '14px',
      color: '#555',
      flex: 1,
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your statistics...</div>
      </div>
    );
  }

  if (stats.totalBooks === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>📊 Reading Statistics</h1>
        <div style={styles.emptyState}>
          <h3>No reading data yet</h3>
          <p>Start reading books to see your statistics and achievements!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Reading Statistics</h1>

      {/* Achievement Section */}
      <div style={styles.achievementSection}>
        <div style={styles.achievementTitle}>Your Achievement Level</div>
        <div style={styles.achievementLevel}>{achievement.emoji}</div>
        <div style={styles.achievementText}>{achievement.level}</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {getCompletionRate()}% completion rate
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>📚 {stats.totalBooks}</div>
          <div style={styles.statLabel}>Books Started</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>📅 {stats.totalDays}</div>
          <div style={styles.statLabel}>Total Days Available</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>✅ {stats.completedDays}</div>
          <div style={styles.statLabel}>Days Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>🔥 {stats.currentStreak}</div>
          <div style={styles.statLabel}>Current Streak</div>
        </div>
      </div>

      {/* Progress Section */}
      <div style={styles.progressSection}>
        <div style={styles.progressTitle}>Overall Progress</div>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${getCompletionRate()}%`
            }}
          />
        </div>
        <div style={styles.progressText}>
          {stats.completedDays} of {stats.totalDays} days completed ({getCompletionRate()}%)
        </div>
      </div>

      {/* Insights Section */}
      <div style={styles.insightsSection}>
        <div style={styles.insightsTitle}>📈 Reading Insights</div>
        
        <div style={styles.insightItem}>
          <div style={styles.insightIcon}>📖</div>
          <div style={styles.insightText}>
            You've started {stats.totalBooks} book{stats.totalBooks !== 1 ? 's' : ''} in your reading journey
          </div>
        </div>

        <div style={styles.insightItem}>
          <div style={styles.insightIcon}>🎯</div>
          <div style={styles.insightText}>
            {getCompletionRate() >= 50 ? 
              `Great job! You're ${getCompletionRate()}% through your reading program` :
              `You're ${getCompletionRate()}% through your reading program - keep going!`
            }
          </div>
        </div>

        <div style={styles.insightItem}>
          <div style={styles.insightIcon}>🔥</div>
          <div style={styles.insightText}>
            {stats.currentStreak > 0 ? 
              `You're on a ${stats.currentStreak}-day reading streak!` :
              'Start building your reading streak today!'
            }
          </div>
        </div>

        <div style={styles.insightItem}>
          <div style={styles.insightIcon}>⭐</div>
          <div style={styles.insightText}>
            {achievement.level} level achieved - {achievement.emoji} {achievement.level} Reader
          </div>
        </div>

        {stats.totalDays > 0 && (
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>📊</div>
            <div style={styles.insightText}>
              Average completion rate: {Math.round((stats.completedDays / stats.totalBooks) * 10) / 10} days per book
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats; 