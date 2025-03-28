import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter10Part1() {
  // Chapter information
  const chapterInfo = {
    number: "10 (Part 1)",
    title: "Investigation of Fire and Firewood",
    verseCount: 8,
    summary: "This chapter examines the relationship between fire and firewood as a metaphor for the relationship between agent and action, or subject and object. Nāgārjuna demonstrates that fire and firewood are neither identical nor completely separate, highlighting their interdependence and lack of inherent existence.",
    quantumSummary: "The quantum parallels include entanglement, particle creation and annihilation, quantum jumps, coherence and decoherence, and field interactions, all of which demonstrate similar principles of interdependence and the lack of inherently existing entities."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Neither Identity Nor Difference",
      summary: "Challenges inherent existence by showing fire and firewood are neither identical nor entirely separate. If identical, the distinction between agent and action collapses. If entirely different, fire could exist without wood, which it cannot.",
      quantum: "Quantum entanglement: Two particles are correlated such that the state of one affects the other instantly, regardless of distance. They are neither fully separate nor identical."
    },
    {
      number: 2,
      title: "Dependence on Conditions",
      summary: "If fire existed inherently, it would burn eternally without needing conditions like wood. This contradicts experience, as fire requires causes to start and stop. Thus, fire arises dependently.",
      quantum: "Particle creation and annihilation: In quantum field theory, particles are created from energy and annihilate back into energy, depending on specific conditions."
    },
    {
      number: 3,
      title: "Dependent Origination",
      summary: "Reiterates that if fire were independent, it wouldn't need causes to start, making the act of starting a fire pointless. Since fire does require conditions, it must be dependent.",
      quantum: "Quantum jumps: Electrons in atoms jump between energy levels, emitting or absorbing photons only under specific energy conditions."
    },
    {
      number: 4,
      title: "Temporal Aspects of Burning",
      summary: "Examines temporal aspects of burning, showing dependence on conditions for ignition, reinforcing emptiness.",
      quantum: "Quantum jumps: Electron transitions depend on energy conditions, highlighting the temporal nature of quantum processes."
    },
    {
      number: 5,
      title: "Connection Despite Difference",
      summary: "Argues fire and wood must connect despite difference, illustrating interdependence and lack of inherent characteristics.",
      quantum: "Quantum coherence and decoherence: Interaction with environment causes quantum systems to change state, showing interdependence."
    },
    {
      number: 6,
      title: "Analogy of Connection",
      summary: "Uses analogy to show different entities can connect, emphasizing interdependence despite difference.",
      quantum: "Quantum field interactions: Particles interact via fields despite being different entities, showing connection between distinct elements."
    },
    {
      number: 7,
      title: "Mutual Exclusivity Yet Connection",
      summary: "Suggests mutual exclusivity yet necessity of connection, reinforcing interdependence.",
      quantum: "Particle-antiparticle annihilation: Different entities connect and annihilate each other, showing both difference and connection."
    },
    {
      number: 8,
      title: "Circular Dependency",
      summary: "Highlights circular dependency, showing neither can be established first, pointing to emptiness.",
      quantum: "Measurement problem: Observer and observed are interdependent, with no clear establishment of which comes first."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 10 (Part 1): Investigation of Fire and Firewood - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 10 (Part 1) of Mūlamadhyamakakārikā examining fire and firewood through Madhyamaka and quantum physics" />
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
              <a href="/Ch10_part1/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch10_part1/index.html#verse-${verse.number}`}>
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
          <Link href="/chapter-10-part2" className={styles.navLink}>
            Continue to Part 2 →
          </Link>
        </div>
      </main>
    </div>
  );
}