import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter25() {
  // Chapter information
  const chapterInfo = {
    number: 25,
    title: "Investigation of Nirvana",
    verseCount: 24,
    summary: "This chapter delves into the nature of Nirvāṇa, demonstrating its transcendence of conventional categories like existence, non-existence, both, or neither. Nāgārjuna argues that Nirvāṇa, like all phenomena, is empty of inherent existence and cannot be grasped through conceptual fixation.",
    quantumSummary: "Quantum parallels explore concepts like complementarity, the observer effect, entanglement, and the quantum vacuum, highlighting how quantum mechanics also challenges fixed notions of reality, existence, and the limitations of observation, mirroring Madhyamaka's insights into emptiness and the nature of Nirvāṇa."
  };

  // Verse summary data for quick navigation
  const verses = [
    // Verses 1-12 (Content provided by user, Quantum parallels omitted)
    {
      number: 1,
      title: "Nirvana and Emptiness (1)",
      summary: "If everything were empty, there would be no arising and perishing. From the letting go of and ceasing of what could one assert nirvana(-ing)?",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 2,
      title: "Nirvana and Non-Emptiness",
      summary: "If everything were not empty, there would be no arising and perishing. From the letting go of and ceasing of what could one assert nirvana(-ing)?",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 3,
      title: "Nirvana Defined Negatively",
      summary: "No letting go, no attainment, no annihilation, no permanence, no cessation, no birth: that is spoken of as nirvana.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 4,
      title: "Nirvana Not a Thing (Aging/Death)",
      summary: "Nirvana is not a thing. Then it would follow that it would have the characteristics of aging and death. There does not exist any thing that is without aging and death.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 5,
      title: "Nirvana Not Conditioned",
      summary: "If nirvana were a thing, nirvana would be a conditioned phenomenon. There does not exist any thing anywhere that is not a conditioned phenomenon.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 6,
      title: "Nirvana Not Dependent (If a Thing)",
      summary: "If nirvana were a thing, how would nirvana not be dependent? There does not exists any thing at all that is not dependent.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 7,
      title: "Nirvana Not Nothing (If Not a Thing)",
      summary: "If nirvana were not a thing, how could it possibly be nothing? The one for whom nirvana is not a thing, for him it is not nothing.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 8,
      title: "Nirvana Not Dependent (If Nothing)",
      summary: "If nirvana were nothing, how could nirvana possibly be not dependent? There does not exist a nothing that is not dependent.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 9,
      title: "Nature Like Illusion",
      summary: "The Blessed One himself has said that things are not concrete, that beings are unborn and do not pass away, being by nature like an illusion.",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 10,
      title: "Buddha's Existence After Death (1)",
      summary: "Therefore, it is not valid to assert that the Blessed One exists after death. When the concrete is not established, how could existence be established?",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 11,
      title: "Buddha's Existence After Death (2)",
      summary: "Therefore, it is not valid to assert that the Blessed One does not exist after death. When the concrete is not established, how could non-existence be established?",
      quantum: "" // Quantum parallel not provided
    },
    {
      number: 12,
      title: "Buddha's Existence After Death (3)",
      summary: "Therefore, it is not valid to assert that the Blessed One both exists and does not exist after death. When the concrete is not established, how could both existence and non-existence be established?",
      quantum: "" // Quantum parallel not provided
    },
    // Verses 13-24 (From public/Ch25 (2:2)/config.js)
    {
        number: 13,
        title: "How could nirvāna be both a thing and nothing?",
        summary: "Nirvāņa cannot be both a thing and nothing because things are conditioned (dependently arisen) while Nirvāņa is unconditioned, highlighting a fundamental distinction in Madhyamaka.",
        quantum: "The distinction between bosons (e.g., photons, which can occupy the same state) and fermions (e.g., electrons, which cannot due to the exclusion principle) parallels the fundamental difference between conditioned phenomena and unconditioned Nirvāņa. Just as bosons like photons can pile up in the same space while fermions like electrons cannot, Nirvāņa exists in a fundamentally different way than conditioned things."
    },
    {
        number: 14,
        title: "How could nirvāna be both?",
        summary: "Nirvāņa cannot be both a thing and nothing because they are mutually exclusive, like light and dark cannot coexist in the same space, reflecting Madhyamaka's rejection of inherent contradictions.",
        quantum: "In quantum mechanics, the complementarity principle shows that properties like position and momentum cannot be measured simultaneously with precision. This is like trying to see both light and dark in the same spot - impossible. Similarly, Nirvāņa can't be both a thing and nothing simultaneously, as these are mutually exclusive categories."
    },
    {
        number: 15,
        title: "Neither a thing nor nothing as nirvāna is established if things and nothings are established.",
        summary: "The establishment of Nirvāņa as neither a thing nor nothing depends on the conventional establishment of things and nothings, which are themselves empty, emphasizing dependent origination.",
        quantum: "Quantum reference frames show how properties like velocity are relative to the observer (e.g., a moving train versus a stationary platform). What's in motion from one perspective is still from another. Similarly, categories like 'thing' and 'nothing' depend on perspective, and Nirvāņa's nature as 'neither' cannot be established without these dependent perspectives."
    },
    {
        number: 16,
        title: "If nirvāna is neither, by whom could 'neither' be perceived?",
        summary: "If Nirvāņa is neither a thing nor nothing, who can perceive this 'neither'? This questions the conventional means of perception, rooted in Madhyamaka's critique of fixed categories.",
        quantum: "The observer effect in quantum mechanics shows that measuring a system changes its state from superposition to definite. When you look at a quantum particle, you change its nature, just as trying to conceptualize Nirvāņa as 'neither' alters how we understand it. This highlights the challenge of perceiving something that defies conventional categories."
    },
    {
        number: 17,
        title: "After the Bhagavan enters nirvāna, one cannot perceive him as existing, not existing, both, or neither.",
        summary: "After the Buddha's parinirvāna, his state cannot be described as existing, not existing, both, or neither, reflecting the emptiness of all such categories, central to Madhyamaka's non-dual perspective.",
        quantum: "Quantum entanglement shows how particles can share correlated states without transmitting information faster than light. Like entangled particles that show correlated outcomes but can't send messages, the Buddha's nature after parinirvāna is connected to emptiness but cannot be described in conventional terms of existence or non-existence."
    },
    {
        number: 18,
        title: "Even when the Bhagavan is alive, one cannot perceive him as existing, not existing, both, or neither.",
        summary: "Even during his life, the Buddha's true nature cannot be captured by categories like existing, not existing, both, or neither, emphasizing his emptiness and transcending conventional understanding in Madhyamaka.",
        quantum: "The no-cloning theorem states that quantum states cannot be perfectly copied. Similarly, the Buddha's enlightened nature is unique and cannot be replicated or fully described in conventional terms. Just as we cannot make an exact copy of a quantum state, we cannot capture the Buddha's enlightenment within our conceptual frameworks."
    },
    {
        number: 19,
        title: "Saṃsara has no distinction from nirvāna; nirvāna has no distinction from samsara.",
        summary: "There is no inherent difference between Saṃsāra (cycle of birth and death) and Nirvāņa (liberation); both are empty of inherent existence and dependently arisen, reflecting Madhyamaka's non-dual perspective.",
        quantum: "Einstein's famous equation E=mc² shows that mass and energy are equivalent forms of the same thing, convertible into one another. Similarly, Saṃsāra and Nirvāņa are not inherently separate states but interconvertible through understanding their empty nature. Just as mass transforms into energy, Saṃsāra transforms into Nirvāņa through insight."
    },
    {
        number: 20,
        title: "The limit of nirvāna is the limit of samsara; the limit of samsara is the limit of nirvāna.",
        summary: "Saṃsāra and Nirvāņa have no separate boundaries; they are co-extensive in their emptiness, meaning their limits are the same, reflecting Madhyamaka's unity of all phenomena.",
        quantum: "General relativity shows that space and time are interwoven as spacetime, bending near massive objects. This curvature illustrates how Saṃsāra and Nirvāņa are not separate realms but aspects of the same reality, with no clear boundary between them - just as space and time are not separate but components of a unified fabric."
    },
    {
        number: 21,
        title: "Views on passing beyond, ends, permanence depend on nirvāna, later and former ends.",
        summary: "Concepts like transcendence, endpoints, and permanence are dependent on the idea of Nirvāņa, which itself is empty, highlighting the dependent origination of all views in Madhyamaka.",
        quantum: "In particle physics, symmetry breaking occurs when fundamental symmetries are broken to give particles mass. Similarly, concepts like ends and permanence gain meaning through dependency on underlying realities like Nirvāņa. Just as particles acquire properties through their relationships in a field, our concepts derive meaning through dependency."
    },
    {
        number: 22,
        title: "In the emptiness of all things, what ends, non-ends, both, or neither are there?",
        summary: "In the emptiness of all phenomena, categories like ends and non-ends lose their meaning, as all distinctions dissolve, central to Madhyamaka's critique of inherent existence.",
        quantum: "At the quantum scale, space and time become a quantum foam where traditional structure breaks down into a dynamic field of virtual particles appearing and disappearing. Similarly, in the emptiness of all phenomena, conventional categories like 'ends' and 'non-ends' dissolve, leaving no fixed distinctions - just as quantum foam reveals no smooth continuum at the smallest scales."
    },
    {
        number: 23,
        title: "Is there this or that, permanence or impermanence, both, or neither?",
        summary: "This verse questions whether phenomena have inherent properties like this or that, permanence or impermanence, reflecting the emptiness of such distinctions, challenging fixed views in Madhyamaka.",
        quantum: "The complementarity principle in quantum mechanics shows that light behaves as both waves and particles, though these properties cannot be observed simultaneously. Similarly, phenomena lack inherent properties like permanence or impermanence - these are complementary perspectives rather than intrinsic qualities, highlighting the need to go beyond binary distinctions."
    },
    {
        number: 24,
        title: "Totally pacifying all referents and fixations is peace; the Buddha taught no dharma to anyone.",
        summary: "Nirvāņa is the complete pacification of all conceptualizations and attachments, and the Buddha's teaching is ultimately about this silence, emphasizing the cessation of all views in Madhyamaka.",
        quantum: "Quantum decoherence describes how quantum systems lose their superposition and settle into definite classical states through interaction with the environment. Similarly, peace arises when the mind settles from conceptual proliferation into clarity. Just as a quantum system resolves into a definite state, the mind finds peace by letting go of conceptual fixations."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        {/* Ensure title is a single string */}
        <title>{`Chapter ${chapterInfo.number}: ${chapterInfo.title} - Nāgārjuna's Quantum Reflections`}</title>
        <meta name="description" content={`Chapter ${chapterInfo.number} of Mūlamadhyamakakārikā: ${chapterInfo.title} explored through Madhyamaka and quantum physics`} />
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
              <a href="/Ch25 (1:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1: V1-12)
              </a>
              <a href="/Ch25 (2:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 2: V13-24)
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
                    {verse.quantum && <p><strong>Quantum:</strong> {verse.quantum}</p>}
                  </div>
                  <div className={styles.verseLinks}>
                    {verse.number <= 12 && (
                      <Link href={`/Ch25 (1:2)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number >= 13 && verse.number <= 24 && (
                      <Link href={`/Ch25 (2:2)/index.html#verse-${verse.number}`}>
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
