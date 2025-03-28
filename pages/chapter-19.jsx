import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter19() {
  // Chapter information
  const chapterInfo = {
    number: 19,
    title: "Investigation of Time",
    verseCount: 6,
    summary: "This chapter examines the nature of time, showing that past, present, and future cannot be established as inherently existent. Nāgārjuna demonstrates that time is neither an entity in itself nor a property of entities, but rather a conceptual construction dependent on the changing phenomena it supposedly measures.",
    quantumSummary: "The quantum parallels include time's relational nature in quantum mechanics, quantum non-locality, and the observer-dependence of temporal sequence, showing how quantum physics similarly challenges our conventional understanding of time as an absolute framework."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Time's Dependence",
      summary: "If the present and future depend on the past, then the present and future would have existed in the past. But this contradicts their being present and future.",
      quantum: "Quantum Time Symmetry: In quantum theory, the fundamental laws are time-symmetric, challenging the inherent directional flow from past to future."
    },
    {
      number: 2,
      title: "Unconditioned Time",
      summary: "If the present and future did not exist in the past, how could they depend on it? They would arise without causes.",
      quantum: "Quantum Causality: Quantum events challenge classical temporal causality, showing connections that transcend simple before-after relationships."
    },
    {
      number: 3,
      title: "Independent Time",
      summary: "If the present and future do not depend on the past, they would not be classified as present and future, since these designations are relative to the past.",
      quantum: "Quantum Reference Frames: In quantum mechanics, different observers may disagree about the temporal ordering of events, showing time's relative nature."
    },
    {
      number: 4,
      title: "Time Without Standstill",
      summary: "Time does not stand still. There is no time that can be grasped as stationary. How could a non-stationary time be perceived?",
      quantum: "Quantum Time-Energy Uncertainty: The energy-time uncertainty relation shows that precise time points cannot be defined at the quantum level."
    },
    {
      number: 5,
      title: "Time Without Movement",
      summary: "If time cannot be grasped, how does one establish its existence? If time does not exist, how can entities exist in time?",
      quantum: "Quantum Eternalism: In quantum field theory, time appears as a dimension rather than a flow, suggesting a static block universe rather than moving time."
    },
    {
      number: 6,
      title: "Time as Dependent Concept",
      summary: "Time is not established as an entity in itself. It is merely a conceptual designation dependent on changing phenomena, which are themselves empty of inherent existence.",
      quantum: "Quantum Temporal Contextuality: In quantum mechanics, time measurements depend on specific experimental arrangements, not on an absolute, observer-independent time."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 19: Investigation of Time - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 19 of Mūlamadhyamakakārikā examining time through Madhyamaka and quantum physics" />
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
              <a href="/Ch19/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch19/index.html#verse-${verse.number}`}>
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