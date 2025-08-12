// AIStatusIndicator.js - Reusable AI Status Display Component
import React from 'react';
import { getAPIKeyStatus } from './openaiService';

const AIStatusIndicator = ({ 
  showDetails = true, 
  compact = false, 
  className = '',
  style = {} 
}) => {
  const aiStatus = getAPIKeyStatus();

  const containerStyle = {
    padding: compact ? '10px' : '15px',
    marginBottom: compact ? '10px' : '20px',
    borderRadius: '8px',
    backgroundColor: aiStatus.configured ? '#d4edda' : '#fff3cd',
    border: `1px solid ${aiStatus.configured ? '#c3e6cb' : '#ffeaa7'}`,
    color: aiStatus.configured ? '#155724' : '#856404',
    fontSize: compact ? '13px' : '14px',
    ...style
  };

  const iconStyle = {
    fontSize: compact ? '16px' : '18px',
    marginRight: '8px'
  };

  const titleStyle = {
    fontSize: compact ? '14px' : '16px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center'
  };

  const messageStyle = {
    margin: '0',
    lineHeight: '1.4'
  };

  const detailsStyle = {
    margin: '5px 0 0 0',
    fontSize: compact ? '12px' : '13px',
    opacity: 0.8,
    lineHeight: '1.3'
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={titleStyle}>
        <span style={iconStyle}>
          {aiStatus.configured ? '🤖' : '⚠️'}
        </span>
        {aiStatus.configured ? 'AI Analysis Enabled' : 'AI Analysis Limited'}
      </div>
      
      <p style={messageStyle}>{aiStatus.message}</p>
      
      {showDetails && aiStatus.details && (
        <p style={detailsStyle}>{aiStatus.details}</p>
      )}
    </div>
  );
};

export default AIStatusIndicator;
