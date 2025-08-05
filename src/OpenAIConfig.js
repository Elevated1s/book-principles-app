import React, { useState, useEffect } from 'react';
import { getAPIKeyStatus, setAPIKey, testOpenAIConnection } from './openaiService';
import './OpenAIConfig.css';

const OpenAIConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState({ configured: false, message: '' });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    updateStatus();
  }, []);

  const updateStatus = () => {
    const currentStatus = getAPIKeyStatus();
    setStatus(currentStatus);
  };

  const handleSaveKey = () => {
    if (setAPIKey(apiKey)) {
      setApiKey('');
      updateStatus();
      alert('API key saved successfully!');
    } else {
      alert('Invalid API key format. Please enter a valid OpenAI API key (starts with sk-)');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testOpenAIConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: `Test failed: ${error.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    updateStatus();
    setApiKey('');
    setTestResult(null);
    alert('API key cleared');
  };

  return (
    <div className="openai-config">
      <div className="config-header">
        <h2>🤖 OpenAI API Configuration</h2>
        <div className={`status-indicator ${status.configured ? 'configured' : 'not-configured'}`}>
          {status.configured ? '✅ Configured' : '⚠️ Not Configured'}
        </div>
      </div>

      <div className="config-section">
        <h3>Current Status</h3>
        <p className="status-message">{status.message}</p>
        
        {status.configured && (
          <div className="test-section">
            <button 
              onClick={handleTestConnection} 
              disabled={isTesting}
              className="test-button"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            
            {testResult && (
              <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                <strong>{testResult.success ? '✅ Success:' : '❌ Error:'}</strong> {testResult.message}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="config-section">
        <h3>Configure API Key</h3>
        <p className="help-text">
          Get your API key from{' '}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
            OpenAI Platform
          </a>
        </p>
        
        <div className="input-group">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-your_openai_api_key_here"
            className="api-key-input"
          />
          <button 
            onClick={() => setShowKey(!showKey)}
            className="toggle-visibility"
            type="button"
          >
            {showKey ? '👁️' : '🙈'}
          </button>
        </div>
        
        <div className="button-group">
          <button onClick={handleSaveKey} className="save-button">
            Save API Key
          </button>
          {status.configured && (
            <button onClick={handleClearKey} className="clear-button">
              Clear API Key
            </button>
          )}
        </div>
      </div>

      <div className="config-section">
        <h3>How It Works</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>✅ With API Key</h4>
            <ul>
              <li>Real AI analysis using GPT-3.5-turbo</li>
              <li>File content processing</li>
              <li>Personalized summaries and insights</li>
              <li>Smart fallbacks if AI fails</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>⚠️ Without API Key</h4>
            <ul>
              <li>High-quality simulated content</li>
              <li>No file processing</li>
              <li>Generic content based on title/author</li>
              <li>Still fully functional app</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="config-section">
        <h3>Cost Information</h3>
        <div className="cost-info">
          <p><strong>GPT-3.5-turbo:</strong> ~$0.002 per 1K tokens</p>
          <p><strong>Typical book analysis:</strong> ~$0.01-0.05 per book</p>
          <p><strong>Free tier:</strong> $5 credit for new users</p>
          <p><strong>Pay-as-you-go:</strong> No monthly fees</p>
        </div>
      </div>
    </div>
  );
};

export default OpenAIConfig; 