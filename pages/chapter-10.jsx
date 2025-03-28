import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter10() {
  // Chapter information
  const chapterInfo = {
    number: "10",
    title: "Investigation of Fire and Firewood",
    verseCount: 16,
    summary: "This chapter examines the relationship between fire and firewood as a metaphor for the relationship between agent and action, or subject and object. Nāgārjuna demonstrates that fire and firewood are neither identical nor completely separate, highlighting their interdependence and lack of inherent existence. The chapter further explores this relationship, extending the analysis to all phenomena, showing that nothing exists independently or with inherent nature.",
    quantumSummary: "The quantum parallels include entanglement, particle creation and annihilation, quantum jumps, coherence and decoherence, field interactions, superposition, contextuality, uncertainty principle, wave-particle duality, quantum tunneling, and quantum field theory. All of these demonstrate similar principles of interdependence and the lack of inherently existing entities, challenging our conventional understanding of reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    // Part 1 verses
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
    },
    // Part 2 verses
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
        <title>Chapter 10: Investigation of Fire and Firewood - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 10 of Mūlamadhyamakakārikā examining fire and firewood through Madhyamaka and quantum physics" />
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
            
            <div className={styles.chapterActions}>
              <a href="/Ch10 (1:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/Ch10 (2:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 2)
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
                    <Link href={verse.number <= 8 
                      ? `/Ch10 (1:2)/index.html#verse-${verse.number}` 
                      : `/Ch10 (2:2)/index.html#verse-${verse.number}`}>
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