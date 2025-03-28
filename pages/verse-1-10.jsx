import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse110() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "10",
    title: "Emptiness of Causal Relationships",
    verseText: "Because the existence of essence-less things does not exist, it is incorrect to say: 'When this exists, that arises.'",
    madhyamakaConcept: "Emptiness of causal relationships, rejecting inherent causation.",
    quantumPhysicsParallel: "Quantum Non-Locality: Correlations defy local causation.",
    analysis: "Non-locality shows correlations without local causes, paralleling the rejection of inherent causation. Superposition and entanglement involve indeterminacy, but non-locality fits best.",
    animationPrompt: "Two entangled particles separated by distance; measuring one instantly changes the other's state, showing non-local causation. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.10 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Emptiness of Causal Relationships - Because the existence of essence-less things does not exist, it is incorrect to say: 'When this exists, that arises.'" />
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