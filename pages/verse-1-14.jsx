import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse114() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "14",
    title: "Emptiness of All Phenomena",
    verseText: "Therefore, neither with conditions as their essence, / Nor with non-conditions as their essence are there any effects. / If there are no such effects, / How could conditions or non-conditions be evident?",
    madhyamakaConcept: "Emptiness of all phenomena, conditions and effects mutually empty.",
    quantumPhysicsParallel: "Quantum Complementarity: Reality requires incompatible descriptions.",
    analysis: "Complementarity parallels the rejection of fixed essences, requiring multiple views. Superposition and entanglement challenge classical views, but complementarity fits best.",
    animationPrompt: "Double-slit experiment, alternating wave and particle behaviors, toggled via a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.14 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Emptiness of All Phenomena - Neither with conditions as their essence, nor with non-conditions as their essence are there any effects." />
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