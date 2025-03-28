import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse17() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "7",
    title: "Rejection of the Four Extremes",
    verseText: "When things cannot be established as either existent, non-existent or both, how can one speak of an 'establishing cause.' Such would be impossible.",
    madhyamakaConcept: "Rejects all four extremes (existent, non-existent, both, neither) for existence, emphasizing emptiness.",
    quantumPhysicsParallel: "Quantum Complementarity: Incompatible descriptions required.",
    analysis: "Complementarity requires multiple views, aligning with the tetralemma's negation. Superposition and entanglement challenge logic, but complementarity fits best.",
    animationPrompt: "Double-slit experiment, alternating wave and particle behaviors, toggled via a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.7 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Rejection of the Four Extremes - When things cannot be established as either existent, non-existent or both, how can one speak of an 'establishing cause.'" />
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