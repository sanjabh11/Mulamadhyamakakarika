import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter20() {
  // Chapter information
  const chapterInfo = {
    number: 20,
    title: "Investigation of Aggregation",
    verseCount: 24,
    summary: "This chapter examines the nature of aggregations and collections, showing that wholes cannot be established as inherently existent apart from their parts. Nāgārjuna demonstrates the emptiness of aggregation by analyzing the relationship between parts and wholes.",
    quantumSummary: "The quantum parallels include entanglement, superposition, and quantum field theory, demonstrating how quantum physics similarly challenges our conventional understanding of objects as distinct and independent entities."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Form and Aggregation",
      summary: "If form arose from the aggregation of the four great elements, and those elements are each separate entities, then form would arise from what is not form.",
      quantum: "Quantum Field Theory: Particles emerge from underlying fields that are not themselves particles."
    },
    {
      number: 2,
      title: "Impossibility of Inherent Aggregation",
      summary: "If apart from the aggregation of the four great elements there is no form, form would not be perceived as an object of cognition.",
      quantum: "Wave-Particle Duality: Objects have no inherent form outside of measurement and observation."
    },
    {
      number: 3,
      title: "Knowledge and the Known",
      summary: "Knowledge is dependent on a knowable object, without a knowable object there is no knowledge. Therefore why isn't it understood that a knowable object and knowledge are without self-nature?",
      quantum: "Observer Effect: The observer and observed cannot be separated, each defining the other."
    },
    {
      number: 4,
      title: "Causation Without Self-Nature",
      summary: "Self-nature of things does not exist in conditions and so on. If there is no self-nature, how can there be other-nature?",
      quantum: "Quantum Contextuality: Properties emerge only in relation to measurement choices, not intrinsically."
    },
    {
      number: 5,
      title: "The Illusion of Identity",
      summary: "If entities depended on other-nature, entities would be like illusions or mirages. How could their self-nature be dependent on others?",
      quantum: "Quantum Entanglement: Particles defined only by relationships, not independent properties."
    },
    {
      number: 6,
      title: "Mutual Dependency",
      summary: "Without dependence on self-nature or other-nature, how can entities exist? If entities exist, they must have self-nature and other-nature.",
      quantum: "Quantum Coherence: Systems exist as interrelated wholes, not independent parts."
    },
    {
      number: 7,
      title: "Existence and Non-existence",
      summary: "A non-existent entity does not exist with either self-nature or other-nature. Therefore, entities are neither existent nor non-existent.",
      quantum: "Quantum Superposition: Particles exist in multiple states simultaneously, transcending binary existence."
    },
    {
      number: 8,
      title: "Reality Beyond Categories",
      summary: "Those who perceive self-nature, other-nature, entities, and non-entities do not perceive the truth in the Buddha's teaching.",
      quantum: "Quantum Complementarity: Reality transcends classical categories, requiring multiple perspectives."
    },
    {
      number: 9,
      title: "Buddha's Teaching on Emptiness",
      summary: "In the Katyayana Sutra, the Blessed One, who understands existence and non-existence, refuted both the views that 'it exists' and 'it does not exist'.",
      quantum: "Quantum Indeterminacy: Reality exists beyond the binary of existence and non-existence."
    },
    {
      number: 10,
      title: "Inherent Existence Fallacy",
      summary: "If there were self-nature, things would exist without causes and conditions. Now, without self-nature, how could there be 'other-nature'?",
      quantum: "Quantum Fluctuations: Particles arise from vacuum without prior cause, challenging causality."
    },
    {
      number: 11,
      title: "Problems with Self and Other",
      summary: "If not established by self-nature or by other-nature, how are entities established? If established, it must be both or neither.",
      quantum: "Quantum Non-locality: Particles influence each other instantaneously across space, transcending self/other distinctions."
    },
    {
      number: 12,
      title: "Different Interpretations",
      summary: "To say 'it exists' is to grasp at permanence. To say 'it does not exist' is to adopt the view of annihilation. Therefore, the wise should not rely on either existence or non-existence.",
      quantum: "Copenhagen Interpretation: Quantum reality involves probabilities, not definite states before measurement."
    },
    {
      number: 13,
      title: "What Has Self-Nature",
      summary: "What has self-nature is not something produced and not dependent on another. But nowadays, there is nothing that is not dependently arisen.",
      quantum: "Quantum Decoherence: All quantum states inevitably interact with environment, nothing exists independently."
    },
    {
      number: 14,
      title: "Self-Nature Inconsistency",
      summary: "If there is nothing that has self-nature, how could there be anything with other-nature? Self-nature of other-nature is called other-nature.",
      quantum: "Relational Quantum Mechanics: Properties exist only in relation to other systems, not independently."
    },
    {
      number: 15,
      title: "Without Self or Other",
      summary: "Apart from that with self-nature and that with other-nature, what entities are there? If there are self-nature and other-nature, entities would be established.",
      quantum: "Quantum Emergence: Macroscopic properties emerge from underlying quantum relationships, not inherent properties."
    },
    {
      number: 16,
      title: "Entities and Non-Entities",
      summary: "If entities are not established, non-entities are not established. People say that an entity that has become different is a non-entity.",
      quantum: "Quantum Superposition Collapse: States exist as probabilities until measurement forces a particular outcome."
    },
    {
      number: 17,
      title: "Self-Nature Immutability",
      summary: "If self-nature is a feature of entities, how could it not exist now? Self-nature is not subject to change.",
      quantum: "Conservation Laws: Certain quantum properties remain invariant despite transformations."
    },
    {
      number: 18,
      title: "The Problem of Change",
      summary: "How could self-nature be something that has changed? If self-nature were something different, it would contradict the concept of self-nature.",
      quantum: "Quantum State Evolution: Wavefunctions evolve deterministically until measurement, challenging notions of change."
    },
    {
      number: 19,
      title: "The Stability of Self-Nature",
      summary: "How would there be self-nature that is different from itself? If there is no different self-nature, how could a self-nature from before remain?",
      quantum: "Unitary Evolution: Quantum systems evolve while maintaining certain invariant properties."
    },
    {
      number: 20,
      title: "Affirming Non-Existence",
      summary: "To say that entities with self-nature do not exist is to affirm entities without self-nature, which is contradictory.",
      quantum: "Uncertainty Principle: Definite properties cannot be simultaneously affirmed, only probability distributions."
    },
    {
      number: 21,
      title: "Neither Self-Nature Nor Non-Entity",
      summary: "Entities neither have self-nature nor are they non-entities. There is neither self-nature nor the absence of self-nature.",
      quantum: "Quantum Wholeness: Reality exists as an undivided whole, beyond the categories we impose."
    },
    {
      number: 22,
      title: "Seeing Reality Beyond Views",
      summary: "Those who see self-nature, other-nature, entities, and non-entities do not see the truth of the Buddha's teaching.",
      quantum: "Multiple Quantum Interpretations: No single framework completely captures quantum reality."
    },
    {
      number: 23,
      title: "Buddha's Teaching of Emptiness",
      summary: "The Buddha, through understanding dependent arising, taught the elimination of views about existence and non-existence.",
      quantum: "Quantum Contextuality: Properties emerge only in specific experimental contexts, not absolutely."
    },
    {
      number: 24,
      title: "The Middle Way",
      summary: "Since all dharmas are empty of inherent existence, the Buddha taught dependent arising as the middle way between extremes of existence and non-existence.",
      quantum: "Quantum Field Theory: Reality consists of fields of probabilities, not determinate objects or pure nothingness."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 20: Investigation of Aggregation - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 20 of Mūlamadhyamakakārikā examining aggregation through Madhyamaka and quantum physics" />
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
              <a href="/Ch20 (1:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/Ch20 (2:2)/index.html" className={styles.visualizeButton}>
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
                      <Link href={`/Ch20 (1:2)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number >= 13 && verse.number <= 24 && (
                      <Link href={`/Ch20 (2:2)/index.html#verse-${verse.number}`}>
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