/**
 * Chapter Template: Logic Loader
 * This file imports shared components and implements chapter-specific logic
 */
import { initRenderer, BaseAnimation } from '../../common/base.js';
import { initUI } from '../../common/ui.js';
// Import chapter-specific config and animations
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

  // Check if buttons exist before adding listeners
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentVerseIndex > 0) {
        updateVerse(currentVerseIndex - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentVerseIndex < verses.length - 1) {
        updateVerse(currentVerseIndex + 1);
      }
    });
  }
}

/**
 * Update the current verse
 * @param {number} index - Index of the verse to display
 */
function updateVerse(index) {
  // Update state
  currentVerseIndex = index;
  const verse = verses[index];

  // Clean up previous animation FIRST
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
    currentAnimation = null; // Ensure animation is null if creation fails
  }

  // Update UI content using shared UI module, PASSING the new animation instance
  ui.updateVerse(verse, index, verses.length, currentAnimation);


  // Force resize to update camera aspect ratio
  onWindowResize();
}

/**
 * Handle window resize
 */
function onWindowResize() {
  if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
  }

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
      // Optional: Stop animation or handle error gracefully
      // currentAnimation = null;
    }
  }
}

// Initialize when document is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}