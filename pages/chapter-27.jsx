import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter27() {
  // Chapter information
  const chapterInfo = {
    number: 27,
    title: "Investigation of Views",
    verseCount: 30,
    summary: "This chapter examines the nature of views (dṛṣṭi) about the self and the world. Nāgārjuna analyzes various metaphysical positions about the past, present, and future, showing that all fixed views about reality are ultimately incoherent when subjected to logical analysis.",
    quantumSummary: "The quantum parallels include complementarity, uncertainty principle, and quantum measurement, showing how quantum physics similarly challenges our ability to form fixed, consistent views about fundamental reality."
  };

  // Verse summary data for quick navigation
  const verses = [
    {
      number: 1,
      title: "Views About the Past",
      summary: "The views 'I existed in the past' or 'I did not exist in the past' presuppose a fixed, inherently existent self that can be affirmed or denied.",
      quantum: "Quantum History: Past quantum states aren't definite trajectories but probability distributions, challenging views of determinate past existence."
    },
    {
      number: 2,
      title: "Eternal Self View",
      summary: "If one believes 'I existed in the past,' this implies an eternal self that has always existed, unchanging through time.",
      quantum: "Quantum Evolution: Quantum systems evolve continuously, never maintaining exactly the same state across time, challenging notions of unchanging identity."
    },
    {
      number: 3,
      title: "Different Self View",
      summary: "If one believes the self now is entirely different from the past self, this breaks continuity and implies no connection between past and present selves.",
      quantum: "Quantum Teleportation: Information transfers between quantum systems while changing states, showing continuity despite transformation."
    },
    {
      number: 4,
      title: "Partial Identity View",
      summary: "If one believes the self is partly the same and partly different from the past self, both problems of eternalism and annihilationism apply to the respective parts.",
      quantum: "Quantum Decoherence: Systems maintain some aspects while losing others through environmental interaction, showing neither complete preservation nor complete change."
    },
    {
      number: 5,
      title: "Permanent Self Contradiction",
      summary: "A permanent self would be uncaused and unchanging, contradicting the observable fact that all experienced phenomena are subject to change.",
      quantum: "Quantum Superposition: Pure quantum states can't remain unchanged due to inevitable interaction with environment, showing impossibility of permanent identity."
    },
    {
      number: 6,
      title: "Separate Self Impossibility",
      summary: "If the present self were completely separate from the past self, a person could be born without prior causes and conditions, which contradicts observation.",
      quantum: "Quantum Causality: Even quantum indeterminacy follows probability distributions based on prior conditions; nothing emerges without antecedent factors."
    },
    {
      number: 7,
      title: "Identity and Difference Impossibility",
      summary: "A self cannot be both identical to and different from its past self, as these are contradictory properties that cannot simultaneously apply.",
      quantum: "Wave-Particle Duality: Quantum objects exhibit seemingly contradictory properties depending on measurement context, transcending classical identity."
    },
    {
      number: 8,
      title: "Neither Identity Nor Difference",
      summary: "If the self is neither identical to nor different from its past self, then it lacks any coherent relationship to the past, making continuity impossible.",
      quantum: "Quantum Interpretations: Different frameworks for understanding quantum reality all struggle with explaining continuity without fixed identity."
    },
    {
      number: 9,
      title: "Views About the Future",
      summary: "The views 'I will exist in the future' or 'I will not exist in the future' presuppose an inherently existent self that can be affirmed or denied.",
      quantum: "Quantum Prediction: Future quantum states can only be described probabilistically, not with certainty, undermining definite views about future existence."
    },
    {
      number: 10,
      title: "Self in Future Lives",
      summary: "If one believes in a self that transmigrates from this life to future lives unchanged, this contradicts the dependently arisen nature of all phenomena.",
      quantum: "Quantum No-Cloning: Perfect copying of quantum states is impossible, showing the fundamental challenge to continuity of exact identity across transformations."
    },
    {
      number: 11,
      title: "Views About the Present",
      summary: "The view 'I exist in the present' presupposes an inherently existent self that can be identified and grasped, which contradicts emptiness.",
      quantum: "Quantum Measurement: Current properties only exist in relation to specific measurements, not as inherent observer-independent qualities."
    },
    {
      number: 12,
      title: "Self-Existence",
      summary: "If the self existed inherently, it would not depend on the five aggregates, but no self can be found apart from the aggregates.",
      quantum: "Quantum Wholeness: Quantum states can't be reduced to independent properties existing separately from their measurement context."
    },
    {
      number: 13,
      title: "Self and Aggregates Relationship",
      summary: "The self cannot be identical to the aggregates (which are multiple and changing) nor different from them (since it would then be unconditioned).",
      quantum: "Quantum Entanglement: Entangled particles aren't separable into independent elements nor identical to each other, showing a middle way between identity and difference."
    },
    {
      number: 14,
      title: "Self Without Basis",
      summary: "Without the five aggregates as a basis, there can be no self. Without a self, there can be no ownership or possession of the aggregates.",
      quantum: "Quantum Contextuality: Properties emerge only in specific experimental arrangements, not as pre-existing features inherent to quantum systems."
    },
    {
      number: 15,
      title: "Non-Self Understanding",
      summary: "The self is not the same as the aggregates nor different from them. It neither possesses them nor is possessed by them. This is the understanding of non-self.",
      quantum: "Copenhagen Interpretation: Quantum objects don't have definite properties before measurement, transcending conventional notions of identity and difference."
    },
    {
      number: 16,
      title: "Past and Future Selves",
      summary: "If the self is empty in the present, how could it exist inherently in the past or future? Past and future selves are equally empty.",
      quantum: "Quantum Time Evolution: Past, present, and future quantum states are all equally described by probability functions, not fixed entities."
    },
    {
      number: 17,
      title: "Self and Identity Views",
      summary: "Once the view of 'I am' has been relinquished, all appropriation of aggregates and attachment to identity ceases.",
      quantum: "Quantum Reference Frames: The observer's frame of reference determines the description of quantum phenomena, not an absolute, observer-independent reality."
    },
    {
      number: 18,
      title: "The Buddha's Silence",
      summary: "The Buddha remained silent on questions about whether the self and world are eternal or finite, recognizing that such views presuppose inherent existence.",
      quantum: "Quantum Incompleteness: Some questions about quantum reality cannot be answered within the framework of quantum theory itself."
    },
    {
      number: 19,
      title: "The Limits of Views",
      summary: "All views about the self and world depend on reification of inherently existent entities, but such entities cannot withstand logical analysis.",
      quantum: "Quantum Interpretation Debates: Different ways of interpreting quantum theory all struggle with the fundamental limits of what can be coherently stated about reality."
    },
    {
      number: 20,
      title: "Cyclic Existence",
      summary: "If saṃsāra had a beginning or end, these could be perceived. But no beginning or end can be found through analysis.",
      quantum: "Quantum Cosmology: Quantum models of the universe suggest spacetime itself emerges from quantum fluctuations, with no definite beginning point."
    },
    {
      number: 21,
      title: "No Beginning or End",
      summary: "Without beginning or end, how could there be a middle? The notions of prior, subsequent, and simultaneous all break down under analysis.",
      quantum: "Quantum Non-locality: The ordinary notions of spatial and temporal sequence break down at the quantum level, where correlations exist without classical causal order."
    },
    {
      number: 22,
      title: "Conceptual Dependence",
      summary: "If phenomena had intrinsic nature, they would not arise and cease dependently. Without dependent arising, permanence and impermanence make no sense.",
      quantum: "Quantum Contextuality: Quantum properties exist only in relation to measurement choices, not as intrinsic features independent of context."
    },
    {
      number: 23,
      title: "Emptiness of Views",
      summary: "All views—permanence, impermanence, finitude, infinitude—presuppose intrinsic existence. When emptiness is understood, these views are abandoned.",
      quantum: "Quantum Framework: Quantum theory provides a consistent framework for predictions without requiring definitive statements about the intrinsic nature of reality."
    },
    {
      number: 24,
      title: "Buddha's Teaching Method",
      summary: "The Buddha taught different doctrines to different people based on their capacity to understand, skillfully guiding them toward the ultimate truth of emptiness.",
      quantum: "Bohr's Correspondence Principle: Quantum physics agrees with classical physics at large scales, providing a skillful bridge between frameworks."
    },
    {
      number: 25,
      title: "Peace of Emptiness",
      summary: "When all proliferation of concepts ceases, what can be asserted or denied? In the peace of emptiness, all views are stilled.",
      quantum: "Quantum Silence: Some aspects of quantum reality remain inherently unarticulable in ordinary language, requiring a kind of conceptual silence."
    },
    {
      number: 26,
      title: "Nirvāṇa Beyond Views",
      summary: "Nirvāṇa is the cessation of all views and conceptual proliferation. It is not itself a view or position to be grasped.",
      quantum: "Quantum Complementarity: Complete quantum description requires seemingly contradictory frameworks, transcending any single comprehensive view."
    },
    {
      number: 27,
      title: "Emptiness Not a View",
      summary: "Emptiness itself is not a view to be clung to. It is the relinquishing of all views and the cessation of conceptual proliferation.",
      quantum: "Quantum Probability: Quantum theory provides a framework for calculating probabilities without definitive statements about 'what really exists.'"
    },
    {
      number: 28,
      title: "Buddha's Great Compassion",
      summary: "The Buddha, out of great compassion, taught the Dharma to liberate beings from suffering caused by their clinging to views.",
      quantum: "Quantum Frameworks: Scientists develop frameworks that work practically while suspending ultimate metaphysical claims, showing similar pragmatic wisdom."
    },
    {
      number: 29,
      title: "Homage to the Buddha",
      summary: "Nāgārjuna offers homage to Gautama, the Buddha, who taught dependent arising and the peaceful cessation of all conceptual fabrications.",
      quantum: "Quantum Pioneers: The founders of quantum theory courageously abandoned classical certainties for a more profound, if unsettling, picture of reality."
    },
    {
      number: 30,
      title: "Conclusion",
      summary: "All fixed views are abandoned in the understanding of emptiness, which is not itself a view but the cessation of views. This is the peace of nirvāṇa.",
      quantum: "Quantum Humility: Quantum theory ultimately teaches us the limits of human conceptualization, pointing toward a reality that transcends our categories."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Chapter 27: Investigation of Views - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Chapter 27 of Mūlamadhyamakakārikā examining views through Madhyamaka and quantum physics" />
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
              <a href="/Ch 27 (1:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1)
              </a>
              <a href="/Ch27 (2:3)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 2)
              </a>
              <a href="/Ch 27 (3:3)/index.html" className={styles.visualizeButton}>
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
                    {verse.number <= 10 && (
                      <Link href={`/Ch 27 (1:3)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number > 10 && verse.number <= 20 && (
                      <Link href={`/Ch27 (2:3)/index.html#verse-${verse.number}`}>
                        View in Part 2
                      </Link>
                    )}
                    {verse.number > 20 && verse.number <= 30 && (
                      <Link href={`/Ch 27 (3:3)/index.html#verse-${verse.number}`}>
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