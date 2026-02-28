/**
 * Right Panel Component
 * 
 * Contains (per user specification - QUIZ IS HERE, NOT CENTER):
 * - Progress Widget (Level, XP, Streak, Rank)
 * - Quiz Panel
 * - Deeper Dive FAQs
 * - Certificates
 * 
 * DATA SCHEMA (aligned to /data/chapters/*.js):
 *   verseData.deeperDive[] → { q, a, realLifeExample?, deeper? }
 *   verseData.quiz         → { beginner: {question,options,correct,explanation}, intermediate: ..., advanced: ... }
 */

import React, { useState } from 'react';
import styles from './RightPanel.module.css';

export default function RightPanel({
  chapter,
  verse,
  verseData,
  collapsed,
  onToggleCollapse,
  showOnlyQuiz = false
}) {
  const [quizOpen, setQuizOpen] = useState(false); // Collapsed by default
  const [deeperDiveOpen, setDeeperDiveOpen] = useState(true);
  const [selectedTier, setSelectedTier] = useState('beginner');

  if (collapsed) {
    return (
      <div className={styles.collapsedPanel}>
        <button
          className={styles.expandButton}
          onClick={onToggleCollapse}
          title="Expand panel"
        >
          ◀
        </button>
      </div>
    );
  }

  // Mobile quiz-only mode
  if (showOnlyQuiz) {
    return (
      <div className={styles.panel}>
        <CompactQuizPanel
          verseData={verseData}
          tier={selectedTier}
          isExpanded={true}
          onToggle={() => { }}
        />
        <TierSelector
          selected={selectedTier}
          onChange={setSelectedTier}
        />
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Deeper Dive FAQs - Moved to top per new layout */}
      <section className={styles.section}>
        <button
          className={styles.collapseHeader}
          onClick={() => setDeeperDiveOpen(!deeperDiveOpen)}
        >
          <span>{deeperDiveOpen ? '▼' : '▶'}</span>
          <h3>Deeper Dive</h3>
        </button>

        {deeperDiveOpen && (
          <div className={styles.faqContent}>
            <DeeperDiveFAQs
              deeperDive={verseData?.deeperDive || []}
            />
          </div>
        )}
      </section>

      {/* Quiz Panel - Compact Accordion */}
      <section className={styles.section}>
        <TierSelector
          selected={selectedTier}
          onChange={setSelectedTier}
        />
        <CompactQuizPanel
          verseData={verseData}
          tier={selectedTier}
          isExpanded={quizOpen}
          onToggle={() => setQuizOpen(!quizOpen)}
        />
      </section>

      {/* Progress Widget - Moved below quiz */}
      <ProgressWidget />

      {/* Certificates */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>🏆 Certificates</h3>
        <CertificateWidget chapter={chapter} />
      </section>

      {/* Collapse Button */}
      <button
        className={styles.collapseButton}
        onClick={onToggleCollapse}
      >
        Collapse ▶
      </button>
    </div>
  );
}

function ProgressWidget() {
  // Mock data - will come from context/API in future
  const progress = {
    level: 12,
    xp: 3450,
    xpToNext: 450,
    streak: 7,
    versesCompleted: 32,
    totalVerses: 560,
    rank: 127
  };

  return (
    <div className={styles.progressWidget}>
      <div className={styles.levelDisplay}>
        <div className={styles.levelCircle}>
          <span className={styles.levelNumber}>{progress.level}</span>
        </div>
        <div className={styles.levelInfo}>
          <span className={styles.levelTitle}>Level {progress.level}</span>
          <span className={styles.xpText}>{progress.xp.toLocaleString()} XP</span>
        </div>
      </div>

      <div className={styles.xpBar}>
        <div
          className={styles.xpFill}
          style={{ width: `${((1000 - progress.xpToNext) / 1000) * 100}%` }}
        />
      </div>
      <p className={styles.xpRemaining}>{progress.xpToNext} XP to next level</p>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>🔥</span>
          <span className={styles.statValue}>{progress.streak}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>📚</span>
          <span className={styles.statValue}>{progress.versesCompleted}/{progress.totalVerses}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>🏅</span>
          <span className={styles.statValue}>#{progress.rank}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Quiz Panel - Accordion Style
 * 
 * DATA SCHEMA: verseData.quiz = { beginner: {...}, intermediate: {...}, advanced: {...} }
 * Each tier contains a SINGLE question object: { question, options[], correct, explanation }
 */
function CompactQuizPanel({ verseData, tier, isExpanded, onToggle }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Get quiz question for this tier from the correct schema
  const quiz = verseData?.quiz || {};
  const question = quiz[tier]; // Single question per tier
  const hasQuestion = question && question.question;

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setSelectedAnswer(null);
  };

  // Match correct answer letter (e.g. "B") to option index (e.g. "B) ...")
  const correctIndex = hasQuestion
    ? question.options.findIndex(opt => opt.trim().startsWith(question.correct + ')'))
    : -1;
  const isCorrect = selectedAnswer === correctIndex;

  return (
    <div className={styles.compactQuiz}>
      {/* Collapsed Header - Always visible */}
      <button
        className={styles.quizAccordionHeader}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className={styles.quizIcon}>📝</span>
        <span className={styles.quizTitle}>Quiz</span>
        <span className={styles.quizMeta}>
          <span className={styles.tierBadge}>{tier.toUpperCase()}</span>
        </span>
        <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={styles.quizAccordionContent}>
          {!hasQuestion ? (
            <p className={styles.quizEmpty}>No quiz for {tier} tier.</p>
          ) : (
            <>
              <p className={styles.quizQuestionCompact}>{question.question}</p>

              <div className={styles.optionsCompact}>
                {question.options.map((option, i) => (
                  <label
                    key={i}
                    className={`${styles.optionRadio} ${showResult && i === correctIndex ? styles.correctRadio : ''
                      } ${showResult && selectedAnswer === i && !isCorrect ? styles.incorrectRadio : ''}`}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      checked={selectedAnswer === i}
                      onChange={() => !showResult && setSelectedAnswer(i)}
                      disabled={showResult}
                    />
                    <span className={styles.optionText}>{option}</span>
                  </label>
                ))}
              </div>

              {!showResult ? (
                <button
                  className={styles.checkBtnCompact}
                  onClick={handleCheck}
                  disabled={selectedAnswer === null}
                >
                  Check Answer
                </button>
              ) : (
                <div className={`${styles.resultCompact} ${isCorrect ? styles.resultCorrectCompact : styles.resultIncorrectCompact}`}>
                  <p className={styles.resultTitleCompact}>{isCorrect ? '✓ Correct!' : '✗ Not quite'}</p>
                  <p className={styles.resultExplanationCompact}>{question.explanation}</p>
                  <button className={styles.nextBtnCompact} onClick={handleReset}>
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TierSelector({ selected, onChange }) {
  // Aligned to actual data tier keys: beginner, intermediate, advanced
  const tiers = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className={styles.tierSelector}>
      {tiers.map(tier => (
        <button
          key={tier}
          className={`${styles.tierButton} ${selected === tier ? styles.tierActive : ''}`}
          onClick={() => onChange(tier)}
        >
          {tier === 'beginner' ? '○' : tier === 'intermediate' ? '●' : '◉'} {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </button>
      ))}
    </div>
  );
}

/**
 * DeeperDive FAQs Component
 *
 * DATA SCHEMA: verseData.deeperDive = [{ q, a, realLifeExample?, deeper? }]
 * Items are UNIVERSAL (no tier filtering needed)
 */
function DeeperDiveFAQs({ deeperDive }) {
  const [openFaq, setOpenFaq] = useState(null);

  if (!deeperDive || deeperDive.length === 0) {
    return (
      <div className={styles.faqEmpty}>
        <p>No deeper dive content available.</p>
      </div>
    );
  }

  return (
    <div className={styles.faqList}>
      {deeperDive.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            className={styles.faqQuestion}
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
          >
            <span>{openFaq === index ? '▼' : '▶'}</span>
            Q{index + 1}: {item.q}
          </button>
          {openFaq === index && (
            <div className={styles.faqAnswer}>
              {/* Main answer */}
              <p>{item.a}</p>

              {/* Real-Life Example */}
              {item.realLifeExample && (
                <div className={styles.realLifeExample}>
                  <strong>💡 Real-Life Example</strong>
                  <p>{item.realLifeExample}</p>
                </div>
              )}

              {/* Deeper / Advanced content */}
              {item.deeper && (
                <div className={styles.deeper}>
                  <strong>📚 Advanced Insight</strong>
                  <p>{item.deeper}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificateWidget({ chapter }) {
  // Mock certificate data
  const certificates = [
    { id: 'ch1', chapter: 1, earned: true },
    { id: 'ch2', chapter: 2, earned: false },
    { id: 'ch3', chapter: 3, earned: false },
  ];

  return (
    <div className={styles.certificateWidget}>
      {certificates.map(cert => (
        <div
          key={cert.id}
          className={`${styles.certificateBadge} ${cert.earned ? styles.earned : styles.locked}`}
        >
          {cert.earned ? '✓' : '🔒'} Ch{cert.chapter}
        </div>
      ))}
    </div>
  );
}
