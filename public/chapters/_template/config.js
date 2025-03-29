import { defaultColors } from '../../common/config.js';

// Chapter-specific color palette
export const colors = {
  verse1: {
    primary: '#5e60ce',
    secondary: '#64dfdf'
  },
  verse2: {
    primary: '#5e60ce',
    secondary: '#64dfdf'
  }
  // Add more verse-specific colors as needed
};

// Verse data for the chapter
export const verses = [
  {
    number: 1,
    text: "Verse text goes here",
    madhyamaka: "Madhyamaka explanation",
    quantum: "Quantum physics parallel",
    accessible: "Accessible explanation",
    title: "Verse Title",
    animation: "animation1" // Maps to animation implementation
  },
  {
    number: 2,
    text: "Second verse text",
    madhyamaka: "Madhyamaka explanation for verse 2",
    quantum: "Quantum physics parallel for verse 2",
    accessible: "Accessible explanation for verse 2",
    title: "Second Verse Title",
    animation: "animation2" // Maps to animation implementation
  }
  // Add more verses as needed
]; 