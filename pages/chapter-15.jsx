import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter15() {
  // Add useEffect to handle script loading
  useEffect(() => {
    // Don't try to load scripts during SSR
    if (typeof window === 'undefined') return;
    
    // Check if we need to redirect to the standalone HTML page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('verse')) {
      const verseId = urlParams.get('verse');
      window.location.href = `/Ch15/index.html?verse=${verseId}`;
    }
  }, []);

  // Chapter information
  const chapterInfo = {
    number: 15,
    title: "Investigation of Essence",
    verseCount: 11,
    summary: "In this chapter, Nāgārjuna examines the concept of essence (svabhāva) and demonstrates that it cannot arise from causes and conditions, as anything that arises dependently lacks inherent existence. He shows that without essence, relational identities also collapse, leading to the conclusion that all phenomena are empty of inherent existence.",
    quantumSummary: "The quantum parallels include wave function collapse, the indistinguishability of identical particles, quantum entanglement, superposition, particle creation and annihilation, and the conservation of quantum information—all of which challenge classical notions of fixed, inherent properties and highlight the relational, non-inherent nature of reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Essence and Causes",
      summary: "Nāgārjuna argues that essence, by definition, is intrinsic and independent. If it arises from causes, it is dependent and fabricated, contradicting its definition.",
      quantum: "Wave function collapse shows that properties are determined upon measurement, not inherent, similar to essences being 'made' rather than intrinsic."
    },
    {
      number: 2,
      title: "Fabricated Essence",
      summary: "The notion of a fabricated essence is incoherent because essences are supposed to be uncontrived and independent.",
      quantum: "Identical particles in quantum mechanics are indistinguishable, lacking unique properties, suggesting no inherent essence."
    },
    {
      number: 3,
      title: "Relational Identity",
      summary: "Without inherent essence, relational identities also collapse, as they depend on the notion of essence.",
      quantum: "Quantum entanglement demonstrates that particles' states are interdependent, not inherent, showing how properties are relational rather than intrinsic."
    },
    {
      number: 4,
      title: "Emptiness",
      summary: "Without essence or relational identity, things lack inherent establishment; they are empty of inherent existence.",
      quantum: "Quantum systems in superposition do not have definite properties until measured, similar to lacking inherent essence, highlighting the dependent nature of properties."
    },
    {
      number: 5,
      title: "Non-things",
      summary: "Without inherent things, the concept of non-things also does not hold. Change implies impermanence, not inherent existence.",
      quantum: "Particle creation and annihilation show that particles are not permanent; they can come into and out of existence, challenging the notion of fixed essence."
    },
    {
      number: 6,
      title: "The Other",
      summary: "Without inherent essence, the concept of 'the other' lacks basis; all designations are relative and dependent.",
      quantum: "Entangled particles' properties are defined relationally, not independently, demonstrating how quantum reality is fundamentally relational."
    },
    {
      number: 7,
      title: "Middle Way",
      summary: "The Middle Way avoids the extremes of existence and non-existence, advocating for dependent origination and emptiness.",
      quantum: "Superposition in quantum mechanics allows states that are neither definitively one nor the other, avoiding extremes and paralleling the Middle Way."
    },
    {
      number: 8,
      title: "Impermanence",
      summary: "If things had inherent essence, they would be permanent and unchanging, but since they change, they lack essence.",
      quantum: "Radioactive decay illustrates that particles can transform, indicating they lack a fixed essence and highlighting the impermanent nature of quantum entities."
    },
    {
      number: 9,
      title: "Impossibility of Change",
      summary: "Both the existence and non-existence of essences lead to the impossibility of change, yet change occurs, implying emptiness.",
      quantum: "Quantum particles lack definite trajectories, suggesting they do not have a fixed essence over time, challenging classical notions of continuous identity."
    },
    {
      number: 10,
      title: "Avoiding Extremes",
      summary: "The wise avoid the extremes of eternalism and nihilism, understanding the Middle Way of dependent origination.",
      quantum: "Superposition embodies states that are beyond binary existence or non-existence, providing a quantum parallel to the Middle Way."
    },
    {
      number: 11,
      title: "Eternalism and Nihilism",
      summary: "This verse explains the extremes of eternalism and nihilism, both of which are rejected in favor of the Middle Way.",
      quantum: "The conservation of quantum information indicates that while states transform, the information persists, avoiding both permanence and annihilation."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 15: Investigation of Essence - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 15 of Mūlamadhyamakakārikā examining the nature of essence through Madhyamaka and quantum physics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Don't try to load ES modules directly in Next.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle direct navigation to verses
              document.addEventListener('DOMContentLoaded', function() {
                const verseLinks = document.querySelectorAll('a[href^="/Ch15/index.html"]');
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
              <a href="/Ch15/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch15/index.html?verse=${verse.number}`}>
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