import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter6() {
  // Chapter information
  const chapterInfo = {
    number: 6,
    title: "Investigation of Desire and the Desirous One",
    verseCount: 10,
    summary: "This chapter examines the relationship between desire and the desirous one, demonstrating that neither can exist independently of the other. Nāgārjuna shows that desire and the one who desires are mutually dependent, challenging the notion of inherent existence in both.",
    quantumSummary: "The quantum parallels include relational quantum mechanics, entanglement, complementarity, and superposition, illustrating how modern physics similarly challenges our conventional understanding of independent existence and fixed properties."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Mutual Dependence of Desire and the Desirous One",
      summary: "If a desirous one without desire exists before desire, desire would exist dependent on that [desirous one]. [When] a desirous one exists, desire exists.",
      quantum: "Relational quantum mechanics: system's state relative to observer, mirroring mutual dependence."
    },
    {
      number: 2,
      title: "Impossibility of Independent Existence",
      summary: "If there were no desirous one, how could there be desire? The same follows for the desirous one too: [it depends on] whether desire exists or not.",
      quantum: "Relational quantum mechanics: observer defines system's state, mirroring mutual dependency."
    },
    {
      number: 3,
      title: "Against Co-existence Without Mutual Dependence",
      summary: "It is not reasonable for desire and the desirous one to arise as co-existent. In this way, desire and the desirous one would not be mutually contingent.",
      quantum: "Entanglement: particles not independent, states correlated, mirroring linked existence."
    },
    {
      number: 4,
      title: "Paradox of Identity and Difference",
      summary: "Identity has no co-existence: something cannot be co-existent with itself. If there were difference, how could there be co-existence?",
      quantum: "Non-separability: particles' states not independent, challenging classical co-existence."
    },
    {
      number: 5,
      title: "Problems with Co-existence",
      summary: "If the identical were co-existent, [co-existence] would also occur between the unrelated; if the different were co-existent, [co-existence] would also occur between the unrelated.",
      quantum: "Entanglement: non-classical co-existence for identical/different particles, correlated properties."
    },
    {
      number: 6,
      title: "Questioning Difference and Co-existence",
      summary: "If the different were co-existent, how would desire and the desirous one be established as different or, if that were so, [how would] those two be co-existent?",
      quantum: "Complementarity: properties mutually exclusive, mirroring linked, non-separable nature."
    },
    {
      number: 7,
      title: "Basis for Co-existence",
      summary: "If desire and the desirous were established as different, because of what could one understand them as co-existent?",
      quantum: "Entanglement: different particles correlated, states co-existent non-classically, mirroring link."
    },
    {
      number: 8,
      title: "Contradiction in Co-existence",
      summary: "If one asserts them to be co-existent because they are not established as different, then because they would be very much established as co-existent, would one not also have to assert them to be different?",
      quantum: "Wave-particle duality: light both wave and particle, defying clear categorization, mirroring ambiguity."
    },
    {
      number: 9,
      title: "Impossibility of Establishing Difference",
      summary: "Since different things are not established, co-existent things are not established. If there existed any different things, one could assert them as co-existent things.",
      quantum: "Superposition: systems in multiple states until measured, paralleling non-establishment."
    },
    {
      number: 10,
      title: "Universal Application of Emptiness",
      summary: "In that way, desire and the desirous one are not established as co-existent or not co-existent. Like desire, all phenomena are not established as co-existent or not co-existent.",
      quantum: "Measurement problem: systems don't have definite states until measured, paralleling non-establishment."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 6: Investigation of Desire and the Desirous One - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 6 of Mūlamadhyamakakārikā examining desire and the desirous one through Madhyamaka and quantum physics" />
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
              <a href="/Ch6/index.html" className={styles.visualizeButton}>
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
                href={`/Ch6/index.html#verse-${verse.number}`}
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