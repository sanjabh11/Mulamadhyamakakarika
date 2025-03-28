import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter14() {
  // Chapter information
  const chapterInfo = {
    number: 14,
    title: "Investigation of Connection",
    verseCount: 8,
    summary: "In this chapter, Nāgārjuna examines the nature of connection and relation between things. He demonstrates that connections between the seer, seeing, and seen (and by extension, all other relations) cannot be established as inherently existent. This analysis reveals that all connections are empty of inherent existence and arise dependently.",
    quantumSummary: "The quantum parallels include the measurement problem, quantum entanglement, wave-particle duality, quantum superposition, and quantum contextuality—all of which challenge classical notions of fixed connections and highlight the relational, non-inherent nature of reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "No Inherent Connection",
      summary: "Nāgārjuna argues that the seen, the seeing, and the seer do not mutually connect as pairs or all together, emphasizing that subject, object, and action lack inherent connections, reinforcing emptiness and dependence.",
      quantum: "The measurement problem in quantum physics shows how observation affects system state, demonstrating that the observer, the act of observing, and what is observed are not independent but interconnected."
    },
    {
      number: 2,
      title: "Desire and Sense-fields",
      summary: "Extending the analysis to desire, desiring, and the desired, as well as other afflictions and sense-fields, Nāgārjuna shows that these also lack inherent connections, all being empty and reinforcing dependent origination.",
      quantum: "Quantum entanglement demonstrates how particles' states can be correlated instantly across distances, mirroring non-local dependent links between seemingly separate phenomena."
    },
    {
      number: 3,
      title: "Paradox of Connection",
      summary: "Nāgārjuna points out that connected things must be distinct, but distinct things cannot connect inherently, revealing that all connections are empty of inherent existence.",
      quantum: "Quantum entanglement challenges classical notions of connection by showing that distinct particles can be correlated in ways that defy classical physics."
    },
    {
      number: 4,
      title: "Simultaneity and Otherness",
      summary: "This verse challenges the idea that simultaneous things are inherently distinct, showing that distinctions are conventional and dependent on conceptualization rather than being inherent.",
      quantum: "Quantum superposition, where particles exist in multiple states until measured, parallels the non-inherent nature of distinctions in conventional reality."
    },
    {
      number: 5,
      title: "Dependent Otherness",
      summary: "Nāgārjuna demonstrates that otherness is relational and dependent, lacking inherent existence and emphasizing the interdependence of all phenomena.",
      quantum: "Wave-particle duality, where a particle's behavior depends on how it's observed, mirrors the dependent nature of identity and otherness."
    },
    {
      number: 6,
      title: "Paradox of Otherness",
      summary: "This verse reveals the paradoxical nature of otherness—it relies on another to exist, yet cannot be inherently other, leading to the conclusion of emptiness.",
      quantum: "Quantum contextuality, where measurement outcomes depend on what else is being measured, demonstrates how properties are context-dependent rather than inherent."
    },
    {
      number: 7,
      title: "Non-existence of Otherness",
      summary: "Nāgārjuna concludes that otherness does not exist inherently in anything, and that 'other' and 'not other' are empty, interdependent concepts.",
      quantum: "The measurement problem in quantum physics shows how the observer and observed are linked by the act of measurement, paralleling the lack of inherent distinctions between phenomena."
    },
    {
      number: 8,
      title: "No Inherent Connection",
      summary: "The final verse reinforces that nothing connects inherently—connections, acts, and agents are all empty, aligning with the rejection of inherent relations.",
      quantum: "Entanglement swapping, where particles can become connected indirectly, demonstrates that connections aren't fixed properties but arise through interdependence."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 14: Investigation of Connection - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 14 of Mūlamadhyamakakārikā examining the nature of connection through Madhyamaka and quantum physics" />
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
              <a href="/Ch14/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch14/index.html?verse=${verse.number}`}>
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