import React, { useState, useEffect } from 'react';
import styles from '../styles/VerseDisplay.module.css';
import FalAnimation from './FalAnimation';

const VerseDisplay = ({ 
  chapter, 
  verse, 
  title, 
  verseText, 
  madhyamakaConcept, 
  quantumPhysicsParallel, 
  analysis, 
  animationPrompt 
}) => {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle animation loading
  const handleAnimationLoad = () => {
    setIsAnimationLoaded(true);
  };

  // Toggle explanation visibility
  const toggleExplanation = () => {
    setIsExplanationVisible(!isExplanationVisible);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Verse {chapter}.{verse}</h1>
        {title && <h2 className={styles.subtitle}>{title}</h2>}
      </div>
      
      {/* Animation Container */}
      <div className={styles.animationContainer}>
        <FalAnimation 
          prompt={animationPrompt} 
          onLoad={handleAnimationLoad}
          chapter={chapter}
          verse={verse}
        />

        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <button 
            className={styles.controlButton}
            onClick={toggleExplanation}
            aria-label={isExplanationVisible ? "Hide explanation" : "Show explanation"}
          >
            {isExplanationVisible ? 'Hide Explanation' : 'Show Explanation'}
          </button>
        </div>
      </div>
      
      {/* Explanation Section */}
      {isExplanationVisible && (
        <div className={styles.explanationContainer}>
          <h2>Nāgārjuna's Insight & Quantum Connection</h2>
          <div className={styles.explanationContent}>
            <div className={styles.verseText}>
              <h3>Verse Text:</h3>
              <p>{verseText}</p>
            </div>
            
            <div className={styles.concept}>
              <h3>Madhyamaka Concept:</h3>
              <p>{madhyamakaConcept}</p>
            </div>
            
            <div className={styles.quantum}>
              <h3>Quantum Physics Parallel:</h3>
              <p>{quantumPhysicsParallel}</p>
            </div>
            
            <div className={styles.analysis}>
              <h3>Analysis:</h3>
              <p>{analysis}</p>
            </div>
            
            <div className={styles.animationPrompt}>
              <h3>3D Animation Description:</h3>
              <p>{animationPrompt}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile-specific Controls */}
      {isMobile && (
        <div className={styles.mobileControls}>
          <button 
            className={styles.mobileButton}
            onClick={toggleExplanation}
            aria-label={isExplanationVisible ? "Hide explanation" : "Show explanation"}
          >
            {isExplanationVisible ? 'Hide Explanation' : 'Show Explanation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VerseDisplay; 