import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter17() {
  // Chapter information
  const chapterInfo = {
    number: 17,
    title: "Investigation of Birth, Abiding and Perishing",
    verseCount: 33,
    summary: "This chapter examines the three characteristics of compounded phenomena: birth, abiding, and perishing. Nāgārjuna demonstrates that these characteristics cannot be established as either compounded or uncompounded, revealing the emptiness of arising and ceasing.",
    quantumSummary: "The quantum parallels include wave function collapse, superposition, uncertainty principle, and quantum tunneling, showing how quantum physics similarly challenges our conventional understanding of how things come into being and cease."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "The Dilemma of Birth",
      summary: "If birth were compounded, it would possess the three characteristics [of a compound]. If birth were uncompounded, how would it be a characteristic of a compound?",
      quantum: "Wave Function Collapse: Birth of a definite state depends on observation, not inherent properties."
    },
    {
      number: 2,
      title: "The Problem of Multiple Characteristics",
      summary: "The three such as birth cannot individually be that which characterizes compounds. How is it possible for one at one time to be compounded [of all three]?",
      quantum: "Superposition: Quantum systems can exist in multiple states, mirroring multiple interdependent characteristics."
    },
    {
      number: 3,
      title: "Infinite Regress of Characteristics",
      summary: "If birth, abiding and perishing had another characteristic of being compounded, this would be endless. If not, they would not be compounded.",
      quantum: "Heisenberg's Uncertainty Principle: Position and momentum can't be known precisely at the same time, showing indeterminacy."
    },
    {
      number: 4,
      title: "Circular Dependency in Birth",
      summary: "The birth of birth gives birth to the root birth alone. The root birth also is that which gives birth to the birth of birth.",
      quantum: "Entanglement: Correlated states without clear causal order, mirroring circular dependency in birth."
    },
    {
      number: 5,
      title: "Temporal Paradox of Birth",
      summary: "If your birth of birth gives birth to the root birth, how does that which is not yet born from your root give birth to that [root birth]?",
      quantum: "Quantum Tunneling: Particles pass through barriers, defying traditional cause and effect."
    },
    {
      number: 6,
      title: "Circularity in Causation",
      summary: "If that which is born from your root birth gives birth to the root, how does that root which is born from that give birth to that [from which it is born]?",
      quantum: "Quantum Feedback Loops: Some quantum systems have self-sustaining states, like circular dependency."
    },
    {
      number: 7,
      title: "Logical Inconsistency in Birth",
      summary: "If that which has not been born is able to give birth to that, that of yours which is being born should be able to give birth to that.",
      quantum: "Virtual Particles: Not fully real, they can influence processes, like something not born affecting birth."
    },
    {
      number: 8,
      title: "The Lamplight Analogy",
      summary: "Just as lamplight illuminates itself and others, likewise birth too gives birth to both itself and the thing of others.",
      quantum: "Photon Emission and Absorption: Photons affect both themselves and other particles, mirroring birth's dual role."
    },
    {
      number: 9,
      title: "Lamplight and Darkness",
      summary: "Wherever lamplight is present there is no darkness. How does lamplight illuminate? It illuminates by dispelling darkness.",
      quantum: "Wave Function Evolution: Probabilities change over time, like light revealing presence by dispelling darkness."
    },
    {
      number: 10,
      title: "The Paradox of Illumination",
      summary: "If, when lamplight is being generated, it does not encounter darkness, how does the generation of lamplight dispense darkness?",
      quantum: "Measurement in Quantum Mechanics: Resolves uncertainty into a definite state, needing uncertainty to work, like lamplight needing darkness."
    },
    {
      number: 11,
      title: "The Absurdity of Non-Encounter",
      summary: "If darkness is dispelled even though it does not encounter lamplight, this [lamplight] dwelling here would eliminate the darkness that dwells in all the worlds.",
      quantum: "Non-Locality in Quantum Mechanics: Actions on one particle affect another instantly, like lamplight affecting darkness universally."
    },
    {
      number: 12,
      title: "Birth and Time",
      summary: "Born and the unborn - being born does not in any way give birth. That has been explained by the gone, not gone and going.",
      quantum: "Time in Quantum Mechanics: Time isn't a fixed operator, paralleling confusion about birth timing."
    },
    {
      number: 13,
      title: "Dependency of Birth",
      summary: "When being born does not arise in what is born, then how can one say \"[it is] being born in dependence on the born\"?",
      quantum: "Spontaneous Symmetry Breaking: New properties emerge without direct cause, like birth not depending on what's born."
    },
    {
      number: 14,
      title: "Pacification of Birth",
      summary: "Whatever is dependently arising, such is by nature pacified. Therefore, being born and what is born too are pacified.",
      quantum: "Coherence and Decoherence: Coherent states are balanced until disrupted, like dependent arising leading to peace."
    },
    {
      number: 15,
      title: "Unborn Existence",
      summary: "If any unborn thing existed anywhere, upon being born that [unborn] thing would not exist. If so, what would be born?",
      quantum: "Particle Creation from Vacuum: Particles come from a vacuum that isn't a \"thing,\" like birth from no-thingness."
    },
    {
      number: 16,
      title: "Birth from the Born",
      summary: "If that which has been born gives birth to what is being born, what [other thing] that has been born would be giving birth to that which has been born?",
      quantum: "Recursive Quantum Processes: Outputs feed back into inputs, like circularity in birth."
    },
    {
      number: 17,
      title: "Endless Birth",
      summary: "If another [thing] that has been born gives birth [to it], this would be endless. If it is born without [another] which has been born [or if it is born without being born], everything would be born like that [i.e., causelessly].",
      quantum: "Uncertainty in Causation: Quantum events are probabilistic, not strictly caused, like uncertainty in birth's causes."
    },
    {
      number: 18,
      title: "Neither Existent nor Non-existent",
      summary: "Thus it is neither reasonable for what exists nor does not exist to be born. It has been shown above that there is neither existent nor non-existent.",
      quantum: "Quantum Superposition and Existence: Particles aren't fully here or there until measured, so existence isn't fixed."
    },
    {
      number: 19,
      title: "Perishing and Birth",
      summary: "It is not tenable for a thing that is perishing to be born. It is not tenable for that which is not perishing to be a thing.",
      quantum: "Half-life and Decay: Unstable particles exist briefly before decaying, reflecting impermanence."
    },
    {
      number: 20,
      title: "Impossibility of Remaining",
      summary: "A thing that has remained does not remain. A thing that has not [yet] remained does not remain. That which is remaining also does not remain. What unborn [thing] can remain?",
      quantum: "Quantum State Persistence: States persist in superposition but aren't fixed, like non-abiding."
    },
    {
      number: 21,
      title: "Perishing and Remaining",
      summary: "It is not possible for a thing that is perishing to remain. It is not possible for that which is not perishing to be a thing.",
      quantum: "Quantum Decay Rates: Particles decay over time, not staying fixed, mirroring non-permanence."
    },
    {
      number: 22,
      title: "Universal Impermanence",
      summary: "If all things at all times are aging and dying phenomena, what things are there which could remain without aging and dying?",
      quantum: "Second Law of Thermodynamics: Systems move toward disorder over time, like aging and dying."
    },
    {
      number: 23,
      title: "Remaining and Causation",
      summary: "It is not reasonable for what remains to remain due to something else that remains or due to itself. This is like how what has been born is neither given birth to by itself nor another.",
      quantum: "Quantum Entanglement: States are correlated, not caused by self or other classically."
    },
    {
      number: 24,
      title: "Cessation Paradox",
      summary: "What has ceased does not cease. What has not ceased also does not cease. Likewise what is ceasing also does not. What unborn [thing] can cease?",
      quantum: "Quantum Annihilation: Particles annihilate, but it's not a fixed end, like non-ceasing."
    },
    {
      number: 25,
      title: "Impossibility of Cessation",
      summary: "It is not possible for a thing which has remained to cease. It is also not possible for a thing which has not remained to cease.",
      quantum: "Quantum State Transitions: States shift without a fixed end, like non-ceasing."
    },
    {
      number: 26,
      title: "Cessation and States",
      summary: "A particular state [of something] does not cause that particular state itself to cease. Moreover, another particular state does not cause that particular state to cease.",
      quantum: "Quantum State Superposition: States coexist, not ending each other directly."
    },
    {
      number: 27,
      title: "Birth and Cessation",
      summary: "When the birth of all phenomena is not possible, then the cessation of all phenomena is not possible.",
      quantum: "Quantum Birth and Death: Particle creation and annihilation are linked, both empty of inherent existence."
    },
    {
      number: 28,
      title: "Cessation and Existence",
      summary: "Cessation is not possible in an existent thing. Thingness and nothingness are not possible in one.",
      quantum: "Quantum Existence: Particles exist as probabilities, not fixed, like non-cessation in existence."
    },
    {
      number: 29,
      title: "Cessation and Non-things",
      summary: "Cessation is not possible also in what is not a thing. This is similar to how there is no cutting off a second head.",
      quantum: "Quantum Vacuum: Vacuum isn't a thing, yet particles emerge and cease, like non-cessation."
    },
    {
      number: 30,
      title: "Causation of Cessation",
      summary: "Cessation does not exist by its own self, nor does cessation [exist] by something else. This is like how what has been born is neither given birth to by itself nor another.",
      quantum: "Quantum Causality: Events are probabilistic, not self- or other-caused, like cessation."
    },
    {
      number: 31,
      title: "Conditioned and Unconditioned",
      summary: "Because birth and remaining and perishing are not established, there is no conditioned. Because the conditioned is utterly unestablished, how can the unconditioned be established?",
      quantum: "Quantum Field Theory: All arises from fields, empty of inherent existence."
    },
    {
      number: 32,
      title: "Illusion of Reality",
      summary: "Like a dream, like a magician's illusion, like a city of gandharvas, likewise birth and likewise remaining, likewise perishing are taught.",
      quantum: "Simulation and Reality in Quantum Computing: Quantum states model scenarios but aren't the same, like illusions."
    },
    {
      number: 33,
      title: "Non-arising and Cessation",
      summary: "Neither arising nor ceasing, neither permanent nor impermanent, neither coming nor going, neither one nor many - such is the teaching of the Buddha.",
      quantum: "Quantum Wave-Particle Duality: Particles exhibit contradictory behaviors, transcending conventional categories."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 17: Investigation of Birth, Abiding and Perishing - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 17 of Mūlamadhyamakakārikā examining birth, abiding and perishing through Madhyamaka and quantum physics" />
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
              <a href="/Ch17 (1:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/Ch17 (2:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 2)
              </a>
              <a href="/Ch17 (3:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 3)
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
                    {verse.number <= 11 && (
                      <Link href={`/Ch17 (1:3)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number > 11 && verse.number <= 22 && (
                      <Link href={`/Ch17 (2:3)/index.html#verse-${verse.number}`}>
                        View in Part 2
                      </Link>
                    )}
                    {verse.number > 22 && verse.number <= 33 && (
                      <Link href={`/Ch17 (3:3)/index.html#verse-${verse.number}`}>
                        View in Part 3
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