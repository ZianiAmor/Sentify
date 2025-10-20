import React, { useState, useEffect } from 'react';
import { entriesService } from '../../../services/apiService';
import '../../css/YourEntries.css';

const YourEntries = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries();
    return () => {
      setError(null);
    };
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await entriesService.getAll();
      setEntries(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      setError('Unable to load your entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAndSave = async () => {
    if (!newEntryText.trim() || !user?.id) return;
    
    try {
      setIsProcessing(true);
      setError(null);

      // Step 1: Analyze emotions
      const analysisResponse = await entriesService.analyze(newEntryText);
      const { emotions, summary } = analysisResponse.data;

      // Step 2: Extract triggers with the new system
      const triggersResponse = await entriesService.extractTriggers(newEntryText);
      const { triggers } = triggersResponse.data;

      console.log('Auto-extracted triggers:', triggers);

      // Step 3: Save entry with all data
      const entryData = {
        content: newEntryText,
        emotions: emotions,
        triggers: triggers, // This is now just the array of trigger words
        summary: summary,
        userId: user.id
      };

      await entriesService.create(entryData);
      
      // Clear input and refresh
      setNewEntryText('');
      await fetchEntries();
      
    } catch (err) {
      console.error('Failed to process entry:', err);
      setError('Unable to process your entry. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentPreview = (content, maxLength = 120) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getEmotionIndicators = (emotions) => {
    if (!emotions) return null;
    
    const emotionConfig = {
      joy: { color: '#FFD700', label: 'Joy' },
      sadness: { color: '#4169E1', label: 'Sadness' },
      anger: { color: '#DC143C', label: 'Anger' },
      fear: { color: '#800080', label: 'Fear' },
      anxiety: { color: '#FF6347', label: 'Anxiety' },
      hope: { color: '#32CD32', label: 'Hope' },
      excitement: { color: '#FF69B4', label: 'Excitement' },
      calm: { color: '#87CEEB', label: 'Calm' }
    };

    const topEmotions = Object.entries(emotions)
      .filter(([, value]) => value > 0.1)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    if (topEmotions.length === 0) return null;

    return (
      <div className="emotion-indicators">
        {topEmotions.map(([emotion, intensity]) => {
          const config = emotionConfig[emotion];
          return (
            <div key={emotion} className="emotion-pill">
              <div 
                className="emotion-accent"
                style={{ backgroundColor: config?.color || '#999' }}
              />
              <span className="emotion-name">{config?.label || emotion}</span>
              <span className="emotion-intensity">{Math.round(intensity * 100)}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  // New function to render triggers with better styling
  const renderTriggers = (triggers) => {
    if (!triggers || !Array.isArray(triggers) || triggers.length === 0) {
      return null;
    }

    return (
      <div className="entry-triggers">
        {triggers.slice(0, 4).map((trigger, index) => (
          <span key={index} className="trigger-tag">
            {typeof trigger === 'object' ? trigger.word : trigger}
          </span>
        ))}
        {triggers.length > 4 && (
          <span className="trigger-more">+{triggers.length - 4} more</span>
        )}
      </div>
    );
  };

  return (
    <div className="your-entries-container">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="entries-main-content">
        {/* Left Side - Entries History */}
        <div className="entries-history-panel">
          <h3>Your Emotional Journey</h3>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <p>No entries yet. Start your emotional journey by writing your first entry!</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map(entry => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-date">
                      {formatDate(entry.createdAt || entry.date)}
                    </div>
                    <div className="entry-emotions">
                      {getEmotionIndicators(entry.emotions)}
                    </div>
                  </div>
                  <p className="entry-preview">
                    {getContentPreview(entry.content)}
                  </p>
                  {renderTriggers(entry.triggers)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - New Entry Input */}
        <div className="new-entry-panel">
          <h3>How are you really feeling today?</h3>
          
          <textarea
            value={newEntryText}
            onChange={(e) => setNewEntryText(e.target.value)}
            placeholder="Describe your thoughts, feelings, or anything on your mind..."
            rows={6}
            className="entry-textarea"
            disabled={isProcessing}
          />
          
          <button
            onClick={handleProcessAndSave}
            disabled={!newEntryText.trim() || isProcessing}
            className="analyze-button"
          >
            {isProcessing ? 'Processing & Saving...' : 'Save My Entry'}
          </button>

          <div className="entry-tips">
            <p>💡 We'll automatically detect your emotions and key triggers</p>
            <p>📝 Mention people, places, events, and feelings for better analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourEntries;