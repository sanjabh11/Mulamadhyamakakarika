import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter8() {
  // Chapter information
  const chapterInfo = {
    number: 8,
    title: "Investigation of Act and Actor",
    verseCount: 13,
    summary: "This chapter examines the relationship between actions and agents, showing that neither can exist independently. Nāgārjuna demonstrates that both act and actor are empty of inherent existence and arise dependently.",
    quantumSummary: "The quantum parallels include entanglement, superposition, contextuality, and quantum field theory, revealing how quantum physics similarly challenges our conventional understanding of causation and independent existence."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Interdependence of Actor and Act",
      summary: "Neither actor nor act has inherent existence; they arise interdependently.",
      quantum: "Quantum Entanglement: Entangled particles share correlated states regardless of distance, demonstrating their fundamental interconnection."
    },
    {
      number: 2,
      title: "Absurdity of Inherent Existence",
      summary: "The absurdity of inherent existence is revealed; actor and act dependently arise.",
      quantum: "Quantum Superposition: Particles exist in multiple states simultaneously until measured, similar to how both actor and act exist in an indeterminate state."
    },
    {
      number: 3,
      title: "Conventional Existence Through Dependence",
      summary: "This rejects nihilism; conventional existence arises through dependence.",
      quantum: "Wave Function Probability: Quantum wave functions represent probabilistic existence, like the electron in the double-slit experiment."
    },
    {
      number: 4,
      title: "Dependent Origination",
      summary: "Emphasizes dependent origination; causes and effects are interdependent.",
      quantum: "Path Integral Formulation: In quantum mechanics, the path integral sums over all possible paths a particle might take."
    },
    {
      number: 5,
      title: "Emptiness Underpins Convention",
      summary: "Without actions, no ethics or fruits; emptiness underpins convention.",
      quantum: "Quantum Decoherence: Explains how quantum systems interact with their environment to produce classical behavior."
    },
    {
      number: 6,
      title: "Karma and Liberation",
      summary: "Without fruits, liberation and activities meaningless; karma vital.",
      quantum: "Statistical Interpretation: While individual quantum events are unpredictable, patterns emerge at scale, just as karma's effects manifest over time."
    },
    {
      number: 7,
      title: "Middle Way on Emptiness",
      summary: "Rejects both existence and non-existence; middle way on emptiness.",
      quantum: "Quantum Contextuality: Measurement outcomes depend on the context of measurement, showing properties aren't fixed but emerge based on interaction."
    },
    {
      number: 8,
      title: "Contradictions from Inherent Existence",
      summary: "Contradictions from inherent existence; reinforces interdependence.",
      quantum: "Incompatible Observables: Heisenberg's uncertainty principle demonstrates that incompatible observables cannot be simultaneously measured with precision."
    },
    {
      number: 9,
      title: "Indeterminate States",
      summary: "Extends to indeterminate states; actor can't perform fixed acts.",
      quantum: "Quantum Indeterminacy: Particles fundamentally lack definite properties until measured, existing as clouds of probability."
    },
    {
      number: 10,
      title: "No Fixed Actor-Act Relations",
      summary: "Without inherent existence, no fixed actor-act relations.",
      quantum: "Quantum Coherence: Systems maintain superpositions of states, enabling quantum computers to process multiple possibilities simultaneously."
    },
    {
      number: 11,
      title: "Middle Position",
      summary: "Middle position; neither exists nor not, both actor and act empty.",
      quantum: "Quantum Superposition of Qubits: Qubits exist in superpositions, representing neither purely 0 nor purely 1, but probability amplitudes of both."
    },
    {
      number: 12,
      title: "Mutual Dependence",
      summary: "Explicit mutual dependence; actor and act co-arise.",
      quantum: "Quantum Field Theory: Particles are excitations of underlying fields, showing how seemingly distinct entities arise from common foundations."
    },
    {
      number: 13,
      title: "All Phenomena Empty",
      summary: "Extends to clinging; all phenomena empty, interdependent.",
      quantum: "Quantum Holism: System properties cannot be reduced to individual parts, as the whole system exhibits behaviors that transcend the sum of its components."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 8: Investigation of Act and Actor - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 8 of Mūlamadhyamakakārikā examining act and actor through Madhyamaka and quantum physics" />
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
              <a href="/Ch8/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch8/index.html#verse-${verse.number}`}>
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