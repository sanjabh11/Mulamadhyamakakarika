/**
 * Chapter 1: Investigation of Conditions (Pratyaya Parīkṣā)
 * CANONICAL DATA SOURCE — Single source of truth for all Chapter 1 verse data
 * 
 * Merges data from 6 sources:
 * 1. data/animations/chapter1-verses.js (richest: animation, deeperDive, quiz for v1-7)
 * 2. data/verses/chapter1.js (Devanagari sanskrit, interactions with xp for v1-7)
 * 3. data/animations/chapter1-verse-configs.js (educational overlays for v1-7)
 * 4. pages/verse-1-8..14.jsx (inline data for v8-14)
 * 5. pages/chapter-1.jsx (titles, summaries for v1-14)
 * 6. public/Ch1/main.js (raw Q&A for all 14 verses)
 */

import {
  CHAPTER_1_CONFIG,
  VERSE_1_1, VERSE_1_2, VERSE_1_3, VERSE_1_4,
  VERSE_1_5, VERSE_1_6, VERSE_1_7
} from '../animations/chapter1-verses';

// ---------------------------------------------------------------------------
// Chapter Configuration
// ---------------------------------------------------------------------------
export const CHAPTER_CONFIG = {
  ...CHAPTER_1_CONFIG,
  number: 1,
  verseCount: 14,
  summary: 'This chapter examines the fundamental nature of causation and conditions, rejecting inherent arising and affirming dependent origination.',
  quantumSummary: 'Quantum parallels include entanglement, superposition, complementarity, and non-locality, illustrating interdependence.',
  primaryAnimation: 'dependent-origination',
};

// ---------------------------------------------------------------------------
// Devanagari Sanskrit (from data/verses/chapter1.js — only v1-2 had it)
// ---------------------------------------------------------------------------
const DEVANAGARI = {
  1: {
    devanagari: 'न स्वतो नापि परतो न द्वाभ्यां नाप्यहेतुतः ।\nउत्पन्ना जातु विद्यन्ते भावाः क्वचन केचन ॥',
    transliteration: 'na svato nāpi parato na dvābhyāṃ nāpy ahetutaḥ |\nutpannā jātu vidyante bhāvāḥ kvacana kecana ||',
  },
  2: {
    devanagari: 'चत्वारः प्रत्ययाः हेतुः आलम्बनमनन्तरम् ।\nआधिपतेयं च तथा प्रत्ययो नास्ति पञ्चमः ॥',
    transliteration: 'catvāraḥ pratyayāḥ hetuḥ ālambanamanantaram |\nādhipateyaṃ ca tathā pratyayo nāsti pañcamaḥ ||',
  },
};

// ---------------------------------------------------------------------------
// Interactions with XP values (from data/verses/chapter1.js for v1-2; v3-7 had empty arrays)
// Already present in VERSE_1_1 from chapter1-verses.js for v1, but without xp_value.
// The data/verses/chapter1.js version adds xp_value. We use that version.
// ---------------------------------------------------------------------------
const INTERACTIONS = {
  1: [
    { id: 'try_self', button_label: 'From Self', sanskrit: 'svataḥ', action: 'flash_fail', message: 'Self-causation leads to infinite regress. If a thing produces itself, it must exist before it exists.', tooltip: 'If things produced themselves, they would need to exist before existing', xp_value: 5 },
    { id: 'try_other', button_label: 'From Other', sanskrit: 'parataḥ', action: 'pass_through', message: 'Other-causation severs the causal link. If cause and effect are completely different, how can one produce the other?', tooltip: 'Complete otherness means no real causal connection', xp_value: 5 },
    { id: 'try_both', button_label: 'From Both', sanskrit: 'dvābhyām', action: 'merge_dissolve', message: 'Both options inherit both problems. Combining two invalid options does not create a valid one.', tooltip: 'The problems of self and other causation compound', xp_value: 5 },
    { id: 'try_random', button_label: 'Without Cause', sanskrit: 'ahetutaḥ', action: 'nothing', message: 'Causelessness explains nothing. Random arising contradicts observable patterns and regularity.', tooltip: 'If things arose randomly, anything could come from anything', xp_value: 5 },
    { id: 'realize', button_label: 'Dependent Origination', sanskrit: 'pratītyasamutpāda', action: 'reveal_network', message: 'Things arise interdependently, not from inherent causes. This is the Middle Way between eternalism and nihilism.', tooltip: 'The middle way: phenomena arise in mutual dependence', is_solution: true, xp_value: 25 },
  ],
  2: [
    { id: 'hover_efficient', button_label: 'Efficient Cause', sanskrit: 'hetupratyaya', action: 'highlight_tether', message: 'The primary contributory factor (e.g., seed for sprout)', tooltip: 'Dominant contributory factor' },
    { id: 'hover_percept', button_label: 'Percept-Object', sanskrit: 'ālambanapratyaya', action: 'highlight_tether', message: 'The object condition (e.g., form for visual consciousness)', tooltip: 'That which consciousness takes as object' },
    { id: 'hover_immediate', button_label: 'Immediate-Prior', sanskrit: 'anantarapratyaya', action: 'highlight_tether', message: 'The immediately preceding moment (e.g., previous thought)', tooltip: 'Temporal continuity condition' },
    { id: 'hover_dominant', button_label: 'Dominant', sanskrit: 'adhipatipratyaya', action: 'highlight_tether', message: 'Empowering conditions (e.g., light for seeing)', tooltip: 'Enabling background conditions' },
  ],
};

// ---------------------------------------------------------------------------
// Enrich verses 1-7 with Devanagari and canonical interactions
// ---------------------------------------------------------------------------
function enrichVerse(verse, num) {
  const dev = DEVANAGARI[num];
  const enriched = { ...verse, number: num };

  if (dev) {
    enriched.sanskrit = {
      ...verse.sanskrit,
      devanagari: dev.devanagari,
      transliteration: dev.transliteration || verse.sanskrit.transliteration,
    };
  }

  if (INTERACTIONS[num]) {
    enriched.interactions = INTERACTIONS[num];
  }

  return enriched;
}

// ---------------------------------------------------------------------------
// Verses 8-14: Merged from inline page data + Ch1/main.js parsed Q&A
// ---------------------------------------------------------------------------
const VERSE_8 = {
  id: 'v1_8',
  number: 8,
  title: 'Emptiness of the Object Condition',
  sanskrit: {
    text: 'bhāvānāṃ niḥsvabhāvānāṃ na sattā vidyate yataḥ',
    transliteration: 'bhāvānāṃ niḥsvabhāvānāṃ na sattā vidyate yataḥ',
    translation: 'An existent entity is said to have no percept-object at all. If the entity has no object, where could the object-condition exist?',
  },
  philosophy: {
    insight: 'Nāgārjuna dismantles the percept-object condition (ālambanapratyaya). If the perceiving entity lacks inherent existence, it cannot have an inherently existing object. Without a real object, the object-condition collapses.',
    madhyamaka: 'This verse targets the second of the four conditions — the percept-object condition. Garfield notes: if phenomena lack inherent existence, they cannot serve as inherently existing objects of perception. The relation between perceiver and perceived is mutually dependent, not grounded in either side. Kalupahana emphasizes this verse shows the "object" is a conventional designation, not an independent referent.',
    quantum: 'Quantum Measurement Problem: The measured property does not exist independently prior to measurement. The apparatus and quantum system form an inseparable whole.',
    bridge: 'Both frameworks reveal that "object" and "subject" are not independently established entities that come together — they co-arise in the act of interaction/measurement.',
    accessible: 'When scientists measure a quantum particle, the measurement result doesn\'t exist before the measurement happens. The "object" of observation comes into being through the act of observing. Similarly, Nāgārjuna argues the "object" of perception doesn\'t exist independently — it arises in the relationship between perceiver and perceived.',
    twoTruths: 'Conventionally, we perceive objects and respond to them. Ultimately, the "object" of perception does not exist independently — it co-arises with the perceiver.',
    commonMisconception: 'NOT saying objects are imaginary. Saying objects lack INHERENT, observer-independent existence. They\'re real but relationally constituted.',
  },
  quantumResonance: {
    concept: 'Measurement Problem',
    score: 90,
    strength: 'High',
    explanation: 'The measured property does not pre-exist measurement. Object and observer co-constitute the result.',
    caveat: 'Quantum measurement problem and the empty object-condition both show observer-observed co-constitution. Structural parallel.',
  },
  animation: {
    geometry: 'Eye + Object Dissolution',
    anchor: 'A stylized eye (observer) facing a floating crystalline object. Between them, a shimmering measurement beam.',
    texture: 'Eye: Translucent iris with internal fractal patterns. Object: Prismatic, faceted crystal that shifts between solid and transparent.',
    mood: 'Contemplative, paradoxical, soft glow dissolving into uncertainty',
    colors: ['#8B5CF6', '#06B6D4', '#E0E7FF', '#F59E0B'],
    orchestration: {
      start: 'Eye and crystal face each other, measurement beam between them.',
      click: 'User clicks the crystal — it dissolves into particles that flow INTO the eye. The eye then projects a holographic reconstruction of the crystal. Neither is "the real object."',
      loop: 'Crystal reforms, user can click again. Each time, the reconstruction is slightly different — showing the object is constructed, not found.',
    },
    interaction: {
      click: 'Click crystal to trigger dissolution and reconstruction — see the object is co-created',
      drag: 'Rotate to view the observer-object relationship from different angles',
      hover: 'Crystal becomes semi-transparent, hinting at its lack of inherent solidity',
    },
    controls: {
      rotation: { default: true, speed: 0.4 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 60, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'InstancedMesh for particle dissolution (5000 particles)',
      'Custom shader for prismatic crystal refraction',
      'drei Bloom post-processing for measurement beam glow',
      'Fresnel effect on eye iris with drei MeshTransmissionMaterial',
    ],
    camera: { position: [0, 1, 7], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<400MB memory, 60 FPS on mid-tier GPU. Particle count scales with device capability.',
    tripoPrompt: 'A translucent crystalline eye facing a prismatic floating crystal, connected by a beam of purple light that dissolves the crystal into particles, deep space background, volumetric lighting, 8K render.',
    visualBridge: 'The crystal (object) dissolves when observed, then is reconstructed by the eye (subject) — showing neither exists independently.',
    educationalGoal: 'User sees that "objects" of perception co-arise with the perceiver — neither exists independently of the other.',
  },
  deeperDive: [
    {
      q: 'What is the "percept-object condition" that Nāgārjuna is examining here?',
      a: 'The percept-object condition (ālambanapratyaya) is the second of the four conditions. It refers to the object that consciousness takes as its focus — for example, a visible form is the object-condition for visual consciousness.',
      realLifeExample: 'When you see an apple, the apple is supposedly the "object-condition" for your visual experience. But Nāgārjuna asks: does that apple exist independently as an object waiting to be perceived?',
    },
    {
      q: 'Why does Nāgārjuna say the entity "has no object"?',
      a: 'Because the perceiving entity (consciousness) lacks inherent existence — it arises dependently. If the perceiver itself is empty, it cannot have an inherently existing object. The object\'s status depends on the perceiver, and vice versa.',
      realLifeExample: 'A mirror has no image "in" it before something stands in front of it. The image depends on both the mirror and the thing reflected — neither the image nor the mirror\'s "seeing" exists independently.',
    },
    {
      q: 'How does this relate to the quantum measurement problem?',
      a: 'In quantum mechanics, the property being measured (like spin or position) doesn\'t have a definite value before measurement. The result emerges from the interaction between measuring apparatus and quantum system. Neither "object" (the value) nor "subject" (the measurement) exists independently.',
      realLifeExample: 'Asking "What color is this electron?" before measuring it is like asking "What score did I get?" before taking the test. The answer doesn\'t pre-exist — it comes into being through the process.',
    },
    {
      q: 'Is Nāgārjuna saying we don\'t perceive anything real?',
      a: 'No. Conventionally, perception works perfectly. We see, hear, and interact with the world. What he denies is that objects exist as inherently real, independent things that consciousness passively receives. Perception is a co-creative process.',
      realLifeExample: 'Your phone screen shows text perfectly well, but the "text" is actually tiny pixels firing in patterns your brain assembles into letters. The text is real conventionally but isn\'t inherently "in" the screen independently of your visual processing.',
    },
    {
      q: 'What happens to the concept of "representation" when the object-condition is empty?',
      a: 'The idea that consciousness creates an internal "representation" of an external object breaks down. If neither subject nor object is independently established, there\'s no external-to-internal transfer. Experience arises in the relationship itself.',
      realLifeExample: 'A video call isn\'t a "copy" of the other person transmitted to you. It\'s a pattern of light and sound that your brain and their camera co-produce. No one is actually "inside" your screen.',
    },
    {
      q: 'What does this verse mean for everyday perception?',
      a: 'It means your experience of the world is not a passive recording of independently existing objects. It\'s an active, interdependent process. Colors, sounds, and textures arise in the meeting of sense faculties, objects, and consciousness — they don\'t belong to any one side.',
      realLifeExample: 'Is a sunset beautiful "in itself," or does beauty arise in the meeting of light, atmosphere, your eyes, and your mind? Nāgārjuna would say beauty is a dependent arising, not a property inherently "in" the sunset.',
    },
  ],
  quiz: {
    beginner: {
      question: 'What is the "object-condition" in Buddhist philosophy?',
      options: [
        'A) A material object that exists independently',
        'B) The object that consciousness takes as its focus for perception',
        'C) The cause of all suffering',
        'D) The dominant condition for enlightenment',
      ],
      correct: 'B',
      explanation: 'The percept-object condition (ālambanapratyaya) refers to whatever consciousness takes as its object — a visible form for seeing, a sound for hearing, etc.',
    },
    intermediate: {
      question: 'Why does Nāgārjuna say the entity "has no object"?',
      options: [
        'A) Because objects don\'t exist at all',
        'B) Because the perceiving entity lacks inherent existence, so it cannot possess an inherently existing object',
        'C) Because perception is always wrong',
        'D) Because only the mind exists',
      ],
      correct: 'B',
      explanation: 'If the perceiver is empty of inherent existence, it cannot "have" an inherently existing object. Both are mutually dependent — the object-condition cannot be independently established.',
    },
    advanced: {
      question: 'How does the quantum measurement problem parallel Nāgārjuna\'s deconstruction of the object-condition?',
      options: [
        'A) Both show objects exist independently before interaction',
        'B) Both reveal that the "object" (measured property / perceived referent) does not exist independently but co-arises in the act of interaction',
        'C) Both prove consciousness creates reality',
        'D) Neither is relevant to the other',
      ],
      correct: 'B',
      explanation: 'In quantum mechanics, the measured value doesn\'t pre-exist measurement. In Madhyamaka, the perceived object doesn\'t independently exist awaiting perception. Both are co-constituted through interaction.',
    },
  },
};

const VERSE_9 = {
  id: 'v1_9',
  number: 9,
  title: 'Emptiness of the Immediate Condition',
  sanskrit: {
    text: 'anutpannāś ca ye bhāvā na teṣāṃ vidyate sthitiḥ',
    transliteration: 'anutpannāś ca ye bhāvā na teṣāṃ vidyate sthitiḥ',
    translation: 'If phenomena are not arisen, cessation is not tenable. Therefore, an immediate condition is unreasonable. For what has ceased, how can it be a condition?',
  },
  philosophy: {
    insight: 'Nāgārjuna dismantles the third condition — the immediately preceding condition (samanantarapratyaya). If things don\'t inherently arise, they can\'t inherently cease. A ceased thing, having no existence, cannot serve as an inherently existing condition for the next moment.',
    madhyamaka: 'This verse targets the samanantarapratyaya (immediately preceding condition), which in Abhidharma ensures continuity of consciousness from moment to moment. Garfield: "If there is no arising, there is no duration, and hence no cessation. So nothing can serve as an immediately preceding condition." Kalupahana: the verse exposes the absurdity of a ceased entity possessing causal power — what has ceased cannot inherently condition what follows.',
    quantum: 'Quantum Decoherence and the Arrow of Time: When a quantum system interacts with its environment, coherent superposition "decoheres" into classical-seeming states. The prior coherent state doesn\'t inherently "cease" — it becomes entangled with the environment, making the concept of clear cessation problematic.',
    bridge: 'Both frameworks challenge the idea of clean, inherent cessation. In decoherence, quantum information isn\'t destroyed but dispersed. In Madhyamaka, "cessation" isn\'t an inherent event but a conventional description of transformation.',
    accessible: 'Imagine a wave in the ocean. Does it "cease" when it breaks on shore? The water is still there — it just changed form. Nāgārjuna argues that if things don\'t truly arise with inherent existence, they can\'t truly cease either. And if they can\'t truly cease, how can the "ceased" previous moment serve as a real condition for the next?',
    twoTruths: 'Conventionally, moments of consciousness follow each other in sequence. Ultimately, the "immediate prior condition" cannot transfer inherent existence from one moment to the next.',
    commonMisconception: 'NOT saying consciousness has no continuity. Saying the MECHANISM of continuity is not inherent substance-transfer but dependent arising.',
  },
  quantumResonance: {
    concept: 'Decoherence / Arrow of Time',
    score: 87,
    strength: 'High',
    explanation: 'Decoherence shows quantum states don\'t cleanly "cease" — they disperse into environmental entanglement. Parallels the impossibility of inherent cessation.',
    caveat: 'Quantum decoherence and Buddhist cessation-as-condition both show transformation without inherent annihilation. Structural parallel.',
  },
  animation: {
    geometry: 'Temporal Chain Dissolution',
    anchor: 'A chain of glowing orbs (representing moments of consciousness), each linked to the next. The chain stretches from left (past) to right (future).',
    texture: 'Orbs: Gradient from bright violet (#8B5CF6) to transparent. Links: Pulsing energy threads that fade when examined.',
    mood: 'Temporal, flowing, dissolving certainty',
    colors: ['#8B5CF6', '#06B6D4', '#94A3B8', '#E0E7FF'],
    orchestration: {
      start: 'Chain of 7 orbs linked in sequence, pulsing in rhythm.',
      click: 'User clicks any orb — it fades to show "cessation." The link to the next orb dissolves. But then particles from the faded orb drift and reform as part of the NEXT orb, showing transformation rather than clean cessation.',
      loop: 'Chain reforms, each click reveals the same pattern — nothing cleanly ceases, nothing cleanly passes its "power" forward.',
    },
    interaction: {
      click: 'Click an orb to trigger its "cessation" — watch the link dissolve and particles redistribute',
      drag: 'Scrub along the temporal chain to see the flow of conditions',
      hover: 'Orbs expand to show their "content" is empty — just swirling particles without solid core',
    },
    controls: {
      rotation: { default: false, speed: 0.2 },
      speed: { default: 60, min: 0, max: 100 },
      complexity: { default: 70, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'InstancedMesh for chain orbs with shared geometry',
      'Custom dissolve shader (noise-based alpha erosion) for cessation effect',
      'drei Trail for particle redistribution between orbs',
      'Bloom post-processing on energy links',
      'useSpring (drei) for smooth orb reformation',
    ],
    camera: { position: [0, 2, 10], fov: 50, autoRotate: false },
    fps: 60,
    performanceNotes: '<350MB memory, 60 FPS. Chain of 7 orbs with ~2000 particles each during dissolution. Dissolve shader uses GPU noise.',
    tripoPrompt: 'A chain of seven glowing violet orbs connected by pulsing energy threads, one orb dissolving into particles that flow toward the next orb, dark space background, cinematic depth of field, 8K.',
    visualBridge: 'The chain represents temporal succession. When an orb "ceases," its particles redistribute rather than disappear — showing cessation is transformation, not inherent annihilation.',
    educationalGoal: 'User understands that cessation is transformation, not inherent annihilation — information disperses rather than vanishes.',
  },
  deeperDive: [
    {
      q: 'What is the "immediately preceding condition" that this verse examines?',
      a: 'The samanantarapratyaya is the third of the four conditions. In Abhidharma Buddhism, each moment of consciousness is conditioned by the immediately preceding moment — like links in a chain. This is supposed to explain continuity of experience.',
      realLifeExample: 'Think of a relay race: each runner passes the baton to the next. The immediately preceding condition is like the previous runner — they must exist and act to pass the baton forward.',
    },
    {
      q: 'Why does Nāgārjuna say things are "not arisen"?',
      a: 'He has already argued (v.1-7) that inherent arising is impossible. Here he draws a consequence: if things don\'t inherently arise, they cannot inherently exist as stable entities that then undergo cessation. No inherent arising means no inherent cessation.',
      realLifeExample: 'If a building was never truly built (just an arrangement of materials), it can\'t truly be "demolished." The materials just rearrange again.',
    },
    {
      q: 'Why can\'t a "ceased" thing serve as a condition?',
      a: 'If we require conditions to have inherent existence and causal power, then something that has ceased — that no longer exists — cannot possess or exert such power. A non-existent thing cannot inherently condition anything. The "baton" has been dropped.',
      realLifeExample: 'Can yesterday\'s extinguished candle light today\'s room? The flame is gone. If conditions need to inherently exist to work, a ceased condition is powerless.',
    },
    {
      q: 'How does quantum decoherence illustrate this?',
      a: 'In decoherence, a quantum superposition doesn\'t simply "cease" — it becomes entangled with the environment. The information isn\'t destroyed but dispersed. There\'s no clean moment of cessation, just continuous transformation. This parallels Nāgārjuna\'s point that inherent cessation is unfindable.',
      realLifeExample: 'When a drop of dye spreads through water, the drop doesn\'t "cease to exist." The dye molecules are still there — just dispersed. Nothing was inherently annihilated.',
    },
    {
      q: 'Does this mean there\'s no continuity of consciousness?',
      a: 'Not at all. Conventional continuity is preserved — each moment of experience does condition the next. What Nāgārjuna denies is that this continuity operates through inherently existing moments that are inherently "passed forward." Continuity is a conventional pattern, not an inherent mechanism.',
      realLifeExample: 'A river has continuity — water flows downstream. But there\'s no single "chunk" of river that is passed along. Continuity emerges from the flow of conditions, not from inherent river-chunks.',
    },
    {
      q: 'How does this verse connect to the problem of personal identity over time?',
      a: 'If each moment of consciousness inherently ceases, what connects you now to you five minutes ago? Nāgārjuna shows the mechanism can\'t be inherent cessation-and-replacement. Instead, personal continuity is a conventional designation over a stream of interdependent, empty moments.',
      realLifeExample: 'You at age 5 and you now share few atoms or memories. Yet you\'re conventionally "the same person." This works because identity is a conventional designation, not an inherent entity passed forward moment to moment.',
    },
  ],
  quiz: {
    beginner: {
      question: 'What is the "immediately preceding condition" in Buddhist philosophy?',
      options: [
        'A) The first cause of the universe',
        'B) The immediately prior moment of consciousness that conditions the next moment',
        'C) The physical environment',
        'D) The dominant condition',
      ],
      correct: 'B',
      explanation: 'The samanantarapratyaya is the immediately preceding moment of consciousness — like the previous link in a chain — that conditions the arising of the next moment.',
    },
    intermediate: {
      question: 'Why can\'t something that has "ceased" serve as an inherently existing condition?',
      options: [
        'A) Because Buddhist philosophy denies all causation',
        'B) Because a non-existent entity cannot possess or exert inherent causal power',
        'C) Because only future things can be conditions',
        'D) Because cessation is permanent',
      ],
      correct: 'B',
      explanation: 'If conditions must have inherent existence to function, then something that has ceased — and thus no longer exists — cannot possess inherent causal power to condition the next moment.',
    },
    advanced: {
      question: 'How does quantum decoherence parallel Nāgārjuna\'s critique of inherent cessation?',
      options: [
        'A) Both show things cleanly cease to exist',
        'B) Both reveal that "cessation" is not a clean, inherent event — quantum information disperses rather than being annihilated, just as Nāgārjuna finds no inherent cessation',
        'C) Decoherence proves inherent cessation exists',
        'D) There is no parallel',
      ],
      correct: 'B',
      explanation: 'In decoherence, quantum information isn\'t destroyed but entangled with the environment. There\'s no clean "cessation" moment. Similarly, Nāgārjuna shows inherent cessation is unfindable — things transform rather than being inherently annihilated.',
    },
  },
};

const VERSE_10 = {
  id: 'v1_10',
  number: 10,
  title: 'Emptiness Enables Dependent Origination',
  sanskrit: {
    text: 'bhāvānāṃ niḥsvabhāvānāṃ na sattā vidyate yataḥ | satīdam asmin bhavatīty etan naivopapadyate ||',
    transliteration: 'bhāvānāṃ niḥsvabhāvānāṃ na sattā vidyate yataḥ | satīdam asmin bhavatīty etan naivopapadyate ||',
    translation: 'Since the existence of things without essence is not established, "When this exists, that arises" is not tenable.',
  },
  philosophy: {
    insight: 'Nāgārjuna inverts the opponent\'s expectation: emptiness doesn\'t undermine "When this exists, that arises" — rather, it\'s inherent existence that would make that formula impossible. If things had fixed essences, they couldn\'t depend on conditions to arise. Emptiness is what makes dependent origination coherent.',
    madhyamaka: 'This is one of the most misunderstood verses. Garfield argues Nāgārjuna is not rejecting pratītyasamutpāda but showing that the formula "When this exists, that arises" cannot work if things have svabhāva. If essences are fixed and independent, no thing could arise in dependence on another. Kalupahana concurs: the verse targets those who try to combine inherent existence with dependent origination — an incoherent position. Siderits/Katsura note this verse sets up the resolution in v.14.',
    quantum: 'Quantum Non-Locality (Bell\'s Theorem): Bell\'s theorem proves that no theory of local hidden variables can reproduce quantum correlations. Correlations are real, but they cannot be explained by independently existing local properties. The "mechanism" of correlation is not locatable in either particle.',
    bridge: 'Both frameworks show: correlations/dependence are real, but they cannot be grounded in independently existing properties (svabhāva/local hidden variables). Emptiness enables dependence just as non-locality enables quantum correlations.',
    accessible: 'Imagine two friends who always wear matching colors without planning it. You might think each has a "matching-color essence." But Bell\'s theorem (in quantum physics) proves there\'s no hidden mechanism — the correlation is real but can\'t be explained by each particle having its own fixed property. Similarly, Nāgārjuna shows that "when this exists, that arises" works precisely because things DON\'T have fixed essences. Emptiness is what makes dependence possible.',
    twoTruths: 'Conventionally, conditions give rise to effects through dependence. Ultimately, the correlations are real but cannot be grounded in independently existing properties.',
    commonMisconception: 'NOT saying dependence is illusion. Dependence is REAL — what\'s empty is the inherent ground (svabhava) we assume underlies it.',
  },
  quantumResonance: {
    concept: 'Non-Locality / Bell\'s Theorem',
    score: 91,
    strength: 'High',
    explanation: 'Bell\'s theorem proves correlations without local hidden variables. Parallel: dependent origination works without svabhāva.',
    caveat: 'Bell\'s theorem and dependent origination both reveal real correlations without local hidden variables / inherent essence. Structural analogy.',
  },
  animation: {
    geometry: 'Bell Test Correlation Visualizer',
    anchor: 'Two detector stations at opposite sides of the scene, with a particle source in the center emitting pairs. Correlation arcs connect measurement results.',
    texture: 'Detectors: Sleek chrome instruments with LED readouts. Particles: Tiny luminous spheres in paired colors. Correlation arcs: Shimmering golden threads that defy the space between.',
    mood: 'Scientific elegance, "spooky" connectedness across void',
    colors: ['#F59E0B', '#8B5CF6', '#3B82F6', '#10B981'],
    orchestration: {
      start: 'Central source emits particle pairs. Each flies to opposite detector.',
      click: 'User clicks a detector to "measure" — both detectors show correlated results simultaneously. A scanner sweeps the space between and finds NO connecting signal.',
      reveal: 'Golden correlation arcs appear between results, floating in empty space. Text overlay: "Correlation without inherent mechanism — dependent arising without essence."',
    },
    interaction: {
      click: 'Click either detector to trigger measurement — see instant correlation appear',
      drag: 'Rotate to verify empty space between detectors (no hidden connection)',
      hover: 'Particle pairs glow to show their entangled status before measurement',
    },
    controls: {
      rotation: { default: true, speed: 0.3 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 65, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'InstancedMesh for particle pair emissions (100+ pairs)',
      'Custom shader for correlation arcs with animated dash pattern',
      'drei Sparkles for measurement flash effect',
      'Bloom post-processing on detector LEDs and correlation arcs',
      'drei Line for scanner beam sweeping between detectors',
    ],
    camera: { position: [0, 3, 12], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<400MB memory, 60 FPS. Particle emissions pooled via InstancedMesh. Scanner beam uses simple line geometry.',
    tripoPrompt: 'Two chrome scientific detector stations on opposite sides of a void, connected by golden shimmering arcs of light, a central particle source emitting paired glowing spheres, deep space, cinematic lighting, 8K.',
    visualBridge: 'The correlation arcs appear with no physical connection between detectors — showing that dependence/correlation is real even without inherent connecting mechanism (svabhāva/hidden variables).',
    educationalGoal: 'User grasps that dependence and correlation are real even without inherent connecting properties — emptiness enables, not prevents, dependence.',
  },
  deeperDive: [
    {
      q: 'Is Nāgārjuna saying dependent origination doesn\'t work?',
      a: 'No — this is the most common misreading! He\'s saying dependent origination can\'t work IF things have inherent essence. It is precisely BECAUSE things lack essence that they can arise dependently. Emptiness enables dependent origination, not the reverse.',
      realLifeExample: 'If LEGO bricks were fused into one solid block (had "inherent essence"), you couldn\'t rearrange them into new shapes. It\'s because they\'re separable and flexible (empty of fixed form) that you can build anything.',
    },
    {
      q: 'What is the formula "When this exists, that arises"?',
      a: 'This is the idappaccayatā formula — the classic Buddhist expression of dependent origination (pratītyasamutpāda). It states: "When this exists, that comes to be; from the arising of this, that arises. When this does not exist, that does not come to be; from the cessation of this, that ceases." It\'s the foundation of Buddhist understanding of causality.',
      realLifeExample: 'When there are clouds and moisture, rain comes. When clouds clear, rain ceases. This observable regularity IS dependent origination — no mysterious "rain-essence" needed.',
    },
    {
      q: 'Why would inherent essence make dependent origination impossible?',
      a: 'If a thing has svabhāva (inherent, fixed, independent nature), it exists on its own regardless of conditions. Such a thing cannot genuinely depend on something else — its nature is already complete. Dependence requires openness to influence, which is exactly what emptiness provides.',
      realLifeExample: 'A perfectly rigid steel ball can\'t be shaped by a potter\'s wheel. Only soft clay (which lacks inherent "fixed form") can be shaped. Emptiness is the "softness" that allows reality to be shaped by conditions.',
    },
    {
      q: 'How does Bell\'s theorem relate to this verse?',
      a: 'Bell\'s theorem (1964) proves mathematically that quantum correlations cannot be explained by "local hidden variables" — pre-existing properties carried independently by each particle. The correlations are real but have no locally inherent mechanism. This parallels Nāgārjuna: dependent arising is real but has no inherent causal mechanism (svabhāva).',
      realLifeExample: 'Two coins always land the same way despite being flipped in different cities. You might think each coin has a "hidden magnet" (local hidden variable). Bell\'s theorem proves: no hidden magnet exists. The correlation is real but not grounded in any independently existing property.',
    },
    {
      q: 'What\'s the difference between correlation and inherent causation?',
      a: 'Correlation: observed regularity where A and B co-occur or follow each other. Inherent causation: the claim that A contains within itself an inherent power that produces B. Nāgārjuna accepts the first and denies the second. Quantum physics similarly accepts correlations while denying local hidden mechanisms.',
      realLifeExample: 'A thermostat and a heater are correlated — when temperature drops, heat comes on. But the thermostat doesn\'t have "heat-production essence." The correlation works through a relational system (wiring, sensors), not through inherent power in the thermostat itself.',
    },
    {
      q: 'How does this verse prepare for the chapter\'s conclusion?',
      a: 'By establishing that emptiness and dependent origination are not opposed but identical, this verse sets up the grand conclusion (v.14): conditions and effects are mutually empty. Neither can be established independently, but both function conventionally. The "problem" of causation dissolves when svabhāva is abandoned.',
      deeper: 'The progression: v.1 refutes inherent arising → v.2-9 dismantle each condition type → v.10 pivots to show emptiness enables dependence → v.11-13 deepen the argument → v.14 concludes with mutual emptiness of conditions and effects.',
    },
  ],
  quiz: {
    beginner: {
      question: 'According to this verse, what makes dependent origination ("When this exists, that arises") possible?',
      options: [
        'A) Things having strong inherent essences',
        'B) Things being empty of inherent essence — their openness to conditions',
        'C) Random chance',
        'D) A creator deity\'s will',
      ],
      correct: 'B',
      explanation: 'Emptiness (lack of fixed, independent essence) is what allows things to arise in dependence on conditions. If things had fixed essences, they couldn\'t be influenced by conditions at all.',
    },
    intermediate: {
      question: 'What does Bell\'s theorem prove about quantum correlations?',
      options: [
        'A) Correlations are caused by hidden properties in each particle',
        'B) Correlations cannot be explained by independently existing local properties — they are irreducibly relational',
        'C) Correlations don\'t exist',
        'D) Classical physics fully explains quantum correlations',
      ],
      correct: 'B',
      explanation: 'Bell\'s theorem rules out "local hidden variables" — pre-existing independent properties can\'t explain quantum correlations. The correlations are real but not grounded in inherent properties, paralleling dependent origination without svabhāva.',
    },
    advanced: {
      question: 'How does Nāgārjuna\'s equation "emptiness = dependent origination" function in this verse?',
      options: [
        'A) It doesn\'t — Nāgārjuna rejects dependent origination here',
        'B) The verse shows that IF things had inherent essence, dependent origination would be impossible — therefore, dependent origination requires emptiness',
        'C) Emptiness and dependent origination are opposed concepts',
        'D) The verse proves things have inherent essence',
      ],
      correct: 'B',
      explanation: 'The verse is a reductio: inherent essence + dependent origination = contradiction. Since dependent origination is observed, inherent essence must be false. Therefore, emptiness (absence of svabhāva) is the precondition for dependent origination.',
    },
  },
};

const VERSE_11 = {
  id: 'v1_11',
  number: 11,
  title: 'The Effect Is Not Found in Conditions',
  sanskrit: {
    text: 'pratyayebhyaś ca yo \'rtho \'sau pratyayebhyo \'pi nāsti saḥ',
    transliteration: 'pratyayebhyaś ca yo \'rtho \'sau pratyayebhyo \'pi nāsti saḥ',
    translation: 'In the several or united conditions the effect cannot be found. How could something not in the conditions come from the conditions?',
  },
  philosophy: {
    insight: 'Nāgārjuna examines whether the effect pre-exists within its conditions. It cannot be found in any single condition, nor in all conditions taken together. If the effect isn\'t already there, it cannot be "extracted" from them through inherent production.',
    madhyamaka: 'This verse addresses the satkāryavāda (pre-existence of effect in cause) position associated with Sāṃkhya philosophy. Garfield: "The effect is not to be found in the conditions either individually or collectively." If conditions had inherent productive power, the effect should be discoverable within them prior to arising. Kalupahana: this targets the Abhidharma notion that conditions contain the potential for effects as an inherent property. Siderits/Katsura: neither distributive nor collective analysis reveals the effect within conditions.',
    quantum: 'Quantum Superposition and Measurement: Before measurement, a quantum system exists as a superposition of possible outcomes. No single outcome is "contained within" the preparation conditions. The definite result emerges only upon measurement — it is not extracted from the conditions but arises through their interaction.',
    bridge: 'Both frameworks show that outcomes/effects are not pre-stored in conditions/preparations. They emerge through interaction. The "potential" is not a hidden version of the actual result waiting inside.',
    accessible: 'Imagine flour, eggs, sugar, and heat (the "conditions"). Where is the cake? You can\'t find it in any single ingredient or in all of them piled together. The cake only emerges when conditions interact in a specific way. Nāgārjuna makes the same point about all effects: they arise from conditions but aren\'t hiding inside them.',
    twoTruths: 'Conventionally, effects follow from conditions in regular patterns. Ultimately, the effect is not pre-stored inside the conditions — it emerges through interaction.',
    commonMisconception: 'NOT saying effects are random. Regular patterns exist! But the effect is not a hidden copy waiting inside the cause — emergence is real.',
  },
  quantumResonance: {
    concept: 'Superposition / Born Rule',
    score: 89,
    strength: 'High',
    explanation: 'Before measurement, no definite outcome exists within the preparation. The result emerges through measurement interaction, not extraction from conditions.',
    caveat: 'Quantum state preparation and Buddhist conditions both show outcomes emerging through interaction, not pre-existing. Structural parallel.',
  },
  animation: {
    geometry: 'Search-and-Not-Find Chamber',
    anchor: 'A transparent chamber containing 4 glowing condition-spheres. A magnifying glass / scanner beam searches inside each sphere and between them for the "effect."',
    texture: 'Condition-spheres: Translucent with internal particle swirls, each a different color. Scanner: Bright white beam with lens flare. Chamber: Glass with subtle refraction.',
    mood: 'Investigative, revelatory, the thrill of NOT finding',
    colors: ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#FFFFFF'],
    orchestration: {
      start: 'Four condition-spheres float in a glass chamber. A scanner beam is available.',
      click: 'User clicks a sphere — scanner beam enters it, illuminating its interior. No effect found inside (particles scatter but reveal nothing solid). User can click "Search All" to scan all simultaneously — still nothing.',
      reveal: 'After all searches fail, the spheres suddenly interact (beams cross between them) and a NEW shape (the effect) crystallizes at the intersection point — NOT from inside any sphere, but from their relationship.',
    },
    interaction: {
      click: 'Click individual condition-spheres to search inside them for the effect',
      drag: 'Rotate the chamber to examine from all angles',
      hover: 'Spheres show internal particle activity but no hidden effect',
    },
    controls: {
      rotation: { default: true, speed: 0.4 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 70, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'MeshTransmissionMaterial for glass chamber refraction',
      'InstancedMesh for internal particle swirls (1000 per sphere)',
      'Custom raymarching shader for scanner beam volumetric light',
      'Bloom + DepthOfField post-processing for cinematic search effect',
      'Morph targets for effect crystallization animation',
    ],
    camera: { position: [0, 2, 8], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<450MB memory, 60 FPS. Glass refraction uses simplified transmission model. Particle count adaptive.',
    tripoPrompt: 'Four translucent glowing spheres in a glass chamber, a white scanner beam searching through them, a crystalline shape forming at their intersection point, laboratory aesthetic, volumetric lighting, 8K.',
    visualBridge: 'You search each condition and find no hidden effect. The effect only appears when conditions interact — it was never "inside" any of them.',
    educationalGoal: 'User sees that effects are not hidden inside conditions — they emerge through interaction, genuinely new yet dependently arisen.',
  },
  deeperDive: [
    {
      q: 'What does "several or united conditions" mean?',
      a: '"Several" means examining each condition individually — looking inside each one for the effect. "United" means examining all conditions taken together as a collection. Nāgārjuna argues the effect cannot be found either way. It\'s not hidden in any single ingredient or in the pile.',
      realLifeExample: 'Looking for "wetness" in hydrogen alone, or in oxygen alone, or even in a tank of unmixed hydrogen and oxygen — you won\'t find wetness. Wetness emerges only when they combine as water. It wasn\'t hiding inside either gas.',
    },
    {
      q: 'If the effect isn\'t in the conditions, where does it come from?',
      a: 'The effect arises dependently from the interaction of conditions, but is not pre-contained in them. Its existence is relational and emergent. This is the key insight: arising doesn\'t require pre-existence. Effects emerge without being extracted.',
      realLifeExample: 'Music isn\'t "inside" any single instrument. It emerges from the coordinated interaction of musicians, instruments, and acoustic space. You can\'t find a symphony hiding inside a violin.',
    },
    {
      q: 'How does this challenge the Sāṃkhya view?',
      a: 'The Sāṃkhya school (satkāryavāda) held that effects pre-exist in their causes — like a statue already present within the marble block. Nāgārjuna argues this doesn\'t hold: you can\'t actually find the effect within the conditions before it arises. The "hidden statue" metaphor is misleading.',
      realLifeExample: 'Michelangelo said he just "removed what wasn\'t David" from the marble. But David wasn\'t literally in the marble — any number of statues could have been carved. The marble doesn\'t "contain" David independently of Michelangelo\'s choices.',
    },
    {
      q: 'How does quantum superposition illustrate this?',
      a: 'Before measurement, a quantum particle doesn\'t have a definite position, spin, or momentum "stored inside" it. The measurement outcome emerges through the interaction of the preparation and the measuring device. You cannot find the outcome by examining the quantum state alone — it\'s genuinely undetermined until measurement.',
      realLifeExample: 'Before rolling dice, the number "4" isn\'t hiding inside the dice. The outcome emerges from the throw — the force, angle, surface, and physics. The "4" was never contained within the dice as a fixed, pre-existing fact.',
    },
    {
      q: 'But don\'t seeds contain the potential for plants?',
      a: 'Conventionally, yes — seeds reliably produce plants. But Nāgārjuna distinguishes conventional potential from inherent containment. The seed doesn\'t inherently "contain" the plant as a hidden miniature. The plant depends on soil, water, light, temperature, and time — conditions the seed alone doesn\'t provide. Potential is relational, not stored.',
      realLifeExample: 'A seed in a sealed box on the moon won\'t become a plant. The "potential" isn\'t a thing inside the seed — it\'s a description of what happens when the right conditions come together.',
    },
    {
      q: 'What is the philosophical significance of "not found"?',
      a: 'The method of "searching and not finding" is central to Madhyamaka analysis. When you analytically search for the essence of something — its inherent, independent nature — you don\'t find it. This unfindability IS emptiness. The effect\'s unfindability in conditions demonstrates the emptiness of production.',
      realLifeExample: 'Try to find "you" — your essential self. Is it in your body? Your brain? Your memories? Your personality? When you search carefully, no single thing IS "you," yet "you" conventionally function perfectly. Unfindability + conventional functioning = emptiness.',
    },
  ],
  quiz: {
    beginner: {
      question: 'Can you find the "cake" by examining flour, eggs, sugar, and heat individually?',
      options: [
        'A) Yes — the cake is hidden inside the flour',
        'B) No — the cake emerges from their interaction but isn\'t hidden inside any single ingredient',
        'C) The cake doesn\'t exist',
        'D) Yes — the cake is in all ingredients equally',
      ],
      correct: 'B',
      explanation: 'Just as Nāgārjuna argues, the effect (cake) cannot be found in any single condition (ingredient) or in all conditions taken together. It emerges through their interaction.',
    },
    intermediate: {
      question: 'What philosophical view does this verse specifically challenge?',
      options: [
        'A) Nihilism — the view that nothing exists',
        'B) Satkāryavāda — the view that effects pre-exist within their causes',
        'C) Idealism — the view that only mind exists',
        'D) Materialism — the view that only matter exists',
      ],
      correct: 'B',
      explanation: 'This verse targets satkāryavāda (Sāṃkhya-style pre-existence of effect in cause) by showing that analytical search within conditions, individually or collectively, fails to find the effect.',
    },
    advanced: {
      question: 'How does the quantum Born Rule parallel Nāgārjuna\'s argument about effects and conditions?',
      options: [
        'A) The Born Rule shows outcomes are pre-stored in quantum states',
        'B) The Born Rule shows probabilities describe tendencies of emergence, not hidden contents — paralleling effects as emergent rather than pre-existing in conditions',
        'C) The Born Rule proves effects pre-exist in causes',
        'D) The Born Rule is irrelevant to Madhyamaka',
      ],
      correct: 'B',
      explanation: 'The Born Rule gives probabilities for outcomes that emerge upon measurement — they aren\'t hidden "inside" the quantum state. Similarly, effects emerge from conditions without being pre-contained within them.',
    },
  },
};

const VERSE_12 = {
  id: 'v1_12',
  number: 12,
  title: 'The Opponent\'s Challenge: Conditions vs. Non-Conditions',
  sanskrit: {
    text: 'athāsatash ca bhāvānāṃ pratyayebhyaḥ pravartate | apratyayebhyo \'pi bhāvānām utpattir nanu prasajyate ||',
    transliteration: 'athāsatash ca bhāvānāṃ pratyayebhyaḥ pravartate | apratyayebhyo \'pi bhāvānām utpattir nanu prasajyate ||',
    translation: 'However, if a nonexistent effect arises from these conditions, why does it not also arise from non-conditions?',
  },
  philosophy: {
    insight: 'The opponent challenges Nāgārjuna: if the effect doesn\'t pre-exist in the conditions (v.11), then what distinguishes conditions from non-conditions? If anything can arise from "empty" conditions, why can\'t anything arise from anything? This is the key objection that would make emptiness collapse into chaos.',
    madhyamaka: 'This verse voices the opponent\'s strongest objection. Garfield: the opponent argues that if the effect is genuinely nonexistent before arising, there\'s no principled basis for distinguishing what produces it (conditions) from what doesn\'t (non-conditions). Kalupahana: this challenges Nāgārjuna to explain the observed regularity and specificity of dependent origination without inherent causal power. Siderits/Katsura note this is a reductio against asatkāryavāda (non-pre-existence of effect).',
    quantum: 'Quantum Vacuum Fluctuations: Virtual particle-antiparticle pairs spontaneously appear from the quantum vacuum and annihilate almost instantly. The vacuum is not "nothing" — it has structure (quantum fields) that determines WHAT can fluctuate into existence. Random, but constrained by field structure.',
    bridge: 'Both illustrate that emergence from "emptiness" is not random chaos. The quantum vacuum has structure that constrains what can arise. Similarly, dependent origination has regularity — not because conditions have inherent power, but because the relational web constrains what arises. Emptiness ≠ anything-goes.',
    accessible: 'The opponent asks a fair question: "If the cake wasn\'t hiding inside the ingredients, why can\'t a cake arise from rocks and dirt?" Great question! The answer lies in how quantum physics handles a similar issue: the vacuum isn\'t "nothing" — it has structure. Virtual particles arise, but only specific types are allowed by the field\'s properties. Similarly, dependent origination has regularity — not from inherent power, but from the relational structure of conditions.',
    twoTruths: 'Conventionally, conditions have regularity — seeds grow plants, not rocks. Ultimately, this regularity comes from relational structure, not inherent causal power.',
    commonMisconception: 'Emptiness does NOT mean "anything can come from anything." Relational structure constrains what arises. Emptiness ≠ chaos.',
  },
  quantumResonance: {
    concept: 'Vacuum Fluctuations / Zero-Point Energy',
    score: 88,
    strength: 'High',
    explanation: 'Virtual particles arise from the "empty" vacuum, but constrained by field structure. Emergence from emptiness is structured, not random.',
    caveat: 'Quantum vacuum structure and Buddhist dependent origination both show structured emergence from emptiness. Analogy only.',
  },
  animation: {
    geometry: 'Vacuum Fluctuation Field',
    anchor: 'A flat quantum field plane stretching across the scene. On the left half: labeled "Conditions" with structured field lines. On the right half: labeled "Non-Conditions" with flat, inert surface.',
    texture: 'Conditions side: Vibrating, glowing mesh grid with particle pairs bubbling up. Non-conditions side: Dark, still, featureless surface. Particles: Bright pairs (particle + antiparticle) in complementary colors.',
    mood: 'Dynamic contrast between structured emergence and inert void',
    colors: ['#8B5CF6', '#EC4899', '#10B981', '#1E293B'],
    orchestration: {
      start: 'Both halves visible. Conditions side is bubbling with virtual particle pairs. Non-conditions side is dark and still.',
      click: 'User clicks the conditions side — particle pairs pop up, briefly exist, then annihilate. User clicks the non-conditions side — nothing happens. Illustrates: emergence is structured, not random.',
      reveal: 'Zooming in on the conditions side reveals the FIELD STRUCTURE (grid lines, energy gradients) that constrains what can arise. The non-conditions side lacks this structure.',
    },
    interaction: {
      click: 'Click conditions side to spawn virtual pairs; click non-conditions side to see nothing arises',
      drag: 'Pan between the two halves to compare structured vs. unstructured emergence',
      hover: 'Field lines glow to reveal the hidden relational structure enabling emergence',
    },
    controls: {
      rotation: { default: false, speed: 0.2 },
      speed: { default: 60, min: 0, max: 100 },
      complexity: { default: 75, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'ShaderMaterial for animated field grid with sine-wave displacement',
      'InstancedMesh for virtual particle pairs (200+ pairs, pooled)',
      'Custom particle birth/death shader with scale-up/fade-out',
      'Bloom post-processing on particle creation flashes',
      'drei Text for "Conditions" / "Non-Conditions" labels',
    ],
    camera: { position: [0, 5, 10], fov: 55, autoRotate: false },
    fps: 60,
    performanceNotes: '<400MB memory, 60 FPS. Particle pairs pooled via InstancedMesh for efficient birth/death cycles. Field grid uses vertex shader displacement.',
    tripoPrompt: 'A split quantum field plane, left half vibrating with colorful particle pairs bubbling up from a glowing grid, right half dark and inert, deep space background, split-screen composition, 8K.',
    visualBridge: 'The split field shows why emptiness isn\'t chaos: the conditions side has relational structure enabling emergence, while the non-conditions side lacks it. Regularity comes from structure, not from inherent power.',
    educationalGoal: 'User understands why emptiness is not chaos — relational structure constrains what can arise, just as the quantum vacuum has structure.',
  },
  deeperDive: [
    {
      q: 'Who is speaking in this verse — Nāgārjuna or an opponent?',
      a: 'This is the opponent\'s challenge to Nāgārjuna. Having heard that effects don\'t pre-exist in conditions (v.11), the opponent pushes back: "If the effect was genuinely nonexistent before arising, what makes conditions special? Why can\'t effects arise from just anything?"',
      realLifeExample: 'Like a student challenging a teacher: "If the answer wasn\'t already in the textbook, why is studying THIS textbook better than reading a phone book?" Fair question that needs a good answer.',
    },
    {
      q: 'What is the core of the opponent\'s objection?',
      a: 'The opponent argues: without inherent causal power in the conditions, there\'s no principled distinction between conditions and non-conditions. If flour doesn\'t inherently contain cake-power, how is flour different from sand in producing cakes? The observed specificity of causation seems to demand inherent causal power.',
      realLifeExample: 'If "medicine" has no inherent healing power, why take medicine instead of eating random leaves? The opponent demands an explanation for why specific conditions produce specific effects.',
    },
    {
      q: 'Is this objection valid?',
      a: 'It\'s a serious objection that Nāgārjuna takes seriously. But it rests on a false dichotomy: either conditions have inherent causal power OR causation is random. Nāgārjuna will show a third option: conventional regularity without inherent power. The relational structure of conditions constrains what arises without any single condition "containing" inherent productive force.',
      realLifeExample: 'Traffic rules aren\'t "inherently" inside any car, yet traffic flows in specific, regular patterns. The regularity comes from the relational system (roads, signs, conventions, other cars), not from inherent car-essences.',
    },
    {
      q: 'How do quantum vacuum fluctuations address this?',
      a: 'The quantum vacuum appears "empty" but has rich structure — quantum fields with specific properties. Virtual particles arise, but only those allowed by the field\'s mathematical structure (conservation laws, symmetries). Emergence from emptiness is structured, not random. This is precisely the middle ground between "inherent power" and "anything goes."',
      realLifeExample: 'An empty stage in a theater isn\'t formless chaos. The stage has dimensions, acoustics, lighting rigs. Only certain performances can happen there. The "emptiness" of the stage is structured, enabling specific possibilities, not random ones.',
    },
    {
      q: 'What distinguishes conditions from non-conditions if neither has inherent power?',
      a: 'Conditions are conventionally designated based on observed regularity and relational structure. Seeds produce plants (not rocks) because of the relational configuration of conditions — not because seeds have "plant-essence" inside them. The regularity is conventional, not inherent.',
      realLifeExample: 'A key opens its specific lock — not because the key has "opening-power" but because the shapes match. The relationship between key and lock explains the regularity. A random stick (non-condition) doesn\'t open the lock because the relational fit is absent.',
    },
    {
      q: 'Does Nāgārjuna ever answer this objection directly?',
      a: 'Yes — v.13 and v.14 provide his response. He shows that the opponent\'s demand for inherent causal power leads to its own contradictions, and that emptiness is what makes the regularity of conditions intelligible. The full answer comes in Chapter 24 (v.18): "Whatever is dependently arisen, that is explained as emptiness."',
      realLifeExample: 'A good teacher doesn\'t just answer the question directly — they show why the question\'s assumption is wrong. Nāgārjuna shows the opponent\'s demand for inherent power is itself the source of the confusion.',
    },
  ],
  quiz: {
    beginner: {
      question: 'What is the opponent\'s main objection in this verse?',
      options: [
        'A) Effects can\'t arise at all',
        'B) If effects don\'t pre-exist in conditions, why can\'t they arise from non-conditions too?',
        'C) Conditions don\'t exist',
        'D) Only one condition is needed for any effect',
      ],
      correct: 'B',
      explanation: 'The opponent challenges: if the effect was nonexistent before arising, what makes specific conditions (not random non-conditions) produce it? Where does causal regularity come from?',
    },
    intermediate: {
      question: 'How does the quantum vacuum illustrate that emergence from "emptiness" isn\'t random?',
      options: [
        'A) The vacuum is absolute nothingness',
        'B) The vacuum has quantum field structure that constrains what can arise — emptiness is structured, not chaotic',
        'C) Nothing arises from the vacuum',
        'D) The vacuum has inherent causal power',
      ],
      correct: 'B',
      explanation: 'The quantum vacuum appears "empty" but has rich field structure. Virtual particles arise only in ways consistent with conservation laws and symmetries. Emergence from emptiness is structured, not random.',
    },
    advanced: {
      question: 'What false dichotomy does the opponent\'s objection rest on?',
      options: [
        'A) Either everything exists or nothing exists',
        'B) Either conditions have inherent causal power, or causation is completely random — ignoring the middle way of conventional regularity without inherent power',
        'C) Either effects pre-exist or they never arise',
        'D) Either Buddhism is right or physics is right',
      ],
      correct: 'B',
      explanation: 'The opponent assumes: inherent power OR chaos. Nāgārjuna\'s middle way: conventional regularity structured by relational configurations, without any condition possessing inherent productive power. Order without essence.',
    },
  },
};

const VERSE_13 = {
  id: 'v1_13',
  number: 13,
  title: 'Nāgārjuna\'s Response: Mutual Emptiness',
  sanskrit: {
    text: 'phalaṃ ca pratyayamayaṃ pratyayāś cāsvayaṃmayāḥ | phalam āsvayaṃmayebhyo yat tat pratyayamayaṃ katham ||',
    transliteration: 'phalaṃ ca pratyayamayaṃ pratyayāś cāsvayaṃmayāḥ | phalam āsvayaṃmayebhyo yat tat pratyayamayaṃ katham ||',
    translation: 'The effect has the nature of the conditions, but the conditions do not have their own nature. How could an effect whose nature is the conditions come from what is without own-nature?',
  },
  philosophy: {
    insight: 'Nāgārjuna responds to the opponent\'s challenge (v.12) by deepening the emptiness argument. The effect\'s nature supposedly derives from the conditions — but the conditions themselves lack own-nature. If the source is essenceless, the derived effect cannot inherit an essence it never had. Both are empty. This isn\'t a problem — it\'s the solution.',
    madhyamaka: 'Garfield reads this verse as Nāgārjuna\'s masterstroke: the opponent assumed the effect needs an essence derived from conditions. But conditions are also essenceless (proven in v.3-7). So the entire framework of essence-transfer collapses. Kalupahana: Nāgārjuna turns the opponent\'s own logic against them — if you require essences, you can\'t explain where they come from. Siderits/Katsura: this verse demonstrates that the demand for inherent existence is self-defeating at every level.',
    quantum: 'Quantum Entanglement and Non-Separability: In an entangled system, neither particle has an independent quantum state. The state of each is defined only relative to the other. There\'s no "own-nature" that either possesses independently — the system is irreducibly relational.',
    bridge: 'Both frameworks reveal that the demand for independent properties (svabhāva/local states) is self-defeating. Entangled particles don\'t have independent states to "transfer" to each other. Conditions don\'t have independent essences to "transfer" to effects. Both exist only in relation.',
    accessible: 'Imagine you claim your personality comes from your parents. But where did THEIR personalities come from? Their parents. And those from THEIR parents. You never find a "first personality" that has its own essence — it\'s relationships all the way down. Nāgārjuna makes the same point: if effects get their nature from conditions, but conditions also lack own-nature, the chain of essence-derivation has no foundation. That\'s not a problem — it means everything is relational.',
    twoTruths: 'Conventionally, conditions contribute to effects. Ultimately, conditions cannot transfer inherent nature because they lack it themselves — the chain has no foundation.',
    commonMisconception: 'NOT saying the chain of causation is defective. Saying the chain works BECAUSE it has no inherent foundation — relationships all the way down.',
  },
  quantumResonance: {
    concept: 'Entanglement / Non-Separability',
    score: 93,
    strength: 'High',
    explanation: 'Entangled particles have no independent states — each is defined only in relation to the other. No own-nature to transfer. Parallel: conditions cannot give essence they don\'t possess.',
    caveat: 'Entanglement without independent states and conditions without inherent essence share structural features. Educational parallel.',
  },
  animation: {
    geometry: 'Entangled Essence-Transfer Failure',
    anchor: 'Two transparent vessels connected by a flowing tube. One vessel labeled "Conditions," the other "Effect." A glowing liquid (representing "essence") is supposed to flow from one to the other.',
    texture: 'Vessels: Clear crystal with internal facets. Tube: Transparent with pulsing energy flow markers. Liquid: Luminous violet that becomes transparent the closer you look.',
    mood: 'Elegant paradox, the beauty of finding nothing to transfer',
    colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#E0E7FF'],
    orchestration: {
      start: 'Conditions vessel appears full of glowing "essence." Effect vessel is empty.',
      click: 'User clicks to initiate "essence transfer" — the liquid flows through the tube but becomes transparent as it moves. When it arrives in the Effect vessel, both vessels are equally transparent. Zooming into the Conditions vessel reveals it was always transparent too — the "essence" was an illusion.',
      reveal: 'Both vessels glow with a soft network pattern between them, showing relational connection without substance transfer.',
    },
    interaction: {
      click: 'Initiate essence transfer — watch it dissolve during transit',
      drag: 'Rotate to see both vessels are equally transparent from different angles',
      hover: 'Vessels show illusory fullness from one angle, transparency from another',
    },
    controls: {
      rotation: { default: true, speed: 0.3 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 65, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'MeshPhysicalMaterial with transmission for crystal vessels',
      'Custom flow shader for liquid transfer animation with alpha fade',
      'InstancedMesh for relational network particles between vessels',
      'Bloom + ChromaticAberration post-processing for crystal refraction',
      'drei useTexture for faceted interior patterns',
    ],
    camera: { position: [0, 2, 7], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<400MB memory, 60 FPS. Transmission material approximated for performance. Flow shader uses simple UV scrolling with alpha gradient.',
    tripoPrompt: 'Two crystal vessels connected by a glowing tube, luminous purple liquid flowing between them and becoming transparent mid-flow, revealing both vessels are empty, network patterns glowing between them, studio lighting, 8K.',
    visualBridge: 'The "essence transfer" fails because there was never any essence to transfer. Both vessels are revealed as empty, connected by relational patterns rather than substance.',
    educationalGoal: 'User grasps that the infinite regress of essence-derivation is not a problem but a FEATURE — it means everything is relational.',
  },
  deeperDive: [
    {
      q: 'Is this verse still the opponent speaking, or is it Nāgārjuna?',
      a: 'Scholars differ. Garfield reads it as Nāgārjuna\'s own argument, turning the opponent\'s logic against them. Kalupahana reads it similarly — Nāgārjuna shows that the opponent\'s framework of essence-derivation collapses when conditions themselves are essenceless. Either reading leads to the same conclusion: mutual emptiness.',
      realLifeExample: 'Whether the detective or the suspect makes this point, the conclusion is the same: if the alibi-provider has no alibi themselves, the whole chain of alibis collapses.',
    },
    {
      q: 'What does "the effect has the nature of the conditions" mean?',
      a: 'The opponent assumes the effect\'s nature (essence) is constituted by its conditions — the effect IS what its conditions make it. This seems reasonable: a plant\'s nature seems to "come from" its seed, soil, and water. But Nāgārjuna asks: what is the nature of those conditions themselves?',
      realLifeExample: 'If you say your sense of humor comes from your mom, and her sense of humor came from her dad, and his came from his experiences... where is the "original humor-essence"? There isn\'t one. It\'s relationships all the way back.',
    },
    {
      q: 'Why is it a problem that conditions lack own-nature?',
      a: 'If the conditions themselves have no independent essence (proven in v.3-7), they cannot serve as a foundation for the effect\'s essence. You can\'t derive something (essence) from nothing (essencelessness). The entire project of grounding the effect\'s reality in the conditions\' reality fails — there\'s no bedrock.',
      realLifeExample: 'If your bank guarantees your loan based on another bank\'s guarantee, which is based on another\'s, and no bank actually has any money — the entire guarantee system is empty. There\'s no foundation.',
    },
    {
      q: 'How does quantum entanglement illustrate this?',
      a: 'In an entangled pair, particle A has no independent quantum state, and particle B has no independent quantum state. The "state" of each is defined only through their correlation. You can\'t say A\'s properties "come from" B or vice versa — neither has independent properties to give. The system is irreducibly relational.',
      realLifeExample: 'In a dance pair, the lead\'s movements don\'t have meaning without the follow, and vice versa. Neither dancer\'s "dance-essence" is independent — the dance exists only in their relationship.',
    },
    {
      q: 'Doesn\'t this lead to infinite regress?',
      a: 'That\'s precisely Nāgārjuna\'s point! If you require essence, you face infinite regress — conditions need conditions, which need conditions, forever. The solution isn\'t to find a first cause with inherent essence. The solution is to abandon the demand for essence altogether. Emptiness isn\'t a problem — it\'s the escape from infinite regress.',
      realLifeExample: '"Who created God?" is the infinite regress problem. If everything needs a creator with inherent power, you need an infinite chain. The Buddhist solution: abandon the assumption that anything needs inherent existence. The chain never started because there\'s no chain to start.',
    },
    {
      q: 'How does this verse resolve the opponent\'s challenge from v.12?',
      a: 'The opponent demanded: if conditions lack inherent power, how can they produce effects? Nāgārjuna responds: the very framework of "inherent production" is incoherent. Conditions can\'t have essence to transfer. Effects can\'t receive essence from essenceless conditions. The entire essence-transfer model fails. What remains? Dependent origination without essence — which is exactly how things conventionally work.',
      realLifeExample: 'A river doesn\'t have "flow-essence" that it transfers to the ocean. The flow IS the river, not something the river "has." Similarly, conditions don\'t "transfer power" to effects — the arising IS the interdependent process, not a transfer of substance.',
    },
  ],
  quiz: {
    beginner: {
      question: 'If conditions themselves lack own-nature, can they give "essence" to their effects?',
      options: [
        'A) Yes — conditions always pass on their essence',
        'B) No — you can\'t give what you don\'t have; both conditions and effects are essenceless',
        'C) Only sometimes',
        'D) Effects create their own essence',
      ],
      correct: 'B',
      explanation: 'Nāgārjuna shows that conditions cannot transfer an essence they don\'t possess. Since conditions are essenceless, effects derived from them are also essenceless. Both are empty.',
    },
    intermediate: {
      question: 'How does quantum entanglement illustrate the mutual emptiness of conditions and effects?',
      options: [
        'A) Each entangled particle has its own independent state it transfers to the other',
        'B) Neither particle has an independent state — their properties are defined only through their correlation, paralleling conditions and effects lacking own-nature',
        'C) Entanglement proves particles have inherent essence',
        'D) Entanglement is unrelated to emptiness',
      ],
      correct: 'B',
      explanation: 'In entanglement, neither particle has an independent quantum state to "transfer." Their properties exist only in relation. Similarly, conditions have no independent essence to transfer to effects.',
    },
    advanced: {
      question: 'How does Nāgārjuna\'s argument here escape the infinite regress problem?',
      options: [
        'A) By finding a first cause with inherent essence',
        'B) By abandoning the demand for essence altogether — emptiness means no regress is needed because there\'s no essence to ground in the first place',
        'C) By claiming the regress is actually finite',
        'D) By denying causation exists',
      ],
      correct: 'B',
      explanation: 'The infinite regress ("where does essence come from?") only arises if you demand essence. Nāgārjuna dissolves the regress by showing the demand itself is incoherent. Emptiness means: no essence was ever needed.',
    },
  },
};

const VERSE_14 = {
  id: 'v1_14',
  number: 14,
  title: 'Grand Conclusion: Mutual Emptiness of Conditions and Effects',
  sanskrit: {
    text: 'tasmān na pratyayamayaṃ nāpratyayamayaṃ phalam | saṃvidyate phalābhāvāt pratyayāpratyayāḥ kutaḥ ||',
    transliteration: 'tasmān na pratyayamayaṃ nāpratyayamayaṃ phalam | saṃvidyate phalābhāvāt pratyayāpratyayāḥ kutaḥ ||',
    translation: 'Therefore, neither with conditions as their essence nor with non-conditions as their essence are there any effects. If there are no such effects, how could conditions or non-conditions be evident?',
  },
  philosophy: {
    insight: 'The chapter\'s grand conclusion: effects don\'t inherently arise from conditions or non-conditions. And if effects are empty, the very distinction between conditions and non-conditions dissolves — since "condition" is only meaningful in relation to an effect. Both sides of the causal relationship are mutually empty. This is not nihilism but the foundation for understanding dependent origination.',
    madhyamaka: 'Garfield: "This is the culmination of Nāgārjuna\'s analysis. Neither conditions nor non-conditions can serve as the inherent basis of effects. And without inherently existing effects, the very categories of \'condition\' and \'non-condition\' lose their inherent ground." The mutual dependence of conditions and effects means neither can be established first or independently. Kalupahana: this verse embodies the two truths — conventionally, conditions produce effects; ultimately, both are empty. Siderits/Katsura: the verse completes a systematic deconstruction that began with the tetralemma of v.1 and ends with the mutual dissolution of the entire causal framework as inherently real.',
    quantum: 'Quantum Complementarity (Bohr): Reality requires mutually exclusive frameworks that cannot be unified into a single inherent description. Wave and particle aspects are complementary — neither alone captures the full picture, and both are needed conventionally. No inherent "wave-essence" or "particle-essence" exists.',
    bridge: 'Both Madhyamaka and quantum complementarity teach that reality cannot be captured by any single inherent description. "Conditions" and "effects" are complementary conventional designations — useful but not independently real. Just as light is neither inherently wave nor inherently particle, causal relationships are neither inherently condition-based nor inherently unconditioned.',
    accessible: 'Think of "left" and "right." Neither exists independently — "left" is only meaningful in relation to "right," and vice versa. Remove one and the other loses meaning. Nāgārjuna shows that "conditions" and "effects" are exactly like this — each defined only in relation to the other. Neither has independent existence. They are mutually empty labels for a process that actually works through interdependence, not through inherent essences.',
    twoTruths: 'Conventionally, conditions and effects are useful, functional descriptions. Ultimately, neither "condition" nor "effect" has independent existence — they are complementary designations.',
    commonMisconception: 'The chapter\'s conclusion is NOT that causation fails. It\'s that INHERENT causation fails while DEPENDENT causation flourishes. The Middle Way.',
  },
  quantumResonance: {
    concept: 'Complementarity / Wave-Particle Duality',
    score: 92,
    strength: 'High',
    explanation: 'Complementarity shows reality requires mutually exclusive descriptions with no single inherent essence. Parallels the mutual emptiness of conditions and effects.',
    caveat: 'Quantum complementarity and Madhyamaka two-truths both show reality transcends single inherent descriptions. Structural parallel.',
  },
  animation: {
    geometry: 'Complementarity Dissolution Mandala',
    anchor: 'A mandala-like circular structure with "Conditions" forming the outer ring and "Effects" forming the inner ring. Between them: flowing energy patterns showing their mutual dependence.',
    texture: 'Outer ring: Geometric, structured, cyan (#06B6D4) segments. Inner ring: Organic, flowing, violet (#8B5CF6) shapes. Between: Shimmering gold (#F59E0B) threads connecting inner to outer.',
    mood: 'Resolution, unity, the peace of understanding — grand finale energy',
    colors: ['#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#E0E7FF'],
    orchestration: {
      start: 'Mandala rotates slowly, outer and inner rings distinct.',
      click: 'User clicks "Dissolve Boundary" — the border between inner and outer rings fades. The gold threads spread everywhere. Both rings merge into a single flowing pattern where conditions and effects are indistinguishable — a unified field of dependent arising.',
      final: 'The merged pattern pulses once, then gently settles into a serene, luminous web — the visual representation of pratītyasamutpāda (dependent origination).',
    },
    interaction: {
      click: 'Click "Dissolve Boundary" to merge conditions and effects into unified dependent arising',
      drag: 'Rotate the mandala to see the dissolution from every angle',
      hover: 'Individual segments highlight to show they\'re conventionally identifiable but not independently real',
    },
    controls: {
      rotation: { default: true, speed: 0.5 },
      speed: { default: 50, min: 0, max: 100 },
      complexity: { default: 80, min: 0, max: 100 },
      zoom: { default: 100, min: 50, max: 200 },
      colorPicker: true,
    },
    r3fTechniques: [
      'Custom mandala shader with animated ring dissolution (UV-based morph)',
      'InstancedMesh for 1000+ connecting threads with animated opacity',
      'Bloom + ToneMapping post-processing for luminous finale effect',
      'drei Float for serene settling animation',
      'Adaptive particle count based on device capability (500-5000)',
    ],
    camera: { position: [0, 3, 8], fov: 50, autoRotate: true },
    fps: 60,
    performanceNotes: '<450MB memory, 60 FPS. Mandala uses single mesh with UV-animated shader. Thread instances pooled. Bloom intensity curves down during settle phase.',
    tripoPrompt: 'A luminous mandala with cyan outer ring and violet inner ring dissolving into a unified golden web of light, serene deep space background, sacred geometry, volumetric glow, 8K cinematic render.',
    visualBridge: 'The mandala dissolving represents the collapse of the artificial boundary between conditions and effects. What remains is the unified web of dependent arising — beautiful, functional, and empty of inherent divisions.',
    educationalGoal: 'User comprehends the chapter\'s conclusion: conditions are empty of inherent existence yet conventionally real — the Middle Way applied to causation.',
  },
  deeperDive: [
    {
      q: 'Is Nāgārjuna saying effects don\'t exist and conditions don\'t exist?',
      a: 'No! He\'s saying effects don\'t INHERENTLY exist, and conditions don\'t INHERENTLY exist. Conventionally, causes produce effects, conditions give rise to results — this works perfectly. What doesn\'t work is claiming any of this involves independently real essences. The conventional world is preserved; only the illusion of inherent existence is dissolved.',
      realLifeExample: 'A rainbow doesn\'t inherently exist (it\'s not a solid arch you can touch), but it conventionally exists (you can see it, photograph it, point at it). Nāgārjuna treats all of reality this way: conventionally real, ultimately empty.',
    },
    {
      q: 'What does "how could conditions or non-conditions be evident?" mean?',
      a: 'The designations "condition" and "non-condition" are meaningful only in relation to effects. If effects are empty of inherent existence, then the categories we use to explain them (conditions/non-conditions) also lose inherent ground. You can\'t identify something as a "condition" without reference to the effect it supposedly conditions. They define each other.',
      realLifeExample: 'Can you be a "parent" without children? Can a "teacher" exist without students? These labels are relational — remove one side and the other loses its meaning. "Condition" is only a condition BECAUSE of the effect.',
    },
    {
      q: 'How does quantum complementarity illustrate this mutual emptiness?',
      a: 'Bohr\'s complementarity principle states that quantum objects require mutually exclusive descriptions (wave/particle) depending on experimental context. Neither description captures the inherent nature of the object — because there IS no single inherent nature. The object exists complementarily, not inherently. Similarly, conditions and effects exist relationally, not inherently.',
      realLifeExample: 'Is a person an "employee" or a "friend"? Both — depending on context. Neither label captures their inherent nature because there IS no single fixed nature. They exist relationally, through different frames.',
    },
    {
      q: 'What is the Two Truths doctrine, and how does this verse illustrate it?',
      a: 'The Two Truths (satyadvaya) distinguish conventional truth (saṃvṛti-satya) from ultimate truth (paramārtha-satya). Conventionally, conditions produce effects — this is how we navigate the world. Ultimately, both conditions and effects are empty of inherent existence. This verse operates at the ultimate level while preserving the conventional. The two truths are not opposed — they\'re complementary perspectives on the same reality.',
      realLifeExample: 'Conventionally, the sun "rises" in the east. Ultimately, the earth rotates. Both descriptions are true at their level. Saying "the earth rotates" doesn\'t mean sunrises aren\'t real experiences — it means they\'re not what they appear to be at a deeper level.',
    },
    {
      q: 'What practical wisdom does this verse offer?',
      a: 'Stop looking for inherent causes of your happiness or suffering. Your emotional state doesn\'t arise from any single, inherently existing condition. It arises from the web of conditions: thoughts, relationships, health, environment, habits — all interdependent, all empty, all changeable. This means transformation is always possible.',
      realLifeExample: 'You\'re not depressed BECAUSE of your job (inherent cause). Your mood arises from the interaction of work conditions, sleep, relationships, exercise, self-talk, and many other factors. Change any of these conditions and the "effect" (your mood) shifts. Emptiness means flexibility.',
    },
    {
      q: 'What makes this verse the "grand conclusion"?',
      a: 'It synthesizes all 13 preceding verses into a single insight: both sides of the causal relationship (conditions AND effects) are empty of inherent existence. This is not a partial result — it\'s the complete deconstruction of inherent causation. Nothing that appears to be a cause or an effect has independent reality. Yet everything functions conventionally through dependent origination.',
      realLifeExample: 'A grand finale at a fireworks show doesn\'t just add one more firework — it combines all the colors, patterns, and sounds into a unified climax. V.14 similarly brings together every thread of the chapter into one unified conclusion.',
    },
  ],
  quiz: {
    beginner: {
      question: 'What is the main conclusion of Chapter 1?',
      options: [
        'A) Nothing exists at all',
        'B) Things exist with strong inherent essences',
        'C) Both conditions and effects are empty of inherent existence, but conventional causation still functions through dependent origination',
        'D) Only conditions exist, not effects',
      ],
      correct: 'C',
      explanation: 'Chapter 1 concludes that neither conditions nor effects have inherent existence. But this doesn\'t mean nothing exists — it means everything exists conventionally through dependent origination, without fixed essences.',
    },
    intermediate: {
      question: 'Why does the emptiness of effects also undermine the concept of "conditions"?',
      options: [
        'A) Because conditions are more fundamental than effects',
        'B) Because "condition" is only meaningful in relation to an effect — if effects are empty, the category "condition" loses its inherent ground too',
        'C) Because conditions don\'t exist conventionally',
        'D) Because effects exist independently of conditions',
      ],
      correct: 'B',
      explanation: 'The label "condition" derives its meaning from the effect it conditions. Without inherently existing effects, "condition" and "non-condition" are relational designations without inherent ground. They define each other.',
    },
    advanced: {
      question: 'How does Bohr\'s complementarity principle parallel the mutual emptiness described in this verse?',
      options: [
        'A) Both prove things have inherent wave-nature',
        'B) Both show that reality requires mutually exclusive conventional descriptions (wave/particle; condition/effect) without any single inherent essence underlying them',
        'C) Complementarity proves conditions have inherent power',
        'D) They are completely unrelated frameworks',
      ],
      correct: 'B',
      explanation: 'Complementarity shows quantum objects require mutually exclusive descriptions with no single inherent nature. Similarly, Nāgārjuna shows conditions and effects are mutually defined conventional designations with no independent inherent existence — reality is relational, not essential.',
    },
  },
};

// ---------------------------------------------------------------------------
// VERSES: Canonical verse map (1-14)
// ---------------------------------------------------------------------------
export const VERSES = {
  1: enrichVerse(VERSE_1_1, 1),
  2: enrichVerse(VERSE_1_2, 2),
  3: enrichVerse(VERSE_1_3, 3),
  4: enrichVerse(VERSE_1_4, 4),
  5: enrichVerse(VERSE_1_5, 5),
  6: enrichVerse(VERSE_1_6, 6),
  7: enrichVerse(VERSE_1_7, 7),
  8: VERSE_8,
  9: VERSE_9,
  10: VERSE_10,
  11: VERSE_11,
  12: VERSE_12,
  13: VERSE_13,
  14: VERSE_14,
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export function getVerse(verseNumber) {
  return VERSES[verseNumber] || null;
}

export function getAllVerses() {
  return Object.values(VERSES);
}

export default { CHAPTER_CONFIG, VERSES };
