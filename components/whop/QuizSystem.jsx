/**
 * QuizSystem - Interactive Quiz Engine for Whop Course Alignment
 * 
 * Provides quiz functionality for each of the 27 chapters
 * Stores progress in localStorage for guest-friendly operation
 * Integrates with Whop membership tiers
 */

import React, { useState, useEffect, useCallback } from 'react';

// Import quiz questions from data file
import { CHAPTER_QUIZZES } from '../../data/quiz-questions';

// Generate placeholder quizzes for remaining chapters
for (let i = 4; i <= 27; i++) {
  if (!CHAPTER_QUIZZES[i]) {
    CHAPTER_QUIZZES[i] = {
      title: `Chapter ${i} Quiz`,
      questions: [
        {
          id: 1,
          question: `What is the main theme of Chapter ${i}?`,
          options: [
            "Inherent existence of phenomena",
            "Emptiness and interdependence",
            "Permanent self",
            "Absolute truth"
          ],
          correct: 1,
          explanation: "All chapters explore emptiness and interdependence from different angles."
        },
        {
          id: 2,
          question: "How does Nāgārjuna's analysis apply to modern physics?",
          options: [
            "It doesn't apply",
            "Quantum mechanics echoes the lack of inherent existence",
            "Classical physics proves Buddhism wrong",
            "Only Eastern physics is valid"
          ],
          correct: 1,
          explanation: "Quantum phenomena like entanglement and superposition resonate with Madhyamaka insights."
        }
      ]
    };
  }
}

/**
 * Quiz Progress Storage
 */
const STORAGE_KEY = 'mmk_quiz_progress';

function getStoredProgress() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Main Quiz Component
 */
export default function QuizSystem({ 
  chapter, 
  onComplete,
  membershipTier = 'free' 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [progress, setProgress] = useState({});

  const quiz = CHAPTER_QUIZZES[chapter];
  const questions = quiz?.questions || [];
  const question = questions[currentQuestion];

  // Load progress on mount
  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  // Check if chapter is locked for free tier
  const isLocked = membershipTier === 'free' && chapter > 5;

  // Handle answer selection
  const handleSelect = useCallback((index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  }, [showResult]);

  // Submit answer
  const handleSubmit = useCallback(() => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === question.correct;
    
    setAnswers(prev => [...prev, {
      questionId: question.id,
      selected: selectedAnswer,
      correct: question.correct,
      isCorrect
    }]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowResult(true);
  }, [selectedAnswer, question]);

  // Next question
  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      const finalScore = score + (selectedAnswer === question.correct ? 1 : 0);
      const percentage = Math.round((finalScore / questions.length) * 100);
      
      // Save progress
      const newProgress = {
        ...progress,
        [chapter]: {
          completed: true,
          score: finalScore,
          total: questions.length,
          percentage,
          completedAt: new Date().toISOString()
        }
      };
      setProgress(newProgress);
      saveProgress(newProgress);
      
      setQuizComplete(true);
      
      if (onComplete) {
        onComplete({
          chapter,
          score: finalScore,
          total: questions.length,
          percentage,
          passed: percentage >= 70
        });
      }
    }
  }, [currentQuestion, questions.length, score, selectedAnswer, question, chapter, progress, onComplete]);

  // Restart quiz
  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  }, []);

  if (!quiz) {
    return (
      <div className="quiz-error">
        <p>Quiz not available for this chapter.</p>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="quiz-locked">
        <div className="lock-icon">🔒</div>
        <h3>Premium Content</h3>
        <p>Upgrade to Seeker or Enlightened tier to access quizzes for chapters 6-27.</p>
        <button className="upgrade-btn">Upgrade Now</button>
        
        <style jsx>{`
          .quiz-locked {
            text-align: center;
            padding: 3rem 2rem;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 16px;
            border: 1px solid rgba(139, 92, 246, 0.3);
          }
          .lock-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          h3 {
            color: #e2e8f0;
            margin-bottom: 0.5rem;
          }
          p {
            color: #94a3b8;
            margin-bottom: 1.5rem;
          }
          .upgrade-btn {
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #8B5CF6, #7c3aed);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="quiz-complete">
        <div className={`result-icon ${passed ? 'passed' : 'failed'}`}>
          {passed ? '🎉' : '📚'}
        </div>
        <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
        <p className="score">
          You scored <strong>{score}/{questions.length}</strong> ({percentage}%)
        </p>
        
        {passed ? (
          <p className="message">
            You've demonstrated understanding of Chapter {chapter}: {quiz.title}
          </p>
        ) : (
          <p className="message">
            Review the chapter content and try again. You need 70% to pass.
          </p>
        )}
        
        <div className="actions">
          <button onClick={handleRestart} className="retry-btn">
            {passed ? 'Retake Quiz' : 'Try Again'}
          </button>
          {passed && (
            <button className="certificate-btn">
              View Certificate 📜
            </button>
          )}
        </div>
        
        <style jsx>{`
          .quiz-complete {
            text-align: center;
            padding: 3rem 2rem;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 16px;
            border: 1px solid rgba(139, 92, 246, 0.3);
          }
          .result-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h2 {
            color: #e2e8f0;
            margin-bottom: 0.5rem;
          }
          .score {
            font-size: 1.5rem;
            color: #e2e8f0;
            margin-bottom: 1rem;
          }
          .score strong {
            color: #8B5CF6;
          }
          .message {
            color: #94a3b8;
            margin-bottom: 2rem;
          }
          .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          .retry-btn, .certificate-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          }
          .retry-btn {
            background: rgba(139, 92, 246, 0.2);
            border: 1px solid rgba(139, 92, 246, 0.4);
            color: #e2e8f0;
          }
          .certificate-btn {
            background: linear-gradient(135deg, #8B5CF6, #7c3aed);
            border: none;
            color: white;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>
      
      {/* Question Counter */}
      <div className="question-counter">
        Question {currentQuestion + 1} of {questions.length}
      </div>
      
      {/* Question */}
      <div className="question">
        <h3>{question.question}</h3>
      </div>
      
      {/* Options */}
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedAnswer === index ? 'selected' : ''} ${
              showResult 
                ? index === question.correct 
                  ? 'correct' 
                  : selectedAnswer === index 
                    ? 'incorrect' 
                    : ''
                : ''
            }`}
            onClick={() => handleSelect(index)}
            disabled={showResult}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
      
      {/* Explanation (shown after answer) */}
      {showResult && (
        <div className={`explanation ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
          <strong>{selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
      
      {/* Actions */}
      <div className="actions">
        {!showResult ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="submit-btn"
          >
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNext} className="next-btn">
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
      
      <style jsx>{`
        .quiz-container {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        .progress-bar {
          height: 6px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          transition: width 0.3s ease;
        }
        
        .question-counter {
          text-align: center;
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        
        .question h3 {
          color: #e2e8f0;
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #e2e8f0;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .option:hover:not(:disabled) {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }
        
        .option.selected {
          background: rgba(139, 92, 246, 0.2);
          border-color: #8B5CF6;
        }
        
        .option.correct {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10B981;
        }
        
        .option.incorrect {
          background: rgba(239, 68, 68, 0.2);
          border-color: #EF4444;
        }
        
        .option-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(139, 92, 246, 0.3);
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .option-text {
          flex: 1;
        }
        
        .explanation {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        
        .explanation.correct {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10B981;
        }
        
        .explanation.incorrect {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #EF4444;
        }
        
        .explanation p {
          color: #e2e8f0;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        
        .actions {
          display: flex;
          justify-content: center;
        }
        
        .submit-btn, .next-btn {
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          color: white;
        }
        
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .next-btn {
          background: linear-gradient(135deg, #10B981, #059669);
          border: none;
          color: white;
        }
      `}</style>
    </div>
  );
}

/**
 * Get quiz progress for display
 */
export function getQuizProgress() {
  return getStoredProgress();
}

/**
 * Check if chapter quiz is completed
 */
export function isChapterQuizCompleted(chapter) {
  const progress = getStoredProgress();
  return progress[chapter]?.completed || false;
}

/**
 * Get overall quiz statistics
 */
export function getQuizStats() {
  const progress = getStoredProgress();
  const completed = Object.keys(progress).length;
  const totalScore = Object.values(progress).reduce((sum, p) => sum + (p.percentage || 0), 0);
  const averageScore = completed > 0 ? Math.round(totalScore / completed) : 0;
  
  return {
    chaptersCompleted: completed,
    totalChapters: 27,
    averageScore,
    progress
  };
}
