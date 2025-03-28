import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter16() {
  // Add useEffect to handle script loading
  useEffect(() => {
    // Don't try to load scripts during SSR
    if (typeof window === 'undefined') return;
    
    // Check if we need to redirect to the standalone HTML page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('verse')) {
      const verseId = urlParams.get('verse');
      window.location.href = `/Ch16/index.html?verse=${verseId}`;
    }
  }, []);

  // Chapter information
  const chapterInfo = {
    number: 16,
    title: "Investigation of Bondage and Freedom",
    verseCount: 10,
    summary: "In this chapter, Nāgārjuna examines the concepts of bondage and freedom in samsara, demonstrating that neither can be established as inherently existent. He shows that samsara itself is empty of inherent existence, and that the distinction between bondage and freedom is merely conventional, not ultimate.",
    quantumSummary: "The quantum parallels include superposition, entanglement, the measurement problem, the uncertainty principle, quantum indeterminacy, wave function collapse, the quantum Zeno effect, and quantum contextuality—all of which challenge classical notions of determinism and highlight the relational, non-inherent nature of reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Emptiness of Samsara",
      summary: "Nāgārjuna argues that samsara is neither permanent nor impermanent, neither coming nor going, using the tetralemma to show its emptiness.",
      quantum: "Superposition in quantum mechanics shows how particles can exist in multiple states simultaneously until measured, similar to samsara's indeterminate nature."
    },
    {
      number: 2,
      title: "No-self Doctrine",
      summary: "The person is dependent on the aggregates, with no inherent self that transmigrates or is bound in samsara.",
      quantum: "Quantum entanglement demonstrates how particles can be interconnected without having independent existence, paralleling the no-self doctrine."
    },
    {
      number: 3,
      title: "Emptiness of Clinging",
      summary: "Clinging and becoming are empty of inherent existence, with no inherent entity that clings or becomes.",
      quantum: "The measurement problem in quantum physics shows how observation determines state, similar to how clinging creates the appearance of a self."
    },
    {
      number: 4,
      title: "Inherent Constraints in Samsara",
      summary: "If samsara had inherent existence, liberation would be impossible, as inherent characteristics cannot be changed.",
      quantum: "The uncertainty principle demonstrates inherent limits in simultaneously knowing complementary properties, reflecting constraints in samsara."
    },
    {
      number: 5,
      title: "Emptiness of Bondage and Freedom",
      summary: "Nāgārjuna shows that one is neither inherently bound nor inherently free, as both concepts lack inherent existence.",
      quantum: "Quantum indeterminacy shows how particles exist in states that are neither definitively one way nor another until measured."
    },
    {
      number: 6,
      title: "Ambiguity of Subject-Object",
      summary: "The relationship between the one who clings and that which is clung to is ambiguous, as both are empty of inherent existence.",
      quantum: "Wave function collapse illustrates how measurement creates a definite state from ambiguity, blurring the line between observer and observed."
    },
    {
      number: 7,
      title: "Interdependence Without Temporal Precedence",
      summary: "Binding and the bound arise interdependently, without one preceding the other temporally.",
      quantum: "Quantum entanglement shows how particles can be correlated instantaneously regardless of distance, without temporal precedence."
    },
    {
      number: 8,
      title: "Paradox of Bondage and Freedom",
      summary: "The paradox of bondage and freedom is resolved through understanding their emptiness of inherent existence.",
      quantum: "Superposition demonstrates how quantum systems can exist in multiple states simultaneously, transcending binary distinctions."
    },
    {
      number: 9,
      title: "Grasping at Non-grasping",
      summary: "Even attachment to non-attachment is a form of grasping that perpetuates samsara.",
      quantum: "The quantum Zeno effect shows how frequent measurement can freeze a particle's state, similar to how focusing on non-attachment can become a new form of attachment."
    },
    {
      number: 10,
      title: "Conventional Nature of Samsara and Nirvana",
      summary: "Samsara and nirvana are conventionally distinct but ultimately empty, dependent on perspective rather than inherent existence.",
      quantum: "Quantum contextuality demonstrates how measurement outcomes depend on the context of measurement, similar to how samsara and nirvana depend on perspective."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 16: Investigation of Bondage and Freedom - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 16 of Mūlamadhyamakakārikā examining the nature of bondage and freedom through Madhyamaka and quantum physics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Don't try to load ES modules directly in Next.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle direct navigation to verses
              document.addEventListener('DOMContentLoaded', function() {
                const verseLinks = document.querySelectorAll('a[href^="/Ch16/index.html"]');
                verseLinks.forEach(link => {
                  link.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = this.getAttribute('href');
                  });
                });
              });
            `,
          }}
        />
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
              <a href="/Ch16/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch16/index.html?verse=${verse.number}`}>
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