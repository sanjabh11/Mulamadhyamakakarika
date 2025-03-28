import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse19() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "9",
    title: "Emptiness of Arising and Cessation",
    verseText: "If phenomena are not born, it is invalid for there to be cessation. Therefore, an immediate [condition] is unreasonable. What, having ceased, can also be a condition?",
    madhyamakaConcept: "Emptiness of arising and cessation, questioning conditions' inherent existence.",
    quantumPhysicsParallel: "Quantum Decoherence: Environment interaction causes state loss.",
    analysis: "Decoherence parallels the critique of cessation and conditions, showing environmental impact. Superposition and measurement involve state changes, but decoherence fits best.",
    animationPrompt: "A quantum particle in superposition interacting with moving environmental particles, collapsing into a definite state. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.9 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Emptiness of Arising and Cessation - If phenomena are not born, it is invalid for there to be cessation." />
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