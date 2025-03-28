import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter9() {
  // Chapter information
  const chapterInfo = {
    number: 9,
    title: "Investigation of the Presence of Something Prior",
    verseCount: 12,
    summary: "This chapter examines whether a self or perceiver exists prior to the acts of seeing, hearing, and feeling. Nāgārjuna demonstrates that neither the self nor experiences can exist independently of each other, highlighting their mutual dependence and ultimate emptiness.",
    quantumSummary: "The quantum parallels include wave function collapse, quantum erasure, Bell's inequality, superposition, entanglement, and complementarity, all of which challenge our conventional understanding of pre-existing properties and independent existence."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Pre-existing Self",
      summary: "Addresses the claim that a self exists prior to sensory experiences, refuting inherent existence via emptiness.",
      quantum: "Wave function collapse: particles lack definite properties until measured, just as a self cannot be established prior to experiences."
    },
    {
      number: 2,
      title: "Opponent's View",
      summary: "Presents the opponent's view that a self must exist before experiences, critiquing circular dependence and showing logical inconsistencies.",
      quantum: "Delayed choice experiment: measurement after passage affects past behavior, challenging the notion of pre-existing properties."
    },
    {
      number: 3,
      title: "Epistemological Challenge",
      summary: "Questions how we could know a pre-existing self, highlighting epistemological incoherence in the opponent's position.",
      quantum: "Bell's theorem: no local hidden variables, particles lack pre-existing properties, challenging the notion of independent existence."
    },
    {
      number: 4,
      title: "Independence Argument",
      summary: "If self exists independently, experiences should exist without it, deconstructing the claimed dependence.",
      quantum: "Quantum superposition: systems exist in multiple states until measured, with no definite state independently."
    },
    {
      number: 5,
      title: "Mutual Dependence",
      summary: "Highlights mutual dependence between self and experiences, showing both are empty of inherent existence.",
      quantum: "Quantum entanglement: particles are correlated and cannot be described independently, mirroring the interdependence of self and experiences."
    },
    {
      number: 6,
      title: "Temporal Emergence",
      summary: "Self not evident before all experiences, known through different senses over time, designated based on aggregates.",
      quantum: "Quantum decoherence: state emerges through environmental interactions, properties not fixed but arise through interaction."
    },
    {
      number: 7,
      title: "Logical Inconsistency",
      summary: "Questions self's prior existence before each experience if not before all, highlighting inconsistency in the opponent's view.",
      quantum: "Measurement problem: state indeterminate until measured, difficulty defining prior states, challenging pre-existing identity."
    },
    {
      number: 8,
      title: "Contradictions in Timing",
      summary: "Critiques singular self being all senses prior to each, leading to contradictions in timing and nature.",
      quantum: "Quantum non-commutativity: measurement order affects outcomes, properties not simultaneously defined, challenging fixed identity."
    },
    {
      number: 9,
      title: "Multiple Selves Problem",
      summary: "Considers separate entities for senses, leading to multiple selves, problematic for unified self, reinforcing emptiness.",
      quantum: "Quantum entanglement of multiple particles: interconnected systems with no independent existence, challenging the notion of separate identities."
    },
    {
      number: 10,
      title: "Not Found in Elements",
      summary: "Self not found in aggregates giving rise to experiences, reinforcing emptiness and holistic designation.",
      quantum: "Quantum holism: system properties not reducible to individual parts, mirroring how self is not found in individual aggregates."
    },
    {
      number: 11,
      title: "Mutual Non-evidence",
      summary: "If self not evident, experiences aren't either, reinforcing mutual dependence and emptiness of both.",
      quantum: "Relational quantum mechanics: properties relative to observers, no absolute states, mirroring the interdependence of self and experiences."
    },
    {
      number: 12,
      title: "Middle Way",
      summary: "Advises rejecting existence/non-existence of self, as not evident, aligning with middle way, transcending dualities.",
      quantum: "Complementarity: particles exhibit wave/particle properties, requiring multiple descriptions, transcending binary categorization."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 9: Investigation of the Presence of Something Prior - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 9 of Mūlamadhyamakakārikā examining the presence of something prior through Madhyamaka and quantum physics" />
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
              <a href="/Ch9/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch9/index.html#verse-${verse.number}`}>
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