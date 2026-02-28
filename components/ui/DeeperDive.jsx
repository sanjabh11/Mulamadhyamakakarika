/**
 * DeeperDive Component - 5 FAQs with real-life examples
 * Right Panel component for verse exploration
 */

import React, { useState } from 'react';
import styles from './DeeperDive.module.css';

const DeeperDive = ({ questions = [], verseKey }) => {
  const [expandedQ, setExpandedQ] = useState(null);

  if (!questions || questions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.icon}>💬</span>
          <span className={styles.title}>Deeper Dive</span>
        </div>
        <p className={styles.empty}>No questions available for this verse.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>💬</span>
        <span className={styles.title}>Deeper Dive</span>
        <span className={styles.count}>{questions.length} Questions</span>
      </div>
      
      <div className={styles.faqList}>
        {questions.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.faqItem} ${expandedQ === index ? styles.expanded : ''}`}
          >
            <button 
              className={styles.question}
              onClick={() => setExpandedQ(expandedQ === index ? null : index)}
              aria-expanded={expandedQ === index}
            >
              <span className={styles.indicator}>
                {expandedQ === index ? '▼' : '▸'}
              </span>
              <span className={styles.questionText}>
                Q{index + 1}: {item.q}
              </span>
            </button>
            
            {expandedQ === index && (
              <div className={styles.answer}>
                <p className={styles.answerText}>{item.a}</p>
                
                {item.realLifeExample && (
                  <div className={styles.example}>
                    <span className={styles.exampleLabel}>💡 Real-life example:</span>
                    <p className={styles.exampleText}>{item.realLifeExample}</p>
                  </div>
                )}
                {item.deeper && (
                  <div className={styles.deeper}>
                    <span className={styles.deeperLabel}>🔬 Go deeper:</span>
                    <p className={styles.deeperText}>{item.deeper}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeeperDive;
