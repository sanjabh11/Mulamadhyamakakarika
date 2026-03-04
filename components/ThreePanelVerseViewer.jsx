/**
 * ThreePanelVerseViewer - Main 3-panel layout component
 * 
 * Layout: Left Panel (20%) | 3D Canvas (60%) | Right Panel (20%)
 * 
 * Left Panel: Verse Text + Explanation + Controls
 * Center: 3D Animation with overlay controls
 * Right Panel: Deeper Dive (5 FAQs) + Quiz Dropdown
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styles from './ThreePanelVerseViewer.module.css';

import CollapsiblePanel from './ui/CollapsiblePanel';
import DeeperDive from './ui/DeeperDive';
import QuizDropdown from './ui/QuizDropdown';
import AnimationControls from './ui/AnimationControls';
import { getVerseAnimationConfig, ANIMATION_NAMES } from '../lib/verse-animation-config';

class ViewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ThreePanelVerseViewer error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#F9FAFB',
          color: '#111827', padding: '2rem', textAlign: 'center'
        }}>
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
          <h2 style={{ margin: '0 0 0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#6B7280', maxWidth: '400px' }}>
            This verse could not be displayed. Try refreshing the page or navigating to a different verse.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '1rem' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem', padding: '0.5rem 1.5rem',
              background: '#8B5CF6', color: 'white', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Use ProgressiveQuantumCanvas for instant static visualization
// This shows Canvas 2D immediately, then upgrades to WebGL 3D
const ProgressiveQuantumCanvas = dynamic(
  () => import('./ProgressiveQuantumCanvas'),
  { ssr: false }
);

const ThreePanelVerseViewer = ({
  chapter,
  verse,
  verseData,
  chapterTitle = 'Investigation of Conditions',
  totalVerses = 7
}) => {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animControls, setAnimControls] = useState({ rotation: true, speed: 50, complexity: 50, zoom: 100, accentColor: '#8B5CF6' });
  const animationConfig = useMemo(() => {
    if (!chapter || !verse) return null;
    return getVerseAnimationConfig(
      parseInt(chapter), parseInt(verse),
      {
        quantum: verseData?.philosophy?.quantum || verseData?.quantumPhysicsParallel || '',
        resonanceConcept: verseData?.quantumResonance?.concept || '',
      }
    );
  }, [chapter, verse, verseData]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFullscreen = useCallback(() => {
    const canvas = document.querySelector(`.${styles.canvasContainer}`);
    if (!canvas) return;

    if (!document.fullscreenElement) {
      canvas.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const handleControlChange = useCallback((controls) => {
    setAnimControls(prev => ({ ...prev, ...controls }));
  }, []);

  const handleQuizAnswer = useCallback((result) => {
    console.log('Quiz answer:', result);
  }, []);

  const verseNavigation = Array.from({ length: totalVerses }, (_, i) => i + 1);

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.mobileTitle}>
            Chapter {chapter} · {chapterTitle}
          </h1>
          <div className={styles.verseNavMobile}>
            {verseNavigation.map(v => (
              <a
                key={v}
                href={`/verse/${chapter}-${v}`}
                className={`${styles.verseNavItem} ${parseInt(verse) === v ? styles.active : ''}`}
              >
                {v}
              </a>
            ))}
          </div>
        </header>

        <div className={styles.mobileCanvas}>
          <ProgressiveQuantumCanvas
            animationType={animationConfig?.animationType}
            chapter={chapter}
            verseData={verseData}
            autoRotate={animControls.rotation}
          />
          <div className={styles.canvasOverlay}>
            <button className={styles.helpBtn} title="Help">?</button>
            <button className={styles.fullscreenBtn} onClick={handleFullscreen}>⛶</button>
          </div>
        </div>

        <div className={styles.mobileTabs}>
          {['canvas', 'verse', 'explain', 'faq', 'quiz'].map(tab => (
            <button
              key={tab}
              className={`${styles.mobileTab} ${mobileTab === tab ? styles.active : ''}`}
              onClick={() => setMobileTab(tab)}
            >
              {tab === 'canvas' && '🎬'}
              {tab === 'verse' && '📜'}
              {tab === 'explain' && '💡'}
              {tab === 'faq' && '💬'}
              {tab === 'quiz' && '📝'}
            </button>
          ))}
        </div>

        <div className={styles.mobileContent}>
          {mobileTab === 'verse' && (
            <div className={styles.mobileSection}>
              <h3>Verse {chapter}.{verse}</h3>
              {verseData?.sanskrit && (
                <p className={styles.sanskrit}>{verseData.sanskrit.text}</p>
              )}
              <p>{verseData?.sanskrit?.translation || verseData?.verseText}</p>
            </div>
          )}
          {mobileTab === 'explain' && (
            <div className={styles.mobileSection}>
              {verseData?.philosophy?.insight && (
                <>
                  <h4>Key Insight</h4>
                  <p>{verseData.philosophy.insight}</p>
                </>
              )}
              <h4>Madhyamaka</h4>
              <p>{verseData?.philosophy?.madhyamaka || verseData?.madhyamakaConcept}</p>
              <h4>Quantum Parallel</h4>
              <p>{verseData?.philosophy?.quantum || verseData?.quantumPhysicsParallel}</p>
              <h4>Bridge</h4>
              <p>{verseData?.philosophy?.bridge}</p>
              {verseData?.philosophy?.accessible && (
                <>
                  <h4>Accessible</h4>
                  <p>{verseData.philosophy.accessible}</p>
                </>
              )}
              {verseData?.philosophy?.twoTruths && (
                <div className={styles.twoTruthsItem}>
                  <h4>Two Truths</h4>
                  <p>{verseData.philosophy.twoTruths}</p>
                </div>
              )}
              {verseData?.philosophy?.commonMisconception && (
                <div className={styles.misconceptionItem}>
                  <h4>Common Misconception</h4>
                  <p>{verseData.philosophy.commonMisconception}</p>
                </div>
              )}
              {verseData?.quantumResonance && (
                <div style={{ marginTop: '12px' }}>
                  <h4>Quantum Resonance</h4>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>{verseData.quantumResonance.concept}</p>
                  <span className={`${styles.resonanceBadge} ${verseData.quantumResonance.score >= 85 ? styles.resonanceHigh :
                    verseData.quantumResonance.score >= 70 ? styles.resonanceMedium :
                      styles.resonanceLow
                    }`}>
                    {verseData.quantumResonance.strength || 'Medium'} ({verseData.quantumResonance.score}/100)
                  </span>
                  {verseData.quantumResonance.explanation && (
                    <p style={{ marginTop: '8px' }}>{verseData.quantumResonance.explanation}</p>
                  )}
                  {verseData.quantumResonance.caveat && (
                    <p style={{ fontStyle: 'italic', color: '#6B7280', marginTop: '4px', fontSize: '13px' }}>{verseData.quantumResonance.caveat}</p>
                  )}
                </div>
              )}
            </div>
          )}
          {mobileTab === 'faq' && (
            <DeeperDive questions={verseData?.deeperDive} verseKey={`${chapter}.${verse}`} />
          )}
          {mobileTab === 'quiz' && (
            <QuizDropdown quiz={verseData?.quiz} onAnswer={handleQuizAnswer} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.chapterNav}>
            <a href="/" className={styles.homeBtn} title="Home">🏠</a>
            {parseInt(chapter) > 1 && (
              <a href={`/verse/${parseInt(chapter) - 1}-1`} className={styles.prevChapterBtn} title={`Previous Chapter (${parseInt(chapter) - 1})`}>◀ Ch {parseInt(chapter) - 1}</a>
            )}
            {parseInt(chapter) < 27 && (
              <a href={`/verse/${parseInt(chapter) + 1}-1`} className={styles.nextChapterBtn} title={`Next Chapter (${parseInt(chapter) + 1})`}>Ch {parseInt(chapter) + 1} ▶</a>
            )}
          </div>
          <h1 className={styles.chapterTitle}>
            Chapter {chapter} · {chapterTitle}
          </h1>
          {verseData?.title && verseData.title !== `Verse ${verse}` && (
            <p className={styles.verseTitle}>Verse {verse}: {verseData.title}</p>
          )}
        </div>
        <div className={styles.verseNav}>
          {verseNavigation.map(v => (
            <a
              key={v}
              href={`/verse/${chapter}-${v}`}
              className={`${styles.verseNavItem} ${parseInt(verse) === v ? styles.active : ''}`}
            >
              {v}
            </a>
          ))}
        </div>
        <div className={styles.headerRight}>
          <span className={styles.streak}>🔥 7-day</span>
          <span className={styles.xp}>⭐ 1,250 XP</span>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={`${styles.leftPanel} ${leftPanelCollapsed ? styles.collapsed : ''}`}>
          <button
            className={styles.collapseBtn}
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            aria-label={leftPanelCollapsed ? 'Expand left panel' : 'Collapse left panel'}
          >
            {leftPanelCollapsed ? '▶' : '◀'}
          </button>

          {!leftPanelCollapsed && (
            <div className={styles.panelContent}>
              {verseData?.philosophy?.insight && (
                <div className={styles.insightSummary}>
                  <span className={styles.insightIcon}>💡</span>
                  <p>{verseData.philosophy.insight}</p>
                </div>
              )}

              <CollapsiblePanel title="Verse Text" icon="📜" defaultOpen={true}>
                <div className={styles.verseTextSection}>
                  {verseData?.sanskrit && (
                    <p className={styles.sanskrit}>{verseData.sanskrit.text}</p>
                  )}
                  {verseData?.sanskrit?.transliteration && (
                    <p className={styles.transliteration}>{verseData.sanskrit.transliteration}</p>
                  )}
                  <p className={styles.translation}>
                    {verseData?.sanskrit?.translation || verseData?.verseText}
                  </p>
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Philosophy" icon="🧘" defaultOpen={false}>
                <div className={styles.explanationSection}>
                  <div className={styles.explanationItem}>
                    <h4>Madhyamaka</h4>
                    <p>{verseData?.philosophy?.madhyamaka || verseData?.madhyamakaConcept}</p>
                  </div>
                  <div className={styles.explanationItem}>
                    <h4>Quantum Parallel</h4>
                    <p>{verseData?.philosophy?.quantum || verseData?.quantumPhysicsParallel}</p>
                  </div>
                  {verseData?.philosophy?.accessible && (
                    <div className={styles.explanationItem}>
                      <h4>Accessible</h4>
                      <p>{verseData.philosophy.accessible}</p>
                    </div>
                  )}
                </div>
              </CollapsiblePanel>

              {(verseData?.philosophy?.bridge || verseData?.quantumResonance) && (
                <CollapsiblePanel title="Quantum Bridge" icon="⚛️" defaultOpen={false}>
                  <div className={styles.explanationSection}>
                    {verseData?.philosophy?.bridge && (
                      <div className={styles.explanationItem}>
                        <h4>Bridge</h4>
                        <p>{verseData.philosophy.bridge}</p>
                      </div>
                    )}
                    {verseData?.quantumResonance && (
                      <>
                        <div className={styles.resonanceCard}>
                          <h4>{verseData.quantumResonance.concept}</h4>
                          <span className={`${styles.resonanceBadge} ${verseData.quantumResonance.score >= 85 ? styles.resonanceHigh :
                            verseData.quantumResonance.score >= 70 ? styles.resonanceMedium :
                              styles.resonanceLow
                            }`}>
                            {verseData.quantumResonance.strength || 'Medium'} ({verseData.quantumResonance.score}/100)
                          </span>
                          {verseData.quantumResonance.explanation && (
                            <p className={styles.resonanceExplanation}>{verseData.quantumResonance.explanation}</p>
                          )}
                          {verseData.quantumResonance.caveat && (
                            <p className={styles.resonanceCaveat}>{verseData.quantumResonance.caveat}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CollapsiblePanel>
              )}

              {(verseData?.philosophy?.twoTruths || verseData?.philosophy?.commonMisconception) && (
                <CollapsiblePanel title="Two Truths & Misconceptions" icon="⚖️" defaultOpen={false}>
                  <div className={styles.explanationSection}>
                    {verseData?.philosophy?.twoTruths && (
                      <div className={styles.twoTruthsItem}>
                        <h4>Two Truths</h4>
                        <p>{verseData.philosophy.twoTruths}</p>
                      </div>
                    )}
                    {verseData?.philosophy?.commonMisconception && (
                      <div className={styles.misconceptionItem}>
                        <h4>Common Misconception</h4>
                        <p>{verseData.philosophy.commonMisconception}</p>
                      </div>
                    )}
                  </div>
                </CollapsiblePanel>
              )}

              <CollapsiblePanel title="Animation Controls" icon="🎮" defaultOpen={false}>
                <AnimationControls
                  config={verseData?.animation?.controls}
                  onControlChange={handleControlChange}
                  onReset={() => setAnimControls({ rotation: true, speed: 50, complexity: 50, zoom: 100, accentColor: '#8B5CF6' })}
                  onFullscreen={handleFullscreen}
                />
              </CollapsiblePanel>
            </div>
          )}
        </aside>

        <section className={styles.canvasSection}>
          <div className={styles.canvasContainer}>
            <ProgressiveQuantumCanvas
              animationType={animationConfig?.animationType}
              chapter={chapter}
              verseData={verseData}
              autoRotate={animControls.rotation}
            />

            <div className={styles.canvasOverlay}>
              <button className={styles.helpBtn} title="Help">?</button>
              <button className={styles.fullscreenBtn} onClick={handleFullscreen} title="Fullscreen">
                ⛶
              </button>
            </div>

            <div className={styles.canvasFooter}>
              <span className={styles.animationLabel}>
                ⚛ {ANIMATION_NAMES[animationConfig?.animationType] || animationConfig?.animationType || 'Loading...'}
              </span>
              <span className={styles.canvasHint}>
                Drag to rotate · Scroll to zoom
              </span>
            </div>
          </div>

          {verseData?.animation?.visualBridge && (
            <div className={styles.visualBridge}>
              <h4>Visual Bridge</h4>
              <p>{verseData.animation.visualBridge}</p>
              {verseData.animation.educationalGoal && (
                <p className={styles.educationalGoal}>{verseData.animation.educationalGoal}</p>
              )}
            </div>
          )}

          {verseData?.animation?.interaction && (
            <div className={styles.interactionButtons}>
              {Object.entries(verseData.animation.interaction).map(([key, value]) => {
                // Only render string values, skip objects
                if (typeof value !== 'string') return null;
                return (
                  <button key={key} className={styles.interactionBtn}>
                    {key === 'click' && '🎯'}
                    {key === 'drag' && '🔄'}
                    {key === 'hover' && '💡'}
                    <span>{value}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className={`${styles.rightPanel} ${rightPanelCollapsed ? styles.collapsed : ''}`}>
          <button
            className={styles.collapseBtn}
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            aria-label={rightPanelCollapsed ? 'Expand right panel' : 'Collapse right panel'}
          >
            {rightPanelCollapsed ? '◀' : '▶'}
          </button>

          {!rightPanelCollapsed && (
            <div className={styles.panelContent}>
              <DeeperDive
                questions={verseData?.deeperDive}
                verseKey={`${chapter}.${verse}`}
              />

              <QuizDropdown
                quiz={verseData?.quiz}
                onAnswer={handleQuizAnswer}
                verseKey={`${chapter}.${verse}`}
              />
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

function ThreePanelVerseViewerWithBoundary(props) {
  return (
    <ViewerErrorBoundary>
      <ThreePanelVerseViewer {...props} />
    </ViewerErrorBoundary>
  );
}

export default ThreePanelVerseViewerWithBoundary;
