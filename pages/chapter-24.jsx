import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter24() {
  // Chapter information
  const chapterInfo = {
    number: 24,
    title: "Investigation of the Four Noble Truths",
    verseCount: 40,
    summary: "This chapter examines the nature of the Four Noble Truths and how they relate to emptiness (śūnyatā). Nāgārjuna demonstrates that the Four Noble Truths can only be properly understood through the lens of emptiness, and emptiness itself is comprehensible only through dependent origination.",
    quantumSummary: "The quantum parallels include quantum measurement problem, non-locality, and contextuality, showing how quantum physics similarly challenges our conventional understanding of reality while providing a framework for comprehending apparent contradictions."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Rejecting Emptiness",
      summary: "If all this is empty, there is no arising nor passing away. From the relinquishing or cessation of what does one expect nirvāṇa to result?",
      quantum: "Quantum Vacuum: Even in 'empty' space, quantum fields fluctuate with real physical consequences, challenging the notion of true emptiness."
    },
    {
      number: 2,
      title: "Emptiness and the Four Truths",
      summary: "If all this is not empty, there is no arising nor passing away. From the relinquishing or cessation of what does one expect nirvāṇa to result?",
      quantum: "Wave Function Collapse: Without the emptiness of superposition, there would be no possibility of quantum measurement and definite properties."
    },
    {
      number: 3,
      title: "Nirvāṇa Without Attainment",
      summary: "Unrelinquished, unattained, unannihilated, non-permanent, unarisen, and unceased, this is how nirvāṇa is described.",
      quantum: "Quantum Ground State: The lowest energy state of a quantum system that is neither created nor destroyed, yet maintains its quantum nature."
    },
    {
      number: 4,
      title: "Nirvāṇa as Non-Thing",
      summary: "Nirvāṇa is not a thing. If it were, it would have the characteristics of aging and death. There is no thing without aging and death.",
      quantum: "Quantum Vacuum Energy: The zero-point energy state isn't a 'thing' with determinate properties, yet underlies all physical phenomena."
    },
    {
      number: 5,
      title: "Nirvāṇa Not a Non-Thing",
      summary: "If nirvāṇa is not a thing, how could it be a non-thing? Where there is no thing, there is also no non-thing.",
      quantum: "Quantum Complementarity: Reality transcends the categories of thing/non-thing, just as quantum objects transcend wave/particle duality."
    },
    {
      number: 6,
      title: "Nirvāṇa Not Attained",
      summary: "If nirvāṇa were attained, it would be dependent on something or someone. Nothing dependent like that exists anywhere.",
      quantum: "Quantum Entanglement: States must be considered as whole systems rather than independently attained properties of separate objects."
    },
    {
      number: 7,
      title: "No Cessation in Nirvāṇa",
      summary: "If there is no thing and no non-thing, what would be ceased in nirvāṇa? To call something ceased without prior existence is not reasonable.",
      quantum: "Quantum State Evolution: Quantum systems don't 'cease' in the conventional sense but transform according to unitary evolution."
    },
    {
      number: 8,
      title: "Nirvāṇa Neither Existence Nor Non-existence",
      summary: "If nirvāṇa exists intrinsically, why is it not dependent? Nothing exists that is not dependent on something else.",
      quantum: "Quantum Fields: Even the 'vacuum' state depends on field configurations; true independent existence is nowhere found in quantum systems."
    },
    {
      number: 9,
      title: "Dependent Arising and the Two Truths",
      summary: "What is dependently arisen, that is explained to be emptiness. That is dependent designation. That itself is the middle path.",
      quantum: "Quantum Measurement: Outcomes depend on the measuring apparatus, showing properties emerge from relationships rather than existing inherently."
    },
    {
      number: 10,
      title: "Universal Dependent Arising",
      summary: "There is no phenomenon that does not arise dependently. Therefore, there is no phenomenon that is not empty.",
      quantum: "Quantum Field Theory: All particles are excitations of interrelated fields, none existing independently of quantum interactions."
    },
    {
      number: 11,
      title: "Emptiness Misunderstood",
      summary: "If emptiness is rejected, nothing is accomplished. The person who denies emptiness is incapable of any accomplishment.",
      quantum: "Quantum Mechanics Interpretations: Rejecting the probabilistic, relational nature of quantum theory makes it impossible to explain experimental results."
    },
    {
      number: 12,
      title: "Misattributing Emptiness",
      summary: "You attribute your own confusion to emptiness, not seeing emptiness or its purpose.",
      quantum: "Observer Effect: Misattributing quantum indeterminacy to measurement errors rather than fundamental uncertainty reflects similar confusion."
    },
    {
      number: 13,
      title: "Emptiness Properly Understood",
      summary: "The Buddha's teaching of the Dharma depends on two truths: conventional truth and ultimate truth.",
      quantum: "Wave-Particle Duality: Quantum objects manifest differently depending on measurement context, revealing multiple, complementary truths."
    },
    {
      number: 14,
      title: "The Limits of Teaching",
      summary: "Without relying on convention, the ultimate cannot be taught. Without understanding the ultimate, nirvāṇa cannot be attained.",
      quantum: "Quantum Descriptions: Classical language (convention) is necessary to communicate quantum phenomena, even though it can't fully capture quantum reality."
    },
    {
      number: 15,
      title: "Misperceiving Emptiness",
      summary: "Emptiness misunderstood is like grasping a snake incorrectly or misapplying a spell—it destroys the one who misunderstands it.",
      quantum: "Quantum Applications: Misunderstanding quantum principles leads to failed technologies; proper understanding enables quantum computing."
    },
    {
      number: 16,
      title: "The Buddha's Hesitation",
      summary: "The Buddha was reluctant to teach the profound, subtle doctrine, knowing how difficult it would be for others to comprehend.",
      quantum: "Quantum Interpretation Debates: The counterintuitive nature of quantum theory caused even its founders to question its implications."
    },
    {
      number: 17,
      title: "Emptiness and Non-Identity",
      summary: "Emptiness shows the non-identity of arising and ceasing, of samsara and nirvana. These are neither the same nor different.",
      quantum: "Quantum Superposition: A quantum system is neither exclusively in one state nor another before measurement, transcending classical identity."
    },
    {
      number: 18,
      title: "The Limit of Existence",
      summary: "Whatever is the limit of nirvāṇa, that is the limit of saṃsāra. There is not even the slightest difference between the two.",
      quantum: "Quantum Vacuum: The boundary between particles and 'empty' space dissolves at the quantum level, showing their fundamental non-difference."
    },
    {
      number: 19,
      title: "Beyond Views of Permanence",
      summary: "Views about the finitude or infinitude of the world, its permanence or impermanence, are all based on reifying nirvāṇa, the end, and the beginning.",
      quantum: "Quantum Indeterminacy: Quantum reality resists definitive statements about position/momentum, showing the limitations of deterministic views."
    },
    {
      number: 20,
      title: "Emptiness as Peace",
      summary: "When all phenomena are empty, what is finite or infinite, both or neither? What is identical or different, coming or going?",
      quantum: "Quantum Wholeness: Quantum systems resist fragmentation into isolated parts with definite properties, showing the peace of non-reification."
    },
    {
      number: 21,
      title: "Self-Existence and Emptiness",
      summary: "For one who holds the view of self-existence, permanence, impermanence, and other such views inevitably follow.",
      quantum: "Quantum Contextuality: Insisting that quantum objects have intrinsic properties leads to contradictions and paradoxes."
    },
    {
      number: 22,
      title: "Emptiness as the Antidote",
      summary: "The Buddha taught emptiness as the relinquishing of all views. Those who hold emptiness as a view are declared to be incurable.",
      quantum: "Quantum Epistemology: Quantum theory doesn't present a 'view' of reality but a framework for understanding relationships and probabilities."
    },
    {
      number: 23,
      title: "The Four Noble Truths",
      summary: "How can the Four Noble Truths exist for one to whom emptiness does not make sense? How can the Four Fruits be attained by one attached to intrinsic existence?",
      quantum: "Quantum Measurement Problem: Without accepting the emptiness of definite pre-measurement properties, quantum results remain inexplicable."
    },
    {
      number: 24,
      title: "Fruits Without Attainment",
      summary: "For one who does not accept emptiness, there is no attainment. How could there be non-attainment for one who does not adhere to emptiness?",
      quantum: "Quantum State Preparation: Quantum systems can't be 'attained' in specific states with certainty due to their fundamentally empty, probabilistic nature."
    },
    {
      number: 25,
      title: "The Sangha Without Path",
      summary: "If attachment to self-existence persists, there is no Eightfold Path and no Four Fruits. How then can there be those who have attained the Fruits?",
      quantum: "Quantum Logic: If we insist on classical either/or logic, the both/and nature of quantum superposition becomes inexplicable."
    },
    {
      number: 26,
      title: "The Four Fruits Without Attainers",
      summary: "The Four Fruits cannot exist for one who rejects emptiness. Therefore, there can be no Eight Types of Holy Beings.",
      quantum: "Quantum Coherence: The fragile, relationship-based quantum states mirror the emptiness of independent attainment."
    },
    {
      number: 27,
      title: "No Dharma Without Buddha",
      summary: "If there are no Eight Types of Holy Beings, there can be no Sangha. Without the Four Noble Truths, there can be no true Dharma.",
      quantum: "Quantum Foundations: Without accepting the foundational principles of quantum theory, its manifestations remain incomprehensible."
    },
    {
      number: 28,
      title: "No Buddha Without Enlightenment",
      summary: "If there is no Dharma and no Sangha, how can there be a Buddha? If emptiness is rejected, there is no Buddha, Dharma, or Sangha.",
      quantum: "Quantum Universe: Rejecting quantum principles would mean rejecting the fundamental nature of reality itself."
    },
    {
      number: 29,
      title: "Emptiness and Self-Existence",
      summary: "One who explains through emptiness is astute in all things. One who rejects emptiness achieves nothing.",
      quantum: "Quantum Technology: The technological wonders of quantum computing work precisely because quantum emptiness is embraced, not rejected."
    },
    {
      number: 30,
      title: "Ultimate and Conventional",
      summary: "Samsara and nirvana are neither different nor the same. The ultimate truth is not separate from everyday truth.",
      quantum: "Quantum Classical Limit: Quantum and classical realms are neither completely separate nor identical, showing the inseparability of the conventional and ultimate."
    },
    {
      number: 31,
      title: "Emptiness and Buddha's Teaching",
      summary: "Without understanding emptiness as the antidote to all conflicting emotions and views, the Buddha would not have taught it.",
      quantum: "Uncertainty Principle: The emptiness of simultaneous precise position and momentum provides the antidote to classical deterministic thinking."
    },
    {
      number: 32,
      title: "Samsara and Nirvana",
      summary: "If the Buddha had taught the true existence of even a single phenomenon, he could be criticized, but he taught the emptiness of all phenomena.",
      quantum: "Quantum Fields: Even seemingly stable particles are ultimately empty of inherent existence, being excitations of underlying fields."
    },
    {
      number: 33,
      title: "False Attribution",
      summary: "There is no fault in emptiness. There is no logical inconsistency in emptiness. Those who see problems in emptiness are projecting their own confusion.",
      quantum: "Quantum Paradoxes: The apparent paradoxes in quantum mechanics arise from applying classical concepts inappropriately, not from quantum theory itself."
    },
    {
      number: 34,
      title: "Emptiness and Causality",
      summary: "If you see intrinsic existence in things, you see things as without causes and conditions, negating effects, agent, instrument, action, and activation.",
      quantum: "Quantum Causality: Quantum events don't follow classical causality but exist in probabilistic networks of relationships."
    },
    {
      number: 35,
      title: "All Dharmas Established",
      summary: "If emptiness is established, all dharmas are established. If emptiness is not established, all dharmas are not established.",
      quantum: "Quantum Reality: The emptiness of deterministic properties enables the manifestation of quantum phenomena in their conditional, probabilistic way."
    },
    {
      number: 36,
      title: "Attributing One's Faults",
      summary: "One who rejects emptiness attributes their own faults to emptiness. This is like mounting a horse and forgetting one is riding it.",
      quantum: "Quantum Measurement Paradox: Scientists sometimes forget they're part of the observation process, attributing problems to quantum theory rather than their classical expectations."
    },
    {
      number: 37,
      title: "Imputed Contradictions",
      summary: "If all things were non-empty, there would be no arising or ceasing, and the Four Noble Truths would not make sense.",
      quantum: "Quantum Information: Without the emptiness of superposition, quantum information processing would be impossible."
    },
    {
      number: 38,
      title: "Dependent Arising and Emptiness",
      summary: "If phenomena are dependent on causes and conditions, they are empty. If they were non-empty, dependent arising would not apply.",
      quantum: "Quantum Entanglement: The properties of entangled particles depend entirely on their relationships, not on intrinsic qualities."
    },
    {
      number: 39,
      title: "Emptiness Makes Possible",
      summary: "If phenomena were not empty, nothing could arise or cease. The Four Noble Truths would be impossible.",
      quantum: "Quantum Transitions: The emptiness of definite states before measurement allows for the quantum jumps we observe in experiments."
    },
    {
      number: 40,
      title: "The Perfection of Understanding",
      summary: "One who sees dependent arising sees the Four Noble Truths, suffering, its origin, its cessation, and the path.",
      quantum: "Quantum Coherence: Understanding how quantum states maintain coherence through their emptiness enables us to see how they function as whole systems."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 24: Investigation of the Four Noble Truths - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 24 of Mūlamadhyamakakārikā examining the Four Noble Truths through Madhyamaka and quantum physics" />
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
              <a href="/Ch24 (1:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/Ch24 (2:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 2)
              </a>
              <a href="/Ch24 (3:3)/index.html" className={styles.visualizeButton}>
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
                    {verse.number <= 13 && (
                      <Link href={`/Ch24 (1:3)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number >= 14 && verse.number <= 27 && (
                      <Link href={`/Ch24 (2:3)/index.html#verse-${verse.number}`}>
                        View in Part 2
                      </Link>
                    )}
                    {verse.number >= 28 && verse.number <= 40 && (
                      <Link href={`/Ch24 (3:3)/index.html#verse-${verse.number}`}>
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