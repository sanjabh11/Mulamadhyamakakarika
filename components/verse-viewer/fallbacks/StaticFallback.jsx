/**
 * Static Fallback Component
 * 
 * Minimum viable experience when no animation is possible.
 * Shows static image with detailed text description.
 */

import React from 'react';
import styles from './Fallbacks.module.css';

export default function StaticFallback({ verse, onInteraction }) {
  const verseId = `${verse.chapter}.${verse.verse}`;
  const imageBase = `/assets/verses/ch${verse.chapter}/v${verse.verse}`;

  // Static descriptions for Verse 1.1
  const staticDescriptions = {
    '1.1': {
      title: 'The Tetralemma (Catuskoti)',
      altText: 'A crystalline tetrahedron structure with four glowing orbs at its vertices, representing the four logical possibilities of causation',
      description: `This visualization represents Nāgārjuna's famous tetralemma - the systematic refutation of all four logical possibilities for inherent causation:

• **Self-causation (svataḥ)** - Top orb: Things cannot produce themselves
• **Other-causation (parataḥ)** - Left orb: Completely separate causes cannot truly connect
• **Both (dvābhyām)** - Right orb: Combining two impossibilities doesn't help
• **Neither/Random (ahetutaḥ)** - Back orb: Causeless arising explains nothing

The connecting lines between orbs represent **Dependent Origination (pratītyasamutpāda)** - things arise interdependently, not from inherent causes.`,
      interactionHint: 'In the full 3D version, you can click each possibility to see why it fails, then discover Dependent Origination.'
    }
  };

  const content = staticDescriptions[verseId] || {
    title: `Verse ${verseId}`,
    altText: `Visualization for verse ${verseId}`,
    description: 'Interactive 3D visualization available with WebGL support.',
    interactionHint: 'Enable WebGL for the full interactive experience.'
  };

  return (
    <div className={styles.staticFallback}>
      <div className={styles.imageContainer}>
        <img
          src={`${imageBase}/static.webp`}
          alt={content.altText}
          className={styles.staticImage}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
          <span className={styles.placeholderIcon}>🔮</span>
          <span>Image loading...</span>
        </div>
      </div>

      <div className={styles.staticContent}>
        <h3 className={styles.staticTitle}>{content.title}</h3>
        
        <div className={styles.staticDescription}>
          {content.description.split('\n\n').map((paragraph, i) => (
            <p key={i} dangerouslySetInnerHTML={{ 
              __html: paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }} />
          ))}
        </div>

        <div className={styles.interactionHint}>
          <span className={styles.hintIcon}>💡</span>
          <span>{content.interactionHint}</span>
        </div>
      </div>

      {/* Fallback info banner */}
      <div className={styles.fallbackBanner}>
        <span className={styles.bannerIcon}>🖼️</span>
        <span className={styles.bannerText}>Static mode - Update browser for 3D</span>
      </div>
    </div>
  );
}
