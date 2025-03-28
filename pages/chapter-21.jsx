import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter21() {
  // Chapter information
  const chapterInfo = {
    number: 21,
    title: "Investigation of Arising and Dissolution",
    verseCount: 21,
    summary: "This chapter examines the nature of arising and dissolution, showing that neither can be established as inherently existent. Nāgārjuna demonstrates that arising and passing away are neither identical to nor different from entities, revealing the emptiness of all phenomena.",
    quantumSummary: "The quantum parallels include wave function collapse, quantum field theory's vacuum fluctuations, and the uncertainty principle, illustrating how quantum physics similarly challenges our conventional understanding of how things come into and go out of existence."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Dissolution Without Arising",
      summary: "Dissolution does not occur without arising. There would be death without birth. How is dissolution without arising possible?",
      quantum: "Conservation Laws: In quantum systems, particles cannot simply vanish; they transform while conserving energy and other quantum numbers."
    },
    {
      number: 2,
      title: "Dissolution With Arising",
      summary: "How would dissolution occur with arising? Birth and death do not occur simultaneously, like presence and absence together.",
      quantum: "Wave Function Collapse: A quantum state doesn't simultaneously exist in multiple states during measurement—transition is discrete, not simultaneous."
    },
    {
      number: 3,
      title: "Dissolution Identical to Arising",
      summary: "How would dissolution be identical to arising? Like birth and death, these are contradictory states that cannot be the same.",
      quantum: "Quantum Tunneling: Particles appear to transition between states without existing in intermediate states, challenging classical notions of change."
    },
    {
      number: 4,
      title: "Finitude of Phenomena",
      summary: "How would there be finitude of all things? The finitude of all things is not established, in reality or conventionally.",
      quantum: "Quantum Field Fluctuations: The vacuum is never truly empty but filled with particles constantly arising and dissolving, challenging finitude."
    },
    {
      number: 5,
      title: "Arising Without Dissolution",
      summary: "How would there be arising without dissolution? Impermanence is never absent from things.",
      quantum: "Quantum Decay: Excited states inevitably decay to lower energy states without external intervention, demonstrating inherent impermanence."
    },
    {
      number: 6,
      title: "Arising and Dissolution Relationship",
      summary: "How would arising and dissolution occur together? Like birth and death, they do not occur simultaneously in a single entity.",
      quantum: "Heisenberg's Uncertainty: Precise energy and time measurements cannot coexist, making exact moments of transition fundamentally indeterminate."
    },
    {
      number: 7,
      title: "Arising From Conditions",
      summary: "How can there be dissolution of what is arising from conditions? How can there be dissolution of what is appearing like an illusion?",
      quantum: "Quantum Decoherence: Quantum states appear to emerge and dissolve through interaction with environment rather than through inherent existence."
    },
    {
      number: 8,
      title: "Non-Arising and Non-Dissolution",
      summary: "What is neither arising nor existent, how does it dissolve? Like an illusory person, it neither truly arises nor truly dissolves.",
      quantum: "Virtual Particles: In quantum field theory, particles fleetingly appear and disappear without fully manifesting, challenging notions of definite existence."
    },
    {
      number: 9,
      title: "Entity and Dissolution",
      summary: "An entity and dissolution cannot logically be established together. The cessation of an entity is what is called dissolution.",
      quantum: "Wave-Particle Duality: An object cannot simultaneously manifest as both a definite particle and a spread-out wave during measurement."
    },
    {
      number: 10,
      title: "Inherent Existence and Dissolution",
      summary: "Things without inherent existence, how do they dissolve? It is like the cessation of an illusion that had no real existence to begin with.",
      quantum: "Measurement Problem: Quantum objects don't have definite properties before measurement, so their 'dissolution' doesn't remove inherent properties."
    },
    {
      number: 11,
      title: "Arising Without Entity",
      summary: "There cannot be arising without an entity, nor can there be an entity without arising. These cannot logically exist independently.",
      quantum: "Quantum Field Excitations: Particles are excitations of underlying fields, not independent entities separate from their manifestation."
    },
    {
      number: 12,
      title: "Dissolution Without Entity",
      summary: "Dissolution cannot occur without an entity, nor can an entity exist without the potential for dissolution. These are interdependent concepts.",
      quantum: "Quantum Instability: Even seemingly stable particles have finite lifetimes; dissolution is inherent to quantum existence."
    },
    {
      number: 13,
      title: "Dissolution With Non-Empty Entity",
      summary: "How can dissolution occur with a non-empty entity? Just as permanent entities are not observed, neither are empty ones.",
      quantum: "Observer Effect: Quantum systems are fundamentally altered through observation, so we never observe inherently existent states."
    },
    {
      number: 14,
      title: "Entity With Inherent Existence",
      summary: "An entity with inherent existence could never become non-existent, as inherent nature means unchanging essence. But this contradicts observation.",
      quantum: "Conservation Laws: Quantum numbers can't be destroyed, only transformed, suggesting nothing with inherent properties can truly cease."
    },
    {
      number: 15,
      title: "Entity With Dissolution",
      summary: "An entity at the time of arising is not the same as during dissolution; these are different states that cannot logically coexist.",
      quantum: "Quantum State Evolution: A quantum system evolves according to precise equations, never existing in contradictory states simultaneously."
    },
    {
      number: 16,
      title: "Inherent Non-Existence",
      summary: "If entities were inherently non-existent, they would be like sky-flowers, fundamentally unreal and unable to undergo arising or dissolution.",
      quantum: "Quantum Vacuum: The 'empty' vacuum contains fluctuating fields with real physical effects, showing nothing is inherently non-existent."
    },
    {
      number: 17,
      title: "Entity and Non-Entity",
      summary: "An entity cannot become a non-entity, as these states are contradictory. A non-entity cannot become an entity for the same reason.",
      quantum: "Superposition: Quantum objects exist in multiple states simultaneously until measured, transcending the entity/non-entity distinction."
    },
    {
      number: 18,
      title: "Arising and Dissolution as Processes",
      summary: "Arising is not a process with inherent existence, nor is dissolution. They are merely conventional designations empty of essence.",
      quantum: "Quantum Transitions: State changes occur in discrete jumps rather than continuous processes, challenging conventional notions of arising."
    },
    {
      number: 19,
      title: "Identity and Difference",
      summary: "Arising and dissolution cannot be identical, nor can they be entirely different. This would lead to logical contradictions in both cases.",
      quantum: "Quantum Complementarity: Systems exhibit properties that appear contradictory but are actually complementary aspects of a whole."
    },
    {
      number: 20,
      title: "Conventional Existence",
      summary: "If arising and dissolution existed inherently, they would be either identical or different. Since neither position is tenable, they lack inherent existence.",
      quantum: "Quantum Contextuality: Properties emerge only in relation to specific measurements, not as inherent, context-independent features."
    },
    {
      number: 21,
      title: "Dependent Origination",
      summary: "Since arising and dissolution are empty of inherent existence, all phenomena that depend on them are also empty, arising dependently.",
      quantum: "Quantum Entanglement: Particles exist only in relation to each other, not as independent entities with inherent properties."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 21: Investigation of Arising and Dissolution - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 21 of Mūlamadhyamakakārikā examining arising and dissolution through Madhyamaka and quantum physics" />
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
              <a href="/Ch21 (1:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/Ch21 (2:2)/index.html" className={styles.visualizeButton}>
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
                    {verse.number <= 10 && (
                      <Link href={`/Ch21 (1:2)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number >= 11 && verse.number <= 21 && (
                      <Link href={`/Ch21 (2:2)/index.html#verse-${verse.number}`}>
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