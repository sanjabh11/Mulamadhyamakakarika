/**
 * Generate Chapter Pages Script
 * 
 * Generates all 27 chapter pages with consistent structure
 * using the new ChapterPage component with 3D visualizations
 * 
 * Run: node scripts/generate-chapter-pages.js
 */

const fs = require('fs');
const path = require('path');

// Chapter data for all 27 chapters
const CHAPTERS = [
  {
    number: 1,
    title: "Investigation of Conditions",
    verseCount: 14,
    summary: "This chapter examines the fundamental nature of causation and conditions, rejecting inherent arising and affirming dependent origination.",
    quantumSummary: "Quantum parallels include entanglement, superposition, complementarity, and non-locality, illustrating interdependence.",
    verses: [
      { number: 1, title: "Rejection of Four Extremes", summary: "Rejecting inherent arising", quantum: "Quantum Indeterminacy" },
      { number: 2, title: "Four Conditions", summary: "Four conditions for dependent origination", quantum: "Quantum Contextuality" },
      { number: 3, title: "Essence and Interdependence", summary: "Emptiness and interdependence", quantum: "Entanglement" },
      { number: 4, title: "Activity and Conditions", summary: "Negating fixed relationships", quantum: "Complementarity" },
      { number: 5, title: "Conditions and Non-conditions", summary: "Conventional designation", quantum: "Wave Function Collapse" },
      { number: 6, title: "Conditions and Existence", summary: "Neither existent nor non-existent", quantum: "Superposition" },
      { number: 7, title: "Rejection of Four Extremes", summary: "Emphasizing emptiness", quantum: "Complementarity" },
      { number: 8, title: "Subject-Object Dichotomy", summary: "Emptiness of dichotomy", quantum: "Observer Effect" },
      { number: 9, title: "Arising and Cessation", summary: "Questioning inherent existence", quantum: "Decoherence" },
      { number: 10, title: "Causal Relationships", summary: "Rejecting inherent causation", quantum: "Non-Locality" },
      { number: 11, title: "Cause and Effect", summary: "Effects not inherent in causes", quantum: "Superposition" },
      { number: 12, title: "Critique of Causation", summary: "Conditions don't inherently produce", quantum: "Fluctuations" },
      { number: 13, title: "Emptiness of Both", summary: "Both cause and effect empty", quantum: "Entanglement" },
      { number: 14, title: "All Phenomena Empty", summary: "Conditions and effects mutually empty", quantum: "Complementarity" }
    ]
  },
  {
    number: 2,
    title: "Examination of Motion",
    verseCount: 25,
    summary: "This chapter critically examines motion, arguing it lacks inherent existence through analysis of mover, moving, and path.",
    quantumSummary: "Quantum parallels include superposition, state evolution, entanglement, and contextuality.",
    verses: Array.from({ length: 25 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Motion Analysis`,
      summary: "Analysis of motion's emptiness",
      quantum: ["Superposition", "Entanglement", "Observer Effect", "Wave Function"][i % 4]
    }))
  },
  {
    number: 3,
    title: "Examination of Perception",
    verseCount: 9,
    summary: "This chapter analyzes perception, showing that sight, hearer, and objects of perception lack inherent existence.",
    quantumSummary: "Quantum measurement and observer effect parallel the interdependence of perceiver and perceived.",
    verses: Array.from({ length: 9 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Perception Analysis`,
      summary: "Analysis of perception's emptiness",
      quantum: ["Observer Effect", "Measurement", "Decoherence"][i % 3]
    }))
  },
  {
    number: 4,
    title: "Examination of Aggregates",
    verseCount: 9,
    summary: "This chapter examines the five aggregates (skandhas), showing they lack inherent existence.",
    quantumSummary: "Superposition and entanglement illustrate how aggregates don't exist independently.",
    verses: Array.from({ length: 9 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Aggregates Analysis`,
      summary: "Analysis of aggregates' emptiness",
      quantum: ["Superposition", "Entanglement", "Wave Function"][i % 3]
    }))
  },
  {
    number: 5,
    title: "Examination of Elements",
    verseCount: 8,
    summary: "This chapter analyzes the elements (dhātus), demonstrating their empty nature.",
    quantumSummary: "Quantum field theory and particle physics parallel the analysis of elements.",
    verses: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Elements Analysis`,
      summary: "Analysis of elements' emptiness",
      quantum: ["Quantum Field", "Entanglement", "Fluctuations"][i % 3]
    }))
  },
  {
    number: 6,
    title: "Examination of Desire and the Desirous",
    verseCount: 10,
    summary: "This chapter examines desire and the one who desires, showing their interdependence.",
    quantumSummary: "Entanglement and observer effect parallel the relationship between desire and desirous.",
    verses: Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Desire Analysis`,
      summary: "Analysis of desire's emptiness",
      quantum: ["Entanglement", "Observer Effect", "Decoherence"][i % 3]
    }))
  },
  {
    number: 7,
    title: "Examination of Arising, Abiding, and Ceasing",
    verseCount: 35,
    summary: "This chapter analyzes the three characteristics of conditioned phenomena.",
    quantumSummary: "Quantum fluctuations and virtual particles parallel spontaneous arising.",
    verses: Array.from({ length: 35 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Characteristics Analysis`,
      summary: "Analysis of arising, abiding, ceasing",
      quantum: ["Fluctuations", "Superposition", "Decoherence", "Wave Function"][i % 4]
    }))
  },
  {
    number: 8,
    title: "Examination of Agent and Action",
    verseCount: 13,
    summary: "This chapter examines the relationship between agent and action.",
    quantumSummary: "Complementarity and observer effect parallel agent-action relationship.",
    verses: Array.from({ length: 13 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Agent-Action Analysis`,
      summary: "Analysis of agent and action",
      quantum: ["Complementarity", "Observer Effect", "Entanglement"][i % 3]
    }))
  },
  {
    number: 9,
    title: "Examination of the Prior Entity",
    verseCount: 12,
    summary: "This chapter examines whether a prior entity exists before perception.",
    quantumSummary: "Superposition challenges the notion of definite prior states.",
    verses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Prior Entity Analysis`,
      summary: "Analysis of prior entity",
      quantum: ["Superposition", "Wave Function", "Measurement"][i % 3]
    }))
  },
  {
    number: 10,
    title: "Examination of Fire and Fuel",
    verseCount: 16,
    summary: "This chapter uses fire and fuel as an analogy for self and aggregates.",
    quantumSummary: "Entanglement illustrates the interdependence of fire and fuel.",
    verses: Array.from({ length: 16 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Fire-Fuel Analysis`,
      summary: "Analysis of fire and fuel relationship",
      quantum: ["Entanglement", "Dependent Origination", "Complementarity"][i % 3]
    }))
  },
  {
    number: 11,
    title: "Examination of Prior and Posterior Limits",
    verseCount: 8,
    summary: "This chapter examines the limits of existence in time.",
    quantumSummary: "Non-locality and time symmetry parallel the analysis of temporal limits.",
    verses: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Temporal Limits Analysis`,
      summary: "Analysis of temporal limits",
      quantum: ["Non-Locality", "Time Symmetry", "Superposition"][i % 3]
    }))
  },
  {
    number: 12,
    title: "Examination of Suffering",
    verseCount: 10,
    summary: "This chapter examines the nature of suffering and its causes.",
    quantumSummary: "Dependent origination in quantum systems parallels the arising of suffering.",
    verses: Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Suffering Analysis`,
      summary: "Analysis of suffering",
      quantum: ["Dependent Origination", "Entanglement", "Decoherence"][i % 3]
    }))
  },
  {
    number: 13,
    title: "Examination of Compounded Phenomena",
    verseCount: 8,
    summary: "This chapter examines compounded phenomena (saṃskāra).",
    quantumSummary: "Emptiness and superposition parallel the analysis of compounded phenomena.",
    verses: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Compounded Analysis`,
      summary: "Analysis of compounded phenomena",
      quantum: ["Emptiness", "Superposition", "Wave Function"][i % 3]
    }))
  },
  {
    number: 14,
    title: "Examination of Association",
    verseCount: 8,
    summary: "This chapter examines the association between things.",
    quantumSummary: "Entanglement and correlation parallel the analysis of association.",
    verses: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Association Analysis`,
      summary: "Analysis of association",
      quantum: ["Entanglement", "Correlation", "Non-Locality"][i % 3]
    }))
  },
  {
    number: 15,
    title: "Examination of Essence",
    verseCount: 11,
    summary: "This chapter is the heart of Madhyamaka, examining svabhāva (essence/inherent existence).",
    quantumSummary: "Emptiness at the quantum level parallels the absence of inherent essence.",
    verses: Array.from({ length: 11 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Essence Analysis`,
      summary: "Analysis of essence (svabhāva)",
      quantum: ["Emptiness", "Superposition", "Wave Function"][i % 3]
    }))
  },
  {
    number: 16,
    title: "Examination of Bondage and Liberation",
    verseCount: 10,
    summary: "This chapter examines bondage and liberation.",
    quantumSummary: "Decoherence and state transitions parallel bondage and liberation.",
    verses: Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Bondage Analysis`,
      summary: "Analysis of bondage and liberation",
      quantum: ["Decoherence", "State Transition", "Entanglement"][i % 3]
    }))
  },
  {
    number: 17,
    title: "Examination of Action and Fruit",
    verseCount: 33,
    summary: "This chapter examines karma (action) and its fruits.",
    quantumSummary: "Dependent origination and causation in quantum systems parallel karma.",
    verses: Array.from({ length: 33 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Karma Analysis`,
      summary: "Analysis of action and fruit",
      quantum: ["Dependent Origination", "Causation", "Entanglement", "Non-Locality"][i % 4]
    }))
  },
  {
    number: 18,
    title: "Examination of Self and Phenomena",
    verseCount: 12,
    summary: "This chapter examines the self (ātman) and phenomena.",
    quantumSummary: "Emptiness and observer-independent reality parallel the analysis of self.",
    verses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Self Analysis`,
      summary: "Analysis of self and phenomena",
      quantum: ["Emptiness", "Observer Effect", "Superposition"][i % 3]
    }))
  },
  {
    number: 19,
    title: "Examination of Time",
    verseCount: 6,
    summary: "This chapter examines the nature of time.",
    quantumSummary: "Time symmetry and quantum time parallel the analysis of temporal existence.",
    verses: Array.from({ length: 6 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Time Analysis`,
      summary: "Analysis of time",
      quantum: ["Time Symmetry", "Wave Function", "Superposition"][i % 3]
    }))
  },
  {
    number: 20,
    title: "Examination of Cause and Effect",
    verseCount: 24,
    summary: "This chapter examines cause and effect relationships.",
    quantumSummary: "Quantum fluctuations and causation parallel the analysis of cause-effect.",
    verses: Array.from({ length: 24 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Cause-Effect Analysis`,
      summary: "Analysis of cause and effect",
      quantum: ["Fluctuations", "Causation", "Entanglement", "Non-Locality"][i % 4]
    }))
  },
  {
    number: 21,
    title: "Examination of Becoming and Destruction",
    verseCount: 21,
    summary: "This chapter examines becoming and destruction.",
    quantumSummary: "Superposition and state transitions parallel becoming and destruction.",
    verses: Array.from({ length: 21 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Becoming Analysis`,
      summary: "Analysis of becoming and destruction",
      quantum: ["Superposition", "State Transition", "Fluctuations"][i % 3]
    }))
  },
  {
    number: 22,
    title: "Examination of the Tathāgata",
    verseCount: 16,
    summary: "This chapter examines the Buddha (Tathāgata).",
    quantumSummary: "Emptiness and transcendence of categories parallel the Tathāgata.",
    verses: Array.from({ length: 16 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Tathāgata Analysis`,
      summary: "Analysis of the Tathāgata",
      quantum: ["Emptiness", "Superposition", "Transcendence"][i % 3]
    }))
  },
  {
    number: 23,
    title: "Examination of Error",
    verseCount: 25,
    summary: "This chapter examines error and confusion.",
    quantumSummary: "Decoherence and measurement error parallel the analysis of error.",
    verses: Array.from({ length: 25 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Error Analysis`,
      summary: "Analysis of error",
      quantum: ["Decoherence", "Measurement", "Observer Effect"][i % 3]
    }))
  },
  {
    number: 24,
    title: "Examination of the Noble Truths",
    verseCount: 40,
    summary: "This chapter examines the Four Noble Truths in light of emptiness.",
    quantumSummary: "Dependent origination and emptiness parallel the Noble Truths.",
    verses: Array.from({ length: 40 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Noble Truths Analysis`,
      summary: "Analysis of the Noble Truths",
      quantum: ["Dependent Origination", "Emptiness", "Entanglement", "Wave Function"][i % 4]
    }))
  },
  {
    number: 25,
    title: "Examination of Nirvāṇa",
    verseCount: 24,
    summary: "This chapter examines nirvāṇa, showing it is not different from saṃsāra.",
    quantumSummary: "Emptiness and non-duality parallel the nature of nirvāṇa.",
    verses: Array.from({ length: 24 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Nirvāṇa Analysis`,
      summary: "Analysis of nirvāṇa",
      quantum: ["Emptiness", "Non-Duality", "Superposition"][i % 3]
    }))
  },
  {
    number: 26,
    title: "Examination of the Twelve Links",
    verseCount: 12,
    summary: "This chapter examines the twelve links of dependent origination.",
    quantumSummary: "Dependent origination chain parallels quantum causal networks.",
    verses: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Twelve Links Analysis`,
      summary: "Analysis of the twelve links",
      quantum: ["Dependent Origination", "Entanglement", "Causation"][i % 3]
    }))
  },
  {
    number: 27,
    title: "Examination of Views",
    verseCount: 30,
    summary: "The final chapter examines all views and their emptiness.",
    quantumSummary: "Complementarity and the limits of knowledge parallel the examination of views.",
    verses: Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      title: `Verse ${i + 1}: Views Analysis`,
      summary: "Analysis of views",
      quantum: ["Complementarity", "Measurement", "Observer Effect", "Emptiness"][i % 4]
    }))
  }
];

// Generate chapter page template
function generateChapterPage(chapter) {
  const versesJson = JSON.stringify(chapter.verses, null, 2)
    .replace(/"/g, "'")
    .replace(/\n/g, '\n    ');

  return `/**
 * Chapter ${chapter.number}: ${chapter.title}
 * Auto-generated with 3D visualization support
 */

import React from 'react';
import ChapterPage from '../components/ChapterPage';

const chapterInfo = {
  number: ${chapter.number},
  title: '${chapter.title.replace(/'/g, "\\'")}',
  verseCount: ${chapter.verseCount},
  summary: '${chapter.summary.replace(/'/g, "\\'")}',
  quantumSummary: '${chapter.quantumSummary.replace(/'/g, "\\'")}'
};

const verses = ${versesJson};

export default function Chapter${chapter.number}() {
  return <ChapterPage chapterInfo={chapterInfo} verses={verses} />;
}
`;
}

// Main execution
async function main() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  
  console.log('Generating chapter pages with 3D visualizations...\n');
  
  let totalVerses = 0;
  
  for (const chapter of CHAPTERS) {
    const filename = `chapter-${chapter.number}.jsx`;
    const filepath = path.join(pagesDir, filename);
    const content = generateChapterPage(chapter);
    
    fs.writeFileSync(filepath, content);
    totalVerses += chapter.verseCount;
    
    console.log(`✓ Generated ${filename} (${chapter.verseCount} verses)`);
  }
  
  console.log(`\n✅ Generated ${CHAPTERS.length} chapter pages with ${totalVerses} total verses`);
  console.log('All chapters now use the new ChapterPage component with 3D visualizations');
}

main().catch(console.error);
