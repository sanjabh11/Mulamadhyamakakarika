/**
 * Streak Banner Component
 * CRITICAL: Gamification for daily engagement
 */

import React, { useEffect, useState } from 'react';
import { getProgress, updateStreak } from '../lib/user-progress';
import { useUser } from '../contexts/UserContext';

export default function StreakBanner({ compact = false }) {
  const { user } = useUser();
  const [streak, setStreak] = useState(0);
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    const progress = updateStreak(user?.id);
    setStreak(progress.currentStreak);
    
    // Check if this is a new day since last visit
    const today = new Date().toISOString().split('T')[0];
    const lastActive = progress.streakHistory?.[progress.streakHistory.length - 1]?.date;
    setIsNewDay(lastActive === today && progress.currentStreak > 0);
  }, [user?.id]);

  if (streak === 0) return null;

  if (compact) {
    return (
      <div className="streak-compact">
        <span className="flame">🔥</span>
        <span className="count">{streak}</span>
        <style jsx>{`
          .streak-compact {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            background: rgba(251, 146, 60, 0.1);
            border-radius: 20px;
            font-size: 0.875rem;
          }
          .count {
            font-weight: bold;
            color: #FB923C;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`streak-banner ${isNewDay ? 'celebrating' : ''}`}>
      <div className="streak-content">
        <div className="flame-container">
          <span className="flame">🔥</span>
          {streak >= 7 && <span className="bonus-flame">🔥</span>}
          {streak >= 30 && <span className="bonus-flame">🔥</span>}
        </div>
        <div className="streak-info">
          <span className="streak-count">{streak} Day Streak!</span>
          <span className="streak-message">
            {streak === 1 && "Great start! Come back tomorrow to build your streak."}
            {streak >= 2 && streak < 7 && "Keep it up! You're building momentum."}
            {streak >= 7 && streak < 30 && "Amazing! A week of consistent practice!"}
            {streak >= 30 && "Incredible dedication! You're a true practitioner."}
          </span>
        </div>
      </div>

      <style jsx>{`
        .streak-banner {
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(234, 88, 12, 0.1));
          border: 1px solid rgba(251, 146, 60, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .streak-banner.celebrating {
          animation: celebrate 0.5s ease;
        }

        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .streak-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .flame-container {
          display: flex;
          font-size: 2rem;
        }

        .bonus-flame {
          margin-left: -0.5rem;
          animation: flicker 1s ease infinite alternate;
        }

        @keyframes flicker {
          from { opacity: 0.8; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .streak-info {
          flex: 1;
        }

        .streak-count {
          display: block;
          font-size: 1.25rem;
          font-weight: bold;
          color: #FB923C;
        }

        .streak-message {
          font-size: 0.875rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
