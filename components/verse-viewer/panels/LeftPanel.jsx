/**
 * Left Panel Component
 * 
 * Contains:
 * - Verse Text (Sanskrit + Translation)
 * - Explanation (Madhyamaka, Quantum, Bridge)
 * - Animation Controls (Rotation, Speed, Reset, Fullscreen)
 */

import React, { useState } from 'react';
import styles from './LeftPanel.module.css';

export default function LeftPanel({
  verseData,
  animationSettings,
  onSettingChange,
  onReset,
  collapsed,
  onToggleCollapse,
  showControls = true,
  showOnlyControls = false
}) {
  const [explanationOpen, setExplanationOpen] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(true);

  if (collapsed) {
    return (
      <div className={styles.collapsedPanel}>
        <button 
          className={styles.expandButton}
          onClick={onToggleCollapse}
          title="Expand panel"
        >
          ▶
        </button>
      </div>
    );
  }

  // Show only controls (for mobile)
  if (showOnlyControls) {
    return (
      <div className={styles.panel}>
        <AnimationControls
          settings={animationSettings}
          onSettingChange={onSettingChange}
          onReset={onReset}
        />
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Verse Text Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Verse {verseData.chapter}.{verseData.verse}</h2>
        
        {verseData.sanskrit && (
          <div className={styles.sanskritText}>
            <p className={styles.sanskrit}>{verseData.sanskrit}</p>
            <p className={styles.transliteration}>{verseData.transliteration}</p>
          </div>
        )}
        
        <p className={styles.translation}>{verseData.verseText}</p>
      </section>

      {/* Explanation Section - Collapsible */}
      <section className={styles.section}>
        <button 
          className={styles.collapseHeader}
          onClick={() => setExplanationOpen(!explanationOpen)}
        >
          <span>{explanationOpen ? '▼' : '▶'}</span>
          <h3>Explanation</h3>
        </button>
        
        {explanationOpen && (
          <div className={styles.explanationContent}>
            <div className={styles.explanationItem}>
              <h4 className={styles.itemLabel}>Madhyamaka</h4>
              <p>{verseData.madhyamakaConcept}</p>
            </div>
            
            <div className={styles.explanationItem}>
              <h4 className={styles.itemLabel}>Quantum Physics</h4>
              <p>{verseData.quantumPhysicsParallel}</p>
            </div>
            
            <div className={styles.explanationItem}>
              <h4 className={styles.itemLabel}>Bridge</h4>
              <p>{verseData.bridge || verseData.analysis}</p>
            </div>
          </div>
        )}
      </section>

      {/* Animation Controls Section - Collapsible */}
      {showControls && (
        <section className={styles.section}>
          <button 
            className={styles.collapseHeader}
            onClick={() => setControlsOpen(!controlsOpen)}
          >
            <span>{controlsOpen ? '▼' : '▶'}</span>
            <h3>Controls</h3>
          </button>
          
          {controlsOpen && (
            <AnimationControls
              settings={animationSettings}
              onSettingChange={onSettingChange}
              onReset={onReset}
            />
          )}
        </section>
      )}

      {/* Collapse Button */}
      <button 
        className={styles.collapseButton}
        onClick={onToggleCollapse}
      >
        ◀ Collapse
      </button>
    </div>
  );
}

function AnimationControls({ settings, onSettingChange, onReset }) {
  return (
    <div className={styles.controlsContent}>
      {/* Auto Rotate Toggle */}
      <div className={styles.controlRow}>
        <label className={styles.controlLabel}>Rotation</label>
        <button
          className={`${styles.toggleButton} ${settings.autoRotate ? styles.active : ''}`}
          onClick={() => onSettingChange('autoRotate', !settings.autoRotate)}
        >
          {settings.autoRotate ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {/* Rotation Speed Slider */}
      <div className={styles.controlRow}>
        <label className={styles.controlLabel}>Speed</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.rotationSpeed}
          onChange={(e) => onSettingChange('rotationSpeed', parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>
      
      {/* Particle Intensity */}
      <div className={styles.controlRow}>
        <label className={styles.controlLabel}>Particles</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.particleIntensity}
          onChange={(e) => onSettingChange('particleIntensity', parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>
      
      {/* Action Buttons */}
      <div className={styles.buttonRow}>
        <button 
          className={styles.actionButton}
          onClick={onReset}
        >
          Reset
        </button>
        <button 
          className={styles.actionButton}
          onClick={() => document.documentElement.requestFullscreen?.()}
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}
