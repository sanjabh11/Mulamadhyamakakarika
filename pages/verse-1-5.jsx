import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse15() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "5",
    title: "Conditions and Non-conditions",
    verseText: "Since something is born in dependence upon them, then they are known as 'conditions'. As long as it is not born, why are they not non-conditions?",
    madhyamakaConcept: "Conditions are conventionally designated based on dependent origination, questioning their status without arising.",
    quantumPhysicsParallel: "Wave Function and Measurement: Potential states actualized by measurement.",
    analysis: "The wave function represents potential, actualized by measurement, paralleling conditions' designation. Quantum potential and field theory involve structures, but measurement best fits the verse's focus.",
    animationPrompt: "A probability cloud (wave function) around an atom in 3D. Measurement (probe approaching) collapses it to a point; without measurement, it evolves as a cloud. Include a control panel with hide/unhide buttons for verse analysis, mobile-responsive."
  };

  return (
    <>
      <Head>
        <title>Verse 1.5 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Conditions and Non-conditions - Since something is born in dependence upon them, then they are known as 'conditions'." />
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