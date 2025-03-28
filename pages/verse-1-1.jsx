import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse11() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "1",
    title: "Investigation of Conditions",
    verseText: "No thing anywhere is ever born from itself, from something else, from both or without a cause.",
    madhyamakaConcept: "This verse rejects inherent arising, emphasizing dependent origination, where phenomena arise interdependently, not independently.",
    quantumPhysicsParallel: "Entanglement: Particles are interconnected, with states correlated regardless of distance.",
    analysis: "Entanglement best captures the verse's focus on interdependence, showing particles' states are linked, akin to dependent origination. Superposition and the observer effect also challenge fixed states, but entanglement directly reflects non-independent arising.",
    animationPrompt: "Two glowing particles connected by a shimmering thread in a vast, starry space. A device approaches one, measuring its spin, changing its color from blue to red; instantly, the other particle's color changes from red to blue, despite distance. Include a control panel with hide/unhide buttons for mobile responsiveness, showing the verse analysis."
  };

  return (
    <>
      <Head>
        <title>Verse 1.1 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Investigation of Conditions - No thing anywhere is ever born from itself, from something else, from both or without a cause." />
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