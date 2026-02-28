/**
 * ProgressDashboard - Course Progress Visualization
 * 
 * Shows user's journey progress with stats, achievements, and next steps
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getQuizStats } from './QuizSystem';

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_chapter', name: 'First Steps', description: 'Complete your first chapter', icon: '🌱', requirement: 1 },
  { id: 'five_chapters', name: 'Seeker', description: 'Complete 5 chapters', icon: '🔍', requirement: 5 },
  { id: 'ten_chapters', name: 'Student', description: 'Complete 10 chapters', icon: '📚', requirement: 10 },
  { id: 'half_journey', name: 'Halfway There', description: 'Complete 14 chapters', icon: '⚖️', requirement: 14 },
  { id: 'twenty_chapters', name: 'Scholar', description: 'Complete 20 chapters', icon: '🎓', requirement: 20 },
  { id: 'all_chapters', name: 'Enlightened', description: 'Complete all 27 chapters', icon: '🪷', requirement: 27 },
  { id: 'perfect_quiz', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '⭐', special: 'perfect_quiz' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', special: 'streak_7' },
  { id: 'all_quizzes', name: 'Quiz Master', description: 'Pass all chapter quizzes', icon: '🏆', special: 'all_quizzes' }
];

// Storage keys
const PROGRESS_KEY = 'mmk_course_progress';
const STREAK_KEY = 'mmk_streak_data';

function getStoredData(key) {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

/**
 * Main Progress Dashboard Component
 */
export default function ProgressDashboard() {
  const [progress, setProgress] = useState({});
  const [quizStats, setQuizStats] = useState(null);
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  useEffect(() => {
    // Load all progress data
    setProgress(getStoredData(PROGRESS_KEY));
    setQuizStats(getQuizStats());
    setStreak(getStoredData(STREAK_KEY));
    
    // Calculate unlocked achievements
    const stats = getQuizStats();
    const progressData = getStoredData(PROGRESS_KEY);
    const streakData = getStoredData(STREAK_KEY);
    
    const unlocked = ACHIEVEMENTS.filter(achievement => {
      if (achievement.requirement) {
        const completed = Object.keys(progressData.chapters || {}).length;
        return completed >= achievement.requirement;
      }
      if (achievement.special === 'perfect_quiz') {
        return Object.values(stats.progress || {}).some(p => p.percentage === 100);
      }
      if (achievement.special === 'streak_7') {
        return (streakData.current || 0) >= 7;
      }
      if (achievement.special === 'all_quizzes') {
        return stats.chaptersCompleted >= 27;
      }
      return false;
    });
    
    setUnlockedAchievements(unlocked);
  }, []);

  const completedChapters = Object.keys(progress.chapters || {}).length;
  const overallProgress = Math.round((completedChapters / 27) * 100);

  // Calculate time spent (rough estimate)
  const estimatedHours = Math.round(completedChapters * 0.5);

  return (
    <div className="progress-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Your Journey</h1>
        <p>Track your progress through the Mūlamadhyamakakārikā</p>
      </header>

      {/* Main Stats */}
      <div className="main-stats">
        <div className="stat-circle">
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(139, 92, 246, 0.2)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${overallProgress * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="stat-circle-content">
            <span className="percentage">{overallProgress}%</span>
            <span className="label">Complete</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="value">{completedChapters}</span>
            <span className="label">Chapters</span>
          </div>
          <div className="stat-item">
            <span className="value">{quizStats?.chaptersCompleted || 0}</span>
            <span className="label">Quizzes Passed</span>
          </div>
          <div className="stat-item">
            <span className="value">{quizStats?.averageScore || 0}%</span>
            <span className="label">Avg Score</span>
          </div>
          <div className="stat-item">
            <span className="value">{streak.current || 0}</span>
            <span className="label">Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Chapter Progress Grid */}
      <section className="chapter-grid-section">
        <h2>Chapter Progress</h2>
        <div className="chapter-grid">
          {Array.from({ length: 27 }, (_, i) => i + 1).map(ch => {
            const isCompleted = progress.chapters?.[ch]?.read;
            const quizPassed = quizStats?.progress?.[ch]?.completed;
            
            return (
              <Link 
                href={`/chapter-${ch}`}
                key={ch}
                className={`chapter-cell ${isCompleted ? 'completed' : ''} ${quizPassed ? 'quiz-passed' : ''}`}
                title={`Chapter ${ch}`}
              >
                {ch}
                {quizPassed && <span className="check">✓</span>}
              </Link>
            );
          })}
        </div>
        <div className="legend">
          <span><span className="dot empty"></span> Not started</span>
          <span><span className="dot completed"></span> Read</span>
          <span><span className="dot quiz"></span> Quiz passed</span>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
            
            return (
              <div 
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
                {isUnlocked && <span className="unlocked-badge">✓</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Next Steps */}
      <section className="next-steps">
        <h2>Continue Your Journey</h2>
        <div className="next-actions">
          {completedChapters < 27 && (
            <Link href={`/chapter-${completedChapters + 1}`} className="action-card primary">
              <span className="action-icon">📖</span>
              <div>
                <h4>Next Chapter</h4>
                <p>Chapter {completedChapters + 1}</p>
              </div>
            </Link>
          )}
          
          {quizStats && quizStats.chaptersCompleted < completedChapters && (
            <Link 
              href={`/chapter-${Object.keys(progress.chapters || {}).find(ch => !quizStats.progress?.[ch]?.completed) || 1}`}
              className="action-card"
            >
              <span className="action-icon">📝</span>
              <div>
                <h4>Take a Quiz</h4>
                <p>Test your understanding</p>
              </div>
            </Link>
          )}
          
          <Link href="/course" className="action-card">
            <span className="action-icon">🗺️</span>
            <div>
              <h4>Course Overview</h4>
              <p>View full curriculum</p>
            </div>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .progress-dashboard {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .dashboard-header h1 {
          color: #e2e8f0;
          font-size: 2rem;
          margin: 0 0 0.5rem;
        }
        
        .dashboard-header p {
          color: #94a3b8;
        }
        
        .main-stats {
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .stat-circle {
          position: relative;
          width: 150px;
          height: 150px;
        }
        
        .stat-circle svg {
          width: 100%;
          height: 100%;
        }
        
        .stat-circle-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .percentage {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #8B5CF6;
        }
        
        .stat-circle-content .label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-item .value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        
        .stat-item .label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .chapter-grid-section {
          margin-bottom: 3rem;
        }
        
        .chapter-grid-section h2 {
          color: #e2e8f0;
          margin-bottom: 1rem;
        }
        
        .chapter-grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .chapter-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #64748b;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          position: relative;
          transition: all 0.2s;
        }
        
        .chapter-cell:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
          color: #e2e8f0;
        }
        
        .chapter-cell.completed {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
          color: #8B5CF6;
        }
        
        .chapter-cell.quiz-passed {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.4);
          color: #10B981;
        }
        
        .chapter-cell .check {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 0.6rem;
        }
        
        .legend {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          color: #94a3b8;
          font-size: 0.8rem;
        }
        
        .legend span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 4px;
        }
        
        .dot.empty {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .dot.completed {
          background: rgba(139, 92, 246, 0.3);
          border: 1px solid #8B5CF6;
        }
        
        .dot.quiz {
          background: rgba(16, 185, 129, 0.3);
          border: 1px solid #10B981;
        }
        
        .achievements-section {
          margin-bottom: 3rem;
        }
        
        .achievements-section h2 {
          color: #e2e8f0;
          margin-bottom: 1rem;
        }
        
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .achievement-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
        }
        
        .achievement-card.locked {
          opacity: 0.5;
        }
        
        .achievement-card.unlocked {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }
        
        .achievement-icon {
          font-size: 2rem;
        }
        
        .achievement-info h4 {
          color: #e2e8f0;
          font-size: 0.9rem;
          margin: 0 0 0.25rem;
        }
        
        .achievement-info p {
          color: #94a3b8;
          font-size: 0.75rem;
          margin: 0;
        }
        
        .unlocked-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          color: #10B981;
          font-size: 0.875rem;
        }
        
        .next-steps h2 {
          color: #e2e8f0;
          margin-bottom: 1rem;
        }
        
        .next-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .action-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .action-card:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
        }
        
        .action-card.primary {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1));
          border-color: rgba(139, 92, 246, 0.4);
        }
        
        .action-icon {
          font-size: 1.5rem;
        }
        
        .action-card h4 {
          color: #e2e8f0;
          font-size: 0.9rem;
          margin: 0 0 0.25rem;
        }
        
        .action-card p {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0;
        }
        
        @media (max-width: 600px) {
          .chapter-grid {
            grid-template-columns: repeat(5, 1fr);
          }
          
          .main-stats {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
