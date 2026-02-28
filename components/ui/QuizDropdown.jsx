/**
 * QuizDropdown Component - Tiered quiz with dropdown selector
 * Right Panel component below Deeper Dive
 */

import React, { useState } from 'react';
import styles from './QuizDropdown.module.css';

const QuizDropdown = ({ quiz = {}, onAnswer, verseKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('beginner');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const tiers = ['beginner', 'intermediate', 'advanced'];
  const tierLabels = {
    beginner: '○ Beginner',
    intermediate: '● Intermediate', 
    advanced: '◆ Advanced'
  };

  const currentQuestion = quiz[selectedTier];

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (onAnswer) {
      onAnswer({
        tier: selectedTier,
        selected: selectedAnswer,
        correct: currentQuestion?.correct === String.fromCharCode(65 + selectedAnswer),
        xp: currentQuestion?.correct === String.fromCharCode(65 + selectedAnswer) ? getXP(selectedTier) : 0
      });
    }
  };

  const getXP = (tier) => {
    const xpMap = { beginner: 15, intermediate: 25, advanced: 40 };
    return xpMap[tier] || 15;
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    resetQuiz();
  };

  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <button 
          className={styles.header}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.icon}>📝</span>
          <span className={styles.title}>Quiz</span>
          <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className={styles.content}>
            <p className={styles.empty}>No quiz available for this verse.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.icon}>📝</span>
        <span className={styles.title}>Quiz</span>
        <span className={styles.tierBadge}>{selectedTier}</span>
        <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className={styles.content}>
          <div className={styles.tierSelector}>
            <label className={styles.tierLabel}>Difficulty:</label>
            <select 
              value={selectedTier}
              onChange={(e) => handleTierChange(e.target.value)}
              className={styles.tierSelect}
            >
              {tiers.map(tier => (
                <option key={tier} value={tier}>{tierLabels[tier]}</option>
              ))}
            </select>
          </div>

          <div className={styles.questionBox}>
            <p className={styles.questionText}>{currentQuestion.question}</p>
            
            <div className={styles.options}>
              {currentQuestion.options.map((option, index) => {
                const isCorrect = currentQuestion.correct === String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === index;
                
                let optionClass = styles.option;
                if (showResult) {
                  if (isCorrect) optionClass += ` ${styles.correct}`;
                  else if (isSelected) optionClass += ` ${styles.incorrect}`;
                } else if (isSelected) {
                  optionClass += ` ${styles.selected}`;
                }

                return (
                  <button
                    key={index}
                    className={optionClass}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                  >
                    <span className={styles.optionMarker}>
                      {isSelected ? '●' : '○'}
                    </span>
                    <span className={styles.optionText}>{option}</span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`${styles.result} ${currentQuestion.correct === String.fromCharCode(65 + selectedAnswer) ? styles.success : styles.failure}`}>
                <p className={styles.resultText}>
                  {currentQuestion.correct === String.fromCharCode(65 + selectedAnswer) 
                    ? `✓ Correct! +${getXP(selectedTier)} XP`
                    : `✗ The correct answer is ${currentQuestion.correct}`
                  }
                </p>
                <p className={styles.explanation}>{currentQuestion.explanation}</p>
              </div>
            )}

            <div className={styles.actions}>
              {!showResult ? (
                <button 
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </button>
              ) : (
                <button 
                  className={styles.resetBtn}
                  onClick={resetQuiz}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDropdown;
