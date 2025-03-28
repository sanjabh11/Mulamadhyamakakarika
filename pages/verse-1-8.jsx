import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse18() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "8",
    title: "Subject-Object Dichotomy",
    verseText: "An existent phenomenon is clearly said to have no object at all. If the phenomenon has no object, where can the object exist?",
    madhyamakaConcept: "Emptiness of subject-object dichotomy, emphasizing interdependence.",
    quantumPhysicsParallel: "Observer Effect: Observation affects the system.",
    analysis: "The observer effect blurs subject-object distinctions, mirroring the verse's focus. Entanglement and collapse involve interactions, but observer effect fits best.",
    animationPrompt: "A scientist observing a quantum system through a 3D microscope, shifting from wave to particle behavior upon observation. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.8 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Subject-Object Dichotomy - An existent phenomenon is clearly said to have no object at all." />
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