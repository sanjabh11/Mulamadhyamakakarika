import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter23() {
  // Chapter information
  const chapterInfo = {
    number: 23,
    title: "Investigation of Errors",
    verseCount: 24,
    summary: "This chapter examines the nature of conceptual errors (viparyāsa) and how they arise from misapprehending reality. Nāgārjuna analyzes how our cognitive mistakes lead to false views about permanence, satisfaction, self, and purity, showing that these errors ultimately stem from the fundamental ignorance of emptiness.",
    quantumSummary: "The quantum parallels include measurement error, observer effect, and the limits of classical epistemology, demonstrating how quantum physics similarly challenges our conventional understanding of objectivity and knowledge."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Origin of Error",
      summary: "Errors arise from misconceiving the nature of phenomena, mistaking the impermanent for permanent, the painful for pleasant, the non-self for self, and the impure for pure.",
      quantum: "Measurement Uncertainty: Quantum measurement inevitably introduces uncertainty, showing how error is intrinsic to observation itself."
    },
    {
      number: 2,
      title: "Four Distortions",
      summary: "The four fundamental distortions—seeing permanence in the impermanent, satisfaction in suffering, self in the selfless, and purity in the impure—are the root of cognitive error.",
      quantum: "Quantum Interpretations: Different interpretations of quantum mechanics reveal how our conceptual frameworks inevitably distort our understanding of quantum reality."
    },
    {
      number: 3,
      title: "Permanence Error",
      summary: "When we attribute permanence to what is impermanent, we create a conceptual fiction that does not correspond to reality, leading to attachment and suffering.",
      quantum: "Quantum Fluctuations: Even apparently stable quantum states are constantly fluctuating, revealing the error in attributing permanence to quantum objects."
    },
    {
      number: 4,
      title: "Satisfaction Error",
      summary: "When we attribute satisfaction to what is inherently unsatisfactory, we create a conceptual fiction that does not correspond to reality, leading to craving and suffering.",
      quantum: "Quantum Indeterminism: The inherent indeterminism of quantum phenomena reveals the error in expecting complete predictability and control."
    },
    {
      number: 5,
      title: "Self Error",
      summary: "When we attribute selfhood to what is without self, we create a conceptual fiction that does not correspond to reality, leading to egoism and suffering.",
      quantum: "Quantum Holism: Quantum entanglement demonstrates the impossibility of isolating truly independent 'self-contained' systems."
    },
    {
      number: 6,
      title: "Purity Error",
      summary: "When we attribute purity to what is impure, we create a conceptual fiction that does not correspond to reality, leading to inappropriate desire and suffering.",
      quantum: "Quantum Vacuum: The quantum vacuum constantly seethes with virtual particles, showing that even 'empty' space is not pure nothingness."
    },
    {
      number: 7,
      title: "Conceptual Distortion",
      summary: "These errors do not exist inherently but arise from conceptual distortion, which itself depends on the ignorance of emptiness.",
      quantum: "Observer Effect: The observer inevitably disturbs quantum systems, revealing how measurement itself introduces conceptual distortion."
    },
    {
      number: 8,
      title: "Errors and Emptiness",
      summary: "When emptiness is understood, these errors disappear, for they cannot exist in the light of the understanding of dependent origination.",
      quantum: "Quantum Contextuality: Quantum properties emerge only in specific experimental contexts, showing how apparent contradictions dissolve with proper understanding."
    },
    {
      number: 9,
      title: "Errors and Ignorance",
      summary: "Errors arise from ignorance, which projects inherent existence onto phenomena that are empty of such existence.",
      quantum: "Classical Approximation: The classical picture of reality is merely an approximation that breaks down at the quantum level, revealing our everyday understanding as fundamentally limited."
    },
    {
      number: 10,
      title: "Errors and Conditions",
      summary: "Errors arise dependently, not inherently. They depend on specific cognitive conditions, just as optical illusions depend on specific perceptual conditions.",
      quantum: "Quantum Decoherence: Apparent classical behavior emerges from quantum systems through interaction with the environment, showing how our classical intuitions arise conditionally."
    },
    {
      number: 11,
      title: "Empty Nature of Errors",
      summary: "Errors themselves are empty of inherent existence. They are neither identical to nor different from the mind that experiences them.",
      quantum: "Wave-Particle Duality: Quantum objects manifest as waves or particles depending on measurement, showing how apparent contradictions can coexist without inherent nature."
    },
    {
      number: 12,
      title: "Errors and Liberation",
      summary: "Understanding the empty nature of errors is itself liberation, for it releases us from the grip of conceptual proliferation.",
      quantum: "Quantum Probability: Embracing quantum indeterminism liberates physics from classical determinism, paralleling how understanding emptiness liberates the mind."
    },
    {
      number: 13,
      title: "Errors in Perceiving Objects",
      summary: "Objects perceived through error appear to have independent existence, but analysis reveals they lack the intrinsic nature attributed to them.",
      quantum: "Quantum Measurement Problem: Quantum objects don't possess definite properties before measurement, showing the error in assuming pre-existing objective attributes."
    },
    {
      number: 14,
      title: "Errors in Perceiving Subjects",
      summary: "Subjects perceived through error appear to have independent existence, but analysis reveals they lack the intrinsic nature attributed to them.",
      quantum: "Quantum Observer: The observer cannot be separated from the observed in quantum mechanics, undermining the notion of an independent subject."
    },
    {
      number: 15,
      title: "Neither Object Nor Subject",
      summary: "Without the error of perceiving inherent existence, neither object nor subject can be established as independently real.",
      quantum: "Quantum Complementarity: Objects manifest different properties depending on the measurement context, transcending the simple subject-object divide."
    },
    {
      number: 16,
      title: "Errors and Language",
      summary: "Linguistic conventions can reinforce conceptual errors when we mistake words and concepts for the reality they merely indicate.",
      quantum: "Quantum Description: Classical language is inherently limited in describing quantum phenomena, showing how conventional expression can mislead."
    },
    {
      number: 17,
      title: "Conventional and Ultimate",
      summary: "Errors function at the conventional level but dissolve under ultimate analysis, showing the two truths are neither identical nor different.",
      quantum: "Copenhagen Interpretation: Quantum phenomena require both classical and quantum descriptions, showing how different levels of truth complement each other."
    },
    {
      number: 18,
      title: "Error and Investigation",
      summary: "The mind that investigates errors is itself subject to error unless it recognizes its own empty nature.",
      quantum: "Quantum Self-Reference: The scientist studying quantum systems is also composed of quantum particles, creating a self-referential loop of analysis."
    },
    {
      number: 19,
      title: "Dissolution of Errors",
      summary: "When errors are seen as empty, they naturally dissolve, not through forceful suppression but through clear understanding.",
      quantum: "Quantum Coherence: When a quantum system is left undisturbed, it naturally maintains coherence; similarly, understanding dissolves errors without force."
    },
    {
      number: 20,
      title: "Emptiness of Understanding",
      summary: "Even the understanding that dispels errors is itself empty of inherent existence, arising dependently like all phenomena.",
      quantum: "Quantum Knowledge: Scientific knowledge of quantum systems is itself probabilistic and dependent on specific experimental arrangements."
    },
    {
      number: 21,
      title: "No Separate Liberation",
      summary: "There is no separate liberation from errors, for the very notion of a separate liberated state is itself an error stemming from reification.",
      quantum: "Quantum Wholeness: Quantum systems can't be understood as collections of separate parts but must be approached as integrated wholes."
    },
    {
      number: 22,
      title: "Error and Emptiness",
      summary: "Seeing the emptiness of errors is itself the antidote to error, for emptiness undermines the substantial existence that error attributes.",
      quantum: "Quantum Framework: Quantum theory provides a framework for predictions without requiring definitive statements about 'what really exists.'"
    },
    {
      number: 23,
      title: "Error and Non-Error",
      summary: "From the ultimate perspective, there is neither error nor non-error, for both concepts depend on the reification of mental states.",
      quantum: "Quantum Beyond Binary: Quantum logic transcends classical binary logic, allowing for states that are neither definitely one thing nor definitely another."
    },
    {
      number: 24,
      title: "Freedom from Error",
      summary: "Freedom from all conceptual proliferation, including the concept of error itself, is the peace of emptiness.",
      quantum: "Quantum Silence: Some aspects of quantum reality remain inherently unarticulable in ordinary language, requiring a kind of conceptual silence."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 23: Investigation of Errors - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 23 of Mūlamadhyamakakārikā examining errors through Madhyamaka and quantum physics" />
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
              <a href="/Ch23 (1:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/ch23_part2/index.html" className={styles.visualizeButton}>
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
                  {chapterInfo.number}.{verse.number}
                </div>
                <div className={styles.verseContent}>
                  <h3>{verse.title}</h3>
                  <div className={styles.verseSummaries}>
                    <p><strong>Madhyamaka:</strong> {verse.summary}</p>
                    <p><strong>Quantum:</strong> {verse.quantum}</p>
                  </div>
                  <div className={styles.verseLinks}>
                    {verse.number <= 12 && (
                      <Link href={`/Ch23 (1:2)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number > 12 && verse.number <= 24 && (
                      <Link href={`/ch23_part2/index.html#verse-${verse.number}`}>
                        View in Part 2
                      </Link>
                    )}
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