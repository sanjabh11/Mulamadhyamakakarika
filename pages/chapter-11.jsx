import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter11() {
  // Chapter information
  const chapterInfo = {
    number: 11,
    title: "Investigation of Extremes of Before and After",
    verseCount: 8,
    summary: "In this chapter, Nāgārjuna examines the concepts of temporal extremes—the beginning and end of existence—and demonstrates that samsara (cyclic existence) has no inherent beginning or end. He shows that birth, aging, and death cannot be established as having fixed temporal relationships, challenging our conventional understanding of time and causality.",
    quantumSummary: "The quantum parallels include phenomena like vacuum fluctuations, the Wheeler-DeWitt equation's timelessness, quantum contextuality, and the observer effect—all of which challenge classical notions of fixed temporal sequences and highlight the relational nature of reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Beginningless Samsara",
      summary: "Nāgārjuna rejects the notion of temporal extremes in samsara, arguing it has no inherent beginning or end. A starting point would imply an uncaused cause, which contradicts dependent origination.",
      quantum: "Quantum vacuum fluctuations exemplify this, as particles spontaneously emerge and vanish in empty space without a definitive origin, reflecting dynamic emptiness without a fixed starting point."
    },
    {
      number: 2,
      title: "No Middle Without Extremes",
      summary: "Without a beginning or end, samsara cannot have a definable middle, dismantling the idea of distinct temporal phases. This reinforces time's lack of inherent existence, a core Madhyamaka principle.",
      quantum: "The Wheeler-DeWitt equation in quantum gravity suggests time isn't fundamental but emerges from other factors, aligning with the verse's rejection of fixed temporal stages."
    },
    {
      number: 3,
      title: "Birth Before Death",
      summary: "Positing birth before death leads to absurdities: birth without death defies their interdependence. This exposes the flaws in assuming fixed temporal order, emphasizing emptiness.",
      quantum: "In quantum field theory, pair production ties creation (birth) to annihilation (death)—one can't occur without the other's potential, showing processes are linked, not isolated."
    },
    {
      number: 4,
      title: "Death Before Birth",
      summary: "Death preceding birth is illogical, as death presupposes something to die—birth. This contradiction highlights their interdependence and the emptiness of independent temporal events.",
      quantum: "Quantum mechanics requires preparation before measurement; reversing this order is nonsensical, akin to death before birth, reflecting causality's importance."
    },
    {
      number: 5,
      title: "Simultaneous Birth and Death",
      summary: "Simultaneous birth and death create a paradox: a thing being born can't die at the same instant, as each requires distinct causes, underscoring their non-simultaneous, dependent nature.",
      quantum: "In quantum mechanics, an electron can't absorb and emit a photon at once—these are separate transitions, highlighting the mutual exclusivity of certain processes."
    },
    {
      number: 6,
      title: "Beyond Temporal Fixation",
      summary: "Obsessing over birth and death's timing is pointless, as they resist categorization into before, after, or together. These phenomena are conventionally real but empty of inherent existence.",
      quantum: "Quantum contextuality reveals a particle's properties depend on how they're measured, not fixed traits, emphasizing relational nature over inherent essence."
    },
    {
      number: 7,
      title: "Universal Lack of Beginning",
      summary: "The absence of a before-extreme extends beyond samsara to causes, effects, attributes, and their foundations—all lack inherent beginnings, broadening emptiness to all phenomena.",
      quantum: "Relational quantum mechanics posits that properties emerge from interactions, not independently, mirroring the verse's view that causes and effects are relative, not standalone."
    },
    {
      number: 8,
      title: "Feeling and Feeler",
      summary: "Feelings, the feeler, and all phenomena lack a beginning or inherent essence, being dependently originated. This challenges an independent self or mind, aligning with emptiness.",
      quantum: "The observer effect in quantum mechanics ties the observed to the observer—measuring a particle alters it, suggesting reality and consciousness intertwine, reflecting interdependence."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 11: Investigation of Extremes of Before and After - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 11 of Mūlamadhyamakakārikā examining temporal extremes through Madhyamaka and quantum physics" />
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
              <a href="/Ch11/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch11/index.html?verse=${verse.number}`}>
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