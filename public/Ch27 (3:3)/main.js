import * as THREE from 'three';
import { verses } from './config.js';
import { createAnimation } from './animations.js';

// DOM elements
const canvas = document.getElementById('canvas');
const verseText = document.getElementById('verse-text');
const verseNumber = document.getElementById('verse-number');
const madhyamakaText = document.getElementById('madhyamaka-text');
const quantumText = document.getElementById('quantum-text');
const accessibleText = document.getElementById('accessible-text');
const prevButton = document.getElementById('prev-verse');
const nextButton = document.getElementById('next-verse');
const togglePanelButton = document.getElementById('toggle-panel');
const textPanel = document.getElementById('text-panel');
const verseButtonsContainer = document.getElementById('verse-buttons');

// UI elements for new collapsible sections
const explanationHeader = document.getElementById('explanation-header');
const explanationContent = document.getElementById('explanation-content');
const controlsHeader = document.getElementById('controls-header');
const controlsContent = document.getElementById('controls-content');

// Initialize scene
let renderer, currentAnimation;
let currentVerseIndex = 0;

function init() {
  // Create renderer with specific parameters
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Load initial verse
  updateVerse(0);
  
  // Add event listeners
  window.addEventListener('resize', onWindowResize);
  
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
  
  togglePanelButton.addEventListener('click', () => {
    textPanel.classList.toggle('collapsed');
    if (textPanel.classList.contains('collapsed')) {
      togglePanelButton.querySelector('.arrow').textContent = '▶';
    } else {
      togglePanelButton.querySelector('.arrow').textContent = '◀';
    }
  });
  
  // Add collapsible section functionality
  explanationHeader.addEventListener('click', () => {
    explanationContent.classList.toggle('collapsed');
    explanationHeader.querySelector('.toggle-icon').classList.toggle('collapsed');
    explanationHeader.querySelector('.toggle-icon').textContent = 
      explanationContent.classList.contains('collapsed') ? '▶' : '▼';
  });
  
  controlsHeader.addEventListener('click', () => {
    controlsContent.classList.toggle('collapsed');
    controlsHeader.querySelector('.toggle-icon').classList.toggle('collapsed');
    controlsHeader.querySelector('.toggle-icon').textContent = 
      controlsContent.classList.contains('collapsed') ? '▶' : '▼';
  });
  
  // Add verse buttons
  createVerseButtons();
  
  // Start animation loop
  animate();
}

function createVerseButtons() {
  verseButtonsContainer.innerHTML = '';
  
  verses.forEach((verse, index) => {
    const button = document.createElement('button');
    button.classList.add('verse-button');
    button.textContent = verse.number;
    button.setAttribute('title', `Verse ${verse.number}: ${verse.title}`);
    
    if (index === currentVerseIndex) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', () => {
      updateVerse(index);
    });
    
    verseButtonsContainer.appendChild(button);
  });
}

function updateVerse(index) {
  currentVerseIndex = index;
  const verse = verses[index];
  
  // Update UI content
  verseNumber.textContent = `Verse ${verse.number}`;
  verseText.textContent = verse.text;
  madhyamakaText.textContent = verse.madhyamaka;
  quantumText.textContent = verse.quantum;
  accessibleText.textContent = verse.accessible;
  
  // Update navigation buttons
  prevButton.disabled = index === 0;
  nextButton.disabled = index === verses.length - 1;
  
  // Update verse buttons
  const verseButtons = document.querySelectorAll('.verse-button');
  verseButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === index) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Make sure the panel is visible when changing verses
  if (textPanel.classList.contains('collapsed') && window.innerWidth > 768) {
    textPanel.classList.remove('collapsed');
    togglePanelButton.querySelector('.arrow').textContent = '◀';
  }
  
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
    currentAnimation = createAnimation(verse.animation, renderer, verse);
  } catch (error) {
    console.error("Error creating animation:", error);
    currentAnimation = null;
  }
  
  // Force resize to update camera aspect ratio
  onWindowResize();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  if (currentAnimation) {
    currentAnimation.onWindowResize();
  }
}

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

// Initialize application
init();