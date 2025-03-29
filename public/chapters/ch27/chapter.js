/**
 * Chapter 27: Investigation of Views
 * This file imports shared components and implements chapter-specific logic
 */
import { initRenderer, BaseAnimation } from '../../common/base.js';
import { initUI } from '../../common/ui.js';
import { verses, colors } from './config.js';
import { animations } from './animations.js';

// Track current state
let renderer, currentAnimation, currentVerseIndex = 0;
let ui;

/**
 * Initialize the chapter
 */
function init() {
  // Get canvas element
  const canvas = document.getElementById('canvas');
  
  // Initialize renderer using shared function
  renderer = initRenderer(canvas);
  
  // Initialize UI with shared components
  ui = initUI();
  
  // Create verse buttons and set callback
  ui.createVerseButtons(verses, (index) => {
    updateVerse(index);
  });
  
  // Add navigation event listeners
  setupNavigation();
  
  // Load initial verse
  updateVerse(0);
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
}

/**
 * Setup navigation event listeners
 */
function setupNavigation() {
  const prevButton = document.getElementById('prev-verse');
  const nextButton = document.getElementById('next-verse');
  
  prevButton.addEventListener('click', () => {
    if (currentVerseIndex > 0) {
      updateVerse(currentVerseIndex - 1);
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentVerseIndex < verses.length - 1) {
      updateVerse(currentVerseIndex + 1);
    }
  });
}

/**
 * Update the current verse
 * @param {number} index - Index of the verse to display
 */
function updateVerse(index) {
  // Update state
  currentVerseIndex = index;
  const verse = verses[index];
  
  // Update UI content using shared UI module
  ui.updateVerse(verse, index, verses.length);
  
  // Clean up previous animation
  if (currentAnimation) {
    try {
      currentAnimation.dispose();
    } catch (error) {
      console.warn("Error disposing animation:", error);
    }
  }
  
  // Create new animation
  try {
    // Create animation using the factory from animations.js
    currentAnimation = animations.createAnimation(verse.animation, renderer, verse);
  } catch (error) {
    console.error("Error creating animation:", error);
    currentAnimation = null;
  }
  
  // Force resize to update camera aspect ratio
  onWindowResize();
}

/**
 * Handle window resize
 */
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  if (currentAnimation) {
    currentAnimation.onWindowResize();
  }
}

/**
 * Animation loop
 */
function animate() {
  requestAnimationFrame(animate);
  
  if (currentAnimation) {
    try {
      currentAnimation.animate();
      currentAnimation.render();
    } catch (error) {
      console.error("Animation error:", error);
    }
  }
}

// Initialize when document is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 