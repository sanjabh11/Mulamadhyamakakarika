/**
 * Verse Animation Configuration
 * 
 * Maps all 300+ verses across 27 chapters to their quantum concept animations.
 * All constants and detection logic imported from lib/animation-constants.js.
 */

import {
  ANIMATION_TYPES,
  ANIMATION_NAMES as _ANIMATION_NAMES,
  DEFAULT_ANIMATION,
  detectAnimationType,
  CHAPTER_THEMES,
  getParticleCount,
  getColorScheme,
} from './animation-constants';

// Re-export for existing consumers
export { detectAnimationType, CHAPTER_THEMES };

// Chapter 1 specific animation mappings (ACE-generated)
const CHAPTER_1_VERSE_ANIMATIONS = {
  1: { type: ANIMATION_TYPES.TETRALEMMA, concept: 'Superposition', file: 'verse1-tetralemma.js' },
  2: { type: ANIMATION_TYPES.FEYNMAN, concept: 'Feynman Diagrams', file: 'verse2-feynman.js' },
  3: { type: ANIMATION_TYPES.CONTEXTUALITY, concept: 'Contextuality', file: 'verse3-contextuality.js' },
  4: { type: ANIMATION_TYPES.PROBABILITY, concept: 'Probability Amplitude', file: 'verse4-probability.js' },
  5: { type: ANIMATION_TYPES.DELAYED_CHOICE, concept: 'Delayed Choice Quantum Eraser', file: 'verse5-delayedchoice.js' },
  6: { type: ANIMATION_TYPES.VACUUM, concept: 'Vacuum Fluctuations', file: 'verse6-vacuum.js' },
  7: { type: ANIMATION_TYPES.ENTANGLEMENT, concept: 'Quantum Entanglement', file: 'verse7-entanglement.js' }
};

/**
 * Get animation configuration for a specific verse
 */
export function getVerseAnimationConfig(chapter, verse, verseData = {}) {
  const chapterTheme = CHAPTER_THEMES[chapter] || CHAPTER_THEMES[1];
  
  // Chapter 1 v1-7: use known concept mapping for animationType detection
  // (VerseAnimationEngine handles actual rendering via verseData.quantumResonance.concept)
  if (chapter === 1 && CHAPTER_1_VERSE_ANIMATIONS[verse]) {
    const ch1Config = CHAPTER_1_VERSE_ANIMATIONS[verse];
    return {
      chapter,
      verse,
      animationType: ch1Config.type,
      quantumConcept: ch1Config.concept,
      theme: chapterTheme.theme,
      useEngine: true,
      config: {
        autoRotate: true,
        particleCount: getParticleCount(ch1Config.type),
        colorScheme: getColorScheme(chapter)
      }
    };
  }
  
  // Try to detect from quantumResonance.concept first (most precise)
  let animationType = DEFAULT_ANIMATION;
  if (verseData.resonanceConcept) {
    animationType = detectAnimationType(verseData.resonanceConcept);
  }
  
  // Fall back to quantum parallel text
  if (animationType === DEFAULT_ANIMATION) {
    animationType = detectAnimationType(verseData.quantum || verseData.quantumParallel);
  }
  
  // If no specific detection, use chapter theme
  if (animationType === DEFAULT_ANIMATION && !(verseData.quantum || '').toLowerCase().includes('entangle')) {
    animationType = chapterTheme.primaryAnimation;
  }
  
  return {
    chapter,
    verse,
    animationType,
    theme: chapterTheme.theme,
    isACEGenerated: false,
    config: {
      autoRotate: true,
      particleCount: getParticleCount(animationType),
      colorScheme: getColorScheme(chapter)
    }
  };
}

/**
 * Get all verse configs for a chapter
 */
export function getChapterVerseConfigs(chapter, verses) {
  return verses.map((verse, index) => 
    getVerseAnimationConfig(chapter, index + 1, verse)
  );
}

// Re-export animation names from unified constants
export const ANIMATION_NAMES = _ANIMATION_NAMES;

export default {
  detectAnimationType,
  getVerseAnimationConfig,
  getChapterVerseConfigs,
  CHAPTER_THEMES,
  ANIMATION_NAMES,
  CHAPTER_1_VERSE_ANIMATIONS,
};
