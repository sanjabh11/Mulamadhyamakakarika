import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter10Part2() {
  // Chapter information
  const chapterInfo = {
    number: "10 (Part 2)",
    title: "Investigation of Fire and Firewood",
    verseCount: 8,
    summary: "This second part of Chapter 10 continues the examination of the relationship between fire and firewood, further exploring their interdependence and lack of inherent existence. Nāgārjuna extends this analysis to all phenomena, showing that nothing exists independently or with inherent nature.",
    quantumSummary: "The quantum parallels include superposition, contextuality, uncertainty principle, wave-particle duality, quantum tunneling, and quantum field theory, all of which demonstrate similar principles of interdependence and the lack of inherently existing entities."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 9,
      title: "Logical Inconsistency of Dependence",
      summary: "Challenges logical consistency of dependence, showing neither fire nor wood can be independent or fully dependent on the other.",
      quantum: "Quantum superposition: Systems exist in multiple states simultaneously, neither here nor there, challenging classical notions of definite states."
    },
    {
      number: 10,
      title: "Circular Dependency",
      summary: "Further explores circular dependency, showing mutual dependence leads to logical impasse, reinforcing emptiness of both fire and wood.",
      quantum: "Quantum contextuality: Properties depend on measurement context, showing interdependence of observer and observed."
    },
    {
      number: 11,
      title: "Dependent Establishment",
      summary: "Questions logical possibility of dependent establishment, showing inherent existence is untenable when things depend on each other.",
      quantum: "Uncertainty principle: Cannot know position and momentum simultaneously, showing limits to establishment of definite properties."
    },
    {
      number: 12,
      title: "Middle Way",
      summary: "Denies both dependence and independence, rejecting extremes, central to Madhyamaka's middle way approach to understanding reality.",
      quantum: "Wave-particle duality: Quantum entities exhibit properties of both waves and particles, transcending binary categorization."
    },
    {
      number: 13,
      title: "Origin and Existence",
      summary: "Argues fire doesn't originate elsewhere nor pre-exist in wood, showing dependent nature, extending to all phenomena.",
      quantum: "Quantum tunneling: Particles appear without classical paths, not coming from elsewhere, challenging classical notions of movement."
    },
    {
      number: 14,
      title: "Substantial Relationships",
      summary: "Denies all possible substantial relationships between fire and wood, showing emptiness of inherent connections.",
      quantum: "Quantum field theory: Particles as field excitations, no inherent possession or containment, challenging notion of separate entities."
    },
    {
      number: 15,
      title: "Universal Application",
      summary: "Generalizes argument to all phenomena, showing all are empty like fire and wood, central to MMK's conclusion about emptiness.",
      quantum: "Summary of quantum concepts applied to everyday objects, showing universal application of quantum principles."
    },
    {
      number: 16,
      title: "Critique of Extremes",
      summary: "Criticizes views asserting inherent identity or difference, aligning with Madhyamaka's rejection of extremes and middle way approach.",
      quantum: "Quantum states resist binary categorization, being neither entirely same nor different, challenging classical logic."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 10 (Part 2): Investigation of Fire and Firewood - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 10 (Part 2) of Mūlamadhyamakakārikā examining fire and firewood through Madhyamaka and quantum physics" />
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
              <a href="/Ch10_part2/index.html" className={styles.visualizeButton}>
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
                  10.{verse.number}
                </div>
                <div className={styles.verseContent}>
                  <h3>{verse.title}</h3>
                  <div className={styles.verseSummaries}>
                    <p><strong>Madhyamaka:</strong> {verse.summary}</p>
                    <p><strong>Quantum:</strong> {verse.quantum}</p>
                  </div>
                  <div className={styles.verseLinks}>
                    <Link href={`/Ch10_part2/index.html#verse-${verse.number}`}>
                      View Animation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <div className={styles.navigation}>
          <Link href="/chapter-10-part1" className={styles.navLink}>
            ← Back to Part 1
          </Link>
          <Link href="/" className={styles.navLink}>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}