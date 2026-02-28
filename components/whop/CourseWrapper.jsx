/**
 * CourseWrapper - 27-Day Quantum Enlightenment Journey
 * 
 * Wraps the entire MMK content as a structured course for Whop
 * Provides daily lessons, progress tracking, and gamification
 */

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getQuizStats, isChapterQuizCompleted } from './QuizSystem';

// Course structure
const COURSE_STRUCTURE = {
  title: "27-Day Quantum Enlightenment Journey",
  subtitle: "Ancient Buddhist Wisdom Meets Modern Quantum Physics",
  description: "Explore Nāgārjuna's profound Mūlamadhyamakakārikā through interactive 3D visualizations and discover how 2,000-year-old insights align with cutting-edge quantum mechanics.",
  modules: [
    {
      id: 1,
      title: "Foundation: The Nature of Reality",
      chapters: [1, 2, 3],
      description: "Understand dependent origination, motion, and perception"
    },
    {
      id: 2,
      title: "The Building Blocks",
      chapters: [4, 5, 6, 7],
      description: "Examine aggregates, elements, desire, and arising"
    },
    {
      id: 3,
      title: "Action and Identity",
      chapters: [8, 9, 10, 11],
      description: "Explore agent-action, prior entity, fire-fuel, and limits"
    },
    {
      id: 4,
      title: "The Human Condition",
      chapters: [12, 13, 14, 15],
      description: "Investigate suffering, compounds, association, and essence"
    },
    {
      id: 5,
      title: "Liberation Path",
      chapters: [16, 17, 18, 19],
      description: "Study bondage, karma, self, and time"
    },
    {
      id: 6,
      title: "Ultimate Reality",
      chapters: [20, 21, 22, 23],
      description: "Examine causation, becoming, Tathāgata, and error"
    },
    {
      id: 7,
      title: "The Complete Path",
      chapters: [24, 25, 26, 27],
      description: "Noble truths, nirvāṇa, twelve links, and views"
    }
  ]
};

// Storage key
const PROGRESS_KEY = 'mmk_course_progress';

function getCourseProgress() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCourseProgress(progress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Main Course Wrapper Component
 */
export default function CourseWrapper({ membershipTier = 'free' }) {
  const [progress, setProgress] = useState({});
  const [quizStats, setQuizStats] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);

  // Load progress on mount
  useEffect(() => {
    setProgress(getCourseProgress());
    setQuizStats(getQuizStats());
    
    // Calculate current day based on start date
    const startDate = localStorage.getItem('mmk_course_start');
    if (startDate) {
      const days = Math.floor((Date.now() - parseInt(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      setCurrentDay(Math.min(days, 27));
    }
  }, []);

  // Start course
  const startCourse = useCallback(() => {
    localStorage.setItem('mmk_course_start', Date.now().toString());
    setCurrentDay(1);
    const newProgress = { started: true, startedAt: new Date().toISOString() };
    setProgress(newProgress);
    saveCourseProgress(newProgress);
  }, []);

  // Mark chapter as read
  const markChapterRead = useCallback((chapter) => {
    const newProgress = {
      ...progress,
      chapters: {
        ...progress.chapters,
        [chapter]: { read: true, readAt: new Date().toISOString() }
      }
    };
    setProgress(newProgress);
    saveCourseProgress(newProgress);
  }, [progress]);

  // Calculate overall progress
  const completedChapters = Object.keys(progress.chapters || {}).length;
  const totalChapters = 27;
  const overallProgress = Math.round((completedChapters / totalChapters) * 100);
  
  // Check if module is accessible based on tier
  const isModuleAccessible = (moduleId) => {
    if (membershipTier === 'enlightened') return true;
    if (membershipTier === 'seeker') return moduleId <= 5;
    return moduleId <= 2; // Free tier: modules 1-2
  };

  return (
    <div className="course-wrapper">
      {/* Course Header */}
      <header className="course-header">
        <div className="course-badge">27-DAY JOURNEY</div>
        <h1>{COURSE_STRUCTURE.title}</h1>
        <p className="subtitle">{COURSE_STRUCTURE.subtitle}</p>
        <p className="description">{COURSE_STRUCTURE.description}</p>
        
        {!progress.started ? (
          <button onClick={startCourse} className="start-btn">
            Begin Your Journey 🪷
          </button>
        ) : (
          <div className="progress-summary">
            <div className="day-indicator">
              Day {currentDay} of 27
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="progress-text">
              {completedChapters}/{totalChapters} chapters completed ({overallProgress}%)
            </div>
          </div>
        )}
      </header>

      {/* Quick Stats */}
      {quizStats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{quizStats.chaptersCompleted}</span>
            <span className="stat-label">Quizzes Passed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{quizStats.averageScore}%</span>
            <span className="stat-label">Average Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{currentDay}</span>
            <span className="stat-label">Current Day</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{27 - completedChapters}</span>
            <span className="stat-label">Chapters Left</span>
          </div>
        </div>
      )}

      {/* Module List */}
      <section className="modules-section">
        <h2>Course Modules</h2>
        
        <div className="modules-grid">
          {COURSE_STRUCTURE.modules.map((module) => {
            const accessible = isModuleAccessible(module.id);
            const moduleChaptersCompleted = module.chapters.filter(
              ch => progress.chapters?.[ch]?.read
            ).length;
            const moduleProgress = Math.round(
              (moduleChaptersCompleted / module.chapters.length) * 100
            );
            
            return (
              <div 
                key={module.id}
                className={`module-card ${!accessible ? 'locked' : ''} ${activeModule === module.id ? 'expanded' : ''}`}
                onClick={() => accessible && setActiveModule(activeModule === module.id ? null : module.id)}
              >
                <div className="module-header">
                  <div className="module-number">Module {module.id}</div>
                  {!accessible && <span className="lock-icon">🔒</span>}
                </div>
                
                <h3>{module.title}</h3>
                <p className="module-description">{module.description}</p>
                
                {accessible ? (
                  <>
                    <div className="module-progress">
                      <div className="module-progress-bar">
                        <div 
                          className="module-progress-fill"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                      <span>{moduleProgress}%</span>
                    </div>
                    
                    {activeModule === module.id && (
                      <div className="chapter-list">
                        {module.chapters.map(ch => {
                          const isRead = progress.chapters?.[ch]?.read;
                          const quizPassed = isChapterQuizCompleted(ch);
                          
                          return (
                            <Link 
                              href={`/chapter-${ch}`}
                              key={ch}
                              className={`chapter-item ${isRead ? 'completed' : ''}`}
                            >
                              <span className="chapter-status">
                                {quizPassed ? '✓' : isRead ? '○' : '·'}
                              </span>
                              <span>Chapter {ch}</span>
                              {quizPassed && <span className="quiz-badge">Quiz ✓</span>}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="upgrade-prompt">
                    <p>Upgrade to {module.id <= 5 ? 'Seeker' : 'Enlightened'} tier</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Today's Lesson */}
      {progress.started && (
        <section className="todays-lesson">
          <h2>Today's Focus</h2>
          <div className="lesson-card">
            <div className="lesson-day">Day {currentDay}</div>
            <h3>Chapter {currentDay}: {getChapterTitle(currentDay)}</h3>
            <p>Continue your journey through emptiness and interdependence.</p>
            <Link href={`/chapter-${currentDay}`} className="continue-btn">
              Continue Learning →
            </Link>
          </div>
        </section>
      )}

      {/* Membership Upsell */}
      {membershipTier === 'free' && (
        <section className="upsell-section">
          <div className="upsell-card">
            <h3>🚀 Unlock the Full Journey</h3>
            <p>Access all 27 chapters, quizzes, certificates, and community features.</p>
            <div className="tier-options">
              <div className="tier-option">
                <h4>Seeker</h4>
                <p className="price">$9.99/month</p>
                <ul>
                  <li>✓ Chapters 1-18</li>
                  <li>✓ All quizzes</li>
                  <li>✓ Certificates</li>
                </ul>
              </div>
              <div className="tier-option featured">
                <h4>Enlightened</h4>
                <p className="price">$19.99/month</p>
                <ul>
                  <li>✓ All 27 chapters</li>
                  <li>✓ Community access</li>
                  <li>✓ Live sessions</li>
                  <li>✓ Downloadable PDFs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .course-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .course-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .course-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: white;
          margin-bottom: 1rem;
        }
        
        .course-header h1 {
          font-size: 2.5rem;
          color: #e2e8f0;
          margin: 0 0 0.5rem;
        }
        
        .subtitle {
          color: #8B5CF6;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .description {
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        
        .start-btn {
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }
        
        .progress-summary {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .day-indicator {
          font-size: 1.25rem;
          color: #8B5CF6;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .progress-bar-container {
          height: 8px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          transition: width 0.5s ease;
        }
        
        .progress-text {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 3rem;
        }
        
        .stat-card {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        
        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #8B5CF6;
        }
        
        .stat-label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .modules-section h2 {
          color: #e2e8f0;
          margin-bottom: 1.5rem;
        }
        
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .module-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .module-card:hover:not(.locked) {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }
        
        .module-card.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .module-number {
          color: #8B5CF6;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .lock-icon {
          font-size: 1.25rem;
        }
        
        .module-card h3 {
          color: #e2e8f0;
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        }
        
        .module-description {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .module-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .module-progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .module-progress-fill {
          height: 100%;
          background: #8B5CF6;
          transition: width 0.3s;
        }
        
        .module-progress span {
          color: #94a3b8;
          font-size: 0.875rem;
          min-width: 40px;
        }
        
        .chapter-list {
          margin-top: 1rem;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
          padding-top: 1rem;
        }
        
        .chapter-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.2s;
        }
        
        .chapter-item:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #e2e8f0;
        }
        
        .chapter-item.completed {
          color: #10B981;
        }
        
        .chapter-status {
          font-size: 1.25rem;
        }
        
        .quiz-badge {
          margin-left: auto;
          font-size: 0.75rem;
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }
        
        .upgrade-prompt {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          text-align: center;
        }
        
        .upgrade-prompt p {
          color: #8B5CF6;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .todays-lesson {
          margin-bottom: 3rem;
        }
        
        .todays-lesson h2 {
          color: #e2e8f0;
          margin-bottom: 1rem;
        }
        
        .lesson-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 2rem;
        }
        
        .lesson-day {
          color: #8B5CF6;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .lesson-card h3 {
          color: #e2e8f0;
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
        }
        
        .lesson-card p {
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }
        
        .continue-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-weight: 600;
        }
        
        .upsell-section {
          margin-bottom: 2rem;
        }
        
        .upsell-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
        }
        
        .upsell-card h3 {
          color: #e2e8f0;
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
        }
        
        .upsell-card > p {
          color: #94a3b8;
          margin-bottom: 2rem;
        }
        
        .tier-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .tier-option {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .tier-option.featured {
          border-color: #8B5CF6;
          background: rgba(139, 92, 246, 0.1);
        }
        
        .tier-option h4 {
          color: #e2e8f0;
          margin: 0 0 0.5rem;
        }
        
        .price {
          color: #8B5CF6;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .tier-option ul {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
        }
        
        .tier-option li {
          color: #94a3b8;
          font-size: 0.875rem;
          padding: 0.25rem 0;
        }
        
        @media (max-width: 768px) {
          .course-header h1 {
            font-size: 1.75rem;
          }
          
          .modules-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Get chapter title helper
 */
function getChapterTitle(chapter) {
  const titles = {
    1: "Investigation of Conditions",
    2: "Examination of Motion",
    3: "Examination of Perception",
    4: "Examination of Aggregates",
    5: "Examination of Elements",
    6: "Examination of Desire",
    7: "Examination of Arising",
    8: "Examination of Agent and Action",
    9: "Examination of Prior Entity",
    10: "Examination of Fire and Fuel",
    11: "Examination of Limits",
    12: "Examination of Suffering",
    13: "Examination of Compounded",
    14: "Examination of Association",
    15: "Examination of Essence",
    16: "Examination of Bondage",
    17: "Examination of Karma",
    18: "Examination of Self",
    19: "Examination of Time",
    20: "Examination of Cause-Effect",
    21: "Examination of Becoming",
    22: "Examination of Tathāgata",
    23: "Examination of Error",
    24: "Examination of Noble Truths",
    25: "Examination of Nirvāṇa",
    26: "Examination of Twelve Links",
    27: "Examination of Views"
  };
  return titles[chapter] || `Chapter ${chapter}`;
}
