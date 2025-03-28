import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse14() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "4",
    title: "Activity and Conditions",
    verseText: "There is no activity which has conditions. There is no activity which does not have conditions. There are no conditions which do not have activity, and none which do have activity.",
    madhyamakaConcept: "Using the tetralemma, this negates fixed relationships between activity and conditions, emphasizing their emptiness.",
    quantumPhysicsParallel: "Quantum Complementarity: Reality requires incompatible descriptions (wave-particle).",
    analysis: "Complementarity aligns with the verse's negation of fixed categories, requiring multiple views. Superposition and entanglement challenge classical logic, but complementarity best reflects the tetralemma's structure.",
    animationPrompt: "Double-slit experiment in 3D, showing interference (wave) when unobserved, particles when observed. Toggle between scenarios via a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.4 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Activity and Conditions - There is no activity which has conditions. There is no activity which does not have conditions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <VerseDisplay 
        chapter={verseData.chapter}
        verse={verseData.verse}
        title={verseData.title}
        verseText={verseData.verseText}
        madhyamakaConcept={verseData.madhyamakaConcept}
        quantumPhysicsParallel={verseData.quantumPhysicsParallel}
        analysis={verseData.analysis}
        animationPrompt={verseData.animationPrompt}
      />
    </>
  );
} 