/**
 * Chapter 26: Investigation of the Twelve Links
 * Configuration file containing verse data, animation configs, and color schemes.
 */
import { defaultColors } from '../../common/config.js'; // Import if needed

// Helper function to convert hex number to CSS hex string
function hexNumToCss(hex) {
    // Ensure it's treated as a number if it's not already
    const num = Number(hex);
    // Convert to hex string, pad with zeros, prepend #
    return '#' + num.toString(16).padStart(6, '0');
}

// Original Animation Configs (to be embedded in verses)
const animationConfigs = {
    1: { particleCount: 2000, waveAmplitude: 2.0, waveSpeed: 0.5, collapseSpeed: 0.8 },
    2: { initialWaveWidth: 1.5, evolutionSpeed: 0.4, particleCount: 500, turbulence: 0.3 },
    3: { particleSpeed: 0.2, interactionStrength: 1.5, particleSize: 0.3, particleCount: 6 },
    4: { slitWidth: 0.3, slitSeparation: 1.0, particleSpeed: 0.5, observationStrength: 1.0 },
    5: { entanglementStrength: 0.9, rotationSpeed: 0.4, particleDistance: 3.0 },
    6: { attractionStrength: 0.7, fieldDensity: 50, objectCount: 12, fieldRadius: 5.0 },
    7: { coherenceStrength: 0.8, environmentalNoise: 0.3, particleCount: 300, decayRate: 0.05 },
    8: { halfLife: 5.0, atomCount: 100, decayParticleSpeed: 0.3, atomSize: 0.4 },
    9: { initialOrder: 0.9, disorderRate: 0.2, particleCount: 400, systemSize: 10.0 },
    10: { trajectoryCount: 10, sensitivityFactor: 1.5, evolutionSpeed: 0.3, initialSeparation: 0.1 },
    11: { erasureStrength: 0.8, interferenceStrength: 1.2, particleSpeed: 0.4, pathWidth: 0.3 },
    12: { dominoCount: 12, fallingSpeed: 0.3, dominoSpacing: 1.2, dominoHeight: 2.0 }
};

// Original Color Schemes (to be transformed)
const originalColorSchemes = {
    1: { background: 0x000033, primary: 0x4169E1, secondary: 0x9370DB, accent: 0x00FFFF },
    2: { background: 0x001a33, primary: 0x40E0D0, secondary: 0x0080FF, accent: 0xADFF2F },
    3: { background: 0x0D0D0D, primary: 0xFF4500, secondary: 0xFF8C00, accent: 0xFFD700 },
    4: { background: 0x000022, primary: 0x6495ED, secondary: 0x00CED1, accent: 0x1E90FF },
    5: { background: 0x0D000D, primary: 0xDA70D6, secondary: 0xFF69B4, accent: 0xEE82EE },
    6: { background: 0x0A000A, primary: 0xFF0000, secondary: 0xFF1493, accent: 0xDC143C },
    7: { background: 0x001A1A, primary: 0x00FFFF, secondary: 0x7FFFD4, accent: 0x20B2AA },
    8: { background: 0x1A0000, primary: 0xFF4500, secondary: 0xFFA500, accent: 0x8B0000 },
    9: { background: 0x0A0A0A, primary: 0xA9A9A9, secondary: 0x696969, accent: 0xDCDCDC },
    10: { background: 0x00001A, primary: 0x6A5ACD, secondary: 0x483D8B, accent: 0x9370DB },
    11: { background: 0x000A0A, primary: 0x00FA9A, secondary: 0x3CB371, accent: 0x98FB98 },
    12: { background: 0x0D0000, primary: 0xB22222, secondary: 0xFF6347, accent: 0xCD5C5C }
};

// Transformed Color Schemes for export
export const colors = {};
for (const verseId in originalColorSchemes) {
    const scheme = originalColorSchemes[verseId];
    colors[`verse${verseId}`] = {
        primary: hexNumToCss(scheme.primary),
        secondary: hexNumToCss(scheme.secondary),
        accent: hexNumToCss(scheme.accent),
        background: hexNumToCss(scheme.background) // Include background color
    };
}
// Add a default fallback if needed
colors.defaultVerse = {
    primary: '#cccccc',
    secondary: '#eeeeee',
    accent: '#999999',
    background: '#222222'
};


// Mapping animation names (adjust if needed based on final animation class names)
const animationNameMapping = {
    1: 'superposition',
    2: 'waveFunction',
    3: 'particleInteraction',
    4: 'doubleSlit',
    5: 'entanglement',
    6: 'attraction',
    7: 'coherence',
    8: 'decay',
    9: 'entropy',
    10: 'initialConditions',
    11: 'quantumErasure',
    12: 'chainReaction'
};

// Verse data for Chapter 26
export const verses = [
  {
    number: 1,
    text: "In order to become again, those obscured by ignorance are moved into destinies by actions which are impelled [by] the three kinds of formative impulses.",
    madhyamaka: "Ignorance (avidya) as the root cause of samsara, leading to formative impulses (samskaras) that condition future rebirths. Ignorance is the misperception of inherent existence, driving karmic actions.",
    quantum: "Quantum Superposition and Measurement: A system exists in multiple states until measured, collapsing to one outcome.",
    accessible: "Imagine a foggy crossroads; due to fog (ignorance), choices (impulses) shape your path, like actions determining destiny.",
    title: "Ignorance and Impulses", // Added title
    animation: animationNameMapping[1], // Mapped animation name
    config: animationConfigs[1] // Added animation config
  },
  {
    number: 2,
    text: "Consciousness conditioned by formative impulses enters into destinies. When consciousness has entered, name and form develop.",
    madhyamaka: "Formative impulses condition consciousness (vijnana), leading to name and form (nama-rupa), showing the dependent origination of mental and physical phenomena, all empty of inherent existence.",
    quantum: "Wave Function Evolution: The wave function evolves deterministically over time, shaped by initial conditions.",
    accessible: "Think of a river's flow set by its source (impulses), shaping its path (consciousness) and landscape (name and form).",
    title: "Consciousness, Name & Form",
    animation: animationNameMapping[2],
    config: animationConfigs[2]
  },
  {
    number: 3,
    text: "When name and form develop, the six senses emerge. In dependence upon the six senses, impact actually occurs.",
    madhyamaka: "Name and form give rise to the six sense bases (shadayatana), leading to contact (sparsa), highlighting the dependent nature of sensory experience, all empty and interdependent.",
    quantum: "Particle Interactions: Particles interact via gauge bosons, producing effects similar to senses meeting objects.",
    accessible: "Like billiard balls colliding and changing direction, senses interact with objects, leading to sensory contact.",
    title: "Six Senses and Contact",
    animation: animationNameMapping[3],
    config: animationConfigs[3]
  },
  {
    number: 4,
    text: "Just as [it] only arises in dependence on the eye, [visual] form and attention, so consciousness arises in dependence on name and form.",
    madhyamaka: "Consciousness arises dependent on sense organs, objects, and attention, emphasizing interdependent perception where multiple conditions converge, all empty.",
    quantum: "Measurement Problem: Measurement affects the system's state, collapsing the wave function, akin to consciousness emerging from interactions.",
    accessible: "In the double-slit experiment, observing changes behavior; similarly, consciousness arises from senses, objects, and focus.",
    title: "Dependent Consciousness",
    animation: animationNameMapping[4],
    config: animationConfigs[4]
  },
  {
    number: 5,
    text: "The gathering of the three: eye and [visual] form and consciousness, that is 'impact.' From impact feeling totally arises.",
    madhyamaka: "Contact (sparsa) is the convergence of sense organ, object, and consciousness, leading to feeling (vedana), showing how sensory experience generates emotional responses, all empty.",
    quantum: "Quantum Entanglement: Correlated states where one particle's state affects another, like the interdependence of the three elements.",
    accessible: "Like entangled particles where measuring one affects the other, sense organ, object, and consciousness link to produce feeling.",
    title: "Contact and Feeling",
    animation: animationNameMapping[5],
    config: animationConfigs[5]
  },
  {
    number: 6,
    text: "Due to the condition of feeling, there is craving; one craves for what is felt. When one craves, one clings to the four aspects of clinging [sense objects, views, morals and rules, and views of self].",
    madhyamaka: "Feeling leads to craving (trishna), then clinging (upadana) to sense pleasures, views, ethics, and self-theories, perpetuating samsara through attachment, all empty.",
    quantum: "Attraction in Physics: Forces like gravity or quantum bound states mirror craving and clinging by holding objects together.",
    accessible: "Like magnets attracting metal, feelings draw us to crave and cling to pleasures or ideas, binding us to patterns.",
    title: "Feeling, Craving, Clinging",
    animation: animationNameMapping[6],
    config: animationConfigs[6]
  },
  {
    number: 7,
    text: "When there is clinging, the becoming of the clinger fully arises. When there is no clinging, one is freed; there is no [more] becoming.",
    madhyamaka: "Clinging leads to becoming (bhava), the process of coming into existence; without clinging, liberation from rebirth occurs, emphasizing attachment's role in samsara.",
    quantum: "Quantum Coherence and Decoherence: Coherence maintains states, while decoherence frees them to classical behavior.",
    accessible: "Like a spinning top staying upright (coherence) but falling when slowing (decoherence), clinging keeps the cycle, releasing liberates.",
    title: "Clinging and Becoming",
    animation: animationNameMapping[7],
    config: animationConfigs[7]
  },
  {
    number: 8,
    text: "Becoming is the five aggregates; from becoming one is born. Aging, death, torment, lamentation, pain,",
    madhyamaka: "Becoming leads to birth (jati), resulting in aging, death, and suffering, with the five aggregates (skandhas) constituting the being, all empty.",
    quantum: "Radioactive Decay: Unstable nuclei transform, leading to new states, paralleling becoming to birth and decay.",
    accessible: "Like radioactive elements decaying over time, becoming leads to birth and inevitable aging and death, a natural process.",
    title: "Becoming and Birth",
    animation: animationNameMapping[8],
    config: animationConfigs[8]
  },
  {
    number: 9,
    text: "Mental unhappiness, anxiety: these vividly emerge from birth. Likewise, the entire mass of anguish emerges.",
    madhyamaka: "Birth conditions all suffering, including mental distress and anxiety, emphasizing samsara's inherent dukkha (suffering), with birth as the gateway to anguish.",
    quantum: "Second Law of Thermodynamics: Entropy increases over time, paralleling suffering's accumulation from birth.",
    accessible: "Like a tidy room becoming messy over time, birth leads to suffering's accumulation, a natural tendency towards disorder.",
    title: "Birth and Suffering",
    animation: animationNameMapping[9],
    config: animationConfigs[9]
  },
  {
    number: 10,
    text: "The root of life is formative impulses. Therefore, the wise do not form impulses. Therefore, the unwise are formers, but not the wise since they see reality.",
    madhyamaka: "Formative impulses (samskaras) root cyclic existence; the wise, seeing emptiness, avoid impulses, while the unwise perpetuate samsara.",
    quantum: "Initial Conditions in Quantum Mechanics: Initial states determine future evolution, like impulses setting destinies.",
    accessible: "Like setting a ball's initial position and velocity determines its path, impulses shape destiny; the wise avoid harmful starts.",
    title: "Impulses and Wisdom",
    animation: animationNameMapping[10],
    config: animationConfigs[10]
  },
  {
    number: 11,
    text: "When ignorance stops, formative impulses too do not occur. The stopping of ignorance [comes] through practicing that with understanding.",
    madhyamaka: "Eliminating ignorance through wisdom (prajna) stops samskaras, breaking the cycle of dependent origination, emphasizing understanding's role in liberation.",
    quantum: "Quantum Erasure: Erasing information restores interference patterns, like eliminating ignorance restores liberation potential.",
    accessible: "Like erasing a mistaken chalkboard mark allows correct writing, eliminating ignorance enables freedom.",
    title: "Stopping Ignorance",
    animation: animationNameMapping[11],
    config: animationConfigs[11]
  },
  {
    number: 12,
    text: "By the stopping of the former, the latter will clearly not occur. The entire mass of anguish will likewise completely stop.",
    madhyamaka: "Stopping each preceding link in dependent origination prevents subsequent links, leading to suffering's cessation, summarizing the path to liberation.",
    quantum: "Chain Reactions in Physics: Stopping a chain reaction prevents further events, like halting samsara's cycle.",
    accessible: "Like stopping a domino prevents the rest from falling, stopping ignorance prevents suffering, interrupting the cycle early.",
    title: "Cessation of Suffering",
    animation: animationNameMapping[12],
    config: animationConfigs[12]
  }
];