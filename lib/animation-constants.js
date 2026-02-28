/**
 * Unified Animation Constants — SINGLE SOURCE OF TRUTH
 * 
 * All animation type definitions, display names, concept detection,
 * chapter themes, and fallback URLs live here.
 * 
 * Consumers:
 *   - lib/verse-animation-config.js
 *   - components/three/QuantumCanvas.jsx
 *   - components/FalAnimation.jsx
 *   - components/ChapterPage.jsx
 */

// ─── Animation type identifiers ─────────────────────────────────────────────
export const ANIMATION_TYPES = {
  ENTANGLEMENT: 'entanglement',
  SUPERPOSITION: 'superposition',
  WAVE_FUNCTION: 'wave-function',
  DOUBLE_SLIT: 'double-slit',
  DECOHERENCE: 'decoherence',
  NON_LOCALITY: 'non-locality',
  OBSERVER_EFFECT: 'observer-effect',
  QUANTUM_FLUCTUATIONS: 'fluctuations',
  DEPENDENT_ORIGINATION: 'dependent-origination',
  EMPTINESS: 'emptiness',
  COMPLEMENTARITY: 'complementarity',
  // Chapter 1 ACE-generated animation types
  TETRALEMMA: 'tetralemma',
  FEYNMAN: 'feynman',
  CONTEXTUALITY: 'contextuality',
  PROBABILITY: 'probability',
  DELAYED_CHOICE: 'delayedchoice',
  VACUUM: 'vacuum',
  MEASUREMENT_PROBLEM: 'measurement-problem',
  BELL_TEST: 'bell-test',
  VACUUM_FOAM: 'vacuum-foam',
};

export const DEFAULT_ANIMATION = ANIMATION_TYPES.ENTANGLEMENT;

// ─── Human-readable display names ───────────────────────────────────────────
export const ANIMATION_NAMES = {
  [ANIMATION_TYPES.ENTANGLEMENT]: 'Quantum Entanglement',
  [ANIMATION_TYPES.SUPERPOSITION]: 'Quantum Superposition',
  [ANIMATION_TYPES.WAVE_FUNCTION]: 'Wave Function',
  [ANIMATION_TYPES.DOUBLE_SLIT]: 'Double-Slit Experiment',
  [ANIMATION_TYPES.DECOHERENCE]: 'Quantum Decoherence',
  [ANIMATION_TYPES.NON_LOCALITY]: 'Quantum Non-Locality',
  [ANIMATION_TYPES.OBSERVER_EFFECT]: 'Observer Effect',
  [ANIMATION_TYPES.QUANTUM_FLUCTUATIONS]: 'Quantum Fluctuations',
  [ANIMATION_TYPES.DEPENDENT_ORIGINATION]: 'Dependent Origination',
  [ANIMATION_TYPES.EMPTINESS]: 'Śūnyatā (Emptiness)',
  [ANIMATION_TYPES.COMPLEMENTARITY]: 'Wave-Particle Duality',
  [ANIMATION_TYPES.TETRALEMMA]: 'Tetralemma (Catuṣkoṭi)',
  [ANIMATION_TYPES.FEYNMAN]: 'Feynman Diagrams',
  [ANIMATION_TYPES.CONTEXTUALITY]: 'Quantum Contextuality',
  [ANIMATION_TYPES.PROBABILITY]: 'Probability Amplitude',
  [ANIMATION_TYPES.DELAYED_CHOICE]: 'Delayed Choice Quantum Eraser',
  [ANIMATION_TYPES.VACUUM]: 'Vacuum Fluctuations',
  [ANIMATION_TYPES.MEASUREMENT_PROBLEM]: 'Measurement Problem',
  [ANIMATION_TYPES.BELL_TEST]: "Bell's Theorem Test",
  [ANIMATION_TYPES.VACUUM_FOAM]: 'Quantum Vacuum Foam',
};

// ─── Concept keyword detection ──────────────────────────────────────────────
const CONCEPT_KEYWORDS = {
  [ANIMATION_TYPES.ENTANGLEMENT]: ['entangle', 'correlat', 'interconnect', 'linked', 'dependent origination', 'non-separab'],
  [ANIMATION_TYPES.SUPERPOSITION]: ['superposition', 'multiple states', 'both at once', 'neither nor', 'born rule', 'field excitation'],
  [ANIMATION_TYPES.WAVE_FUNCTION]: ['wave function', 'probability', 'potential', 'uncertain', 'zeno', 'schrödinger', 'schrodinger', 'unitary evolution', 'tunnel'],
  [ANIMATION_TYPES.DOUBLE_SLIT]: ['double-slit', 'slit', 'interference'],
  [ANIMATION_TYPES.DECOHERENCE]: ['decoherence', 'environment', 'classical', 'transition', 'relational quantum', 'rqm'],
  [ANIMATION_TYPES.NON_LOCALITY]: ['non-local', 'distance', 'instant', 'spooky action', 'bell\'s theorem', 'bell inequality'],
  [ANIMATION_TYPES.OBSERVER_EFFECT]: ['observer', 'observation', 'measurement', 'collapse', 'kochen-specker', 'contextual', 'wave function collapse', 'measurement problem'],
  [ANIMATION_TYPES.QUANTUM_FLUCTUATIONS]: ['fluctuation', 'virtual particle', 'vacuum', 'spontaneous', 'casimir', 'field theory'],
  [ANIMATION_TYPES.DEPENDENT_ORIGINATION]: ['dependent', 'condition', 'cause', 'arise', 'pratītyasamutpāda'],
  [ANIMATION_TYPES.EMPTINESS]: ['empty', 'śūnyatā', 'essence', 'inherent', 'void', 'prapañcopaśama'],
  [ANIMATION_TYPES.COMPLEMENTARITY]: ['complement', 'wave-particle', 'dual', 'both aspects', 'indistinguishab', 'complementarity'],
};

/**
 * Detect animation type from free-text quantum concept description.
 * Used by verse-animation-config, QuantumCanvas, and FalAnimation.
 */
export function detectAnimationType(text = '') {
  const lower = text.toLowerCase();
  for (const [concept, keywords] of Object.entries(CONCEPT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return concept;
    }
  }
  return DEFAULT_ANIMATION;
}

// ─── Chapter themes ─────────────────────────────────────────────────────────
export const CHAPTER_THEMES = {
  1:  { theme: 'conditions',    primaryAnimation: ANIMATION_TYPES.DEPENDENT_ORIGINATION },
  2:  { theme: 'motion',        primaryAnimation: ANIMATION_TYPES.WAVE_FUNCTION },
  3:  { theme: 'perception',    primaryAnimation: ANIMATION_TYPES.OBSERVER_EFFECT },
  4:  { theme: 'aggregates',    primaryAnimation: ANIMATION_TYPES.SUPERPOSITION },
  5:  { theme: 'elements',      primaryAnimation: ANIMATION_TYPES.ENTANGLEMENT },
  6:  { theme: 'desire',        primaryAnimation: ANIMATION_TYPES.DECOHERENCE },
  7:  { theme: 'arising',       primaryAnimation: ANIMATION_TYPES.QUANTUM_FLUCTUATIONS },
  8:  { theme: 'agent-action',  primaryAnimation: ANIMATION_TYPES.COMPLEMENTARITY },
  9:  { theme: 'prior-entity',  primaryAnimation: ANIMATION_TYPES.SUPERPOSITION },
  10: { theme: 'fire-fuel',     primaryAnimation: ANIMATION_TYPES.ENTANGLEMENT },
  11: { theme: 'prior-limits',  primaryAnimation: ANIMATION_TYPES.NON_LOCALITY },
  12: { theme: 'suffering',     primaryAnimation: ANIMATION_TYPES.DEPENDENT_ORIGINATION },
  13: { theme: 'compounded',    primaryAnimation: ANIMATION_TYPES.EMPTINESS },
  14: { theme: 'association',   primaryAnimation: ANIMATION_TYPES.ENTANGLEMENT },
  15: { theme: 'essence',       primaryAnimation: ANIMATION_TYPES.EMPTINESS },
  16: { theme: 'bondage',       primaryAnimation: ANIMATION_TYPES.DECOHERENCE },
  17: { theme: 'action-fruit',  primaryAnimation: ANIMATION_TYPES.DEPENDENT_ORIGINATION },
  18: { theme: 'self',          primaryAnimation: ANIMATION_TYPES.EMPTINESS },
  19: { theme: 'time',          primaryAnimation: ANIMATION_TYPES.WAVE_FUNCTION },
  20: { theme: 'cause-effect',  primaryAnimation: ANIMATION_TYPES.QUANTUM_FLUCTUATIONS },
  21: { theme: 'becoming',      primaryAnimation: ANIMATION_TYPES.SUPERPOSITION },
  22: { theme: 'tathagata',     primaryAnimation: ANIMATION_TYPES.EMPTINESS },
  23: { theme: 'error',         primaryAnimation: ANIMATION_TYPES.DECOHERENCE },
  24: { theme: 'noble-truths',  primaryAnimation: ANIMATION_TYPES.DEPENDENT_ORIGINATION },
  25: { theme: 'nirvana',       primaryAnimation: ANIMATION_TYPES.EMPTINESS },
  26: { theme: 'twelve-links',  primaryAnimation: ANIMATION_TYPES.DEPENDENT_ORIGINATION },
  27: { theme: 'views',         primaryAnimation: ANIMATION_TYPES.COMPLEMENTARITY },
};

// ─── Particle counts per animation type ─────────────────────────────────────
export const PARTICLE_COUNTS = {
  [ANIMATION_TYPES.ENTANGLEMENT]: 1000,
  [ANIMATION_TYPES.SUPERPOSITION]: 500,
  [ANIMATION_TYPES.WAVE_FUNCTION]: 2000,
  [ANIMATION_TYPES.DOUBLE_SLIT]: 500,
  [ANIMATION_TYPES.DECOHERENCE]: 800,
  [ANIMATION_TYPES.NON_LOCALITY]: 600,
  [ANIMATION_TYPES.OBSERVER_EFFECT]: 500,
  [ANIMATION_TYPES.QUANTUM_FLUCTUATIONS]: 400,
  [ANIMATION_TYPES.DEPENDENT_ORIGINATION]: 300,
  [ANIMATION_TYPES.EMPTINESS]: 600,
  [ANIMATION_TYPES.COMPLEMENTARITY]: 400,
};

// ─── Color schemes (cycled per chapter) ─────────────────────────────────────
const COLOR_SCHEMES = [
  { primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B' },
  { primary: '#06B6D4', secondary: '#8B5CF6', accent: '#10B981' },
  { primary: '#EC4899', secondary: '#F59E0B', accent: '#8B5CF6' },
  { primary: '#10B981', secondary: '#06B6D4', accent: '#EC4899' },
];

export function getColorScheme(chapter) {
  return COLOR_SCHEMES[(chapter - 1) % COLOR_SCHEMES.length];
}

export function getParticleCount(animationType) {
  return PARTICLE_COUNTS[animationType] || 500;
}

// ─── Video fallback URLs (used by FalAnimation) ────────────────────────────
export const FALLBACK_VIDEOS = {
  [ANIMATION_TYPES.ENTANGLEMENT]: 'https://storage.googleapis.com/quantum-animations/entanglement.mp4',
  [ANIMATION_TYPES.SUPERPOSITION]: 'https://storage.googleapis.com/quantum-animations/superposition.mp4',
  [ANIMATION_TYPES.COMPLEMENTARITY]: 'https://storage.googleapis.com/quantum-animations/wave-particle.mp4',
  [ANIMATION_TYPES.WAVE_FUNCTION]: 'https://storage.googleapis.com/quantum-animations/wave-function.mp4',
  [ANIMATION_TYPES.DECOHERENCE]: 'https://storage.googleapis.com/quantum-animations/decoherence.mp4',
  [ANIMATION_TYPES.NON_LOCALITY]: 'https://storage.googleapis.com/quantum-animations/non-locality.mp4',
  [ANIMATION_TYPES.QUANTUM_FLUCTUATIONS]: 'https://storage.googleapis.com/quantum-animations/quantum-fluctuations.mp4',
  [ANIMATION_TYPES.OBSERVER_EFFECT]: 'https://storage.googleapis.com/quantum-animations/observer-effect.mp4',
  default: 'https://storage.googleapis.com/falserverless/fal-ai/fast-sdxl-animation/videos/b63dd31e-d62a-49b1-bc0c-b437e0ad3b35.mp4',
};

export const FALLBACK_THUMBNAILS = {
  [ANIMATION_TYPES.ENTANGLEMENT]: 'https://storage.googleapis.com/quantum-animations/entanglement-thumb.jpg',
  [ANIMATION_TYPES.SUPERPOSITION]: 'https://storage.googleapis.com/quantum-animations/superposition-thumb.jpg',
  [ANIMATION_TYPES.COMPLEMENTARITY]: 'https://storage.googleapis.com/quantum-animations/wave-particle-thumb.jpg',
  [ANIMATION_TYPES.WAVE_FUNCTION]: 'https://storage.googleapis.com/quantum-animations/wave-function-thumb.jpg',
  [ANIMATION_TYPES.DECOHERENCE]: 'https://storage.googleapis.com/quantum-animations/decoherence-thumb.jpg',
  [ANIMATION_TYPES.NON_LOCALITY]: 'https://storage.googleapis.com/quantum-animations/non-locality-thumb.jpg',
  [ANIMATION_TYPES.QUANTUM_FLUCTUATIONS]: 'https://storage.googleapis.com/quantum-animations/quantum-fluctuations-thumb.jpg',
  [ANIMATION_TYPES.OBSERVER_EFFECT]: 'https://storage.googleapis.com/quantum-animations/observer-effect-thumb.jpg',
  default: 'https://storage.googleapis.com/falserverless/fal-ai/sd-turbo/images/0f0fbf90-9a8c-4d58-890a-86f4d18bb4b0.jpeg',
};
