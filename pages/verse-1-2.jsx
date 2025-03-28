import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse12() {
  // Verse data
  const verseData = {
    chapter: "1",
    verse: "2",
    title: "The Four Conditions",
    verseText: "There are four conditions: Causes, objects, immediate and dominant. There is no fifth.",
    madhyamakaConcept: "This lists the four conditions (causal, object, immediate, dominant) necessary for dependent origination, analyzing how phenomena arise.",
    quantumPhysicsParallel: "Quantum Contextuality: Outcomes depend on measurement context.",
    analysis: "Contextuality highlights how measurement conditions determine outcomes, mirroring the four conditions' role. Measurement and evolution involve conditions, but contextuality best aligns with the verse's analytical framework.",
    animationPrompt: "A light beam passes through polarizers with different orientations in 3D space, each representing a condition. The final polarization state, shown at a detector, depends on the sequence. Include a control panel with hide/unhide buttons for verse analysis, ensuring mobile responsiveness."
  };

  return (
    <>
      <Head>
        <title>Verse 1.2 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="The Four Conditions - There are four conditions: Causes, objects, immediate and dominant. There is no fifth." />
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