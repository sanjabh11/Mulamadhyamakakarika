/**
 * Chapter Template: Configuration
 * Replace placeholder data with chapter-specific details.
 */
import { defaultColors } from '../../common/config.js'; // Import if needed

// Chapter-specific color palette
// Define the colors used in this chapter's animations and styles.css variables.
export const colors = {
  // Example verse color definition (use consistent keys like verseN)
  verse1: {
    primary: '#aabbcc', // Replace with actual primary color
    secondary: '#ddeeff' // Replace with actual secondary color
  },
  verse2: {
    primary: '#ffddaa',
    secondary: '#aa8866'
  },
  // Add more verses as needed
  defaultVerse: { // Optional: fallback colors
      primary: '#cccccc',
      secondary: '#eeeeee'
  }
};

// Verse data for the chapter
// Replace with actual verse details. Ensure 'animation' key matches a case
// in the animations.js factory.
export const verses = [
  {
    number: 1, // Verse number
    text: "Placeholder text for verse 1.", // Original text
    madhyamaka: "Placeholder Madhyamaka interpretation.", // Interpretation 1
    quantum: "Placeholder Quantum interpretation.", // Interpretation 2
    accessible: "Placeholder Accessible explanation.", // Interpretation 3
    title: "Placeholder Verse Title 1", // Verse title
    animation: "placeholderAnimation1" // Matches a key in animations.js factory
  },
  {
    number: 2,
    text: "Placeholder text for verse 2.",
    madhyamaka: "Placeholder Madhyamaka interpretation.",
    quantum: "Placeholder Quantum interpretation.",
    accessible: "Placeholder Accessible explanation.",
    title: "Placeholder Verse Title 2",
    animation: "placeholderAnimation2" // Matches another key
  }
  // Add more verse objects as needed
];