import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter1() {
  // Chapter information
  const chapterInfo = {
    number: 1,
    title: "Investigation of Conditions",
    verseCount: 14,
    summary: "This chapter examines the fundamental nature of causation and conditions, rejecting inherent arising and affirming dependent origination. Through a systematic analysis using the tetralemma, Nāgārjuna demonstrates that phenomena lack independent existence and are empty of intrinsic essence.",
    quantumSummary: "The quantum parallels in this chapter include entanglement, superposition, complementarity, and non-locality, illustrating how modern physics resonates with Madhyamaka insights regarding interdependence, the middle way, and the limitations of conventional understanding."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Investigation of Conditions",
      summary: "Rejecting inherent arising, emphasizing dependent origination",
      quantum: "Entanglement illustrates interdependence, mirroring dependent origination"
    },
    {
      number: 2,
      title: "The Four Conditions",
      summary: "Listing the four conditions necessary for dependent origination",
      quantum: "Quantum Contextuality shows outcomes depend on measurement context"
    },
    {
      number: 3,
      title: "Essence and Interdependence",
      summary: "Emphasizing emptiness and interdependence of all phenomena",
      quantum: "Entanglement demonstrates the lack of independent essence"
    },
    {
      number: 4,
      title: "Activity and Conditions",
      summary: "Negating fixed relationships between activity and conditions",
      quantum: "Quantum Complementarity requires incompatible descriptions of reality"
    },
    {
      number: 5,
      title: "Conditions and Non-conditions",
      summary: "Conditions are conventionally designated based on dependent origination",
      quantum: "Wave function collapse actualizes potential states only upon measurement"
    },
    {
      number: 6,
      title: "Conditions and Existence",
      summary: "Things are neither inherently existent nor non-existent",
      quantum: "Superposition illustrates the middle way between existence/non-existence"
    },
    {
      number: 7,
      title: "Rejection of the Four Extremes",
      summary: "Rejecting all four extremes for existence, emphasizing emptiness",
      quantum: "Quantum Complementarity requires multiple views, rejecting fixed states"
    },
    {
      number: 8,
      title: "Subject-Object Dichotomy",
      summary: "Emptiness of subject-object dichotomy, emphasizing interdependence",
      quantum: "Observer Effect shows observation affects the observed system"
    },
    {
      number: 9,
      title: "Emptiness of Arising and Cessation",
      summary: "Questioning the inherent existence of arising and cessation",
      quantum: "Quantum Decoherence shows state transitions depend on environment"
    },
    {
      number: 10,
      title: "Emptiness of Causal Relationships",
      summary: "Rejecting inherent causation between phenomena",
      quantum: "Quantum Non-Locality shows correlations without local causal connections"
    },
    {
      number: 11,
      title: "Emptiness of Cause and Effect",
      summary: "Effects are not inherently found in their causes",
      quantum: "Quantum Superposition shows effects exist as potentials until measured"
    },
    {
      number: 12,
      title: "Critique of Inherent Causation",
      summary: "Conditions do not inherently produce their effects",
      quantum: "Quantum Fluctuations show spontaneous arising of particles"
    },
    {
      number: 13,
      title: "Emptiness of Cause and Effect",
      summary: "Both cause and effect lack inherent existence",
      quantum: "Entanglement shows correlations without independent essence"
    },
    {
      number: 14,
      title: "Emptiness of All Phenomena",
      summary: "Conditions and effects are mutually empty",
      quantum: "Quantum Complementarity requires incompatible descriptions of reality"
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 1: Investigation of Conditions - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 1 of Mūlamadhyamakakārikā examining conditions and causality through Madhyamaka and quantum physics" />
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
              <a href="/Ch1/index.html" className={styles.visualizeButton}>
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
                href={`/Ch1/index.html#verse-${verse.number}`}
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