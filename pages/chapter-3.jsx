import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter3() {
  // Chapter information
  const chapterInfo = {
    number: 3,
    title: "Examination of the Senses",
    verseCount: 9,
    summary: "This chapter investigates the nature of the six sense faculties and their objects. Nāgārjuna examines the paradoxes in perception, demonstrating that the seer, seeing, and that which is seen lack inherent existence and arise in mutual dependence.",
    quantumSummary: "The quantum parallels include entanglement, the observer effect, wave-particle duality, and quantum superposition, showing how modern physics similarly challenges our conventional understanding of perception and observation."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Dependent Relationship of Senses and Objects",
      summary: "When consciousness and form depend on each other, both are empty of inherent existence",
      quantum: "Quantum entanglement shows two particles existing in correlated states, each defined by the other"
    },
    {
      number: 2,
      title: "Consciousness Cannot Precede Form",
      summary: "If form depends on consciousness, how could consciousness pre-exist form?",
      quantum: "Observer effect suggests reality isn't fully determined until observation occurs"
    },
    {
      number: 3,
      title: "Form Cannot Precede Consciousness",
      summary: "If consciousness depends on form, how could form pre-exist consciousness?",
      quantum: "Complementarity principle demonstrates properties emerge only in relation to specific observations"
    },
    {
      number: 4,
      title: "No Seer Before Seeing",
      summary: "Without form, how could there be a seer? Therefore, before seeing, there is no seer",
      quantum: "Quantum contextuality shows objects don't possess definite properties prior to measurement"
    },
    {
      number: 5,
      title: "Self-Reference Problem",
      summary: "A seer does not see themselves. How could something that does not see itself see others?",
      quantum: "Quantum superposition shows a particle exists in multiple states simultaneously until observed"
    },
    {
      number: 6,
      title: "Middle Way of Perception",
      summary: "Seeing does not see, non-seeing does not see. Through seeing, the seer is clearly explained",
      quantum: "Wave-particle duality demonstrates quantum entities are neither purely waves nor purely particles"
    },
    {
      number: 7,
      title: "Dependent Origination of Consciousness",
      summary: "The arising of seeing, hearing, smelling, tasting, touching, and consciousness depends on form",
      quantum: "Quantum field theory describes particles as excitations of underlying fields"
    },
    {
      number: 8,
      title: "Emptiness of Aggregates",
      summary: "Since seeing and other senses cannot be established, how can aggregates, elements, and sense media be established?",
      quantum: "Quantum decoherence shows systems lose coherence through environmental interaction"
    },
    {
      number: 9,
      title: "Dependent Nature of Change",
      summary: "When something is arising or ceasing, it does so in dependence on conditions, not independently",
      quantum: "Quantum uncertainty reveals position and momentum cannot be simultaneously determined with precision"
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 3: Examination of the Senses - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 3 of Mūlamadhyamakakārikā examining the senses through Madhyamaka and quantum physics" />
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
              <a href="/Ch3/index.html" className={styles.visualizeButton}>
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
                href={`/Ch3/index.html#verse-${verse.number}`}
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