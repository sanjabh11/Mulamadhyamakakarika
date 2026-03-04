# Gold Standard Template — Verse Data Enhancement

> Reference document for replicating the Chapter 1 enhancement pattern across all 27 chapters.

## File Location

Each chapter's canonical data lives at `data/chapters/chapter-N.js`.
Chapters 1's detailed animation/Q&A for v1-7 lives in `data/animations/chapter1-verses.js` and is re-exported via `data/chapters/chapter-1.js`.

## Verse Object Structure

```js
const VERSE_N = {
  id: 'vC_N',          // e.g. 'v1_1', 'v2_3'
  number: N,
  title: 'Descriptive Title (not just "Verse N")',

  sanskrit: {
    text: 'Sanskrit in IAST transliteration',
    transliteration: 'Same or romanised',
    translation: 'English translation (Garfield primary, cross-ref Kalupahana/Siderits)',
    devanagari: '(optional) Devanāgarī script',
  },

  philosophy: {
    insight:            'One-paragraph core insight — what this verse establishes.',
    madhyamaka:         'Scholarly consensus (Garfield + Kalupahana + Siderits/Katsura). Name the commentators. Cite specific claims.',
    quantum:            'Precise quantum physics concept with technical name. No vague analogies.',
    bridge:             'How the two frameworks illuminate each other. Emphasise structural parallel, not identity.',
    accessible:         'Beginner-friendly explanation with everyday analogy. Must be accurate to both traditions.',
    twoTruths:          'How the verse functions at conventional level (things work) vs ultimate level (empty of svabhāva).',
    commonMisconception:'Explicit address of likely misreading (e.g. "This is NOT nihilism — emptiness enables function").',
  },

  quantumResonance: {
    concept: 'Named quantum concept (e.g. "Superposition", "Bell\'s Theorem")',
    score: 85,               // 0-100 — how precisely the quantum concept maps to the verse
    strength: 'High',        // Low / Medium / High — qualitative label alongside numeric score
    explanation: 'One sentence justifying the score.',
    caveat: 'Educational structural analogy, not literal equivalence. Scholarly consensus treats these as inspired parallels.',
  },

  animation: {
    // --- Visual Design ---
    geometry:    'Named shape/scene (e.g. "Tetrahedron", "Bell Test Correlation Visualiser")',
    anchor:      'One-sentence scene description for the 3D artist.',
    texture:     'Material descriptions with hex colours.',
    mood:        'Emotional tone keywords.',
    colors:      ['#HEX1', '#HEX2', '#HEX3'],

    // --- Interaction Choreography ---
    orchestration: {
      start:  'Initial scene state.',
      click:  'What happens on user click.',
      reveal: 'Final "aha" moment / philosophical reveal.',
    },
    interaction: {
      click: 'Click behaviour description.',
      drag:  'Drag behaviour description.',
      hover: 'Hover behaviour description.',
    },

    // --- Controls ---
    controls: {
      rotation:    { default: true, speed: 0.5 },
      speed:       { default: 50, min: 0, max: 100 },
      complexity:  { default: 50, min: 0, max: 100 },
      zoom:        { default: 100, min: 50, max: 200 },
      colorPicker: true,
      autoRevealToggle: true,  // progressive disclosure toggle
    },

    // --- R3F Implementation ---
    r3fTechniques: [
      'Technique 1 (e.g. "InstancedMesh for particles (2000 pooled)")',
      'Technique 2 (e.g. "Custom shader for volumetric fog")',
      'Technique 3 (e.g. "Bloom + ChromaticAberration post-processing")',
      'Technique 4 (e.g. "drei MeshTransmissionMaterial for glass")',
      'Technique 5 (e.g. "useSpring for smooth transitions")',
    ],
    camera: { position: [0, 2, 8], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<400MB memory, 60 FPS on mid-tier GPU. [Specific optimisation strategy].',

    // --- AI Generation ---
    tripoPrompt: '8K prompt for AI 3D model generation.',
    visualBridge: 'One sentence: how the visual encodes the philosophical point.',
    educationalGoal: 'What the user should understand after interacting with this animation.',
  },

  // --- Q&A Panel (6 progressive pairs) ---
  deeperDive: [
    {
      q: 'Beginner question',
      a: 'Clear answer grounded in Madhyamaka.',
      realLifeExample: 'Everyday analogy that makes it click.',
    },
    {
      q: 'Follow-up question (builds on Q1)',
      a: 'Deeper answer.',
      realLifeExample: 'Another relatable example.',
    },
    {
      q: 'Quantum-Buddhist alignment question',
      a: 'Precise physics + precise philosophy. Name theorems, cite experiments.',
      realLifeExample: 'Example bridging both worlds.',
    },
    {
      q: 'Common misunderstanding / objection',
      a: 'Address it directly.',
      realLifeExample: 'Real-world counter-example.',
    },
    {
      q: 'Practical / emotional significance',
      a: 'How this applies to life.',
      realLifeExample: 'Concrete life situation.',
    },
    {
      q: 'How this verse fits the chapter\'s argument',
      a: 'Progressive logic linking to previous and next verses.',
      deeper: '(optional) Advanced note for scholars.',
    },
  ],

  // --- Quiz (3 tiers) ---
  quiz: {
    beginner: {
      question: 'Simple conceptual question.',
      options: ['A) ...', 'B) ...', 'C) ...', 'D) ...'],
      correct: 'B',
      explanation: 'Why B is correct.',
    },
    intermediate: {
      question: 'Requires understanding the quantum parallel.',
      options: ['A) ...', 'B) ...', 'C) ...', 'D) ...'],
      correct: 'B',
      explanation: 'Why B is correct.',
    },
    advanced: {
      question: 'Requires synthesis of both frameworks.',
      options: ['A) ...', 'B) ...', 'C) ...', 'D) ...'],
      correct: 'B',
      explanation: 'Why B is correct.',
    },
  },
};
```

## Quality Checklist

### Philosophy
- [ ] `madhyamaka` cites Garfield AND Kalupahana (+ Siderits/Katsura where relevant)
- [ ] `insight` is accurate to the verse's argument within the chapter's progression
- [ ] No oversimplification of Madhyamaka (emptiness ≠ nothingness)
- [ ] `accessible` uses a real-world analogy that is genuinely parallel, not misleading
- [ ] `twoTruths` distinguishes conventional functioning from ultimate emptiness
- [ ] `commonMisconception` explicitly addresses nihilism risk or other beginner errors

### Quantum Physics
- [ ] `quantum` names a specific concept/theorem (not vague "quantum weirdness")
- [ ] Physics description is accurate (no pop-sci distortions)
- [ ] `bridge` explains structural parallel without claiming identity
- [ ] `quantumResonance.score` reflects actual precision of the mapping (80-95 typical)
- [ ] `quantumResonance.strength` has qualitative label (Low/Medium/High)
- [ ] `quantumResonance.caveat` explicitly frames as structural analogy, not literal equivalence

### Animation
- [ ] `geometry` is a named, buildable 3D scene (not abstract)
- [ ] `orchestration` has clear start → click → reveal narrative arc
- [ ] `r3fTechniques` lists 5 specific React Three Fiber techniques
- [ ] `performanceNotes` specifies memory budget and FPS target
- [ ] Visual directly encodes the philosophical point (`visualBridge`)
- [ ] `educationalGoal` states what user should understand post-interaction
- [ ] `controls.autoRevealToggle` present for progressive disclosure

### Q&A Panel
- [ ] Exactly 6 pairs (not 10 — right panel gets too crowded)
- [ ] Progressive depth: beginner → quantum alignment → objection → practical → chapter context
- [ ] Every pair has `realLifeExample` (last pair may use `deeper` instead)
- [ ] Quantum Q&A cites specific experiments/theorems with dates

### Quiz
- [ ] 3 tiers: beginner (concept), intermediate (quantum parallel), advanced (synthesis)
- [ ] 4 options each, one correct
- [ ] Explanation provided for correct answer

## Quantum Concept Assignments (Chapter 1 Reference)

| Verse | Quantum Concept | Resonance Score |
|-------|----------------|-----------------|
| 1 | Superposition (qubit states) | 92 |
| 2 | Feynman Diagrams (interaction vertices) | 85 |
| 3 | Kochen-Specker Theorem (contextuality) | 88 |
| 4 | Probability Amplitude (|ψ|² as relational) | 82 |
| 5 | Delayed Choice Quantum Eraser (retro-dependence) | 95 |
| 6 | Vacuum Fluctuations (ΔE·Δt uncertainty) | 89 |
| 7 | Entanglement / Bell's Theorem (no productive cause) | 94 |
| 8 | Measurement Problem (observer-object co-arising) | 90 |
| 9 | Decoherence / Arrow of Time (no clean cessation) | 87 |
| 10 | Non-Locality / Bell's Theorem (emptiness enables DO) | 91 |
| 11 | Superposition / Born Rule (effect not in conditions) | 89 |
| 12 | Vacuum Fluctuations (structured emergence) | 88 |
| 13 | Entanglement / Non-Separability (mutual emptiness) | 93 |
| 14 | Complementarity (mutual dissolution) | 92 |

## Chapter Theme Mapping (for quantum concept selection)

Each chapter has a primary quantum theme. Select per-verse concepts that are sub-topics of the theme.

| Chapter | Title | Primary Quantum Theme |
|---------|-------|-----------------------|
| 1 | Examination of Conditions | Superposition / Entanglement / Measurement |
| 2 | Examination of Motion | Zeno's Quantum Paradoxes / Continuity |
| 3 | Examination of Perception | Observer Effect / Measurement |
| 4 | Examination of Aggregates | Quantum Field Theory / Composite Systems |
| 5 | Examination of Elements | Quantum Chemistry / Atomic Orbitals |
| 6 | Examination of Desire | Quantum Tunnelling / Potential Barriers |
| 7 | Examination of Arising | Quantum Creation / Vacuum Fluctuations |
| 8-27 | ... | Assign per chapter based on philosophical content |

## Workflow

1. Read legacy data from `data/chapters/chapter-N.js` and `public/ChN/config.js`
2. For each verse, apply the template above
3. Select quantum concept that STRUCTURALLY parallels the philosophical point
4. Write 6 progressive Q&A pairs with real-life examples
5. Design animation spec with R3F techniques
6. Add 3-tier quiz
7. Verify build compiles
