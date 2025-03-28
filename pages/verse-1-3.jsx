import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse13() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "3",
    title: "Essence and Interdependence",
    verseText: "The essence of things does not exist in conditions and so on. If an own thing does not exist, an other thing does not exist.",
    madhyamakaConcept: "This emphasizes emptiness, stating that if phenomena lack inherent essence, all are interdependent, with no independent existence.",
    quantumPhysicsParallel: "Entanglement: States are correlated, lacking independent existence.",
    analysis: "Entanglement illustrates that particles lack independent essence, mirroring the verse's interdependence. Superposition and indeterminacy challenge fixed states, but entanglement directly aligns with the lack of inherent existence.",
    animationPrompt: "Two entangled particles as glowing spheres in a 3D void. Measuring one changes its color, instantly determining the other's color, showing interdependence. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.3 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Essence and Interdependence - The essence of things does not exist in conditions and so on." />
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