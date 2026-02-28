/**
 * Quiz Questions for All 27 MMK Chapters
 * 
 * Each chapter has 3-5 questions testing understanding of:
 * - Madhyamaka philosophy concepts
 * - Quantum physics parallels
 * - Practical applications
 */

export const CHAPTER_QUIZZES = {
  1: {
    title: "Investigation of Conditions",
    questions: [
      {
        id: 1,
        question: "According to Nāgārjuna, what is the relationship between cause and effect?",
        options: [
          "Causes inherently produce effects",
          "Effects exist independently of causes",
          "Neither cause nor effect has inherent existence",
          "Causes and effects are identical"
        ],
        correct: 2,
        explanation: "Nāgārjuna argues that both causes and effects lack inherent existence - they arise dependently."
      },
      {
        id: 2,
        question: "What quantum concept parallels dependent origination?",
        options: ["Quantum tunneling", "Quantum entanglement", "Radioactive decay", "Nuclear fusion"],
        correct: 1,
        explanation: "Quantum entanglement shows particles are interconnected, mirroring how phenomena arise dependently."
      },
      {
        id: 3,
        question: "The tetralemma (catuṣkoṭi) rejects which positions?",
        options: ["Only existence", "Only non-existence", "Both existence and non-existence, and neither", "Only the middle way"],
        correct: 2,
        explanation: "The tetralemma systematically negates all four positions: is, is not, both, neither."
      },
      {
        id: 4,
        question: "What does 'śūnyatā' (emptiness) mean in Madhyamaka philosophy?",
        options: ["Absolute nothingness", "Lack of inherent existence", "Physical vacuum", "Spiritual void"],
        correct: 1,
        explanation: "Śūnyatā means emptiness of inherent existence, not nihilistic nothingness."
      },
      {
        id: 5,
        question: "How does quantum superposition relate to Madhyamaka?",
        options: [
          "It proves Buddhism is scientific",
          "It shows particles exist in definite states",
          "It illustrates the middle way between existence and non-existence",
          "It has no philosophical relevance"
        ],
        correct: 2,
        explanation: "Superposition shows quantum states exist in multiple possibilities, echoing the middle way."
      }
    ]
  },
  2: {
    title: "Examination of Motion",
    questions: [
      {
        id: 1,
        question: "Why does Nāgārjuna argue motion cannot be found in the 'moved', 'not-moved', or 'moving'?",
        options: [
          "Because motion is an illusion",
          "Because motion lacks inherent existence in any fixed location",
          "Because only the present moment exists",
          "Because physics hadn't been discovered yet"
        ],
        correct: 1,
        explanation: "Motion, like all phenomena, lacks inherent existence - it cannot be pinned down."
      },
      {
        id: 2,
        question: "What quantum phenomenon challenges classical notions of motion?",
        options: ["Quantum tunneling", "Wave function collapse", "Both A and B", "Neither A nor B"],
        correct: 2,
        explanation: "Both tunneling and wave collapse challenge classical motion - particles don't follow fixed paths."
      },
      {
        id: 3,
        question: "The mover and motion are:",
        options: ["Identical", "Completely different", "Neither identical nor different", "Both identical and different"],
        correct: 2,
        explanation: "Nāgārjuna shows the mover and motion are neither identical nor different - they're interdependent."
      }
    ]
  },
  3: {
    title: "Examination of Perception",
    questions: [
      {
        id: 1,
        question: "What is the relationship between perceiver and perceived?",
        options: ["The perceiver exists independently", "The perceived exists independently", "Both are interdependent", "Neither exists"],
        correct: 2,
        explanation: "Perceiver and perceived arise together - neither has independent existence."
      },
      {
        id: 2,
        question: "How does the observer effect in quantum mechanics relate to this?",
        options: [
          "Observation has no effect on reality",
          "The act of observation affects what is observed",
          "Only conscious observers matter",
          "Quantum mechanics is unrelated"
        ],
        correct: 1,
        explanation: "The observer effect shows measurement affects outcomes, paralleling perceiver-perceived interdependence."
      },
      {
        id: 3,
        question: "Vision requires:",
        options: ["Only eyes", "Only light", "Only objects", "The interdependence of all factors"],
        correct: 3,
        explanation: "Vision arises from the interdependence of eyes, light, objects, and consciousness."
      }
    ]
  },
  4: {
    title: "Examination of Aggregates",
    questions: [
      {
        id: 1,
        question: "The five aggregates (skandhas) are:",
        options: [
          "Earth, water, fire, air, space",
          "Form, feeling, perception, formations, consciousness",
          "Body, speech, mind, wisdom, action",
          "Birth, aging, sickness, death, rebirth"
        ],
        correct: 1,
        explanation: "The five skandhas are form, feeling, perception, mental formations, and consciousness."
      },
      {
        id: 2,
        question: "Why are the aggregates empty?",
        options: [
          "They don't exist at all",
          "They exist only in meditation",
          "They lack inherent, independent existence",
          "They are purely mental constructs"
        ],
        correct: 2,
        explanation: "The aggregates are empty because they arise dependently and lack inherent existence."
      },
      {
        id: 3,
        question: "What quantum parallel applies to the aggregates?",
        options: [
          "Particles are fundamental building blocks",
          "Particles are also composite and lack inherent identity",
          "Only waves exist",
          "Matter is solid"
        ],
        correct: 1,
        explanation: "Like aggregates, particles are not fundamental - they're excitations of fields."
      }
    ]
  },
  5: {
    title: "Examination of Elements",
    questions: [
      {
        id: 1,
        question: "How does Nāgārjuna analyze the element of space?",
        options: [
          "Space is an absolute container",
          "Space exists independently",
          "Space is characterized, thus not inherently existent",
          "Space doesn't exist"
        ],
        correct: 2,
        explanation: "Space is known through its characteristics, making it dependently originated."
      },
      {
        id: 2,
        question: "What does quantum field theory say about 'empty' space?",
        options: [
          "Space is truly empty",
          "Space is filled with quantum fluctuations",
          "Space doesn't exist",
          "Space is fixed and unchanging"
        ],
        correct: 1,
        explanation: "Even 'empty' space teems with virtual particles and quantum fluctuations."
      }
    ]
  },
  6: {
    title: "Examination of Desire and the Desirous",
    questions: [
      {
        id: 1,
        question: "Can desire exist before the one who desires?",
        options: ["Yes, desire is primary", "No, they arise together", "Desire never exists", "Only the desirous exists"],
        correct: 1,
        explanation: "Desire and the desirous are mutually dependent - neither precedes the other."
      },
      {
        id: 2,
        question: "What quantum concept reflects this interdependence?",
        options: ["Superposition", "Entanglement", "Decoherence", "Tunneling"],
        correct: 1,
        explanation: "Entanglement shows properties exist only in relation, like desire and the desirous."
      }
    ]
  },
  7: {
    title: "Examination of Arising, Abiding, and Ceasing",
    questions: [
      {
        id: 1,
        question: "Can arising, abiding, and ceasing occur simultaneously?",
        options: ["Yes, in every moment", "No, they are sequential", "They are neither simultaneous nor sequential", "Only arising is real"],
        correct: 2,
        explanation: "Nāgārjuna shows these cannot be fixed as either simultaneous or sequential."
      },
      {
        id: 2,
        question: "How does this relate to quantum measurement?",
        options: [
          "Measurement is instantaneous",
          "Measurement creates definite states from indefinite ones",
          "Measurement has no effect",
          "Only classical physics applies"
        ],
        correct: 1,
        explanation: "Measurement 'collapses' superposition, paralleling the unfindability of arising/ceasing."
      },
      {
        id: 3,
        question: "Conditioned phenomena are characterized by:",
        options: [
          "Permanence",
          "Arising, abiding, and ceasing",
          "Only arising",
          "Inherent existence"
        ],
        correct: 1,
        explanation: "All conditioned phenomena exhibit arising, abiding, and ceasing - the three marks."
      }
    ]
  },
  8: {
    title: "Examination of Agent and Action",
    questions: [
      {
        id: 1,
        question: "The agent and action are:",
        options: ["Identical", "Different", "Neither identical nor different", "Both are illusions"],
        correct: 2,
        explanation: "Agent and action are interdependent - neither identical nor different."
      },
      {
        id: 2,
        question: "How does this apply to quantum events?",
        options: [
          "Particles cause effects",
          "Events have clear causes",
          "Actor and action in quantum events are inseparable",
          "Only observers matter"
        ],
        correct: 2,
        explanation: "In quantum mechanics, the acting particle and its action cannot be cleanly separated."
      }
    ]
  },
  9: {
    title: "Examination of the Prior Entity",
    questions: [
      {
        id: 1,
        question: "Can the self exist before seeing, hearing, etc.?",
        options: ["Yes, the self is primary", "No, self and faculties are interdependent", "The self never exists", "Only faculties exist"],
        correct: 1,
        explanation: "The self cannot be established prior to its faculties - they arise together."
      },
      {
        id: 2,
        question: "What does 'prior entity' examination reveal?",
        options: [
          "Things have beginnings",
          "Nothing has an inherent prior existence",
          "Only God is prior",
          "Time flows forward"
        ],
        correct: 1,
        explanation: "No entity can be found to exist inherently prior to its characteristics."
      }
    ]
  },
  10: {
    title: "Examination of Fire and Fuel",
    questions: [
      {
        id: 1,
        question: "Fire and fuel are used to illustrate:",
        options: [
          "How to start a campfire",
          "The interdependence of self and aggregates",
          "The nature of heat",
          "Chemical reactions"
        ],
        correct: 1,
        explanation: "Fire and fuel illustrate how self and aggregates are neither identical nor different."
      },
      {
        id: 2,
        question: "Can fire exist without fuel?",
        options: ["Yes", "No", "Sometimes", "Only in a vacuum"],
        correct: 1,
        explanation: "Fire depends on fuel - they are mutually dependent, neither existing independently."
      },
      {
        id: 3,
        question: "What quantum parallel applies here?",
        options: [
          "Energy and mass are separate",
          "Energy and mass are interconvertible (E=mc²)",
          "Only matter exists",
          "Only energy exists"
        ],
        correct: 1,
        explanation: "Like fire/fuel, energy and mass are interdependent aspects of the same reality."
      }
    ]
  },
  11: {
    title: "Examination of the Prior and Posterior Limits",
    questions: [
      {
        id: 1,
        question: "Can a beginning of cyclic existence (samsara) be found?",
        options: ["Yes, at the Big Bang", "No, no inherent beginning exists", "Only in Buddhist cosmology", "Yes, at creation"],
        correct: 1,
        explanation: "Nāgārjuna shows no inherent beginning or end to cyclic existence can be found."
      },
      {
        id: 2,
        question: "How does this relate to quantum cosmology?",
        options: [
          "The universe had a definite beginning",
          "Time may not have a clear beginning in quantum cosmology",
          "Only classical cosmology is valid",
          "The universe is infinite"
        ],
        correct: 1,
        explanation: "Quantum cosmology suggests time itself may emerge, with no clear 'before' the Big Bang."
      }
    ]
  },
  12: {
    title: "Examination of Suffering",
    questions: [
      {
        id: 1,
        question: "Suffering is:",
        options: ["Self-caused", "Other-caused", "Both self and other caused", "Neither - it arises dependently"],
        correct: 3,
        explanation: "Suffering, like all phenomena, arises through dependent origination."
      },
      {
        id: 2,
        question: "The emptiness of suffering means:",
        options: [
          "Suffering doesn't exist",
          "We shouldn't care about suffering",
          "Suffering lacks inherent existence, enabling liberation",
          "Only meditation helps"
        ],
        correct: 2,
        explanation: "Because suffering is empty, it can be transformed - it's not fixed or eternal."
      }
    ]
  },
  13: {
    title: "Examination of Compounded Phenomena",
    questions: [
      {
        id: 1,
        question: "What does 'saṃskāra' (compounded phenomena) refer to?",
        options: [
          "Only mental formations",
          "All conditioned, composite things",
          "Only physical matter",
          "Abstract concepts"
        ],
        correct: 1,
        explanation: "Saṃskāra refers to all conditioned, composite phenomena."
      },
      {
        id: 2,
        question: "Compounded phenomena are characterized by:",
        options: ["Permanence", "Independence", "Deception - appearing real but empty", "Solidity"],
        correct: 2,
        explanation: "Compounded things appear inherently real but are actually empty and dependently arisen."
      },
      {
        id: 3,
        question: "How does this relate to particle physics?",
        options: [
          "Particles are solid building blocks",
          "Particles are composite excitations with no fundamental 'substance'",
          "Only atoms are real",
          "Physics proves matter exists"
        ],
        correct: 1,
        explanation: "Like saṃskāra, particles are not fundamental substances but composite processes."
      }
    ]
  },
  14: {
    title: "Examination of Contact",
    questions: [
      {
        id: 1,
        question: "Contact between sense organ and object is:",
        options: ["Direct physical touching", "An inherently existent event", "A dependently arisen process", "Impossible"],
        correct: 2,
        explanation: "Contact arises dependently from organ, object, and consciousness - not inherently."
      },
      {
        id: 2,
        question: "What quantum phenomenon challenges classical 'contact'?",
        options: [
          "Particles always touch",
          "Particles interact through force fields without 'touching'",
          "Only waves interact",
          "Contact is purely mental"
        ],
        correct: 1,
        explanation: "Quantum interactions occur through field exchanges, not classical contact."
      }
    ]
  },
  15: {
    title: "Examination of Essence",
    questions: [
      {
        id: 1,
        question: "What is 'svabhāva' (essence/inherent nature)?",
        options: [
          "The true self",
          "An unchanging, independent nature that things are claimed to have",
          "DNA",
          "Soul"
        ],
        correct: 1,
        explanation: "Svabhāva is the inherent, independent existence that Madhyamaka refutes."
      },
      {
        id: 2,
        question: "Why is svabhāva impossible?",
        options: [
          "Science disproves it",
          "If things had inherent nature, they couldn't change or interact",
          "Only God has svabhāva",
          "It's just a theory"
        ],
        correct: 1,
        explanation: "Inherent existence would make change and interaction impossible."
      },
      {
        id: 3,
        question: "What quantum concept challenges essence?",
        options: [
          "Particles have fixed properties",
          "Properties exist only upon measurement - no inherent essence",
          "Essence is confirmed by physics",
          "Only large objects have essence"
        ],
        correct: 1,
        explanation: "Quantum mechanics shows properties emerge through measurement, not from inherent essence."
      }
    ]
  },
  16: {
    title: "Examination of Bondage and Liberation",
    questions: [
      {
        id: 1,
        question: "Who or what is bound in samsara?",
        options: [
          "The inherent self",
          "The aggregates",
          "Nothing is inherently bound - bondage is dependently arisen",
          "The soul"
        ],
        correct: 2,
        explanation: "Neither self nor aggregates are inherently bound - bondage lacks inherent existence."
      },
      {
        id: 2,
        question: "Liberation is possible because:",
        options: [
          "We have a soul to be freed",
          "Bondage is empty and thus not permanent",
          "Good karma accumulates",
          "Gods grant it"
        ],
        correct: 1,
        explanation: "Because bondage is empty, it can be transcended - liberation is possible."
      }
    ]
  },
  17: {
    title: "Examination of Action and Fruit",
    questions: [
      {
        id: 1,
        question: "How can karma function if everything is empty?",
        options: [
          "Karma doesn't exist",
          "Emptiness enables karma - conventional causation functions within emptiness",
          "Only good karma is real",
          "Emptiness negates karma"
        ],
        correct: 1,
        explanation: "Emptiness is the very condition for karma to function conventionally."
      },
      {
        id: 2,
        question: "Action and fruit are:",
        options: [
          "Identical",
          "Completely separate",
          "Neither identical nor separate - dependently related",
          "Unrelated"
        ],
        correct: 2,
        explanation: "Action and result are dependently related, neither identical nor wholly separate."
      }
    ]
  },
  18: {
    title: "Examination of Self and Phenomena",
    questions: [
      {
        id: 1,
        question: "The self is:",
        options: [
          "Identical to the aggregates",
          "Different from the aggregates",
          "Neither identical to nor different from the aggregates",
          "Non-existent absolutely"
        ],
        correct: 2,
        explanation: "The self cannot be found as either identical to or different from the aggregates."
      },
      {
        id: 2,
        question: "Cessation of self-grasping leads to:",
        options: ["Nihilism", "Liberation from suffering", "Loss of identity", "Depression"],
        correct: 1,
        explanation: "When self-grasping ceases, suffering ceases - this is liberation."
      },
      {
        id: 3,
        question: "The famous verse 'not from self, not from other...' establishes:",
        options: [
          "That nothing exists",
          "Dependent origination - nothing arises from inherent causes",
          "That self exists",
          "Materialism"
        ],
        correct: 1,
        explanation: "This verse establishes that phenomena arise dependently, not from inherent causes."
      }
    ]
  },
  19: {
    title: "Examination of Time",
    questions: [
      {
        id: 1,
        question: "Can the present exist without past and future?",
        options: ["Yes, only now is real", "No, they are interdependent", "Past is real, future isn't", "Time doesn't exist"],
        correct: 1,
        explanation: "Present, past, and future are mutually dependent - none exists independently."
      },
      {
        id: 2,
        question: "How does relativity relate to this analysis?",
        options: [
          "Time is absolute",
          "Simultaneity is relative - no absolute 'now'",
          "Only proper time matters",
          "Physics proves time exists"
        ],
        correct: 1,
        explanation: "Relativity shows simultaneity is relative, echoing time's dependent nature."
      }
    ]
  },
  20: {
    title: "Examination of Assemblage",
    questions: [
      {
        id: 1,
        question: "When cause, condition, and effect come together:",
        options: [
          "They create inherent existence",
          "Their assemblage is itself dependently arisen",
          "Magic happens",
          "Only the effect is real"
        ],
        correct: 1,
        explanation: "Even the assemblage of causes and conditions is dependently arisen."
      },
      {
        id: 2,
        question: "This relates to quantum field theory because:",
        options: [
          "Fields are fundamental",
          "Particles emerge from field interactions, not from inherent 'assembly'",
          "Assembly is permanent",
          "Only particles exist"
        ],
        correct: 1,
        explanation: "Particles emerge from field dynamics, paralleling dependent assemblage."
      }
    ]
  },
  21: {
    title: "Examination of Arising and Dissolution",
    questions: [
      {
        id: 1,
        question: "Can arising and dissolution occur to the same thing?",
        options: [
          "Yes, sequentially",
          "No, they would cancel out",
          "Neither can be established inherently",
          "Only dissolution is real"
        ],
        correct: 2,
        explanation: "Neither arising nor dissolution can be established as inherently existent."
      },
      {
        id: 2,
        question: "What quantum concept echoes this?",
        options: [
          "Particle creation",
          "Virtual particles arise and dissolve without inherent existence",
          "Conservation laws",
          "Only matter is created"
        ],
        correct: 1,
        explanation: "Virtual particles exemplify arising and dissolution without inherent existence."
      }
    ]
  },
  22: {
    title: "Examination of the Tathāgata",
    questions: [
      {
        id: 1,
        question: "Can the Tathāgata (Buddha) be found in the aggregates?",
        options: [
          "Yes, the Buddha is the aggregates",
          "Yes, the Buddha is separate from aggregates",
          "No, the Tathāgata cannot be pinned down either way",
          "The Buddha doesn't exist"
        ],
        correct: 2,
        explanation: "The Tathāgata transcends being found in or apart from the aggregates."
      },
      {
        id: 2,
        question: "After death, the Tathāgata:",
        options: [
          "Exists",
          "Doesn't exist",
          "Both exists and doesn't",
          "None of these can be asserted"
        ],
        correct: 3,
        explanation: "The Buddha refused to answer this question - it transcends the tetralemma."
      }
    ]
  },
  23: {
    title: "Examination of Errors",
    questions: [
      {
        id: 1,
        question: "Confusion and desire arise from:",
        options: [
          "Inherent evil",
          "Mental construction and false conceptualization",
          "External demons",
          "Bad karma only"
        ],
        correct: 1,
        explanation: "Afflictions arise from mental construction, not inherent existence."
      },
      {
        id: 2,
        question: "Because afflictions are empty:",
        options: [
          "They can never be overcome",
          "They are permanent",
          "They can be purified and transformed",
          "We should ignore them"
        ],
        correct: 2,
        explanation: "The emptiness of afflictions is precisely what allows their transformation."
      }
    ]
  },
  24: {
    title: "Examination of the Four Noble Truths",
    questions: [
      {
        id: 1,
        question: "If everything is empty, how can the Four Noble Truths function?",
        options: [
          "They can't - Buddhism is negated",
          "Emptiness enables their functioning - without it, truths would be fixed and useless",
          "Only some truths are empty",
          "The truths exist inherently"
        ],
        correct: 1,
        explanation: "It's BECAUSE of emptiness that the path works - nothing is fixed."
      },
      {
        id: 2,
        question: "The famous verse states: 'Whatever is dependently arisen is...'",
        options: ["Real", "Empty", "Both empty and dependent origination", "Permanent"],
        correct: 2,
        explanation: "Dependent origination IS emptiness - they are two ways of expressing the same reality."
      },
      {
        id: 3,
        question: "For whom are the Four Noble Truths impossible?",
        options: [
          "Those who accept emptiness",
          "Those who reject emptiness and cling to inherent existence",
          "Everyone",
          "No one"
        ],
        correct: 1,
        explanation: "Without emptiness, the truths would be fixed and the path impossible."
      }
    ]
  },
  25: {
    title: "Examination of Nirvāṇa",
    questions: [
      {
        id: 1,
        question: "Nirvāṇa is:",
        options: [
          "Complete annihilation",
          "Eternal existence",
          "Beyond both existence and non-existence",
          "A place to go"
        ],
        correct: 2,
        explanation: "Nirvāṇa transcends the four positions of the tetralemma."
      },
      {
        id: 2,
        question: "The relationship between samsara and nirvāṇa:",
        options: [
          "They are completely different realms",
          "There is not the slightest difference between them",
          "Samsara leads to nirvāṇa",
          "Nirvāṇa replaces samsara"
        ],
        correct: 1,
        explanation: "Famously, Nāgārjuna states there is no difference between samsara and nirvāṇa."
      },
      {
        id: 3,
        question: "This echoes quantum mechanics because:",
        options: [
          "Different states are completely separate",
          "Wave and particle are different aspects of the same reality",
          "Only nirvāṇa is quantum",
          "Physics proves nirvāṇa exists"
        ],
        correct: 1,
        explanation: "Like wave/particle duality, samsara/nirvāṇa are aspects of one reality."
      }
    ]
  },
  26: {
    title: "Examination of the Twelve Links",
    questions: [
      {
        id: 1,
        question: "The twelve links of dependent origination describe:",
        options: [
          "How inherent things connect",
          "How cyclic existence perpetuates through interdependence",
          "A linear chain of causation",
          "Only mental phenomena"
        ],
        correct: 1,
        explanation: "The twelve links show how samsara perpetuates through mutual dependence."
      },
      {
        id: 2,
        question: "Breaking the links leads to:",
        options: ["Death", "Liberation from cyclic existence", "More suffering", "Rebirth"],
        correct: 1,
        explanation: "Understanding and breaking the links ends the cycle of suffering."
      }
    ]
  },
  27: {
    title: "Examination of Views",
    questions: [
      {
        id: 1,
        question: "What does Nāgārjuna say about all views?",
        options: [
          "Some views are true",
          "His view is correct",
          "All views are empty - including the view of emptiness",
          "Views don't matter"
        ],
        correct: 2,
        explanation: "Even the view of emptiness must not be clung to as inherently true."
      },
      {
        id: 2,
        question: "Clinging to emptiness as a view is:",
        options: ["Correct", "The ultimate truth", "Called 'incurable' by Nāgārjuna", "Enlightenment"],
        correct: 2,
        explanation: "Nāgārjuna says those who make emptiness into a view are 'incurable.'"
      },
      {
        id: 3,
        question: "The purpose of the MMK is to:",
        options: [
          "Establish a new philosophical system",
          "Quiet all conceptual elaboration (prapañca)",
          "Prove Buddhism is true",
          "Defeat opponents"
        ],
        correct: 1,
        explanation: "The MMK aims at the cessation of conceptual proliferation, not establishing views."
      },
      {
        id: 4,
        question: "What does it mean that 'the Buddha taught no dharma'?",
        options: [
          "The Buddha was silent",
          "Buddhism is empty",
          "Ultimate truth transcends all conceptual teaching",
          "Nothing matters"
        ],
        correct: 2,
        explanation: "Ultimate truth is beyond concepts - even Buddhist teachings are conventional."
      }
    ]
  }
};

// Helper function to get quiz by chapter
export function getChapterQuiz(chapter) {
  return CHAPTER_QUIZZES[chapter] || null;
}

// Get total questions count
export function getTotalQuestions() {
  return Object.values(CHAPTER_QUIZZES).reduce(
    (sum, chapter) => sum + chapter.questions.length, 
    0
  );
}

// Get chapters with most questions (for difficulty indication)
export function getChapterDifficulty(chapter) {
  const quiz = CHAPTER_QUIZZES[chapter];
  if (!quiz) return 'unknown';
  const count = quiz.questions.length;
  if (count >= 5) return 'comprehensive';
  if (count >= 3) return 'standard';
  return 'brief';
}

export default CHAPTER_QUIZZES;
