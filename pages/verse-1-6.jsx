import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse16() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "6",
    title: "Conditions and Existence",
    verseText: "It is impossible for something that either exists or not to have conditions. If it were non-existent, of what would these be the conditions? If it were existent, why would it need conditions?",
    madhyamakaConcept: "Things are neither inherently existent nor non-existent, existing dependently, questioning fixed conditions.",
    quantumPhysicsParallel: "Superposition: Systems in multiple states simultaneously.",
    analysis: "Superposition illustrates the middle way between existence and non-existence, aligning with the verse. Indeterminacy and duality challenge categories, but superposition directly fits.",
    animationPrompt: "Schrödinger's cat in a 3D box, morphing between alive and dead, settling upon observation. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.6 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Conditions and Existence - It is impossible for something that either exists or not to have conditions." />
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