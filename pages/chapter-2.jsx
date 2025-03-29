import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chapter.module.css';

export default function Chapter2() {
  // Chapter information
  const chapterInfo = {
    number: 2,
    title: "Examination of Motion",
    verseCount: 25, // Updated based on config files (13 + 12)
    summary: "This chapter critically examines the concept of motion, arguing that it lacks inherent existence. Nāgārjuna deconstructs motion by analyzing the relationship between the mover, the act of moving, and the path, demonstrating that motion cannot be found in what has moved, what has not moved, or what is currently moving.",
    quantumSummary: "Quantum parallels include superposition (defying fixed states), quantum state evolution (motion as process), entanglement (interdependence of mover and motion), contextuality (motion dependent on measurement), and the observer effect, all challenging classical notions of motion as an inherent property."
  };

  // Combine verse data from both parts
  const verses = [
    // Verses 1-13 from public/Ch2 (1:2)/config.js
    {
        number: 1,
        title: "Verse 1: Motion and Moved/Not-Moved", // Synthesized title
        summary: "What has been moved is not moving. What has not been moved is not moving. Apart from what has been moved and what has not been moved, Movement cannot be conceived.",
        quantum: "Superposition in quantum mechanics states that a particle can exist in multiple states (e.g., position or momentum) simultaneously until observed. This parallels the verse's rejection of motion as fixed in 'moved' or 'not moved,' as superposition defies classical certainty until measurement collapses the state.",
        explanation: "Imagine a coin spinning in the air—it's not just heads or tails but both until it lands. In quantum physics, particles are like that, existing in a blur of possibilities. Motion isn't a solid 'thing' you can point to; it's a process that only makes sense in the moment."
    },
    {
        number: 2,
        title: "Verse 2: Motion and Change", // Synthesized title
        summary: "Where there is change, there is motion. Since there is change in the moving, And not in the moved or not-moved, Motion is in that which is moving.",
        quantum: "Quantum State Evolution governs how a quantum system changes over time via the Schrödinger equation. Like motion, this evolution is a continuous process, not a fixed attribute, aligning with the verse's focus on change as the essence of motion.",
        explanation: "Picture a flowing river: it's the movement of water that makes it a river, not the still puddles or dried banks. In quantum physics, particles are always shifting, like ripples in a stream, never frozen in one spot."
    },
    {
        number: 3,
        title: "Verse 3: Motion in the Mover?", // Synthesized title
        summary: "How would it be acceptable For motion to be in the mover? When it is not moving, it is not acceptable To call it a mover.",
        quantum: "Entanglement links two particles so that the state of one instantly affects the other, regardless of distance. This interdependence mirrors how motion and mover rely on each other, challenging notions of separate, inherent existence.",
        explanation: "Think of two dancers moving in perfect sync: if one stops, the dance ends. In quantum physics, entangled particles are like partners—one's motion defines the other's, inseparable in their steps."
    },
    {
        number: 4,
        title: "Verse 4: Mover and Non-Motion", // Synthesized title
        summary: "For whomever there is motion in the mover, There could be non-motion Evident in the mover. But having motion follows from being a mover.",
        quantum: "Superposition allows a quantum particle to be in multiple states (e.g., moving and still) at once. This mirrors the verse's challenge to fixed states, as a particle's 'motion' isn't definite until observed.",
        explanation: "Imagine a light bulb that's both on and off until you flip the switch. In quantum physics, particles can be in a mix of states, like a mover that's both moving and not, until checked."
    },
    {
        number: 5,
        title: "Verse 5: Twofold Motion (1)", // Synthesized title
        summary: "If motion is in the mover, There would have to be a twofold motion: One in virtue of which it is a mover, And one in virtue of which it moves.",
        quantum: "Quantum Contextuality states that a particle's properties (like motion) depend on how they're measured, not an inherent essence. This parallels the verse's rejection of motion as fixed, as context defines the outcome.",
        explanation: "Think of a chameleon changing color based on its surroundings—you can't pin down its 'true' shade. In quantum physics, a particle's motion shifts with how you look at it, not where it 'is'."
    },
    {
        number: 6,
        title: "Verse 6: Twofold Motion and Subject", // Synthesized title
        summary: "If there were a twofold motion, The subject of that motion would be twofold. For without a subject of motion, There cannot be motion.",
        quantum: "Entanglement distributes motion (or state change) across particles, blurring the idea of a single subject. This reflects the verse's point that motion and mover are interdependent, not independent.",
        explanation: "Picture two singers harmonizing so perfectly you can't tell who's leading. In quantum physics, entangled particles share motion like a duet, with no clear 'soloist'."
    },
    {
        number: 7,
        title: "Verse 7: Interdependence of Mover/Motion", // Synthesized title
        summary: "If without a mover It would not be correct to say that there is motion, Then if there were no motion, How could there be a mover?",
        quantum: "Entanglement illustrates this interdependence, as the state of one particle cannot be defined without its entangled partner, much like motion and mover.",
        explanation: "Imagine a seesaw: one side can't rise without the other falling. In quantum physics, entangled particles balance each other's states, needing both to 'move'."
    },
    {
        number: 8,
        title: "Verse 8: What Third Thing Moves?", // Synthesized title
        summary: "Inasmuch as a real mover does not move, And a non-mover does not move, Apart from a mover and a non-mover, What third thing could move?",
        quantum: "Superposition defies binary labels like mover or non-mover, as particles can exist in a blend of states, echoing the verse's rejection of fixed categories.",
        explanation: "Think of a shape that's neither square nor circle but somehow both. In quantum physics, particles mix states, not fitting neatly as 'moving' or 'still'."
    },
    {
        number: 9,
        title: "Verse 9: Mover Requires Motion", // Synthesized title
        summary: "When without motion, It is unacceptable to call something a mover, How will it be acceptable To say that a mover moves?",
        quantum: "Entanglement ties the states of particles together, so one's 'motion' depends on the other, paralleling the mover-motion link.",
        explanation: "Picture a car with no engine—it's not a car if it can't move. In quantum physics, entangled particles' states are locked together, like a car and its fuel."
    },
    {
        number: 10,
        title: "Verse 10: Perspective and Motion", // Synthesized title
        summary: "For him from whose perspective a mover moves, There would be the consequence that Without motion there could be a mover. Because a mover moves.",
        quantum: "Observer Effect in quantum mechanics means observation defines a particle's state (e.g., motion), mirroring how motion depends on perspective in the verse.",
        explanation: "Imagine a shadow only appearing when you shine a light—it's not 'there' otherwise. In quantum physics, motion shows up only when you look, shaped by your view."
    },
    {
        number: 11,
        title: "Verse 11: Twofold Motion (2)", // Synthesized title
        summary: "If a mover were to move, There would be a twofold motion: One in virtue of which he is a mover, And one in virtue of which the mover moves.",
        quantum: "Quantum Recursion involves self-referencing processes, like feedback loops, that challenge fixed definitions, akin to the verse's regress critique.",
        explanation: "Think of mirrors facing each other, creating endless reflections. In quantum physics, some states loop back on themselves, never settling into one 'motion'."
    },
    {
        number: 12,
        title: "Verse 12: Beginning of Motion", // Synthesized title
        summary: "Motion does not begin in what has moved, Nor does it begin in what has not moved, Nor does it begin in what is moving. In what, then, does motion begin?",
        quantum: "Quantum Indeterminacy means a particle's path is probabilistic, with no fixed origin until measured, aligning with the verse's rejection of a definite start.",
        explanation: "Imagine a rainbow's edge—you can't pinpoint where it begins. In quantum physics, a particle's motion is fuzzy at the start, only sharpening when observed."
    },
    {
        number: 13,
        title: "Verse 13: Motion and Time", // Synthesized title
        summary: "Prior to the beginning of motion, There is no beginning of motion in The going or in the gone. How could there be motion in the not-gone?",
        quantum: "Time Symmetry in Quantum Mechanics reveals that many processes are reversible, undermining a fixed 'before' or 'after,' much like the verse's critique.",
        explanation: "Picture a movie scene that looks the same backward or forward. In quantum physics, time can flow both ways, so motion doesn't have a strict 'start'."
    },
    // Verses 14-25 from public/Ch2 (2:2)/config.js
    {
        number: 14,
        title: "Verse 14: Conceiving Motion's Beginning", // Synthesized title
        summary: "\"Since the beginning of motion Cannot be conceived in any way, What gone thing, what going thing, And what non-going thing can be posited?\"",
        quantum: "Superposition allows a particle to occupy multiple temporal states simultaneously, defying fixed labels like \"gone\" or \"going,\" as in the verse.",
        explanation: "Imagine a clock with hands pointing everywhere at once. In quantum physics, particles can blur past, present, and future until you check them."
    },
    {
        number: 15,
        title: "Verse 15: Stationarity", // Synthesized title
        summary: "\"Just as a moving thing is not stationary, A non-moving thing is not stationary. Apart from the moving and the non-moving, What third thing is stationary?\"",
        quantum: "Wave-Particle Duality shows quantum entities can exhibit both wave (motion) and particle (stationary) traits, defying fixed labels as in the verse.",
        explanation: "Think of water: it can ripple or sit still, but it's never just one. In quantum physics, particles switch between wave and particle forms, never fully fixed."
    },
    {
        number: 16,
        title: "Verse 16: Moving Thing Being Stationary?", // Synthesized title
        summary: "\"If without motion It is not appropriate to posit a mover, How could it be appropriate to say That a moving thing is stationary?\"",
        quantum: "Complementarity in quantum mechanics holds that wave and particle traits are mutually exclusive yet both essential, like motion and stationarity here.",
        explanation: "Picture a coin: heads or tails, but not both at once, though both define it. In quantum physics, particles show one trait at a time, yet need both to be whole."
    },
    {
        number: 17,
        title: "Verse 17: Halting and Starting Motion", // Synthesized title
        summary: "\"One does not halt from moving, Nor from having moved or not having moved. Motion and coming to rest And starting to move are similar.\"",
        quantum: "Quantum State Evolution is a continuous process with no inherent \"start\" or \"stop,\" paralleling the verse's view of motion as seamless.",
        explanation: "Imagine a river flowing endlessly—it doesn't \"begin\" or \"end\" abruptly. In quantum physics, particles evolve smoothly, with no sharp breaks in their dance."
    },
    {
        number: 18,
        title: "Verse 18: Mover and Motion Identity/Difference", // Synthesized title
        summary: "\"That motion just is the mover itself Is not correct. Nor is it correct that They are completely different.\"",
        quantum: "Entanglement shows particles are correlated without being identical or wholly distinct, echoing the Middle Way's relational stance.",
        explanation: "Think of two friends who sync perfectly but aren't the same person. In quantum physics, entangled particles are linked yet individual, sharing a subtle bond."
    },
    {
        number: 19,
        title: "Verse 19: Identity of Agent/Action", // Synthesized title
        summary: "\"It would follow from The identity of mover and motion That agent and action Are identical.\"",
        quantum: "Observer Effect blurs the line between observer (agent) and observed (action), linking them without merging, as in the verse's critique.",
        explanation: "Imagine a chef tasting soup—tasting changes the dish, tying the chef to the act. In quantum physics, observing a particle alters its state, connecting observer and event."
    },
    {
        number: 20,
        title: "Verse 20: Distinction of Mover/Motion", // Synthesized title
        summary: "\"It would follow from A real distinction between motion and mover That there could be a mover without motion And motion without a mover.\"",
        quantum: "Entanglement ensures particles' states are inseparable, preventing independent \"motion\" or \"mover,\" mirroring the verse's logic.",
        explanation: "Picture a kite and its string—neither flies alone. In quantum physics, entangled particles are bound together, their motions always paired."
    },
    {
        number: 21,
        title: "Verse 21: Establishing Identity/Difference", // Synthesized title
        summary: "\"When neither in identity Nor in difference Can they be established, How can these two be established at all?\"",
        quantum: "Superposition transcends binary states, allowing particles to exist beyond \"same\" or \"different,\" aligning with the verse's conclusion.",
        explanation: "Imagine a flavor that's neither sweet nor sour but both at once. In quantum physics, particles blend states, defying simple labels until observed."
    },
    {
        number: 22,
        title: "Verse 22: Mover Manifestation vs. Movement", // Synthesized title
        summary: "\"The motion by means of which a mover is manifest Cannot be the motion by means of which he moves. He does not exist before that motion. So what and where is the thing that moves?\"",
        quantum: "Wave Function Collapse defines a particle's state only upon measurement, not before, paralleling the verse's denial of a pre-existing mover.",
        explanation: "Think of a shadow needing light to appear—it's not \"there\" without it. In quantum physics, a particle's motion emerges only when observed, not before."
    },
    {
        number: 23,
        title: "Verse 23: Mover and Twofold Motion", // Synthesized title
        summary: "\"A mover does not carry out a different motion From that by means of which he is manifest as a mover. Moreover, in one mover A twofold motion is unacceptable.\"",
        quantum: "Quantum Identity shows identical particles are indistinguishable, with no separate \"motions,\" echoing the verse's rejection of duality.",
        explanation: "Imagine identical twins moving as one—you can't split their actions. In quantum physics, identical particles share motion, blending seamlessly."
    },
    {
        number: 24,
        title: "Verse 24: Existent/Non-Existent Mover", // Synthesized title
        summary: "\"A really existent mover Doesn't move in any of the three ways. A non-existent mover Doesn't move in any of the three ways.\"",
        quantum: "Superposition allows particles to exist in states of being and not being simultaneously, challenging existence vs. non-existence as in the verse.",
        explanation: "Picture a ghost fading in and out—real yet unreal. In quantum physics, particles can hover between existence and absence until measured."
    },
    {
        number: 25,
        title: "Verse 25: Motion, Mover, Route Non-Existent", // Synthesized title
        summary: "\"Neither an entity nor a non-entity Moves in any of the three ways. So motion, mover and route are non-existent.\"",
        quantum: "Wave Function Collapse shows motion emerges relationally through measurement, not as an inherent trait, aligning with the verse's conclusion.",
        explanation: "Imagine a mirage: it seems real but vanishes up close. In quantum physics, motion isn't \"there\" until observed, and even then, it's fleeting."
    }
  ];

  // Helper function to get verse data by number
  const getVerse = (num) => verses.find(v => v.number === num);

  return (
    <div className={styles.container}>
      <Head>
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
              <a href="/Ch2 (1:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 1: V1-13)
              </a>
              <a href="/Ch2 (2:2)/index.html" className={styles.visualizeButton}>
                View Interactive Animations (Part 2: V14-25)
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
                  {/* Use verse.title if available, otherwise synthesize */}
                  <h3>{verse.title || `Verse ${verse.number}`}</h3> 
                  <div className={styles.verseSummaries}>
                    {/* Adapt based on available fields in config */}
                    <p><strong>Text:</strong> {verse.text || verse.summary}</p> 
                    <p><strong>Madhyamaka:</strong> {verse.madhyamaka || verse.madhyamakaConcept}</p>
                    <p><strong>Quantum:</strong> {verse.quantum || verse.quantumParallel}</p>
                    {verse.explanation && <p><strong>Explanation:</strong> {verse.explanation}</p>}
                    {verse.accessibleExplanation && <p><strong>Explanation:</strong> {verse.accessibleExplanation}</p>}
                  </div>
                  <div className={styles.verseLinks}>
                    {verse.number <= 13 && (
                      <Link href={`/Ch2 (1:2)/index.html#verse-${verse.number}`}>
                        View in Part 1
                      </Link>
                    )}
                    {verse.number >= 14 && verse.number <= 25 && (
                      <Link href={`/Ch2 (2:2)/index.html#verse-${verse.number}`}>
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
