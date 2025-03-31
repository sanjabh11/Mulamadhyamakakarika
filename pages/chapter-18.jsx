import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter18() {
  // Chapter information
  const chapterInfo = {
    number: 18,
    title: "Investigation of Self and Phenomena",
    verseCount: 12,
    summary: "This chapter examines the concept of self (ātman) and phenomena (dharmas), demonstrating that neither can be established as inherently existent. Nāgārjuna analyzes various ways the self might be conceived and shows that all such conceptions ultimately fail logical scrutiny.",
    quantumSummary: "The quantum parallels include quantum superposition, entanglement, and contextuality, showing how quantum physics similarly challenges our conventional notions of distinct, inherently existent entities."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Self as Aggregates",
      summary: "If the self were the same as the aggregates, it would be subject to arising and ceasing. If different from the aggregates, it would not have the characteristics of the aggregates.",
      quantum: "Quantum Composition: Quantum objects are neither identical to nor separate from their constituent elements, challenging notions of simple part-whole relationships."
    },
    {
      number: 2,
      title: "Self Without Basis",
      summary: "If there is no self, how can there be something that belongs to the self? Without self and what belongs to self, the 'I' and 'mine' cease.",
      quantum: "Quantum Entanglement: In entangled quantum systems, properties don't 'belong' to individual particles but manifest only in correlation, undermining notions of independent ownership."
    },
    {
      number: 3,
      title: "Cessation of 'I' and 'Mine'",
      summary: "One who does not think in terms of 'I' and 'mine,' for him, the 'I' and 'mine' do not exist. One who sees thus is truly seeing.",
      quantum: "Quantum Delocalization: In quantum systems, particles can be delocalized across space, showing how discrete 'ownership' of properties breaks down at the quantum level."
    },
    {
      number: 4,
      title: "Inner and Outer Emptiness",
      summary: "When views of 'I' and 'mine' have ceased regarding both the inner and outer, the appropriating self ceases. With its cessation, birth ceases.",
      quantum: "Quantum Observer: The observer-observed distinction breaks down in quantum theory, paralleling the dissolution of inner and outer in Madhyamaka."
    },
    {
      number: 5,
      title: "Freedom from Appropriation",
      summary: "When karma and afflictions cease, there is liberation. Karma and afflictions come from conceptual thinking. These come from mental fabrication, which ceases through emptiness.",
      quantum: "Quantum Information: Quantum information isn't 'owned' by particles but exists in relational states, mirroring how appropriation ceases in realizing emptiness."
    },
    {
      number: 6,
      title: "The Buddha's Teaching of Self",
      summary: "The Buddha sometimes taught the self, sometimes taught no-self, and sometimes taught neither self nor no-self. All is peace, the cessation of all elaborations.",
      quantum: "Quantum Complementarity: Quantum phenomena require seemingly contradictory frameworks (wave/particle) for complete description, mirroring the Buddha's skillful means."
    },
    {
      number: 7,
      title: "Absolute and Relative",
      summary: "In absolute truth, there is no expression. The teaching of the absolute depends on the conventional, and without understanding the conventional, the absolute cannot be realized.",
      quantum: "Quantum-Classical Correspondence: Quantum phenomena must be described through classical language and concepts, despite transcending them."
    },
    {
      number: 8,
      title: "The Two Truths",
      summary: "The ultimate truth is not taught independently of conventional practices. Without realizing the ultimate truth, nirvāna is not attained.",
      quantum: "Quantum Measurement: The quantum world can only be accessed through classical measurement devices, showing the necessary relationship between levels of truth."
    },
    {
      number: 9,
      title: "Misunderstanding Emptiness",
      summary: "Emptiness misunderstood can ruin someone of little intelligence, like a snake incorrectly grasped or a spell incorrectly cast.",
      quantum: "Quantum Technologies: Misunderstanding quantum principles leads to failed quantum technologies; proper understanding enables quantum computing."
    },
    {
      number: 10,
      title: "The Buddha's Hesitation",
      summary: "Knowing how difficult it would be for others to understand emptiness, the Buddha initially hesitated to teach the Dharma after his enlightenment.",
      quantum: "Quantum Paradoxes: The counterintuitive nature of quantum theory caused its founders to question its implications, paralleling the Buddha's hesitation."
    },
    {
      number: 11,
      title: "Philosophical Extremes",
      summary: "If emptiness is rejected, nothing is accomplished. The person who denies emptiness is capable of no accomplishment and remains bound by conceptual extremes.",
      quantum: "Quantum Foundations: Without accepting quantum principles, quantum phenomena remain inexplicable, just as without emptiness, philosophical contradictions remain unresolved."
    },
    {
      number: 12,
      title: "Freedom from Extremes",
      summary: "The Buddha's teaching of emptiness is the remedy for all views. Those who make emptiness into a view are declared incurable.",
      quantum: "Quantum Non-realism: Quantum theory provides predictive power without committing to a definitive picture of 'reality,' paralleling emptiness as freedom from views rather than a view itself."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 18: Investigation of Self and Phenomena - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 18 of Mūlamadhyamakakārikā examining self and phenomena through Madhyamaka and quantum physics" />
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
              <a href="/Ch18/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch18/index.html#verse-${verse.number}`}>
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