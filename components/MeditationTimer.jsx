/**
 * Meditation Timer Component
 * CRITICAL: Core engagement feature for spiritual apps
 * 
 * Features:
 * - Configurable duration presets
 * - Ambient sounds
 * - Session tracking
 * - Streak integration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { logTime, updateStreak } from '../lib/user-progress';
import { track, EVENTS } from '../lib/analytics';

// Duration presets in minutes
const DURATION_PRESETS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

// Timer states
const STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

export default function MeditationTimer({ 
  onComplete, 
  userId = null,
  verseContext = null // Optional: link to specific verse being contemplated
}) {
  const [duration, setDuration] = useState(10); // minutes
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // seconds
  const [state, setState] = useState(STATES.IDLE);
  const [showSettings, setShowSettings] = useState(true);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const audioRef = useRef(null);

  // Format time for display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentage
  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  // Start timer
  const startTimer = useCallback(() => {
    if (state === STATES.IDLE) {
      setTimeRemaining(duration * 60);
    }
    
    setState(STATES.RUNNING);
    setShowSettings(false);
    startTimeRef.current = Date.now();
    
    track(EVENTS.ANIMATION_STARTED, {
      type: 'meditation',
      duration,
      verseContext
    });

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [state, duration, verseContext]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setState(STATES.PAUSED);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    setState(STATES.RUNNING);
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Complete session
  const completeSession = useCallback(() => {
    setState(STATES.COMPLETED);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Play completion sound
    playCompletionSound();

    // Log meditation time
    logTime(duration, 'meditation', userId);
    updateStreak(userId);

    // Track completion
    track(EVENTS.ANIMATION_COMPLETED, {
      type: 'meditation',
      duration,
      verseContext
    });

    if (onComplete) {
      onComplete({ duration, verseContext });
    }
  }, [duration, userId, verseContext, onComplete]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setState(STATES.IDLE);
    setTimeRemaining(duration * 60);
    setShowSettings(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [duration]);

  // Play completion sound
  const playCompletionSound = useCallback(() => {
    // Create a simple bell sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 528; // Healing frequency
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 2);
    } catch (e) {
      console.log('Could not play sound:', e);
    }
  }, []);

  // Update duration
  const handleDurationChange = useCallback((newDuration) => {
    setDuration(newDuration);
    if (state === STATES.IDLE) {
      setTimeRemaining(newDuration * 60);
    }
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="meditation-timer">
      {/* Timer display */}
      <div className="timer-display">
        {/* Progress ring */}
        <svg className="progress-ring" viewBox="0 0 200 200">
          <circle
            className="progress-ring-bg"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="8"
          />
          <circle
            className="progress-ring-fill"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            transform="rotate(-90 100 100)"
          />
        </svg>
        
        {/* Time text */}
        <div className="time-text">
          <span className="time-remaining">{formatTime(timeRemaining)}</span>
          {state === STATES.COMPLETED && (
            <span className="completed-text">Complete ✨</span>
          )}
        </div>
      </div>

      {/* Duration presets */}
      {showSettings && (
        <div className="duration-presets">
          <label>Duration:</label>
          <div className="preset-buttons">
            {DURATION_PRESETS.map(preset => (
              <button
                key={preset.value}
                className={`preset-btn ${duration === preset.value ? 'active' : ''}`}
                onClick={() => handleDurationChange(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verse context */}
      {verseContext && (
        <div className="verse-context">
          <span className="context-label">Contemplating:</span>
          <span className="context-verse">{verseContext}</span>
        </div>
      )}

      {/* Controls */}
      <div className="timer-controls">
        {state === STATES.IDLE && (
          <button className="control-btn start" onClick={startTimer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Begin Meditation
          </button>
        )}

        {state === STATES.RUNNING && (
          <button className="control-btn pause" onClick={pauseTimer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            Pause
          </button>
        )}

        {state === STATES.PAUSED && (
          <>
            <button className="control-btn resume" onClick={resumeTimer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Resume
            </button>
            <button className="control-btn reset" onClick={resetTimer}>
              Reset
            </button>
          </>
        )}

        {state === STATES.COMPLETED && (
          <button className="control-btn new" onClick={resetTimer}>
            New Session
          </button>
        )}
      </div>

      {/* Tips */}
      {state === STATES.RUNNING && (
        <div className="meditation-tip">
          <p>Focus on your breath. Let thoughts arise and pass like clouds.</p>
        </div>
      )}

      <style jsx>{`
        .meditation-timer {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          max-width: 400px;
          margin: 0 auto;
        }

        .timer-display {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 1.5rem;
        }

        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .progress-ring-fill {
          transition: stroke-dashoffset 0.5s ease;
        }

        .time-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .time-remaining {
          font-size: 2.5rem;
          font-weight: 700;
          color: #e2e8f0;
          font-family: monospace;
        }

        .completed-text {
          display: block;
          font-size: 1rem;
          color: #10B981;
          margin-top: 0.5rem;
        }

        .duration-presets {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .duration-presets label {
          display: block;
          color: #94a3b8;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .preset-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(139, 92, 246, 0.3);
          background: transparent;
          color: #94a3b8;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          border-color: #8B5CF6;
          color: #e2e8f0;
        }

        .preset-btn.active {
          background: #8B5CF6;
          border-color: #8B5CF6;
          color: white;
        }

        .verse-context {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          text-align: center;
        }

        .context-label {
          color: #94a3b8;
          font-size: 0.75rem;
          display: block;
        }

        .context-verse {
          color: #8B5CF6;
          font-weight: 600;
        }

        .timer-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn.start,
        .control-btn.resume,
        .control-btn.new {
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          color: white;
        }

        .control-btn.pause {
          background: rgba(139, 92, 246, 0.2);
          color: #8B5CF6;
        }

        .control-btn.reset {
          background: transparent;
          border: 1px solid #94a3b8;
          color: #94a3b8;
        }

        .control-btn:hover {
          transform: translateY(-2px);
        }

        .meditation-tip {
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          font-size: 0.875rem;
          max-width: 280px;
        }

        @media (max-width: 480px) {
          .meditation-timer {
            padding: 1.5rem;
          }

          .time-remaining {
            font-size: 2rem;
          }

          .preset-btn {
            padding: 0.4rem 0.6rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
