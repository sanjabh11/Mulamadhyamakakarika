const fs = require('fs');
const path = require('path');

// Chapter data
const chapters = [
  {
    number: 3,
    title: "Examination of the Senses",
    verseCount: 9,
    summary: "This chapter examines the nature of sensory faculties and their objects, demonstrating that neither can be established as inherently existent. Nāgārjuna shows that the senses, their objects, and the act of sensing are all empty of inherent existence and can only be understood in terms of their interdependence.",
    quantumSummary: "The quantum parallels include the observer effect, measurement problem, and quantum contextuality. Just as Nāgārjuna shows that senses and their objects cannot be established independently, quantum mechanics reveals that the act of observation affects what is observed, and measurement outcomes depend on the context of measurement.",
    parts: 1
  },
  {
    number: 4,
    title: "Examination of Aggregates",
    verseCount: 9,
    summary: "This chapter analyzes the five aggregates (form, feeling, perception, mental formations, and consciousness) that constitute the conventional self. Nāgārjuna demonstrates that these aggregates lack inherent existence and cannot be established as either identical to or different from each other or the self.",
    quantumSummary: "The quantum parallels include quantum superposition, entanglement, and the holistic nature of quantum systems. Just as the aggregates cannot be reduced to independent components, quantum systems exhibit holistic properties that cannot be reduced to the properties of their individual parts.",
    parts: 1
  },
  {
    number: 5,
    title: "Examination of Elements",
    verseCount: 8,
    summary: "This chapter examines the elements (dhātus) that constitute physical reality, showing that they lack inherent existence. Nāgārjuna demonstrates that elements cannot be established as either identical to or different from their characteristics, revealing the emptiness of both elements and characteristics.",
    quantumSummary: "The quantum parallels include the wave-particle duality, quantum field theory, and the emergence of particles from quantum fields. Just as elements cannot be established as inherently existent, quantum physics reveals that particles emerge from quantum fields and exhibit both wave-like and particle-like properties depending on how they are observed.",
    parts: 1
  },
  {
    number: 6,
    title: "Examination of Desire and the Desirous One",
    verseCount: 10,
    summary: "This chapter examines the relationship between desire and the one who desires, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that desire and the desirous one are neither identical nor different, revealing their emptiness and interdependence.",
    quantumSummary: "The quantum parallels include quantum entanglement, complementarity, and the observer effect. Just as desire and the desirous one cannot be separated, quantum entangled particles cannot be described independently of each other, and the act of observation affects what is observed.",
    parts: 1
  },
  {
    number: 8,
    title: "Examination of Action and Agent",
    verseCount: 13,
    summary: "This chapter examines the relationship between action and agent, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that action and agent are neither identical nor different, revealing their emptiness and interdependence.",
    quantumSummary: "The quantum parallels include quantum entanglement, complementarity, and the observer effect. Just as action and agent cannot be separated, quantum entangled particles cannot be described independently of each other, and the act of observation affects what is observed.",
    parts: 1
  },
  {
    number: 9,
    title: "Examination of the Prior Entity",
    verseCount: 12,
    summary: "This chapter examines the concept of a prior entity or substrate that supposedly exists before its manifestation. Nāgārjuna demonstrates that such a prior entity cannot be established as inherently existent, as it would have to exist either before or simultaneously with its manifestation, both of which lead to contradictions.",
    quantumSummary: "The quantum parallels include quantum superposition, wave function collapse, and the delayed-choice experiment. Just as a prior entity cannot be established as inherently existent, quantum systems exist in superposition states until measured, and the delayed-choice experiment shows that the past behavior of a particle is not determined until a future measurement is made.",
    parts: 1
  },
  {
    number: 11,
    title: "Examination of the Beginning and End",
    verseCount: 8,
    summary: "This chapter examines the concepts of beginning and end, or birth and death, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that birth and death, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum fluctuations, virtual particles, and the uncertainty principle. Just as birth and death cannot be pinpointed as absolute beginnings or endings, quantum fluctuations show that particles can spontaneously appear and disappear, and the uncertainty principle limits our ability to precisely determine when and where these events occur.",
    parts: 1
  },
  {
    number: 12,
    title: "Examination of Suffering",
    verseCount: 10,
    summary: "This chapter examines the nature of suffering, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that suffering, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum indeterminism, complementarity, and the observer effect. Just as suffering cannot be established as inherently existent, quantum systems exhibit indeterministic behavior, and the act of observation affects what is observed.",
    parts: 1
  },
  {
    number: 13,
    title: "Examination of Compounded Phenomena",
    verseCount: 8,
    summary: "This chapter examines the nature of compounded phenomena, showing that they cannot be established as inherently existent. Nāgārjuna demonstrates that compounded phenomena, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum entanglement, quantum coherence, and quantum decoherence. Just as compounded phenomena cannot be reduced to independent components, quantum entangled systems exhibit holistic properties that cannot be reduced to the properties of their individual parts.",
    parts: 1
  },
  {
    number: 14,
    title: "Examination of Connection",
    verseCount: 8,
    summary: "This chapter examines the nature of connection or contact between entities, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that connection, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum entanglement, non-locality, and quantum field theory. Just as connection cannot be established as inherently existent, quantum entanglement shows that particles can be connected in ways that transcend classical notions of locality and separability.",
    parts: 1
  },
  {
    number: 15,
    title: "Examination of Essence",
    verseCount: 11,
    summary: "This chapter examines the concept of essence or inherent nature, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that essence, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum superposition, complementarity, and the measurement problem. Just as essence cannot be established as inherently existent, quantum systems exist in superposition states that defy classical notions of fixed, inherent properties.",
    parts: 1
  },
  {
    number: 16,
    title: "Examination of Bondage and Liberation",
    verseCount: 10,
    summary: "This chapter examines the concepts of bondage and liberation, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that bondage and liberation, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum entanglement, decoherence, and the observer effect. Just as bondage and liberation cannot be established as inherently existent, quantum systems exhibit entanglement that can be seen as a form of bondage, and decoherence that can be seen as a form of liberation from quantum effects.",
    parts: 1
  },
  {
    number: 17,
    title: "Examination of Action and Fruit",
    verseCount: 33,
    summary: "This chapter examines the relationship between actions and their fruits or consequences, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that actions and their fruits, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum causality, delayed-choice experiments, and quantum non-locality. Just as actions and their fruits cannot be established as inherently existent, quantum causality challenges classical notions of cause and effect, and delayed-choice experiments show that the past behavior of a particle is not determined until a future measurement is made.",
    parts: 3
  },
  {
    number: 18,
    title: "Examination of Self and Phenomena",
    verseCount: 12,
    summary: "This chapter examines the nature of self and phenomena, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that self and phenomena, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum non-locality, the measurement problem, and quantum contextuality. Just as self and phenomena cannot be established as inherently existent, quantum systems exhibit non-local correlations that challenge classical notions of separate, independent entities.",
    parts: 1
  },
  {
    number: 19,
    title: "Examination of Time",
    verseCount: 6,
    summary: "This chapter examines the nature of time, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that time, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum non-locality, delayed-choice experiments, and relativistic time dilation. Just as time cannot be established as inherently existent, quantum non-locality and delayed-choice experiments challenge classical notions of temporal sequence, and relativistic time dilation shows that time is not absolute but depends on the observer's reference frame.",
    parts: 1
  },
  {
    number: 20,
    title: "Examination of Combination",
    verseCount: 24,
    summary: "This chapter examines the concept of combination or assembly of causes and conditions, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that combination, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum entanglement, quantum coherence, and quantum decoherence. Just as combination cannot be established as inherently existent, quantum entangled systems exhibit holistic properties that cannot be reduced to the properties of their individual parts.",
    parts: 2
  },
  {
    number: 21,
    title: "Examination of Arising and Dissolution",
    verseCount: 21,
    summary: "This chapter examines the concepts of arising and dissolution, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that arising and dissolution, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum fluctuations, virtual particles, and quantum tunneling. Just as arising and dissolution cannot be established as inherently existent, quantum fluctuations show that particles can spontaneously appear and disappear, and quantum tunneling allows particles to pass through energy barriers that would be insurmountable in classical physics.",
    parts: 2
  },
  {
    number: 22,
    title: "Examination of the Tathagata",
    verseCount: 16,
    summary: "This chapter examines the nature of the Tathagata (Buddha), showing that the Buddha cannot be established as inherently existent. Nāgārjuna demonstrates that the Buddha, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum superposition, complementarity, and the measurement problem. Just as the Buddha cannot be established as inherently existent, quantum systems exist in superposition states that defy classical notions of fixed, inherent properties.",
    parts: 1
  },
  {
    number: 23,
    title: "Examination of Error",
    verseCount: 24,
    summary: "This chapter examines the nature of error or confusion, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that error, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum uncertainty, the observer effect, and quantum contextuality. Just as error cannot be established as inherently existent, quantum uncertainty limits our ability to precisely determine certain properties of quantum systems, and the observer effect shows that the act of observation affects what is observed.",
    parts: 2
  },
  {
    number: 24,
    title: "Examination of the Four Noble Truths",
    verseCount: 40,
    summary: "This chapter examines the Four Noble Truths of Buddhism, showing that they cannot be established as inherently existent. Nāgārjuna demonstrates that the Four Noble Truths, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum complementarity, the measurement problem, and quantum contextuality. Just as the Four Noble Truths cannot be established as inherently existent, quantum systems exhibit complementary properties that cannot be simultaneously observed with precision, and measurement outcomes depend on the context of measurement.",
    parts: 3
  },
  {
    number: 25,
    title: "Examination of Nirvana",
    verseCount: 24,
    summary: "This chapter examines the nature of nirvana, showing that it cannot be established as inherently existent. Nāgārjuna demonstrates that nirvana, like all phenomena, is empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum vacuum, zero-point energy, and quantum coherence. Just as nirvana cannot be established as inherently existent, the quantum vacuum is not absolute nothingness but a state of potentiality from which particles can emerge, and quantum coherence represents a state of perfect order that transcends classical notions of existence and non-existence.",
    parts: 2
  },
  {
    number: 26,
    title: "Examination of the Twelve Links",
    verseCount: 12,
    summary: "This chapter examines the twelve links of dependent origination, showing that they cannot be established as inherently existent. Nāgārjuna demonstrates that the twelve links, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum causality, quantum entanglement, and quantum non-locality. Just as the twelve links cannot be established as inherently existent, quantum causality challenges classical notions of cause and effect, and quantum entanglement shows that particles can be connected in ways that transcend classical notions of locality and separability.",
    parts: 1
  },
  {
    number: 27,
    title: "Examination of Views",
    verseCount: 30,
    summary: "This chapter examines various philosophical views, showing that they cannot be established as inherently existent. Nāgārjuna demonstrates that all views, like all phenomena, are empty of inherent existence and can only be understood in terms of dependent origination.",
    quantumSummary: "The quantum parallels include quantum complementarity, the measurement problem, and quantum contextuality. Just as philosophical views cannot be established as inherently existent, quantum systems exhibit complementary properties that cannot be simultaneously observed with precision, and measurement outcomes depend on the context of measurement.",
    parts: 3
  }
];

// Template for chapter overview pages
const templateHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chapter {{NUMBER}}: {{TITLE}} - Madhyamaka & Quantum Physics</title>
    <style>
        /* Base styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0f172a;
            color: #e2e8f0;
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #8B5CF6;
            margin-bottom: 0.5rem;
        }

        .verse-count {
            font-size: 1.2rem;
            color: #94a3b8;
            font-weight: 500;
        }

        .summary {
            background-color: #1e293b;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            margin-bottom: 2rem;
        }

        .summary h2 {
            color: #e2e8f0;
            font-size: 1.8rem;
            margin-top: 0;
            margin-bottom: 1rem;
        }

        .summary p {
            color: #cbd5e1;
            font-size: 1.1rem;
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }

        .chapter-action {
            display: flex;
            justify-content: center;
            margin: 2rem 0 1rem;
        }

        .chapter-actions {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
            margin: 2rem 0 1rem;
        }

        .visualize-button {
            display: inline-block;
            padding: 0.85rem 1.75rem;
            background: linear-gradient(135deg, #8B5CF6, #6D28D9);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .visualize-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(109, 40, 217, 0.4);
        }

        .navigation {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
        }

        .nav-link {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #334155;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.2s;
        }

        .nav-link:hover {
            background-color: #475569;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .title {
                font-size: 2rem;
            }

            .summary {
                padding: 1.5rem;
            }

            .chapter-actions {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">Chapter {{NUMBER}}: {{TITLE}}</h1>
            <p class="verse-count">{{VERSE_COUNT}} verses</p>
        </header>

        <section class="summary">
            <h2>Chapter Overview</h2>
            <p>{{CHAPTER_SUMMARY}}</p>

            <h2>Quantum Connections</h2>
            <p>{{QUANTUM_SUMMARY}}</p>

            <div class="{{BUTTON_CONTAINER_CLASS}}">
                {{ANIMATION_BUTTONS}}
            </div>
        </section>

        <div class="navigation">
            <a href="/" class="nav-link">← Back to Home</a>
        </div>
    </div>
</body>
</html>`;

// Generate chapter overview pages
chapters.forEach(chapter => {
  // Skip chapters 1, 2, 7, and 10 as they've already been created
  if ([1, 2, 7, 10].includes(chapter.number)) {
    return;
  }

  let buttonContainerClass = 'chapter-action';
  let animationButtons = '';

  if (chapter.parts === 1) {
    animationButtons = `<a href="/Ch${chapter.number}/index.html" class="visualize-button">
                    View Interactive Animations
                </a>`;
  } else {
    animationButtons = `<a href="/Ch${chapter.number}%20(1:${chapter.parts})/index.html" class="visualize-button">
                    View Interactive Animations
                </a>`;
  }

  let html = templateHTML
    .replace(/{{NUMBER}}/g, chapter.number)
    .replace(/{{TITLE}}/g, chapter.title)
    .replace(/{{VERSE_COUNT}}/g, chapter.verseCount)
    .replace(/{{CHAPTER_SUMMARY}}/g, chapter.summary)
    .replace(/{{QUANTUM_SUMMARY}}/g, chapter.quantumSummary)
    .replace(/{{BUTTON_CONTAINER_CLASS}}/g, buttonContainerClass)
    .replace(/{{ANIMATION_BUTTONS}}/g, animationButtons);

  fs.writeFileSync(path.join('public', `chapter-${chapter.number}.html`), html);
  console.log(`Generated chapter-${chapter.number}.html`);
});

console.log('All chapter overview pages generated successfully!');
