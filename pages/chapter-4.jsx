import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter4() {
  // Chapter information
  const chapterInfo = {
    number: 4,
    title: "Emptiness and Quantum Physics",
    verseCount: 9,
    summary: "This chapter explores the profound relationship between form and its causes, demonstrating that neither can exist independently of the other. Nāgārjuna shows that form cannot exist without its causes, and causes cannot be causes without producing their effects.",
    quantumSummary: "The quantum parallels include wave-particle duality, wave function collapse, superposition, and quantum field theory, illustrating how modern physics similarly challenges our conventional understanding of objects and their properties."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Interdependence of Form and Cause",
      summary: "Apart from the cause of form, form is not perceived. Apart from 'form', the cause of form also does not appear.",
      quantum: "Wave-particle duality: properties depend on measurement, mirroring form's cause reliance."
    },
    {
      number: 2,
      title: "Form Cannot Exist Without Cause",
      summary: "If there were form apart from the cause of form, it would follow that form is without cause; there is no object at all that is without cause.",
      quantum: "Definite properties exist only upon measurement, paralleling need for causes in Madhyamaka."
    },
    {
      number: 3,
      title: "Cause Cannot Exist Without Effect",
      summary: "If a cause of form existed apart from form, it would exist as a cause without fruit; causes without fruit do not exist.",
      quantum: "Force defined by producing acceleration; without motion, no force, mirroring cause-effect need."
    },
    {
      number: 4,
      title: "Paradox of Causation",
      summary: "If form existed, a cause of form would be untenable; if form did not exist, a cause of form would be untenable.",
      quantum: "Definite states emerge upon measurement; before, in superposition, mirroring interdependence."
    },
    {
      number: 5,
      title: "Rejecting Inherent Existence of Form",
      summary: "Forms which do not have a cause are not at all tenable. Therefore, do not conceive the concept of form at all.",
      quantum: "Particles lack definite properties until measured, don't conceive as inherently existing."
    },
    {
      number: 6,
      title: "Similarity and Difference",
      summary: "It is untenable to say, 'the fruit is like the cause.' It is also untenable to say, 'the fruit is unlike the cause.'",
      quantum: "Complementarity: particles exhibit wave/particle behaviors, defying 'like' or 'unlike' categorization."
    },
    {
      number: 7,
      title: "Universal Emptiness",
      summary: "Feeling and perception, impulses and mind and all things are comparable in every aspect, at every stage with form.",
      quantum: "All particles are field excitations, governed by similar quantum principles, paralleling emptiness."
    },
    {
      number: 8,
      title: "Objections to Emptiness",
      summary: "When having argued by means of emptiness, everything of that one who objects is not an objection; it is similar to what is to be established.",
      quantum: "Classical descriptions lead to paradoxes, resolved by quantum principles, mirroring objections."
    },
    {
      number: 9,
      title: "Faults with Emptiness",
      summary: "When having explained by means of emptiness, everything of that one who finds fault is not a fault; it is similar to what is to be established.",
      quantum: "Criticisms based on classical intuition fail, supporting quantum theory, paralleling faults."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 4: Emptiness and Quantum Physics - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 4 of Mūlamadhyamakakārikā examining emptiness through Madhyamaka and quantum physics" />
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
              <a href="/ch4/index.html" className={styles.visualizeButton}>
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
                href={`/ch4/index.html#verse-${verse.number}`}
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