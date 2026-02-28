/**
 * Chapter 1: Examination of Conditions (Pratyaya Parīkṣā)
 * Complete verse data with animations, FAQs, and quizzes
 * Based on Gemini ACE (Animation Creation Engine) output
 */

export const CHAPTER_1_CONFIG = {
  id: 'ch1',
  title: 'Examination of Conditions',
  sanskrit: 'Pratyaya Parīkṣā',
  theme: 'The deconstruction of inherent causality',
  colorPalette: {
    primary: '#8B5CF6',   // Deep Purple
    secondary: '#06B6D4', // Cyan
    accent: '#10B981',    // Emerald Green
    background: '#0F172A' // Dark space
  },
  lightingMood: 'Deep Space / Volumetric Bioluminescence'
};

export const VERSE_1_1 = {
  id: 'v1_1',
  title: 'The Tetralemma',
  sanskrit: {
    text: 'na svato nāpi parato na dvābhyāṃ nāpy ahetutaḥ',
    transliteration: 'na svato nāpi parato na dvābhyāṃ nāpy ahetutaḥ',
    translation: 'Not from itself, not from another, not from both, nor without cause'
  },

  philosophy: {
    insight: 'Refutes arising from Self, Other, Both, or No Cause - the catuṣkoṭi (tetralemma).',
    madhyamaka: 'Nagarjuna systematically negates all four logical possibilities for inherent causation, leaving no ground for svabhāva (inherent existence).',
    quantum: 'Like quantum superposition, where a system is neither definitively A nor B until measurement, causation cannot be pinned to a single logical quadrant.',
    bridge: 'Both frameworks reveal that reality resists being captured by binary or even quadruple logical categorization.',
    accessible: 'Try to find where a rainbow comes from. Not from the sun alone, not from the rain alone, not from both as separate things, and not from nothing. It arises only when conditions meet. Nagarjuna shows ALL arising works this way — nothing comes from a single inherent cause.',
    twoTruths: 'Conventionally, causes produce effects — seeds grow into trees. Ultimately, no inherent causal mechanism can be found in any of the four logical possibilities.',
    commonMisconception: 'This is NOT saying causation does not work. It says INHERENT causation (from self-nature) fails. Dependent arising remains perfectly functional.',
  },

  quantumResonance: {
    concept: 'Superposition',
    score: 92,
    strength: 'High',
    explanation: 'Just as a quantum system in superposition is neither state A, nor B, nor both, nor neither until collapsed, causation cannot be pinned to a single logical quadrant.',
    caveat: 'Superposition and the tetralemma share structural resistance to classical either/or categorisation. Educational parallel, not physical identity.',
  },

  spline_url: 'https://prod.spline.design/ruCOjhuX4nGX3U91/scene.splinecode',

  animation: {
    geometry: 'Tetrahedron',
    anchor: 'A floating, translucent Tetrahedron (4-sided pyramid). Each vertex represents one of the 4 positions (Self, Other, Both, None).',
    texture: 'Crystalline glass with internal volumetric fog. Edges are glowing neon Cyan (#06B6D4).',
    mood: 'Scientific mystery, cold logic dissolving into mist',
    colors: ['#8B5CF6', '#06B6D4', '#EF4444', '#10B981'],

    orchestration: {
      start: 'The tetrahedron spins slowly in a void.',
      click: 'A beam of light strikes one vertex. The vertex glows Red (failure), and the entire shape dissolves into a Probability Cloud (particles), reforming moments later.',
      loop: 'Cycles through checking all 4 vertices, failing, and dissolving.'
    },

    interaction: {
      click: 'Strike vertex with light beam, watch it fail and dissolve',
      drag: 'Rotate the tetrahedron to examine all four positions',
      hover: 'Highlight vertex label (svataḥ, parataḥ, dvābhyām, ahetutaḥ)'
    },

    controls: {
      rotation: { default: true, speed: 0.5 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 50, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'Custom glass shader with volumetric fog (raymarching for internal mist)',
      'InstancedMesh for probability cloud particles (2000 particles, pooled)',
      'drei Edges for glowing cyan wireframe with emissive material',
      'Bloom + ChromaticAberration post-processing for dissolution glow',
      'Spring-based vertex dissolution via @react-spring/three',
    ],
    camera: { position: [0, 2, 8], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<350MB memory, 60 FPS on mid-tier GPU. Particle cloud uses InstancedMesh with shared geometry. Dissolution shader uses vertex displacement, not geometry recreation.',

    tripoPrompt: 'A mystical glass tetrahedron floating in deep space, glowing cyan edges, internal swirling purple smoke, 8K, unreal engine 5 render, volumetric lighting, cinematic composition, sharp focus.',

    visualBridge: 'The solid shape represents the rigidity of logical views; its dissolution into a cloud represents Emptiness and Quantum Superposition.',
    educationalGoal: 'User sees that all four possible sources of inherent causation fail — reality resists classical logical categorisation.',
  },

  deeperDive: [
    {
      q: 'What does the tetralemma actually negate?',
      a: 'The tetralemma (catuṣkoṭi) negates four logical possibilities: arising from self, from other, from both, or from neither. This exhausts all possible sources of inherent causation.',
      realLifeExample: 'Imagine asking "Where does a rainbow come from?" It doesn\'t come from the sun alone, the water alone, both together as separate things, or randomly from nothing. It arises dependently from their interaction.'
    },
    {
      q: 'How does quantum superposition relate to this verse?',
      a: 'Quantum superposition shows a particle exists in multiple states simultaneously until measured. Similarly, the tetralemma shows that causation cannot be pinned to any single logical position.',
      realLifeExample: 'Like Schrödinger\'s cat being both alive and dead until observed, causation is neither from self nor other nor both nor neither until we stop seeking inherent existence.'
    },
    {
      q: 'Is Nagarjuna saying nothing exists?',
      a: 'No. Nagarjuna negates inherent, independent existence (svabhāva), not conventional existence. Things exist dependently, not from their own side.',
      realLifeExample: 'A traffic jam exists, but not independently - it depends on cars, roads, time of day, and drivers\' decisions. Remove the conditions, and the "jam" disappears.'
    },
    {
      q: 'Why use four negations instead of just saying "no inherent cause"?',
      a: 'The four-fold negation systematically addresses every possible position an opponent might take, leaving no logical escape. It\'s a complete deconstruction.',
      realLifeExample: 'Like a lawyer anticipating every defense: "You didn\'t do it alone, with help, both ways, or by accident? Then how?" - systematically closing all escape routes.'
    },
    {
      q: 'How can things function if they don\'t arise from causes?',
      a: 'Things DO arise from causes - just not from causes with inherent existence. Dependent arising (pratītyasamutpāda) is not denied; inherent causation is.',
      realLifeExample: 'Your phone works perfectly even though it has no "phone-essence". Its functioning depends entirely on components, software, electricity, and your interaction.'
    },
    {
      q: 'How precisely does superposition map to the tetralemma?',
      a: 'In superposition, a qubit is not in state |0⟩ (self), not in |1⟩ (other), not in a classical mixture of both, and not in no state at all. It exists as a coherent superposition — none of the four classical descriptions apply. The tetralemma similarly shows that arising cannot be pinned to any of the four logical positions. Both frameworks point to a reality that transcends classical either/or categorization.',
      realLifeExample: 'Ask someone "Are you happy or sad?" Often the honest answer is neither, nor both, nor no feeling at all — it\'s a complex state that resists binary categorization. That\'s the lived experience of superposition and the tetralemma.'
    }
  ],

  quiz: {
    beginner: {
      question: 'What does the tetralemma refute?',
      options: [
        'A) Only self-causation',
        'B) All four logical possibilities for inherent causation',
        'C) The existence of causes',
        'D) Dependent origination'
      ],
      correct: 'B',
      explanation: 'The tetralemma (catuṣkoṭi) systematically negates all four logical possibilities: arising from self, other, both, or no cause - showing that inherent causation cannot be established.'
    },
    intermediate: {
      question: 'How does quantum superposition parallel the tetralemma?',
      options: [
        'A) Both prove nothing exists',
        'B) Both show reality is random',
        'C) Both show states cannot be pinned to fixed positions until context is applied',
        'D) Both deny causation entirely'
      ],
      correct: 'C',
      explanation: 'Just as a quantum system exists in superposition (neither A nor B) until measured, the tetralemma shows causation cannot be fixed to any single logical quadrant - both reveal contextual dependence.'
    },
    advanced: {
      question: 'If things don\'t arise from the four extremes, how does Nagarjuna explain their appearance?',
      options: [
        'A) Through pratītyasamutpāda - dependent co-arising without inherent existence',
        'B) Through divine creation',
        'C) Through randomness (ahetutaḥ)',
        'D) He doesn\'t - things don\'t actually appear'
      ],
      correct: 'A',
      explanation: 'Nagarjuna\'s middle way shows that things arise dependently (pratītyasamutpāda) without any of the four extremes. Conventional functioning is preserved while inherent existence is negated.'
    }
  }
};

export const VERSE_1_2 = {
  id: 'v1_2',
  title: 'The Four Conditions',
  sanskrit: {
    text: 'catvāraḥ pratyayā hetur ālambanam anantaram',
    transliteration: 'catvāraḥ pratyayā hetur ālambanam anantaram',
    translation: 'Four conditions are taught: efficient cause, object-support, immediate, and dominant'
  },

  philosophy: {
    insight: 'Accepts conditions conventionally but denies their inherent causal power.',
    madhyamaka: 'Nagarjuna acknowledges the Buddhist teaching of four conditions while preparing to deconstruct their supposed inherent efficacy.',
    quantum: 'Like Feynman diagrams showing interaction vertices without inherent "force," conditions are nodal points without intrinsic power.',
    bridge: 'Both frameworks model relationships without requiring inherent power transfer between nodes.',
    accessible: 'Think of baking a cake. The flour, eggs, sugar, and heat are all needed, but none alone "contains" the cake. The cake emerges from their interaction. Buddhist philosophy identifies four types of conditions, but insists none inherently produces the effect.',
    twoTruths: 'Conventionally, four types of conditions operate in experience. Ultimately, none possesses inherent causal power — they function through mutual dependence.',
    commonMisconception: 'Naming four conditions is NOT asserting they have inherent causal power. The classification is conventional and useful, but the conditions themselves are empty.',
  },

  quantumResonance: {
    concept: 'Feynman Diagrams',
    score: 85,
    strength: 'High',
    explanation: 'Visualizing interactions (conditions) as nodes in a network without assigning inherent "power" to the lines themselves.',
    caveat: 'Quantum entanglement and Buddhist conditions both involve non-local correlations without inherent mechanism. Structural parallel, not literal equivalence.',
  },

  animation: {
    geometry: 'Nucleus + Satellites',
    anchor: 'A central Nucleus surrounded by 4 distinct orbiting Satellites (representing the 4 conditions).',
    texture: 'Nucleus: Matte black sphere absorbing light. Satellites: Metallic chrome, each emitting a different colored laser beam toward the center.',
    mood: 'High-tech laboratory, precise, analytical',
    colors: ['#8B5CF6', '#10B981', '#3B82F6', '#FFFFFF'],

    orchestration: {
      start: 'Four satellites orbit the central void, beams converging.',
      hover: 'The 4 beams converge on the nucleus. Instead of hitting it solid, they pass through it, creating an interference pattern (hologram) in the center.',
      meaning: 'Conditions converge to create an effect, but the effect is just an interference pattern, not a solid entity.'
    },

    interaction: {
      click: 'Activate individual condition beams to see their contribution',
      drag: 'Rotate the orbital system to view from different angles',
      hover: 'Highlight specific condition (Efficient, Object, Immediate, Dominant)'
    },

    controls: {
      rotation: { default: true, speed: 0.8 },
      speed: { default: 60, min: 0, max: 100 },
      complexity: { default: 70, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'InstancedMesh for satellite orbital paths (GPU-instanced trails)',
      'Custom hologram shader with additive blending for interference pattern',
      'drei MeshTransmissionMaterial for nucleus void refraction',
      'Bloom post-processing for laser beam glow',
      'useFrame-driven orbital mechanics with configurable speed',
    ],
    camera: { position: [0, 3, 7], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<300MB memory, 60 FPS. Four satellites use shared geometry. Hologram center uses single plane with custom fragment shader.',

    tripoPrompt: 'Four chrome spheres orbiting a central void, emitting laser beams of purple cyan green and white, beams converging to form a holographic lotus in the center, 8K, sci-fi aesthetic.',

    visualBridge: 'Shows that the "effect" is just the convergence of conditions (lasers), lacking a solid core (the void center).',
    educationalGoal: 'User understands the four conditions as a conventional framework — useful but not pointing to inherent causal powers.',
  },

  deeperDive: [
    {
      q: 'What are the four conditions in Buddhist philosophy?',
      a: 'The four conditions are: (1) Efficient cause (hetu), (2) Object-support (ālambana), (3) Immediate condition (samanantara), and (4) Dominant condition (adhipati). They describe how phenomena arise.',
      realLifeExample: 'For seeing a flower: (1) The eye faculty, (2) The flower itself, (3) The immediately preceding moment of consciousness, (4) Light and attention. All four must be present.'
    },
    {
      q: 'Why does Nagarjuna accept these four conditions?',
      a: 'He accepts them conventionally as a teaching framework, but will show they lack inherent causal power. Acceptance is tactical - to deconstruct from within.',
      realLifeExample: 'Like a physicist accepting Newton\'s laws for everyday use while knowing they\'re approximations superseded by relativity at deeper levels.'
    },
    {
      q: 'How do Feynman diagrams relate to these conditions?',
      a: 'Feynman diagrams show particle interactions as vertices and lines - relational nodes without inherent "force" flowing between them. Similarly, conditions are relational, not power-transmitting.',
      realLifeExample: 'An electrical circuit diagram shows connections, but the "power" isn\'t in the diagram itself - it emerges from the system\'s configuration, not from lines on paper.'
    },
    {
      q: 'If conditions have no inherent power, why do things still happen?',
      a: 'Things happen through the interdependent arising of all conditions together. No single condition "causes" the effect - the effect emerges from their relational configuration.',
      realLifeExample: 'A song emerges from musicians playing together. No single musician "causes" the song - it arises from their coordinated relationship.'
    },
    {
      q: 'What is the "void center" in the animation symbolizing?',
      a: 'The void center represents that when you look for the "essence" of the effect where all conditions converge, you find emptiness - no solid entity, just the holographic interference of conditions.',
      realLifeExample: 'Looking for the "you" where all your thoughts, feelings, and sensations converge - you find no solid self, just the dynamic interplay of processes.'
    },
    {
      q: 'How do Feynman diagrams precisely parallel the four conditions?',
      a: 'In Feynman diagrams, interaction vertices represent points where particles exchange virtual bosons — no inherent "force" travels along the lines. Each vertex is a relational node, not a power source. Similarly, the four pratyayas are relational descriptions of how phenomena co-arise: the efficient cause is like the incoming particle line, the object-support like the interaction vertex, the immediate condition like temporal ordering of the diagram, and the dominant condition like the coupling constant that enables but doesn\'t "cause" the interaction.',
      realLifeExample: 'A recipe lists ingredients, method, sequence, and oven temperature. None of these "possesses" the cake — together they describe the relational configuration from which the cake emerges.'
    }
  ],

  quiz: {
    beginner: {
      question: 'How many conditions are taught in Buddhist philosophy for phenomena to arise?',
      options: ['A) Two', 'B) Three', 'C) Four', 'D) Five'],
      correct: 'C',
      explanation: 'Buddhist philosophy teaches four conditions (pratyaya): efficient cause, object-support, immediate, and dominant condition.'
    },
    intermediate: {
      question: 'What does the interference pattern in the center represent?',
      options: [
        'A) The solid essence of the effect',
        'B) The holographic nature of effects - arising from conditions but lacking solid core',
        'C) The failure of conditions to produce anything',
        'D) The dominant condition\'s power'
      ],
      correct: 'B',
      explanation: 'The interference pattern shows that effects are like holograms - they appear from the convergence of conditions but have no solid, findable essence at their core.'
    },
    advanced: {
      question: 'How does Nagarjuna\'s treatment of the four conditions differ from Abhidharma orthodoxy?',
      options: [
        'A) He denies the four conditions exist',
        'B) He accepts them conventionally while negating their inherent causal efficacy',
        'C) He adds a fifth condition',
        'D) He claims only efficient cause matters'
      ],
      correct: 'B',
      explanation: 'Unlike Abhidharma which assigns inherent causal power to conditions, Nagarjuna accepts them conventionally while showing they lack svabhāva - the effect emerges relationally, not from inherent power.'
    }
  }
};

export const VERSE_1_3 = {
  id: 'v1_3',
  title: 'Essence vs. Conditions',
  sanskrit: {
    text: 'na hi svabhāvo bhāvānāṃ pratyayādiṣu vidyate',
    transliteration: 'na hi svabhāvo bhāvānāṃ pratyayādiṣu vidyate',
    translation: 'The inherent nature of things is not found in conditions and so forth'
  },

  philosophy: {
    insight: 'If things had Essence, they wouldn\'t need conditions. If they need conditions, they have no Essence.',
    madhyamaka: 'Svabhāva (inherent existence) and pratyaya (conditions) are mutually exclusive. If something exists inherently, it needs no conditions. If it depends on conditions, it has no inherent existence.',
    quantum: 'Kochen-Specker theorem: Properties (essence) do not exist independent of the measurement context (conditions).',
    bridge: 'Both reveal that "essence" and "context-dependence" are incompatible - you cannot have both.',
    accessible: 'If a lamp "inherently" produced light, it should produce light even when off. But it only lights up when electricity flows, the filament is intact, etc. The "power" to produce light is not a hidden essence inside the lamp — it emerges from conditions.',
    twoTruths: 'Conventionally, conditions have causal efficacy — seeds grow, medicines heal. Ultimately, no inherent "essence" passes from condition to result.',
    commonMisconception: 'NOT denying conditions work. Denying that conditions contain a hidden "essence" that transfers to the effect. Function without essence is the Middle Way.',
  },

  quantumResonance: {
    concept: 'Contextuality',
    score: 88,
    strength: 'High',
    explanation: 'Kochen-Specker Theorem shows properties do not exist independent of measurement context (conditions).',
    caveat: 'Both quantum contextuality and Madhyamaka deny pre-existing properties transferring between entities. Structural analogy only.',
  },

  animation: {
    geometry: 'Cube inside Wireframe Sphere',
    anchor: 'A rigid Gold Cube (symbolizing Essence/Svabhāva) suspended inside a Wireframe Sphere (Conditions).',
    texture: 'Cube: Solid, heavy, scratched gold metal. Sphere: Glowing electric blue grid lines.',
    mood: 'Paradoxical, shifting reality',
    colors: ['#FFD700', '#3B82F6', '#8B5CF6'],

    orchestration: {
      start: 'Gold cube sits stable inside the wireframe sphere.',
      drag: 'As user rotates the outer sphere (changing conditions), the inner gold cube flickers and turns transparent.',
      logic: 'Shows that "Essence" cannot survive the application of "Conditions." It disappears when context is applied.'
    },

    interaction: {
      click: 'Toggle between essence-view and conditions-view',
      drag: 'Rotate outer sphere to apply different "conditions"',
      hover: 'See the cube\'s opacity change based on condition proximity'
    },

    controls: {
      rotation: { default: false, speed: 0.3 },
      speed: { default: 40, min: 0, max: 100 },
      complexity: { default: 60, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'MeshStandardMaterial with metalness/roughness maps for gold cube',
      'drei Wireframe + Edges for glowing sphere grid lines',
      'Custom opacity shader driven by sphere rotation angle (context changes)',
      'Bloom post-processing for wireframe glow',
      'useSpring for smooth cube transparency transitions',
    ],
    camera: { position: [2, 2, 6], fov: 45, autoRotate: false },
    fps: 60,
    performanceNotes: '<250MB memory, 60 FPS. Simple geometry (box + sphere wireframe). Opacity shader is lightweight fragment-only.',

    tripoPrompt: 'A solid gold cube suspended inside a glowing blue wireframe sphere, studio lighting, hyperrealistic materials, contrast between solid metal and digital light.',

    visualBridge: 'Visualizes the incompatibility of Fixed Essence (Gold) and Dependent Origination (Wireframe Context).',
    educationalGoal: 'User sees that "essence" and "context-dependence" are incompatible — conditions work without possessing inherent power.',
  },

  deeperDive: [
    {
      q: 'What is svabhāva and why is it problematic?',
      a: 'Svabhāva means "own-nature" or inherent existence - existing independently, unchangingly, from its own side. It\'s problematic because anything with svabhāva couldn\'t change, interact, or depend on anything.',
      realLifeExample: 'If water had an inherent "wetness-essence," it couldn\'t freeze or evaporate. But water changes states constantly because it lacks svabhāva.'
    },
    {
      q: 'How does the Kochen-Specker theorem support this verse?',
      a: 'The theorem proves that quantum properties don\'t exist independent of measurement context. You can\'t assign definite values to all properties simultaneously - they emerge in context.',
      realLifeExample: 'The "color" of a chameleon doesn\'t exist independently - it emerges from the relationship between the chameleon and its environment. No fixed chameleon-color-essence.'
    },
    {
      q: 'Why does the gold cube become transparent when conditions are applied?',
      a: 'It visualizes that when you actually examine something in context (apply conditions), its supposed "solid essence" vanishes. Essence is only imagined when we ignore conditions.',
      realLifeExample: 'A "scary monster" in the dark seems solid until you turn on the light (apply conditions) - then it\'s revealed as a coat on a chair.'
    },
    {
      q: 'If things have no essence, what makes them what they are?',
      a: 'Things are what they are through the convergence of conditions, not through inherent essence. Identity is relational and processual, not fixed and essential.',
      realLifeExample: 'What makes you "you" isn\'t some soul-essence but the ongoing process of your body, memories, relationships, and experiences - all conditions, no fixed self.'
    },
    {
      q: 'Doesn\'t denying essence lead to nihilism?',
      a: 'No. Denying inherent existence (svabhāva) is not denying existence altogether. Things exist conventionally through dependent arising, just not inherently.',
      realLifeExample: 'Denying that a rainbow has inherent existence doesn\'t mean rainbows don\'t appear. They appear dependently - that\'s how they exist, not through essence.'
    },
    {
      q: 'What exactly does the Kochen-Specker theorem prove, and how does it map to svabhāva?',
      a: 'The Kochen-Specker theorem (1967) proves it is mathematically impossible to assign definite values to all quantum observables simultaneously in a context-independent way. Properties like spin emerge only relative to a chosen measurement basis — they have no pre-existing, context-free values. This maps precisely to svabhāva: if properties existed inherently (independently of context), you could assign them fixed values. The theorem shows you cannot. Properties are context-dependent, just as Nāgārjuna argues all phenomena are condition-dependent.',
      realLifeExample: 'Is a coin "heads" or "tails"? Only after you look at it relative to an orientation. Rotate your frame and the answer changes. The coin has no inherent "heads-ness" independent of how you observe it.'
    }
  ],

  quiz: {
    beginner: {
      question: 'What does svabhāva mean?',
      options: [
        'A) Dependent existence',
        'B) Inherent/own-nature existence',
        'C) Non-existence',
        'D) Conditional existence'
      ],
      correct: 'B',
      explanation: 'Svabhāva means "own-nature" or inherent existence - existing independently from its own side, without depending on anything else.'
    },
    intermediate: {
      question: 'Why are essence (svabhāva) and conditions (pratyaya) mutually exclusive?',
      options: [
        'A) They are the same thing',
        'B) If something has essence, it needs no conditions; if it needs conditions, it has no essence',
        'C) Conditions destroy essence',
        'D) Essence creates conditions'
      ],
      correct: 'B',
      explanation: 'If something existed inherently (had svabhāva), it would be self-sufficient and need no conditions. If it depends on conditions, it cannot have independent inherent existence.'
    },
    advanced: {
      question: 'How does quantum contextuality parallel Nagarjuna\'s argument?',
      options: [
        'A) Quantum properties exist independently like classical essence',
        'B) Both show that properties/essence cannot exist independent of context/conditions',
        'C) Quantum mechanics proves svabhāva exists',
        'D) Contextuality only applies to particles, not philosophy'
      ],
      correct: 'B',
      explanation: 'The Kochen-Specker theorem proves quantum properties emerge in measurement context, not independently - paralleling Nagarjuna\'s point that essence cannot exist separate from conditions.'
    }
  }
};

export const VERSE_1_4 = {
  id: 'v1_4',
  title: 'Power to Act',
  sanskrit: {
    text: 'kriyā na pratyayavatī nāpratyayavatī kriyā',
    transliteration: 'kriyā na pratyayavatī nāpratyayavatī kriyā',
    translation: 'Action does not possess conditions, nor is action without conditions'
  },

  philosophy: {
    insight: 'Conditions don\'t "possess" the power to produce results; power is not an item.',
    madhyamaka: 'Nagarjuna deconstructs the notion that conditions contain some "power" that gets transferred to the effect. Power is not a thing that can be possessed.',
    quantum: 'The wave function isn\'t a physical wave carrying force; it\'s a mathematical abstraction of potential.',
    bridge: 'Both frameworks show that "power" or "potential" is not a transferable substance but a relational description.',
    accessible: 'When you push a ball, does your "push-power" physically transfer into the ball? Or does the ball move because of the relational interaction? Nagarjuna argues conditions don\'t "possess" a transferable power — they function relationally.',
    twoTruths: 'Conventionally, conditions enable results through interaction. Ultimately, no inherent "power" exists as a transferable substance within conditions.',
    commonMisconception: 'NOT saying conditions are powerless. Saying power is not a THING inside conditions — it\'s a relational description of how conditions interact.',
  },

  quantumResonance: {
    concept: 'Probability Amplitude',
    score: 82,
    strength: 'High',
    explanation: 'The wave function isn\'t a physical wave carrying force; it\'s a mathematical abstraction of potential.',
    caveat: 'Quantum field interactions and Buddhist conditions both involve relational processes without substance transfer. Structural parallel.',
  },

  animation: {
    geometry: 'Fluid in Glass Container',
    anchor: 'A Fluid Simulation inside a glass container. The fluid is dormant.',
    texture: 'Fluid: Viscous, pearlescent purple liquid (#8B5CF6). Container: Invisible/Refractive glass.',
    mood: 'Ethereal, dreamlike, soft focus',
    colors: ['#8B5CF6', '#E0E7FF', '#06B6D4'],

    orchestration: {
      start: 'Purple fluid floats dormant in zero gravity.',
      click: 'User clicks a "Trigger" button. The fluid attempts to surge but passes through the glass walls as ghost-like mist.',
      logic: 'Shows that the "power" to act isn\'t contained within the object; it\'s a relational event, not a stored force.'
    },

    interaction: {
      click: 'Trigger the fluid to attempt action - watch it phase through',
      drag: 'Rotate container to view the non-substantial nature of power',
      hover: 'See fluid shimmer, hinting at potential that cannot actualize alone'
    },

    controls: {
      rotation: { default: true, speed: 0.2 },
      speed: { default: 30, min: 0, max: 100 },
      complexity: { default: 80, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'Custom fluid simulation shader (Navier-Stokes approximation in fragment shader)',
      'MeshPhysicalMaterial with transmission for invisible glass container',
      'InstancedMesh for ghost-mist particles when fluid phases through walls',
      'Bloom + DepthOfField post-processing for dreamlike atmosphere',
      'useFrame-driven fluid viscosity animation with configurable speed',
    ],
    camera: { position: [0, 0, 5], fov: 55, autoRotate: true },
    fps: 60,
    performanceNotes: '<350MB memory, 60 FPS. Fluid sim uses 2D texture-based approximation (not full 3D SPH). Ghost particles pooled via InstancedMesh.',

    tripoPrompt: 'Pearlescent purple fluid floating in zero gravity, contained in an invisible sphere, soft bioluminescent glow, 8K, macro photography style.',

    visualBridge: 'Demonstrates that "Power" (the fluid) is not a solid thing possessed by the "Condition" (the container).',
    educationalGoal: 'User grasps that causal "power" is relational, not a substance hidden inside conditions waiting to transfer.',
  },

  deeperDive: [
    {
      q: 'What does Nagarjuna mean by "action does not possess conditions"?',
      a: 'He\'s deconstructing the idea that conditions contain some transferable "power" or "force" that gets passed to the action. Power isn\'t a possessable item.',
      realLifeExample: 'We say a battery "has" power, but the battery doesn\'t contain little packets of force. "Power" describes a relationship between battery, circuit, and device - not a substance.'
    },
    {
      q: 'How does the wave function relate to this?',
      a: 'The quantum wave function describes probabilities, not a physical wave carrying force. It\'s a mathematical tool, not a substance that transfers "power" to particles.',
      realLifeExample: 'A weather forecast shows probability percentages - these numbers don\'t "cause" rain. They describe relationships between conditions. The probability isn\'t a force.'
    },
    {
      q: 'Why does the fluid pass through the glass as mist?',
      a: 'It visualizes that the "power" supposedly contained in conditions cannot actually be grasped or transferred. When you look for power as a thing, it dissolves.',
      realLifeExample: 'Try to grab your "motivation" as a thing. You can describe it, but you can\'t hold it. It\'s a relational process, not an object.'
    },
    {
      q: 'If power isn\'t a thing, how do causes produce effects?',
      a: 'Effects arise through the relational configuration of conditions, not through power-transfer. "Causation" describes relationships, not a mechanism of force delivery.',
      realLifeExample: 'How does a key open a lock? Not by transferring "opening power." The lock opens because of the relational fit between key shape and lock mechanism.'
    },
    {
      q: 'What\'s the practical implication of this teaching?',
      a: 'Stop looking for power, potential, or capability as things you possess or lack. They describe relationships and processes, not possessions.',
      realLifeExample: 'You don\'t "have" creativity as an object. Creativity emerges in the relationship between you, materials, context, and purpose. It\'s not stored in you.'
    },
    {
      q: 'Why is the wave function\'s |ψ|² a probability, not a force?',
      a: 'The Born rule gives |ψ|² as the probability density for finding a particle at a location. Crucially, ψ itself is not a physical wave carrying energy or force through space — it is a mathematical encoding of relational information about what WOULD happen given a measurement context. No "power" travels from ψ to the particle. This mirrors Nāgārjuna\'s point exactly: conditions don\'t possess transferable power. The wave function describes relational potential, not a substance that acts.',
      realLifeExample: 'A bus timetable describes when buses will arrive, but the timetable doesn\'t "power" the buses. It encodes relational information. Confusing the description for the mechanism is the error both Nāgārjuna and quantum mechanics correct.'
    }
  ],

  quiz: {
    beginner: {
      question: 'According to Nagarjuna, where is "power to act" located?',
      options: [
        'A) In the cause',
        'B) In the effect',
        'C) Nowhere as a possessable item - it\'s relational',
        'D) In the conditions'
      ],
      correct: 'C',
      explanation: 'Nagarjuna shows that power is not a thing that can be located or possessed. It\'s a relational description, not an item to be found somewhere.'
    },
    intermediate: {
      question: 'How does the wave function parallel Nagarjuna\'s point about power?',
      options: [
        'A) The wave function is a physical force that moves particles',
        'B) The wave function describes probabilities relationally, not as transferable substance',
        'C) Wave functions prove power exists inherently',
        'D) There is no parallel'
      ],
      correct: 'B',
      explanation: 'Like power in Nagarjuna\'s analysis, the wave function is a relational/mathematical description, not a physical substance carrying force from cause to effect.'
    },
    advanced: {
      question: 'What error does reifying "power" commit according to Madhyamaka?',
      options: [
        'A) It correctly identifies the mechanism of causation',
        'B) It treats a relational process as if it were an inherently existing thing',
        'C) It denies causation',
        'D) It follows the middle way'
      ],
      correct: 'B',
      explanation: 'Reifying power means treating a relational description as if it were an inherently existing substance - the fundamental error Madhyamaka deconstructs throughout.'
    }
  }
};

export const VERSE_1_5 = {
  id: 'v1_5',
  title: 'Relational Causality',
  sanskrit: {
    text: 'utpadyate pratītyemān itīme pratyayāḥ kila',
    transliteration: 'utpadyate pratītyemān itīme pratyayāḥ kila',
    translation: 'These are called conditions because in dependence on them [the effect] arises'
  },

  philosophy: {
    insight: 'A condition is only a condition IF an effect arises. It\'s a circular definition.',
    madhyamaka: 'The definition of "condition" depends on the effect arising - but the effect depends on the condition. Neither can be established first; both are mutually defined.',
    quantum: 'The Delayed Choice Quantum Eraser shows that measurement of the effect determines the history of the cause. The future defines the past.',
    bridge: 'Both reveal retro-dependence: the "cause" is defined by the "effect," not the other way around.',
    accessible: 'Consider a photograph. We call it a photo "of" something — but the scene was defined by the photo, and the photo by the scene. Which came first? Neither — they co-define each other. Similarly, cause and effect are retro-dependent.',
    twoTruths: 'Conventionally, causes precede effects in time. Ultimately, "cause" is only designated as such AFTER the effect — the cause is retro-dependent on the effect.',
    commonMisconception: 'NOT saying time runs backwards. Saying the DESIGNATION "cause" is retrospective — we call something a "cause" only after seeing its "effect."',
  },

  quantumResonance: {
    concept: 'Delayed Choice Quantum Eraser',
    score: 95,
    strength: 'High',
    explanation: 'The measurement of the effect (photon path) determines the history of the cause. Retro-dependence.',
    caveat: 'Delayed-choice experiments and retro-designation share the structure of backwards-looking definition. Educational analogy.',
  },

  animation: {
    geometry: 'Infinity Symbol (Two Linked Rings)',
    anchor: 'Two linked rings, Ring A (Cause) and Ring B (Effect), forming an infinity symbol (∞).',
    texture: 'Ring A: Dull, rusted iron (inactive). Ring B: Bright, glowing neon green (#10B981).',
    mood: 'Temporal distortion, sci-fi, "Tenet" style',
    colors: ['#78716C', '#10B981', '#8B5CF6'],

    orchestration: {
      start: 'Two rings form an infinity symbol, Ring A dull, Ring B glowing.',
      scroll: 'As the user scrolls, Ring B (Effect) lights up FIRST. Only AFTER B lights up does a stream of energy flow BACKWARDS to light up Ring A.',
      logic: 'Visualizes retro-dependence. The cause (A) only becomes a cause because the effect (B) happened.'
    },

    interaction: {
      click: 'Trigger the temporal sequence to play',
      drag: 'Scrub through time to see cause-effect relationship',
      hover: 'See energy flow direction reverse from normal causation'
    },

    controls: {
      rotation: { default: true, speed: 0.4 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 50, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'drei Torus geometry with PBR rust/metal material for Ring A',
      'Custom emissive shader with animated energy flow for Ring B',
      'InstancedMesh for energy arc particles traveling between rings',
      'Bloom + ToneMapping post-processing for neon glow contrast',
      'useSpring for reverse-time energy flow animation',
    ],
    camera: { position: [0, 0, 6], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<300MB memory, 60 FPS. Two torus meshes with shared buffer geometry. Energy arcs use 200 instanced particles with UV-scrolling trail shader.',

    tripoPrompt: 'Two interlocking toruses forming an infinity sign, one rusted metal, one glowing neon green, energy arcing between them, dark background, cinematic lighting.',

    visualBridge: 'Directly maps the Delayed Choice experiment to Nagarjuna\'s argument that the "Cause" is defined by the "Effect."',
    educationalGoal: 'User understands retro-dependence: the "cause" is defined by the "effect," not the other way around.',
  },

  deeperDive: [
    {
      q: 'What makes a condition a condition?',
      a: 'According to this verse, a condition is only called a "condition" because an effect arises from it. Without the effect, there\'s no basis for calling something a condition.',
      realLifeExample: 'A match is only a "cause of fire" once fire appears. Before that, it\'s just a match. The fire defines it retroactively as a cause.'
    },
    {
      q: 'How does the Delayed Choice Quantum Eraser show retro-causation?',
      a: 'In this experiment, a measurement made AFTER a photon has traveled can determine whether it behaved as a wave or particle during its journey. The future measurement defines past behavior.',
      realLifeExample: 'Imagine your choice of restaurant tonight somehow determined what you ate for breakfast this morning. That\'s the temporal weirdness revealed by quantum eraser experiments.'
    },
    {
      q: 'Why is the cause-effect relationship circular?',
      a: 'The cause needs the effect to be called a cause, and the effect needs the cause to arise. Neither can be established independently - they mutually define each other.',
      realLifeExample: 'Is "parent" or "child" primary? Neither - they arise together in relationship. You become a parent the moment your child is born, not before.'
    },
    {
      q: 'Does this mean causation is just a mental construct?',
      a: 'It means inherent causation is unfindable. Conventionally, we use causal language practically. But upon analysis, we can\'t find an independently real causal mechanism.',
      realLifeExample: 'Money is a social construct but still functions. Causation is similar - useful conventionally, empty upon analysis.'
    },
    {
      q: 'What does the infinity symbol represent here?',
      a: 'The mutual dependence of cause and effect - neither comes first, both define each other in an endless loop. There\'s no starting point in causal analysis.',
      realLifeExample: 'The chicken-and-egg problem: which came first? Neither - they co-evolved in mutual dependence. The question assumes a false linear origin.'
    },
    {
      q: 'What precisely happens in the Delayed Choice Quantum Eraser, and why does it matter here?',
      a: 'In Kim et al.\'s 1999 experiment, entangled photon pairs are created. One photon (signal) hits a screen; the other (idler) is sent through a choice apparatus. If the idler\'s which-path information is "erased" (by directing it to a beam-splitter), the signal photon\'s pattern retroactively shows interference — even though the signal hit the screen BEFORE the idler\'s path was chosen. The future measurement context defines the past behavior. This maps to Nāgārjuna\'s point: a "condition" is only designated as such retroactively, once the effect is observed. The effect defines the cause, just as the idler measurement defines the signal pattern.',
      realLifeExample: 'A goal in football retroactively makes the pass "the assist." Before the goal, it was just a pass. The effect (goal) defines the cause (assist) after the fact.'
    }
  ],

  quiz: {
    beginner: {
      question: 'When does something become a "condition" according to this verse?',
      options: [
        'A) Before the effect arises',
        'B) Only when the effect arises - it\'s defined retroactively',
        'C) It\'s always been a condition',
        'D) After analysis proves it'
      ],
      correct: 'B',
      explanation: 'A condition is only called a condition because an effect arises from it. The effect defines the condition retroactively - circular dependence.'
    },
    intermediate: {
      question: 'What does the Delayed Choice Quantum Eraser reveal about time and causation?',
      options: [
        'A) Causes always precede effects in time',
        'B) Future measurements can determine past behavior - retro-dependence',
        'C) Time doesn\'t exist',
        'D) Effects precede causes always'
      ],
      correct: 'B',
      explanation: 'The experiment shows that a measurement made later can retroactively determine whether a photon behaved as wave or particle earlier - challenging linear causation.'
    },
    advanced: {
      question: 'How does mutual definition of cause and effect undermine svabhāva?',
      options: [
        'A) It doesn\'t - causes still have inherent existence',
        'B) Mutual definition shows neither cause nor effect can be established independently - no svabhāva',
        'C) Only effects lack svabhāva',
        'D) Mutual definition proves circular causation exists inherently'
      ],
      correct: 'B',
      explanation: 'If cause and effect mutually define each other, neither can exist independently from its own side. This lack of independent establishment means no svabhāva for either.'
    }
  }
};

export const VERSE_1_6 = {
  id: 'v1_6',
  title: 'Existence vs. Non-existence',
  sanskrit: {
    text: 'nāsato naiva sataś ca pratyayo \'rthasya yujyate',
    transliteration: 'nāsato naiva sataś ca pratyayo \'rthasya yujyate',
    translation: 'A condition is not appropriate for an existent or a non-existent thing'
  },

  philosophy: {
    insight: 'If X exists, it needs no cause. If X doesn\'t exist, it can\'t have a cause.',
    madhyamaka: 'Nagarjuna shows the dilemma: existing things don\'t need to be caused (they already exist), and non-existing things can\'t be caused (there\'s nothing to cause).',
    quantum: 'Virtual particles popping in/out of existence. They exist and don\'t exist simultaneously through the uncertainty principle.',
    bridge: 'Both show that the boundary between existence and non-existence is not as clear as we assume.',
    accessible: 'Can something that doesn\'t exist act as a condition? Can something that does exist need a condition? If a seed already IS a tree, it doesn\'t need conditions. If it ISN\'T a tree at all, conditions can\'t help. The boundary between existence and non-existence is not as clear as we assume.',
    twoTruths: 'Conventionally, existent conditions produce existent effects. Ultimately, neither the existence nor non-existence of conditions can be inherently established.',
    commonMisconception: 'NOT saying conditions don\'t exist. Showing that their MODE of existence (inherently existent or non-existent) cannot be pinned down.',
  },

  quantumResonance: {
    concept: 'Vacuum Fluctuations',
    score: 89,
    strength: 'High',
    explanation: 'Virtual particles popping in/out. They exist and don\'t exist simultaneously (uncertainty principle).',
    caveat: 'Quantum vacuum fluctuations and the existence/non-existence boundary share structural ambiguity. Not claiming physical equivalence.',
  },

  animation: {
    geometry: 'Quantum Foam Surface',
    anchor: 'A Quantum Foam surface—a bubbling, boiling plane.',
    texture: 'Surface: Dark liquid mirror (#050520). Bubbles: Bright white emission.',
    mood: 'Chaotic, energetic, high contrast',
    colors: ['#050520', '#FFFFFF', '#8B5CF6'],

    orchestration: {
      start: 'Dark surface with white bubbles constantly appearing and disappearing.',
      autoPlay: 'Bubbles (Entities) pop into existence. If the user tries to click one to "stabilize" it (make it Existent), it instantly pops (Non-existent). If they click empty space, a bubble appears.',
      logic: 'Shows the futility of pinning down "Existence" or "Non-existence." The condition (click) fails in both states.'
    },

    interaction: {
      click: 'Try to stabilize a bubble (existent) - it pops. Click empty space - bubble appears',
      drag: 'Pan across the foam surface',
      hover: 'Bubbles near cursor momentarily solidify then vanish'
    },

    controls: {
      rotation: { default: false, speed: 0 },
      speed: { default: 70, min: 0, max: 100 },
      complexity: { default: 90, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'Custom noise-displacement shader for boiling foam surface (Simplex 3D noise)',
      'InstancedMesh for bubble particles with scale-up/pop lifecycle (500+ pooled)',
      'MeshPhysicalMaterial with clearcoat for dark liquid mirror reflections',
      'Bloom post-processing for white emission flashes on bubble pop',
      'Raycaster-driven click interaction for stabilize/spawn bubbles',
    ],
    camera: { position: [0, 4, 4], fov: 60, autoRotate: false },
    fps: 60,
    performanceNotes: '<350MB memory, 60 FPS. Foam surface is a single plane with vertex-displaced noise shader. Bubbles use pooled InstancedMesh with lifecycle manager.',

    tripoPrompt: 'Dark boiling liquid surface, bright white bubbles emerging and popping instantly, macro shot, depth of field, high contrast, abstract physics simulation.',

    visualBridge: 'Symbolizes the Vacuum where existence and non-existence are in constant, ungraspable flux.',
    educationalGoal: 'User sees that the boundary between existence and non-existence is not sharp — conditions transcend the existent/non-existent binary.',
  },

  deeperDive: [
    {
      q: 'Why can\'t existing things need causes?',
      a: 'If something already exists, it doesn\'t need to be brought into existence - it\'s already there. Causation is supposed to bring something into being, but existing things are already in being.',
      realLifeExample: 'You can\'t "cause" Tuesday to exist on Tuesday - it\'s already Tuesday. Causation would be redundant for something already existing.'
    },
    {
      q: 'Why can\'t non-existing things have causes?',
      a: 'If something doesn\'t exist, there\'s no "thing" there to be caused. Causes need something to act on. How can a cause produce nothing into something?',
      realLifeExample: 'You can\'t paint a picture on a canvas that doesn\'t exist. There needs to be something for the brush to touch.'
    },
    {
      q: 'What are vacuum fluctuations?',
      a: 'Quantum vacuum fluctuations are temporary appearances of particle-antiparticle pairs that pop into and out of existence due to the uncertainty principle. They blur the line between existence and non-existence.',
      realLifeExample: 'Imagine bubbles in boiling water - they appear and vanish so quickly you can\'t say whether they\'re "there" or "not there" at any moment.'
    },
    {
      q: 'How does this verse avoid nihilism?',
      a: 'It doesn\'t deny that things conventionally exist. It shows that "existence" and "non-existence" as inherent categories don\'t hold up to analysis. Conventional reality remains.',
      realLifeExample: 'Day and night seem like clear opposites, but at twilight, you can\'t definitively say which it is. This doesn\'t mean there\'s no daytime or nighttime.'
    },
    {
      q: 'What does the quantum foam represent philosophically?',
      a: 'It represents the fundamental uncertainty at the boundary of existence/non-existence. Reality isn\'t cleanly divided into "things that exist" and "things that don\'t."',
      realLifeExample: 'Is a dream existent or non-existent? While dreaming, it seems real. Upon waking, it seems unreal. The boundary is fuzzy.'
    },
    {
      q: 'How does the energy-time uncertainty relation (ΔE·Δt ≥ ħ/2) map to this verse\'s dilemma?',
      a: 'The energy-time uncertainty relation permits virtual particle pairs to "borrow" energy ΔE for a duration Δt, as long as ΔE·Δt ≥ ħ/2. During Δt, the particles are neither fully existent (they violate energy conservation and cannot be directly detected) nor fully nonexistent (they produce measurable effects like the Casimir force and Lamb shift). This maps precisely to Nāgārjuna\'s verse: existing things don\'t need to be caused (they\'re already there), nonexistent things can\'t be caused (nothing to act on), yet virtual particles occupy exactly this in-between — temporarily real enough to have effects, but not permanent enough to count as "existing."',
      realLifeExample: 'A loan lets you spend money you don\'t "have" — temporarily it\'s real (you bought something), but ultimately it must be repaid. The money was neither fully yours nor fully absent. Virtual particles are the universe\'s shortest-term loans.'
    }
  ],

  quiz: {
    beginner: {
      question: 'According to Nagarjuna, can causation work on existing things?',
      options: [
        'A) Yes, causes make existing things more real',
        'B) No - existing things don\'t need to be brought into existence',
        'C) Only sometimes',
        'D) Only for big things'
      ],
      correct: 'B',
      explanation: 'If something already exists, causation is redundant - there\'s nothing more to bring into existence. Causes are supposed to produce what isn\'t yet.'
    },
    intermediate: {
      question: 'How do vacuum fluctuations relate to the existence/non-existence dilemma?',
      options: [
        'A) They prove things exist inherently',
        'B) They show particles can be neither clearly existent nor non-existent',
        'C) They have no philosophical relevance',
        'D) They prove non-existence'
      ],
      correct: 'B',
      explanation: 'Virtual particles in vacuum fluctuations pop in/out so rapidly they can\'t be classified as simply "existent" or "non-existent" - paralleling Nagarjuna\'s point.'
    },
    advanced: {
      question: 'What does Nagarjuna\'s dilemma reveal about the concept of causation itself?',
      options: [
        'A) Causation is perfect and analyzable',
        'B) The concept of causation presupposes a problematic existence/non-existence boundary',
        'C) Causation only works for non-existent things',
        'D) Causation only works for existent things'
      ],
      correct: 'B',
      explanation: 'Nagarjuna shows that our concept of causation assumes things transition from non-existence to existence, but this boundary can\'t be established, problematizing the entire notion.'
    }
  }
};

export const VERSE_1_7 = {
  id: 'v1_7',
  title: 'Productive Cause',
  sanskrit: {
    text: 'naivāsato naiva sataḥ pratyayo \'rthasya yujyate',
    transliteration: 'naivāsato naiva sataḥ pratyayo \'rthasya yujyate',
    translation: 'Neither for the non-existent nor for the existent is a condition appropriate'
  },

  philosophy: {
    insight: 'Rejection of a "productive cause" (a connecting force). Correlations exist, but no "glue."',
    madhyamaka: 'There is no findable mechanism connecting cause to effect. Correlations appear, but no inherent "production" can be found.',
    quantum: 'Quantum entanglement shows non-local correlations without any physical signal traveling between particles. Correlation without causation.',
    bridge: 'Both reveal that correlation is real but the "productive cause" or "connecting mechanism" is empty.',
    accessible: 'Imagine two particles that are "entangled" — measuring one instantly reveals the other\'s state. There\'s real correlation but no physical signal connecting them. Similarly, conditions and effects are correlated, but there\'s no inherent "connecting mechanism" transferring essence from cause to effect.',
    twoTruths: 'Conventionally, conditions produce effects through apparent mechanisms. Ultimately, the productive "link" between condition and effect is empty — correlation is real but mechanism is unfindable.',
    commonMisconception: 'NOT saying cause-effect is random or illusory. The CORRELATION is real — what\'s empty is the inherent "productive link" or mechanism.',
  },

  quantumResonance: {
    concept: 'Quantum Entanglement',
    score: 94,
    strength: 'High',
    explanation: 'Non-locality. Two particles correlate instantly without any physical signal (productive cause) traveling between them.',
    caveat: 'Entanglement correlations without mechanism and Buddhist dependent arising without inherent link share structural features. Analogy only.',
  },

  animation: {
    geometry: 'Two Separated Spheres',
    anchor: 'Two separated Spheres (Particle A and Particle B) far apart in the scene.',
    texture: 'Spheres: Polished obsidian with internal galaxy texture. Space Between: Absolutely empty, clear void.',
    mood: 'Spooky action at a distance, mysterious, silent',
    colors: ['#1E1E2E', '#3B82F6', '#EF4444', '#8B5CF6'],

    orchestration: {
      start: 'Two obsidian spheres float far apart in empty space.',
      clickA: 'Sphere A spins Clockwise and turns Blue.',
      instantReaction: 'Sphere B instantly spins Counter-Clockwise and turns Red.',
      visualCheck: 'A "scanner" light sweeps the space between them to find a wire or beam (the "Productive Cause") but finds NOTHING.'
    },

    interaction: {
      click: 'Click either sphere to trigger correlated response in the other',
      drag: 'Rotate scene to verify empty space between spheres',
      hover: 'Spheres pulse with galaxy texture, hinting at hidden connection'
    },

    controls: {
      rotation: { default: true, speed: 0.3 },
      speed: { default: 40, min: 0, max: 100 },
      complexity: { default: 60, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true
    },

    r3fTechniques: [
      'Custom galaxy-texture shader inside spheres (noise + spiral UV distortion)',
      'MeshPhysicalMaterial with clearcoat for obsidian surface',
      'InstancedMesh for scanner light sweep particles (300 pooled)',
      'Bloom + Vignette post-processing for spooky atmosphere',
      'useFrame-driven instant correlation animation (simultaneous spin triggers)',
    ],
    camera: { position: [0, 2, 10], fov: 45, autoRotate: true },
    fps: 60,
    performanceNotes: '<300MB memory, 60 FPS. Two sphere meshes with shared galaxy shader (single texture, mirrored). Scanner sweep is a single instanced line of particles.',

    tripoPrompt: 'Two levitating obsidian spheres with internal galaxies, separated by empty space, soft rim lighting, minimal composition, 8K, photorealistic.',

    visualBridge: 'Perfect visual for Entanglement and Nagarjuna\'s denial of a "productive link." The correlation is real; the causal mechanism is empty.',
    educationalGoal: 'User grasps that correlation between conditions and effects is real, but the "productive cause" or "connecting mechanism" is empty.',
  },

  deeperDive: [
    {
      q: 'What is a "productive cause" and why does Nagarjuna reject it?',
      a: 'A productive cause would be some mechanism or force that actively "produces" the effect - a connecting glue. Nagarjuna shows no such mechanism can be found upon analysis.',
      realLifeExample: 'We say fire "causes" smoke, but where exactly is the "producing force"? We see fire, then smoke, but no visible "causation-substance" traveling between them.'
    },
    {
      q: 'How does quantum entanglement demonstrate "correlation without mechanism"?',
      a: 'Entangled particles show correlated measurements instantly across any distance, with no signal traveling between them. The correlation is real, but there\'s no "productive" mechanism.',
      realLifeExample: 'Imagine twins who always sneeze at the same moment no matter how far apart, with no phone call or signal between them. Correlation without connection.'
    },
    {
      q: 'If there\'s no productive cause, why do things seem to follow causes?',
      a: 'Conventional causal patterns appear regularly and reliably. We\'re not denying that regularity. We\'re denying that there\'s an inherently existing "production mechanism" underlying it.',
      realLifeExample: 'Day follows night reliably, but there\'s no "day-production-force." The sun rises, conditions change, and we label it "day." Regularity without inherent mechanism.'
    },
    {
      q: 'What did Einstein call this "spooky action at a distance"?',
      a: 'Einstein was troubled by entanglement because it seemed to violate locality - things affecting each other without any mediating force. He called it "spooky" but experiments prove it\'s real.',
      realLifeExample: 'It\'s as if shaking hands with someone in New York instantly moves a pen in Tokyo, with absolutely nothing traveling between. Spooky, but real.'
    },
    {
      q: 'Does this verse deny that causation works?',
      a: 'No. It denies that causation works through an inherently existing "production mechanism." Causal patterns appear, but the "glue" connecting cause to effect is unfindable.',
      realLifeExample: 'GPS works reliably, but no one has ever seen or touched "navigation-force." It works through relationships, not through some inherent connecting substance.'
    },
    {
      q: 'What does Bell\'s theorem prove about the "productive link" between entangled particles?',
      a: 'Bell\'s theorem (1964) and its experimental confirmations (Aspect 1982, Hensen 2015) prove that no theory of local hidden variables can reproduce all quantum predictions. This means the correlations between entangled particles cannot be explained by any pre-existing shared information or any signal traveling between them at or below light speed. The correlation is real and experimentally verified, but the "productive mechanism" connecting the particles is provably absent. This is the physics analogue of Nāgārjuna\'s rejection of a "productive cause" (kāraṇa): correlations between conditions and effects are observed and reliable, but no inherently existing connecting mechanism can be found upon analysis.',
      realLifeExample: 'Identical twins raised apart sometimes make eerily similar life choices. No hidden phone line connects them. The correlations are real, but there\'s no "twin-force" traveling between them. The connection is relational (shared genes, similar biology), not mechanistic.'
    }
  ],

  quiz: {
    beginner: {
      question: 'What does the empty space between the two spheres represent?',
      options: [
        'A) The distance causes take to travel',
        'B) The absence of any "productive cause" or connecting mechanism',
        'C) Time between cause and effect',
        'D) Nothing important'
      ],
      correct: 'B',
      explanation: 'The empty space shows that while the spheres correlate, there\'s no visible "glue" or productive mechanism connecting them - correlation without inherent causation.'
    },
    intermediate: {
      question: 'Why did Einstein find quantum entanglement troubling?',
      options: [
        'A) It was too complicated mathematically',
        'B) It suggested instantaneous correlation without any mediating signal or force',
        'C) It proved his theories wrong in all areas',
        'D) He didn\'t understand it'
      ],
      correct: 'B',
      explanation: 'Einstein called it "spooky action at a distance" because entanglement implies correlation without any local hidden mechanism - something his intuition resisted.'
    },
    advanced: {
      question: 'How does Nagarjuna\'s rejection of productive cause relate to his rejection of svabhāva?',
      options: [
        'A) They are unrelated arguments',
        'B) A truly inherent productive cause would require svabhāva, which he\'s already shown is untenable',
        'C) Productive cause is the same as svabhāva',
        'D) Productive cause exists but svabhāva doesn\'t'
      ],
      correct: 'B',
      explanation: 'A "real" productive mechanism would need to exist inherently (have svabhāva) to do the producing. Since svabhāva is already refuted, inherent productive causation falls too.'
    }
  }
};

// Export all verses as an array for easy iteration
export const CHAPTER_1_VERSES = [
  VERSE_1_1,
  VERSE_1_2,
  VERSE_1_3,
  VERSE_1_4,
  VERSE_1_5,
  VERSE_1_6,
  VERSE_1_7
];

export default {
  config: CHAPTER_1_CONFIG,
  verses: CHAPTER_1_VERSES
};
