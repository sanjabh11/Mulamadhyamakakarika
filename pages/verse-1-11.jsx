import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse111() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "11",
    title: "Emptiness of Cause and Effect",
    verseText: "In the several or united conditions / The effect cannot be found. How could something not in the conditions / Come from the conditions?",
    madhyamakaConcept: "Emptiness of cause and effect, effects not inherent in causes.",
    quantumPhysicsParallel: "Quantum Superposition: Effects potential until measured.",
    analysis: "Superposition illustrates potential outcomes, paralleling effects not found in conditions. Measurement and contextuality involve outcomes, but superposition fits best.",
    animationPrompt: "A particle in superposition (wave-like) collapsing to a single state upon measurement. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.11 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Emptiness of Cause and Effect - In the several or united conditions / The effect cannot be found." />
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