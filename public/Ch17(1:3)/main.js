import { verses, colors, animation } from './config.js';
import { initVerse1 } from './animations/verse1.js';
import { initVerse2 } from './animations/verse2.js';
import { initVerse3 } from './animations/verse3.js';
import { initVerse4 } from './animations/verse4.js';
import { initVerse5 } from './animations/verse5.js';
import { initVerse6 } from './animations/verse6.js';
import { initVerse7 } from './animations/verse7.js';
import { initVerse8 } from './animations/verse8.js';
import { initVerse9 } from './animations/verse9.js';
import { initVerse10 } from './animations/verse10.js';
import { initVerse11 } from './animations/verse11.js';

let currentVerse = 1;
let currentAnimation = null;
let resizeTimeout;

const verseInitializers = [
    initVerse1, initVerse2, initVerse3, initVerse4, initVerse5,
    initVerse6, initVerse7, initVerse8, initVerse9, initVerse10, initVerse11
];

function updateVerseContent(verse) {
    document.querySelector('.verse-text').textContent = `Verse ${verse.number}: ${verse.text}`;
    document.querySelector('.madhyamaka-concept').textContent = `Madhyamaka Concept: ${verse.madhyamakaConcept}`;
    document.querySelector('.quantum-parallel').textContent = `Quantum Physics Parallel: ${verse.quantumParallel}`;
    document.querySelector('.accessible-explanation').textContent = `Accessible Explanation: ${verse.accessibleExplanation}`;
    document.getElementById('verse-indicator').textContent = `Verse ${verse.number}/${verses.length}`;
    
    // Update navigation buttons
    document.getElementById('prev-verse').disabled = verse.number === 1;
    document.getElementById('next-verse').disabled = verse.number === verses.length;
}

function loadVerse(verseNumber) {
    // Clean up current animation if exists
    if (currentAnimation && currentAnimation.cleanup) {
        currentAnimation.cleanup();
    }
    
    // Clear animation container
    const container = document.getElementById('animation-canvas');
    container.innerHTML = '';
    
    // Clear interaction controls
    const interactionControls = document.querySelector('.interaction-controls');
    interactionControls.innerHTML = '';
    
    // Load new animation
    const index = verseNumber - 1;
    currentVerse = verseNumber;
    
    if (verseInitializers[index]) {
        currentAnimation = verseInitializers[index](container, interactionControls);
        updateVerseContent(verses[index]);
    }
}

function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (currentAnimation && currentAnimation.resize) {
            currentAnimation.resize();
        }
    }, 250);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with first verse
    loadVerse(1);
    
    // Set up event listeners
    document.getElementById('prev-verse').addEventListener('click', () => {
        if (currentVerse > 1) {
            loadVerse(currentVerse - 1);
        }
    });
    
    document.getElementById('next-verse').addEventListener('click', () => {
        if (currentVerse < verses.length) {
            loadVerse(currentVerse + 1);
        }
    });
    
    document.getElementById('toggle-text').addEventListener('click', () => {
        const button = document.getElementById('toggle-text');
        const container = document.querySelector('.controls-container');
        
        if (container.classList.contains('text-hidden')) {
            container.classList.remove('text-hidden');
            button.textContent = 'Hide Text';
        } else {
            container.classList.add('text-hidden');
            button.textContent = 'Show Text';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});