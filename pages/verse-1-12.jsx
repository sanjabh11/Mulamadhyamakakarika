import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse112() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "12",
    title: "Critique of Inherent Causation",
    verseText: "However, if a nonexistent effect / Arises from these conditions, / Why does it not arise / From non-conditions?",
    madhyamakaConcept: "Critique of inherent causation, conditions do not inherently produce effects.",
    quantumPhysicsParallel: "Quantum Fluctuations: Virtual particles arise spontaneously.",
    analysis: "Fluctuations show spontaneous arising, challenging causation, paralleling the verse. Indeterminacy and superposition highlight uncertainty, but fluctuations fit best.",
    animationPrompt: "A 3D vacuum with virtual particles popping in and out, symbolizing spontaneous effects. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.12 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Critique of Inherent Causation - However, if a nonexistent effect / Arises from these conditions, / Why does it not arise / From non-conditions?" />
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