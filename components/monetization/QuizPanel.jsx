/**
 * Quiz Panel Component
 * 
 * Interactive quiz for verse comprehension with XP rewards
 * Design-compliant following Phase 6B/Phase 7 specifications
 */

import React, { useState } from 'react';
import DESIGN_TOKENS from '../../lib/animations/design-tokens';

export default function QuizPanel({ questions, tier = 'student', onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  // Filter questions by tier
  const tieredQuestions = questions ? questions.filter(q => q.tier === tier) : [];

  if (!tieredQuestions || tieredQuestions.length === 0) {
    return null;
  }

  const currentQuestion = tieredQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct_answer;
  const progress = ((currentQuestionIndex + 1) / tieredQuestions.length) * 100;

  const handleCheck = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);

    if (isCorrect) {
      setScore(score + 1);
      setTotalXP(totalXP + currentQuestion.xp_value);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < tieredQuestions.length - 1) {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      if (onComplete) {
        onComplete({
          score,
          total: tieredQuestions.length,
          xpEarned: totalXP,
          tier
        });
      }
    }
  };

  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <span className="quiz-tier">{tier.toUpperCase()}</span>
        <span className="quiz-progress">
          {currentQuestionIndex + 1} / {tieredQuestions.length}
        </span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-question">
        <p className="question-text">{currentQuestion.question}</p>

        {currentQuestion.type === 'mcq' && (
          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${selectedAnswer === index ? 'selected' : ''} ${showResult
                    ? index === currentQuestion.correct_answer
                      ? 'correct'
                      : selectedAnswer === index
                        ? 'incorrect'
                        : ''
                    : ''
                  }`}
                onClick={() => !showResult && setSelectedAnswer(index)}
                disabled={showResult}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {!showResult ? (
          <button
            className="quiz-submit border-beam"
            onClick={handleCheck}
            disabled={selectedAnswer === null}
          >
            Check Answer
          </button>
        ) : (
          <div className={`quiz-result ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-header">
              <span className="result-icon">{isCorrect ? '✓' : '✗'}</span>
              <span className="result-text">
                {isCorrect ? 'Correct!' : 'Not quite'}
              </span>
            </div>
            <p className="explanation">{currentQuestion.explanation}</p>
            <button className="quiz-next" onClick={handleNext}>
              {currentQuestionIndex < tieredQuestions.length - 1 ? 'Next Question →' : 'Complete Quiz'}
            </button>
          </div>
        )}
      </div>

      <div className="quiz-xp">+{currentQuestion.xp_value} XP</div>

      <style jsx>{`
        .quiz-panel {
          background: #FFFFFF;
          border: 1px solid ${DESIGN_TOKENS.colors.gray[200]};
          border-radius: ${DESIGN_TOKENS.borderRadius.md}; /* Not both border AND shadow */
          padding: ${DESIGN_TOKENS.spacing[3]}; /* 24px */
          margin-top: ${DESIGN_TOKENS.spacing[2]}; /* 16px */
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${DESIGN_TOKENS.spacing[2]};
        }

        .quiz-tier {
          background: ${DESIGN_TOKENS.colors.accent}; /* Solid accent - no gradient */
          color: #FFFFFF;
          padding: ${DESIGN_TOKENS.spacing.half} ${DESIGN_TOKENS.spacing['1.5']};
          border-radius: ${DESIGN_TOKENS.borderRadius.full};
          font-size: ${DESIGN_TOKENS.typography.fontSize.xs}; /* 14px minimum */
          font-weight: ${DESIGN_TOKENS.typography.fontWeight.semibold};
        }

        .quiz-progress {
          font-size: ${DESIGN_TOKENS.typography.fontSize.xs};
          color: ${DESIGN_TOKENS.colors.text.secondary};
        }

        .quiz-progress-bar {
          width: 100%;
          height: 4px;
          background: ${DESIGN_TOKENS.colors.gray[200]};
          border-radius: ${DESIGN_TOKENS.borderRadius.full};
          overflow: hidden;
          margin-bottom: ${DESIGN_TOKENS.spacing[3]};
        }

        .quiz-progress-fill {
          height: 100%;
          background: ${DESIGN_TOKENS.colors.accent};
          transition: width 0.3s ease;
        }

        .quiz-question {
          margin-bottom: ${DESIGN_TOKENS.spacing[2]};
        }

        .question-text {
          font-size: ${DESIGN_TOKENS.typography.fontSize.base}; /* 16px minimum */
          color: ${DESIGN_TOKENS.colors.text.primary};
          line-height: ${DESIGN_TOKENS.typography.lineHeight.relaxed};
          margin-bottom: ${DESIGN_TOKENS.spacing[2]};
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: ${DESIGN_TOKENS.spacing[1]}; /* 8px */
          margin-bottom: ${DESIGN_TOKENS.spacing[2]};
        }

        .quiz-option {
          width: 100%;
          min-height: 48px; /* Touch target compliance */
          padding: ${DESIGN_TOKENS.spacing['1.5']} ${DESIGN_TOKENS.spacing[2]};
          background: ${DESIGN_TOKENS.colors.gray[50]};
          border: 1px solid ${DESIGN_TOKENS.colors.gray[300]};
          border-radius: ${DESIGN_TOKENS.borderRadius.md};
          color: ${DESIGN_TOKENS.colors.text.primary};
          font-size: ${DESIGN_TOKENS.typography.fontSize.base}; /* 16px */
          text-align: left;
          cursor: pointer;
          transition: all ${DESIGN_TOKENS.transitions.base};
        }

        .quiz-option:hover:not(:disabled) {
          background: ${DESIGN_TOKENS.colors.gray[100]};
          border-color: ${DESIGN_TOKENS.colors.accent};
        }

        .quiz-option:focus {
          outline: 2px solid ${DESIGN_TOKENS.colors.accent};
          outline-offset: 2px;
        }

        .quiz-option.selected {
          background: ${DESIGN_TOKENS.colors.accentLight};
          border-color: ${DESIGN_TOKENS.colors.accent};
          border-width: 2px;
        }

        .quiz-option.correct {
          background: rgba(16, 185, 129, 0.1);
          border-color: ${DESIGN_TOKENS.colors.success};
          border-width: 2px;
        }

        .quiz-option.incorrect {
          background: rgba(239, 68, 68, 0.1);
          border-color: ${DESIGN_TOKENS.colors.error};
        }

        .quiz-option:disabled {
          cursor: default;
        }

        .quiz-submit,
        .quiz-next {
          width: 100%;
          min-height: 48px;
          padding: ${DESIGN_TOKENS.spacing['1.5']} ${DESIGN_TOKENS.spacing[4]};
          background: ${DESIGN_TOKENS.colors.accent}; /* Solid - no gradient */
          border: none;
          border-radius: ${DESIGN_TOKENS.borderRadius.md};
          color: #FFFFFF;
          font-size: ${DESIGN_TOKENS.typography.fontSize.base};
          font-weight: ${DESIGN_TOKENS.typography.fontWeight.semibold};
          cursor: pointer;
          transition: all ${DESIGN_TOKENS.transitions.base};
        }

        .quiz-submit:hover:not(:disabled),
        .quiz-next:hover {
          background: ${DESIGN_TOKENS.colors.accentHover}; /* 10% darker */
          box-shadow: ${DESIGN_TOKENS.shadows.md};
        }

        .quiz-submit:focus,
        .quiz-next:focus {
          outline: 2px solid ${DESIGN_TOKENS.colors.accent};
          outline-offset: 2px;
        }

        .quiz-submit:disabled {
          background: ${DESIGN_TOKENS.colors.gray[300]};
          color: ${DESIGN_TOKENS.colors.text.secondary};
          cursor: not-allowed;
          opacity: 0.6;
        }

        .quiz-result {
          padding: ${DESIGN_TOKENS.spacing[2]};
          border-radius: ${DESIGN_TOKENS.borderRadius.md};
          margin-bottom: ${DESIGN_TOKENS.spacing[2]};
        }

        .quiz-result.correct {
          background: rgba(16, 185, 129, 0.1);
          border-left: 3px solid ${DESIGN_TOKENS.colors.success};
        }

        .quiz-result.incorrect {
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid ${DESIGN_TOKENS.colors.error};
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: ${DESIGN_TOKENS.spacing[1]};
          margin-bottom: ${DESIGN_TOKENS.spacing[1]};
        }

        .result-icon {
          font-size: ${DESIGN_TOKENS.typography.fontSize.xl};
        }

        .result-text {
          font-size: ${DESIGN_TOKENS.typography.fontSize.base};
          font-weight: ${DESIGN_TOKENS.typography.fontWeight.semibold};
          color: ${DESIGN_TOKENS.colors.text.primary};
        }

        .explanation {
          font-size: ${DESIGN_TOKENS.typography.fontSize.base};
          color: ${DESIGN_TOKENS.colors.text.secondary};
          line-height: ${DESIGN_TOKENS.typography.lineHeight.relaxed};
          margin-bottom: ${DESIGN_TOKENS.spacing[2]};
        }

        .quiz-xp {
          text-align: right;
          font-size: ${DESIGN_TOKENS.typography.fontSize.xs};
          color: ${DESIGN_TOKENS.colors.accent};
          font-weight: ${DESIGN_TOKENS.typography.fontWeight.semibold};
        }
      `}</style>
    </div>
  );
}
