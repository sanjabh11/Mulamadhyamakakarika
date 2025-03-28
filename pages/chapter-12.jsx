import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter12() {
  // Chapter information
  const chapterInfo = {
    number: 12,
    title: "Investigation of Anguish",
    verseCount: 10,
    summary: "In this chapter, Nāgārjuna examines the nature of anguish (suffering) and refutes four possible views of its origin: self-caused, other-caused, both, or without cause. He demonstrates that suffering, like all phenomena, lacks inherent existence and arises dependently, challenging our conventional understanding of causality and the nature of suffering.",
    quantumSummary: "The quantum parallels include wave-particle duality, quantum entanglement, the EPR paradox, Bell's theorem, and vacuum fluctuations—all of which challenge classical notions of fixed causality and highlight the relational, non-inherent nature of reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Four Views of Suffering's Origin",
      summary: "Nāgārjuna refutes four views on suffering's origin (self-caused, other-caused, both, or without cause), as they imply inherent existence, contradicting dependent origination.",
      quantum: "Wave-Particle Duality: Particles show wave or particle behavior depending on observation, indicating phenomena lack inherent nature, similar to suffering's non-inherent cause."
    },
    {
      number: 2,
      title: "Against Self-Causation",
      summary: "Argues against self-causation, since the self (aggregates) arises dependently, not inherently, supporting the concept of anatta (no-self).",
      quantum: "Wave Function Collapse: A quantum system's state emerges only upon measurement, not inherently, mirroring suffering's conditional nature."
    },
    {
      number: 3,
      title: "Interdependence of Self and Other",
      summary: "Challenges the separation of self and other, highlighting their interdependence and lack of inherent existence.",
      quantum: "Quantum Entanglement: Correlated particles influence each other instantly, showing interconnectedness, like self and other being linked."
    },
    {
      number: 4,
      title: "Self and Suffering Inseparable",
      summary: "Questions how the self can cause suffering yet remain separate from it, showing self and suffering are intertwined.",
      quantum: "Many-Worlds Interpretation: The observer is part of the quantum system, not separate, akin to self being inseparable from suffering."
    },
    {
      number: 5,
      title: "Other-Causation Questioned",
      summary: "Critiques suffering as something handed over by another, suggesting no real separation between persons exists.",
      quantum: "EPR Paradox: Entangled particles show instant correlation, challenging separation, much like interconnected persons."
    },
    {
      number: 6,
      title: "No Unaffected Causer",
      summary: "Questions the idea of an unaffected causer of suffering, as all involved experience suffering.",
      quantum: "Back-Action in Quantum Measurements: Measuring a system affects both the system and the measurer, showing mutual influence."
    },
    {
      number: 7,
      title: "Inconsistency of Causation",
      summary: "Shows that rejecting self-causation undermines other-causation, revealing their inconsistency.",
      quantum: "Bell's Theorem: Rules out local hidden variables, indicating no fixed causes, like suffering lacking inherent origins."
    },
    {
      number: 8,
      title: "Emptiness of Suffering",
      summary: "Rejects both self and other as causes of suffering, affirming its emptiness and dependent nature.",
      quantum: "Vacuum Fluctuations: Particles emerge without a specific cause due to quantum uncertainty, similar to suffering's dependent arising."
    },
    {
      number: 9,
      title: "Against All Four Views",
      summary: "Dismisses causation by both self and other, as well as no cause, reinforcing dependent origination.",
      quantum: "Statistical Laws: Individual quantum events are random, but patterns emerge, like suffering's conditional nature."
    },
    {
      number: 10,
      title: "Universal Emptiness",
      summary: "Extends the rejection of the four aspects (self, other, both, no cause) to all phenomena, showing their emptiness.",
      quantum: "Principle of Complementarity: Phenomena lack inherent properties and depend on context, like all things lacking fixed nature."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 12: Investigation of Anguish - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 12 of Mūlamadhyamakakārikā examining the nature of suffering through Madhyamaka and quantum physics" />
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
              <a href="/Ch12/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch12/index.html?verse=${verse.number}`}>
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