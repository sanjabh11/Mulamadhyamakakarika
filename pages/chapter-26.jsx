import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter26() {
  // Chapter information
  const chapterInfo = {
    number: 26,
    title: "Investigation of the Twelve Links",
    verseCount: 12,
    summary: "This chapter examines the twelve links of dependent origination (pratītyasamutpāda), showing how the cycle of rebirth operates without a substantial self. Nāgārjuna analyzes how ignorance conditions formations, which condition consciousness, and so on through the twelve links, demonstrating that this process is empty of inherent existence.",
    quantumSummary: "The quantum parallels include quantum causality, entanglement across time, and emergent phenomena, showing how quantum physics similarly reveals a reality of interdependent processes rather than substantial entities."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "The Bound Wanderer",
      summary: "The one bound by ignorance creates the three types of conditioned formations, and through these actions, enters into various states of rebirth.",
      quantum: "Quantum Initial Conditions: In quantum physics, initial conditions constrain but don't determine future states, paralleling how ignorance conditions but doesn't fully determine the cycle of rebirth."
    },
    {
      number: 2,
      title: "Consciousness Arising",
      summary: "Consciousness arises conditioned by formations. From consciousness arise name and form, the psychophysical complex.",
      quantum: "Quantum Emergence: Complex quantum systems show emergent properties not predictable from their components, similar to how consciousness emerges dependent on formations."
    },
    {
      number: 3,
      title: "Six Sense Bases",
      summary: "From name and form arise the six sense bases. Contact arises dependent on the six sense bases.",
      quantum: "Quantum Interaction: Quantum interactions require compatible systems to manifest specific properties, just as sensory contact requires appropriate sense bases."
    },
    {
      number: 4,
      title: "Feeling from Contact",
      summary: "Dependent on contact, feeling arises. Because of feeling, craving arises. Those who crave, grasp.",
      quantum: "Quantum State Transitions: Quantum systems undergo transitions between energy states when perturbed, paralleling how contact conditions feeling and further links in the chain."
    },
    {
      number: 5,
      title: "Becoming through Grasping",
      summary: "When there is grasping, the process of becoming arises. If there were no grasping, one would be free and there would be no becoming.",
      quantum: "Quantum Probability Collapse: Quantum possibilities collapse into specific realities through interaction, similar to how grasping conditions specific forms of becoming."
    },
    {
      number: 6,
      title: "Birth from Becoming",
      summary: "From the process of becoming, the aggregates are born. Suffering, old age, disease, and death arise from birth.",
      quantum: "Quantum Decoherence: Quantum systems lose their coherent possibilities through environmental interaction, just as becoming manifests in specific birth conditions."
    },
    {
      number: 7,
      title: "Dependent Origination",
      summary: "The entire mass of suffering arises in this way. The twelve links are empty of self but create the appearance of continuous existence.",
      quantum: "Quantum Contextuality: Quantum properties exist only in relation to specific measurement contexts, showing how suffering exists dependently rather than inherently."
    },
    {
      number: 8,
      title: "Breaking the Cycle",
      summary: "When ignorance ceases, formations cease. Through the successive cessation of each link, the entire mass of suffering ceases.",
      quantum: "Quantum State Preparation: Quantum systems can be deliberately prepared in specific states, paralleling how awareness can deliberately transform the chain of dependent origination."
    },
    {
      number: 9,
      title: "No Self in the Links",
      summary: "None of the twelve links contains a self or possesses inherent existence. They are all dependently originated phenomena.",
      quantum: "Quantum Entanglement: Entangled quantum particles lack individual, independent states, showing how the links of dependent origination lack inherent separate existence."
    },
    {
      number: 10,
      title: "Emptiness of Causes",
      summary: "Causes and conditions do not have inherent existence. How could that which arises from what is empty of inherent existence not also be empty?",
      quantum: "Quantum Non-locality: Quantum correlations transcend classical cause-effect relationships, revealing a deeper interconnectedness beyond conventional causality."
    },
    {
      number: 11,
      title: "The Empty Wheel",
      summary: "The wheel of becoming is empty of inherent existence, yet it functions conventionally to produce the appearance of continuous rebirth.",
      quantum: "Quantum Field Theory: The quantum vacuum constantly produces virtual particles that affect real particles, paralleling how empty phenomena can have conventional effects."
    },
    {
      number: 12,
      title: "Liberation through Understanding",
      summary: "Understanding the empty nature of dependent origination leads to liberation from suffering. This is the path the Buddha taught.",
      quantum: "Quantum Information: Information about quantum systems can transform our ability to work with them, just as understanding emptiness transforms our relationship to suffering."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 26: Investigation of the Twelve Links - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 26 of Mūlamadhyamakakārikā examining dependent origination through Madhyamaka and quantum physics" />
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
              <a href="/Ch26/index.html" className={styles.visualizeButton}>
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
                    <Link href={`/Ch26/index.html#verse-${verse.number}`}>
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