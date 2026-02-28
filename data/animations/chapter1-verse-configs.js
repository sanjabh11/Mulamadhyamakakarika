/**
 * Chapter 1 Verse Configurations
 * 
 * Complete data for all 7 verses including:
 * - Verse metadata
 * - Animation configurations
 * - Interaction definitions
 * - Quiz questions (tiered)
 * - FAQ items
 */

export const CHAPTER_1_VERSES = {
  '1.1': {
    id: 'ch1_v1_catuskoti',
    quantum_concept: 'bells_theorem',
    mmk_concept: 'catuskoti_tetralemma',
    title: 'Investigation of Conditions',
    
    interactions: [
      {
        id: 'try_self',
        button_label: 'From Self',
        sanskrit: 'svataḥ',
        action: 'flash_fail',
        message: 'Self-causation leads to infinite regress',
        tooltip: 'If things produced themselves, they would need to exist before existing'
      },
      {
        id: 'try_other',
        button_label: 'From Other',
        sanskrit: 'parataḥ',
        action: 'pass_through',
        message: 'Other-causation severs the causal link',
        tooltip: 'Complete independence means no real causation'
      },
      {
        id: 'try_both',
        button_label: 'From Both',
        sanskrit: 'dvābhyām',
        action: 'merge_dissolve',
        message: 'Both options inherit both problems',
        tooltip: 'Combining two invalid options does not create a valid one'
      },
      {
        id: 'try_random',
        button_label: 'Without Cause',
        sanskrit: 'ahetutaḥ',
        action: 'nothing',
        message: 'Causelessness explains nothing',
        tooltip: 'Random arising contradicts observable patterns'
      },
      {
        id: 'realize',
        button_label: 'Dependent Origination',
        sanskrit: 'pratītyasamutpāda',
        action: 'reveal_network',
        message: 'Things arise interdependently, not from inherent causes',
        tooltip: 'The middle way between eternalism and nihilism',
        is_solution: true
      }
    ],
    
    educational_overlay: {
      mmk_insight: 'Nagarjuna exhausts all logical possibilities for inherent causation',
      quantum_parallel: "Bell's Theorem similarly rules out local hidden variables",
      bridge: 'Both systems reveal reality is non-local and relational'
    },
    
    quiz_questions: [
      {
        type: 'mcq',
        tier: 'beginner',
        question: 'What does Verse 1.1 argue about the arising of entities?',
        options: [
          'Entities arise from themselves',
          'Entities arise from other entities',
          'Entities do not arise from self, other, both, or causelessly',
          'Entities arise randomly'
        ],
        correct_answer: 2,
        explanation: 'Nāgārjuna refutes all four extreme positions (catuskoti), showing that inherent arising is logically impossible.',
        xp_value: 15
      },
      {
        type: 'mcq',
        tier: 'student',
        question: 'How does Bell\'s Theorem relate to the catuskoti?',
        options: [
          'It proves quantum mechanics is random',
          'It rules out local hidden variable theories',
          'It confirms particles have definite properties',
          'It has no relation to Buddhist philosophy'
        ],
        correct_answer: 1,
        explanation: 'Bell\'s Theorem eliminates local realist explanations, paralleling how Nāgārjuna eliminates inherent causation models.',
        xp_value: 20
      },
      {
        type: 'mcq',
        tier: 'scholar',
        question: 'What is the deeper significance of the tetralemma in Madhyamaka logic?',
        options: [
          "It is a rhetorical device with no logical significance",
          'It systematically deconstructs conceptual proliferation (prapañca)',
          'It proves nihilism is the correct view',
          'It establishes a fifth alternative beyond the four'
        ],
        correct_answer: 1,
        explanation: 'The catuskoti is a methodical tool to dismantle reified concepts, pointing to emptiness (śūnyatā) beyond conceptual extremes.',
        xp_value: 30
      }
    ],
    
    faqs: [
      {
        tier: 'beginner',
        question: 'Does this mean nothing exists?',
        answer: 'No. Nāgārjuna is refuting inherent, independent existence—not conventional existence. Things exist dependently.'
      },
      {
        tier: 'student',
        question: 'How can we trust causality if inherent causation is refuted?',
        answer: 'Conventional causality works fine for practical purposes. Nāgārjuna targets the metaphysical assumption that causes have inherent causal power.'
      },
      {
        tier: 'scholar',
        question: 'Is dependent origination itself empty?',
        answer: 'Yes. Pratītyasamutpāda is not a metaphysical ground, but a descriptive framework. It too is empty of inherent existence (śūnyatāśūnyatā).'
      }
    ]
  },
  
  '1.2': {
    id: 'ch1_v2_four_conditions',
    quantum_concept: 'holographic_principle',
    mmk_concept: 'four_pratyayas',
    title: 'The Four Conditions',
    
    interactions: [
      {
        id: 'hover_efficient',
        button_label: 'Efficient Cause',
        sanskrit: 'hetupratyaya',
        action: 'highlight_tether',
        message: 'The primary factor (e.g., seed for sprout)',
        tooltip: 'Dominant contributory factor'
      },
      {
        id: 'hover_percept',
        button_label: 'Percept-Object',
        sanskrit: 'ālambanapratyaya',
        action: 'highlight_tether',
        message: 'The object condition (e.g., form for consciousness)',
        tooltip: 'That which consciousness takes as object'
      },
      {
        id: 'hover_immediate',
        button_label: 'Immediate-Prior',
        sanskrit: 'anantarapratyaya',
        action: 'highlight_tether',
        message: 'The immediately preceding moment (e.g., previous thought)',
        tooltip: 'Temporal continuity condition'
      },
      {
        id: 'hover_dominant',
        button_label: 'Dominant',
        sanskrit: 'adhipatipratyaya',
        action: 'highlight_tether',
        message: 'Empowering conditions (e.g., light for seeing)',
        tooltip: 'Enabling background conditions'
      }
    ],
    
    educational_overlay: {
      mmk_insight: 'The four conditions lack inherent power; they function relationally',
      quantum_parallel: 'Holographic principle: information distributed non-locally',
      bridge: 'Both reject localized, separable causal mechanisms'
    },
    
    quiz_questions: [
      {
        type: 'mcq',
        tier: 'beginner',
        question: 'How many conditions does Verse 1.2 analyze?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correct_answer: 2,
        explanation: 'The four pratyayas (conditions) are: efficient, percept-object, immediate-prior, and dominant.',
        xp_value: 10
      }
    ],
    
    faqs: [
      {
        tier: 'beginner',
        question: 'What are the four conditions?',
        answer: 'Efficient cause (hetu), percept-object (ālambana), immediate-prior (anantara), and dominant (adhipati) conditions.'
      }
    ]
  },
  
  '1.3': {
    id: 'ch1_v3_contextuality',
    quantum_concept: 'quantum_contextuality',
    mmk_concept: 'essence_conditions',
    title: 'Essence and Conditions',
    
    educational_overlay: {
      mmk_insight: 'Conditions cannot produce essence; essence would preclude conditions',
      quantum_parallel: 'Kochen-Specker: Properties depend on measurement context',
      bridge: 'No context-independent reality exists'
    },
    
    quiz_questions: [
      {
        type: 'mcq',
        tier: 'student',
        question: 'What does quantum contextuality demonstrate?',
        options: [
          'Particles have definite pre-existing properties',
          'Measurement outcomes depend on the full experimental context',
          'Quantum mechanics is incomplete',
          'Observer consciousness creates reality'
        ],
        correct_answer: 1,
        explanation: 'Contextuality shows properties emerge from the measurement setup, not from intrinsic particle attributes.',
        xp_value: 20
      }
    ],
    
    faqs: [
      {
        tier: 'student',
        question: 'How does this relate to emptiness?',
        answer: 'Just as quantum properties are context-dependent, phenomena lack inherent essence and arise dependently.'
      }
    ]
  },
  
'1.4': {
    id: 'ch1_v4_power',
    quantum_concept: 'vacuum_fluctuations',
    mmk_concept: 'svabhava_shakti',
    title: 'Power and Capacity',
    
    educational_overlay: {
      mmk_insight: 'Power/capacity (śakti) is not an inherent property but arises conditionally',
      quantum_parallel: 'Virtual particles arise spontaneously from vacuum energy',
      bridge: 'Both show "emptiness is not nothingness" — dynamic potentiality'
    },
    
    quiz_questions: [
      {
        type: 'mcq',
        tier: 'beginner',
        question: 'What are vacuum fluctuations?',
        options: [
          'Empty space contains absolutely nothing',
          'Particle-antiparticle pairs briefly appear and disappear',
          'A classical physics concept',
          'Proof of a creator deity'
        ],
        correct_answer: 1,
        explanation: 'Quantum vacuum is not empty but seethes with transient virtual particles.',
        xp_value: 15
      }
    ],
    
    faqs: []
  },
  
  '1.5': {
    id: 'ch1_v5_retrocausality',
    quantum_concept: 'delayed_choice',
    mmk_concept: 'relational_definition',
    title: 'Relational Definition',
    
    educational_overlay: {
      mmk_insight: 'Conditions and conditioned are mutually dependent',
      quantum_parallel: 'Wheeler\'s delayed choice: future affects past interpretation',
      bridge: 'Time and causation are relational, not absolute'
    },
    
    quiz_questions: [],
    faqs: []
  },
  
  '1.6': {
    id: 'ch1_v6_measurement',
    quantum_concept: 'quantum_zeno',
    mmk_concept: 'existence_nonexistence',
    title: 'Existence and Non-existence',
    
    educational_overlay: {
      mmk_insight: 'Entities neither inherently exist nor inherently non-exist',
      quantum_parallel: 'Quantum Zeno effect: observation affects system evolution',
      bridge: 'Observation and observed are interdependent'
    },
    
    quiz_questions: [],
    faqs: []
  },
  
  '1.7': {
    id: 'ch1_v7_tunneling',
    quantum_concept: 'quantum_tunneling',
    mmk_concept: 'productive_cause',
    title: 'Productive Cause',
    
    educational_overlay: {
      mmk_insight: 'Effects arise without inherent productive power in causes',
      quantum_parallel: 'Particles tunnel through barriers without classical energy',
      bridge: 'Effects occur without inherent causal mechanisms'
    },
    
    quiz_questions: [],
    faqs: []
  }
};

/**
 * Get verse configuration
 */
export function getVerseConfig(verseNumber) {
  return CHAPTER_1_VERSES[verseNumber] || null;
}

/**
 * Get all verse IDs
 */
export function getAllVerseIds() {
  return Object.keys(CHAPTER_1_VERSES);
}

export default CHAPTER_1_VERSES;
