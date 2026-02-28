/**
 * EducationalOverlay - HTML overlay for visualBridge and educationalGoal
 * 
 * Renders as an HTML overlay on top of the R3F canvas.
 * Shows verse-specific educational content on reveal state.
 * Can also show twoTruths or commonMisconception on interaction.
 */

import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    maxWidth: '90%',
    width: '400px',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(15, 23, 42, 0.92)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#e2e8f0',
    fontSize: '13px',
    lineHeight: '1.5',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'overlayFadeIn 0.4s ease-out',
  },
  bridgeLabel: {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#a78bfa',
    marginBottom: '4px',
  },
  bridgeText: {
    color: '#c4b5fd',
    fontStyle: 'italic',
    marginBottom: '8px',
    fontSize: '13px',
  },
  goalLabel: {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#06b6d4',
    marginBottom: '4px',
  },
  goalText: {
    color: '#a5f3fc',
    fontSize: '12px',
  },
  misconceptionCard: {
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginTop: '8px',
  },
  misconceptionLabel: {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#f59e0b',
    marginBottom: '2px',
  },
  misconceptionText: {
    color: '#fcd34d',
    fontSize: '12px',
  },
  twoTruthsCard: {
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginTop: '8px',
  },
  twoTruthsLabel: {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#10b981',
    marginBottom: '2px',
  },
  twoTruthsText: {
    color: '#6ee7b7',
    fontSize: '12px',
  },
  interactionHint: {
    position: 'absolute',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    background: 'rgba(139, 92, 246, 0.9)',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    animation: 'overlayFadeIn 0.3s ease-out',
    pointerEvents: 'none',
    maxWidth: '80%',
    textAlign: 'center',
  },
};

export default function EducationalOverlay({
  revealData,
  interactionHint,
  isVisible = false,
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Animate overlay in
  useEffect(() => {
    if (isVisible && revealData) {
      setShowOverlay(true);
    } else {
      const timer = setTimeout(() => setShowOverlay(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, revealData]);

  // Auto-dismiss interaction hint
  useEffect(() => {
    if (interactionHint) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [interactionHint]);

  return (
    <>
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Interaction hint (top) */}
      {showHint && interactionHint && (
        <div style={styles.interactionHint}>
          {interactionHint}
        </div>
      )}

      {/* Educational reveal overlay (bottom) */}
      {showOverlay && revealData && (
        <div style={styles.container}>
          <div style={styles.card}>
            {/* Visual Bridge */}
            {revealData.visualBridge && (
              <>
                <div style={styles.bridgeLabel}>Visual Bridge</div>
                <div style={styles.bridgeText}>{revealData.visualBridge}</div>
              </>
            )}

            {/* Educational Goal */}
            {revealData.educationalGoal && (
              <>
                <div style={styles.goalLabel}>Educational Goal</div>
                <div style={styles.goalText}>{revealData.educationalGoal}</div>
              </>
            )}

            {/* Two Truths */}
            {revealData.twoTruths && (
              <div style={styles.twoTruthsCard}>
                <div style={styles.twoTruthsLabel}>Two Truths</div>
                <div style={styles.twoTruthsText}>{revealData.twoTruths}</div>
              </div>
            )}

            {/* Common Misconception */}
            {revealData.commonMisconception && (
              <div style={styles.misconceptionCard}>
                <div style={styles.misconceptionLabel}>Common Misconception</div>
                <div style={styles.misconceptionText}>{revealData.commonMisconception}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
