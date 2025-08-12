import React, { useState } from 'react';
import { updateUserName } from './authService';
import './UserNamePrompt.css';

const UserNamePrompt = ({ userId, currentName, onNameUpdated, onClose }) => {
  const [name, setName] = useState(currentName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updateUserName(userId, name.trim());
      if (result.success) {
        onNameUpdated(name.trim());
        onClose();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to update name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="name-prompt-overlay">
      <div className="name-prompt-modal">
        <h3>Welcome! Please tell us your name</h3>
        <p>We'd like to personalize your experience</p>
        
        <form onSubmit={handleSubmit} className="name-prompt-form">
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
            autoFocus
            required
          />
          
          {error && <div className="name-error">{error}</div>}
          
          <div className="name-prompt-buttons">
            <button
              type="submit"
              className="name-submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Name'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="name-skip-btn"
              disabled={loading}
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserNamePrompt;
