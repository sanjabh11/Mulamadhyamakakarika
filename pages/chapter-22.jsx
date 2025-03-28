import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter22() {
  // Chapter information
  const chapterInfo = {
    number: 22,
    title: "Investigation of the Tathāgata",
    verseCount: 16,
    summary: "This chapter examines the nature of the Buddha (Tathāgata), showing that the Buddha cannot be identified with the five aggregates nor as separate from them. Nāgārjuna demonstrates that ultimately, the Buddha's nature is emptiness, and from this perspective, there is no fundamental difference between samsara and nirvana.",
    quantumSummary: "The quantum parallels include quantum superposition, the measurement problem, and observer-dependence, revealing how quantum physics similarly challenges our understanding of definitive identity and ultimate reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "The Tathāgata and Aggregates",
      summary: "The Tathāgata is neither identical to the five aggregates nor different from them. The aggregates are not in him, nor is he in the aggregates. He does not possess the aggregates.",
      quantum: "Quantum Entanglement: In quantum physics, entangled particles cannot be described as separate entities with definite properties, paralleling the Buddha's non-identification with aggregates."
    },
    {
      number: 2,
      title: "Dependence on Aggregates",
      summary: "If the Tathāgata depended on the aggregates, he would not exist by his own nature. What does not exist by its own nature cannot exist through something else.",
      quantum: "Quantum Contextuality: Quantum properties exist only in relation to specific measurement contexts, not as inherent features, paralleling the Buddha's lack of inherent existence."
    },
    {
      number: 3,
      title: "Borrowed Existence",
      summary: "How can something that does not exist by its own nature exist through something else? The Tathāgata cannot be established as having either inherent or dependent existence.",
      quantum: "Quantum Superposition: Before measurement, quantum systems exist in indeterminate states, neither definitely one thing nor another, challenging notions of definite identity."
    },
    {
      number: 4,
      title: "No Self-Nature in Aggregates",
      summary: "The five aggregates themselves have no self-nature. How could the Tathāgata have a self-nature when the basis of designation has none?",
      quantum: "Quantum Vacuum: The quantum vacuum shows that even 'empty' space is full of fluctuating potential, revealing how substantial existence breaks down at the fundamental level."
    },
    {
      number: 5,
      title: "Self-Nature and Emptiness",
      summary: "When something has no self-nature, how can it have other-nature? The Tathāgata is empty of both self-nature and other-nature.",
      quantum: "Quantum Nonlocality: Quantum correlations transcend spatial separation, showing how entities lack independent, localized nature."
    },
    {
      number: 6,
      title: "Emptiness and Designation",
      summary: "That which is empty of self-nature cannot be designated as 'empty' or 'non-empty,' 'both,' or 'neither.' These designations apply only conventionally.",
      quantum: "Quantum Complementarity: Quantum objects require seemingly contradictory descriptions (wave/particle), revealing the limits of fixed conceptual designations."
    },
    {
      number: 7,
      title: "Beyond Conceptual Extremes",
      summary: "The Tathāgata is beyond the four conceptual extremes of existence, non-existence, both, and neither. These views apply only to conventional truth.",
      quantum: "Quantum Logic: Quantum systems require non-classical logic that transcends binary categories, paralleling the Buddha's transcendence of conceptual extremes."
    },
    {
      number: 8,
      title: "Silence of the Buddha",
      summary: "The Buddha remained silent when asked metaphysical questions because ultimate reality transcends conceptual proliferation and verbal designation.",
      quantum: "Quantum Uncertainty: Some quantum properties cannot be simultaneously defined with precision, revealing fundamental limits to complete description."
    },
    {
      number: 9,
      title: "Reality as Peaceful",
      summary: "Ultimate reality is peaceful, free from conceptual elaboration, beyond language and thought. This is the nature of the Tathāgata.",
      quantum: "Quantum Coherence: Undisturbed quantum systems exist in coherent states of pure potentiality, analogous to the mind free from conceptual proliferation."
    },
    {
      number: 10,
      title: "Samsara and Nirvana",
      summary: "There is no difference between samsara and nirvana from the perspective of emptiness. Both are ultimately empty of inherent existence.",
      quantum: "Quantum Fluctuations: The quantum vacuum shows that 'nothing' and 'something' are not absolute opposites but interconnected states, paralleling the non-duality of samsara and nirvana."
    },
    {
      number: 11,
      title: "Limits of Nirvana",
      summary: "Nirvana cannot be described as existent, non-existent, both, or neither. These designations apply only to what can be conceptually grasped.",
      quantum: "Quantum Measurement Problem: The transition from quantum possibilities to classical outcomes cannot be fully described within quantum theory itself."
    },
    {
      number: 12,
      title: "Buddha After Death",
      summary: "After death, the Tathāgata cannot be described as existent, non-existent, both, or neither. These designations apply only to conventional truth.",
      quantum: "Quantum Erasure: Quantum experiments show that the past can be retroactively affected, challenging linear notions of existence and non-existence."
    },
    {
      number: 13,
      title: "Ultimate and Conventional",
      summary: "From the conventional perspective, we speak of the Buddha, but from the ultimate perspective, there is no Buddha to be found.",
      quantum: "Quantum-Classical Boundary: The quantum world must be described through classical instruments despite transcending classical description."
    },
    {
      number: 14,
      title: "Nature of Reality",
      summary: "The nature of the Buddha is the nature of the world. Neither the Buddha nor the world has inherent existence.",
      quantum: "Quantum Field Theory: Particles emerge as excitations in underlying quantum fields, lacking independent existence just as all phenomena lack inherent existence."
    },
    {
      number: 15,
      title: "Buddha and Emptiness",
      summary: "The Buddha is empty of Buddha-nature. The teaching of emptiness is not a view but a remedy for all views.",
      quantum: "Quantum Framework: Quantum theory provides predictive power without committing to a definitive picture of 'reality,' paralleling emptiness as freedom from views."
    },
    {
      number: 16,
      title: "Liberation Through Emptiness",
      summary: "Understanding the Tathāgata as empty is itself liberation, for it releases us from the grip of conceptual proliferation about ultimate reality.",
      quantum: "Quantum Information: The fundamental reality in quantum physics may be information rather than substance, paralleling the Buddha's teaching that wisdom rather than metaphysical views leads to liberation."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 22: Investigation of the Tathāgata - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 22 of Mūlamadhyamakakārikā examining the nature of the Buddha through Madhyamaka and quantum physics" />
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
              <a href="/Ch22/index.html" className={styles.visualizeButton}>
                View Interactive Animations
              </a>
            </div>
          </div>
        </section>

        <section className={styles.verseList}>
          <h2>Chapter Verses</h2>
          
          <div className={styles.verses}>
            {verses.map(verse => (
              <div key={verse.number} className={styles.verseCard}>
                <div className={styles.verseNumber}>
                  {chapterInfo.number}.{verse.number}
                </div>
                <div className={styles.verseContent}>
                  <h3>{verse.title}</h3>
                  <div className={styles.verseSummaries}>
                    <p><strong>Madhyamaka:</strong> {verse.summary}</p>
                    <p><strong>Quantum:</strong> {verse.quantum}</p>
                  </div>
                  <div className={styles.verseLinks}>
                    <Link href={`/Ch22/index.html#verse-${verse.number}`}>
                      View Animation
                    </Link>
                  </div>
                </div>
              </div>
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