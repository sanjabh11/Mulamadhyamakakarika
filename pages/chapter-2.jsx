import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter2() {
  // Chapter information
  const chapterInfo = {
    number: 2,
    title: "Examination of Motion",
    verseCount: 25,
    summary: "This chapter explores the nature of motion, challenging conventional understandings of movement, time, and space. Nāgārjuna examines the paradoxes that arise when we try to locate motion in the moved, not-yet-moved, or currently-moving, revealing that motion lacks inherent existence.",
    quantumSummary: "The quantum parallels in this chapter include wave-particle duality, quantum indeterminacy, superposition, and time symmetry, showcasing how quantum physics similarly challenges classical notions of movement and position."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Fundamental Emptiness",
      summary: "The nature of all things is empty, like magical illusions or dreams",
      quantum: "Quantum Superposition shows entities exist in multiple states simultaneously"
    },
    {
      number: 2,
      title: "Subject-Object Emptiness",
      summary: "Neither perceiver nor perceived has inherent existence",
      quantum: "Observer Effect demonstrates the inseparability of observer and observed"
    },
    {
      number: 3,
      title: "Dependent Origination",
      summary: "Things appear yet lack inherent nature, like waves on water",
      quantum: "Wave Function Evolution shows the dynamic nature of quantum states"
    },
    {
      number: 4,
      title: "Form and Emptiness",
      summary: "Form is empty, and emptiness is form; neither exists without the other",
      quantum: "Wave-Particle Duality illustrates the complementary nature of quantum entities"
    },
    {
      number: 5,
      title: "Universal Emptiness",
      summary: "When one thing is examined, all things are understood",
      quantum: "Quantum Entanglement demonstrates the interconnected nature of reality"
    },
    {
      number: 6,
      title: "Wisdom of Emptiness",
      summary: "The wise see that things lack inherent existence yet appear through dependent origination",
      quantum: "Quantum Contextuality shows properties emerge only in specific contexts"
    },
    {
      number: 7,
      title: "Illusory Nature of Phenomena",
      summary: "Like reflections of the moon in water, phenomena appear yet cannot be grasped",
      quantum: "Wave Function Collapse reveals the elusive nature of quantum reality"
    },
    {
      number: 8,
      title: "Clear Light Nature of Mind",
      summary: "The nature of mind is clear light, temporarily obscured by conceptual thinking",
      quantum: "Quantum Superposition shows the transcendent nature of quantum states"
    },
    {
      number: 9,
      title: "Two Truths Doctrine",
      summary: "Things appear one way to the confused, another to the wise",
      quantum: "Complementarity reveals different perspectives on the same quantum reality"
    },
    {
      number: 10,
      title: "Inexpressible Ultimate Truth",
      summary: "The ultimate nature cannot be described, yet appears in conventional reality",
      quantum: "Quantum Indeterminacy shows the fundamental nature of reality defies classical description"
    },
    {
      number: 11,
      title: "Interpenetration of Phenomena",
      summary: "Each phenomenon reflects all phenomena, like jewels in Indra's net",
      quantum: "Quantum Entanglement demonstrates universal interconnection"
    },
    {
      number: 12,
      title: "Emptiness of Time",
      summary: "The past has ceased, the future has not arisen, and the present does not remain",
      quantum: "Time Symmetry in quantum mechanics reveals the fluid nature of time"
    },
    {
      number: 13,
      title: "Magical Illusion-like Nature",
      summary: "Like a magician's illusions, things appear yet lack inherent existence",
      quantum: "Wave Function Collapse shows reality manifests only upon observation"
    },
    {
      number: 14,
      title: "Transcendence of Views",
      summary: "The wise neither accept nor reject, seeing the empty nature of all views",
      quantum: "Quantum Superposition demonstrates that truth transcends ordinary frameworks"
    },
    {
      number: 15,
      title: "Emptiness of Emptiness",
      summary: "In the ultimate analysis, not even emptiness exists inherently",
      quantum: "Quantum Recursion indicates even our understanding of quantum mechanics is empty"
    },
    {
      number: 16,
      title: "Unity in Diversity",
      summary: "The same nature pervades all things, yet each appears distinctly",
      quantum: "Quantum Identity shows identical particles share nature yet manifest individually"
    },
    {
      number: 17,
      title: "Transcendence of Numbers",
      summary: "Neither one nor many, phenomena transcend ordinary concepts",
      quantum: "Wave-Particle Duality shows quantum entities transcend classical categories"
    },
    {
      number: 18,
      title: "Relationship of Two Truths",
      summary: "The ultimate truth is realized through the conventional, like pointing to the moon",
      quantum: "Complementarity demonstrates how classical and quantum descriptions complement each other"
    },
    {
      number: 19,
      title: "Limitations of Conceptual Understanding",
      summary: "All explanations are like dreams explaining other dreams",
      quantum: "Quantum Indeterminacy reflects the limits of classical explanation"
    },
    {
      number: 20,
      title: "Interpenetration of Actions",
      summary: "Every action contains all actions, every moment contains all moments",
      quantum: "Quantum Entanglement reveals the fundamental interconnection of actions"
    },
    {
      number: 21,
      title: "Buddha Nature",
      summary: "The nature of mind is naturally pure, temporarily obscured by confusion",
      quantum: "Quantum Superposition shows the pure state beneath apparent complexity"
    },
    {
      number: 22,
      title: "Empty Causality",
      summary: "When examined, causes and conditions are found to be empty, yet function perfectly",
      quantum: "Quantum Contextuality demonstrates causality emerges from contextual relationships"
    },
    {
      number: 23,
      title: "Middle Way",
      summary: "The ultimate nature is neither existence nor non-existence, neither permanent nor nihilistic",
      quantum: "Wave-Particle Duality shows reality transcends binary oppositions"
    },
    {
      number: 24,
      title: "Self-knowing Awareness",
      summary: "Like meeting oneself in a dream, all phenomena are self-knowing yet empty",
      quantum: "Quantum Recursion demonstrates consciousness and phenomena arise together"
    },
    {
      number: 25,
      title: "Unity of Wisdom and Compassion",
      summary: "Understanding emptiness, compassion naturally arises, like sun's rays spreading warmth",
      quantum: "Quantum Entanglement shows understanding interconnectedness leads to universal compassion"
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 2: Examination of Motion - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 2 of Mūlamadhyamakakārikā examining motion through Madhyamaka and quantum physics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Chapter {chapterInfo.number}: {chapterInfo.title}</h1>
          <p className={styles.verseCount}>{chapterInfo.verseCount} verses</p>
        </header>

        <section className={styles.summary}>
          <div className={styles.summaryContent}>
            <h2>Chapter Overview</h2>
            <p>{chapterInfo.summary}</p>
            
            <h2>Quantum Connections</h2>
            <p>{chapterInfo.quantumSummary}</p>
            
            <div className={styles.chapterAction}>
              <a href="/Ch2/index.html" className={styles.visualizeButton}>
                View Interactive Animations
              </a>
            </div>
          </div>
        </section>

        <section className={styles.verseList}>
          <h2>Chapter Verses</h2>
          
          <div className={styles.verses}>
            {verses.map(verse => (
              <Link 
                href={`/Ch2/index.html#verse-${verse.number}`}
                key={verse.number}
                className={styles.verseCard}
              >
                <div className={styles.verseNumber}>
                  {chapterInfo.number}.{verse.number}
                </div>
                <div className={styles.verseContent}>
                  <h3>{verse.title}</h3>
                  <div className={styles.verseSummaries}>
                    <p><strong>Madhyamaka:</strong> {verse.summary}</p>
                    <p><strong>Quantum:</strong> {verse.quantum}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        <div className={styles.navigation}>
          <Link href="/" className={styles.navLink}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
} 