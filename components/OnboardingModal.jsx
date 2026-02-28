"use client";

/**
 * Onboarding Modal Component
 * CRITICAL: First-time user experience for conversion
 * 
 * Features:
 * - Welcome message
 * - Quick tour of features
 * - Goal setting
 * - Email capture for non-auth users
 */

import React, { useState, useEffect } from 'react';
import { getProgress, saveProgress } from '../lib/user-progress';
import { track, EVENTS } from '../lib/analytics';
import { useUser } from '../contexts/UserContext';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome, Seeker',
    content: 'Explore the profound connections between Nāgārjuna\'s Mūlamadhyamakakārikā and quantum physics through interactive 3D visualizations.',
    icon: '🕉️'
  },
  {
    id: 'features',
    title: 'What You\'ll Discover',
    content: 'Experience 27 chapters of Buddhist philosophy paired with quantum physics concepts, brought to life through AI-generated animations.',
    icon: '✨',
    features: [
      '400+ verses with quantum parallels',
      'Interactive 3D visualizations',
      'Meditation timer for contemplation',
      'Track your progress & streaks'
    ]
  },
  {
    id: 'goal',
    title: 'Set Your Intention',
    content: 'What brings you here today?',
    icon: '🎯',
    options: [
      { id: 'learn', label: 'Learn Buddhist philosophy', icon: '📚' },
      { id: 'quantum', label: 'Understand quantum physics', icon: '⚛️' },
      { id: 'meditate', label: 'Deepen my meditation practice', icon: '🧘' },
      { id: 'explore', label: 'Just exploring', icon: '🔍' }
    ]
  },
  {
    id: 'start',
    title: 'Begin Your Journey',
    content: 'Ready to explore the nature of reality?',
    icon: '🚀'
  }
];

export default function OnboardingModal({ onComplete }) {
  const { user, login, isAuthenticated } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if user has completed onboarding
    const progress = getProgress(user?.id);
    if (!progress.onboardingCompleted) {
      setIsOpen(true);
      track(EVENTS.SESSION_START, { type: 'onboarding_shown' });
    }
  }, [user?.id]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      track('onboarding_step', { step: currentStep + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
    track('onboarding_goal_selected', { goal: goalId });
  };

  const completeOnboarding = () => {
    const progress = getProgress(user?.id);
    progress.onboardingCompleted = true;
    progress.selectedGoal = selectedGoal;
    progress.onboardingCompletedAt = new Date().toISOString();
    saveProgress(progress, user?.id);

    track('onboarding_completed', {
      goal: selectedGoal,
      authenticated: isAuthenticated
    });

    setIsOpen(false);
    if (onComplete) onComplete({ goal: selectedGoal });
  };

  const handleSkip = () => {
    track('onboarding_skipped', { step: currentStep });
    completeOnboarding();
  };

  if (!isOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        {/* Progress dots */}
        <div className="progress-dots">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Skip button */}
        <button className="skip-btn" onClick={handleSkip}>
          Skip
        </button>

        {/* Content */}
        <div className="step-content">
          <div className="step-icon">{step.icon}</div>
          <h2>{step.title}</h2>
          <p>{step.content}</p>

          {/* Features list */}
          {step.features && (
            <ul className="features-list">
              {step.features.map((feature, i) => (
                <li key={i}>
                  <span className="check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Goal options */}
          {step.options && (
            <div className="options-grid">
              {step.options.map(option => (
                <button
                  key={option.id}
                  className={`option-btn ${selectedGoal === option.id ? 'selected' : ''}`}
                  onClick={() => handleGoalSelect(option.id)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Final step CTA */}
          {step.id === 'start' && (
            <div className="final-cta">
              {!isAuthenticated && (
                <div className="auth-prompt">
                  <p>Sign in to save your progress across devices</p>
                  <button className="auth-btn" onClick={login}>
                    Sign in with Whop
                  </button>
                  <span className="or-divider">or continue as guest</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="nav-buttons">
          {currentStep > 0 && (
            <button className="nav-btn prev" onClick={handlePrev}>
              ← Back
            </button>
          )}
          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={step.options && !selectedGoal}
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Start Exploring' : 'Continue'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .onboarding-modal {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          position: relative;
          border: 1px solid rgba(139, 92, 246, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .progress-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.3);
          transition: all 0.3s;
        }

        .dot.active {
          background: #8B5CF6;
          transform: scale(1.2);
        }

        .dot.completed {
          background: #10B981;
        }

        .skip-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .skip-btn:hover {
          color: #e2e8f0;
        }

        .step-content {
          text-align: center;
          margin-bottom: 2rem;
        }

        .step-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .step-content h2 {
          color: #e2e8f0;
          margin: 0 0 0.75rem;
          font-size: 1.75rem;
        }

        .step-content p {
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0 0;
          text-align: left;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: #e2e8f0;
        }

        .check {
          color: #10B981;
          font-weight: bold;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .option-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #e2e8f0;
        }

        .option-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .option-btn.selected {
          background: rgba(139, 92, 246, 0.2);
          border-color: #8B5CF6;
        }

        .option-icon {
          font-size: 1.5rem;
        }

        .option-label {
          font-size: 0.875rem;
          text-align: center;
        }

        .final-cta {
          margin-top: 1.5rem;
        }

        .auth-prompt {
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
        }

        .auth-prompt p {
          margin: 0 0 1rem;
          font-size: 0.875rem;
        }

        .auth-btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          background: #8B5CF6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 0.75rem;
        }

        .or-divider {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .nav-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .nav-btn {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn.prev {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #94a3b8;
        }

        .nav-btn.prev:hover {
          border-color: #8B5CF6;
          color: #e2e8f0;
        }

        .nav-btn.next {
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          color: white;
        }

        .nav-btn.next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .onboarding-modal {
            padding: 1.5rem;
          }

          .step-icon {
            font-size: 3rem;
          }

          .step-content h2 {
            font-size: 1.5rem;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
