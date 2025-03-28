import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter5() {
  // Chapter information
  const chapterInfo = {
    number: 5,
    title: "Examination of Elements",
    verseCount: 8,
    summary: "This chapter investigates the nature of the fundamental elements (dhātu) that constitute reality. Nāgārjuna examines the paradoxes in our understanding of basic elements, demonstrating that they lack inherent existence and arise in mutual dependence. He begins with an analysis of space as a fundamental element, showing that it cannot be characterized independently of its characteristics, then extends this analysis to all elements and their relationships. Through this examination, Nāgārjuna reveals that what we perceive as solid, independent elements are actually empty of inherent existence and exist only in relation to other phenomena.",
    quantumSummary: "The quantum parallels include quantum field theory, particle-wave duality, and the fundamental nature of matter as excitations in fields. Modern physics has revealed that seemingly solid particles are actually manifestations of underlying quantum fields, with no fixed, inherent properties. The quantum vacuum, once thought to be empty space, teems with virtual particles and energy fluctuations. These discoveries align remarkably with Nāgārjuna's analysis from nearly two millennia ago, showing how both traditions challenge our conventional understanding of fundamental elements and point to a more interconnected, relational reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Space and Its Characteristics",
      summary: "Space cannot be characterized as an entity, as it lacks defining characteristics of its own",
      quantum: "Quantum field theory shows space as a dynamic medium rather than an empty container",
      deepExplanation: "Nagarjuna argues that space cannot exist as an independent entity apart from its characteristics (e.g., boundaries, dimensions). This reflects the Madhyamaka principle of dependent origination: phenomena lack inherent existence and are defined by their relationships. Similarly, in quantum physics, wave-particle duality shows that light's nature (wave or particle) depends on how it's observed, not on a fixed essence. Both systems challenge the notion of standalone entities, pointing to a relational reality.",
      analogy: "Think of a room in your house. Without walls, a floor, or a ceiling, it's just an idea—there's no 'room' to step into. In the same way, space needs its 'walls' (characteristics) to be meaningful, and light in quantum physics needs observation to take shape."
    },
    {
      number: 2,
      title: "Entities and Characteristics",
      summary: "If space were characterized by its characteristics, it would need to exist prior to them, which is impossible",
      quantum: "Quantum vacuum fluctuations demonstrate that 'empty' space contains energy and virtual particles",
      deepExplanation: "Nagarjuna asserts that entities (e.g., objects) and their characteristics (e.g., shape, color) are mutually interdependent—neither can exist without the other. This interdependence reveals their emptiness of inherent existence. In quantum physics, contextuality demonstrates that a particle's properties, like spin, emerge from the measurement context, not from an innate quality. Both perspectives emphasize that reality is a web of relationships, not isolated parts.",
      analogy: "Picture a chair. Its shape, color, and material define it as a chair—but take the chair away, and those traits disappear too. Likewise, in quantum physics, a particle's spin only 'exists' when measured in a specific way."
    },
    {
      number: 3,
      title: "Arising of Characteristics",
      summary: "Space without characteristics cannot be perceived or conceptualized, thus does not exist as an entity",
      quantum: "Quantum entanglement shows space-like separation doesn't prevent quantum correlation",
      deepExplanation: "Using the tetralemma, Nagarjuna argues that characteristics don't arise independently—they neither come from nothing nor preexist in some inherent form. This underscores their relational, empty nature. In quantum physics, the collapse of the wave function shows that a particle's state (e.g., position) isn't fixed until measured, emerging from interaction rather than a predetermined essence. Both systems highlight that properties are born from context.",
      analogy: "Imagine a blurry photo on your phone. It's unclear until you adjust the focus, and then it snaps into view. Similarly, a quantum particle's position is vague until observed, and in philosophy, characteristics take shape through relationships."
    },
    {
      number: 4,
      title: "Mutual Dependence",
      summary: "If space lacks characteristics, how can it be characterized? It cannot be an object of knowledge",
      quantum: "Quantum non-locality challenges our conventional understanding of spatial separation",
      deepExplanation: "Nagarjuna emphasizes that objects and their characteristics rely on each other for definition, neither standing alone. This mutual dependence is central to the concept of emptiness. In quantum physics, measurement not only reveals a particle's state but also shapes it, showing a reciprocal relationship. Both frameworks reject independent existence, pointing to a reality defined by interplay.",
      analogy: "Think of a mirror and your reflection. Without the mirror, there's no reflection; without the reflection, the mirror's role fades. In quantum physics, measuring a particle defines both the particle and the outcome, just like that."
    },
    {
      number: 5,
      title: "No Independent Entities",
      summary: "The elements (earth, water, fire, air) are conceptual designations without inherent existence",
      quantum: "Quantum field theory shows particles as excitations of underlying fields rather than solid entities",
      deepExplanation: "Nagarjuna concludes that because objects and characteristics are interdependent, there are no truly independent entities—everything exists within a network of relationships. In quantum field theory, particles are seen as excitations of underlying fields, not isolated objects. Both Madhyamaka and quantum physics suggest reality is a seamless whole, with no separate 'things.'",
      analogy: "Picture the ocean in your mind. Waves aren't separate from the water—they're part of it, rising and falling. Similarly, particles in quantum physics are ripples in a field, and in philosophy, objects are defined by their connections."
    },
    {
      number: 6,
      title: "Existence and Nonexistence",
      summary: "Elements cannot exist independently; they are defined through their relationships with other elements",
      quantum: "Particle interactions in quantum field theory show how particles transform and interact",
      deepExplanation: "Nagarjuna critiques the binary concepts of existence and nonexistence, showing they depend on each other and lack inherent meaning. In quantum physics, superposition allows a particle to exist in multiple states simultaneously, defying simple 'is' or 'isn't' labels. Both systems propose that reality transcends fixed categories, existing in a fluid state of potential.",
      analogy: "Think of a coin spinning in the air. It's not heads or tails until it lands. In quantum physics, a particle can be in multiple states until observed, and in philosophy, existence and nonexistence shift depending on perspective."
    },
    {
      number: 7,
      title: "The Nature of Space",
      summary: "Form (rūpa) is neither identical to nor different from the elements that constitute it",
      quantum: "Wave-particle duality shows matter has no fixed, inherent nature as either particle or wave",
      deepExplanation: "Nagarjuna argues that space is neither a solid entity nor a complete nonentity—it's empty of inherent nature. In quantum physics, the quantum vacuum reveals that 'empty' space teems with virtual particles and energy fluctuations. Both views portray space as a dynamic, relational medium rather than a static backdrop.",
      analogy: "Imagine a quiet room at night. It seems empty, but it's alive with tiny sounds—like creaks or whispers. In quantum physics, space buzzes with unseen activity, much like that 'empty' room."
    },
    {
      number: 8,
      title: "Transcending Objectification",
      summary: "Consciousness arises in dependence on elements but is neither identical to nor separate from them",
      quantum: "Quantum measurement problem shows consciousness and physical systems have a complex relationship",
      deepExplanation: "Nagarjuna warns against clinging to existence or nonexistence, as such views distort reality's true nature. In quantum physics, the measurement problem shows that quantum phenomena resist being pinned down objectively. Both systems encourage letting go of dualistic labels to grasp a deeper, interconnected truth.",
      analogy: "Trying to catch mist with your hands is futile—it slips through. Similarly, in quantum physics, pinning down a particle's exact state is tricky, and in philosophy, clinging to 'is' or 'isn't' misses the bigger picture."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 5: Examination of Elements - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 5 of Mūlamadhyamakakārikā examining the elements through Madhyamaka and quantum physics" />
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
              <a href="/Ch5/index.html" className={styles.visualizeButton}>
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
                href={`/Ch5/index.html#verse-${verse.number}`}
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
                    <div className={styles.expandableContent}>
                      <details>
                        <summary>Deepened Explanation</summary>
                        <p>{verse.deepExplanation}</p>
                      </details>
                      <details>
                        <summary>Simplified Analogy</summary>
                        <p>{verse.analogy}</p>
                      </details>
                    </div>
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