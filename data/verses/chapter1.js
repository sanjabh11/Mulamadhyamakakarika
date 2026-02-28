/**
 * Chapter 1: Investigation of Conditions (Pratyaya-parīkṣā)
 * 
 * Complete verse data for all 7 verses including:
 * - Verse metadata (Sanskrit, translation)
 * - Educational content (Madhyamaka, Quantum, Bridge)
 * - Interactions for 3D animation
 * - Quiz questions (tiered: beginner, student, scholar)
 * - FAQs for deeper dive
 * 
 * This structure is the template for all 28 chapters
 */

export const CHAPTER_1 = {
  id: 'chapter1',
  title: 'Investigation of Conditions',
  sanskrit_title: 'Pratyaya-parīkṣā',
  total_verses: 7,
  
  verses: {
    '1': {
      chapter: '1',
      verse: '1',
      title: 'The Tetralemma',
      
      // Text
      sanskrit: 'न स्वतो नापि परतो न द्वाभ्यां नाप्यहेतुतः ।\nउत्पन्ना जातु विद्यन्ते भावाः क्वचन केचन ॥',
      transliteration: 'na svato nāpi parato na dvābhyāṃ nāpy ahetutaḥ |\nutpannā jātu vidyante bhāvāḥ kvacana kecana ||',
      verseText: 'No thing anywhere is ever born from itself, from something else, from both, or without a cause.',
      
      // Educational Content
      madhyamakaConcept: 'Nāgārjuna rejects all four logical possibilities for inherent arising (svabhāva-utpatti). This is the catuskoti or tetralemma—a systematic deconstruction showing that inherent causation is logically impossible.',
      quantumPhysicsParallel: "Bell's Theorem rules out local hidden variable theories, showing that quantum correlations cannot be explained by pre-existing local properties. Similarly, Nāgārjuna rules out inherent causal mechanisms.",
      bridge: 'Both systems reveal that reality is fundamentally relational and non-local. What appears as causation is actually dependent co-arising—phenomena arising together in mutual dependence.',
      analysis: "Bell's inequality violations and the catuskoti both point to the same insight: we cannot explain reality through independently existing causes and effects. Everything arises interdependently.",
      
      // Interactions for 3D animation
      interactions: [
        {
          id: 'try_self',
          button_label: 'From Self',
          sanskrit: 'svataḥ',
          action: 'flash_fail',
          message: 'Self-causation leads to infinite regress. If a thing produces itself, it must exist before it exists.',
          tooltip: 'If things produced themselves, they would need to exist before existing',
          xp_value: 5
        },
        {
          id: 'try_other',
          button_label: 'From Other',
          sanskrit: 'parataḥ',
          action: 'pass_through',
          message: 'Other-causation severs the causal link. If cause and effect are completely different, how can one produce the other?',
          tooltip: 'Complete otherness means no real causal connection',
          xp_value: 5
        },
        {
          id: 'try_both',
          button_label: 'From Both',
          sanskrit: 'dvābhyām',
          action: 'merge_dissolve',
          message: 'Both options inherit both problems. Combining two invalid options does not create a valid one.',
          tooltip: 'The problems of self and other causation compound',
          xp_value: 5
        },
        {
          id: 'try_random',
          button_label: 'Without Cause',
          sanskrit: 'ahetutaḥ',
          action: 'nothing',
          message: 'Causelessness explains nothing. Random arising contradicts observable patterns and regularity.',
          tooltip: 'If things arose randomly, anything could come from anything',
          xp_value: 5
        },
        {
          id: 'realize',
          button_label: 'Dependent Origination',
          sanskrit: 'pratītyasamutpāda',
          action: 'reveal_network',
          message: 'Things arise interdependently, not from inherent causes. This is the Middle Way between eternalism and nihilism.',
          tooltip: 'The middle way: phenomena arise in mutual dependence',
          is_solution: true,
          xp_value: 25
        }
      ],
      
      // Quiz Questions (Tiered)
      quiz_questions: [
        {
          type: 'mcq',
          tier: 'beginner',
          question: 'What does Verse 1.1 argue about how things arise?',
          options: [
            'Things arise from themselves',
            'Things arise from other things',
            'Things do not arise from self, other, both, or causelessly',
            'Things arise randomly without patterns'
          ],
          correct_answer: 2,
          explanation: 'Nāgārjuna refutes all four extreme positions (catuskoti), showing that inherent arising is logically impossible. Things arise dependently, not inherently.',
          xp_value: 15
        },
        {
          type: 'mcq',
          tier: 'student',
          question: "How does Bell's Theorem relate to the catuskoti?",
          options: [
            'It proves quantum mechanics is completely random',
            'It rules out local hidden variable explanations',
            'It confirms particles have definite pre-existing properties',
            'It has no philosophical relevance'
          ],
          correct_answer: 1,
          explanation: "Bell's Theorem eliminates local realist explanations for quantum correlations, paralleling how Nāgārjuna eliminates inherent causation models. Both reveal non-local, relational reality.",
          xp_value: 20
        },
        {
          type: 'mcq',
          tier: 'scholar',
          question: 'What is the deeper significance of the tetralemma in Madhyamaka logic?',
          options: [
            "It's merely a rhetorical device with no logical rigor",
            'It systematically deconstructs conceptual proliferation (prapañca)',
            'It proves nihilism is the correct metaphysical view',
            'It establishes a fifth alternative beyond the four'
          ],
          correct_answer: 1,
          explanation: 'The catuskoti is a methodical tool to dismantle reified concepts (prapañca), pointing to emptiness (śūnyatā) that transcends conceptual extremes without being a fifth position.',
          xp_value: 30
        }
      ],
      
      // FAQs for Deeper Dive
      faqs: [
        {
          tier: 'beginner',
          question: 'Does this mean nothing exists?',
          answer: 'No. Nāgārjuna is refuting inherent, independent existence—not conventional existence. Things exist dependently, like reflections exist dependent on mirrors and light.'
        },
        {
          tier: 'beginner',
          question: 'If nothing has inherent existence, why do things seem so real?',
          answer: 'Conventional reality functions perfectly well without inherent existence. A rainbow exists conventionally even though it has no inherent "rainbow-ness." Emptiness enables appearance, not negates it.'
        },
        {
          tier: 'student',
          question: 'How can we trust causality if inherent causation is refuted?',
          answer: 'Conventional causality works fine for practical purposes. Nāgārjuna targets the metaphysical assumption that causes have inherent causal power. Dependent origination explains regularity without requiring inherent causation.'
        },
        {
          tier: 'student',
          question: "What's the difference between dependent origination and regular causation?",
          answer: 'Regular causation assumes inherently existing causes producing inherently existing effects. Dependent origination sees cause and effect as mutually defining—neither exists independently. The cause is only a "cause" in relation to its effect.'
        },
        {
          tier: 'scholar',
          question: 'Is dependent origination itself empty?',
          answer: 'Yes. Pratītyasamutpāda is not a metaphysical ground but a descriptive framework. It too is empty of inherent existence (śūnyatāśūnyatā). This prevents turning emptiness into another absolute.'
        },
        {
          tier: 'scholar',
          question: 'How does this relate to the two truths doctrine?',
          answer: 'Conventionally, causes produce effects. Ultimately, neither cause nor effect has inherent existence. The two truths are not two realities but two ways of understanding the same phenomena—like seeing both the rope and the "snake" illusion.'
        }
      ]
    },
    
    '2': {
      chapter: '1',
      verse: '2',
      title: 'The Four Conditions',
      sanskrit: 'चत्वारः प्रत्ययाः हेतुः आलम्बनमनन्तरम् ।\nआधिपतेयं च तथा प्रत्ययो नास्ति पञ्चमः ॥',
      transliteration: 'catvāraḥ pratyayāḥ hetuḥ ālambanamanantaram |\nādhipateyaṃ ca tathā pratyayo nāsti pañcamaḥ ||',
      verseText: 'The four conditions are: efficient cause, percept-object, immediate-prior, and dominant. There is no fifth condition.',
      madhyamakaConcept: 'Nāgārjuna examines the Buddhist Abhidharma theory of four conditions (pratyaya) to show that even these cannot produce inherent arising.',
      quantumPhysicsParallel: 'The holographic principle suggests information is distributed non-locally. Similarly, conditions cannot be localized as independent causal factors.',
      bridge: 'Both reject localized, separable causal mechanisms. Conditions function relationally, not as independent causal powers.',
      analysis: 'The four conditions are analyzed to show they lack inherent power—they function only in mutual dependence.',
      interactions: [
        {
          id: 'hover_efficient',
          button_label: 'Efficient Cause',
          sanskrit: 'hetupratyaya',
          action: 'highlight_tether',
          message: 'The primary contributory factor (e.g., seed for sprout)',
          tooltip: 'Dominant contributory factor'
        },
        {
          id: 'hover_percept',
          button_label: 'Percept-Object',
          sanskrit: 'ālambanapratyaya',
          action: 'highlight_tether',
          message: 'The object condition (e.g., form for visual consciousness)',
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
      quiz_questions: [
        {
          type: 'mcq',
          tier: 'beginner',
          question: 'How many conditions does Verse 1.2 analyze?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correct_answer: 2,
          explanation: 'The four pratyayas (conditions) are: efficient (hetu), percept-object (ālambana), immediate-prior (anantara), and dominant (adhipati).',
          xp_value: 10
        },
        {
          type: 'mcq',
          tier: 'student',
          question: 'Why does Nāgārjuna say there is no fifth condition?',
          options: [
            'Because five is an unlucky number',
            'Because these four exhaust all possible causal relations',
            'Because he wants to keep the analysis simple',
            'Because Buddhist scriptures only mention four'
          ],
          correct_answer: 1,
          explanation: 'The four conditions are meant to exhaustively categorize all possible causal relations. By showing none can produce inherent arising, Nāgārjuna refutes inherent causation completely.',
          xp_value: 20
        }
      ],
      faqs: [
        {
          tier: 'beginner',
          question: 'What are the four conditions?',
          answer: 'Efficient cause (hetu) - the main factor; Percept-object (ālambana) - what consciousness perceives; Immediate-prior (anantara) - the preceding moment; Dominant (adhipati) - enabling background conditions.'
        },
        {
          tier: 'student',
          question: 'Why analyze these specific four conditions?',
          answer: 'These were the standard Abhidharma categories for explaining causation. By deconstructing the accepted Buddhist framework, Nāgārjuna shows that even sophisticated causal analysis cannot establish inherent production.'
        }
      ]
    },
    
    '3': {
      chapter: '1',
      verse: '3',
      title: 'Essence and Conditions',
      sanskrit: '',
      transliteration: '',
      verseText: 'The essence of entities is not found in their conditions. If there is no essence, there can be no other-essence.',
      madhyamakaConcept: 'If things had inherent essence (svabhāva), they would not depend on conditions. But everything arises through conditions, so nothing has inherent essence.',
      quantumPhysicsParallel: 'Quantum contextuality shows that properties depend on the measurement context—there are no context-independent inherent properties.',
      bridge: 'No context-independent reality exists. Properties emerge from relational contexts, not from inherent essences.',
      analysis: 'The Kochen-Specker theorem proves quantum contextuality, paralleling how essence is always context-dependent.',
      interactions: [],
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
          explanation: 'Contextuality shows properties emerge from the measurement setup, not from intrinsic particle attributes—paralleling the lack of inherent essence.',
          xp_value: 20
        }
      ],
      faqs: [
        {
          tier: 'student',
          question: 'How does contextuality relate to emptiness?',
          answer: 'Just as quantum properties are context-dependent (no pre-existing values), phenomena lack inherent essence and arise dependently from conditions. Neither has intrinsic, context-independent existence.'
        }
      ]
    },
    
    '4': {
      chapter: '1',
      verse: '4',
      title: 'Power and Capacity',
      sanskrit: '',
      transliteration: '',
      verseText: 'Activity does not have conditions, nor is there activity without conditions. Conditions are not without activity, nor are they possessed of activity.',
      madhyamakaConcept: 'Power/capacity (śakti) is not an inherent property but arises conditionally. Conditions neither possess nor lack inherent productive power.',
      quantumPhysicsParallel: 'Virtual particles arise spontaneously from vacuum energy—the "empty" vacuum seethes with transient activity.',
      bridge: 'Both show "emptiness is not nothingness"—it is dynamic potentiality. Empty of inherent existence, yet full of conditional arising.',
      analysis: 'Vacuum fluctuations demonstrate that apparent emptiness contains dynamic potential, like śūnyatā is not mere absence.',
      interactions: [],
      quiz_questions: [
        {
          type: 'mcq',
          tier: 'beginner',
          question: 'What are vacuum fluctuations?',
          options: [
            'Empty space contains absolutely nothing',
            'Particle-antiparticle pairs briefly appear and disappear',
            'A classical physics concept about air pressure',
            'Proof that the universe was created'
          ],
          correct_answer: 1,
          explanation: 'The quantum vacuum is not empty but seethes with transient virtual particles—showing that "emptiness" is dynamic, not static nothingness.',
          xp_value: 15
        }
      ],
      faqs: []
    },
    
    '5': {
      chapter: '1',
      verse: '5',
      title: 'Relational Definition',
      sanskrit: '',
      transliteration: '',
      verseText: 'Those things are called conditions which, when present, something arises. As long as something has not arisen, why are they not non-conditions?',
      madhyamakaConcept: 'Conditions and conditioned are mutually dependent—each is defined in terms of the other. Neither has independent existence.',
      quantumPhysicsParallel: "Wheeler's delayed choice experiment shows that future measurements affect how we describe past events—temporal relations are not fixed.",
      bridge: 'Time and causation are relational, not absolute. Past and future, cause and effect, are mutually defining.',
      analysis: 'The delayed choice eraser reveals retrocausal-like effects that challenge linear causation assumptions.',
      interactions: [],
      quiz_questions: [],
      faqs: []
    },
    
    '6': {
      chapter: '1',
      verse: '6',
      title: 'Existence and Non-existence',
      sanskrit: '',
      transliteration: '',
      verseText: 'For neither an existent nor a non-existent thing is a condition appropriate. If non-existent, what is it a condition of? If existent, what need is there of a condition?',
      madhyamakaConcept: 'If effect already exists, it needs no cause. If it does not exist, how can a cause bring it into existence? The very framework of inherent existence/non-existence is problematic.',
      quantumPhysicsParallel: 'The quantum Zeno effect shows that frequent observation can freeze system evolution—observation and observed are interdependent.',
      bridge: 'Observation and observed are interdependent. Neither has fixed, observer-independent status.',
      analysis: 'The Zeno effect demonstrates that existence and non-existence are not absolute but measurement-dependent.',
      interactions: [],
      quiz_questions: [],
      faqs: []
    },
    
    '7': {
      chapter: '1',
      verse: '7',
      title: 'Productive Cause',
      sanskrit: '',
      transliteration: '',
      verseText: 'When a dharma is produced neither as existent, non-existent, nor both existent and non-existent, how can there be an efficacious cause?',
      madhyamakaConcept: 'Effects arise without inherent productive power in causes. The effect is neither pre-existent, non-existent, nor both—yet arising happens.',
      quantumPhysicsParallel: 'Quantum tunneling allows particles to pass through barriers without the classical energy required—effects occur without standard causal mechanisms.',
      bridge: 'Effects occur without inherent causal mechanisms. Tunneling shows that classical cause-effect requirements can be transcended.',
      analysis: 'Tunneling probability exists without classical causation, paralleling dependent origination without inherent production.',
      interactions: [],
      quiz_questions: [],
      faqs: []
    }
  }
};

/**
 * Get verse data by chapter and verse number
 */
export function getVerseData(chapter, verse) {
  if (chapter === '1' || chapter === 1) {
    return CHAPTER_1.verses[String(verse)] || null;
  }
  return null;
}

/**
 * Get all verses for a chapter
 */
export function getChapterVerses(chapter) {
  if (chapter === '1' || chapter === 1) {
    return CHAPTER_1.verses;
  }
  return null;
}

/**
 * Get chapter metadata
 */
export function getChapterMeta(chapter) {
  if (chapter === '1' || chapter === 1) {
    const { verses, ...meta } = CHAPTER_1;
    return meta;
  }
  return null;
}

export default CHAPTER_1;
