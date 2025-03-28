import React from 'react';
import Head from 'next/head';
import VerseDisplay from '../components/VerseDisplay';

export default function Verse31() {
  // Verse data
  const verseData = {
    chapter: "3",
    verse: "1",
    title: "The Interdependence of Sense Faculties and Objects",
    verseText: "Nāgārjuna introduces the fundamental relationship between sense faculties and their objects by stating that neither can exist independently of the other, paralleling concepts in quantum physics about duality.",
    madhyamakaConcept: "Sense faculties (e.g., the eye) and their objects (e.g., form) lack independent existence and are mutually dependent. This reflects Nāgārjuna's doctrine of emptiness, where phenomena arise relationally rather than inherently.",
    quantumPhysicsParallel: "Quantum entanglement, where two particles are interconnected such that the state of one instantly influences the other regardless of distance, exemplifies a similar interdependence. Entangled particles cannot be described independently—their properties are defined by their relationship.",
    analysis: "Both Nāgārjuna and quantum entanglement reject the notion of isolated, self-existent entities. In Madhyamaka, the eye and form co-arise, just as entangled particles exist as a unified system rather than as separate entities. This shared emphasis on relationality bridges the philosophical and physical perspectives.",
    animationPrompt: "Two glowing particles drift in a vast cosmic void, linked by a shimmering thread. When one particle's spin shifts, the other mirrors it instantly, their colors pulsing in harmony despite the distance, symbolizing their inseparable connection."
  };

  return (
    <>
      <Head>
        <title>Verse 3.1 - Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Exploring the relationship between sense faculties and objects through Madhyamaka and quantum physics" />
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