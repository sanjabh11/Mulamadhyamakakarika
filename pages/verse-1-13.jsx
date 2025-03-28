import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse113() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "13",
    title: "Emptiness of Cause and Effect",
    verseText: "If the effect's essence is the conditions, / But the conditions don't have their own essence, / How could an effect whose essence is the conditions / Come from something that is essenceless?",
    madhyamakaConcept: "Emptiness of cause and effect, both lacking inherent existence.",
    quantumPhysicsParallel: "Entanglement: States correlated, lacking independent essence.",
    analysis: "Entanglement reflects both cause and effect lacking essence, paralleling the verse. Superposition and field theory involve non-definiteness, but entanglement fits best.",
    animationPrompt: "Two entangled particles with linked states; measuring one determines the other, showing lack of independent essence. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.13 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Emptiness of Cause and Effect - If the effect's essence is the conditions, but the conditions don't have their own essence." />
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