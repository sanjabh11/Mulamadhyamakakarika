import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter13() {
  // Chapter information
  const chapterInfo = {
    number: 13,
    title: "Investigation of Samskaras",
    verseCount: 8,
    summary: "In this chapter, Nāgārjuna examines samskaras (conditioned phenomena) and their deceptive nature. He demonstrates that all conditioned things lack inherent existence, are subject to change, and are ultimately empty. The chapter explores the relationship between conventional reality and ultimate truth through the lens of impermanence and transformation.",
    quantumSummary: "The quantum parallels include wave function collapse, quantum entanglement, Heisenberg's uncertainty principle, wave-particle duality, quantum jumps, particle decay, superposition, and the interpretational challenges of quantum mechanics—all of which challenge our conventional understanding of reality and mirror the emptiness of phenomena."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Deceptive Dharmas",
      summary: "Highlights two truths: samskaras are conventionally real but ultimately empty and false.",
      quantum: "Measurement problem: particles seem fixed but are probabilistic until measured."
    },
    {
      number: 2,
      title: "Complete Emptiness",
      summary: "Recognizing deception fully presents emptiness, the absence of inherent existence.",
      quantum: "Entanglement: particles are interconnected, challenging local realism, complete quantum view."
    },
    {
      number: 3,
      title: "Essential Nature",
      summary: "Things lack inherent nature due to change, but their nature is emptiness, conventionally existing.",
      quantum: "Heisenberg uncertainty: particles lack fixed properties, probabilistic nature mirrors emptiness."
    },
    {
      number: 4,
      title: "Change and Essence",
      summary: "Tetralemma shows both having and lacking inherent nature lead to problems, pointing to middle way.",
      quantum: "Wave-particle duality: light is neither purely wave nor particle, mirroring middle way."
    },
    {
      number: 5,
      title: "Distinct Moments",
      summary: "Illustrates momentariness, rejecting continuous identity, each moment distinct.",
      quantum: "Quantum jumps: electrons change levels discontinuously, no gradual change, like distinct moments."
    },
    {
      number: 6,
      title: "Transformation",
      summary: "Transformation shows no persistent identity; milk ceases, curds arise, each distinct.",
      quantum: "Particle decay: carbon-14 decays to nitrogen-14, original ceases, new arises, no identity."
    },
    {
      number: 7,
      title: "Universal Emptiness",
      summary: "Emptiness is universal, no distinction; all phenomena are empty, no non-empty parts.",
      quantum: "Superposition: all quantum systems can be in superpositions, universal, like universal emptiness."
    },
    {
      number: 8,
      title: "Transcending Views",
      summary: "Emptiness is transcending views, not a doctrine; grasping it as such leads to error.",
      quantum: "Entanglement: correct understanding doesn't allow faster-than-light, misinterpreting leads to errors, like viewing emptiness."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 13: Investigation of Samskaras - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 13 of Mūlamadhyamakakārikā examining samskaras through Madhyamaka and quantum physics" />
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
              <a href="/Ch13/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch13/index.html#verse=${verse.number}`}>
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