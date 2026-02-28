/**
 * ChapterPage - Reusable Chapter Page Template with 3D Visualizations
 * 
 * Provides consistent layout for all 27 chapters with:
 * - Chapter overview
 * - Interactive 3D visualizations for each verse
 * - Navigation between verses
 * - Mobile-responsive design
 */

import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../styles/Chapter.module.css';
import { getVerseAnimationConfig, ANIMATION_NAMES } from '../lib/verse-animation-config';
import BookmarkButton from './BookmarkButton';
import { markVerseRead, markChapterCompleted } from '../lib/user-progress';
import { track } from '../lib/analytics';

// Dynamic import of QuantumCanvas to avoid SSR issues
const QuantumCanvas = dynamic(
  () => import('./three/QuantumCanvas').then(mod => mod.default),
  { ssr: false, loading: () => <VisualizationLoading /> }
);

// Loading component
function VisualizationLoading() {
  return (
    <div className={styles.visualizationLoading}>
      <div className={styles.spinner} />
      <p>Loading 3D visualization...</p>
    </div>
  );
}

/**
 * Main ChapterPage Component
 */
export default function ChapterPage({ chapterInfo, verses }) {
  const [activeVerse, setActiveVerse] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);

  // Handle verse click
  const handleVerseClick = useCallback((verse) => {
    setActiveVerse(verse);
    setShowVisualization(true);
    markVerseRead(chapterInfo.number, verse.number);
    track('verse_viewed', { 
      chapter: chapterInfo.number, 
      verse: verse.number 
    });
  }, [chapterInfo.number]);

  // Close visualization
  const closeVisualization = useCallback(() => {
    setShowVisualization(false);
    setActiveVerse(null);
  }, []);

  // Navigate to next/prev verse
  const navigateVerse = useCallback((direction) => {
    if (!activeVerse) return;
    const currentIndex = verses.findIndex(v => v.number === activeVerse.number);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < verses.length) {
      handleVerseClick(verses[newIndex]);
    }
  }, [activeVerse, verses, handleVerseClick]);

  // Get animation config for active verse
  const animationConfig = activeVerse 
    ? getVerseAnimationConfig(chapterInfo.number, activeVerse.number, activeVerse)
    : null;

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter {chapterInfo.number}: {chapterInfo.title} - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content={`Chapter ${chapterInfo.number} of Mūlamadhyamakakārikā: ${chapterInfo.title} explored through Madhyamaka and quantum physics`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>← Home</Link>
          <h1 className={styles.title}>Chapter {chapterInfo.number}: {chapterInfo.title}</h1>
          <p className={styles.verseCount}>{chapterInfo.verseCount} verses</p>
        </header>

        {/* Chapter Overview */}
        <section className={styles.summary}>
          <div className={styles.summaryContent}>
            <h2>Chapter Overview</h2>
            <p>{chapterInfo.summary}</p>
            
            <h2>Quantum Connections</h2>
            <p>{chapterInfo.quantumSummary}</p>
          </div>
        </section>

        {/* Verse Grid */}
        <section className={styles.verseList}>
          <h2>Chapter Verses</h2>
          <p className={styles.instruction}>Click any verse to view its 3D visualization</p>
          
          <div className={styles.verses}>
            {verses.map(verse => {
              const config = getVerseAnimationConfig(chapterInfo.number, verse.number, verse);
              return (
                <div 
                  key={verse.number}
                  className={`${styles.verseCard} ${activeVerse?.number === verse.number ? styles.active : ''}`}
                  onClick={() => handleVerseClick(verse)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerseClick(verse)}
                >
                  <div className={styles.verseHeader}>
                    <div className={styles.verseNumber}>
                      {chapterInfo.number}.{verse.number}
                    </div>
                    <BookmarkButton 
                      chapter={chapterInfo.number} 
                      verse={verse.number} 
                      size="small" 
                    />
                  </div>
                  <div className={styles.verseContent}>
                    <h3>{verse.title}</h3>
                    <div className={styles.verseSummaries}>
                      <p><strong>Madhyamaka:</strong> {verse.summary || verse.madhyamaka}</p>
                      <p><strong>Quantum:</strong> {verse.quantum}</p>
                    </div>
                    <div className={styles.animationType}>
                      {ANIMATION_NAMES[config.animationType]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Visualization Modal */}
        {showVisualization && activeVerse && (
          <div className={styles.visualizationModal}>
            <div className={styles.modalBackdrop} onClick={closeVisualization} />
            <div className={styles.modalContent}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <h2>Verse {chapterInfo.number}.{activeVerse.number}: {activeVerse.title}</h2>
                <button 
                  className={styles.closeButton}
                  onClick={closeVisualization}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* 3D Visualization */}
              <div className={styles.visualizationContainer}>
                <QuantumCanvas
                  animationType={animationConfig.animationType}
                  verseConfig={{
                    chapter: chapterInfo.number,
                    verse: activeVerse.number,
                    concept: activeVerse.summary,
                    quantum: activeVerse.quantum
                  }}
                  autoRotate={true}
                  onLoad={() => console.log('Visualization loaded')}
                />
              </div>

              {/* Verse Details */}
              <div className={styles.verseDetails}>
                <div className={styles.detailSection}>
                  <h3>Madhyamaka Insight</h3>
                  <p>{activeVerse.summary || activeVerse.madhyamaka}</p>
                </div>
                <div className={styles.detailSection}>
                  <h3>Quantum Parallel</h3>
                  <p>{activeVerse.quantum}</p>
                </div>
                {activeVerse.explanation && (
                  <div className={styles.detailSection}>
                    <h3>Accessible Explanation</h3>
                    <p>{activeVerse.explanation}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className={styles.modalNavigation}>
                <button 
                  onClick={() => navigateVerse(-1)}
                  disabled={activeVerse.number === 1}
                  className={styles.navButton}
                >
                  ← Previous
                </button>
                <span className={styles.verseIndicator}>
                  {activeVerse.number} / {verses.length}
                </span>
                <button 
                  onClick={() => navigateVerse(1)}
                  disabled={activeVerse.number === verses.length}
                  className={styles.navButton}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Navigation */}
        <div className={styles.navigation}>
          {chapterInfo.number > 1 && (
            <Link href={`/chapter-${chapterInfo.number - 1}`} className={styles.navLink}>
              ← Chapter {chapterInfo.number - 1}
            </Link>
          )}
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          {chapterInfo.number < 27 && (
            <Link href={`/chapter-${chapterInfo.number + 1}`} className={styles.navLink}>
              Chapter {chapterInfo.number + 1} →
            </Link>
          )}
        </div>
      </main>

      <style jsx>{`
        .visualizationModal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modalBackdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
        }

        .modalContent {
          position: relative;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .modalHeader h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #e2e8f0;
        }

        .closeButton {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }

        .closeButton:hover {
          color: #e2e8f0;
        }

        .visualizationContainer {
          height: 400px;
          position: relative;
        }

        .verseDetails {
          padding: 1.5rem;
          display: grid;
          gap: 1rem;
        }

        .detailSection h3 {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
          color: #8B5CF6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detailSection p {
          margin: 0;
          color: #e2e8f0;
          line-height: 1.6;
        }

        .modalNavigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .navButton {
          padding: 0.5rem 1rem;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
        }

        .navButton:hover:not(:disabled) {
          background: rgba(139, 92, 246, 0.3);
        }

        .navButton:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .verseIndicator {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .modalContent {
            max-height: 95vh;
            margin: 0.5rem;
          }

          .visualizationContainer {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
